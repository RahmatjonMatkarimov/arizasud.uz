<script setup>
import { URL } from '@/auth/url'
import axios from 'axios'
import { ref, computed, onMounted } from 'vue'

const user = ref({
  id: null,
  name: '',
  email: '',
  position: '',
  joinDate: '',
  phone: '',
  address: '',
  avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg' // Fallback avatar
})

const BildirishnomalarData = ref([]) // Store backend Bildirishnomalar
const editForm = ref({ ...user.value, password: '', confirmPassword: '' })
const activeTab = ref('sozlamalar')
const isEditing = ref(true)
const Bildirishnomalar = ref({ email: true, browser: true, invoices: true, payments: true, reports: false })
const darkMode = ref(false)
const securityForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})
const settings = ref({
  theme: 'system-default',
  language: 'english',
  dateFormat: 'mm/dd/yyyy'
})
const sessions = ref([
  { device: 'Chrome on Windows', ip: '192.168.1.1', status: 'Active now', icon: 'desktop' },
  { device: 'Safari on macOS', ip: '192.168.1.2', status: 'Last active: 2 days ago', icon: 'laptop' }
])

// Fetch user data from backend
const GetUser = async () => {
  try {
    const res = await axios.get(`${URL}/${localStorage.getItem('role')}/${parseInt(localStorage.getItem('id'))}`)
    const data = res.data

    // Map backend data to user ref
    user.value = {
      id: data.id || null,
      name: data.name || 'Unknown',
      email: data.username || '', // Assuming username is used as email
      position: data.lavozimi || 'Unknown',
      phone: data.phone || '',
      avatar: data.img ? `${URL}/upload/${data.img}` : user.value.avatar ,// Construct image URL or use fallback
      user:data,
    }

    // Populate Bildirishnomalar data
    BildirishnomalarData.value = data.Notification || []

    // Update editForm with new user data
    editForm.value = { ...user.value, password: '', confirmPassword: '' }
  } catch (error) {
    console.error('Failed to fetch user data:', error)
    // Optionally show an error message in the UI
  }
}

// Theme toggling
function toggleTheme() {
  darkMode.value = !darkMode.value
  document.documentElement.classList.toggle('dark', darkMode.value)
}

// Check system preference initially
function checkSystemTheme() {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  darkMode.value = prefersDark
  document.documentElement.classList.toggle('dark', prefersDark)
  settings.value.theme = prefersDark ? 'dark' : 'light'
}

// Handle theme changes from dropdown
function handleThemeChange(event) {
  const newTheme = event.target.value
  settings.value.theme = newTheme
  if (newTheme === 'system-default') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    darkMode.value = prefersDark
    document.documentElement.classList.toggle('dark', prefersDark)
  } else {
    darkMode.value = newTheme === 'dark'
    document.documentElement.classList.toggle('dark', darkMode.value)
  }
}

// Save changes
function toggleEdit() {
  if (isEditing.value) {
    user.value = { 
      ...user.value,
      name: editForm.value.name,
      email: editForm.value.email,
      position: editForm.value.position,
      phone: editForm.value.phone,
      address: editForm.value.address,
      user: editForm.value,
    }
    securityForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  } else {
    editForm.value = { ...user.value }
  }
  isEditing.value = !isEditing.value
}

// When component mounts
onMounted(() => {
  checkSystemTheme()
  GetUser() // Fetch user data on mount
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    if (settings.value.theme === 'system-default') {
      darkMode.value = event.matches
      document.documentElement.classList.toggle('dark', event.matches)
    }
  })
})
</script>

