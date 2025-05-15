<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Notifications for User {{ userId }}</h1>
    
    <!-- Notification List -->
    <div v-if="notifications.length" class="space-y-4">
      <div 
        v-for="notification in notifications" 
        :key="notification.id"
        class="p-4 border rounded-lg shadow-sm"
        :class="{ 'bg-gray-100': notification.isRead }"
      >
        <p class="text-lg">{{ notification.message }}</p>
        <p class="text-sm text-gray-500">
          {{ new Date(notification.createdAt).toLocaleString() }}
        </p>
        <button
          v-if="!notification.isRead"
          @click="markAsRead(notification.id)"
          class="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Mark as Read
        </button>
      </div>
    </div>
    <div v-else class="text-gray-500">
      No notifications available.
    </div>

    <!-- Test Notification Button -->
    <button
      @click="sendTestNotification"
      class="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
    >
      Send Test Notification
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { io } from 'socket.io-client';
import { URL } from '@/auth/url';

// Get userId from route params
const route = useRoute();
const userId = ref(route.params.id);

// Notification state
const notifications = ref([]);

// Socket.io connection
const socket = io(URL, {
  query: { userId: userId.value }
});

// Fetch notifications from backend
const fetchNotifications = async () => {
  try {
    const response = await fetch(URL+`/notification/user/${userId.value}`);
    notifications.value = await response.json();
  } catch (error) {
    console.error('Error fetching notifications:', error);
  }
};

// Mark notification as read
const markAsRead = async (notificationId) => {
  try {
    await fetch(URL+`/notification/${notificationId}/read`, {
      method: 'PATCH'
    });
    // Update local state
    const notification = notifications.value.find(n => n.id === notificationId);
    if (notification) notification.isRead = true;
  } catch (error) {
    console.error('Error marking notification as read:', error);
  }
};

// Send test notification
const sendTestNotification = async () => {
  try {
    await fetch(URL+'/notification/send-test-notification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: Number(userId.value) })
    });
  } catch (error) {
    console.error('Error sending test notification:', error);
  }
};

// Handle incoming notifications via WebSocket
socket.on('notification', (data) => {
  notifications.value.unshift({
    id: Date.now(), // Temporary ID, replace with actual ID from backend if available
    message: data.message,
    isRead: false,
    createdAt: new Date()
  });
});

// Initialize
onMounted(() => {
  fetchNotifications();
});

// Cleanup
onUnmounted(() => {
  socket.disconnect();
});
</script>

<style scoped>
/* Tailwind CSS is used, so no additional styles needed */
</style>