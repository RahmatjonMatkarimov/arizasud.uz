import axios from "axios";
import { io } from "socket.io-client";
import { URL } from "@/auth/url.js";

const API_URL = `${URL}/messages`;

export const socket = io(URL, {
  path: '/socket.io',
  transports: ['websocket', 'polling'],
  withCredentials: true,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  timeout: 20000,
  auth: { userId: localStorage.getItem('id') },
});

export const getMessages = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    return [];
  }
};

export const loadMessages = async () => {
  try {
    return await getMessages();
  } catch (error) {
    console.error("Failed to load messages:", error);
    return [];
  }
};

export const onNewMessage = (callback) => {
  socket.on("newMessage", (message) => {
    console.log("Received new message:", message);
    callback(message);
  });
};

export const markAsRead = async (id) => {
  try {
    await axios.put(`${API_URL}/${id}/read`);
  } catch (error) {
    console.error("Failed to mark message as read:", error);
  }
};