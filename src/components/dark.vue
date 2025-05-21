<template>
      <button @click="toggleTheme" class="relative flex items-center justify-center w-16 h-8 rounded-full bg-gray-300 dark:bg-gray-600 border-none cursor-pointer" :aria-label="isDarkMode ? 'Yorug\' rejimga o\'tish' : 'Qorong\'i rejimga o\'tish'">
        <div class="absolute left-1 flex items-center justify-center">
          <svg v-if="isDarkMode" class="w-6 h-6 text-amber-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
        </div>
        <div class="absolute right-1 flex items-center justify-center">
          <svg v-if="!isDarkMode" class="w-6 h-6 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </div>
        <div class="absolute w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300" :class="isDarkMode ? 'translate-x-4' : '-translate-x-4'"></div>
      </button>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// isDarkMode holati
const isDarkMode = ref(false);

// Sahifa yuklanganida ishga tushadi
onMounted(() => {
  // Tizim afzalliklarini tekshirish
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Saqlangan sozlamalar yoki tizim afzalliklarini qo'llash
  const savedTheme = localStorage.getItem('theme');
  
  if (savedTheme === 'dark' || (savedTheme === null && prefersDark)) {
    isDarkMode.value = true;
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
});

// Temani o'zgartirish funksiyasi
function toggleTheme() {
  isDarkMode.value = !isDarkMode.value;
  
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
}
</script>