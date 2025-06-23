<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950 transition-all duration-700">
    <!-- Theme Toggle Button -->
    <div class="fixed top-6 right-6 z-50">
      <button 
        @click="toggleTheme"
        class="p-3 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-lg hover:shadow-xl backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
        :aria-label="isDark ? 'Light rejimga o\'tish' : 'Dark rejimga o\'tish'"
      >
        <svg v-if="isDark" class="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd" />
        </svg>
        <svg v-else class="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      </button>
    </div>

    <div class="container mx-auto px-4 py-8 max-w-7xl">
      <!-- Error State -->
      <div v-if="error" class="max-w-2xl mx-auto">
        <div class="glass-card border-red-200 dark:border-red-800 bg-red-50/80 dark:bg-red-900/20 text-center p-8">
          <div class="text-red-600 dark:text-red-400 text-2xl mb-4 flex justify-center">
            <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-red-800 dark:text-red-300 mb-2">{{ dat === 'datakril' ? translateText(`Xatolik yuz berdi`):`Xatolik yuz berdi` }}</h3>
          <p class="text-red-700 dark:text-red-400">{{ dat === 'datakril'? translateText(error):error }}</p>
          <button 
            @click="fetchWarehouse"
            class="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
          >
            {{ dat === 'datakril' ? translateText(`Qayta urinib ko'rish`) : `Qayta urinib ko'rish` }}
          </button>
        </div>
      </div>

      <!-- Warehouse Details -->
      <div v-else-if="warehouse" class="space-y-8">
        <!-- Header Card -->
        <div class="glass-card overflow-hidden">
          <div class="gradient-header text-white relative overflow-hidden">
            <div class="absolute inset-0 bg-black/10 dark:bg-black/20"></div>
            <div class="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
            <div class="absolute -bottom-4 -left-4 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
            
            <div class="relative p-8">
              <div class="flex items-center space-x-4">
                <div class="icon-container bg-white/20">
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                  </svg>
                </div>
                <div>
                  <h1 class="text-4xl font-bold mb-2 text-white">{{ dat === 'datakril' ? translateText(warehouse.name):warehouse.name }}</h1>
                  <p class="text-blue-100 dark:text-blue-200 text-lg font-medium">
                    {{ dat === 'datakril' ? translateText(`Ombor elementi tafsilotlari`):`Ombor elementi tafsilotlari` }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Left Column - Images -->
          <div class="lg:col-span-1 space-y-6">
            <!-- Main Image -->
            <div class="glass-card p-6">
              <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                <svg class="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                {{ dat === 'datakril' ? translateText(`Asosiy rasm`):`Asosiy rasm` }}
              </h3>
              <div class="image-container group">
                <img 
                  v-if="warehouse.images && warehouse.images.length > 0" 
                  :src="getImageUrl(warehouse.images[0].imageUrl)" 
                  :alt="warehouse.name"
                  class="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div v-else class="w-full h-64 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                  <div class="text-gray-400 dark:text-gray-500 text-center">
                    <svg class="w-16 h-16 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <p class="text-sm">{{ dat === 'datakril' ? translateText(`Rasm mavjud emas`):`Rasm mavjud emas` }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Additional Images -->
            <div v-if="warehouse.images && warehouse.images.length > 1" class="glass-card p-6">
              <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                <svg class="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
                {{ dat === 'datakril' ? translateText(`Qo'shimcha rasmlar`):`Qo'shimcha rasmlar` }}
              </h3>
              <div class="grid grid-cols-2 gap-3">
                <div 
                  v-for="(image, index) in warehouse.images.slice(1, 5)" 
                  :key="index"
                  class="image-container group"
                >
                  <img 
                    :src="getImageUrl(image.imageUrl)" 
                    :alt="`${warehouse.name} - ${index + 2}`"
                    class="w-full h-20 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              </div>
            </div>

            <!-- QR Code -->
            <div v-if="warehouse.qrCodeUrl" class="glass-card p-6 text-center">
              <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center justify-center">
                <svg class="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 16h4.01M12 8h4.01M12 16h.01"></path>
                </svg>
                {{ dat === 'datakril' ? translateText(`QR Kod`):`QR Kod` }}
              </h3>
              <div class="qr-code-wrapper">
                <img 
                  :src="getImageUrl(warehouse.qrCodeUrl)" 
                  alt="QR Code"
                  class="w-32 h-32 mx-auto"
                />
              </div>
            </div>
          </div>

          <!-- Right Column - Details -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Key Information -->
            <div class="glass-card p-6">
              <div class="card-header">
                <div class="icon-container bg-blue-500 dark:bg-blue-600">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200">{{ dat === 'datakril' ? translateText(`Asosiy ma'lumotlar`):`Asosiy ma'lumotlar` }}</h2>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Miqdori -->
                <div class="detail-row">
                  <span class="detail-label">{{ dat === 'datakril' ? translateText(`Miqdori`):`Miqdori` }}:</span>
                  <span class="detail-value text-emerald-600 dark:text-emerald-400 font-bold text-xl">
                    {{ warehouse.quantity }} {{ dat === 'datakril' ? translateText(`dona`):`dona` }}
                  </span>
                </div>

                <!-- Seriya Raqami -->
                <div class="detail-row">
                  <span class="detail-label">{{ dat === 'datakril' ? translateText(`Seriya Raqami`):`Seriya Raqami` }}:</span>
                  <span class="detail-value code-badge">{{ warehouse.id }}</span>
                </div>

                <!-- Holati -->
                <div class="detail-row">
                  <span class="detail-label">{{ dat === 'datakril' ? translateText(`Holati`):`Holati` }}:</span>
                  <span class="detail-value">
                    <span v-if="warehouse.condition" class="status-badge" :class="getConditionStyle(warehouse.condition)">
                      {{ dat === 'datakril' ? translateText(warehouse.condition):warehouse.condition }}
                    </span>
                    <span v-else class="status-badge bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                      {{ dat === 'datakril' ? translateText(`Noma'lum`):`Noma'lum` }}
                    </span>
                  </span>
                </div>

                <!-- Turgan joyi -->
                <div class="detail-row">
                  <span class="detail-label">{{ dat === 'datakril' ? translateText(`Turgan joyi`):`Turgan joyi` }}:</span>
                  <span class="detail-value">
                    <span v-if="warehouse.location" class="flex items-center">
                      <svg class="w-4 h-4 text-blue-500 dark:text-blue-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      {{ dat === 'datakril' ? translateText(warehouse.location):warehouse.location }}
                    </span>
                    <span v-else class="text-gray-500 dark:text-gray-400">{{ dat === 'datakril' ? translateText(`Belgilanmagan`):`Belgilanmagan` }}</span>
                  </span>
                </div>

                <!-- To'liq to'plam -->
                <div class="detail-row">
                  <span class="detail-label">{{ dat === 'datakril' ? translateText(`To'liq to'plam`):`To'liq to'plam` }}:</span>
                  <span class="detail-value">
                    <span class="status-badge" :class="warehouse.collection ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'">
                      {{ warehouse.collection ? dat === 'datakril' ? translateText('Ha'):'Ha' : dat === 'datakril' ? translateText('Yo\'q'):'Yo\'q' }}
                    </span>
                  </span>
                </div>

                <!-- Mas'ul shaxs -->
                <div class="detail-row">
                  <span class="detail-label">{{ dat === 'datakril' ? translateText(`Mas'ul shaxs`):`Mas'ul shaxs` }}:</span>
                  <span class="detail-value">
                    <span v-if="warehouse.whomBelongs" class="code-badge">{{ dat === 'datakril' ? translateText(warehouse.whomBelongs):warehouse.whomBelongs }}</span>
                    <span v-else class="text-gray-500 dark:text-gray-400">{{ dat === 'datakril' ? translateText(`Belgilanmagan`):`Belgilanmagan` }}</span>
                  </span>
                </div>

                <!-- Bo'lim nomi -->
                <div class="detail-row md:col-span-2">
                  <span class="detail-label">{{ dat === 'datakril' ? translateText(`Bo'lim nomi`):`Bo'lim nomi` }}:</span>
                  <span class="detail-value">
                    <span v-if="warehouse.category" class="category-badge">
                      {{ dat === 'datakril' ? translateText(warehouse.category.name):warehouse.category.name }}
                    </span>
                    <span v-else class="text-gray-500 dark:text-gray-400">{{ dat === 'datakril' ? translateText(`Kategoriya mavjud emas`):`Kategoriya mavjud emas` }}</span>
                  </span>
                </div>

                <!-- Sotib Olingan Sana -->
                <div class="detail-row md:col-span-2">
                  <span class="detail-label">{{ dat === 'datakril' ? translateText(`Sotib Olingan Sana`):`Sotib Olingan Sana` }}:</span>
                  <span class="detail-value">
                    <span v-if="warehouse.purchaseDate" class="date-badge">
                      {{ formatDate(warehouse.purchaseDate) }}
                    </span>
                    <span v-else class="text-gray-500 dark:text-gray-400">{{ dat === 'datakril' ? translateText(`Belgilanmagan`):`Belgilanmagan` }}</span>
                  </span>
                </div>
              </div>
            </div>

            <!-- Description -->
            <div v-if="warehouse.description" class="glass-card p-6">
              <div class="card-header">
                <div class="icon-container bg-purple-500 dark:bg-purple-600">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"></path>
                  </svg>
                </div>
                <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200">{{ dat === 'datakril' ? translateText(`Tavsif`):`Tavsif` }}</h2>
              </div>
              <div class="description-box">
                <p class="text-gray-700 dark:text-gray-300 leading-relaxed">{{ dat === 'datakril' ? translateText(warehouse.description):warehouse.description }}</p>
              </div>
            </div>

            <!-- System Information -->
            <div class="glass-card p-6">
              <div class="card-header">
                <div class="icon-container bg-indigo-500 dark:bg-indigo-600">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200">{{ dat === 'datakril' ? translateText(`Tizim ma'lumotlari`):`Tizim ma'lumotlari` }}</h2>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="date-card">
                  <div class="text-center">
                    <div class="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">{{ dat === 'datakril' ? translateText(`Yaratilgan`):`Yaratilgan` }}</div>
                    <div class="font-bold text-emerald-600 dark:text-emerald-400 text-lg">
                      {{ formatDateTime(warehouse.createdAt) }}
                    </div>
                  </div>
                </div>
                
                <div class="date-card">
                  <div class="text-center">
                    <div class="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">{{ dat === 'datakril' ? translateText(`So'nggi yangilanish`):`So'nggi yangilanish` }}</div>
                    <div class="font-bold text-blue-600 dark:text-blue-400 text-lg">
                      {{ formatDateTime(warehouse.updatedAt) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import translateText from '@/auth/Translate'
import { URL } from '@/auth/url'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const warehouse = ref(null)
const loading = ref(true)
const error = ref(null)
const warehouseId = route.params.id
const isDark = ref(true) // Default dark mode
const dat = ref("datalotin")
const isLoading = inject('isLoading')
let intervalId = null

const checkLanguageChange = () => {
    const currentLang = localStorage.getItem("til") || "datalotin"
    if (currentLang !== dat.value) {
        dat.value = currentLang
    }
}

onMounted(() => {
    intervalId = setInterval(checkLanguageChange, 0)
})

onUnmounted(() => {
    if (intervalId) clearInterval(intervalId)
})
// Theme management
const toggleTheme = () => {
  isDark.value = !isDark.value
  updateTheme()
}

const updateTheme = () => {
  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

const initializeTheme = () => {
  const savedTheme = localStorage.getItem('theme')
  isDark.value = savedTheme !== 'light'
  updateTheme()
}

const fetchWarehouse = async () => {
  isLoading.value = true
  try {
    loading.value = true
    error.value = null
    const response = await fetch(`${URL}/warehouse/${warehouseId}`)
    
    if (!response.ok) {
      throw new Error(`Warehouse topilmadi (ID: ${warehouseId})`)
    }
    
    warehouse.value = await response.json()
  } catch (err) {
    error.value = err.message
    console.error('Warehouse ma\'lumotlarini olishda xatolik:', err)
  } finally {
    loading.value = false
    isLoading.value = false
  }
}

const getImageUrl = (path) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${URL}${path}`
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('uz-UZ', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('uz-UZ', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getConditionStyle = (condition) => {
  const styles = {
    'Yangi': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    'Yaxshi': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    'Qoniqarli': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    'Yomon': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    'Ishlamaydi': 'bg-gray-100 text-gray-700 dark:bg-gray-800/30 dark:text-gray-300'
  }
  return styles[condition] || 'bg-gray-100 text-gray-700 dark:bg-gray-800/30 dark:text-gray-300'
}

onMounted(() => {
  initializeTheme()
  fetchWarehouse()
})
</script>

<style scoped>
/* Glass morphism cards */
.glass-card {
  @apply bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-xl shadow-black/5 dark:shadow-black/20 border border-white/20 dark:border-gray-700/50;
}

.gradient-header {
  @apply bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-700 dark:via-indigo-700 dark:to-purple-700;
}

.icon-container {
  @apply w-12 h-12 rounded-xl flex items-center justify-center backdrop-blur-sm flex-shrink-0;
}

.card-header {
  @apply flex items-center space-x-4 mb-6 pb-4 border-b border-gray-200/50 dark:border-gray-700/50;
}

.detail-row {
  @apply flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-50/80 dark:bg-gray-700/50 rounded-xl backdrop-blur-sm hover:bg-gray-100/80 dark:hover:bg-gray-700/70 transition-all duration-200;
}

.detail-label {
  @apply text-gray-600 dark:text-gray-400 font-semibold text-sm uppercase tracking-wide mb-1 sm:mb-0;
}

.detail-value {
  @apply text-gray-800 dark:text-gray-200 font-medium;
}

.code-badge {
  @apply font-mono text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-lg;
}

.status-badge {
  @apply font-semibold px-3 py-1 rounded-full text-sm;
}

.category-badge {
  @apply bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full text-sm font-semibold;
}

.date-badge {
  @apply bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-lg font-mono text-sm;
}

.date-card {
  @apply bg-gray-50/80 dark:bg-gray-700/50 rounded-xl p-6 backdrop-blur-sm hover:bg-gray-100/80 dark:hover:bg-gray-700/70 transition-all duration-200;
}

.image-container {
  @apply bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-xl overflow-hidden shadow-lg dark:shadow-black/20 transition-all duration-300 hover:shadow-xl;
}

.qr-code-wrapper {
  @apply inline-block p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md;
}

.description-box {
  @apply bg-gray-50/80 dark:bg-gray-700/50 rounded-xl p-6 backdrop-blur-sm;
}

/* Animations */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Smooth transitions */
* {
  @apply transition-colors duration-300;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  @apply bg-gray-100 dark:bg-gray-800;
}

::-webkit-scrollbar-thumb {
  @apply bg-gray-300 dark:bg-gray-600 rounded-full hover:bg-gray-400 dark:hover:bg-gray-500;
}

/* Focus states for accessibility */
button:focus {
  @apply outline-none ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-800;
}

/* Enhanced hover effects */
@media (hover: hover) {
  .hover\:scale-105:hover {
    transform: scale(1.05);
  }
}

/* Mobile optimizations */
@media (max-width: 640px) {
  .detail-row {
    @apply flex-col items-start space-y-2;
  }
  
  .card-header {
    @apply flex-col items-start space-x-0 space-y-3;
  }
  
  .icon-container {
    @apply w-10 h-10;
  }
}

/* Print styles */
@media print {
  .fixed {
    @apply hidden;
  }
  
  .glass-card {
    @apply shadow-none border border-gray-300;
  }
}

/* Reduced motion for accessibility */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>