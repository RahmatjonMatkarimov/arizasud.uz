<template>
  <div  class="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 p-4 sm:p-6 lg:p-8">
    <!-- Header Section -->
    <header class="text-center mb-12">
      <div class="bg-white/10 dark:bg-gray-800/20 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-gray-700/30 shadow-2xl">
        <h1 class="text-4xl sm:text-5xl font-bold text-white mb-4 flex items-center justify-center gap-4">
          <span class="text-5xl drop-shadow-lg">📄</span>
          File Editor & QR Generator
        </h1>
        <p class="text-lg text-white/90 font-light">DOCX ↔ PDF konvertatsiya va QR kod generatsiya</p>
      </div>
    </header>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- File Conversion Card -->
      <div class="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/30 dark:border-gray-700/30 hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
        <div class="flex items-center gap-4 mb-8">
          <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">
            🔄
          </div>
          <h2 class="text-2xl font-bold text-gray-800 dark:text-white">Fayl Konvertatsiya</h2>
        </div>

        <div class="space-y-6">
          <!-- File Input -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Faylni tanlang:
            </label>
            <div 
              class="relative group cursor-pointer"
              :class="{ 'ring-2 ring-blue-500': selectedFile }"
              @click="triggerFileInput"
            >
              <input 
                ref="fileInputRef"
                type="file" 
                @change="handleFileSelect"
                accept=".pdf,.docx"
                class="hidden"
              >
              <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 text-center bg-gray-50/50 dark:bg-gray-700/50 group-hover:border-blue-500 group-hover:bg-blue-50/50 dark:group-hover:bg-blue-900/20 transition-all duration-300">
                <div v-if="!selectedFile" class="flex flex-col items-center space-y-3">
                  <span class="text-4xl opacity-60">📎</span>
                  <span class="text-gray-600 dark:text-gray-400 font-medium">Faylni tanlash uchun bosing</span>
                </div>
                <div v-else class="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
                  <div class="flex items-center gap-3">
                    <span class="text-2xl">📄</span>
                    <span class="font-medium text-gray-800 dark:text-white">{{ selectedFile.name }}</span>
                  </div>
                  <button 
                    @click.stop="clearFile" 
                    class="w-8 h-8 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Conversion Type -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Konvertatsiya turi:
            </label>
            <select 
              v-model="conversionType" 
              class="w-full p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 dark:text-white transition-all"
            >
              <option value="">Avtomatik aniqlash</option>
              <option value="pdf">PDF ga</option>
              <option value="docx">DOCX ga</option>
            </select>
          </div>
          <button 
            @click="convertFile" 
            :disabled="!selectedFile || isConverting"
            class="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
          >
            <div v-if="isConverting" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            {{ isConverting ? 'Konvertatsiya qilinmoqda...' : 'Konvertatsiya qilish' }}
          </button>

          <!-- Conversion Result -->
          <div v-if="conversionMessage" class="p-4 rounded-xl border-l-4 flex items-center gap-3"
               :class="conversionStatus === 'success' 
                 ? 'bg-green-50 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-400' 
                 : 'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-700 dark:text-red-400'"
          >
            <span class="text-xl">{{ conversionStatus === 'success' ? '✅' : '❌' }}</span>
            <p class="font-medium">{{ conversionMessage }}</p>
          </div>
        </div>
      </div>

      <!-- QR Code Generator Card -->
      <div class="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/30 dark:border-gray-700/30 hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
        <div class="flex items-center gap-4 mb-8">
          <div class="w-16 h-16 bg-gradient-to-br from-pink-500 to-orange-500 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">
            📱
          </div>
          <h2 class="text-2xl font-bold text-gray-800 dark:text-white">QR Kod Generatori</h2>
        </div>

        <div class="space-y-6">
          <!-- URL Input -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              URL manzil:
            </label>
            <input 
              v-model="qrUrl" 
              @input="debouncedGenerateQR"
              type="url" 
              class="w-full p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-800 dark:text-white transition-all"
              placeholder="https://example.com"
            >
          </div>

          <!-- Size Control -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              O'lcham:
            </label>
            <div class="flex items-center gap-4">
              <input 
                v-model="qrSize" 
                @input="debouncedGenerateQR"
                type="range" 
                min="100" 
                max="800" 
                class="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              >
              <span class="px-3 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400 rounded-lg font-semibold min-w-[80px] text-center">
                {{ qrSize }}px
              </span>
            </div>
          </div>

          <!-- Margin Control -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Chegara:
            </label>
            <div class="flex items-center gap-4">
              <input 
                v-model="qrMargin" 
                @input="debouncedGenerateQR"
                type="range" 
                min="0" 
                max="10" 
                class="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              >
              <span class="px-3 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400 rounded-lg font-semibold min-w-[60px] text-center">
                {{ qrMargin }}
              </span>
            </div>
          </div>

          <!-- Color Controls -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Ranglar:
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <input 
                  v-model="qrDarkColor" 
                  @input="debouncedGenerateQR"
                  type="color" 
                  class="w-12 h-12 rounded-lg border-2 border-gray-300 dark:border-gray-600 cursor-pointer"
                >
                <span class="text-gray-700 dark:text-gray-300 font-medium">Qora rang</span>
              </div>
              <div class="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <input 
                  v-model="qrLightColor" 
                  @input="debouncedGenerateQR"
                  type="color" 
                  class="w-12 h-12 rounded-lg border-2 border-gray-300 dark:border-gray-600 cursor-pointer"
                >
                <span class="text-gray-700 dark:text-gray-300 font-medium">Oq rang</span>
              </div>
            </div>
          </div>

          <!-- QR Preview -->
          <div v-if="qrImageUrl || isGenerating" class="mt-8">
            <div class="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6 text-center">
              <div v-if="isGenerating" class="flex flex-col items-center gap-4">
                <div class="w-8 h-8 border-2 border-pink-500/30 border-t-pink-500 rounded-full animate-spin"></div>
                <span class="text-gray-600 dark:text-gray-400">QR kod yaratilmoqda...</span>
              </div>
              <div v-else-if="qrImageUrl" class="space-y-4">
                <img 
                  :src="qrImageUrl" 
                  alt="QR Code" 
                  class="max-w-full max-h-80 mx-auto rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
                >
                <button 
                  @click="downloadQRCode" 
                  class="w-full py-3 px-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <span class="text-lg">⬇️</span>
                  QR Kodni Yuklab Olish
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notifications -->
    <div class="fixed top-4 right-4 z-50 space-y-3">
      <div 
        v-for="toast in toasts" 
        :key="toast.id"
        class="flex items-center gap-3 p-4 rounded-xl shadow-2xl backdrop-blur-xl border transform transition-all duration-300"
        :class="{
          'bg-green-500/90 border-green-400 text-white': toast.type === 'success',
          'bg-red-500/90 border-red-400 text-white': toast.type === 'error',
          'bg-blue-500/90 border-blue-400 text-white': toast.type === 'info'
        }"
      >
        <span class="text-xl">
          {{ toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : 'ℹ️' }}
        </span>
        <span class="font-medium flex-1">{{ toast.message }}</span>
        <button 
          @click="removeToast(toast.id)" 
          class="w-6 h-6 rounded-full hover:bg-white/20 transition-colors flex items-center justify-center"
        >
          ✕
        </button>
      </div>
    </div>

    <!-- Dark Mode Toggle -->
    <button 
      @click="toggleDarkMode"
      class="fixed bottom-6 right-6 w-14 h-14 bg-white/20 dark:bg-gray-800/80 backdrop-blur-xl rounded-full shadow-2xl border border-white/30 dark:border-gray-700/30 text-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center"
    >
      {{ isDark ? '☀️' : '🌙' }}
    </button>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick, watch } from 'vue'

