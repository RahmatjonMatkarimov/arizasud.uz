<template>
  <div @click="closeModal" class="fixed inset-0 bg-black bg-opacity-70 flex justify-end z-40">
    <div @click.stop
      class="dark:bg-gray-800 bg-gray-200 p-5 w-[500px] max-h-screen overflow-y-auto animate-slide-in-right">
      <!-- Header -->
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-gray-200 animate-fade-in">
          {{ translateText('Bildirishnomalar') }}
        </h2>
        <button
          class="text-4xl -mt-1 dark:text-gray-400 hover:text-gray-300 transition-all duration-300 hover:scale-110 hover:rotate-90 animate-fade-in"
          @click="closeModal">
          ×
        </button>
      </div>

      <!-- Send Notification Form -->
      <div class="p-4 my-4 rounded dark:bg-gray-700 dark:text-white border-2 border-gray-600 animate-fade-in-up">
        <h2 class="text-lg font-semibold mb-3">
          {{ translateText('Xabar yuborish') }}
        </h2>
        <input v-model="notificationMessage" type="text" :placeholder="translateText('Bildirishnoma xabari')"
          class="border border-gray-600 dark:bg-gray-900 text-white dark:placeholder:text-white p-2 mr-2 rounded w-full placeholder-gray-400 transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-gray-800" />
        <button @click="sendNotification"
          class="bg-blue-500 text-white px-4 py-2 rounded mt-2 hover:bg-blue-600 transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 flex items-center justify-center"
          :class="{ 'animate-pulse': isSending }" :disabled="isSending">
          <span v-if="!isSending">
            {{ translateText('Hammaga yuborish') }}
          </span>
          <span v-else class="flex items-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
              viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
            {{ translateText('Yuborilmoqda...') }}
          </span>
        </button>
        <div v-if="isSending" class="text-center text-blue-400 mt-2 animate-fade-in">
          {{ translateText('Bildirishnoma yuborilmoqda, iltimos kuting...') }}
        </div>
      </div>

      <transition-group name="notification" tag="div">
        <div v-for="(notification, index) in notificationsOperator" v-if="notificationsOperator.length > 0" :key="notification.id">
          <div v-if="!notification.isRead"
            class="p-4 mb-2.5 border dark:text-gray-200 border-gray-600 border-l-4 border-l-blue-400 dark:bg-gray-700 text-gray-700 relative notification-item dark:hover:bg-gray-600 transition-all duration-300 hover:shadow-lg hover:scale-102"
            :style="{ animationDelay: `${index * 100}ms` }">
            <p class="font-medium my-1">
              {{ translateText(notification.message) }}
            </p>
            <p class="text-sm">{{ formatDate(notification.sentAt) }}</p>
            <button v-if="!notification.isRead" @click="markAsReadOperator(notification.id)"
              class="bg-lime-500 text-black px-2 py-1 absolute bottom-2 right-2 rounded hover:bg-lime-600 transition-all duration-300 hover:scale-105 active:scale-95 animate-bounce-subtle">
              {{ translateText('O\'qilgan deb belgilash') }}
            </button>
          </div>
        </div>

        <div v-for="(notification, index) in uniqueNotifications" :key="notification.id"
          class="p-4 mb-2.5 border dark:text-gray-200 border-gray-600 border-l-4 border-l-blue-400 dark:bg-gray-700 text-gray-700 relative notification-item dark:hover:bg-gray-600 transition-all duration-300 hover:shadow-lg hover:scale-102"
          :style="{ animationDelay: `${index * 100}ms` }">
          <p class="font-medium my-1">
            {{ translateText(notification.message) }}
          </p>
          <p class="text-sm">{{ formatDate(notification.sentAt) }}</p>
          <button v-if="!notification.isRead" @click="markAsRead(notification.id)"
            class="bg-lime-500 text-black px-2 py-1 absolute bottom-2 right-2 rounded hover:bg-lime-600 transition-all duration-300 hover:scale-105 active:scale-95 animate-bounce-subtle">
            {{ translateText('O\'qilgan deb belgilash') }}
          </button>
        </div>
      </transition-group>

      <div v-if="uniqueNotifications.length === 0 && notificationsOperator.length === 0" class="text-center text-gray-400 animate-pulse">
        {{ translateText('Bildirishnomalar yo\'q') }}
      </div>

      <!-- Error Toast -->
      <div v-if="errorMessage"
        class="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded shadow-lg animate-fade-in">
        {{ translateText(errorMessage) }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { io } from 'socket.io-client';
import { format } from 'date-fns';
import { debounce } from 'lodash';
import { inject } from 'vue';
import { URL } from '@/auth/url';
import translateText from '@/auth/Translate copy';
import axios from 'axios';

const notificationsOperator = ref([]);
const emit = defineEmits(['close']);
const isConnected = ref(false);
const notifications = ref([]);
const unreadCount = ref(0);
const notificationMessage = ref('');
const isSending = ref(false);
const errorMessage = ref('');
const isLoading = inject('isLoading', ref(false));// Socket Configuration
const socketURL = URL || 'http://localhost:3000';
const socket = io(socketURL, {
  path: '/socket.io',
  transports: ['websocket', 'polling'],
  auth: { userId: parseInt(localStorage.getItem('id')) || 1 },
  query: { userId: parseInt(localStorage.getItem('id')).toString() || '1' },
});

// Date Formatting
const formatDate = (date) => {
  return date ? format(new Date(date), 'yyyy-MM-dd HH:mm:ss') : '';
};

// Deduplicate Notifications
const uniqueNotifications = computed(() => {
  const seen = new Set();
  return notifications.value.filter((n) => {
    if (seen.has(n.id) || !n.id) return false;
    seen.add(n.id);
    return true;
  });
});

// Merge notifications from different sources, removing duplicates
function mergeNotifications(newNotifications) {
  const all = [...newNotifications, ...notifications.value]; // Prepend new notifications
  const seen = new Set();
  notifications.value = all.filter(n => {
    if (!n.id || seen.has(n.id)) return false;
    seen.add(n.id);
    return true;
  });
  unreadCount.value = notifications.value.filter(n => !n.isRead).length;
}

// Socket Event Listeners
const setupSocketListeners = () => {
  socket.on('connect', () => {
    isConnected.value = true;
    const userId = parseInt(localStorage.getItem('id')) || 1;
    socket.emit('joinUser', userId.toString());
    fetchNotifications();
  });

  socket.on('disconnect', () => {
    isConnected.value = false;
  });

  socket.on('notification', (notification) => {
    const existingNotification = notifications.value.find(
      (n) => n.id === notification.requestId
    );
    if (existingNotification) {
      // Update the existing notification with the server's ID
      notifications.value = notifications.value.map((n) =>
        n.id === notification.requestId
          ? { ...n, id: notification.id }
          : n
      );
    } else {
      // Add as a new notification at the start
      notifications.value.unshift({
        id: notification.id,
        message: notification.message,
        sentAt: notification.sentAt || new Date(),
        isRead: notification.isRead || false,
      });
      if (!notification.isRead) unreadCount.value += 1;
    }
  });

  socket.on('unreadCount', (count) => {
    unreadCount.value = count;
  });

  socket.on('error', (message) => {
    errorMessage.value = message;
    setTimeout(() => (errorMessage.value = ''), 5000);
  });

  socket.on('notificationMarkedAsRead', (notificationId) => {
    notifications.value = notifications.value.map((n) =>
      n.id === notificationId ? { ...n, isRead: true } : n
    );
    unreadCount.value = notifications.value.filter((n) => !n.isRead).length;
  });

  socket.on('allNotificationsMarkedAsRead', ({ count }) => {
    notifications.value = notifications.value.map((n) => ({ ...n, isRead: true }));
    unreadCount.value = 0;
  });

  socket.on('notifyAllSuccess', () => {
    isSending.value = false;
  });

  socket.on('notifyUserSuccess', () => {
    isSending.value = false;
  });
};

// Fetch Notifications
const fetchNotifications = () => {
  const userId = parseInt(localStorage.getItem('id')) || 1;
  socket.emit('getNotifications', userId, (response) => {
    const newNotifications = response.map((n) => ({
      id: n.id,
      message: n.message,
      sentAt: n.sentAt || new Date(),
      isRead: n.isRead || false,
    }));
    mergeNotifications(newNotifications);
  });
};

// Mark Notification as Read
const markAsRead = (notificationId) => {
  isLoading.value = true;
  notifications.value = notifications.value.map((n) =>
    n.id === notificationId ? { ...n, isRead: true } : n
  );
  unreadCount.value = notifications.value.filter((n) => !n.isRead).length;
  socket.emit('markAsRead', notificationId);
  isLoading.value = false;
};

const markAsReadOperator = (notificationId) => {
  isLoading.value = true;
  axios.put(`${URL}/customers/notifications/${notificationId}/read`);
  notificationsOperator.value = notificationsOperator.value.map((n) =>
    n.id === notificationId ? { ...n, isRead: true } : n
  );
  unreadCount.value = notificationsOperator.value.filter((n) => !n.isRead).length;
  isLoading.value = false;
};

const sendNotification = debounce(() => {
  if (notificationMessage.value && !isSending.value) {
    isSending.value = true;

    // Create a local notification object
    const newNotification = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2)}`, // Temporary unique ID
      message: notificationMessage.value,
      sentAt: new Date(),
      isRead: false,
    };

    // Add the new notification to the start of the array
    mergeNotifications([newNotification]);

    // Emit the notification to the server
    socket.emit('notifyAllUsers', {
      message: notificationMessage.value,
      type: 'REMINDER',
      requestId: newNotification.id,
    });

    // Clear the input field
    notificationMessage.value = '';
  }
}, 1000);

// Close Modal
const closeModal = () => {
  emit('close');
};

const fetchNotificationsOperator = async () => {
  try {
    const userId = ref(parseInt(localStorage.getItem('id')) || 1);
    const response = await axios.get(`${URL}/customers/notifications/${userId.value}`);
    if (Array.isArray(response.data)) {
      const newNotifications = response.data.map((n) => ({
        id: n.id,
        message: n.message,
        sentAt: n.createdAt || new Date(),
        isRead: n.read || false,
      }));
      notificationsOperator.value = newNotifications.filter((el)=>!el.isRead)  
    }
  } catch (error) {
    console.error('Error fetching notifications:', error);
  }
};

// Lifecycle Hooks
onMounted(() => {
  socket.off(); // Clear any existing listeners
  setupSocketListeners();
  fetchNotifications();
  fetchNotificationsOperator()
});

onUnmounted(() => {
  socket.disconnect();
});
</script>

<style scoped>
@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }

  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounceSubtle {

  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }

  40% {
    transform: translateY(-3px);
  }

  60% {
    transform: translateY(-2px);
  }
}

.animate-slide-in-right {
  animation: slideInRight 0.3s ease-out;
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out;
}

.animate-bounce-subtle {
  animation: bounceSubtle 2s infinite;
}

.notification-enter-active {
  transition: all 0.5s ease-out;
}

.notification-leave-active {
  transition: all 0.4s ease-in;
}

.notification-enter-from,
.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.notification-move {
  transition: transform 0.3s ease;
}

.notification-item {
  animation: slideInFromRight 0.6s ease-out forwards;
  opacity: 0;
  transform: translateX(100%);
}

@keyframes slideInFromRight {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.notification-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.5s;
}

.notification-item:hover::before {
  left: 100%;
}

.hover\:scale-102:hover {
  transform: scale(1.02);
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.focus\:ring-2:focus {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

.active\:scale-95:active {
  transform: scale(0.95);
}
</style>