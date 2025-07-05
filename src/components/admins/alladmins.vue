<template>
  <div class="min-h-screen bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200/70">
    <div class="flex justify-center pt-4 items-center">
      <h1
        class=" text-[40px] font-bold text-center bg-gradient-to-r from-blue-800 to-purple-500 text-white shadow-sm shadow-white rounded-lg py-2 px-[100px]">
        {{ dat === 'datakril' ? translateText("Barcha ishchilar ro'yxati") : "Barcha ishchilar ro'yxati" }}
      </h1>
    </div>

    <div class="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8 px-4">
      <div v-for="item in filteredAdmins" :key="item.id"
        class="bg-white dark:bg-[#2d2d2d] rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden relative"
        :class="{ 'ring-2 ring-green-400 ring-opacity-50': checkIsOnlineRealtime(item.id) }">
        
        <!-- Online Status Indicator -->
        <div class="absolute top-2 right-2 flex items-center z-10">
          <span 
            :class="[
              'w-3 h-3 rounded-full border-2 border-white shadow-sm transition-all duration-300',
              checkIsOnlineRealtime(item.id) ? 'bg-green-500' : 'bg-red-500'
            ]"
          ></span>
        </div>

        <!-- Top Section -->
        <div class="bg-gradient-to-r from-blue-800 to-purple-500 text-white text-center p-4">
          <div class="relative inline-block">
            <img class="w-20 h-20 mx-auto rounded-full object-cover border-4 border-white -mb-3 z-10"
              :src="getImageUrl(item.img)" :alt="dat === 'datakril' ? translateText('Avatar') : 'Avatar'" />
          </div>
          <h2 class="text-lg font-bold mt-4">
            {{ dat === 'datakril' ? translateText(item.name) : item.name }} 
            {{ dat === 'datakril' ? translateText(item.surname) : item.surname }}
          </h2>
          <p class="text-sm">
            {{ dat === 'datakril' ? translateText(item.lavozimi) : item.lavozimi }}
          </p>
          <!-- Real-time Status text -->
          <p :class="['text-xs mt-1 transition-colors duration-300', getStatusTextClass(item)]">
            {{ dat === 'datakril' ? translateText(getAdminStatusText(item)) : getAdminStatusText(item) }}
          </p>
        </div>

        <!-- Info Section -->
        <div class="p-4 text-sm space-y-2 text-gray-800 dark:text-gray-200">
          <p>
            <Icon icon="mdi:phone-outline" class="inline-block w-5 h-5 mr-2" />
            {{ dat === 'datakril' ? translateText(item.phone) : item.phone }}
          </p>
          <p>
            <Icon icon="mdi:briefcase-outline" class="inline-block w-5 h-5 mr-2" />
            {{ dat === 'datakril' ? item.startWork?.split('T')[0] : item.startWork?.split('T')[0] }}
          </p>
          <p>
            <Icon icon="mdi:cake-variant-outline" class="inline-block w-5 h-5 mr-2" />
            {{ dat === 'datakril' ? item.birthday?.split('T')[0] : item.birthday?.split('T')[0] }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, inject, watch } from 'vue';
import axios from 'axios';
import { io } from 'socket.io-client';
import { URL } from '@/auth/url.js';
import translateText from '@/auth/Translate';
import { Icon } from '@iconify/vue';
const dat = ref(localStorage.getItem('til') || 'datalotin');

// Socket and real-time state
const socket = ref(null);
const socketConnected = ref(false);
const onlineUserIds = ref([]);
const isLoading = inject('isLoading')
const admins = ref([]);

// Search functionality
import { useSearchStore } from '@/components/Templates/searchQuary'
import { useRouter } from 'vue-router';
const searchStore = useSearchStore()

// Computed property for filtered admins
const filteredAdmins = computed(() => {
  if (!searchStore.query.trim()) {
    return admins.value;
  }
  
  const query = searchStore.query.toLowerCase().trim();
  
  return admins.value.filter(admin => {
    const fullName = `${admin.name || ''} ${admin.surname || ''}`.toLowerCase();
    const phone = (admin.phone || '').toLowerCase();
    
    return fullName.includes(query) || phone.includes(query);
  });
});

// Socket initialization and management
const initSocket = () => {
  isLoading.value = true
  try {
    socket.value = io(URL, {
      transports: ['websocket', 'polling'],
      auth: {
        userId: localStorage.getItem('userId') || '1'
      }
    });

    setupSocketListeners();
  } catch (error) {
    console.error('Socket initialization error:', error);
  }finally{
    isLoading.value = false
  }
};

const setupSocketListeners = () => {
  if (!socket.value) return;

  // Connection events
  socket.value.on('connect', () => {
    socketConnected.value = true;
    
    // Join user and request online users
    const userId = localStorage.getItem('userId') || '1';
    socket.value.emit('joinUser', userId);
    requestOnlineUsers();
  });

  socket.value.on('disconnect', () => {
    socketConnected.value = false;
  });

  socket.value.on('connect_error', (error) => {
    socketConnected.value = false;
  });

  // Real-time online users updates
  socket.value.on('userOnlineUpdate', (userIds) => {
    updateOnlineUserIds(userIds);
  });

  socket.value.on('adminOnlineUpdate', (userIds) => {
    updateOnlineUserIds(userIds);
  });

  // Legacy support for existing events
  socket.value.on('onlineAdmins', (updatedAdmins) => {
    if (Array.isArray(updatedAdmins)) {
      updateAdminsFromLegacy(updatedAdmins);
    }
  });
};

