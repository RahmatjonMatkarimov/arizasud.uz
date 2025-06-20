```vue
<template>
  <!-- Mobile-First Header with Theme and Language Toggle -->
  <header class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 backdrop-blur-lg transition-colors duration-300">
    <div class="px-4 py-3">
      <div class="flex items-center justify-between">
        <!-- Mobile Logo -->
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
          <h1 class="text-lg font-bold text-gray-900 dark:text-white">{{ dat === 'datakril' ? translateText('VideoStream') : 'VideoStream' }}</h1>
        </div>
        
        <!-- Theme and Language Toggle Buttons -->
        <div class="flex items-center space-x-2">
          <!-- Language Toggle Button -->
          <button 
            @click="toggleLanguage"
            class="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
            :aria-label="dat === 'datakril' ? translateText('Lotin yozuviga o\'tish') : 'Kirill yozuviga o\'tish'"
          >
            <span class="text-sm font-medium">{{ dat === 'datakril' ? 'Ўз' : 'Uz' }}</span>
          </button>
          
          <!-- Theme Toggle Button -->
          <button 
            @click="toggleTheme"
            class="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
            :aria-label="isDark ? (dat === 'datakril' ? translateText('Light rejimga o\'tish') : 'Light rejimga o\'tish') : (dat === 'datakril' ? translateText('Dark rejimga o\'tish') : 'Dark rejimga o\'tish')"
            :aria-pressed="isDark"
          >
            <!-- Sun Icon (Light Mode) -->
            <svg 
              v-if="isDark" 
              class="w-6 h-6 transform transition-transform duration-300 rotate-0 hover:rotate-12" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
            </svg>
            <!-- Moon Icon (Dark Mode) -->
            <svg 
              v-else 
              class="w-6 h-6 transform transition-transform duration-300 rotate-0 hover:-rotate-12" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </header>

  <!-- Mobile-Optimized Content -->
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <!-- Error Modal at Top -->
    <div 
      v-if="!videoUrl && !isLoading" 
      class="fixed top-0 left-0 right-0 bg-red-100 dark:bg-red-900/80 backdrop-blur-md z-40 p-4 border-b border-red-200 dark:border-red-700 animate-slideIn"
      role="alert"
    >
      <div class="relative flex flex-col items-center space-y-4 max-w-md mx-auto">
        <!-- Close Button -->
        <button 
          @click="errorMessage = ''" 
          class="absolute top-2 right-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300" 
          :aria-label="dat === 'datakril' ? translateText('Close error modal') : 'Close error modal'"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
        <div class="w-12 h-12 bg-red-200 dark:bg-red-500/30 rounded-full flex items-center justify-center">
          <svg class="w-6 h-6 text-red-500 dark:text-red-400" fill="currentColor" viewBox="0 0 24 24">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
          </svg>
        </div>
        <div class="space-y-2 text-center">
          <h3 class="text-base font-semibold text-red-600 dark:text-red-300">{{ dat === 'datakril' ? translateText('Xatolik yuz berdi') : 'Xatolik yuz berdi' }}</h3>
          <p class="text-sm text-red-600 dark:text-red-400">
            {{ errorMessage || (dat === 'datakril' ? translateText('Video yuklanmadi') : 'Video yuklanmadi') }}
          </p>
        </div>
        <button 
          @click="getDataAndRender" 
          class="px-4 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white rounded-lg transition-all duration-300 font-medium transform hover:scale-105"
          :aria-label="dat === 'datakril' ? translateText('Retry loading video') : 'Retry loading video'"
        >
          {{ dat === 'datakril' ? translateText('Qayta urinish') : 'Qayta urinish' }}
        </button>
      </div>
    </div>

    <!-- Toast Notification at Top -->
    <div 
      v-if="showToast" 
      :class="[
        'fixed top-16 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg shadow-lg transition-all duration-300 animate-slideIn z-30',
        toastMessage.includes(dat === 'datakril' ? 'хатоси' : 'xatosi') ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
      ]"
      role="alert"
    >
      {{ toastMessage }}
    </div>

    <!-- Main Container -->
    <main class="pb-20 pt-4">
      <!-- Loading State -->
      <div v-if="isLoading" class="px-4 py-8 text-center">
        <div class="flex flex-col items-center space-y-4">
          <div class="relative">
            <div class="w-12 h-12 border-3 border-gray-300 dark:border-gray-600 rounded-full animate-spin"></div>
            <div class="absolute inset-0 w-12 h-12 border-3 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
          </div>
          <p class="text-gray-600 dark:text-gray-300 text-base">
            {{ dat === 'datakril' ? translateText('Video yuklanmoqda...') : 'Video yuklanmoqda...' }}
          </p>
        </div>
      </div>
      
      <!-- Video Player -->
      <div v-else-if="videoUrl" class="space-y-4">
        <!-- Video Container -->
        <div class="relative bg-black rounded-lg mx-4 overflow-hidden shadow-xl">
          <video 
            ref="videoPlayer"
            controls 
            class="w-full h-auto max-h-[50vh] object-contain"
            controlsList="nodownload"
            preload="metadata"
            playsinline
            @loadedmetadata="onVideoLoaded"
            @loadeddata="analyzeVideo"
            @canplay="generateThumbnail"
            @timeupdate="onTimeUpdate"
            @play="isPlaying = true"
            @pause="isPlaying = false"
            @ended="onVideoEnded"
            :aria-label="dat === 'datakril' ? translateText('Video player') : 'Video player'"
          >
            <source :src="videoUrl" type="video/mp4">
            {{ dat === 'datakril' ? translateText('Sizning brauzeringiz video formatini qoʻllab-quvvatlamaydi.') : 'Sizning brauzeringiz video formatini qoʻllab-quvvatlamaydi.' }}
          </video>
          
          <!-- Mobile Video Overlay -->
          <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 hover:opacity-100 transition-opacity duration-300">
            <div class="flex items-center justify-between text-white text-sm">
              <span>{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</span>
              <button @click="toggleFullscreen" class="p-2 bg-black/50 rounded-lg hover:bg-black/70 transition-colors" :aria-label="dat === 'datakril' ? translateText('Toggle fullscreen') : 'Toggle fullscreen'">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Video Info -->
        <div class="px-4 space-y-4">
          <!-- Title and Stats -->
          <div class="space-y-2">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white leading-tight">{{ dat === 'datakril' ? translateText(videoData.title):videoData.title }}</h2>
            <div class="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <span class="flex items-center space-x-1">
                <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>{{ videoData.quality }}</span>
              </span>
              <span>{{ formatTime(duration) }}</span>
              <span>{{ videoData.resolution }}</span>
              <span>{{ new Date(videoData.uploadDate).toLocaleDateString(dat === 'datakril' ? 'uz-Cyrl-UZ' : 'uz-Latn-UZ') }}</span>
            </div>
          </div>
          
          <!-- Action Buttons - Mobile Optimized -->
          <div class="flex space-x-3 overflow-x-auto pb-2">
            <button 
              @click="shareVideo" 
              class="flex-shrink-0 flex items-center space-x-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-all duration-300 transform hover:scale-105" 
              :aria-label="dat === 'datakril' ? translateText('Share video') : 'Share video'"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.70l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.70L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.50-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
              </svg>
              <span class="text-sm font-medium">{{ dat === 'datakril' ? translateText('Ulashish') : 'Ulashish' }}</span>
            </button>
            
            <button 
              @click="downloadVideo"
              class="flex-shrink-0 flex items-center space-x-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-all duration-300 transform hover:scale-105" 
              :aria-label="dat === 'datakril' ? translateText('Download video') : 'Download video'"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
              </svg>
              <span class="text-sm font-medium">{{ dat === 'datakril' ? translateText('Yuklash') : 'Yuklash' }}</span>
            </button>
          </div>
          
          <!-- Stats Cards - Mobile Grid (Only File Size) -->
          <div class="grid grid-cols-1 gap-3">
            <div class="bg-white dark:bg-gray-800 rounded-lg p-3 text-center shadow-md dark:shadow-gray-900/20 border border-gray-200 dark:border-gray-700 transition-all duration-300">
              <div class="text-lg font-bold text-green-600 dark:text-green-400">{{ formatFileSize(videoData.fileSize) }}</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">{{ dat === 'datakril' ? translateText('Hajmi') : 'Hajmi' }}</div>
            </div>
          </div>
        </div>
        
        <!-- Video Details -->
        <div class="px-4 space-y-4">
          <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md dark:shadow-gray-900/20 border border-gray-200 dark:border-gray-700 transition-all duration-300">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">{{ dat === 'datakril' ? translateText('Video haqida') : 'Video haqida' }}</h3>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-500 dark:text-gray-400">{{ dat === 'datakril' ? translateText('Format') : 'Format' }}</span>
                <span class="text-gray-900 dark:text-white font-medium">{{ videoData.format }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500 dark:text-gray-400">{{ dat === 'datakril' ? translateText('Sifat') : 'Sifat' }}</span>
                <span class="text-gray-900 dark:text-white font-medium">{{ videoData.quality }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500 dark:text-gray-400">{{ dat === 'datakril' ? translateText('O\'lcham') : 'O\'lcham' }}</span>
                <span class="text-gray-900 dark:text-white font-medium">{{ videoData.resolution }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500 dark:text-gray-400">{{ dat === 'datakril' ? translateText('Davomiyligi') : 'Davomiyligi' }}</span>
                <span class="text-gray-900 dark:text-white font-medium">{{ formatTime(duration) }}</span>
              </div>
              <div class="flex justify-between" v-if="videoData.fps">
                <span class="text-gray-500 dark:text-gray-400">{{ dat === 'datakril' ? translateText('FPS') : 'FPS' }}</span>
                <span class="text-gray-900 dark:text-white font-medium">{{ videoData.fps }}</span>
              </div>
              <div class="flex justify-between" v-if="videoData.bitrate">
                <span class="text-gray-500 dark:text-gray-400">{{ dat === 'datakril' ? translateText('Bitrate') : 'Bitrate' }}</span>
                <span class="text-gray-900 dark:text-white font-medium">{{ videoData.bitrate }}</span>
              </div>
              <div class="flex justify-between" v-if="videoData.codec">
                <span class="text-gray-500 dark:text-gray-400">{{ dat === 'datakril' ? translateText('Codec') : 'Codec' }}</span>
                <span class="text-gray-900 dark:text-white font-medium">{{ videoData.codec }}</span>
              </div>
              <div class="flex justify-between" v-if="videoData.aspectRatio">
                <span class="text-gray-500 dark:text-gray-400">{{ dat === 'datakril' ? translateText('Nisbat') : 'Nisbat' }}</span>
                <span class="text-gray-900 dark:text-white font-medium">{{ videoData.aspectRatio }}:1</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { debounce } from 'lodash';
import { URL } from '@/auth/url.js';
import translateText from '@/auth/Translate';

// Reactive language state
const dat = ref(localStorage.getItem('til') || 'datalotin');

// Watch for changes to dat and sync with localStorage
watch(dat, (newValue) => {
  if (newValue === 'datakril' || newValue === 'datalotin') {
    localStorage.setItem('til', newValue);
  } else {
    dat.value = 'datalotin';
    localStorage.setItem('til', 'datalotin');
  }
});

// Observe localStorage changes for same-tab updates
let observer = null;
const observeLocalStorage = () => {
  // Fallback to polling since MutationObserver can't directly watch localStorage
  observer = setInterval(() => {
    const storedLang = localStorage.getItem('til') || 'datalotin';
    if (storedLang !== dat.value && (storedLang === 'datakril' || storedLang === 'datalotin')) {
      dat.value = storedLang;
    }
  }, 100); // Poll every 100ms for responsiveness
};

// Handle storage events for cross-tab sync
const handleStorageChange = (event) => {
  if (event.key === 'til') {
    const newLang = event.newValue || 'datalotin';
    if (newLang === 'datakril' || newLang === 'datalotin') {
      dat.value = newLang;
    }
  }
};

const route = useRoute();
const id = route.params.id;
const videoUrl = ref('');
const isLoading = ref(false);
const videoPlayer = ref(null);
const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const errorMessage = ref('');
const showToast = ref(false);
const toastMessage = ref('');

// Theme management
const isDark = ref(false);

// Auto-detected video data
const videoData = ref({
  title: '',
  quality: '',
  resolution: '',
  format: '',
  fileSize: 0,
  fps: 0,
  bitrate: '',
  aspectRatio: '',
  codec: '',
  uploadDate: new Date().toISOString(),
  thumbnail: ''
});

// Language toggle function
const toggleLanguage = () => {
  dat.value = dat.value === 'datakril' ? 'datalotin' : 'datakril';
};

// Theme toggle function
const toggleTheme = () => {
  isDark.value = !isDark.value;
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
  updateTheme();
};

// Update theme function
const updateTheme = () => {
  if (isDark.value) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

// Initialize theme
const initTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  isDark.value = savedTheme ? savedTheme === 'dark' : prefersDark;
  updateTheme();
};

// Auto-detect video properties
const analyzeVideo = async () => {
  if (!videoPlayer.value) return;
  const video = videoPlayer.value;
  
  // Get basic video properties
  videoData.value.resolution = `${video.videoWidth}x${video.videoHeight}`;
  videoData.value.aspectRatio = (video.videoWidth / video.videoHeight).toFixed(2);
  
  // Determine quality based on height
  const height = video.videoHeight;
  if (height >= 2160) videoData.value.quality = dat.value === 'datakril' ? translateText('4K Ultra HD') : '4K Ultra HD';
  else if (height >= 1440) videoData.value.quality = dat.value === 'datakril' ? translateText('2K QHD') : '2K QHD';
  else if (height >= 1080) videoData.value.quality = dat.value === 'datakril' ? translateText('Full HD') : 'Full HD';
  else if (height >= 720) videoData.value.quality = dat.value === 'datakril' ? translateText('HD') : 'HD';
  else if (height >= 480) videoData.value.quality = dat.value === 'datakril' ? translateText('SD') : 'SD';
  else videoData.value.quality = dat.value === 'datakril' ? translateText('Low Quality') : 'Low Quality';
  
  // Get file size from network info
  try {
    const response = await fetch(videoUrl.value, { method: 'HEAD' });
    const contentLength = response.headers.get('content-length');
    if (contentLength) videoData.value.fileSize = parseInt(contentLength);
  } catch (error) {
    // Estimate file size
    const estimatedBitrate = height >= 1080 ? 8000000 : height >= 720 ? 5000000 : 2500000;
    videoData.value.fileSize = Math.floor((duration.value * estimatedBitrate) / 8);
  }
  
  // Extract format
  const urlParts = videoUrl.value.split('.');
  const extension = urlParts[urlParts.length - 1].split('?')[0].toUpperCase();
  videoData.value.format = extension || 'MP4';
  
  // Generate title
  const fileName = videoUrl.value.split('/').pop().split('.')[0];
  videoData.value.title = fileName ? 
    fileName.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 
    (dat.value === 'datakril' ? translateText('Premium Video Content') : 'Premium Video Content');
  
  // Estimate FPS
  videoData.value.fps = height >= 1080 ? 60 : 30;
  
  // Calculate bitrate
  if (videoData.value.fileSize > 0 && duration.value > 0) {
    const bitrateKbps = Math.floor((videoData.value.fileSize * 8) / (duration.value * 1000));
    videoData.value.bitrate = bitrateKbps > 1000 ? 
      `${(bitrateKbps / 1000).toFixed(1)} ${dat.value === 'datakril' ? translateText('Mbps') : 'Mbps'}` : 
      `${bitrateKbps} ${dat.value === 'datakril' ? translateText('Kbps') : 'Kbps'}`;
  }
  
  // Detect codec
  videoData.value.codec = extension === 'WEBM' ? 'VP9' : 'H.264';
};

// Enhanced video load handler
const onVideoLoaded = async () => {
  if (videoPlayer.value) {
    duration.value = videoPlayer.value.duration;
    await analyzeVideo();
  }
};

// Auto-generate thumbnail
const generateThumbnail = () => {
  if (!videoPlayer.value) return;
  try {
    const canvas = document.createElement('canvas');
    const video = videoPlayer.value;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error(dat.value === 'datakril' ? translateText('Canvas context not available') : 'Canvas context not available');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    videoData.value.thumbnail = canvas.toDataURL('image/jpeg', 0.8);
  } catch (error) {
    console.error('Thumbnail generation failed:', error);
    videoData.value.thumbnail = '/fallback-thumbnail.jpg';
  }
};

// Debounced time update
const onTimeUpdate = debounce(() => {
  if (videoPlayer.value) {
    currentTime.value = videoPlayer.value.currentTime;
    if (currentTime.value >= duration.value * 0.1 && !videoData.value.thumbnail) {
      generateThumbnail();
    }
  }
}, 100);

const onVideoEnded = () => {
  isPlaying.value = false;
};

const toggleFullscreen = () => {
  if (videoPlayer.value) {
    if (videoPlayer.value.requestFullscreen) {
      videoPlayer.value.requestFullscreen();
    } else if (videoPlayer.value.webkitRequestFullscreen) {
      videoPlayer.value.webkitRequestFullscreen();
    }
  }
};

// Share video function
const shareVideo = async () => {
  if (!videoUrl.value) return;
  
  const shareData = {
    title: videoData.value.title,
    text: dat.value === 'datakril' ? translateText('VideoStream dan ajoyib video!') : 'VideoStream dan ajoyib video!',
    url: videoUrl.value,
  };
  
  try {
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      await navigator.share(shareData);
      showToastMessage(dat.value === 'datakril' ? translateText('Video ulashildi') : 'Video ulashildi', 3000);
    } else {
      // Fallback: Copy to clipboard
      await navigator.clipboard.writeText(videoUrl.value);
      showToastMessage(dat.value === 'datakril' ? translateText('Havola nusxalandi') : 'Havola nusxalandi', 3000);
    }
  } catch (error) {
    console.error('Share error:', error);
    showToastMessage(dat.value === 'datakril' ? translateText('Ulashish xatosi') : 'Ulashish xatosi', 3000);
  }
};

// Download video function
const downloadVideo = async () => {
  if (!videoUrl.value) {
    showToastMessage(dat.value === 'datakril' ? translateText('Yuklash xatosi') : 'Yuklash xatosi', 3000);
    return;
  }
  
  try {
    const response = await fetch(videoUrl.value, { 
      mode: 'cors',
      headers: {
        'Accept': `video/${videoData.value.format.toLowerCase()}`
      }
    });
    if (!response.ok) throw new Error(`Network response was not ok: ${response.status}`);
    
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `${videoData.value.title}.${videoData.value.format.toLowerCase()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    window.URL.revokeObjectURL(downloadUrl);
    
    showToastMessage(dat.value === 'datakril' ? translateText('Yuklash boshlandi') : 'Yuklash boshlandi', 3000);
  } catch (error) {
    console.error('Download error:', error);
    showToastMessage(dat.value === 'datakril' ? translateText('Yuklash xatosi') : 'Yuklash xatosi', 3000);
  }
};

