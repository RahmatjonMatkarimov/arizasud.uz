<template>
  <!-- Theme Toggle Button -->
  <div class="fixed top-4 right-4 z-10">
    <button @click="toggleTheme" 
      class="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200 dark:border-gray-700">
      <!-- Sun Icon for Light Mode -->
      <svg v-if="!isDark" class="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"/>
      </svg>
      <!-- Moon Icon for Dark Mode -->
      <svg v-else class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
      </svg>
    </button>
  </div>

  <!-- Main Login Container -->
  <div class="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <!-- Login Form -->
    <div class="w-full max-w-sm p-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <!-- Header -->
      <div class="text-center mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          {{ dat === 'datakril' ? translateText(`Kirish`):`Kirish` }}
        </h2>
        <p class="text-gray-600 dark:text-gray-400 text-sm">
          {{ dat === 'datakril' ? translateText(`Hisobingizga kiring`):`Hisobingizga kiring` }}
        </p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="space-y-6">
        <!-- Username Field -->
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ dat === 'datakril' ? translateText('Foydalanuvchi nomi'): `Foydalanuvchi nomi`}}
          </label>
          <input 
            type="text" 
            id="username" 
            v-model="username" 
            :placeholder="dat === 'datakril' ? translateText(`Foydalanuvchi nomini kiriting`):`Foydalanuvchi nomini kiriting`"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 transition-colors duration-200"
            :class="{'border-red-500 dark:border-red-400': errorMessage && !username}"
          />
        </div>

        <!-- Password Field -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ dat === 'datakril' ? translateText(`Parol`):`Parol` }}
          </label>
          <div class="relative">
            <input 
              :type="showPassword ? 'text' : 'password'" 
              id="password" 
              v-model="password"
              :placeholder="dat=== 'datakril' ? translateText(`Parolni kiriting`):`Parolni kiriting`"
              class="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 transition-colors duration-200"
              :class="{'border-red-500 dark:border-red-400': errorMessage && !password}"
            />
            <button 
              type="button" 
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <!-- Eye Open Icon -->
              <svg v-if="!showPassword" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
              <!-- Eye Closed Icon -->
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-md border border-red-200 dark:border-red-800/30">
          {{ dat === 'datakril' ? translateText(errorMessage):errorMessage }}
        </div>

        <!-- Submit Button -->
        <button 
          type="submit"
          :disabled="isLoading"
          class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-200 disabled:cursor-not-allowed"
        >
          <span v-if="!isLoading">
            {{ dat === 'datakril' ? translateText(`Kirish`):`Kirish` }}
          </span>
          <span v-else class="flex items-center justify-center">
            <svg class="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ dat === 'datakril' ? translateText(`Kutilmoqda`):`Kutilmoqda` }}
          </span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { URL } from '@/auth/url';
import { useRouter } from 'vue-router';
import { ref, inject, onMounted, onUnmounted } from 'vue';
import translateText from '@/auth/Translate';

// Language management
const dat = ref(localStorage.getItem("til") || "datalotin");

let intervalId = null;
const checkLanguageChange = () => {
  const currentLang = localStorage.getItem("til") || "datalotin";
  if (currentLang !== dat.value) {
    dat.value = currentLang;
  }
};

onMounted(() => {
  intervalId = setInterval(checkLanguageChange, 0);
  
  // Initialize theme
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  isDark.value = savedTheme === 'dark' || (!savedTheme && prefersDark);
  updateTheme();
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});

// Form management
const router = useRouter();
const username = ref('');
const password = ref('');
const showPassword = ref(false);
const errorMessage = ref('');
const isLoading = inject('isLoading');

// Theme management
const isDark = ref(false);

const toggleTheme = () => {
  isDark.value = !isDark.value;
  updateTheme();
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
};

const updateTheme = () => {
  if (isDark.value) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

// Login handler
const handleLogin = async () => {
  errorMessage.value = ''; // Clear any previous error message
  if (username.value && password.value) {
    isLoading.value = true;
    try {
      const response = await fetch(URL + '/client/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          login: username.value,
          password: password.value,
        }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();

      const id = data.client?.id; // Extract the id from the response
      if (id) {
        router.push('/clientOpenRoom/' + id); // Use the id in the route
      } else {
        throw new Error('ID not found in response');
      }
    } catch (error) {
      console.error('Error during login:', error);
      errorMessage.value = 'Kirish amalga oshmadi';
    } finally {
      isLoading.value = false;
    }
  } else {
    errorMessage.value = 'Barcha maydonlarni to\'ldiring';
  }
};
</script>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 4px;
}

.dark ::-webkit-scrollbar-thumb {
  background: #4a5568;
}

::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #2d3748;
}
</style>