<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 transition-all duration-500">
    <!-- Animated Background Pattern -->
    <div class="fixed inset-0 opacity-30 dark:opacity-20">
      <div class="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-600/20 animate-pulse"></div>
      <div class="absolute top-0 left-0 w-72 h-72 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div class="absolute top-0 right-0 w-72 h-72 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div class="absolute bottom-0 left-0 w-72 h-72 bg-pink-500/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
    </div>

    <!-- Premium Header -->
    <header class="relative z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/50 dark:border-slate-700/50 shadow-lg shadow-slate-900/5">
      <div class="max-w-7xl mx-auto px-6 lg:px-8">
        <div class="flex items-center justify-between h-20">
          <!-- Brand Section -->
          <div class="flex items-center space-x-4">
            <div class="relative">
              <div class="w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-xl shadow-lg flex items-center justify-center transform hover:scale-105 transition-transform duration-200">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <div class="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></div>
            </div>
            <div>
              <h1 class="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                DocuView Pro
              </h1>
              <p class="text-sm text-slate-500 dark:text-slate-400 font-medium">Professional Document Viewer</p>
            </div>
          </div>

          <!-- Action Controls -->
          <div class="flex items-center space-x-3">
            <!-- Zoom Controls -->
            <div class="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1 space-x-1">
              <button 
                @click="zoomOut"
                class="p-2 rounded-md hover:bg-white dark:hover:bg-slate-700 transition-colors duration-200 text-slate-600 dark:text-slate-300"
                title="Kichiklashtirish"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                </svg>
              </button>
              <span class="px-3 py-1 text-sm font-medium text-slate-700 dark:text-slate-300 min-w-[60px] text-center">
                {{ Math.round(zoomLevel * 100) }}%
              </span>
              <button 
                @click="zoomIn"
                class="p-2 rounded-md hover:bg-white dark:hover:bg-slate-700 transition-colors duration-200 text-slate-600 dark:text-slate-300"
                title="Kattalashtirish"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
              </button>
            </div>

            <!-- Theme Toggle -->
            <button 
              @click="toggleTheme"
              class="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300 group"
              :title="isDark ? 'Yorug\' rejimga o\'tish' : 'Qorong\'u rejimga o\'tish'"
            >
              <div class="relative">
                <svg v-if="isDark" class="w-5 h-5 text-amber-500 transform group-hover:rotate-180 transition-transform duration-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"></path>
                </svg>
                <svg v-else class="w-5 h-5 text-slate-700 transform group-hover:rotate-12 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
                </svg>
              </div>
            </button>

            <!-- Download Button -->
            <button 
              @click="downloadFile"
              class="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-600/30 transition-all duration-300 flex items-center space-x-2 group"
            >
              <svg class="w-5 h-5 transform group-hover:translate-y-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <span>Yuklab olish</span>
            </button>

            <!-- Settings Menu -->
            <div class="relative" ref="settingsRef">
              <button 
                @click="toggleSettings"
                class="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200"
              >
                <svg class="w-5 h-5 text-slate-600 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </button>

              <!-- Settings Dropdown -->
              <div v-if="showSettings" class="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 py-2 z-50">
                <div class="px-4 py-2 border-b border-slate-200 dark:border-slate-700">
                  <p class="font-semibold text-slate-900 dark:text-white">Ko'rinish sozlamalari</p>
                </div>
                <div class="p-4 space-y-4">
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-slate-700 dark:text-slate-300">Kompakt rejim</span>
                    <button @click="toggleCompactMode" class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors" :class="compactMode ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'">
                      <span class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform" :class="compactMode ? 'translate-x-6' : 'translate-x-1'"></span>
                    </button>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-slate-700 dark:text-slate-300">Avto-saqlash</span>
                    <button @click="toggleAutoSave" class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors" :class="autoSave ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'">
                      <span class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform" :class="autoSave ? 'translate-x-6' : 'translate-x-1'"></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Loading State -->
    <div v-if="isLoading" class="relative z-10 flex flex-col items-center justify-center min-h-[70vh]">
      <div class="relative">
        <div class="w-20 h-20 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-spin border-t-blue-600 dark:border-t-blue-400"></div>
        <div class="absolute inset-0 w-20 h-20 border-4 border-transparent rounded-full animate-ping border-t-blue-400"></div>
      </div>
      <div class="mt-8 text-center">
        <h3 class="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">Hujjat yuklanmoqda</h3>
        <p class="text-slate-600 dark:text-slate-400">Iltimos, kutib turing...</p>
        <div class="mt-4 flex items-center justify-center space-x-1">
          <div class="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
          <div class="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
          <div class="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="relative z-10 flex flex-col items-center justify-center min-h-[70vh]">
      <div class="text-center max-w-md mx-auto px-6">
        <div class="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6 mx-auto">
          <svg class="w-10 h-10 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
        </div>
        <h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-3">Xatolik yuz berdi</h3>
        <p class="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">{{ error }}</p>
        <button 
          @click="retry"
          class="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg transition-all duration-300 inline-flex items-center space-x-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          <span>Qayta urinish</span>
        </button>
      </div>
    </div>

    <!-- Document Container -->
    <main v-else class="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 py-8">
      <!-- Document Stats -->
      <div class="mb-6 flex items-center justify-between">
        <div class="flex items-center space-x-6 text-sm text-slate-600 dark:text-slate-400">
          <div class="flex items-center space-x-2">
            <div class="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Faol hujjat</span>
          </div>
          <div class="flex items-center space-x-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <span>ID: {{ id }}</span>
          </div>
          <div class="flex items-center space-x-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>{{ formatDate(new Date()) }}</span>
          </div>
        </div>
      </div>

      <!-- Premium Document Card -->
      <div class="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/30 overflow-hidden" :class="{ 'scale-95': compactMode }">
        <!-- Document Toolbar -->
        <div class="px-8 py-6 bg-gradient-to-r from-slate-50/80 to-slate-100/80 dark:from-slate-800/80 dark:to-slate-700/80 border-b border-slate-200/50 dark:border-slate-600/50">
          <div class="flex items-center justify-between">
            <!-- Window Controls -->
            <div class="flex items-center space-x-3">
              <div class="flex items-center space-x-2">
                <div class="w-3 h-3 bg-red-500 rounded-full shadow-sm hover:bg-red-600 transition-colors cursor-pointer"></div>
                <div class="w-3 h-3 bg-yellow-500 rounded-full shadow-sm hover:bg-yellow-600 transition-colors cursor-pointer"></div>
                <div class="w-3 h-3 bg-green-500 rounded-full shadow-sm hover:bg-green-600 transition-colors cursor-pointer"></div>
              </div>
              <div class="ml-4 text-sm font-medium text-slate-700 dark:text-slate-300">
                Document.docx
              </div>
            </div>

            <!-- Document Actions -->
            <div class="flex items-center space-x-2">
              <button class="p-2 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-600/50 transition-colors text-slate-500 dark:text-slate-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
                </svg>
              </button>
              <button class="p-2 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-600/50 transition-colors text-slate-500 dark:text-slate-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Document Content -->
        <div class="p-8 lg:p-12 min-h-[600px]" :style="{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }">
          <div 
            ref="docxContainer" 
            class="custom-docx-container mx-auto"
            :class="{ 
              'dark-mode': isDark,
              'compact': compactMode
            }"
          ></div>
        </div>
      </div>

      <!-- Footer Info -->
      <div class="mt-8 text-center">
        <p class="text-sm text-slate-500 dark:text-slate-400">
          Powered by <span class="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">DocuView Pro</span>
        </p>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* Custom Animations */
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

