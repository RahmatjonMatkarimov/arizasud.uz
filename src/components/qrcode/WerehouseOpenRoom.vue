<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950 transition-all duration-700 ease-in-out">
    <!-- Theme Toggle Button -->
    <div class="fixed top-4 right-4 z-50">
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
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center min-h-[60vh]">
        <div class="relative">
          <div class="animate-spin rounded-full h-16 w-16 border-4 border-blue-500/30 dark:border-blue-400/30 border-t-blue-500 dark:border-t-blue-400"></div>
          <div class="absolute inset-0 animate-pulse rounded-full h-16 w-16 bg-blue-500/10 dark:bg-blue-400/10"></div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="max-w-2xl mx-auto">
        <div class="glass-card border-red-200 dark:border-red-800 bg-red-50/80 dark:bg-red-900/20 text-center p-8">
          <div class="text-red-600 dark:text-red-400 text-2xl mb-4 flex justify-center">
            <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-red-800 dark:text-red-300 mb-2">Xatolik yuz berdi</h3>
          <p class="text-red-700 dark:text-red-400">{{ error }}</p>
          <button 
            @click="fetchWarehouse"
            class="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
          >
            Qayta urinish
          </button>
        </div>
      </div>

      <!-- Warehouse Details -->
      <div v-else-if="warehouse" class="glass-card overflow-hidden">
        <!-- Header -->
        <div class="gradient-header text-white relative overflow-hidden">
          <div class="absolute inset-0 bg-black/10 dark:bg-black/20"></div>
          <div class="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
          <div class="absolute -bottom-4 -left-4 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
          
          <div class="relative p-8">
            <div class="flex items-start justify-between gap-6">
              <div class="flex items-center space-x-4 min-w-0 flex-1">
                <div class="icon-container bg-white/20">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                  </svg>
                </div>
                <div class="min-w-0 flex-1">
                  <h1 class="text-4xl font-bold mb-2 text-white break-words">{{ warehouse.name }}</h1>
                  <p class="text-blue-100 dark:text-blue-200 text-lg font-medium">
                    {{ warehouse.category?.name || 'Kategoriya mavjud emas' }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Content -->
        <div class="p-8">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Left Column - Image and QR Code -->
            <div class="lg:col-span-1 space-y-6">
              <!-- Main Image -->
              <div class="group">
                <div class="image-container">
                  <img 
                    v-if="warehouse.imageUrl" 
                    :src="getImageUrl(warehouse.imageUrl)" 
                    :alt="warehouse.name"
                    class="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div v-else class="w-full h-80 flex items-center justify-center">
                    <div class="text-gray-400 dark:text-gray-500 text-center">
                      <svg class="w-20 h-20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                      </svg>
                      <div class="text-xl font-medium">Rasm mavjud emas</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- QR Code -->
              <div v-if="warehouse.qrCodeUrl" class="qr-card">
                <div class="flex items-center justify-center space-x-2 mb-4">
                  <svg class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 16h4.01M12 8h4.01M12 16h.01"></path>
                  </svg>
                  <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300">QR Kod</h3>
                </div>
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
              <!-- Main Information -->
              <div class="info-card">
                <div class="card-header">
                  <div class="icon-container bg-blue-500 dark:bg-blue-600">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                  </div>
                  <h3 class="text-xl font-bold text-gray-800 dark:text-gray-200">Asosiy ma'lumotlar</h3>
                </div>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="detail-item">
                    <div class="flex items-center justify-between">
                      <span class="detail-label">Miqdori</span>
                      <div class="flex items-center space-x-2">
                        <span class="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{{ warehouse.quantity }}</span>
                        <span class="text-gray-500 dark:text-gray-400">dona</span>
                      </div>
                    </div>
                  </div>
                  
                  <div v-if="warehouse.condition" class="detail-item">
                    <div class="flex items-center justify-between">
                      <span class="detail-label">Holati</span>
                      <span class="status-badge" :class="getConditionStyle(warehouse.condition)">
                        {{ warehouse.condition }}
                      </span>
                    </div>
                  </div>
                  
                  <div v-if="warehouse.location" class="detail-item">
                    <div class="flex items-center justify-between">
                      <span class="detail-label">Turgan joyi</span>
                      <div class="flex items-center space-x-2">
                        <svg class="w-4 h-4 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        <span class="font-semibold text-blue-600 dark:text-blue-400">{{ warehouse.location }}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div v-if="warehouse.id" class="detail-item sm:col-span-2">
                    <div class="flex items-center justify-between">
                      <span class="detail-label">Seriya raqami</span>
                      <span class="code-badge">{{ warehouse.id }}</span>
                    </div>
                  </div>
                  
                  <div v-if="warehouse.whomBelongs" class="detail-item">
                    <div class="flex items-center justify-between">
                      <span class="detail-label">Mas'ul shaxs</span>
                      <span class="code-badge">{{ warehouse.whomBelongs }}</span>
                    </div>
                  </div>
                  
                  <div v-if="warehouse.collection !== undefined" class="detail-item">
                    <div class="flex items-center justify-between">
                      <span class="detail-label">To'liq to'plam</span>
                      <span class="code-badge" :class="warehouse.collection ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'">
                        {{ warehouse.collection ? 'Ha' : 'Yoq' }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Description -->
              <div v-if="warehouse.description" class="info-card">
                <div class="card-header">
                  <div class="icon-container bg-purple-500 dark:bg-purple-600">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"></path>
                    </svg>
                  </div>
                  <h3 class="text-xl font-bold text-gray-800 dark:text-gray-200">Tavsif</h3>
                </div>
                <div class="detail-item">
                  <p class="text-gray-700 dark:text-gray-300 leading-relaxed">{{ warehouse.description }}</p>
                </div>
              </div>

              <!-- Dates -->
              <div class="info-card">
                <div class="card-header">
                  <div class="icon-container bg-indigo-500 dark:bg-indigo-600">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <h3 class="text-xl font-bold text-gray-800 dark:text-gray-200">Sanalar</h3>
                </div>
                
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div v-if="warehouse.purchaseDate" class="date-card">
                    <div class="text-center">
                      <div class="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">Sotib olingan</div>
                      <div class="font-bold text-purple-600 dark:text-purple-400">{{ formatDate(warehouse.purchaseDate) }}</div>
                    </div>
                  </div>
                  
                  <div class="date-card">
                    <div class="text-center">
                      <div class="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">Yaratilgan</div>
                      <div class="font-bold text-emerald-600 dark:text-emerald-400">{{ formatDate(warehouse.createdAt) }}</div>
                    </div>
                  </div>
                  
                  <div class="date-card">
                    <div class="text-center">
                      <div class="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">Yangilangan</div>
                      <div class="font-bold text-blue-600 dark:text-blue-400">{{ formatDate(warehouse.updatedAt) }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="footer-section">
          <div class="flex justify-end items-center">
            <div class="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>So'nggi yangilanish: {{ formatDate(warehouse.updatedAt) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { URL } from '@/auth/url'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const warehouse = ref(null)
const loading = ref(true)
const error = ref(null)
const warehouseId = route.params.id
const isDark = ref(true) // Default dark mode

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
  
  // Default to dark mode if no saved theme
  isDark.value = savedTheme !== 'light'
  updateTheme()
}

const fetchWarehouse = async () => {
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
  @apply bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/5 dark:shadow-black/20 border border-white/20 dark:border-gray-700/50;
}

.info-card {
  @apply bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 rounded-2xl p-6 shadow-lg dark:shadow-black/20 backdrop-blur-sm;
}

.qr-card {
  @apply bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6 text-center shadow-lg dark:shadow-black/20 backdrop-blur-sm;
}

.image-container {
  @apply bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-2xl overflow-hidden shadow-lg dark:shadow-black/20 transition-all duration-300 hover:shadow-xl;
}

.qr-code-wrapper {
  @apply inline-block p-3 bg-white dark:bg-gray-800 rounded-xl shadow-md;
}

.gradient-header {
  @apply bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-700 dark:via-indigo-700 dark:to-purple-700;
}

.icon-container {
  @apply w-12 h-12 rounded-xl flex items-center justify-center backdrop-blur-sm flex-shrink-0;
}

.card-header {
  @apply flex items-center space-x-3 mb-6;
}

.detail-item {
  @apply bg-white/70 dark:bg-gray-800/70 rounded-xl p-4 backdrop-blur-sm transition-all duration-200 hover:bg-white/90 dark:hover:bg-gray-800/90;
}

.detail-label {
  @apply text-gray-600 dark:text-gray-400 font-medium;
}

.code-badge {
  @apply font-mono text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-lg break-all;
}

.status-badge {
  @apply font-bold px-3 py-1 rounded-full text-sm;
}

.date-card {
  @apply bg-white/70 dark:bg-gray-800/70 rounded-xl p-4 backdrop-blur-sm transition-all duration-200 hover:bg-white/90 dark:hover:bg-gray-800/90;
}

.footer-section {
  @apply bg-gray-100/50 dark:bg-gray-800/50 px-8 py-6 border-t border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm;
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
  .container {
    @apply px-2;
  }
  
  .glass-card {
    @apply rounded-2xl;
  }
  
  .info-card {
    @apply p-4;
  }
  
  .icon-container {
    @apply w-10 h-10;
  }
  
  .gradient-header {
    @apply p-6;
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