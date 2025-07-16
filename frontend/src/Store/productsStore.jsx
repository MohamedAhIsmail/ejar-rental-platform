import { create } from 'zustand';

const useProductStore = create((set) => ({
  products: [],
  loading: false,
  error: null,

  // main fech from db
  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('http://localhost:3000/api/product/');
      if (!response.ok) throw new Error('Error during fetch!');
      const result = await response.json();
      set({ products: result.data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // fech products from the newest 
  fetchSortedProducts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('http://localhost:3000/api/product/');
      if (!response.ok) throw new Error('Error during fetch!');
      const result = await response.json();
      
      const sortedProducts = result.data.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      set({ products: sortedProducts, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },
}));

export default useProductStore;