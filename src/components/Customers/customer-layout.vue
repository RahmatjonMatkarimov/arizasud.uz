<template>
  <div>
    <!-- Header -->
    <header :class="[
      'fixed top-0 z-20 w-full flex justify-between items-center px-6 py-4 h-[90px] shadow-xl transition-all duration-500',
      // Dark mode
      'dark:bg-gradient-to-r dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 dark:border-b dark:border-slate-700/50',
      // Light mode
      'bg-gradient-to-r from-white via-gray-50 to-white border-b border-gray-200/80 backdrop-blur-sm'
    ]">
      <!-- Search Box -->
      <div class="relative hidden md:flex items-center">
        <Icon icon="line-md:search" width="20" height="20" :class="[
          'absolute left-3',
          // Dark mode
          'dark:text-slate-400',
          // Light mode
          'text-gray-400'
        ]" />
        <input type="search" v-model="searchStore.query" name="search" autocomplete="off" :placeholder="$t('qidiruv')"
          :class="[
            'pl-10 pr-4 py-2.5 border rounded-xl w-48 md:w-64 transition-all duration-300',
            // Dark mode
            'dark:border-slate-600 dark:bg-slate-700/50 dark:text-slate-200 dark:focus:border-emerald-400 dark:focus:bg-slate-700 dark:placeholder-slate-400 dark:hover:border-slate-500',
            // Light mode
            'border-gray-300 bg-white/80 text-gray-700 focus:border-blue-400 focus:bg-white placeholder-gray-500 hover:border-gray-400 shadow-sm focus:shadow-md '
          ]" />
      </div>

      <div class="flex items-center space-x-6">
        <Dark />

        <!-- Chat Icon -->
        <div @click="navigateToChat" class="relative cursor-pointer group">
          <div :class="[
            'p-2 rounded-xl transition-all duration-300 hover:scale-110',
            // Dark mode
            'dark:bg-slate-700/50 dark:hover:bg-emerald-500/20',
            // Light mode
            'bg-gray-100/80 hover:bg-blue-100/80 shadow-md hover:shadow-lg'
          ]">
            <Icon icon="token:chat" width="28" height="28" :class="[
              'transition-colors duration-300',
              // Dark mode
              'dark:text-slate-300 dark:hover:text-emerald-400',
              // Light mode
              'text-gray-600 hover:text-blue-600'
            ]" />
          </div>
          <span v-if="messageCount > 0"
            class="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-lg">
            {{ messageCount }}
          </span>
          <div
            class="absolute -left-6 -bottom-[999999999999999px] group-hover:top-14 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-30">
            <div :class="[
              'text-center py-2 px-3 rounded-lg shadow-xl border',
              // Dark mode
              'dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200',
              // Light mode
              'bg-white border-gray-200 text-gray-700 shadow-2xl'
            ]">
              {{ dat === 'datakril' ? translateText('Xabarlar') : 'Xabarlar' }}
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

        <!-- Notifications -->
        <div @click="showNotificationModal" class="relative cursor-pointer group">
          <div :class="[
            'p-2 rounded-xl transition-all duration-300 hover:scale-110',
            // Dark mode
            'dark:bg-slate-700/50 dark:hover:bg-emerald-500/20',
            // Light mode
            'bg-gray-100/80 hover:bg-blue-100/80 shadow-md hover:shadow-lg'
          ]">
            <Icon icon="pajamas:notifications" width="28" height="28" :class="[
              'transition-colors duration-300',
              // Dark mode
              'dark:text-slate-300 dark:hover:text-emerald-400',
              // Light mode
              'text-gray-600 hover:text-blue-600'
            ]" />
          </div>
          <span v-if="unreadCount > 0"
            class="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-lg">
            {{ unreadCount }}
          </span>
          <div
            class="absolute -left-16 -bottom-[999999999999999px] group-hover:top-14 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-30">
            <div :class="[
              'text-center py-2 px-3 rounded-lg shadow-xl border',
              // Dark mode
              'dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200',
              // Light mode
              'bg-white border-gray-200 text-gray-700 shadow-2xl'
            ]">
              {{ dat === 'datakril' ? translateText('Bildirishnomalar') : 'Bildirishnomalar' }}
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

        <div @click="router.push('/customers-reminders')" class="relative cursor-pointer group">
          <div :class="[
            'p-2 rounded-xl transition-all duration-300 hover:scale-110',
            // Dark mode
            'dark:bg-slate-700/50 dark:hover:bg-emerald-500/20',
            // Light mode
            'bg-gray-100/80 hover:bg-blue-100/80 shadow-md hover:shadow-lg'
          ]">
            <Icon icon="line-md:check-list-3" width="28" height="28" :class="[
              'transition-colors duration-300',
              // Dark mode
              'dark:text-slate-300 dark:hover:text-emerald-400',
              // Light mode
              'text-gray-600 hover:text-blue-600'
            ]" />
          </div>
          <div
            class="absolute w-64 -left-24 -bottom-[999999999999999px] group-hover:top-14 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 -z-50">
            <div :class="[
              'text-center py-2 px-3 rounded-lg shadow-xl border',
              // Dark mode
              'dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200',
              // Light mode
              'bg-white border-gray-200 text-gray-700 shadow-2xl'
            ]">
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

        <!-- Language Selector -->
        <div class="relative group">
          <div :class="[
            'flex items-center cursor-pointer p-2 rounded-xl transition-all duration-300 hover:scale-105',
            // Dark mode
            'dark:bg-slate-700/50 dark:hover:bg-emerald-500/20',
            // Light mode
            'bg-gray-100/80 hover:bg-blue-100/80 shadow-md hover:shadow-lg'
          ]" @click="toggleLanguageDropdown">
            <Icon icon="mdi:earth" width="24" height="24" :class="[
              'transition-colors duration-300 mr-2',
              // Dark mode
              'dark:text-slate-300 dark:hover:text-emerald-400',
              // Light mode
              'text-gray-600 hover:text-blue-600'
            ]" />
            <span :class="[
              'text-sm font-medium',
              // Dark mode
              'dark:text-slate-200',
              // Light mode
              'text-gray-700'
            ]">{{ selectedLanguage.label }}</span>
          </div>
          <!-- Dropdown Menu -->
          <div v-if="isLanguageDropdownOpen" :class="[
            'absolute right-0 mt-2 w-36 rounded-xl shadow-2xl z-30 overflow-hidden transform transition-all duration-300 origin-top border',
            // Dark mode
            'dark:bg-slate-800 dark:border-slate-600',
            // Light mode
            'bg-white border-gray-200',
            { 'scale-y-100 opacity-100': isLanguageDropdownOpen, 'scale-y-0 opacity-0': !isLanguageDropdownOpen }
          ]">
            <div v-for="(lang, index) in languages" :key="index" @click="changeLanguage(lang.code)" :class="[
              'px-4 py-3 transition-all duration-200 cursor-pointer border-b last:border-b-0',
              // Dark mode
              'dark:text-slate-200 dark:hover:bg-emerald-500/20 dark:hover:text-emerald-300 dark:border-slate-700',
              // Light mode
              'text-gray-700 hover:bg-blue-50 hover:text-blue-700 border-gray-100'
            ]">
              {{ lang.label }}
            </div>
          </div>
        </div>

        <div @click="router.push('/customers-profiles')"
          class="hover:scale-105 border-l-2 border-gray-600 pl-5 flex justify-end items-center gap-4 transition-transform duration-200">
          <div class="flex flex-col items-end">
            <h1 class="dark:text-gray-200 text-gray-800">{{ dat === 'datakril' ? translateText(`${userInfoLotin.name}
              ${userInfoLotin.surname} ${userInfoLotin.dadname}`) : `${userInfoLotin.name} ${userInfoLotin.surname}
              ${userInfoLotin.dadname}` }}</h1>
            <h1 class="dark:text-gray-200/50 to-gray-800/50">{{ dat === 'datakril' ?
              translateText(userInfoLotin.lavozimi) : userInfoLotin.lavozimi }}</h1>
          </div>
          <div :class="[
            'w-[60px] h-[60px] rounded-full overflow-hidden ring-2 transition-all duration-300',
            // Dark mode
            'dark:ring-emerald-400/30 dark:hover:ring-emerald-400/60',
            // Light mode  
            'ring-blue-400/40 hover:ring-blue-500/70 shadow-lg hover:shadow-xl'
          ]">
            <img :src="getProfileImage(userInfoLotin.img)" alt="Profile" class="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </header>

    <!-- Notification Modal -->
    <NotificationModal v-if="showModal" @close="closeNotificationModal" />

    <!-- Main Layout -->
    <div class="flex min-h-screen">


      <main :class="[
        'flex-1 mt-[90px] transition-all duration-500 ease-in-out min-h-[calc(100vh-90px)]',

      ]">
        <div class="">
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
/* Custom Scrollbar Styles */
.scrollbar-custom {
  scrollbar-width: thin;
  scrollbar-gutter: stable;
}

