import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'react-toastify';

const useProductStore = create((set) => ({
  product: null,
  productList: [],
  processData: null,
  loading: false,
  error: null,
  isLoading: false,
  err: true,
  fetchProduct: async (id) => {
    set({ loading: true, error: null });

    try {
      const response = await axios.get(
        `http://localhost:3000/api/product/${id}`
      );
      set({ product: response.data, error: null, loading: false });
    } catch (error) {
      console.error('Error fetching product:', error);
      set({ product: null, error: error.message, loading: false });
    }
  },

  updateProduct: async (updatedData, clearMessage = false, token) => {
    try {
      const formData = new FormData();

      if (clearMessage) {
        updatedData.confirmMessage = '';
      }

      for (const key in updatedData) {
        if (Array.isArray(updatedData[key])) {
          updatedData[key].forEach((item) => {
            formData.append(key, item);
          });
        } else {
          formData.append(key, updatedData[key]);
        }
      }

      const response = await axios.post(
        `http://localhost:3000/api/product/${updatedData._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
    } catch (error) {
      console.error(
        'Error updating product:',
        error.response?.data || error.message
      );
    }
  },

  getAllProd: async (id) => {
    try {
      if (!id) return;

      set({ isLoading: true, err: null });

      const categoryId = typeof id === 'object' && id !== null ? id._id : id;

      const response = await axios.get(
        `http://localhost:3000/api/product/?category=${categoryId.toString()}`
      );

      const data = response.data.data;

      set({
        productList: data,
        isLoading: false,
        err: null,
      });
    } catch (error) {
      console.error('Error fetching products:', error.message);
      set({ isLoading: false, err: error.message });
    }
  },

  gteProccesOfProduct: async (id, token) => {
    try {
      if (!id) {
        console.warn('ID is undefined, waiting for data...');
        return;
      }

      const response = await axios.get(
        `http://localhost:3000/api/process/getprod/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data.data?.[0];
      set({ processData: data || null });
    } catch (error) {
      console.error('Error fetching products:', error.message);
      set({ processData: null });
    }
  },
}));

export { useProductStore };