// API Configuration
const API_BASE = 'https://backend.arizasud.uz/file-editor'

// Dark Mode
const isDark = ref(false)

// File Conversion State
const fileInputRef = ref(null)
const selectedFile = ref(null)
const conversionType = ref('')
const isConverting = ref(false)
const conversionMessage = ref('')
const conversionStatus = ref('')

// QR Code State
const qrUrl = ref('')
const qrSize = ref(300)
const qrMargin = ref(2)
const qrDarkColor = ref('#000000')
const qrLightColor = ref('#ffffff')
const isGenerating = ref(false)
const qrImageUrl = ref('')
const currentQRBlob = ref(null)

// Toast System
const toasts = ref([])
let toastId = 0

// Debounce timer for QR generation
let qrDebounceTimer = null

// Dark Mode Toggle
const toggleDarkMode = () => {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('darkMode', 'true')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('darkMode', 'false')
  }
}

// Initialize dark mode
onMounted(() => {
  const savedMode = localStorage.getItem('darkMode')
  if (savedMode === 'true' || (!savedMode && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDark.value = true
    document.documentElement.classList.add('dark')
  }
})

// File Handling Methods
const triggerFileInput = () => {
  fileInputRef.value?.click()
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedFile.value = file
    autoDetectConversionType(file)
  }
}

