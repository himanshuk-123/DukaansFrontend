import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

// Use a consistent base URL
// Change this to your current IP address when testing
const API_BASE_URL = 'http://192.168.230.184:3000/api';
// For local development, you might want to use:
// const API_BASE_URL = 'http://10.0.2.2:3000/api'; // For Android emulator
// const API_BASE_URL = 'http://localhost:3000/api'; // For iOS simulator

// Log the base URL to help with debugging
console.log('API Base URL:', API_BASE_URL);
const RATE_LIMIT_STORAGE_KEY = 'api_rate_limit_data';
const DEFAULT_RETRY_DELAY = 2000; // 2 seconds (reduced from 5)
const MAX_RETRY_DELAY = 30000; // 30 seconds (reduced from 1 minute)
const MAX_RETRIES = 3;

// Cache settings
const CACHE_STORAGE_PREFIX = 'api_cache_';
const DEFAULT_CACHE_TTL = 2 * 60 * 1000; // 2 minutes (reduced from 5)

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // Add timeout for better error handling
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Add auth token to requests
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Initialize token from storage when app starts
export const initializeToken = async () => {
  try {
    const token = await AsyncStorage.getItem('auth_token');
    if (token) {
      setAuthToken(token);
    }
  } catch (error) {
    console.error('Error loading auth token', error);
  }
};

// Add request interceptor to include token in all requests
api.interceptors.request.use(
  async (config) => {
    // Log the request for debugging
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`, {
      headers: config.headers,
      data: config.data
    });
    
    if (!config.headers.Authorization) {
      const token = await AsyncStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging and error handling
api.interceptors.response.use(
  response => {
    console.log(`API Success [${response.config.method.toUpperCase()} ${response.config.url}]:`, response.status);
    
    // If it's a GET request, cache the response
    if (response.config.method.toLowerCase() === 'get') {
      cacheResponse(response.config.url, response.data);
    }
    
    return response;
  },
  async (error) => {
    console.error('API Error:', error.message);
    
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      
      // Handle 401 Unauthorized errors
      if (error.response.status === 401) {
        // Token expired or invalid
        await AsyncStorage.removeItem('auth_token');
        await AsyncStorage.removeItem('user_data');
        
        // Reset auth header
        setAuthToken(null);
      }
      
      // Handle rate limit errors
      if (error.response.status === 429) {
        console.warn('Rate limit exceeded for request:', error.config.url);
        await saveRateLimitData(error.config.url);
        
        // Return cached data if available for GET requests
        if (error.config.method.toLowerCase() === 'get') {
          const cachedData = await getCachedResponse(error.config.url);
          if (cachedData) {
            console.info('Using cached data due to rate limit');
            return Promise.resolve({
              data: {
                success: true,
                data: cachedData,
                fromCache: true
              },
              status: 200,
              statusText: 'OK (Cached)',
              headers: {},
              config: error.config
            });
          }
        }
      }
    } else if (error.request) {
      console.error('No response received:', error.request);
    }
    
    return Promise.reject(error);
  }
);

// Cache a response
const cacheResponse = async (url, data) => {
  try {
    const cacheKey = `${CACHE_STORAGE_PREFIX}${url}`;
    const cacheData = {
      data,
      timestamp: Date.now(),
      ttl: DEFAULT_CACHE_TTL
    };
    await AsyncStorage.setItem(cacheKey, JSON.stringify(cacheData));
  } catch (error) {
    console.warn('Failed to cache response:', error);
  }
};

// Get cached response
const getCachedResponse = async (url) => {
  try {
    const cacheKey = `${CACHE_STORAGE_PREFIX}${url}`;
    const cachedItem = await AsyncStorage.getItem(cacheKey);
    
    if (cachedItem) {
      const cache = JSON.parse(cachedItem);
      const now = Date.now();
      
      // Check if cache is still valid
      if (now - cache.timestamp < cache.ttl) {
        return cache.data;
      }
    }
    
    return null;
  } catch (error) {
    console.warn('Failed to retrieve cached response:', error);
    return null;
  }
};

// Save rate limit data
const saveRateLimitData = async (endpoint) => {
  try {
    const now = Date.now();
    const data = await AsyncStorage.getItem(RATE_LIMIT_STORAGE_KEY) || '{}';
    const rateLimitData = JSON.parse(data);
    
    // Calculate exponential backoff
    const previousDelay = rateLimitData[endpoint]?.delay || 0;
    const newDelay = previousDelay ? Math.min(previousDelay * 2, MAX_RETRY_DELAY) : DEFAULT_RETRY_DELAY;
    
    rateLimitData[endpoint] = {
      timestamp: now,
      delay: newDelay,
      count: (rateLimitData[endpoint]?.count || 0) + 1
    };
    
    await AsyncStorage.setItem(RATE_LIMIT_STORAGE_KEY, JSON.stringify(rateLimitData));
  } catch (error) {
    console.warn('Failed to save rate limit data:', error);
  }
};

// Check if endpoint is rate limited
export const isRateLimited = async (endpoint) => {
  try {
    const data = await AsyncStorage.getItem(RATE_LIMIT_STORAGE_KEY) || '{}';
    const rateLimitData = JSON.parse(data);
    const endpointData = rateLimitData[endpoint];
    
    if (!endpointData) return false;
    
    const now = Date.now();
    const timeSinceLastHit = now - endpointData.timestamp;
    
    // Check if we're still within the cooldown period
    if (timeSinceLastHit < endpointData.delay) {
      const remainingTime = Math.ceil((endpointData.delay - timeSinceLastHit) / 1000);
      console.warn(`Rate limited for ${endpoint}. Try again in ${remainingTime} seconds.`);
      return {
        limited: true,
        remainingTime,
        retryAfter: new Date(now + (endpointData.delay - timeSinceLastHit))
      };
    }
    
    return false;
  } catch (error) {
    console.warn('Failed to check rate limit status:', error);
    return false;
  }
};

export { api };
export default api;