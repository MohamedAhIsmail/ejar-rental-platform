import axios from 'axios';
import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

const useProfileStore = create((set, get) => ({
  profile: null,
  currentUserId: null,
  loading: false,
  errorStatus: null,
  status: null,
  fetchProfile: async (userId, token) => {
    try {
      set({ loading: true, error: null });
      const response = await axios.get(
        `http://localhost:3000/api/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      set({ profile: response.data.user, loading: false });
    } catch (error) {
      set({
        errorStatus: error.response?.status || error.message,
        loading: false,
      });
    }
  },
  setCurrentUser: (userId) => set({ currentUserId: userId }),
  isEditable: (token) => {
    const { profile } = get();
    if (!token || !profile) return false;
    try {
      const decoded = jwtDecode(token);
      const currentUserId = decoded?.id;
      return profile._id === currentUserId;
    } catch (error) {
      console.error('Error decoding token:', error);
      return false;
    }
  },
  updateProfile: async (userId, token, updatedData) => {
    try {
      set({ loading: true, error: null, status: null });
      console.log(updatedData);
      const response = await axios.put(
        `http://localhost:3000/api/user/${userId}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      toast.success('Profile updated successfully');
      set({
        profile: response.data.user,
        loading: false,
        status: response.status,
      });
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
      set({
        errorStatus: error.response?.status || error.message,
        loading: false,
      });
    }
  },
}));

export default useProfileStore;