.scrollbar-custom::-webkit-scrollbar {
  width: 8px;
}

.scrollbar-custom::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 10px;
  margin: 8px 0;
}

.scrollbar-custom::-webkit-scrollbar-thumb {
  border-radius: 10px;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, rgba(148, 163, 184, 0.3), rgba(148, 163, 184, 0.6));
}

.scrollbar-custom::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, rgba(148, 163, 184, 0.6), rgba(148, 163, 184, 0.8));
  transform: scaleY(1.1);
}

/* Dark mode scrollbar */
.dark .scrollbar-custom::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, rgba(71, 85, 105, 0.4), rgba(71, 85, 105, 0.7));
}

.dark .scrollbar-custom::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.4), rgba(16, 185, 129, 0.7));
  box-shadow: 0 0 10px rgba(16, 185, 129, 0.3);
}

/* Light mode scrollbar */
.scrollbar-custom::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, rgba(156, 163, 175, 0.3), rgba(156, 163, 175, 0.6));
}

.scrollbar-custom::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.4), rgba(59, 130, 246, 0.7));
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.3);
}

/* Firefox scrollbar */
.scrollbar-custom {
  scrollbar-color: rgba(148, 163, 184, 0.5) transparent;
}

.dark .scrollbar-custom {
  scrollbar-color: rgba(71, 85, 105, 0.5) transparent;
}

