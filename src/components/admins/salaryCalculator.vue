<script setup>
import { URL } from '@/auth/url';
import axios from 'axios';
import { ref, computed, watch } from 'vue';
import { useWorkDay } from './useWorkDay.js';

const { checkIn, startLunch, endLunch, checkOut, fetchWorkDay, workDay, error, loading } = useWorkDay();

// Sample user data
const users = ref([]);
const searchQuery = ref('');
const currentFilter = ref('all');
const selectedUserId = ref(null); // Tracks which user's modal is open
const modalPosition = ref({ top: 0, left: 0 });
const workDayId = ref(null);

const handleCheckIn = async (user) => {
  try {
    const newWorkDay = await checkIn(user.id);
    workDayId.value = newWorkDay.id; // Yangi WorkDay ID ni saqlash
    ('Ishga kirish yozildi!');
  } catch (err) {
    console.error(err);
  }``
};

const handleStartLunch = async (user) => {
  try {
    await startLunch(workDayId.value);
  } catch (err) {
    console.error(err);
  }
};

const handleEndLunch = async (user) => {
  try {
    await endLunch(workDayId.value);
  } catch (err) {
    console.error(err);
  }
};

const handleCheckOut = async (user) => {
  try {
    await checkOut(workDayId.value);
  } catch (err) {
    console.error(err);
  }
};

// Computed filtered users
const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesFilter = currentFilter.value === 'all' || user.status === currentFilter.value;
    return matchesSearch && matchesFilter;
  });
});

// Fetch users
const getUsers = async () => {
  try {
    const response = await axios.get(`${URL}/deliverer/allUsers`, {
      headers: {
        Accept: 'application/json'
      }
    });
    users.value = response.data;
  } catch (error) {
    console.error("Error fetching users:", error.message);
    if (error.response?.data) {
      console.log("Server response:", error.response.data);
    }
  }
};

getUsers();


// Toggle modal for a specific user
const toggleModal = (userId, event) => {
  event.stopPropagation(); // Prevent event bubbling
  if (selectedUserId.value === userId) {
    selectedUserId.value = null; // Close if same user
  } else {
    selectedUserId.value = Number(userId); // Ensure number type
    const rect = event.target.getBoundingClientRect();
    modalPosition.value = {
      top: rect.bottom + window.scrollY + 5,
      left: Math.min(rect.left + window.scrollX, window.innerWidth - 200)
    };
  }
};

// Close modal on outside click
import { onMounted, onUnmounted } from 'vue';
const closeModalOnOutsideClick = (event) => {
  if (!event.target.closest('.modal-content') && !event.target.closest('.rotate-90')) {
    selectedUserId.value = null;
  }
};

onMounted(() => {
  document.addEventListener('click', closeModalOnOutsideClick);
});

onUnmounted(() => {
  document.removeEventListener('click', closeModalOnOutsideClick);
});
</script>

<template>
  <div class="animated-gradient">
    <div class="max-w-6xl mx-auto p-8">
      <header class="header flex justify-between items-center mb-8">
        <h1 class="text-3xl font-semibold text-gray-900">User Management</h1>
      </header>

      <div class="controls flex gap-4 mb-8 flex-wrap">
        <input type="text" v-model="searchQuery" placeholder="Search users..."
          class="search-input flex-1 min-w-[250px] p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />

        <div class="filters flex gap-2">
          <button v-for="filter in ['all', 'active', 'inactive']" :key="filter"
            @click="currentFilter = filter" :class="[
              'filter-button px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-600 text-sm transition',
              { 'bg-blue-500 text-white border-blue-500': currentFilter === filter },
              'hover:bg-gray-100'
            ]">
            {{ filter.charAt(0).toUpperCase() + filter.slice(1) }}
          </button>
        </div>
      </div>

      <div class="user-list grid gap-4">
        <div v-for="user in filteredUsers" :key="user.id"
          class="user-card bg-white rounded-lg p-4 flex items-center justify-between shadow-sm">
          <div class="user-info w-full flex items-center gap-4">
            <img :src="`${URL}/upload/${user.img}`" :alt="user.name"
              class="avatar w-10 h-10 rounded-full object-cover" />
            <div class="flex w-full relative justify-between">
              <div>
                <h3 class="text-sm font-medium text-gray-900">{{ user.name }}</h3>
                <p class="email text-xs text-gray-500">{{ user.email }}</p>
              </div>
              <div @click.stop="toggleModal(user.id, $event)" class="cursor-pointer">
                <h1 class="text-black text-[20px] rotate-90" aria-label="Open actions for {{ user.name }}">...</h1>
              </div>
              <!-- Modal for this specific user -->
              <div v-if="selectedUserId === user.id"
                class="modal-content -right-[190px] mt-10 absolute bg-gray-500 rounded-lg shadow-lg p-4 z-[1000] w-48 border border-gray-200"
               >
                <div class="grid gap-2">
                  <button @click="handleCheckIn(user)"
                    class="w-full px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600">
                    Check In
                  </button>
                  <button @click="handleStartLunch(user)"
                    class="w-full px-3 py-1 bg-green-500 text-white rounded-md text-sm hover:bg-green-600">
                    Start Lunch
                  </button>
                  <button @click="handleEndLunch(user)"
                    class="w-full px-3 py-1 bg-yellow-500 text-white rounded-md text-sm hover:bg-yellow-600">
                    End Lunch
                  </button>
                  <button @click="handleCheckOut(user)"
                    class="w-full px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600">
                    Check Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  @apply bg-gray-100 text-gray-900 leading-normal;
}

.animated-gradient {
  background: linear-gradient(45deg, #1a3c34, #4a5568, #2f855a, #2d3748);
  background-size: 400% 400%;
  animation: gradientAnimation 15s ease infinite;
  padding: 1.75rem;
  min-height: 100vh;
}

.cardGradent {
  background: linear-gradient(45deg, #00b58b, #004131, #00b58b, #004131);
  background-size: 400% 400%;
  animation: gradientAnimation 15s ease infinite;
  border-radius: 0.5rem;
  padding: 0.5rem;
}

.modal-content {
  position: absolute;
  z-index: 1000;
  background: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 16px;
  width: 200px;
  border: 1px solid #e5e7eb;
  transform: translateZ(0); /* Force hardware acceleration */
}

@keyframes gradientAnimation {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@media (max-width: 640px) {
  .app { @apply p-4; }
  .controls { @apply flex-col; }
  .user-card { @apply flex-col items-start gap-4; }
  .user-meta { @apply w-full justify-between; }
  .modal-content {
    width: 150px;
    left: 10px !important;
    top: auto !important;
    bottom: 10px;
  }
}
</style>