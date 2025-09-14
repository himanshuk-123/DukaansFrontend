import api from './api'

const Categories = {
    getAllCategories: () =>{
        const res = api.get(`/categories`);
        return res;
    }
}

export default Categories