<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 transition-all duration-500">
    <!-- Animated Background Pattern -->
    <div class="fixed inset-0 opacity-30 dark:opacity-20">
      <div class="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-600/20 animate-pulse"></div>
      <div class="absolute top-0 left-0 w-72 h-72 bg-blue-500/10 dark:bg-blue-400/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div class="absolute top-0 right-0 w-72 h-72 bg-purple-500/10 dark:bg-purple-400/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div class="absolute bottom-0 left-0 w-72 h-72 bg-pink-500/10 dark:bg-pink-400/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
    </div>

    <!-- Premium Header -->
    <header class="relative z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/50 dark:border-slate-700/50 shadow-lg shadow-slate-900/5 dark:shadow-slate-900/20">
      <div class="max-w-7xl mx-auto px-6 lg:px-8">
        <div class="flex items-center justify-between h-20">
          <!-- Brand Section -->
          <div class="flex items-center space-x-4">
            <div class="relative">
              <div class="w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 dark:from-blue-500 dark:via-purple-500 dark:to-indigo-600 rounded-xl shadow-lg flex items-center justify-center transform hover:scale-105 transition-transform duration-200">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <div class="absolute -top-1 -right-1 w-4 h-4 bg-green-500 dark:bg-green-400 rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></div>
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
            <!-- Theme Toggle -->
            <button 
              @click="toggleTheme"
              class="p-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors duration-200 text-slate-600 dark:text-slate-300"
              title="Rejimni o'zgartirish"
            >
              <svg v-if="isDark" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
              </svg>
            </button>

            <!-- Settings Button -->
            <div class="relative" ref="settingsRef">
              <button 
                @click="toggleSettings"
                class="p-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors duration-200 text-slate-600 dark:text-slate-300"
                title="Sozlamalar"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </button>
              
              <!-- Settings Dropdown -->
              <div v-if="showSettings" class="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-xl shadow-slate-900/10 dark:shadow-slate-900/30 border border-slate-200 dark:border-slate-700 p-4 z-50">
                <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">Sozlamalar</h3>
                
                <!-- Compact Mode Toggle -->
                <div class="flex items-center justify-between mb-4">
                  <span class="text-sm text-slate-700 dark:text-slate-300">Ixcham rejim</span>
                  <button 
                    @click="toggleCompactMode"
                    class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200"
                    :class="compactMode ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'"
                  >
                    <span class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200"
                          :class="compactMode ? 'translate-x-6' : 'translate-x-1'"></span>
                  </button>
                </div>
                
                <!-- Auto Save Toggle -->
                <div class="flex items-center justify-between">
                  <span class="text-sm text-slate-700 dark:text-slate-300">Avtomatik saqlash</span>
                  <button 
                    @click="toggleAutoSave"
                    class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200"
                    :class="autoSave ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'"
                  >
                    <span class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200"
                          :class="autoSave ? 'translate-x-6' : 'translate-x-1'"></span>
                  </button>
                </div>
              </div>
            </div>

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

            <!-- Download Button -->
            <button 
              @click="downloadFile"
              class="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-600/30 dark:shadow-blue-500/20 dark:hover:shadow-blue-500/40 transition-all duration-300 flex items-center space-x-2 group"
            >
              <svg class="w-5 h-5 transform group-hover:translate-y-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <span>Yuklab olish</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Loading State -->
    <div v-if="isLoading" class="relative z-10 flex flex-col items-center justify-center min-h-[70vh]">
      <div class="relative">
        <div class="w-20 h-20 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-spin border-t-blue-600 dark:border-t-blue-400"></div>
        <div class="absolute inset-0 w-20 h-20 border-4 border-transparent rounded-full animate-ping border-t-blue-400 dark:border-t-blue-300"></div>
      </div>
      <div class="mt-8 text-center">
        <h3 class="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">Hujjat yuklanmoqda</h3>
        <p class="text-slate-600 dark:text-slate-400">Iltimos, kutib turing...</p>
        <div class="mt-4 flex items-center justify-center space-x-1">
          <div class="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-bounce"></div>
          <div class="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
          <div class="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
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
          class="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-white rounded-xl font-semibold shadow-lg transition-all duration-300 inline-flex items-center space-x-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          <span>Qayta urinish</span>
        </button>
      </div>
    </div>

    <!-- Document Container -->
    <main class="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 py-8">
      <!-- Premium Document Card -->
      <div class="flex flex-col items-center overflow-hidden" :class="{ 'scale-95': compactMode }">
        <!-- Document Content -->
        <div class="p-8 lg:p-12 min-h-[600px]" :style="{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }">
          <div 
            ref="docxContainer" 
            class="custom-docx-container mx-auto"
            :class="{ 
              'dark-mode': isDark,
              'compact': compactMode,
              'hidden': isLoading || error
            }"
          ></div>
        </div>
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
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(226, 232, 240, 0.5);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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
  color: #334155 !important;
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

