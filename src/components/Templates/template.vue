<template>
  <div>
    <header class="fixed top-0 bg-[#1e2a46] w-full z-20 flex justify-between items-center px-6 py-4 h-[90px] shadow-sm">
      <div  @click="router.push('/profile')">
        <div class="w-[70px] h-[68px] rounded-full overflow-hidden">
          <img :src="getProfileImage(userInfoLotin.img)" alt="Profile" class="w-full h-full object-cover" />
        </div>
      </div>
      <div class="flex items-center space-x-4">
        <div @click="router.push('/reminder')" class="relative cursor-pointer group">
          <div :class="[
            'p-2 rounded-xl transition-all duration-300 hover:scale-110',
          ]">
            <Icon icon="line-md:check-list-3" width="35" height="35" :class="[
              'transition-colors duration-300',
              // Dark mode
              'text-slate-300 hover:text-emerald-400',
            ]" />
          </div>
          <div class="absolute w-64 -left-24 -bottom-[999999999999999px] group-hover:top-14 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
            <div class="bg-white text-gray-800 text-center py-1 px-2 rounded-md shadow-md">
              {{ dat === 'datakril' ? translateText('Kundalik bajarilgan ishlar') : 'Kundalik bajarilgan ishlar' }}
            </div>
            <div :class="[
              'w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent mx-auto -mt-4',
              // Dark mode
              'dark:border-b-slate-800',
              // Light mode
              'border-b-white'
            ]"></div>
          </div>
        </div>
        <!-- Chat Icon -->
        <div @click="navigateToChat" class="relative cursor-pointer group">
          <Icon icon="token:chat" width="50" height="50" class="text-white" />
          <span v-if="messageCount > 0"
            class="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
            {{ messageCount }}
          </span>
          <div class="absolute w-32 -left-12 -bottom-[999999999999999px] group-hover:top-14 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div class="bg-white text-gray-800 text-center py-1 px-2 rounded-md shadow-md">
              {{ dat === 'datakril' ? translateText('Xabarlar') : 'Xabarlar' }}
            </div>
            <div
              class="w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white mx-auto -mt-8 mb-2">
            </div>
          </div>
        </div>
        <!-- Notifications -->
        <div @click="showNotificationModal" class="relative cursor-pointer group">
          <Icon icon="pajamas:notifications" class="text-white" width="40" height="40" />
          <span v-if="unreadCount > 0"
            class="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
            {{ unreadCount }}
          </span>
          <div
            class="absolute w-32 -left-12 -bottom-[999999999999999px] group-hover:top-14 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div class="bg-white text-gray-800 text-center py-1 px-2 rounded-md shadow-md">
              {{ dat === 'datakril' ? translateText('Bildirishnomalar') : 'Bildirishnomalar' }}
            </div>
            <div
              class="w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white mx-auto -mt-8 mb-2">
            </div>
          </div>
        </div>

        <!-- Language Selector -->
        <div class="relative group">
          <div class="flex items-center cursor-pointer" @click="toggleLanguageDropdown">
            <Icon icon="mdi:earth" width="30" height="30" class="text-white mr-2" />
            <span class="text-white text-[20px] font-medium">{{ selectedLanguage.label }}</span>
          </div>
          <!-- Dropdown Menu -->
          <div v-if="isLanguageDropdownOpen"
            class="absolute right-0 mt-2 w-32 dark:bg-gray-600 bg-white rounded-md shadow-lg z-50 overflow-hidden transition-all duration-300 transform origin-top scale-y-0 group-hover:scale-y-100"
            :class="{ 'scale-y-100': isLanguageDropdownOpen }">
            <div v-for="(lang, index) in languages" :key="index"
              @click="changeLanguage(lang.code)"
              class="px-4 py-2 dark:text-gray-200 text-gray-800 transition-colors duration-200 cursor-pointer">
              {{ lang.label }}
            </div>
          </div>
        </div>
        <!-- Search Box -->
        <div class="relative hidden md:flex items-center">
          <Icon icon="line-md:search" width="24" height="24" class="absolute left-3 text-gray-400" />
          <input type="text" v-model="searchStore.query" :placeholder="$t('qidiruv')"
            class="pl-10 pr-4 py-2 border border-gray-300 rounded-md bg-transparent text-white focus:outline-none focus:border-blue-500 w-48 md:w-64 transition-all duration-200 placeholder-gray-400" />
        </div>
        <Dark />
      </div>
    </header>

    <!-- Notification Modal -->
    <NotificationModal v-if="showModal" @close="closeNotificationModal" />

    <!-- Main Layout -->
    <div class="flex min-h-screen">
      <Aside class="fixed left-0 top-0 h-full w-16 transition-all duration-500 ease-in-out z-10" />
      <main :class="['flex-1 mt-[90px] transition-all ml-16 duration-500 ease-in-out']">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, inject, watch, provide } from 'vue'
