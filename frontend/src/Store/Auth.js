import { toast } from 'react-toastify';
import { create } from 'zustand';

const useAuthStore = create((set) => ({
  // Load token from sessionStorage or localStorage on app start
  token:
    sessionStorage.getItem('UserToken') ||
    localStorage.getItem('UserToken') ||
    null,

  setToken: (newToken, rememberMe) => {
    set({ token: newToken });

    if (rememberMe) {
      localStorage.setItem('UserToken', newToken); // Save in localStorage
      sessionStorage.removeItem('UserToken'); // Remove from sessionStorage to prevent conflicts
    } else {
      sessionStorage.setItem('UserToken', newToken); // Store in sessionStorage (clears on tab close)
      localStorage.removeItem('UserToken'); // Ensure it's not stored permanently
    }
  },

  logout: () => {
    set({ token: null });
    sessionStorage.removeItem('UserToken'); // Clear temporary session storage
    localStorage.removeItem('UserToken'); // Clear persistent storage
    toast.info('Logged out successfully');
  },
}));

export default useAuthStore;