.custom-docx-container :deep(.docx h1) { font-size: 2rem; color: #0f172a !important; }
.custom-docx-container :deep(.docx h2) { font-size: 1.5rem; color: #1e293b !important; }
.custom-docx-container :deep(.docx h3) { font-size: 1.25rem; color: #334155 !important; }

.custom-docx-container :deep(.docx table) {
  border-collapse: collapse;
  width: 100%;
  margin: 1.5rem 0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  background-color: #ffffff !important;
}

.custom-docx-container :deep(.docx td),
.custom-docx-container :deep(.docx th) {
  border: 1px solid #e2e8f0 !important;
  padding: 0.75rem;
  text-align: left;
  background-color: transparent !important;
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
  color: #475569 !important;
}

.custom-docx-container :deep(.docx strong),
.custom-docx-container :deep(.docx b) {
  color: #1e293b !important;
  font-weight: 700;
}

.custom-docx-container :deep(.docx em),
.custom-docx-container :deep(.docx i) {
  color: #475569 !important;
}

/* Dark Mode Document Styles */
.custom-docx-container.dark-mode :deep(.docx) {
  background-color: #1e293b !important;
  color: #f1f5f9 !important;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(71, 85, 105, 0.5);
}

.custom-docx-container.dark-mode :deep(.docx *) {
  background-color: transparent !important;
  color: inherit !important;
}

.custom-docx-container.dark-mode :deep(.docx p) {
  color: #cbd5e1 !important;
}

.custom-docx-container.dark-mode :deep(.docx h1),
.custom-docx-container.dark-mode :deep(.docx h2),
.custom-docx-container.dark-mode :deep(.docx h3),
.custom-docx-container.dark-mode :deep(.docx h4),
.custom-docx-container.dark-mode :deep(.docx h5),
.custom-docx-container.dark-mode :deep(.docx h6) {
  color: #ffffff !important;
}

.custom-docx-container.dark-mode :deep(.docx h1) { color: #ffffff !important; }
.custom-docx-container.dark-mode :deep(.docx h2) { color: #f1f5f9 !important; }
.custom-docx-container.dark-mode :deep(.docx h3) { color: #e2e8f0 !important; }

.custom-docx-container.dark-mode :deep(.docx table) {
  background-color: #334155 !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.custom-docx-container.dark-mode :deep(.docx td),
.custom-docx-container.dark-mode :deep(.docx th) {
  border-color: #475569 !important;
  background-color: transparent !important;
}

.custom-docx-container.dark-mode :deep(.docx th) {
  background-color: #475569 !important;
  color: #f1f5f9 !important;
}

.custom-docx-container.dark-mode :deep(.docx li) {
  color: #cbd5e1 !important;
}

.custom-docx-container.dark-mode :deep(.docx strong),
.custom-docx-container.dark-mode :deep(.docx b) {
  color: #ffffff !important;
  font-weight: 700;
}

.custom-docx-container.dark-mode :deep(.docx em),
.custom-docx-container.dark-mode :deep(.docx i) {
  color: #94a3b8 !important;
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

.custom-docx-container.compact :deep(.docx p) {
  margin-bottom: 0.75rem;
}

.custom-docx-container.compact :deep(.docx h1),
.custom-docx-container.compact :deep(.docx h2),
.custom-docx-container.compact :deep(.docx h3),
.custom-docx-container.compact :deep(.docx h4),
.custom-docx-container.compact :deep(.docx h5),
.custom-docx-container.compact :deep(.docx h6) {
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

/* Smooth transitions for all elements */
.custom-docx-container,
.custom-docx-container :deep(*) {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Enhanced Focus States */
button:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.dark button:focus-visible {
  outline: 2px solid #60a5fa;
}

/* Enhanced Hover Effects */
.custom-docx-container :deep(.docx table):hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.custom-docx-container.dark-mode :deep(.docx table):hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3);
}

/* Scrollbar Styling */
.custom-docx-container :deep(*::-webkit-scrollbar) {
  width: 6px;
  height: 6px;
}

.custom-docx-container :deep(*::-webkit-scrollbar-track) {
  background: #f1f5f9;
  border-radius: 3px;
}

.custom-docx-container :deep(*::-webkit-scrollbar-thumb) {
  background: #cbd5e1;
  border-radius: 3px;
}

.custom-docx-container :deep(*::-webkit-scrollbar-thumb:hover) {
  background: #94a3b8;
}

.custom-docx-container.dark-mode :deep(*::-webkit-scrollbar-track) {
  background: #334155;
}

.custom-docx-container.dark-mode :deep(*::-webkit-scrollbar-thumb) {
  background: #64748b;
}

.custom-docx-container.dark-mode :deep(*::-webkit-scrollbar-thumb:hover) {
  background: #94a3b8;
}

/* Print Styles */
@media print {
  .custom-docx-container :deep(.docx) {
    background-color: white !important;
    color: black !important;
    box-shadow: none !important;
    border: none !important;
  }
  
  .custom-docx-container :deep(.docx *) {
    background-color: transparent !important;
    color: black !important;
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .custom-docx-container :deep(.docx) {
    padding: 1rem;
    font-size: 14px;
  }
  
  .custom-docx-container :deep(.docx h1) { font-size: 1.5rem; }
  .custom-docx-container :deep(.docx h2) { font-size: 1.25rem; }
  .custom-docx-container :deep(.docx h3) { font-size: 1.125rem; }
}
</style>

<script setup>
import { ref, onMounted, watch, onUnmounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import * as docxParser from 'docx-preview';
import * as mammoth from 'mammoth';
import JSZip from 'jszip';
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
onMounted(async () => {
  initializeTheme();
  loadSettings();
  await nextTick();
  if (!docxContainer.value) {
    console.error('docxContainer not initialized on mount');
    error.value = 'Hujjat konteyneri ishga tushmadi';
    return;
  }
  fetchWordFile();
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  if (docxContainer.value) {
    docxContainer.value.innerHTML = '';
  }
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
  updateThemeClass();
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
watch(isDark, async () => {
  updateThemeClass();
  await nextTick();
  applyAdvancedStyling();
});

// Watch for route changes
watch(() => route.params.id, (newId) => {
  id.value = newId;
  error.value = null;
  fetchWordFile();
});

// File operations
const fetchWordFile = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    if (!docxContainer.value) {
      console.error('docxContainer is null in fetchWordFile');
      throw new Error('Hujjat konteyneri ishga tushmadi');
    }

    // Clean up previous content
    docxContainer.value.innerHTML = '';

    // Fetch file metadata
    const response = await fetch(`${API_URL}/files/${id.value}`);
    if (!response.ok) {
      throw new Error('Fayl ma\'lumotlarini olishda xatolik yuz berdi');
    }
    const resData = await response.json();
    console.log('Metadata:', resData);

    // Fetch actual file
    const fileResponse = await fetch(`${API_URL}/uploads${resData.filePath}`);
    if (!fileResponse.ok) {
      throw new Error('Word faylini yuklab bo\'lmadi');
    }

    // Validate MIME type
    const contentType = fileResponse.headers.get('content-type');
    if (!contentType || !contentType.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      throw new Error('Noto‘g‘ri fayl formati: Faqat DOCX fayllari qo‘llab-quvvatlanadi');
    }

    const blob = await fileResponse.blob();
    fileBlob.value = blob;

    // Validate blob size
    if (blob.size === 0) {
      throw new Error('Bo‘sh fayl qabul qilindi');
    }

    // Validate DOCX structure
    const isValidDocx = await validateDocxStructure(blob);
    if (!isValidDocx) {
      throw new Error('Hujjat tuzilmasi noto‘g‘ri: DOCX fayli buzilgan bo‘lishi mumkin');
    }

    // Try rendering with docx-preview
    try {
      const renderPromise = docxParser.renderAsync(blob, docxContainer.value, null, {
        className: 'docx',
        inWrapper: false,
        ignoreWidth: false,
        ignoreHeight: false,
        ignoreFonts: false,
        breakPages: true,
        ignoreLastRenderedPageBreak: false,
        experimental: true,
        trimXmlDeclaration: true,
        useBase64URL: false,
        useMathMLPolyfill: true,
        showChanges: false,
        debug: true,
        renderHeaders: true,
        renderFooters: true,
        renderFootnotes: true,
        renderEndnotes: true
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Hujjatni ko‘rsatish vaqti o‘tib ketdi')), 30000)
      );

      await Promise.race([renderPromise, timeoutPromise]);
    } catch (renderErr) {
      console.warn('docx-preview failed, falling back to mammoth.js:', renderErr);
      const result = await mammoth.convertToHtml({ arrayBuffer: await blob.arrayBuffer() });
      docxContainer.value.innerHTML = result.value;
    }

    await nextTick();
    applyAdvancedStyling();

  } catch (err) {
    console.error('Document loading error:', err);
    if (err.message.includes('Failed to render document') || err.message.includes('Cannot read properties of undefined')) {
      error.value = 'Hujjatni ko‘rsatishda xatolik: Fayl formati noto‘g‘ri yoki buzilgan bo‘lishi mumkin';
    } else if (err.message.includes('Noto‘g‘ri fayl formati')) {
      error.value = 'Noto‘g‘ri fayl formati: Faqat DOCX fayllari qo‘llab-quvvatlanadi';
    } else if (err.message.includes('Hujjatni ko‘rsatish vaqti o‘tib ketdi')) {
      error.value = 'Hujjatni yuklash vaqti o‘tib ketdi';
    } else if (err.message.includes('Hujjat tuzilmasi noto‘g‘ri')) {
      error.value = 'Hujjat tuzilmasi noto‘g‘ri: Fayl DOCX formati talablariga mos emas';
    } else {
      error.value = err.message || 'Hujjatni yuklashda kutilmagan xatolik yuz berdi';
    }
  } finally {
    isLoading.value = false;
  }
};

const validateDocxStructure = async (blob) => {
  try {
    const zip = await JSZip.loadAsync(blob);
    const documentXml = zip.file('word/document.xml');
    if (!documentXml) {
      console.error('Invalid DOCX: Missing word/document.xml');
      return false;
    }
    const xmlContent = await documentXml.async('string');
    return xmlContent.includes('<w:body>');
  } catch (err) {
    console.error('DOCX validation error:', err);
    return false;
  }
};

const applyAdvancedStyling = async () => {
  if (!docxContainer.value) {
    console.error('docxContainer is null in applyAdvancedStyling');
    error.value = 'Hujjat konteyneri ishga tushmadi';
    return;
  }

  const waitForDocxElement = async (maxAttempts = 20, delay = 200) => {
    for (let i = 0; i < maxAttempts; i++) {
      const docElement = docxContainer.value.querySelector('.docx') || docxContainer.value.querySelector('div');
      if (docElement) return docElement;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    console.error('docx element not found after maximum attempts');
    return null;
  };

  const docElement = await waitForDocxElement();
  if (!docElement) {
    console.error('Skipping styling: .docx element not found');
    return;
  }

  const allElements = docElement.querySelectorAll('*');
  allElements.forEach(el => {
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

  if (isDark.value) {
    applyDarkModeColors(docElement);
  } else {
    applyLightModeColors(docElement);
  }

  const paragraphs = docElement.querySelectorAll('p');
  paragraphs.forEach(p => {
    if (p.textContent.trim().length > 0) {
      p.style.marginBottom = '1rem';
      p.style.textAlign = 'justify';
    }
  });

  const headers = docElement.querySelectorAll('h1, h2, h3, h4, h5, h6');
  headers.forEach(header => {
    header.style.fontWeight = '700';
    header.style.marginTop = '2rem';
    header.style.marginBottom = '1rem';
    header.style.lineHeight = '1.3';
  });

  const tables = docElement.querySelectorAll('table');
  tables.forEach(table => {
    table.style.borderCollapse = 'collapse';
    table.style.width = '100%';
    table.style.margin = '1.5rem 0';
    table.style.borderRadius = '8px';
    table.style.overflow = 'hidden';
  });

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

const applyDarkModeColors = (docElement) => {
  const paragraphs = docElement.querySelectorAll('p');
  paragraphs.forEach(p => {
    if (!p.querySelector('strong, b, em, i')) {
      p.style.setProperty('color', '#cbd5e1', 'important');
    }
  });

  const headers = docElement.querySelectorAll('h1, h2, h3, h4, h5, h6');
  headers.forEach((header, index) => {
    const colors = ['#ffffff', '#f1f5f9', '#e2e8f0', '#cbd5e1', '#94a3b8', '#64748b'];
    header.style.setProperty('color', colors[index] || '#cbd5e1', 'important');
  });

  const listItems = docElement.querySelectorAll('li');
  listItems.forEach(li => {
    li.style.setProperty('color', '#cbd5e1', 'important');
  });

  const tableHeaders = docElement.querySelectorAll('th');
  tableHeaders.forEach(th => {
    th.style.setProperty('background-color', '#475569', 'important');
    th.style.setProperty('color', '#f1f5f9', 'important');
  });

  const tableCells = docElement.querySelectorAll('td');
  tableCells.forEach(td => {
    td.style.setProperty('border-color', '#475569', 'important');
  });
};

const applyLightModeColors = (docElement) => {
  const paragraphs = docElement.querySelectorAll('p');
  paragraphs.forEach(p => {
    if (!p.querySelector('strong, b, em, i')) {
      p.style.setProperty('color', '#334155', 'important');
    }
  });

  const headers = docElement.querySelectorAll('h1, h2, h3, h4, h5, h6');
  headers.forEach((header, index) => {
    const colors = ['#0f172a', '#1e293b', '#334155', '#475569', '#64748b', '#94a3b8'];
    header.style.setProperty('color', colors[index] || '#334155', 'important');
  });

  const listItems = docElement.querySelectorAll('li');
  listItems.forEach(li => {
    li.style.setProperty('color', '#475569', 'important');
  });

  const tableHeaders = docElement.querySelectorAll('th');
  tableHeaders.forEach(th => {
    th.style.setProperty('background-color', '#f8fafc', 'important');
    th.style.setProperty('color', '#334155', 'important');
  });

  const tableCells = docElement.querySelectorAll('td');
  tableCells.forEach(td => {
    td.style.setProperty('border-color', '#e2e8f0', 'important');
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

    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 100);

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