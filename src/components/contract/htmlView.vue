<template>
  <div :class="[
    'min-h-screen transition-colors duration-300',
    isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
  ]">
    <!-- Fixed Mobile Header -->
    <div :class="[
      'fixed top-0 left-0 right-0 z-40 backdrop-blur-md border-b px-4 py-3',
      isDarkMode 
        ? 'bg-gray-900/80 border-gray-700' 
        : 'bg-white/80 border-gray-200'
    ]" style="padding-top: env(safe-area-inset-top);">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <button 
            @click="$router.go(-1)"
            :class="[
              'p-2 rounded-full transition-colors',
              isDarkMode ? 'hover:bg-gray-800 text-white' : 'hover:bg-gray-100 text-gray-700'
            ]"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 :class="[
              'text-lg font-semibold',
              isDarkMode ? 'text-white' : 'text-gray-900'
            ]">
              PDF Ko'rish
            </h1>
            <p v-if="pdfPages.length" :class="[
              'text-xs',
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            ]">
              {{ pdfPages.length }} sahifa
            </p>
          </div>
        </div>
        
        <div class="flex items-center space-x-2">
          <!-- Theme Toggle -->
          <button 
            @click="toggleTheme"
            :class="[
              'p-2 rounded-full transition-all duration-300',
              isDarkMode 
                ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300' 
                : 'bg-gray-800 text-white hover:bg-gray-700'
            ]"
          >
            <svg v-if="isDarkMode" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd" />
            </svg>
            <svg v-else class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          </button>
          
          <!-- Download Button -->
          <button 
            v-if="fileUrl"
            @click="downloadPdf" 
            :class="[
              'p-2 rounded-full transition-colors',
              isDarkMode 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-blue-500 text-white hover:bg-blue-600'
            ]"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <main class="pt-20 pb-20" style="padding-top: calc(env(safe-area-inset-top) + 80px);">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div class="relative mb-6">
          <div :class="[
            'w-16 h-16 border-4 border-t-transparent rounded-full animate-spin',
            isDarkMode ? 'border-blue-400' : 'border-blue-600'
          ]"></div>
          <div :class="[
            'absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-500 rounded-full animate-spin',
            'animation-delay-150'
          ]"></div>
        </div>
        <div :class="[
          'text-lg font-medium tracking-wide animate-pulse text-center',
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        ]">
          {{ dat === 'datakril' ? translateText('Yuklanmoqda...') : 'Yuklanmoqda...' }}
        </div>
      </div>

      <!-- PDF Viewer -->
      <div v-else-if="pdfPages.length" class="px-3">
        <!-- PDF Pages -->
        <div class="space-y-4">
          <div 
            v-for="(page, index) in pdfPages" 
            :key="index" 
            :class="[
              'rounded-xl shadow-lg overflow-hidden transition-all duration-300',
              isDarkMode 
                ? 'bg-gray-800 border border-gray-700' 
                : 'bg-white border border-gray-200'
            ]"
          >
            <!-- Page Header -->
            <div :class="[
              'px-4 py-3 border-b flex items-center justify-between',
              isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
            ]">
              <span :class="[
                'text-sm font-medium',
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              ]">
                {{ index + 1 }} / {{ pdfPages.length }}
              </span>
              <div class="flex items-center space-x-2">
                <!-- Zoom Controls -->
                <div class="flex items-center space-x-1">
                  <button 
                    @click="zoomOut" 
                    :disabled="zoomLevel <= 0.5"
                    :class="[
                      'p-1.5 rounded-lg transition-colors text-xs',
                      'disabled:opacity-50 disabled:cursor-not-allowed',
                      isDarkMode 
                        ? 'bg-gray-700 text-white hover:bg-gray-600 disabled:hover:bg-gray-700' 
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:hover:bg-gray-200'
                    ]"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                    </svg>
                  </button>
                  
                  <span :class="[
                    'text-xs px-2 py-1 rounded',
                    isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'
                  ]">
                    {{ Math.round(zoomLevel * 100) }}%
                  </span>
                  
                  <button 
                    @click="zoomIn" 
                    :disabled="zoomLevel >= 3"
                    :class="[
                      'p-1.5 rounded-lg transition-colors text-xs',
                      'disabled:opacity-50 disabled:cursor-not-allowed',
                      isDarkMode 
                        ? 'bg-gray-700 text-white hover:bg-gray-600 disabled:hover:bg-gray-700' 
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:hover:bg-gray-200'
                    ]"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
                
                <!-- Rotation Controls -->
                <button 
                  @click="rotatePage(index, -90)"
                  :class="[
                    'p-1.5 rounded-lg transition-colors',
                    isDarkMode 
                      ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                      : 'hover:bg-gray-200 text-gray-500 hover:text-gray-700'
                  ]"
                >
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                </button>
                <button 
                  @click="rotatePage(index, 90)"
                  :class="[
                    'p-1.5 rounded-lg transition-colors',
                    isDarkMode 
                      ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                      : 'hover:bg-gray-200 text-gray-500 hover:text-gray-700'
                  ]"
                >
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 10H11a8 8 0 00-8 8v2m18-10l-6-6m6 6l-6 6" />
                  </svg>
                </button>
              </div>
            </div>
            
            <!-- Page Content -->
            <div class="p-2 overflow-hidden">
              <div class="overflow-auto max-h-[70vh]">
                <img 
                  :src="page" 
                  :style="{ 
                    transform: `scale(${zoomLevel}) rotate(${pageRotations[index] || 0}deg)`,
                    transformOrigin: 'center center'
                  }"
                  class="w-full rounded-lg shadow-sm object-cover transition-all duration-300" 
                  :alt="`PDF Sahifa ${index + 1}`"
                  @load="handleImageLoad"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else class="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div :class="[
          'text-center p-6 rounded-2xl shadow-lg max-w-sm mx-auto',
          isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600'
        ]">
          <svg class="w-16 h-16 mx-auto mb-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 class="text-lg font-semibold mb-2">PDF topilmadi</h2>
          <p class="text-sm">Kechirasiz, PDF fayli yuklanmadi yoki topilmadi.</p>
        </div>
      </div>
    </main>

    <!-- Floating Action Buttons -->
    <div class="fixed bottom-6 right-4 flex flex-col space-y-3 z-30">
      <!-- Scroll to Top -->
      <button 
        v-if="showScrollTop"
        @click="scrollToTop"
        :class="[
          'p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110',
          isDarkMode 
            ? 'bg-gray-700 text-white hover:bg-gray-600' 
            : 'bg-white text-gray-700 hover:bg-gray-100'
        ]"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
      
      <!-- Quick Zoom Reset -->
      <button 
        v-if="zoomLevel !== 1"
        @click="resetZoom"
        :class="[
          'p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110',
          isDarkMode 
            ? 'bg-blue-600 text-white hover:bg-blue-700' 
            : 'bg-blue-500 text-white hover:bg-blue-600'
        ]"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, inject } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import * as pdfjsLib from 'pdfjs-dist';