const clearFile = () => {
  selectedFile.value = null
  conversionMessage.value = ''
  conversionStatus.value = ''
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

const autoDetectConversionType = (file) => {
  const extension = file.name.split('.').pop().toLowerCase()
  if (extension === 'pdf') {
    conversionType.value = 'docx'
  } else if (extension === 'docx') {
    conversionType.value = 'pdf'
  }
}

// File Conversion
const convertFile = async () => {
  if (!selectedFile.value) {
    showToast('Iltimos, faylni tanlang!', 'error')
    return
  }

  const file = selectedFile.value
  const fileExtension = file.name.split('.').pop().toLowerCase()
  
  let targetFormat = conversionType.value
  if (!targetFormat) {
    targetFormat = fileExtension === 'pdf' ? 'docx' : 'pdf'
  }

  if (fileExtension === targetFormat) {
    conversionMessage.value = `Fayl allaqachon ${targetFormat.toUpperCase()} formatida!`
    conversionStatus.value = 'error'
    return
  }

  const formData = new FormData()
  formData.append('file', file)

  isConverting.value = true
  conversionMessage.value = ''
  conversionStatus.value = ''

  try {
    const response = await fetch(`${API_BASE}/convert?to=${targetFormat}`, {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error(`Server xatosi: ${response.status}`)
    }

    const blob = await response.blob()
    downloadFile(blob, file.name.replace(/\.[^/.]+$/, '') + '.' + targetFormat)

    conversionMessage.value = `Fayl muvaffaqiyatli ${targetFormat.toUpperCase()} formatiga konvertatsiya qilindi!`
    conversionStatus.value = 'success'
    showToast('Konvertatsiya muvaffaqiyatli bajarildi!', 'success')

  } catch (error) {
    console.error('Konvertatsiya xatosi:', error)
    conversionMessage.value = 'Konvertatsiya xatosi: ' + error.message
    conversionStatus.value = 'error'
    showToast('Konvertatsiyada xatolik yuz berdi', 'error')
  } finally {
    isConverting.value = false
  }
}

// QR Code Generation with debounce
const debouncedGenerateQR = () => {
  if (qrDebounceTimer) {
    clearTimeout(qrDebounceTimer)
  }
  
  qrDebounceTimer = setTimeout(() => {
    if (qrUrl.value.trim()) {
      generateQRCode()
    }
  }, 500) // 500ms debounce
}

const generateQRCode = async () => {
  if (!qrUrl.value.trim()) {
    qrImageUrl.value = ''
    currentQRBlob.value = null
    return
  }

  isGenerating.value = true

  try {
    const response = await fetch(`${API_BASE}/generate-qr`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: qrUrl.value.trim(),
        width: parseInt(qrSize.value),
        height: parseInt(qrSize.value),
        margin: parseInt(qrMargin.value),
        color: {
          dark: qrDarkColor.value,
          light: qrLightColor.value
        }
      })
    })

    if (!response.ok) {
      throw new Error(`Server xatosi: ${response.status}`)
    }

    // Clean up previous blob URL
    if (qrImageUrl.value) {
      URL.revokeObjectURL(qrImageUrl.value)
    }

    currentQRBlob.value = await response.blob()
    qrImageUrl.value = URL.createObjectURL(currentQRBlob.value)

  } catch (error) {
    console.error('QR kod yaratish xatosi:', error)
    showToast('QR kod yaratishda xatolik: ' + error.message, 'error')
  } finally {
    isGenerating.value = false
  }
}

// Download Functions
const downloadFile = (blob, filename) => {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const downloadQRCode = () => {
  if (!currentQRBlob.value) {
    showToast('Avval QR kod yarating!', 'error')
    return
  }

  downloadFile(currentQRBlob.value, `qrcode_${Date.now()}.png`)
  showToast('QR kod yuklab olindi!', 'success')
}

// Toast System
const showToast = (message, type = 'info') => {
  const toast = {
    id: ++toastId,
    message,
    type
  }
  toasts.value.push(toast)
  
  setTimeout(() => {
    removeToast(toast.id)
  }, 5000)
}

const removeToast = (id) => {
  const index = toasts.value.findIndex(toast => toast.id === id)
  if (index > -1) {
    toasts.value.splice(index, 1)
  }
}

// Cleanup blob URLs on unmount
onMounted(() => {
  return () => {
    if (qrImageUrl.value) {
      URL.revokeObjectURL(qrImageUrl.value)
    }
  }
})
</script>

<style scoped>
/* Custom slider styles for Webkit browsers */
.slider::-webkit-slider-thumb {
  appearance: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(45deg, #ec4899, #f97316);
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.4);
  transition: all 0.3s ease;
}

.slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 6px 20px rgba(236, 72, 153, 0.6);
}

.slider::-moz-range-thumb {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(45deg, #ec4899, #f97316);
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.4);
  border: none;
  transition: all 0.3s ease;
}

.slider::-moz-range-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 6px 20px rgba(236, 72, 153, 0.6);
}

/* Animation classes */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.6s ease-out;
}
</style>