<template>
  <div class="min-h-screen transition-colors duration-300 font-sans antialiased">
    <div class="min-h-screen bg-gray-200 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 p-4 md:p-8 transition-colors duration-300">
      <div class="max-w-4xl mx-auto">

        <!-- Profile Card -->
        <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 transition-all duration-300">
          <!-- Profile Header -->
          <div class="relative">
            <!-- Cover Image -->
            <div class="h-40 qard"></div>
            
            <!-- Profile Info -->
            <div class="px-6 pb-5 relative">
              <div class="flex flex-col md:flex-row md:items-end md:justify-between">
                <div class="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-5">
                  <!-- Avatar -->
                  <div class="flex justify-center md:justify-start -mt-16 relative">
                    <div class="w-28 h-28 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden shadow-lg">
                      <img :src="user.avatar" alt="Profile" class="w-full h-full object-cover" />
                    </div>
                  </div>

                  <!-- User Info -->
                  <div class="text-center md:text-left pt-2 md:pt-0">
                    <h1 class="text-2xl font-bold text-gray-800 dark:text-white">{{ user.name }}</h1>
                    <div class="flex flex-col md:flex-row md:items-center space-y-1 md:space-y-0 md:space-x-3">
                      <span class="text-indigo-600 dark:text-indigo-400 font-medium">{{ user.user.lavozimi }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tab Navigation -->
          <div class="border-b border-gray-200 dark:border-gray-700">
            <div class="px-6 flex overflow-x-auto hide-scrollbar">
              <div v-for="tab in ['sozlamalar']" :key="tab"
                :class="[
                  'py-4 px-4 font-medium cursor-pointer border-b-2 transition-colors whitespace-nowrap',
                  activeTab === tab 
                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' 
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                ]"
                @click="activeTab = tab">
                {{ tab.charAt(0).toUpperCase() + tab.slice(1) }}
              </div>
            </div>
          </div>

          <!-- Tab Content -->
          <div class="p-6">
            <div v-if="activeTab === 'sozlamalar'" class="space-y-8">
              <!-- Bildirishnomalar -->
              <div>
                <div class="space-y-4">
                  <div v-for="[key, label, desc] in [
                    ['email', 'Email Bildirishnomalar', 'Get updates delivered to your inbox'],
                    ['browser', 'Browser Bildirishnomalar', 'Receive alerts in your browser'],
                  ]" :key="key" 
                  class="flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-700">
                    <div>
                      <p class="font-medium text-gray-800 dark:text-white">{{ label }}</p>
                      <p class="text-sm text-gray-500 dark:text-gray-400">{{ desc }}</p>
                    </div>
                    
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" v-model="Bildirishnomalar[key]" :disabled="!isEditing" class="sr-only peer">
                      <div
                        class="w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full peer 
                        peer-checked:bg-indigo-500 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed
                        after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white 
                        after:rounded-full after:h-5 after:w-5 after:transition-all
                        peer-checked:after:translate-x-5"></div>
                    </label>
                  </div>
                </div>
              </div>
              
              <!-- Display Settings -->
              <div>
                <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-4">Display Settings</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- Theme -->
                  <div>
                    <label for="theme" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Theme
                    </label>
                    <select 
                      id="theme" 
                      v-model="settings.theme" 
                      @change="handleThemeChange($event)"
                      :disabled="!isEditing"
                      class="w-full px-4 py-3 rounded-xl border border-gray-600
                      text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700
                      focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                      disabled:bg-gray-100 dark:disabled:bg-gray-800/50 disabled:text-gray-500 dark:disabled:text-gray-400
                      disabled:cursor-not-allowed transition-colors">
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="system-default">System Default</option>
                    </select>
                  </div>

                  <!-- Language -->
                  <div>
                    <label for="language" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Language
                    </label>
                    <select 
                      id="language" 
                      v-model="settings.language" 
                      :disabled="!isEditing"
                      class="w-full px-4 py-3 rounded-xl border border-gray-600
                      text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700
                      focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                      disabled:bg-gray-100 dark:disabled:bg-gray-800/50 disabled:text-gray-500 dark:disabled:text-gray-400
                      disabled:cursor-not-allowed transition-colors">
                      <option value="english">kril</option>
                      <option value="uzbek">Uzbek</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <!-- Bildirishnomalar Tab -->
            <div v-if="activeTab === 'Bildirishnomalar'" class="space-y-6">
              <h3 class="text-xl font-bold text-gray-800 dark:text-white">Bildirishnomalar</h3>
              <div v-if="BildirishnomalarData.length === 0" class="text-gray-500 dark:text-gray-400">
                No Bildirishnomalar available.
              </div>
              <div v-else class="space-y-4">
                <div v-for="notification in BildirishnomalarData" :key="notification.id"
                  class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-700">
                  <p class="font-medium text-gray-800 dark:text-white">{{ notification.message }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    {{ new Date(notification.sentAt).toLocaleString() }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Hide scrollbar while maintaining functionality */
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Add smooth transition for all color changes */
* {
  transition-property: color, background-color, border-color;
  transition-duration: 300ms;
}
</style>