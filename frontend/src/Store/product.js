import axios from 'axios';
import { toast } from 'react-toastify';
import { create } from 'zustand';

const useProductStore = create((set, get) => ({
  userProducts: [],
  error: null,
  loading: false,
  postProduct: async (token, productData) => {
    try {
      set({ loading: true, error: null });
      const response = await axios.post(
        `http://localhost:3000/api/product`,
        productData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      toast.success(
        `Product posted successfully\n Wait for the admin to approve it`
      );
      console.log(response.data.product.name);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      set({ error: error.response?.data?.message || error.message });
    }
  },
  getUserProducts: async (token, userId) => {
    try {
      set({ loading: true, error: null });
      const response = await axios.get(`http://localhost:3000/api/product`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const allProducts = response?.data?.data;
      const userProducts = allProducts.filter(
        (product) => product.renterId._id === userId
      );
      set({ userProducts, loading: false });

      console.log(allProducts);
      console.log(userProducts);
    } catch (error) {
      set({ error: error.response?.data?.message || error.message });
    }
  },

  getUserFinishedProducts: async (token, userId) => {
    try {
      set({ loading: true, error: null });
      const response = await axios.get(
        `http://localhost:3000/api/product/finished`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const allFinishedProducts = response?.data?.data;
      const userProducts = allFinishedProducts.filter(
        (product) => product.renterId._id === userId
      );
      set({ userProducts, loading: false });

      console.log(allFinishedProducts);
      console.log(userProducts);
    } catch (error) {
      set({ error: error.response?.data?.message || error.message });
    }
  },
}));

export default useProductStore;
