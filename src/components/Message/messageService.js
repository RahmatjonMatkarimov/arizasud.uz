import axios from "axios";
import { io } from "socket.io-client";
import { URL } from "@/auth/url.js";

const API_URL = `${URL}/messages`;

export const socket = io('http://localhost:3000', {
  path: '/messages',
  transports: ['websocket'], // O'ZGARTIRISH: Faqat WebSocket ishlatiladi
  withCredentials: true,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  timeout: 20000,
  auth: { userId: localStorage.getItem('id') },
});

export const getMessages = async () => {
  try {
    console.log('Xabarlarni olish:', API_URL); // YANGI: Debug log
    const response = await axios.get(API_URL);
    console.log('Xabarlar olindi:', response.data); // YANGI: Debug log
    return response.data;
  } catch (error) {
    console.error("Xabarlarni olishda xato:", error);
    return [];
  }
};

export const loadMessages = async () => {
  try {
    return await getMessages();
  } catch (error) {
    console.error("Xabarlarni yuklashda xato:", error);
    return [];
  }
};

export const onNewMessage = (callback) => {
  socket.off('newMessage'); // O'ZGARTIRISH: Dublikat tinglovchilarni oldini olish
  socket.on("newMessage", (message) => {
    console.log("Socket.IO orqali yangi xabar qabul qilindi:", message); // YANGI: Debug log
    callback(message);
  });
};

export const markAsRead = async (id) => {
  try {
    console.log('Xabar o‘qildi deb belgilandi:', id); // YANGI: Debug log
    await axios.put(`${API_URL}/${id}/read`);
  } catch (error) {
    console.error("Xabarni o‘qildi deb belgilashda xato:", error);
  }
};