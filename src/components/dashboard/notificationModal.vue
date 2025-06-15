<template>
  <div @click="closeModal"  class="fixed inset-0 bg-black bg-opacity-70 flex justify-end z-40">
    <div @click.stop class="dark:bg-gray-800 bg-gray-200 p-5 w-[500px] max-h-screen overflow-y-auto animate-slide-in-right">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-gray-200 animate-fade-in">{{ dat === 'datakril' ? translateText('Bildirishnomalar') : 'Bildirishnomalar' }}</h2>
        <!-- Notification Type Selector -->
        <div class="flex items-center animate-fade-in">
          <select 
            id="notification-type" 
            v-model="selectedNotificationType" 
            class="ml-2 p-1 rounded border border-gray-600 dark:bg-gray-600 dark:text-white transition-all duration-300 hover:border-blue-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="socket">{{ dat === 'datakril' ? translateText('Tizim ichida muhim xabarlar') : 'Tizim ichida muhim xabarlar' }}</option>
            <option v-if="axiosNotifications.length" value="axios">{{ dat === 'datakril' ? translateText('Bugalteriya bildirishnomalar') : 'Bugalteriya bildirishnomalar' }}</option>
          </select>
        </div>
        <button 
          class="text-4xl -mt-1 dark:text-gray-400 hover:text-gray-300 transition-all duration-300 hover:scale-110 hover:rotate-90 animate-fade-in" 
          @click="closeModal"
        >
          ×
        </button>
      </div>

      <!-- Send Notification -->
      <div v-if="selectedNotificationType === 'socket'" class="p-4 my-4 rounded dark:bg-gray-700 dark:text-white border-2 border-gray-700 animate-fade-in-up">
        <h2 class="text-lg font-semibold mb-3">{{ dat === 'datakril' ? translateText('Bildirishnoma yuborish') : 'Bildirishnoma yuborish' }}</h2>
        <input 
          v-model="notificationMessage" 
          type="text" 
          :placeholder="dat === 'datakril' ? translateText('Bildirishnoma xabari') : 'Bildirishnoma xabari'" 
          class="border border-gray-600 dark:bg-gray-900 text-white dark:placeholder:text-white p-2 mr-2 rounded w-full placeholder-gray-400 transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-gray-800" 
        />
        <button 
          @click="sendNotification" 
          class="bg-blue-500 text-white px-4 py-2 rounded mt-2 hover:bg-blue-600 transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 flex items-center justify-center"
          :class="{ 'animate-pulse': isSending }"
          :disabled="isSending"
        >
          <span v-if="!isSending">{{ dat === 'datakril' ? translateText('Hammaga yuborish') : 'Hammaga yuborish' }}</span>
          <span v-else class="flex items-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Yuborilmoqda...
          </span>
        </button>
      </div>

      <!-- Notifications List -->
      <div>
        <div v-if="selectedNotificationType === 'socket'">
          <transition-group name="notification" tag="div">
            <div 
              v-for="(notification, index) in socketNotifications" 
              :key="notification.id" 
            class="p-4 mb-2.5 border dark:text-gray-200 border-gray-600 border-l-4 border-l-blue-400 dark:bg-gray-700 text-gray-700 relative notification-item dark:hover:bg-gray-600 transition-all duration-300 hover:shadow-lg hover:scale-102"
              :style="{ animationDelay: `${index * 100}ms` }"
            >
              <p class="font-medium my-1 ">{{ dat === 'datakril' ? translateText(notification.message) : notification.message }}</p>
              <p class="text-sm">{{ formatDate(notification.sentAt) }}</p>
              <button 
                v-if="!notification.isRead" 
                @click="markAsRead(notification.id, 'socket')" 
                class="bg-lime-500 text-black px-2 py-1 absolute bottom-2 right-2 rounded hover:bg-lime-600 transition-all duration-300 hover:scale-105 active:scale-95 animate-bounce-subtle"
              >
                {{ dat === 'datakril' ? translateText('Tushundim') : 'Tushundim' }}
              </button>
            </div>
          </transition-group>
        </div>
        <div v-else>
          <transition-group name="notification" tag="div">
            <div 
              v-for="(notification, index) in axiosNotifications" 
              :key="notification.id" 
              class="p-4 mb-2.5 border border-l-4 border-l-blue-400 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 border-gray-600 relative notification-item transition-all duration-300 hover:shadow-lg hover:scale-102"
              :style="{ animationDelay: `${index * 100}ms` }"
            >
              <p class="font-medium my-1">{{ dat === 'datakril' ? translateText(notification.message) : notification.message }}</p>
              <p class=" text-sm">{{ formatDate(notification.createdAt) }}</p>
              <button 
                v-if="!notification.isRead" 
                @click="markAsRead(notification.id, 'axios')" 
                class="bg-lime-500 text-black px-2 py-1 absolute bottom-2 right-2 rounded hover:bg-lime-600 transition-all duration-300 hover:scale-105 active:scale-95 animate-bounce-subtle"
              >
                {{ dat === 'datakril' ? translateText('Tushundim') : 'Tushundim' }}
              </button>
            </div>
          </transition-group>
        </div>
        <div v-if="selectedNotifications.length === 0" class="text-center text-gray-400 animate-fade-in">
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
const dat = ref(localStorage.getItem('til') || 'datalotin');

