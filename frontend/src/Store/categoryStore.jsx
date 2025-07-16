import { create } from 'zustand';
import axios from 'axios';

const useCategoryStore = create((set, get) => ({
  categories: [],
  loading: false,
  error: null,
  success: false, 

  // get all
  fetchCategories: async () => {
    set({ loading: true, error: null, success: false });
    try {
      const response = await axios.get('http://localhost:3000/api/category/');
      set({ 
        categories: response.data.data, 
        success: response.data.success,
        loading: false 
      });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || error.message, 
        loading: false 
      });
    }
  },
}));

export default useCategoryStore;