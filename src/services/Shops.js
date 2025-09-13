import api from './api'

const Shops = {
    getAllShops: (userLocation, categoryId) => {
        // Add location params if available
        const params = userLocation ? 
            { 
                lat: userLocation.latitude, 
                lng: userLocation.longitude,
                radius: 30000 // Default radius in meters
            } : {};
        
        // Add category filter if provided
        if (categoryId) {
            params.categoryId = categoryId;
        }
        
        console.log('Requesting shops with params:', params);
        const res = api.get(`/shops`, { params });
        return res;
    },
    getShopById: (id) => {
        const res = api.get(`/shops/${id}`);
        return res;
    }
    
}

export default Shops
