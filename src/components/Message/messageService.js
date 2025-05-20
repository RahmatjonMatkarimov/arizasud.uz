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

  // Handle any errors from the server
  socket.on('error', (error) => {
    console.error('Serverdan xato xabari:', error);
    alert(error); // Show error to user
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

// Listen for updated messages
export const updateMessage = (callback) => {
  if (!socket) return;
  
  socket.off('messageUpdated'); // Prevent duplicate listeners
  socket.on("messageUpdated", (message) => {
    console.log("Socket.IO orqali yangilangan xabar qabul qilindi:", message);
    callback(message);
  });
};

// Listen for deleted messages
export const deleteMessage = (callback) => {
  if (!socket) return;
  
  socket.off('messageDeleted'); // Prevent duplicate listeners
  socket.on("messageDeleted", (data) => {
    console.log("Socket.IO orqali o'chirilgan xabar ma'lumoti qabul qilindi:", data);
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
// Mark messages as read
export const markAllAsRead = async () => {
  try {
    const userId = localStorage.getItem('id');
    if (!userId) return;
    
    console.log('Barcha xabarlar o\'qildi deb belgilandi');
    await axios.put(`${API_URL}/${userId}/read`);
    
    // Also emit through socket for real-time updates
    if (socket) {
      socket.emit('markAsRead', parseInt(userId));
    }
  } catch (error) {
    console.error("Xabarlarni o'qildi deb belgilashda xato:", error);
  }
};

// Mark specific message as read (you might not need this for group chat)
export const markAsRead = async (id) => {
  try {
    console.log('Xabar o\'qildi deb belgilandi:', id);
    await axios.put(`${API_URL}/${id}/read`);
  } catch (error) {
    console.error("Xabarni o'qildi deb belgilashda xato:", error);
  }
};

// Send a message
export const sendMessage = async (messageData) => {
  try {
    // For simple messages without files, use socket
    if (!messageData.file) {
      console.log('Socket orqali xabar yuborilmoqda:', messageData);
      if (socket && socket.connected) {
        return new Promise((resolve) => {
          socket.emit('sendMessage', messageData, (response) => {
            if (response && (response.id || response.success === true)) {
              console.log('Xabar socket orqali muvaffaqiyatli yuborildi');
              resolve(response);
            } else if (response && response.success === false) {
              console.warn('Socket bilan yuborishda muammo:', response.error);
              fallbackHttpSendMessage(messageData).then(resolve);
            } else {
              console.warn('Socket bilan yuborishda nomalum javob, HTTP usulini sinab ko\'rilmoqda');
              fallbackHttpSendMessage(messageData).then(resolve);
            }
          });
          
          // Add timeout to fall back to HTTP if socket doesn't respond
          setTimeout(() => {
            console.warn('Socket javob bermayapti, HTTP usulini sinab ko\'rilmoqda');
            fallbackHttpSendMessage(messageData).then(resolve);
          }, 3000);
        });
      }
    }
    
    // For messages with files or if socket is not available, use HTTP
    return await fallbackHttpSendMessage(messageData);
  } catch (error) {
    console.error("Xabar yuborishda xato:", error);
    return null;
  }
};

// Fallback HTTP method for sending messages
const fallbackHttpSendMessage = async (messageData) => {
  try {
    console.log('HTTP orqali xabar yuborilmoqda:', messageData);
    const formData = new FormData();
    
    if (messageData.file) {
      formData.append('file', messageData.file);
    }
    
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
    console.log('Xabar HTTP orqali muvaffaqiyatli yuborildi');
    return response.data;
  } catch (error) {
    console.error("HTTP orqali xabar yuborishda xato:", error);
    return null;
  }
};