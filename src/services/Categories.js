import api from './api'

const Categories = {
    getAllCategories: async () => {
        try {
            const res = await api.get(`/categories`);
            return res;
        } catch (error) {
            console.error('Error in getAllCategories:', error);
            throw error;
        }
    }
}

export default Categories