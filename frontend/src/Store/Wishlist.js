import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'react-toastify';

const useWishlistStore = create((set, get) => ({
  wishlist: [],
  count: 0,

  fetchWishlist: async (token) => {
    try {
      const res = await axios.get('http://localhost:3000/api/wishlist', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const wishlist = res.data.wishlist.map((item) => ({
        ...item,
        id: item._id,
        review: item.review || [], // prevent undefined access
      }));
      set({ wishlist, count: wishlist.length });
    } catch (err) {
      toast.error('Failed to fetch wishlist');
      throw err; // rethrow to let the component handle it

    }
  },

  addToWishlist: async (product, token) => {
    const productId = product.id || product._id;
    try {
      await axios.post(
        `http://localhost:3000/api/wishlist/add/${productId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updated = [...get().wishlist, { ...product, id: productId }];
      set({ wishlist: updated, count: updated.length });
      toast.success('Product added to wishlist');
    } catch (err) {
      toast.error('Failed to add to wishlist');
    }
  },

  removeFromWishlist: async (productId, token) => {
    try {
      await axios.delete(`http://localhost:3000/api/wishlist/remove/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updated = get().wishlist.filter((item) => item.id !== productId);
      set({ wishlist: updated, count: updated.length });
      toast.info('Product removed from wishlist');
    } catch (err) {
      toast.error('Failed to remove from wishlist');
    }
  },

  clearWishlist: async (token) => {
    try {
      await axios.delete(`http://localhost:3000/api/wishlist/clear`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ wishlist: [], count: 0 });
      toast.info('Wishlist cleared');
    } catch (err) {
      toast.error('Failed to clear wishlist');
    }
  },

  isWishlisted: (productId) => {
    return get().wishlist.some((item) => item.id === productId);
  },
}));

export default useWishlistStore;
