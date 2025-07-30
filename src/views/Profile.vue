
<script setup>
import { URL } from '@/auth/url'
import router from '@/router'
import { Icon } from '@iconify/vue'
import axios from 'axios'
import { ref, computed, onMounted } from 'vue'
import PDFViewer from '@/components/Others/ppdf.vue'
import { onUnmounted } from 'vue'
import translateText from '@/auth/Translate'
import { inject } from 'vue'

const user = ref({})
const BildirishnomalarData = ref([])
const editForm = ref({ ...user.value, password: '', confirmPassword: '' })
const activeTab = ref('sozlamalar')
const isEditing = ref(true)
const info = ref([])
const tasks = ref([])
const obligations = ref([])
const Bildirishnomalar = ref({ email: true, browser: true, invoices: true, payments: true, reports: false })
const darkMode = ref(false)
const isLoading = inject('isLoading')
const settings = ref({
  theme: 'system-default',
  language: localStorage.getItem('til') || 'english', // Initialize language from localStorage
  dateFormat: 'mm/dd/yyyy'
})
const selectedFilePath = ref(null)
const selectedFileName = ref(null)

// Fetch user data from backend
const GetUser = async () => {
  isLoading.value = false
  try {
    const res = await axios.get(`${URL}/${localStorage.getItem('role')}/${parseInt(localStorage.getItem('id'))}`)
    const data = res.data
    user.value = {
      id: data.id || null,
      name: data.name || 'Unknown',
      email: data.username || '',
      avatar: data.img ? `${URL}/upload/${data.img}` : user.value.avatar,
      user: data,
    }
    BildirishnomalarData.value = data.Notification || []
    editForm.value = { ...user.value, password: '', confirmPassword: '' }
  } catch (error) {
    console.error('Failed to fetch user data:', error)
  }finally{
  isLoading.value = false
}
}

// Check system theme
function checkSystemTheme() {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  darkMode.value = prefersDark
  document.documentElement.classList.toggle('dark', prefersDark)
  settings.value.theme = prefersDark ? 'dark' : 'light'
}

// Handle theme changes
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

// Handle language change and save to localStorage
function handleLanguageChange(event) {
  const newLanguage = event.target.value
  settings.value.language = newLanguage
  localStorage.setItem('til', newLanguage) // Save to localStorage
  window.location.reload()
}

// Fetch required files
const getRequireFiles = async () => {
  isLoading.value = true
  try {
    const response = await axios.get(`${URL}/signingFiles/${parseInt(localStorage.getItem('id'))}`)
    info.value = response.data.userFiles.filter(item => item.type === 'info')
    obligations.value = response.data.userFiles.filter(item => item.type === 'obligations')
    tasks.value = response.data.userFiles.filter(item => item.type === 'tasks')
  } catch (error) {
    console.error('Fayllarni olishda xatolik:', error)
  } finally{
    isLoading.value = false
  }
}

// Status text and color
const getStatusText = (status) => {
  if (status === 'waiting') return 'Kutish'
  if (status === 'signaturePending') return 'Imzo kutulmoqda'
  if (status === 'signed') return 'imzolangan'
  if (status === 'rejected') return 'Rad etilgan'
  if (status === 'revision') return 'Qayta korib chiqish talab etiladi'
  return status
}

const getStatusColor = (status) => {
  if (status === 'waiting') return 'bg-yellow-300 text-yellow-800'
  if (status === 'signaturePending') return 'bg-blue-400 text-blue-800'
  if (status === 'signed') return 'bg-green-500 text-white'
  if (status === 'rejected') return 'bg-red-500 text-white'
  if (status === 'revision') return 'bg-orange-600 text-white'
  return status
}

// Format date
const filteridTime = (date) => {
  let years = date.slice(0, 4)
  let month = date.slice(5, 7)
  let day = date.slice(8, 10)
  return `${day}.${month}.${years}`
}

// Open file in PDFViewer and set file name
const openFile = (filePath, fileName) => {
  selectedFilePath.value = filePath
  selectedFileName.value = fileName
}

// Download file
const downloadFile = async () => { 
  isLoading.value = true
  try {
    const response = await axios.get(selectedFilePath.value, {
      responseType: 'blob',
      headers: {
        // Add Authorization header if needed
      }
    })
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', selectedFileName.value || 'document.pdf')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Failed to download file:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  checkSystemTheme()
  getRequireFiles()
  GetUser()
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    if (settings.value.theme === 'system-default') {
      darkMode.value = event.matches
      document.documentElement.classList.toggle('dark', event.matches)
    }
  })
})

