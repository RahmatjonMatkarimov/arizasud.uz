<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div class="text-red-600 text-xl mb-2">❌ Xatolik yuz berdi</div>
        <p class="text-red-700">{{ error }}</p>
      </div>

      <!-- Warehouse Details -->
      <div v-else-if="warehouse" class="bg-white rounded-2xl shadow-xl overflow-hidden">
        <!-- Header -->
        <div class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold mb-2">{{ warehouse.name }}</h1>
              <p class="text-blue-100 text-lg">{{ warehouse.category?.name || 'Kategoriya mavjud emas' }}</p>
            </div>
            <div class="text-right">
              <div class="text-blue-100 text-sm">ID</div>
              <div class="text-2xl font-bold">#{{ warehouse.id }}</div>
            </div>
          </div>
        </div>

        <!-- Content -->
        <div class="p-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Left Column - Image and QR Code -->
            <div class="space-y-6">
              <!-- Main Image -->
              <div class="bg-gray-50 rounded-xl overflow-hidden">
                <img 
                  v-if="warehouse.imageUrl" 
                  :src="getImageUrl(warehouse.imageUrl)" 
                  :alt="warehouse.name"
                  class="w-full h-64 object-cover"
                />
                <div v-else class="w-full h-64 flex items-center justify-center bg-gray-100">
                  <div class="text-gray-400 text-center">
                    <div class="text-6xl mb-2">📦</div>
                    <div class="text-lg">Rasm mavjud emas</div>
                  </div>
                </div>
              </div>

              <!-- QR Code -->
              <div v-if="warehouse.qrCodeUrl" class="bg-gray-50 rounded-xl p-4 text-center">
                <h3 class="text-lg font-semibold mb-3 text-gray-700">QR Kod</h3>
                <img 
                  :src="getImageUrl(warehouse.qrCodeUrl)" 
                  alt="QR Code"
                  class="mx-auto w-32 h-32 border-2 border-gray-200 rounded-lg"
                />
              </div>
            </div>

            <!-- Right Column - Details -->
            <div class="space-y-6">
              <!-- Basic Info -->
              <div class="bg-gray-50 rounded-xl p-4">
                <h3 class="text-lg font-semibold mb-4 text-gray-700 flex items-center">
                  📋 Asosiy ma'lumotlar
                </h3>
                <div class="grid grid-cols-1 gap-3">
                  <div class="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                    <span class="text-gray-600">Miqdori:</span>
                    <span class="font-semibold text-green-600">{{ warehouse.quantity }} dona</span>
                  </div>
                  <div v-if="warehouse.condition" class="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                    <span class="text-gray-600">Holati:</span>
                    <span class="font-semibold" :class="getConditionColor(warehouse.condition)">
                      {{ warehouse.condition }}
                    </span>
                  </div>
                  <div v-if="warehouse.location" class="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                    <span class="text-gray-600">Joylashuv:</span>
                    <span class="font-semibold text-blue-600">{{ warehouse.location }}</span>
                  </div>
                  <div v-if="warehouse.serialNumber" class="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                    <span class="text-gray-600">Seriya raqami:</span>
                    <span class="font-mono text-sm bg-gray-200 px-2 py-1 rounded">{{ warehouse.serialNumber }}</span>
                  </div>
                </div>
              </div>

              <!-- Description -->
              <div v-if="warehouse.description" class="bg-gray-50 rounded-xl p-4">
                <h3 class="text-lg font-semibold mb-3 text-gray-700 flex items-center">
                  📝 Tavsif
                </h3>
                <p class="text-gray-700 leading-relaxed">{{ warehouse.description }}</p>
              </div>

              <!-- Dates -->
              <div class="bg-gray-50 rounded-xl p-4">
                <h3 class="text-lg font-semibold mb-4 text-gray-700 flex items-center">
                  📅 Sanalar
                </h3>
                <div class="grid grid-cols-1 gap-3">
                  <div v-if="warehouse.purchaseDate" class="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                    <span class="text-gray-600">Sotib olingan:</span>
                    <span class="font-semibold text-purple-600">{{ formatDate(warehouse.purchaseDate) }}</span>
                  </div>
                  <div class="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                    <span class="text-gray-600">Yaratilgan:</span>
                    <span class="font-semibold text-green-600">{{ formatDate(warehouse.createdAt) }}</span>
                  </div>
                  <div class="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                    <span class="text-gray-600">Yangilangan:</span>
                    <span class="font-semibold text-blue-600">{{ formatDate(warehouse.updatedAt) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="bg-gray-50 px-6 py-4 border-t">
          <div class="flex justify-between items-center">
            <button 
              @click="goBack" 
              class="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
            >
              <span>←</span>
              <span>Orqaga</span>
            </button>
            <div class="text-sm text-gray-500">
              So'nggi yangilanish: {{ formatDate(warehouse.updatedAt) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { URL, URL1 } from '@/auth/url'
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// Reactive data
const warehouse = ref(null)
const loading = ref(true)
const error = ref(null)

// Get warehouse ID from route params
const warehouseId = route.params.id

// Fetch warehouse data
const fetchWarehouse = async () => {
  try {
    loading.value = true
    error.value = null
    
    // API call to your backend
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

// Helper functions
const getImageUrl = (path) => {
  if (!path) return ''
  // If path already starts with http, return as is
  if (path.startsWith('http')) return path
  // Otherwise, prepend your backend URL
  return `${URL}${path}`
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('uz-UZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getConditionColor = (condition) => {
  const colors = {
    'Yangi': 'text-green-600',
    'Yaxshi': 'text-blue-600',
    'Qoniqarli': 'text-yellow-600',
    'Yomon': 'text-red-600',
    'Ishlamaydi': 'text-gray-600'
  }
  return colors[condition] || 'text-gray-600'
}

const goBack = () => {
  router.go(-1)
}

// Load data when component mounts
onMounted(() => {
  fetchWarehouse()
})
</script>

<style scoped>
/* Additional custom styles if needed */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>