let intervalId = null;
const checkLanguageChange = () => {
  const currentLang = localStorage.getItem('til') || 'datalotin';
  if (currentLang !== dat.value) {
    dat.value = currentLang;
  }
};
onMounted(() => {
  intervalId = setInterval(checkLanguageChange, 0);
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});
const emit = defineEmits(['close']);
const isConnected = ref(false);
const socketNotifications = ref([]);
const axiosNotifications = ref([]);
const unreadCount = ref(0);
const notificationMessage = ref('');
const selectedNotificationType = ref('socket'); // Default to socket notifications
const isSending = ref(false);
const isLoading = inject('isLoading')

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
      message: data,
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
  });

  socket.on('notifyAllSuccess', ({ message, count }) => {
    isSending.value = false;
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
  isLoading.value = true
  try {
    const userId = parseInt(localStorage.getItem('id')) || 1;
    const response = await axios.get(`${URL}/accauntant-notification/user/${userId}`);
    axiosNotifications.value = response.data.map((n) => ({
      ...n,
      sentAt: n.createdAt || n.sentAt,
    }));
  } catch (error) {
    console.error('Error fetching axios notifications:', error);
  } finally{
    isLoading.value = false
  }
};

const fetchUnreadCount = async () => {
  isLoading.value = true

  try {
    const userId = parseInt(localStorage.getItem('id')) || 1;
    const response = await axios.get(`${URL}/accauntant-notification/unread/count?userId=${userId}`);
    unreadCount.value = response.data;
  } catch (error) {
    console.error('Error fetching unread count:', error);
  } finally{
    isLoading.value = false
  }
};

const markAsRead = async (notificationId, type) => {
  isLoading.value = true

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
  } finally{
    isLoading.value = false
  }
};

const markAllAsRead = () => {
  socket.emit('markAllAsRead');
};

const sendNotification = () => {
  if (notificationMessage.value && !isSending.value) {
    isSending.value = true;
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

<style scoped>
/* Modal slide-in animation */
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

.animate-slide-in-right {
  animation: slideInRight 0.3s ease-out;
}

/* Fade in animations */
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

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out;
}

/* Subtle bounce animation for buttons */
@keyframes bounceSubtle {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-3px);
  }
  60% {
    transform: translateY(-2px);
  }
}

.animate-bounce-subtle {
  animation: bounceSubtle 2s infinite;
}

/* Notification list transitions */
.notification-enter-active {
  transition: all 0.5s ease-out;
}

.notification-leave-active {
  transition: all 0.4s ease-in;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.notification-move {
  transition: transform 0.3s ease;
}

/* Staggered animation for notifications */
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

/* Hover effects */
.notification-item {
  position: relative;
  overflow: hidden;
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

/* Scale on hover */
.hover\:scale-102:hover {
  transform: scale(1.02);
}

/* Loading spinner animation */
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

/* Focus states */
.focus\:ring-2:focus {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

/* Button active states */
.active\:scale-95:active {
  transform: scale(0.95);
}

/* Smooth transitions for all interactive elements */
* {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
</style>