// Show toast notification
const showToastMessage = (message, duration) => {
  toastMessage.value = message;
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
    toastMessage.value = '';
  }, duration);
};

// Utility functions
const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
};

// API call with timeout
const fetchVideoById = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    const response = await axios.get(`${URL}/client-files/${id}`, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    const filePath = response.data.filePath;
    if (filePath) {
      videoUrl.value = filePath.startsWith('http') ? filePath : `${URL}${filePath}`;
      videoData.value = {
        ...videoData.value,
        title: response.data.title || videoData.value.title,
        fileSize: Number(response.data.size) || videoData.value.fileSize,
        uploadDate: response.data.uploadDate || videoData.value.uploadDate,
      };
    } else {
      throw new Error('No filePath found');
    }
  } catch (error) {
    console.error('Error fetching video:', error.message);
    videoUrl.value = '';
    errorMessage.value = error.response?.data?.message || (dat.value === 'datakril' ? translateText('Video topilmadi') : 'Video topilmadi');
  }
};

const getDataAndRender = async () => {
  isLoading.value = true;
  await fetchVideoById();
  isLoading.value = false;
};

onMounted(() => {
  initTheme();
  getDataAndRender();
  observeLocalStorage();
  window.addEventListener('storage', handleStorageChange);
});

onUnmounted(() => {
  onTimeUpdate.cancel();
  if (observer) clearInterval(observer);
  window.removeEventListener('storage', handleStorageChange);
});
</script>

