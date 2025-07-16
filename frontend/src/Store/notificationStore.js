import { create } from 'zustand';
import axios from 'axios';

const useNotificationStore = create((set, get) => ({
  notifications: [],
  hasUnread: false,
  isLoading: false,
  error: null,

  // Fetch unread notifications
  fetchNotifications: async (token) => {
    if (!token) return;

    set({ isLoading: true });
    try {
      const response = await axios.get(
        `http://localhost:3000/api/notification`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        set({
          notifications: response.data.notifications,
          hasUnread: response.data.notifications.length > 0,
          isLoading: false,
          error: null,
        });
        return response.data.notifications;
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      set({
        isLoading: false,
        error: error.message || 'Failed to fetch notifications',
      });
    }
  },

  // Mark notification as read
  markAsRead: async (notificationId, token) => {
    if (!token) return;

    try {
      // Check if the notification is from socket (has temp ID) or database (has MongoDB ID)
      const notification = get().notifications.find(
        (n) => n._id === notificationId
      );

      // If it's a temporary ID (from socket), just remove it from the local state
      if (notification && notification.isTemp) {
        set((state) => {
          const updatedNotifications = state.notifications.filter(
            (n) => n._id !== notificationId
          );
          return {
            notifications: updatedNotifications,
            hasUnread: updatedNotifications.length > 0,
          };
        });
        return;
      }

      // Otherwise, it's a database notification, so call the API
      await axios.patch(
        `http://localhost:3000/api/notification/${notificationId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state
      set((state) => {
        const updatedNotifications = state.notifications.filter(
          (n) => n._id !== notificationId
        );
        return {
          notifications: updatedNotifications,
          hasUnread: updatedNotifications.length > 0,
        };
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      set({ error: error.message || 'Failed to mark notification as read' });
    }
  },

  // Add new notification (used when receiving real-time notification)
  addNotification: (notification) => {
    // Add required fields for socket notifications
    const notificationWithData = {
      ...notification,
      createdAt: notification.createdAt || new Date().toISOString(),
      isTemp: notification.isTemp !== undefined ? notification.isTemp : true, // Mark as temporary if not specified
    };

    set((state) => ({
      notifications: [notificationWithData, ...state.notifications],
      hasUnread: true,
    }));
  },

  // Clear all notifications
  clearNotifications: () => {
    set({ notifications: [], hasUnread: false });
  },
}));

export default useNotificationStore;