const updateOnlineUserIds = (userIds) => {
  if (Array.isArray(userIds)) {
    onlineUserIds.value = userIds.map(id => String(id));
  }
};

const updateAdminsFromLegacy = (updatedAdmins) => {
  // Update existing admins with new lastSeen data
  admins.value = admins.value.map(admin => {
    const updated = updatedAdmins.find(a => a.id === admin.id);
    return updated ? { ...admin, lastSeen: updated.lastSeen } : admin;
  });
  
  // Extract online user IDs from updated admins
  const onlineIds = updatedAdmins
    .filter(admin => checkIsOnlineFromLastSeen(admin))
    .map(admin => String(admin.id));
  
  onlineUserIds.value = onlineIds;
};

const requestOnlineUsers = () => {
  if (socket.value && socketConnected.value) {
    // Try different methods to get online users
    socket.value.emit('getOnlineAdmins');
    socket.value.emit('getOnlineUsers');
  }
};

// Real-time online status checker
const checkIsOnlineRealtime = (userId) => {
  return onlineUserIds.value.includes(String(userId));
};

// Fallback: Check online status from lastSeen (for legacy support)
const checkIsOnlineFromLastSeen = (admin) => {
  if (!admin?.lastSeen) return false;

  const lastSeenTime = new Date(admin.lastSeen).getTime();
  const currentTime = new Date().getTime();
  const timeDifferenceInMinutes = (currentTime - lastSeenTime) / (1000 * 60);
  
  return timeDifferenceInMinutes <= 5;
};

// Status text generator with real-time awareness
const getAdminStatusText = (admin) => {
  if (!admin) return 'Offline';

  // Check real-time status first
  if (checkIsOnlineRealtime(admin.id)) {
    return 'online';
  }

  // Fallback to lastSeen-based status
  if (checkIsOnlineFromLastSeen(admin)) {
    return 'Online (5 daqiqa ichida)';
  } else if (admin.lastSeen) {
    const lastSeenTime = new Date(admin.lastSeen).getTime();
    const currentTime = new Date().getTime();
    const timeDifferenceInMinutes = Math.floor((currentTime - lastSeenTime) / (1000 * 60));
    
    if (timeDifferenceInMinutes < 60) {
      return `${timeDifferenceInMinutes} daqiqa oldin tarmoqda edi`;
    } else if (timeDifferenceInMinutes < 1440) {
      return `${Math.floor(timeDifferenceInMinutes / 60)} soat oldin tarmoqda edi`;
    } else {
      return `${Math.floor(timeDifferenceInMinutes / 1440)} kun oldin tarmoqda edi`;
    }
  } else {
    return 'Offline';
  }
};

// Status text class for styling
const getStatusTextClass = (admin) => {
  if (checkIsOnlineRealtime(admin.id)) {
    return 'text-green-200 font-medium';
  } else if (checkIsOnlineFromLastSeen(admin)) {
    return 'text-yellow-200';
  } else {
    return 'text-red-200';
  }
};

// Data fetching
const getData = async () => {
  const token = localStorage.getItem('token');
  if (!token) return;
isLoading.value = true
  try {
    const res = await axios.get(`${URL}/deliverer/allUsers`);
    admins.value = res.data.filter(user => user.role !== 'bigAdmin');
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally { 
    isLoading.value = false
  }
};

// Utility functions
const getImageUrl = (img) => {
  return img ? `${URL}/upload/${img}` : '/default-avatar.png';
};

const clearSearch = () => {
  searchStore.query = '';
};

// Lifecycle and cleanup
let intervalId = null;

onMounted(async () => {
  await getData();
  initSocket();
  
  // Periodic online status refresh (fallback)
  intervalId = setInterval(() => {
    if (socketConnected.value) {
      requestOnlineUsers();
    }
  }, 10000); // Every 10 seconds
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
  
  if (socket.value) {
    socket.value.off('connect');
    socket.value.off('disconnect');
    socket.value.off('connect_error');
    socket.value.off('userOnlineUpdate');
    socket.value.off('adminOnlineUpdate');
    socket.value.off('onlineAdmins');
    socket.value.disconnect();
  }
});

// Watch for connection changes and refresh data
watch(socketConnected, (newValue) => {
  if (newValue) {
    setTimeout(requestOnlineUsers, 1000); // Small delay to ensure connection is stable
  }
});

// Watch for online users changes for debugging
watch(onlineUserIds, (newIds) => {
}, { deep: true });
</script>

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes ping {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-ping {
  animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}

/* Smooth transitions for status changes */
.transition-all {
  transition: all 0.3s ease;
}

.transition-colors {
  transition: color 0.3s ease;
}

/* Online user card glow effect */
.ring-2 {
  box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.3), 0 0 20px rgba(34, 197, 94, 0.1);
}

/* Debug panel styling */
.fixed.bottom-4.right-4 {
  backdrop-filter: blur(10px);
}
</style>