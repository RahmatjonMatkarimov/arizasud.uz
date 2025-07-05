<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-500">
    <!-- Header -->
    <header class="fixed top-0 left-0 right-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-sm z-50 border-b border-gray-100/50 dark:border-gray-700/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div class="flex items-center space-x-3">
          <iconify-icon icon="mdi:folder-outline" class="w-8 h-8 text-blue-600 dark:text-blue-400 transition-transform duration-300 ease-in-out transform hover:scale-110"></iconify-icon>
          <h1 class="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Client Sections</h1>
        </div>
        <div class="flex items-center space-x-4">
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              v-model="isDarkMode"
              class="sr-only"
            >
            <div class="w-16 h-8 bg-gray-300 dark:bg-gray-600 rounded-full p-1 transition-colors duration-500 ease-in-out"
                 :class="{ 'bg-gradient-to-r from-blue-500 to-indigo-600': isDarkMode }">
              <div
                class="w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center transform transition-transform duration-500 ease-in-out"
                :class="{ 'translate-x-8': isDarkMode, 'translate-x-0': !isDarkMode }"
              >
                <iconify-icon
                  :icon="isDarkMode ? 'mdi:moon-waning-crescent' : 'mdi:white-balance-sunny'"
                  class="w-4 h-4 text-gray-600 dark:text-yellow-400 transition-colors duration-300"
                ></iconify-icon>
              </div>
            </div>
          </label>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div v-if="clientData" class="space-y-6">
        <div
          v-for="(section, index) in clientData.ClientSectionBody"
          :key="index"
          class="client-section grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <div
            v-for="item in section.clientSections"
            :key="item.id"
            class="flex flex-col items-center group cursor-pointer"
          >
            <div
              @click="navigateToSection(item)"
              class="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-600 rounded-xl shadow-md transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-xl"
            >
              <iconify-icon
                :icon="item.type === 'datastatus' ? 'mdi:chart-box-outline' : 'mdi:folder-outline'"
                class="w-10 h-10 text-blue-600 dark:text-blue-400"
              ></iconify-icon>
            </div>
            <h2
              class="mt-2 text-center text-sm font-semibold text-gray-800 dark:text-gray-100 truncate w-20 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300"
            >
              {{ dat === 'datakril' ? translateText(item.name) : item.name }}
            </h2>
          </div>
        </div>
      </div>
      <div v-else class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 dark:border-blue-400"></div>
      </div>
      <ModalConfirm :visible="showModal" @confirm="confirmLeave" @cancel="cancelLeave" />
    </main>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import axios from 'axios';
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router';
import { URL } from '@/auth/url.js';
import translateText from '@/auth/Translate';
import { inject } from 'vue';
import ModalConfirm from './modal.vue';

// Load Iconify script
onMounted(() => {
  const script = document.createElement('script');
  script.src = 'https://code.iconify.design/iconify-icon/1.0.8/iconify-icon.min.js';
  script.async = true;
  document.body.appendChild(script);
});

// Navigation guard with modal
const showModal = ref(false);
let nextRoute = null;
const bypassNavigationGuard = ref(false);

onBeforeRouteLeave((to, from, next) => {
  if (bypassNavigationGuard.value) {
    bypassNavigationGuard.value = false;
    next();
  } else {
    showModal.value = true;
    nextRoute = next;
  }
});

function confirmLeave() {
  showModal.value = false;
  if (nextRoute) {
    nextRoute();
    nextRoute = null;
  }
}

function cancelLeave() {
  showModal.value = false;
  if (nextRoute) {
    nextRoute(false);
    nextRoute = null;
  }
}

// Language and client data
const route = useRoute();
const isLoading = inject('isLoading');
const dat = ref(localStorage.getItem('til') || 'datalotin');
const router = useRouter();
const id = parseInt(route.params.id);
const clientData = ref(null);

const fetchClientById = async () => {
  if (isLoading) {
    isLoading.value = true;
  }
  try {
    const response = await axios.get(`${URL}/client/${id}`);
    clientData.value = response.data;
  } catch (error) {
    console.error('Error fetching client data:', error);
  } finally {
    if (isLoading) {
      isLoading.value = false;
    }
  }
};

onMounted(() => {
  fetchClientById();
});

// Dark mode logic
const isDarkMode = ref(false);

watch(isDarkMode, (newValue) => {
  if (newValue) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
});

onMounted(() => {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  isDarkMode.value = savedTheme === 'dark' || (!savedTheme && prefersDark);
});

// Navigation handler for client sections
const navigateToSection = (item) => {
  bypassNavigationGuard.value = true;
  if (item.type !== 'datastatus') {
    router.push(`/room-lists/${id}/${item.id}`);
  } else {
    router.push(`/room-status/${id}/${item.id}`);
  }
};
</script>

<style scoped>
header {
  transition: all 0.3s ease;
}

.client-section {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.client-section:hover {
  transform: translateY(-2px);
}

.group:hover h2 {
  @apply text-blue-600 dark:text-blue-400;
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.dark ::-webkit-scrollbar-track {
  background: #2d3748;
}

.dark ::-webkit-scrollbar-thumb {
  background: #4a5568;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #718096;
}
</style>