/* Premium Document Styles */
.custom-docx-container {
  @apply w-full max-w-4xl;
  min-height: 500px;
  font-family: 'Inter', 'Segoe UI', 'Times New Roman', serif;
}

/* Light Mode Document Styles */
.custom-docx-container :deep(.docx) {
  background-color: #ffffff !important;
  color: #1e293b !important;
  line-height: 1.7;
  font-size: 16px;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.custom-docx-container :deep(.docx *) {
  background-color: transparent !important;
  color: inherit !important;
  box-shadow: none !important;
  text-shadow: none !important;
}

.custom-docx-container :deep(.docx p) {
  margin-bottom: 1rem;
  text-align: justify;
}

.custom-docx-container :deep(.docx h1),
.custom-docx-container :deep(.docx h2),
.custom-docx-container :deep(.docx h3),
.custom-docx-container :deep(.docx h4),
.custom-docx-container :deep(.docx h5),
.custom-docx-container :deep(.docx h6) {
  font-weight: 700;
  margin-top: 2rem;
  margin-bottom: 1.25rem;
  color: #0f172a !important;
  line-height: 1.3;
}

.custom-docx-container :deep(.docx h1) { font-size: 2rem; }
.custom-docx-container :deep(.docx h2) { font-size: 1.5rem; }
.custom-docx-container :deep(.docx h3) { font-size: 1.25rem; }

.custom-docx-container :deep(.docx table) {
  border-collapse: collapse;
  width: 100%;
  margin: 1.5rem 0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.custom-docx-container :deep(.docx td),
.custom-docx-container :deep(.docx th) {
  border: 1px solid #e2e8f0 !important;
  padding: 0.75rem;
  text-align: left;
}

.custom-docx-container :deep(.docx th) {
  background-color: #f8fafc !important;
  font-weight: 600;
  color: #334155 !important;
}

.custom-docx-container :deep(.docx ul),
.custom-docx-container :deep(.docx ol) {
  padding-left: 1.5rem;
  margin-bottom: 1rem;
}

.custom-docx-container :deep(.docx li) {
  margin-bottom: 0.5rem;
}

/* Dark Mode Document Styles */
.custom-docx-container.dark-mode :deep(.docx) {
  background-color: #1e293b !important;
  color: #f1f5f9 !important;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
}

.custom-docx-container.dark-mode :deep(.docx *) {
  background-color: transparent !important;
  color: inherit !important;
}

.custom-docx-container.dark-mode :deep(.docx h1),
.custom-docx-container.dark-mode :deep(.docx h2),
.custom-docx-container.dark-mode :deep(.docx h3),
.custom-docx-container.dark-mode :deep(.docx h4),
.custom-docx-container.dark-mode :deep(.docx h5),
.custom-docx-container.dark-mode :deep(.docx h6) {
  color: #ffffff !important;
}

.custom-docx-container.dark-mode :deep(.docx td),
.custom-docx-container.dark-mode :deep(.docx th) {
  border-color: #475569 !important;
}

.custom-docx-container.dark-mode :deep(.docx th) {
  background-color: #334155 !important;
  color: #f1f5f9 !important;
}

/* Compact Mode */
.custom-docx-container.compact :deep(.docx) {
  padding: 1rem;
  font-size: 14px;
  line-height: 1.5;
}

.custom-docx-container.compact :deep(.docx h1) { font-size: 1.5rem; }
.custom-docx-container.compact :deep(.docx h2) { font-size: 1.25rem; }
.custom-docx-container.compact :deep(.docx h3) { font-size: 1.125rem; }

/* Smooth transitions for all elements */
.custom-docx-container,
.custom-docx-container :deep(*) {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Print Styles */
@media print {
  .custom-docx-container :deep(.docx) {
    background-color: white !important;
    color: black !important;
    box-shadow: none !important;
  }
}
</style>

<script setup>
import { ref, onMounted, watch, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import * as docxParser from 'docx-preview';
import { URL } from '@/auth/url';

const API_URL = URL;

// Reactive variables
const route = useRoute();
const id = ref(route.params.id);
const docxContainer = ref(null);
const settingsRef = ref(null);
const isLoading = ref(true);
const error = ref(null);
const isDark = ref(false);
const fileBlob = ref(null);
const zoomLevel = ref(1);
const showSettings = ref(false);
const compactMode = ref(false);
const autoSave = ref(true);

// Initialize component
onMounted(() => {
  initializeTheme();
  loadSettings();
  fetchWordFile();
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

// Theme management
const initializeTheme = () => {
  const savedTheme = localStorage.getItem('docuview-theme');
  if (savedTheme) {
    isDark.value = savedTheme === 'dark';
  } else {
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  updateThemeClass();
};

const updateThemeClass = () => {
  if (isDark.value) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

const toggleTheme = () => {
  isDark.value = !isDark.value;
  localStorage.setItem('docuview-theme', isDark.value ? 'dark' : 'light');
};

// Settings management
const loadSettings = () => {
  const settings = JSON.parse(localStorage.getItem('docuview-settings') || '{}');
  compactMode.value = settings.compactMode || false;
  autoSave.value = settings.autoSave !== undefined ? settings.autoSave : true;
  zoomLevel.value = settings.zoomLevel || 1;
};

const saveSettings = () => {
  const settings = {
    compactMode: compactMode.value,
    autoSave: autoSave.value,
    zoomLevel: zoomLevel.value
  };
  localStorage.setItem('docuview-settings', JSON.stringify(settings));
};

const toggleSettings = () => {
  showSettings.value = !showSettings.value;
};

const toggleCompactMode = () => {
  compactMode.value = !compactMode.value;
  saveSettings();
};

const toggleAutoSave = () => {
  autoSave.value = !autoSave.value;
  saveSettings();
};

const handleClickOutside = (event) => {
  if (settingsRef.value && !settingsRef.value.contains(event.target)) {
    showSettings.value = false;
  }
};

// Zoom controls
const zoomIn = () => {
  if (zoomLevel.value) {
    zoomLevel.value = Math.min(zoomLevel.value + 0.1, 2);
    saveSettings();
  }
};

const zoomOut = () => {
  if (zoomLevel.value > 0.5) {
    zoomLevel.value = Math.max(zoomLevel.value - 0.1, 0.5);
    saveSettings();
  }
};

// Utility functions
const formatDate = (date) => {
  return new Intl.DateTimeFormat('uz-UZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// Watch for theme changes
watch(isDark, () => {
  updateThemeClass();
});

// File operations
const fetchWordFile = async () => {
  isLoading.value = true;
  error.value = null;
  
  try {
    // Fetch file metadata
    const response = await fetch(`${API_URL}/files/${id.value}`);
    if (!response.ok) {
      throw new Error('Fayl ma\'lumotlarini olishda xatolik yuz berdi');
    }
    const resData = await response.json();

    // Fetch actual file
    const fileResponse = await fetch(`${API_URL}/uploads${resData.filePath}`);
    if (!fileResponse.ok) {
      throw new Error('Word faylini yuklab bo\'lmadi');
    }
    
    const blob = await fileResponse.blob();
    fileBlob.value = blob;

    // Render document with enhanced options
    await docxParser.renderAsync(blob, docxContainer.value, null, {
      className: 'docx',
      inWrapper: false,
      ignoreWidth: false,
      ignoreHeight: false,
      ignoreFonts: false,
      breakPages: true,
      ignoreLastRenderedPageBreak: false,
      experimental: false,
      trimXmlDeclaration: true,
      useBase64URL: false,
      useMathMLPolyfill: true,
      showChanges: false,
      debug: false,
      renderHeaders: true,
      renderFooters: true,
      renderFootnotes: true,
      renderEndnotes: true
    });

    // Apply custom styling
    setTimeout(() => {
      applyAdvancedStyling();
    }, 100);

  } catch (err) {
    console.error('Document loading error:', err);
    error.value = err.message || 'Hujjatni yuklashda kutilmagan xatolik yuz berdi';
  } finally {
    isLoading.value = false;
  }
};

const applyAdvancedStyling = () => {
  if (!docxContainer.value) return;
  
  const docElement = docxContainer.value.querySelector('.docx');
  if (!docElement) return;

  // Remove conflicting inline styles
  const allElements = docElement.querySelectorAll('*');
  allElements.forEach(el => {
    // Preserve important Word formatting while removing conflicting styles
    const computedStyle = window.getComputedStyle(el);
    const hasImportantFormatting = 
      computedStyle.fontWeight === 'bold' || 
      computedStyle.fontStyle === 'italic' || 
      computedStyle.textDecoration.includes('underline');

    if (!hasImportantFormatting) {
      el.style.removeProperty('background-color');
      el.style.removeProperty('color');
    }
    
    el.style.removeProperty('box-shadow');
    el.style.removeProperty('text-shadow');
  });

  // Enhance readability
  const paragraphs = docElement.querySelectorAll('p');
  paragraphs.forEach(p => {
    if (p.textContent.trim().length > 0) {
      p.style.marginBottom = '1rem';
      p.style.textAlign = 'justify';
    }
  });

  // Style headers
  const headers = docElement.querySelectorAll('h1, h2, h3, h4, h5, h6');
  headers.forEach(header => {
    header.style.fontWeight = '700';
    header.style.marginTop = '2rem';
    header.style.marginBottom = '1rem';
    header.style.lineHeight = '1.3';
  });

  // Style tables
  const tables = docElement.querySelectorAll('table');
  tables.forEach(table => {
    table.style.borderCollapse = 'collapse';
    table.style.width = '100%';
    table.style.margin = '1.5rem 0';
    table.style.borderRadius = '8px';
    table.style.overflow = 'hidden';
  });

  // Style lists
  const lists = docElement.querySelectorAll('ul, ol');
  lists.forEach(list => {
    list.style.paddingLeft = '1.5rem';
    list.style.marginBottom = '1rem';
  });

  const listItems = docElement.querySelectorAll('li');
  listItems.forEach(li => {
    li.style.marginBottom = '0.5rem';
  });
};

const downloadFile = async () => {
  if (!fileBlob.value) {
    error.value = 'Yuklab olish uchun fayl mavjud emas';
    return;
  }
  
  try {
    const url = window.URL.createObjectURL(fileBlob.value);
    const link = document.createElement('a');
    link.href = url;
    link.download = `document-${id.value}-${Date.now()}.docx`;
    
    // Add download animation
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Cleanup
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 100);

    // Show success notification (you can implement a toast system)
    console.log('Fayl muvaffaqiyatli yuklandi');
    
  } catch (err) {
    console.error('Download error:', err);
    error.value = 'Faylni yuklab olishda xatolik yuz berdi';
  }
};

const retry = () => {
  error.value = null;
  fetchWordFile();
};
</script>