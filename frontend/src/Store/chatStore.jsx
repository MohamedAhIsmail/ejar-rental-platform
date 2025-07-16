import axios from 'axios';
import { create } from 'zustand';
import { toast } from 'react-toastify';

const useChatStore = create((set, get) => ({
  userChats: [],
  chatMessages: [],
  chatError: null,
  chatLoading: false,
  messagesError: null,
  messagesLoading: false,
  createChat: async (receiverId, token) => {
    try {
      set({ chatLoading: true, chatError: null });
      const response = await axios.post(
        `http://localhost:3000/api/chat`,
        { receiverId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const chat = response?.data;
      set({ chatLoading: false });
      return chat;
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      set({
        chatError: error.response?.data?.message || error.message,
        chatLoading: false,
      });
    }
  },
  getChatById: async (chatId, token) => {
    try {
      set({ chatLoading: true, chatError: null });
      const response = await axios.get(
        `http://localhost:3000/api/chat/${chatId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const chat = response?.data;
      set({ chatLoading: false });
      return chat;
    } catch (error) {
      set({
        chatError: error.response?.data?.message || error.message,
        chatLoading: false,
      });
    }
  },
  getUserChats: async (token) => {
    try {
      set({ chatLoading: true, chatError: null });
      const response = await axios.get(`http://localhost:3000/api/chat`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const chats = response?.data;
      set({ userChats: chats, chatLoading: false });
    } catch (error) {
      set({
        chatError: error.response?.data?.message || error.message,
        chatLoading: false,
      });
    }
  },
  postMessage: async (message, token) => {
    try {
      set({ messagesLoading: true, messagesError: null });
      await axios.post(`http://localhost:3000/api/message`, message, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ messagesLoading: false });
    } catch (error) {
      set({
        messagesError: error.response?.status || error.message,
        messagesLoading: false,
      });
    }
  },
  getChatMessages: async (chatId, token) => {
    try {
      set({ messagesLoading: true, messagesError: null });
      const response = await axios.get(
        `http://localhost:3000/api/message/${chatId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const messages = response?.data;
      set({ chatMessages: messages, messagesLoading: false });
    } catch (error) {
      set({
        messagesError: error.response?.status || error.message,
        messagesLoading: false,
      });
    }
  },
  setChatMessages: (newMessage) => {
    set((prevState) => ({
      chatMessages: [...prevState.chatMessages, newMessage],
    }));
  },
}));

export default useChatStore;
