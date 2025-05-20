<template>
  <div>
    <!-- Sidebar Toggle Button -->


    <!-- Header -->
    <header class="fixed top-0 dark:bg-[#1e2a46] w-full z-20 flex justify-between items-center px-6 py-4 h-[90px] shadow-sm">
      <!-- <h1 class="text-white ml-20 font-semibold"><img class="w-[190px]" src="/logo1.png" alt=""></h1> -->
<Dark /> 
      <router-link to="/profile">
        <div class="w-[70px] h-[68px] rounded-full overflow-hidden">
          <img :src="getProfileImage(userInfoLotin.img)" alt="Profile" class="w-full h-full object-cover" />
        </div>
      </router-link>
      <div class="flex items-center space-x-4">
        <!-- Chat Icon -->
        <div @click="navigateToChat" class="relative cursor-pointer group">
          <Icon icon="token:chat" width="50" height="50" class="text-white" />
          <span v-if="messageCount > 0"
            class="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
            {{ messageCount }}
          </span>

          <!-- Hover Text Element -->
          <div class="absolute w-32 -left-12 top-14 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div class="bg-white text-gray-800 text-center py-1 px-2 rounded-md shadow-md">
              Xabarlar
            </div>
            <!-- Triangle pointer -->
            <div
              class="w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white mx-auto -mt-8 mb-2">
            </div>
          </div>
        </div>
        <!-- Notifications & Profile -->
        <div class="flex items-center space-x-3">
          <div @click="showNotificationModal" class="relative cursor-pointer group">
            <Icon icon="pajamas:notifications" class="text-white" width="40" height="40" />
            <span v-if="unreadCount > 0"
              class="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
              {{ unreadCount }}
            </span>

            <!-- Hover Text Element -->
            <div
              class="absolute w-32 -left-12 top-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div class="bg-white text-gray-800 text-center py-1 px-2 rounded-md shadow-md">
                Bildirishnomalar
              </div>
              <!-- Triangle pointer -->
              <div
                class="w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white mx-auto -mt-8 mb-2">
              </div>
            </div>
          </div>
        </div>

        <!-- Search Box -->
        <div class="relative hidden md:flex items-center">
          <Icon icon="line-md:search" width="24" height="24" class="absolute left-3 text-gray-400" />
          <input type="text" v-model="searchStore.query" placeholder="Qidiruv..."
            class="pl-10 pr-4 py-2 border border-gray-300 rounded-md bg-transparent text-white focus:outline-none focus:border-blue-500 w-48 md:w-64 transition-all duration-200 placeholder-gray-400" />
        </div>

      </div>
    </header>

    <!-- Notification Modal -->
    <NotificationModal v-if="showModal" @close="closeNotificationModal" />

    <!-- Main Layout -->
    <div class="flex min-h-screen bg-gray-100">
      <Aside class="fixed left-0 top-0 h-full w-16 transition-all duration-500 ease-in-out z-10" />
      <main :class="[
        'flex-1 mt-[90px] transition-all ml-16 duration-500 ease-in-out',
      ]">
        <router-view />
        <Js />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, inject, watch, provide } from 'vue'
import { useRouter } from 'vue-router'
import Aside from '../layout/Sidebar.vue'
import NotificationModal from '../dashboard/notificationModal.vue'
import axios from 'axios'
import { URL } from '@/auth/url.js'
import { Icon } from '@iconify/vue'
import { io } from 'socket.io-client'
import translateText from '@/auth/Translate'
import { useSearchStore } from './searchQuary'
import Dark from '../dark.vue'
import Js from './js.vue'

const searchStore = useSearchStore()
const showModal = ref(false)
const isLoading = inject('isLoading')
const isAsideVisible = ref(true) // Sidebar initially open
provide('isAsideVisible', isAsideVisible) // Provide to children
const userInfo = ref({})
const userInfoLotin = ref({})
const isOnline = ref(false)
const unreadCount = ref(0)
const messageCount = ref(0)
const error = ref(null)
const router = useRouter()
const dat = ref('datalotin')
provide('dat', dat)

// Get user information from localStorage
const userId = localStorage.getItem('id')
const userIdNum = userId ? parseInt(userId) : null
const userRole = localStorage.getItem('role')

// UI interactions
const toggleAside = () => {
  isAsideVisible.value = !isAsideVisible.value
}

const navigateToChat = () => {
  if (userId) {
    router.push(`/chat/${userId}`)
  }
}

const showNotificationModal = () => {
  showModal.value = true
}

const closeNotificationModal = () => {
  showModal.value = false
  fetchUnreadCount()
}

const getProfileImage = (imgPath) => {
  return imgPath ? `${URL}/upload/${imgPath}` : '/default-avatar.png'
}

// Data fetching
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
      router.push('/login')
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
      router.push('/login')
    }
  } finally {
    isLoading.value = false
  }
}

const fetchUnreadMessageCount = async () => {
  if (!userIdNum) return

  try {
    const response = await axios.get(`${URL}/messages/unread/${userIdNum}`)
    messageCount.value = response.data.length
  } catch (error) {
    console.error('Error fetching unread message count:', error)
  }
}

const fetchUnreadCount = async () => {
  if (!userIdNum) return

  try {
    const response = await axios.get(`${URL}/accauntant-notification/unread/count?userId=${userIdNum}`)
    unreadCount.value = response.data
  } catch (error) {
    console.error('Error fetching unread count:', error)
  }
}

const fetchUnreadNotifications = async () => {
  await fetchUnreadCount()
}

// Socket connections
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
    console.log('Socket connected successfully')
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
    messageCount.value += 1
  })

  socket.on('messageRead', () => {
    if (messageCount.value > 0) {
      messageCount.value -= 1
    }
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

onMounted(async () => {
  await fetchUserData()
  await fetchUnreadCount()
  await fetchUnreadMessageCount()

  watch(messageCount, (newVal) => {
    localStorage.setItem('messageCount', newVal)
  })
})

onUnmounted(() => {
  const socket = inject('socket')
  if (socket) {
    socket.disconnect()
  }
})
</script>