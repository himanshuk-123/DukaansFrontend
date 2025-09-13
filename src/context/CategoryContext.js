// import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
// import Categories from '../services/Categories';

// // Initialize the Category Context
// const CategoryContext = createContext();

// // Custom hook to use the category context
// export const useCategory = () => useContext(CategoryContext);

// // Category Provider component
// export const CategoryProvider = ({ children }) => {
//   const [categories, setCategories] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
  
//   // Track the last time we fetched categories to prevent too many calls
//   // const lastFetchTime = useRef(0);
//   // const isFetchingCategories = useRef(false);
  
//   // Minimum time between fetches in milliseconds (10 seconds)
//   // const FETCH_COOLDOWN = 10000;

//   /**
//    * Fetch all categories
//    */
//   // const fetchCategories = async (forceFetch = false) => {
//   //   // Don't allow concurrent fetches
//   //   if (isFetchingCategories.current) {
//   //     console.log('Already fetching categories. Request ignored.');
//   //     return { success: false, message: 'A request is already in progress' };
//   //   }
    
//   //   // Check if we've fetched recently and should throttle
//   //   const now = Date.now();
//   //   const timeSinceLastFetch = now - lastFetchTime.current;
    
//   //   if (!forceFetch && timeSinceLastFetch < FETCH_COOLDOWN && categories.length > 0) {
//   //     console.log(`Recently fetched categories (${timeSinceLastFetch}ms ago). Using cached data.`);
//   //     return { success: true, data: categories };
//   //   }
    
//   //   setIsLoading(true);
//   //   setError(null);
//   //   isFetchingCategories.current = true;
    
//   //   try {
//   //     const response = await Categories.getAllCategories();
//   //     lastFetchTime.current = Date.now();
      
//   //     if (response && response.data) {
//   //       // Check if data is directly the array or nested in a data property
//   //       const categoriesData = Array.isArray(response.data) ? response.data : (response.data.data || []);
//   //       setCategories(categoriesData);
//   //       return { success: true, data: categoriesData };
//   //     } else {
//   //       const errorMessage = 'Invalid response format from API';
//   //       setError(errorMessage);
//   //       return { success: false, message: errorMessage };
//   //     }
//   //   } catch (error) {
//   //     console.error('Error fetching categories:', error);
      
//   //     // Check for rate limit error
//   //     if (error.response?.status === 429) {
//   //       const errorMessage = 'Too many requests. Please try again in a few minutes.';
//   //       setError(errorMessage);
        
//   //       // Don't clear existing categories if we have them
//   //       if (categories.length === 0) {
//   //         setCategories([]);
//   //       }
        
//   //       return { success: false, message: errorMessage, errorCode: 'RATE_LIMIT_EXCEEDED' };
//   //     }
      
//   //     const errorMessage = error.message || 'Failed to fetch categories. Please try again.';
//   //     setError(errorMessage);
//   //     return { success: false, message: errorMessage };
//   //   } finally {
//   //     setIsLoading(false);
//   //     isFetchingCategories.current = false;
//   //   }
//   // };

//   // Context value
//   const value = {
//     categories,
//     isLoading,
//     error,
//     fetchCategories
//   };

//   return (
//     <CategoryContext.Provider value={value}>
//       {children}
//     </CategoryContext.Provider>
//   );
// };