/* Additional smooth scrolling */
.scrollbar-custom {
  scroll-behavior: smooth;
}

/* Hide scrollbar on mobile */
@media (max-width: 768px) {
  .scrollbar-custom {
    scrollbar-width: none;
  }

  .scrollbar-custom::-webkit-scrollbar {
    display: none;
  }
}
</style>

<script setup>
import { ref, onMounted, computed, onUnmounted, inject, watch, provide } from 'vue'
import { useRouter } from 'vue-router'
import NotificationModal from '../dashboard/notificationModal.vue'
import { useI18n } from 'vue-i18n'
import axios from 'axios'
import { Icon } from '@iconify/vue'
import { io } from 'socket.io-client'
import translateText from '@/auth/Translate'
import { useSearchStore } from '@/components/Templates/searchQuary'
import Dark from '../dark.vue'
import { URL } from "@/auth/url.js";
import { useRoute } from "vue-router";

const router = useRouter()
const route = useRoute();
const id = localStorage.getItem("id");
const newId = parseInt(id);
const data = ref({});
const isCollapsed = ref(false);
const { locale } = useI18n()
const searchStore = useSearchStore()
const showModal = ref(false)
const isAsideVisible = ref(true)
provide('isAsideVisible', isAsideVisible)
const userInfo = ref({})
const userInfoLotin = ref({})
const isOnline = ref(false)
const unreadCount = ref(0)
const messageCount = ref(0)
const error = ref(null)
const dat = ref("")
const isLanguageDropdownOpen = ref(false)
const storedLang = localStorage.getItem('til')
const userId = localStorage.getItem('id')
const userIdNum = userId ? parseInt(userId) : null
const userRole = localStorage.getItem('role')
const languages = ref([
  { code: 'uzb', label: 'O‘ZB' },
  { code: 'ўзб', label: 'ЎЗБ' },
  { code: 'ru', label: 'РУС' },
  { code: 'en', label: 'ENG' },
])
const initialLangCode = storedLang === 'datalotin' ? 'uzb' : storedLang === 'datakril' ? 'ўзб' : 'uzb'
const selectedLanguage = ref(languages.value.find(lang => lang.code === initialLangCode) || languages.value[0])


const menuItems = [
  { to: "/home", label: "Ishchi hodimlar ro'yxati", icon: "mdi:account-group", condition: true },
];

const filteredMenu = computed(() => {
  return menuItems.filter(item => (typeof item.condition === "function" ? item.condition() : item.condition));
});

const open = () => window.open("https://github.com/");



dat.value = storedLang || 'datalotin' // Set dat based on localStorage or default to 'datalotin'
locale.value = initialLangCode // Set initial locale

const changeLanguage = (langCode) => {
  const data = langCode === 'uzb' ? 'datalotin' : 'datakril'
  dat.value = data
  locale.value = langCode
  localStorage.setItem('til', data)
  inject('dat', data)
  selectedLanguage.value = languages.value.find(lang => lang.code === langCode)
  isLanguageDropdownOpen.value = false
  window.location.reload()
}

const toggleLanguageDropdown = () => {
  isLanguageDropdownOpen.value = !isLanguageDropdownOpen.value
}
const fetchAdminData = async () => {
  try {
    const response = await axios.get(`${URL}/${localStorage.getItem("role")}/${newId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    data.value = response.data.permissions[response.data.permissions.length - 1];
  } catch (error) {
    console.error("Xatolik yuz berdi:", error);
  }
};
onMounted(fetchAdminData);

watch(dat, (newValue) => {
  dat.value = newValue
})


const getProfileImage = (imgPath) => {
  return imgPath ? `${URL}/upload/${imgPath}` : '/default-avatar.png'
}

const navigateToChat = () => {
  if (userId) {
    messageCount.value = 0
    router.push(`/customers-chat/${userId}`)
  }
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
  } finally {
  }
}

const fetchUnreadNotifications = async () => {
  getUnreadCount()
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