<style scoped>
/* Mobile-First Styles */
html {
  touch-action: manipulation;
}

/* Video optimizations */
video {
  max-width: 100%;
  height: auto;
  background: #000;
}

video::-webkit-media-controls {
  overflow: visible !important;
}

video::-webkit-media-controls-enclosure {
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 8px;
}

/* Touch-friendly buttons */
button {
  min-height: 44px;
  min-width: 44px;
  touch-action: manipulation;
}

/* Prevent zoom on focus */
input, select, textarea {
  font-size: 16px;
}

/* Smooth scrolling */
* {
  -webkit-overflow-scrolling: touch;
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  @apply bg-gray-300 dark:bg-gray-600;
  border-radius: 2px;
}

/* Focus states */
button:focus,
video:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Transitions */
* {
  transition: all 0.2s ease;
}

/* Prevent text selection */
button, .controls {
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
}

/* Safe area */
@supports (padding: max(0px)) {
  .safe-area-bottom {
    padding-bottom: max(20px, env(safe-area-inset-bottom));
  }
}

/* Portrait */
@media screen and (orientation: portrait) {
  video {
    max-height: 50vh;
  }
}

/* Landscape */
@media screen and (orientation: landscape) and (max-width: 768px) {
  video {
    max-height: 80vh;
  }
  .mobile-controls {
    display: none;
  }
}

/* Small screens */
@media (max-width: 320px) {
  .px-4 {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }
  .text-xl {
    font-size: 1.125rem;
  }
}

/* High-DPI */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .bg-gradient-to-br {
    background-image: linear-gradient(135deg, var(--tw-gradient-stops));
  }
}

/* Theme transitions */
.theme-transition {
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-slideIn {
  animation: slideIn 0.3s ease-out;
}

/* Glassmorphism */
.dark .backdrop-blur-lg {
  background-color: rgba(17, 24, 39, 0.8);
}

.backdrop-blur-lg {
  background-color: rgba(255, 255, 255, 0.8);
}

/* Hover effects */
.hover-lift {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.dark .hover-lift:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}
</style>
```