import { useRouter } from 'vue-router'
import Aside from '../layout/Sidebar.vue'
import NotificationModal from '../dashboard/notificationModal.vue'
import { useI18n } from 'vue-i18n'
import axios from 'axios'
import { URL } from '@/auth/url.js'
import { Icon } from '@iconify/vue'
import { io } from 'socket.io-client'
import translateText from '@/auth/Translate'
import { useSearchStore } from './searchQuary'
import Dark from '../dark.vue'

const { locale } = useI18n()
const searchStore = useSearchStore()
const showModal = ref(false)
const isLoading = ref(false)
const isAsideVisible = ref(true)
provide('isAsideVisible', isAsideVisible)
const userInfo = ref({})
const userInfoLotin = ref({})
const isOnline = ref(false)
const unreadCount = ref(0)
const messageCount = ref(0)
const error = ref(null)
const router = useRouter()
const dat = ref("")
const isLanguageDropdownOpen = ref(false)

const languages = ref([
  { code: 'uzb', label: 'O‘ZB' },
  { code: 'ўзб', label: 'ЎЗБ' },
  { code: 'ru', label: 'РУС' },
  { code: 'en', label: 'ENG' },
])

// Initialize selectedLanguage based on localStorage
const storedLang = localStorage.getItem('til')
const initialLangCode = storedLang === 'datalotin' ? 'uzb' : storedLang === 'datakril' ? 'ўзб' : 'uzb'
const selectedLanguage = ref(languages.value.find(lang => lang.code === initialLangCode) || languages.value[0])
dat.value = storedLang || 'datalotin' // Set dat based on localStorage or default to 'datalotin'
locale.value = initialLangCode // Set initial locale

const changeLanguage = (langCode) => {
  const data = langCode === 'uzb' ? 'datalotin' : 'datakril'
  dat.value = data
  locale.value = langCode
  localStorage.setItem('til', data)
  selectedLanguage.value = languages.value.find(lang => lang.code === langCode)
  isLanguageDropdownOpen.value = false
  window.location.reload()
}

const toggleLanguageDropdown = () => {
  isLanguageDropdownOpen.value = !isLanguageDropdownOpen.value
}

watch(dat, (newValue) => {
  dat.value = newValue
})

const userId = localStorage.getItem('id')
const userIdNum = userId ? parseInt(userId) : null
const userRole = localStorage.getItem('role')

const getProfileImage = (imgPath) => {
  return imgPath ? `${URL}/upload/${imgPath}` : '/default-avatar.png'
}



const showNotificationModal = () => {
  showModal.value = true
}

const closeNotificationModal = () => {
  showModal.value = false
  getUnreadCount()
}

