<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 py-2 sm:py-4 lg:py-8 px-2 sm:px-4 transition-colors duration-300">
    <div class="max-w-7xl mx-auto">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center h-64">
        <div class="relative">
          <div class="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-blue-500/30 dark:border-blue-400/30 border-t-blue-500 dark:border-t-blue-400"></div>
          <div class="absolute inset-0 animate-pulse rounded-full h-12 w-12 sm:h-16 sm:w-16 bg-blue-500/10 dark:bg-blue-400/10"></div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl sm:rounded-2xl p-4 sm:p-8 text-center backdrop-blur-sm">
        <div class="text-red-600 dark:text-red-400 text-xl sm:text-2xl mb-4 flex justify-center">
          <svg class="w-8 h-8 sm:w-12 sm:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h3 class="text-lg sm:text-xl font-semibold text-red-800 dark:text-red-300 mb-2">Xatolik yuz berdi</h3>
        <p class="text-red-700 dark:text-red-400 text-sm sm:text-base">{{ error }}</p>
      </div>

      <!-- Warehouse Details -->
      <div v-else-if="warehouse" class="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl shadow-black/5 dark:shadow-black/20 overflow-hidden border border-white/20 dark:border-slate-700/50">
        <!-- Header -->
        <div class="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-700 dark:via-indigo-700 dark:to-purple-700 text-white p-3 sm:p-6 lg:p-8 relative overflow-hidden">
          <div class="absolute inset-0 bg-black/10 dark:bg-black/20"></div>
          <div class="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 w-12 h-12 sm:w-24 sm:h-24 bg-white/10 rounded-full blur-xl"></div>
          <div class="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 w-16 h-16 sm:w-32 sm:h-32 bg-white/5 rounded-full blur-2xl"></div>
          
          <div class="relative flex flex-col sm:flex-row items-start justify-between gap-4">
            <div class="flex-1 w-full sm:w-auto">
              <div class="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 mb-4">
                <div class="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center backdrop-blur-sm flex-shrink-0">
                  <svg class="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                  </svg>
                </div>
                <div class="min-w-0 flex-1">
                  <h1 class="text-xl sm:text-2xl lg:text-4xl font-bold mb-1 sm:mb-2 text-white break-words">{{ warehouse.name }}</h1>
                  <p class="text-blue-100 dark:text-blue-200 text-sm sm:text-base lg:text-lg font-medium">
                    {{ warehouse.category?.name || 'Kategoriya mavjud emas' }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Content -->
        <div class="p-3 sm:p-6 lg:p-8">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <!-- Left Column - Image and QR Code -->
            <div class="lg:col-span-1 space-y-4 sm:space-y-6 order-2 lg:order-1">
              <!-- Main Image -->
              <div class="group relative">
                <div class="bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg dark:shadow-black/20 transition-all duration-300 group-hover:shadow-xl">
                  <img 
                    v-if="warehouse.imageUrl" 
                    :src="getImageUrl(warehouse.imageUrl)" 
                    :alt="warehouse.name"
                    class="w-full h-48 sm:h-64 lg:h-80 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div v-else class="w-full h-48 sm:h-64 lg:h-80 flex items-center justify-center">
                    <div class="text-slate-400 dark:text-slate-500 text-center">
                      <svg class="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 mx-auto mb-2 sm:mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                      </svg>
                      <div class="text-base sm:text-lg lg:text-xl font-medium">Rasm mavjud emas</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- QR Code -->
              <div v-if="warehouse.qrCodeUrl" class="bg-slate-50 dark:bg-slate-700/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center shadow-lg dark:shadow-black/20">
                <div class="flex items-center justify-center space-x-2 mb-3 sm:mb-4">
                  <svg class="w-4 h-4 sm:w-5 sm:h-5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 16h4.01M12 8h4.01M12 16h.01"></path>
                  </svg>
                  <h3 class="text-base sm:text-lg font-semibold text-slate-700 dark:text-slate-300">QR Kod</h3>
                </div>
                <div class="inline-block p-2 sm:p-3 bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl shadow-md">
                  <img 
                    :src="getImageUrl(warehouse.qrCodeUrl)" 
                    alt="QR Code"
                    class="w-24 h-24 sm:w-32 sm:h-32 mx-auto"
                  />
                </div>
              </div>
            </div>

            <!-- Right Column - Details -->
            <div class="lg:col-span-2 space-y-4 sm:space-y-6 order-1 lg:order-2">
              <!-- Main Information -->
              <div class="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700/50 dark:to-slate-800/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg dark:shadow-black/20">
                <div class="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
                  <div class="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 dark:bg-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                  </div>
                  <h3 class="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-200">Asosiy ma'lumotlar</h3>
                </div>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div class="bg-white/70 dark:bg-slate-800/70 rounded-lg sm:rounded-xl p-3 sm:p-4 backdrop-blur-sm">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <span class="text-slate-600 dark:text-slate-400 font-medium text-sm sm:text-base">Miqdori</span>
                      <div class="flex items-center space-x-2">
                        <span class="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400">{{ warehouse.quantity }}</span>
                        <span class="text-slate-500 dark:text-slate-400 text-sm sm:text-base">dona</span>
                      </div>
                    </div>
                  </div>
                  
                  <div v-if="warehouse.condition" class="bg-white/70 dark:bg-slate-800/70 rounded-lg sm:rounded-xl p-3 sm:p-4 backdrop-blur-sm">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <span class="text-slate-600 dark:text-slate-400 font-medium text-sm sm:text-base">Holati</span>
                      <span class="font-bold px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm" :class="getConditionStyle(warehouse.condition)">
                        {{ warehouse.condition }}
                      </span>
                    </div>
                  </div>
                  
                  <div v-if="warehouse.location" class="bg-white/70 dark:bg-slate-800/70 rounded-lg sm:rounded-xl p-3 sm:p-4 backdrop-blur-sm">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <span class="text-slate-600 dark:text-slate-400 font-medium text-sm sm:text-base">Turgan joyi</span>
                      <div class="flex items-center space-x-1 sm:space-x-2">
                        <svg class="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 dark:text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        <span class="font-semibold text-blue-600 dark:text-blue-400 text-sm sm:text-base">{{ warehouse.location }}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div v-if="warehouse.id" class="bg-white/70 dark:bg-slate-800/70 rounded-lg sm:rounded-xl p-3 sm:p-4 backdrop-blur-sm">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <span class="text-slate-600 dark:text-slate-400 font-medium text-sm sm:text-base">Seriya raqami</span>
                      <span class="font-mono text-xs sm:text-sm bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-2 sm:px-3 py-1 rounded-md sm:rounded-lg break-all">
                        {{ warehouse.id }}
                      </span>
                    </div>
                  </div>
                  <div v-if="warehouse.whomBelongs" class="bg-white/70 dark:bg-slate-800/70 rounded-lg sm:rounded-xl p-3 sm:p-4 backdrop-blur-sm">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <span class="text-slate-600 dark:text-slate-400 font-medium text-sm sm:text-base">Mas'ul shaxs</span>
                      <span class="font-mono text-xs sm:text-sm bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-2 sm:px-3 py-1 rounded-md sm:rounded-lg break-all">
                        {{ warehouse.whomBelongs }}
                      </span>
                    </div>
                  </div>
                  <div v-if="warehouse.collection" class="bg-white/70 dark:bg-slate-800/70 rounded-lg sm:rounded-xl p-3 sm:p-4 backdrop-blur-sm">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <span class="text-slate-600 dark:text-slate-400 font-medium text-sm sm:text-base">To'liq to'plam</span>
                      <span class="font-mono text-xs sm:text-sm bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-2 sm:px-3 py-1 rounded-md sm:rounded-lg break-all">
                        {{ warehouse.collection ? 'Ha' : 'Yoq' }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Description -->
              <div v-if="warehouse.description" class="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700/50 dark:to-slate-800/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg dark:shadow-black/20">
                <div class="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                  <div class="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500 dark:bg-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"></path>
                    </svg>
                  </div>
                  <h3 class="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-200">Tavsif</h3>
                </div>
                <div class="bg-white/70 dark:bg-slate-800/70 rounded-lg sm:rounded-xl p-3 sm:p-4 backdrop-blur-sm">
                  <p class="text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">{{ warehouse.description }}</p>
                </div>
              </div>

              <!-- Dates -->
              <div class="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700/50 dark:to-slate-800/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg dark:shadow-black/20">
                <div class="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
                  <div class="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-500 dark:bg-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <h3 class="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-200">Sanalar</h3>
                </div>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  <div v-if="warehouse.purchaseDate" class="bg-white/70 dark:bg-slate-800/70 rounded-lg sm:rounded-xl p-3 sm:p-4 backdrop-blur-sm">
                    <div class="text-center">
                      <div class="text-slate-600 dark:text-slate-400 text-xs sm:text-sm font-medium mb-1">Sotib olingan</div>
                      <div class="font-bold text-purple-600 dark:text-purple-400 text-sm sm:text-base">{{ formatDate(warehouse.purchaseDate) }}</div>
                    </div>
                  </div>
                  
                  <div class="bg-white/70 dark:bg-slate-800/70 rounded-lg sm:rounded-xl p-3 sm:p-4 backdrop-blur-sm">
                    <div class="text-center">
                      <div class="text-slate-600 dark:text-slate-400 text-xs sm:text-sm font-medium mb-1">Yaratilgan</div>
                      <div class="font-bold text-emerald-600 dark:text-emerald-400 text-sm sm:text-base">{{ formatDate(warehouse.createdAt) }}</div>
                    </div>
                  </div>
                  
                  <div class="bg-white/70 dark:bg-slate-800/70 rounded-lg sm:rounded-xl p-3 sm:p-4 backdrop-blur-sm sm:col-span-2 lg:col-span-1">
                    <div class="text-center">
                      <div class="text-slate-600 dark:text-slate-400 text-xs sm:text-sm font-medium mb-1">Yangilangan</div>
                      <div class="font-bold text-blue-600 dark:text-blue-400 text-sm sm:text-base">{{ formatDate(warehouse.updatedAt) }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="bg-slate-100/50 dark:bg-slate-800/50 px-3 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-6 border-t border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm">
          <div class="flex flex-col sm:flex-row justify-between sm:justify-end items-center space-y-2 sm:space-y-0">
            <div class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 flex items-center space-x-1 sm:space-x-2">
              <svg class="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

// Load data when component mounts
onMounted(() => {
  fetchWarehouse()
})
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Custom scrollbar for dark mode */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  @apply bg-slate-100 dark:bg-slate-800;
}

::-webkit-scrollbar-thumb {
  @apply bg-slate-300 dark:bg-slate-600 rounded-full;
}

::-webkit-scrollbar-thumb:hover {
  @apply bg-slate-400 dark:bg-slate-500;
}

/* Enhanced responsive animations */
@media (hover: hover) {
  .group:hover .group-hover\:scale-105 {
    transform: scale(1.05);
  }
}

/* Better mobile touch targets */
@media (max-width: 640px) {
  .touch-target {
    min-height: 44px;
    min-width: 44px;
  }
}

/* Improved focus states for accessibility */
.focus\:ring-2:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

/* Better text readability on mobile */
@media (max-width: 640px) {
  .break-words {
    word-break: break-word;
    overflow-wrap: break-word;
  }
}

/* Smooth transitions for all interactive elements */
* {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
</style>