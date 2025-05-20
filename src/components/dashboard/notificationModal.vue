<template>
  <div class="fixed inset-0 bg-black bg-opacity-70 flex justify-end z-40">
    <div class="bg-gray-800 p-5 w-[500px] max-h-screen overflow-y-auto">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-gray-200">{{ dat === 'datakril' ? translateText('Bildirishnomalar') : 'Bildirishnomalar' }}</h2>
        <!-- Notification Type Selector -->
        <div class="flex items-center">
          <select id="notification-type" v-model="selectedNotificationType" class="ml-2 p-1 rounded border border-gray-600 bg-gray-900 text-white">
            <option value="axios">{{ dat === 'datakril' ? translateText('Tizim ichida muhim xabarlar') : 'Tizim ichida muhim xabarlar' }}</option>
            <option value="socket">{{ dat === 'datakril' ? translateText('Bugalteriya bildirishnomalar') : 'Bugalteriya bildirishnomalar' }}</option>
          </select>
        </div>
        <button class="text-2xl text-gray-400 hover:text-gray-300" @click="closeModal">×</button>
      </div>

      <!-- Send Notification -->
      <div v-if="selectedNotificationType === 'socket'" class="p-4 my-4 rounded bg-gray-700 text-white">
        <h2 class="text-lg font-semibold">{{ dat === 'datakril' ? translateText('Bildirishnoma yuborish') : 'Bildirishnoma yuborish' }}</h2>
        <input 
          v-model="notificationMessage" 
          type="text" 
          :placeholder="dat === 'datakril' ? translateText('Bildirishnoma xabari') : 'Bildirishnoma xabari'" 
          class="border border-gray-600 bg-gray-900 text-white p-2 mr-2 rounded w-full placeholder-gray-400" 
        />
        <button 
          @click="sendNotification" 
          class="bg-blue-500 text-white px-4 py-2 rounded mt-2 hover:bg-blue-600"
        >
          {{ dat === 'datakril' ? translateText('Hammaga yuborish') : 'Hammaga yuborish' }}
        </button>
      </div>

      <!-- Notifications List -->
      <div>
        <div v-if="selectedNotificationType === 'socket'">
          <div 
            v-for="notification in socketNotifications" 
            :key="notification.id" 
            class="p-4 mb-2.5 border border-gray-600 border-l-4 border-l-blue-400 bg-gray-700 relative"
          >
            <p class="font-medium my-1 text-gray-200">{{ dat === 'datakril' ? translateText(notification.message) : notification.message }}</p>
            <p class="text-gray-400">{{ formatDate(notification.sentAt) }}</p>
            <button 
              v-if="!notification.isRead" 
              @click="markAsRead(notification.id, 'socket')" 
              class="bg-lime-500 text-black px-2 py-1 absolute bottom-2 right-2 rounded hover:bg-lime-600"
            >
              {{ dat === 'datakril' ? translateText('Tushundim') : 'Tushundim' }}
            </button>
          </div>
        </div>
        <div v-else>
          <div 
            v-for="notification in axiosNotifications" 
            :key="notification.id" 
            class="p-4 mb-2.5 border border-gray-600 relative"
            :class="{
              'border-l-4 border-l-red-500 bg-red-900 bg-opacity-20': notification.urgency === 'Due today!',
              'border-l-4 border-l-amber-500 bg-amber-900 bg-opacity-20': notification.urgency === 'Due tomorrow!',
              'border-l-4 border-l-blue-400 bg-gray-700': !notification.urgency || (notification.urgency !== 'Due today!' && notification.urgency !== 'Due tomorrow!')
            }"
          >
            <p class="font-medium my-1 text-gray-200">{{ dat === 'datakril' ? translateText(notification.message) : notification.message }}</p>
            <p class="text-gray-400">{{ formatDate(notification.createdAt) }}</p>
            <button 
              v-if="!notification.isRead" 
              @click="markAsRead(notification.id, 'axios')" 
              class="bg-lime-500 text-black px-2 py-1 absolute bottom-2 right-2 rounded hover:bg-lime-600"
            >
              {{ dat === 'datakril' ? translateText('Tushundim') : 'Tushundim' }}
            </button>
          </div>
        </div>
        <div v-if="selectedNotifications.length === 0" class="text-center text-gray-400">
          {{ dat === 'datakril' ? translateText('Hozircha bildirishnimalar yoq') : 'Hozircha bildirishnimalar yoq' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, inject } from 'vue';
import axios from 'axios';
import { io } from 'socket.io-client';
import { format } from 'date-fns';
import { URL } from '@/auth/url';
import translateText from '@/auth/Translate';

const dat = inject('dat');
const emit = defineEmits(['close']);
const isConnected = ref(false);
const socketNotifications = ref([]);
const axiosNotifications = ref([]);
const unreadCount = ref(0);
const notificationMessage = ref('');
const selectedNotificationType = ref('axios'); // Default to socket notifications

// Socket instance
const socketURL = URL || 'http://localhost:3000';
const socket = io(socketURL, {
  path: '/socket.io',
  transports: ['websocket', 'polling'],
  auth: {
    userId: parseInt(localStorage.getItem('id')) || 1,
  },
  query: { userId: parseInt(localStorage.getItem('id')).toString() },
});

// Date formatting
const formatDate = (date) => {
  return date ? format(new Date(date), 'yyyy-MM-dd HH:mm:ss') : '';
};

// Computed property for selected notifications
const selectedNotifications = computed(() => {
  return selectedNotificationType.value === 'axios' ? socketNotifications.value : axiosNotifications.value;
});

// Socket event handlers
const setupSocketListeners = () => {
  socket.on('connect', () => {
    isConnected.value = true;
    const userId = parseInt(localStorage.getItem('id')) || 1;
    socket.emit('joinUser', userId);
  });

  socket.on('disconnect', () => {
    isConnected.value = false;
  });

  socket.on('notification', (data) => {
    socketNotifications.value.unshift({
      id: data.id || Date.now(),
      message: data.message,
      sentAt: data.sentAt || data.createdAt || new Date(),
      isRead: data.isRead || false,
    });
    if (!data.isRead) unreadCount.value += 1;
  });

  socket.on('newNotification', () => {
    fetchUnreadCount();
  });

  socket.on('unreadCount', (count) => {
    unreadCount.value = count;
  });

  socket.on('error', (message) => {
    console.error('Socket Error:', message);
  });

  socket.on('notificationMarkedAsRead', (notificationId) => {
    socketNotifications.value = socketNotifications.value.filter((n) => n.id !== notificationId);
    fetchUnreadCount();
  });

  socket.on('allNotificationsMarkedAsRead', ({ count }) => {
    socketNotifications.value = socketNotifications.value.map((n) => ({ ...n, isRead: true }));
    unreadCount.value = 0;
    console.log(`Marked ${count} notifications as read`);
  });

  socket.on('notifyAllSuccess', ({ message, count }) => {
    console.log(`Notification sent to ${count} users: ${message}`);
  });
};

// Notification handlers
const fetchSocketNotifications = () => {
  const userId = parseInt(localStorage.getItem('id')) || 1;
  socket.emit('getNotifications', userId, (response) => {
    socketNotifications.value = response || [];
  });
};

const fetchAxiosNotifications = async () => {
  try {
    const userId = parseInt(localStorage.getItem('id')) || 1;
    const response = await axios.get(`${URL}/accauntant-notification/user/${userId}`);
    axiosNotifications.value = response.data.map((n) => ({
      ...n,
      sentAt: n.createdAt || n.sentAt,
    }));
  } catch (error) {
    console.error('Error fetching axios notifications:', error);
  }
};

const fetchUnreadCount = async () => {
  try {
    const userId = parseInt(localStorage.getItem('id')) || 1;
    const response = await axios.get(`${URL}/accauntant-notification/unread/count?userId=${userId}`);
    unreadCount.value = response.data;
  } catch (error) {
    console.error('Error fetching unread count:', error);
  }
};

const markAsRead = async (notificationId, type) => {
  try {
    if (type === 'axios') {
      await axios.put(`${URL}/accauntant-notification/${notificationId}/read`);
      await fetchAxiosNotifications();
    } else {
      socket.emit('markAsRead', notificationId);
      socketNotifications.value = socketNotifications.value.filter((n) => n.id !== notificationId);
    }
    await fetchUnreadCount();
  } catch (error) {
    console.error('Error marking notification as read:', error);
  }
};

const markAllAsRead = () => {
  socket.emit('markAllAsRead');
};

const sendNotification = () => {
  if (notificationMessage.value) {
    socket.emit('notifyAllUsers', {
      message: notificationMessage.value,
      type: 'REMINDER',
    });
    notificationMessage.value = '';
  }
};

const closeModal = () => {
  emit('close');
};

// Lifecycle hooks
onMounted(() => {
  setupSocketListeners();
  fetchSocketNotifications();
  fetchAxiosNotifications();
  fetchUnreadCount();
});

onUnmounted(() => {
  socket.disconnect();
});
</script>