import { URL } from '@/auth/url.js';
import translateText from '@/auth/Translate';

const route = useRoute();
const id = route.params.id;
const id2 = Number(route.params.id2);
const clientData = ref(null);
const pdfPages = ref([]);
const fileUrl = ref('');
const isLoading = inject('isLoading');
const zoomLevel = ref(1);
const pageRotations = ref({});
const showScrollTop = ref(false);
const isDarkMode = ref(false);
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light');
};
const initializeTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  isDarkMode.value = savedTheme === 'dark' || (!savedTheme && systemPrefersDark);
};
const zoomIn = () => {
  if (zoomLevel.value < 3) {
    zoomLevel.value = Math.min(zoomLevel.value + 0.25, 3);
  }
};
const zoomOut = () => {
  if (zoomLevel.value > 0.5) {
    zoomLevel.value = Math.max(zoomLevel.value - 0.25, 0.5);
  }
};
const resetZoom = () => {
  zoomLevel.value = 1;
};
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};
const handleScroll = () => {
  showScrollTop.value = window.scrollY > 300;
};
const rotatePage = (pageIndex, degrees) => {
  const currentRotation = pageRotations.value[pageIndex] || 0;
  pageRotations.value[pageIndex] = currentRotation + degrees;
};
const handleImageLoad = () => {
  setTimeout(() => {
    window.dispatchEvent(new Event('resize'));
  }, 100);
};
const fetchClientById = async () => {
  isLoading.value = true
  try {
    const response = await axios.get(`${URL}/client-files/${id}`);
    clientData.value = response.data;

    if (clientData.value.filePath) {
      fileUrl.value = clientData.value.filePath.startsWith('http')
        ? clientData.value.filePath
        : `${URL}${clientData.value.filePath}`;
    } else {
      console.error('No filePath found in the API response');
      fileUrl.value = '';
    }
  } catch (error) {
    console.error('Error fetching client data:', error.message);
    clientData.value = null;
    fileUrl.value = '';
  }finally{
    isLoading.value = false
  }
};
const renderPdf = async (url) => {
  isLoading.value = true
  try {
    const loadingTask = pdfjsLib.getDocument(url);
    const pdf = await loadingTask.promise;
    pdfPages.value = [];
    const scale = window.devicePixelRatio > 1 ? 2 : 1.5;
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await page.render({ canvasContext: context, viewport }).promise;
      const imageDataUrl = canvas.toDataURL('image/png', 0.9);
      pdfPages.value.push(imageDataUrl);
    }
  } catch (error) {
    console.error('PDF yuklashda xatolik:', error);
    pdfPages.value = [];
  } finally{
    isLoading.value = false
  }
};
const downloadPdf = () => {
  if (fileUrl.value) {
    const link = document.createElement('a');
    link.href = fileUrl.value;
    link.download = `document_${id2}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
const getDataAndRender = async () => {
  isLoading.value = true;
  await fetchClientById();
  if (fileUrl.value) {
    await renderPdf(fileUrl.value);
  }
  isLoading.value = false;
};

const dat = ref(localStorage.getItem('til') || 'datalotin');

let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

const handleTouchStart = (e) => {
  touchStartX = e.changedTouches[0].screenX;
  touchStartY = e.changedTouches[0].screenY;
};

const handleTouchEnd = (e) => {
  touchEndX = e.changedTouches[0].screenX;
  touchEndY = e.changedTouches[0].screenY;
  handleSwipeGesture();
};

const handleSwipeGesture = () => {
  const deltaX = touchEndX - touchStartX;
  const deltaY = touchEndY - touchStartY;
};

onMounted(() => {
  initializeTheme();
  getDataAndRender();
  window.addEventListener('scroll', handleScroll);
  
  // Add touch event listeners for mobile gestures
  document.addEventListener('touchstart', handleTouchStart, { passive: true });
  document.addEventListener('touchend', handleTouchEnd, { passive: true });
  
  // Prevent zoom on double tap
  document.addEventListener('touchend', (e) => {
    if (e.touches.length > 1) {
      e.preventDefault();
    }
  }, { passive: false });
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  document.removeEventListener('touchstart', handleTouchStart);
  document.removeEventListener('touchend', handleTouchEnd);
});
</script>

<style scoped>
/* Mobile-first responsive design */
@media (max-width: 640px) {
  .container {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.animation-delay-150 {
  animation-delay: 150ms;
}

/* Improved scrollbar for mobile */
::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.5);
  border-radius: 2px;
}

.dark ::-webkit-scrollbar-thumb {
  background: rgba(75, 85, 99, 0.5);
}

/* Prevent text selection on mobile */
.prevent-select {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* Mobile touch improvements */
button {
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

/* Safe area handling for mobile */
@supports (padding: env(safe-area-inset-top)) {
  .safe-area-top {
    padding-top: env(safe-area-inset-top);
  }
  
  .safe-area-bottom {
    padding-bottom: env(safe-area-inset-bottom);
  }
}

/* Optimized for mobile viewport */
@media (max-width: 768px) {
  .pdf-page-container {
    margin: 0 -0.5rem;
  }
  
  .floating-buttons {
    bottom: calc(env(safe-area-inset-bottom) + 1rem);
  }
}

/* Prevent overscroll on mobile */
body {
  overscroll-behavior: none;
}

/* Touch-friendly tap targets */
.touch-target {
  min-height: 44px;
  min-width: 44px;
}
</style>