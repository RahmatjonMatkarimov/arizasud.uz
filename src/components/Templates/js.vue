<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Notification Dashboard</h1>

    <!-- Connection Status -->
    <div class="mb-4 p-4 bg-blue-100 rounded">
      <p>Connection Status: <span :class="isConnected ? 'text-green-600' : 'text-red-600'">{{ isConnected ? 'Connected' : 'Disconnected' }}</span></p>
    </div>

    <!-- Notifications -->
    <div class="mb-4 p-4 bg-yellow-100 rounded">
      <h2 class="text-lg font-semibold">Notifications (Unread: {{ unreadCount }})</h2>
      <button @click="getNotifications" class="bg-blue-500 text-white px-4 py-2 rounded mr-2">Refresh Notifications</button>
      <button @click="markAllAsRead" class="bg-green-500 text-white px-4 py-2 rounded">Mark All as Read</button>
      <ul class="mt-2">
        <li v-for="notification in notifications" :key="notification.id" class="p-2 border-b">
          {{ notification.message }} ({{ formatDate(notification.sentAt) }})
          <button @click="markAsRead(notification.id)" class="text-blue-500 ml-2">Mark as Read</button>
        </li>
      </ul>
    </div>

    <!-- Send Notification -->
    <div class="mb-4 p-4 bg-green-100 rounded">
      <h2 class="text-lg font-semibold">Send Notification</h2>
      <input v-model="notificationMessage" type="text" placeholder="Notification message" class="border p-2 mr-2" />
      <button @click="sendNotification" class="bg-blue-500 text-white px-4 py-2 rounded">Send to All</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { io } from 'socket.io-client';
import { format } from 'date-fns';
import { URL } from '@/auth/url';

// State
const isConnected = ref(false);
const notifications = ref([]);
const unreadCount = ref(0);
const notificationMessage = ref('');

// Socket instance
const socketURL = URL || 'http://localhost:3000';

const socket = io(socketURL, {
  path: '/socket.io',
  transports: ['websocket', 'polling'],
  auth: {
    userId: parseInt(localStorage.getItem('id')) || 1,
  },
});

// Date formatting
const formatDate = (date) => {
  return date ? format(new Date(date), 'yyyy-MM-dd HH:mm:ss') : '';
};

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

  socket.on('notification', (message) => {
    notifications.value.unshift({ id: Date.now(), message, sentAt: new Date() });
  });
  
  socket.on('newNotification', () => {
    getUnreadCount();
  });

  socket.on('unreadCount', (count) => {
    unreadCount.value = count;
  });

  socket.on('error', (message) => {
    console.error('Socket Error:', message);
  });

  socket.on('notificationMarkedAsRead', (notificationId) => {
    notifications.value = notifications.value.filter((n) => n.id !== notificationId);
    getUnreadCount();
  });

  socket.on('allNotificationsMarkedAsRead', ({ count }) => {
    notifications.value = [];
    unreadCount.value = 0;
    console.log(`Marked ${count} notifications as read`);
  });

  socket.on('notifyAllSuccess', ({ message, count }) => {
    console.log(`Notification sent to ${count} users: ${message}`);
  });
};

// Notification handlers
const getNotifications = () => {
  const userId = parseInt(localStorage.getItem('id')) || 1;
  socket.emit('getNotifications', userId, (response) => {
    notifications.value = response || [];
  });
};

const markAsRead = (notificationId) => {
  socket.emit('markAsRead', notificationId);
};

const markAllAsRead = () => {
  socket.emit('markAllAsRead');
};

const getUnreadCount = () => {
  const userId = parseInt(localStorage.getItem('id')) || 1;
  socket.emit('getUnreadCount', userId);
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

// Lifecycle hooks
onMounted(() => {
  setupSocketListeners();
  getNotifications();
  getUnreadCount();
});

onUnmounted(() => {
  socket.disconnect();
});
</script>

<style scoped>
/* Add Tailwind CSS or custom styles if needed */
</style>