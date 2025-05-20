import axios from "axios";
import { io } from "socket.io-client";
import { URL } from "@/auth/url.js";

const API_URL = `${URL}/messages`;

// Initialize socket with user ID from local storage
export const initializeSocket = () => {
  const userId = localStorage.getItem('id');
  
  if (!userId) {
    console.warn('User ID not found in localStorage');
    return null;
  }

  const socket = io(URL, {
    path: '/socket.io',
    transports: ['websocket'],
    withCredentials: true,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    timeout: 20000,
    auth: { userId },
  });

  socket.on('connect', () => {
    console.log('Socket ulanish muvaffaqiyatli');
    // Join the user to the chat room when socket connects
    socket.emit('join', parseInt(userId));
  });

  socket.on('connect_error', (error) => {
    console.error('Socket ulanish xatosi:', error);
  });

  return socket;
};

// Create socket instance
export const socket = initializeSocket();

// Get all messages
export const getMessages = async () => {
  try {
    console.log('Xabarlarni olish:', API_URL);
    const response = await axios.get(API_URL);
    console.log('Xabarlar olindi:', response.data);
    return response.data;
  } catch (error) {
    console.error("Xabarlarni olishda xato:", error);
    return [];
  }
};

// Load messages (same as getMessages for now)
export const loadMessages = async () => {
  try {
    return await getMessages();
  } catch (error) {
    console.error("Xabarlarni yuklashda xato:", error);
    return [];
  }
};

// Get unread messages count for a user
export const getUnreadMessagesCount = async () => {
  try {
    const userId = localStorage.getItem('id');
    if (!userId) return 0;
    
    const response = await axios.get(`${API_URL}/unread/count/${userId}`);
    return response.data.count;
  } catch (error) {
    console.error("O'qilmagan xabarlar sonini olishda xato:", error);
    return 0;
  }
};

// Get unread messages for a user
export const getUnreadMessages = async () => {
  try {
    const userId = localStorage.getItem('id');
    if (!userId) return [];
    
    const response = await axios.get(`${API_URL}/unread/${userId}`);
    return response.data;
  } catch (error) {
    console.error("O'qilmagan xabarlarni olishda xato:", error);
    return [];
  }
};

// Listen for new messages
export const onNewMessage = (callback) => {
  if (!socket) return;
  
  socket.off('newMessage'); // Prevent duplicate listeners
  socket.on("newMessage", (message) => {
    console.log("Socket.IO orqali yangi xabar qabul qilindi:", message);
    callback(message);
  });
};

// Listen for message updates
export const onMessageUpdated = (callback) => {
  if (!socket) return;
  
  socket.off('messageUpdated'); // Prevent duplicate listeners
  socket.on("messageUpdated", (message) => {
    console.log("Socket.IO orqali xabar yangilandi:", message);
    callback(message);
  });
};

// Listen for message deletions
export const onMessageDeleted = (callback) => {
  if (!socket) return;
  
  socket.off('messageDeleted'); // Prevent duplicate listeners
  socket.on("messageDeleted", (data) => {
    console.log("Socket.IO orqali xabar o'chirildi:", data);
    callback(data);
  });
};

// Listen for unread count updates
export const onUnreadCountUpdate = (callback) => {
  if (!socket) return;
  
  socket.off('unreadCount'); // Prevent duplicate listeners
  socket.on("unreadCount", ({ count }) => {
    console.log("O'qilmagan xabarlar soni yangilandi:", count);
    callback(count);
  });
};

// Listen for messages being read
export const onMessagesRead = (callback) => {
  if (!socket) return;
  
  socket.off('messagesRead'); // Prevent duplicate listeners
  socket.on("messagesRead", (data) => {
    console.log("Xabarlar o'qildi:", data);
    callback(data);
  });
};

// Mark messages as read
export const markAllAsRead = async () => {
  try {
    const userId = localStorage.getItem('id');
    if (!userId || !socket) return;
    
    console.log('Barcha xabarlar o\'qildi deb belgilandi');
    socket.emit('markAsRead', parseInt(userId));
  } catch (error) {
    console.error("Xabarlarni o'qildi deb belgilashda xato:", error);
  }
};

// Send a message
export const sendMessage = async (messageData) => {
  try {
    // For messages with files, use HTTP request
    if (messageData.file) {
      console.log('HTTP orqali fayl yuborilmoqda:', messageData);
      const formData = new FormData();
      
      formData.append('file', messageData.file);
      formData.append('senderId', messageData.senderId);
      
      if (messageData.content) {
        formData.append('content', messageData.content);
      }
      
      if (messageData.smileyId) {
        formData.append('smileyId', messageData.smileyId);
      }
      
      if (messageData.replyToMessageId) {
        formData.append('replyToMessageId', messageData.replyToMessageId);
      }
      
      const response = await axios.post(API_URL, formData);
      return response.data;
    }
    
    // For simple messages without files, use socket
    console.log('Socket orqali xabar yuborilmoqda:', messageData);
    if (socket) {
      socket.emit('sendMessage', messageData);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Xabar yuborishda xato:", error);
    return null;
  }
};

// Delete a message using socket
export const deleteMessage = async (messageId) => {
  try {
    if (!socket) return false;
    
    const userId = localStorage.getItem('id');
    if (!userId) return false;
    
    console.log('Socket orqali xabar o\'chirilmoqda:', messageId);
    socket.emit('deleteMessage', { messageId: messageId, userId: parseInt(userId) });
    return true;
  } catch (error) {
    console.error("Xabarni o'chirishda xato:", error);
    return false;
  }
};

// Update a message using socket
export const updateMessage = async (messageId, content) => {
  try {
    if (!socket) return null;
    
    const userId = localStorage.getItem('id');
    if (!userId) return null;
    
    console.log('Socket orqali xabar yangilanmoqda:', messageId);
    socket.emit('updateMessage', { 
      messageId: messageId, 
      content: content,
      userId: parseInt(userId)
    });
    return true;
  } catch (error) {
    console.error("Xabarni yangilashda xato:", error);
    return null;
  }
};