const fetchUserData = async () => {
  if (!userIdNum || !userRole) {
    console.error('Missing user information')
    return
  }
  isLoading.value = true
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      console.error('Token not found. User is not authorized.')
      // router.push('/login')
      return
    }
    const response = await axios.get(`${URL}/${userRole}/${userIdNum}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    userInfoLotin.value = response.data
    userInfo.value = { ...response.data }
    for (const key in userInfo.value) {
      if (typeof userInfo.value[key] === 'string') {
        userInfo.value[key] = translateText(userInfo.value[key])
      }
    }
    const onlineResponse = await axios.get(`${URL}/${userRole}/online`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    checkOnlineStatus(onlineResponse.data.map((user) => String(user.id)))
  } catch (err) {
    console.error('Error fetching user data:', err.response?.data || err.message)
    error.value = 'Error loading data.'
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      // router.push('/login')
    }
  } finally {
    isLoading.value = false
  }
}

const fetchUnreadMessageCount = async () => {
  if (!userIdNum) return
  isLoading.value = true
  try {
    const response = await axios.get(`${URL}/messages/unread/${userIdNum}`)
    messageCount.value = response.data.length
  } catch (error) {
    console.error('Error fetching unread message count:', error)
  } finally{
    isLoading.value = false
  }
}

const fetchUnreadCount = async () => {
  if (!userIdNum) return
  isLoading.value = true
  try {
    const response = await axios.get(`${URL}/accauntant-notification/unread/count?userId=${userIdNum}`)
    unreadCount.value = response.data
  } catch (error) {
    console.error('Error fetching unread count:', error)
  } finally{
    isLoading.value = false
  }
}

const fetchUnreadNotifications = async () => {
  await getUnreadCount()
}

const setupSocketConnection = () => {
  if (!userId || isNaN(parseInt(userId))) {
    console.error('Invalid user ID:', userId)
    return null
  }
  const socket = io(URL, {
    path: '/socket.io',
    transports: ['websocket', 'polling'],
    withCredentials: true,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    timeout: 20000,
    auth: { userId },
  })
  socket.on('connect', () => {
    socket.emit('joinUser', userId)
    socket.emit('getMessageCount', userIdNum)
  })
  socket.on('connect_error', (error) => {
    console.error('Socket.IO connection error:', error.message)
  })
  socket.on('adminOnlineUpdate', checkOnlineStatus)
  socket.on('newNotification', fetchUnreadNotifications)
  socket.on('messageCount', (count) => {
    messageCount.value = count
  })
  socket.on('newMessage', () => {
fetchUnreadMessageCount()
  })
  socket.on('messageRead', () => {
fetchUnreadMessageCount()
fetchUnreadMessageCount()

  })
  return socket
}

const checkOnlineStatus = (onlineUsers) => {
  if (Array.isArray(onlineUsers)) {
    isOnline.value = onlineUsers.includes(String(userId))
  }
}

const socket = setupSocketConnection()
if (socket) {
  provide('socket', socket)
}

const socketURL = URL || 'http://localhost:3000'
const socket1 = io(socketURL, {
  path: '/socket.io',
  transports: ['websocket', 'polling'],
  auth: {
    userId: parseInt(localStorage.getItem('id')) || 1,
  },
})

const setupSocketListeners = () => {
  socket1.on('connect', () => {
    const userId = parseInt(localStorage.getItem('id')) || 1
    socket1.emit('joinUser', userId)
  })
  socket1.on('unreadCount', (count) => {
    unreadCount.value = count
  })
  socket1.on('newNotification', () => {
    getUnreadCount()
  })
  socket1.on('error', (message) => {
    console.error('Socket Error:', message)
  })
}

const getUnreadCount = () => {
  const userId = parseInt(localStorage.getItem('id')) || 1
  socket1.emit('getUnreadCount', userId)
}
const navigateToChat = () => {
  if (userId) {
    router.push(`/chat/${userId}`)
    fetchUnreadMessageCount()
    messageCount.value = 0
  }
}
onMounted(async () => {
  await fetchUserData()
  await fetchUnreadCount()
  await fetchUnreadMessageCount()
  setupSocketListeners()
  getUnreadCount()
  watch(messageCount, (newVal) => {
    localStorage.setItem('messageCount', newVal)
  })
})

onUnmounted(() => {
  if (socket) {
    socket.disconnect()
  }
  if (socket1) {
    socket1.disconnect()
  }
})
</script>

<style scoped>
/* Additional styles for language dropdown */
.group:hover .scale-y-0 {
  transform: scale-y(1);
}
</style>