onUnmounted(() => {
  window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', () => {})
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
            <div class="h-40 qard"></div>
            <div class="px-6 pb-5 relative">
              <div class="flex flex-col md:flex-row md:items-end md:justify-between">
                <div class="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-5">
                  <div class="flex justify-center md:justify-start -mt-16 relative">
                    <div class="w-28 h-28 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden shadow-lg">
                      <img :src="user.avatar" alt="Profile" class="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div class="text-center md:text-left pt-2 md:pt-0">
                    <h1 class="text-2xl font-bold text-gray-800 dark:text-white">{{ settings.language === 'datakril' ? translateText(user.name) : user.name }}</h1>
                    <div class="flex flex-col md:flex-row md:items-center space-y-1 md:space-y-0 md:space-x-3">
                      <span class="text-indigo-600 dark:text-indigo-400 font-medium">{{ settings.language === 'datakril' ? translateText(user?.user?.lavozimi) : user?.user?.lavozimi }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tab Navigation -->
          <div class="border-b border-gray-200 dark:border-gray-700">
            <div class="px-6 flex overflow-x-auto hide-scrollbar">
              <div v-for="tab in ['mening malumotlarim', 'mening majburiyatlaring', 'mening vazifalaring', 'sozlamalar']" :key="tab"
                :class="[
                  'py-4 px-4 font-medium cursor-pointer border-b-2 transition-colors whitespace-nowrap',
                  activeTab === tab 
                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' 
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                ]"
                @click="activeTab = tab">
                {{ settings.language === 'datakril' ? translateText(tab.charAt(0).toUpperCase() + tab.slice(1)) : tab.charAt(0).toUpperCase() + tab.slice(1) }}
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
                  <div>
                    <label for="theme" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Mavzu
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
                      <option value="light">Oq</option>
                      <option value="dark">Qora</option>
                    </select>
                  </div>
                  <div>
                    <label for="language" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {{ settings.language === 'datakril' ? translateText('Til sozlamalari') : 'Til sozlamalari' }}
                    </label>
                    <select 
                      id="language" 
                      v-model="settings.language" 
                      @change="handleLanguageChange($event)"
                      :disabled="!isEditing"
                      class="w-full px-4 py-3 rounded-xl border border-gray-600
                      text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700
                      focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                      disabled:bg-gray-100 dark:disabled:bg-gray-800/50 disabled:text-gray-500 dark:disabled:text-gray-400
                      disabled:cursor-not-allowed transition-colors">
                      <option value="datalotin">Uzbek</option>
                      <option value="datakril">Kril</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="activeTab === 'mening malumotlarim'" class="space-y-8">
              <div v-for="item in info" :key="item.id">
                <div class="bg-gray-300 dark:bg-gray-700 p-2 rounded-lg flex justify-between items-center my-2" 
                     @click="openFile(`${URL}${item.filePath}`, item.name)">
                  <div class="flex items-center gap-2">
                    <Icon icon="bxs:file-pdf" class="w-[40px] h-[40px] text-red-500" />
                    <h3 class="text-[20px] font-semibold text-gray-800 dark:text-white">{{ settings.language === 'datakril' ? translateText(item.name) : item.name }}</h3>
                  </div>
                  <div class="flex items-center gap-2">
                    <p class="text-gray-600 px-2 text-[20px] dark:text-gray-400">{{ filteridTime(item.createdAt) }}</p>
                    <h3 perspective class="font-semibold px-4 py-1 rounded-lg text-[20px]" :class="getStatusColor(item.status)">{{ settings.language === 'datakril' ? translateText(getStatusText(item.status)) : getStatusText(item.status) }}</h3>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="activeTab === 'mening majburiyatlaring'" class="space-y-8">
              <div v-for="item in obligations" :key="item.id">
                <div class="bg-gray-300 dark:bg-gray-700 p-2 rounded-lg flex justify-between items-center my-2" 
                     @click="openFile(`${URL}${item.filePath}`, item.name)">
                  <div class="flex items-center gap-2">
                    <Icon icon="bxs:file-pdf" booking="true" class="w-[40px] h-[40px] text-red-500" />
                    <h3 class="text-[20px] font-semibold text-gray-800 dark:text-white">{{ settings.language === 'datakril' ? translateText(item.name) : item.name }}</h3>
                  </div>
                  <div class="flex items-center gap-2">
                    <p class="text-gray-600 px-2 text-[20px] dark:text-gray-400">{{ filteridTime(item.createdAt) }}</p>
                    <h3 class="font-semibold px-4 py-1 rounded-lg text-[20px]" :class="getStatusColor(item.status)">{{ settings.language === 'datakril' ? translateText(getStatusText(item.status)) : getStatusText(item.status) }}</h3>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="activeTab === 'mening vazifalaring'" class="space-y-8">
              <div v-for="item in tasks" :key="item.id">
                <div class="bg-gray-300 dark:bg-gray-700 p-2 rounded-lg flex justify-between items-center my-2" 
                     @click="openFile(`${URL}${item.filePath}`, item.name)">
                  <div class="flex items-center gap-2">
                    <Icon icon="bxs:file-pdf" class="w-[40px] h-[40px] text-red-500" />
                    <h3 class="text-[20px] font-semibold text-gray-800 dark:text-white">{{ settings.language === 'datakril' ? translateText(item.name) : item.name }}</h3>
                  </div>
                  <div class="flex items-center gap-2">
                    <p class="text-gray-600 px-2 text-[20px] dark:text-gray-400">{{ filteridTime(item.createdAt) }}</p>
                    <h3 class="font-semibold px-4 py-1 rounded-lg text-[20px]" :class="getStatusColor(item.status)">{{ settings.language === 'datakril' ? translateText(getStatusText(item.status)) : getStatusText(item.status) }}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <transition name="pdf-viewer">
      <div
        v-if="selectedFilePath"
        class="fixed inset-0 z-40 flex min-h-[100vh] justify-center dark:bg-[#1a2642] bg-white items-center"
      >
        <div class="absolute top-4 right-4 flex space-x-4">
          <!-- Close Button -->
          <button
            class="text-4xl dark:text-gray-400 hover:text-gray-300 transition-all duration-300 hover:scale-110 hover:rotate-90 animate-fade-in"
            @click="selectedFilePath = null; selectedFileName = null"
          >
            ×
          </button>
          <!-- Download Button -->
          <button
            class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-all duration-300 flex items-center gap-2"
            @click="downloadFile"
          >
            <Icon icon="bxs:download" class="w-5 h-5" />
            {{ settings.language === 'datakril' ? translateText('Yuklab olish') : 'Yuklab olish' }}
          </button>
        </div>
        <div class="w-full max-w-5xl p-5 max-h-[100vh] overflow-auto">
          <PDFViewer v-if="selectedFilePath" :file-path="selectedFilePath" />
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
* {
  transition-property: color, background-color, border-color;
  transition-duration: 300ms;
}
</style>
```