<template>
  <!-- Theme Toggle Button -->
  <div class="fixed top-6 right-6 z-20">
    <button @click="toggleTheme" 
      class="p-3 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50">
      <!-- Sun Icon for Light Mode -->
      <svg v-if="!isDark" class="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"/>
      </svg>
      <!-- Moon Icon for Dark Mode -->
      <svg v-else class="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
      </svg>
    </button>
  </div>

  <!-- Main Container -->
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col">
    
    <!-- Header Section -->
    <div class="flex-1 flex flex-col justify-center px-6 py-12 sm:px-8">
      <!-- Logo/Brand Section -->
      <div class="text-center mb-12">
        <div class="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
          <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {{ dat === 'datakril' ? translateText('Xush kelibsiz') : 'Xush kelibsiz' }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400 text-lg">
          {{ dat === 'datakril' ? translateText('Hisobingizga kiring') : 'Hisobingizga kiring' }}
        </p>
      </div>

      <!-- Login Form -->
      <div class="w-full max-w-sm mx-auto">
        <form @submit.prevent="handleLogin" class="space-y-6">
          
          <!-- Username Field -->
          <div class="space-y-2">
            <label for="username" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
              {{ dat === 'datakril' ? translateText('Foydalanuvchi nomi') : 'Foydalanuvchi nomi' }}
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </div>
              <input 
                type="text" 
                id="username" 
                v-model="username" 
                :placeholder="dat === 'datakril' ? translateText('Foydalanuvchi nomini kiriting') : 'Foydalanuvchi nomini kiriting'"
                class="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:text-white dark:placeholder-gray-400 transition-all duration-300 text-lg"
                :class="{'border-red-400 dark:border-red-400 focus:border-red-500 focus:ring-red-500/20': errorMessage && !username}"
              />
            </div>
          </div>

          <!-- Password Field -->
          <div class="space-y-2">
            <label for="password" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
              {{ dat === 'datakril' ? translateText('Parol') : 'Parol' }}
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
              </div>
              <input 
                :type="showPassword ? 'text' : 'password'" 
                id="password" 
                v-model="password"
                :placeholder="dat === 'datakril' ? translateText('Parolni kiriting') : 'Parolni kiriting'"
                class="w-full pl-12 pr-14 py-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:text-white dark:placeholder-gray-400 transition-all duration-300 text-lg"
                :class="{'border-red-400 dark:border-red-400 focus:border-red-500 focus:ring-red-500/20': errorMessage && !password}"
              />
              <button 
                type="button" 
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
              >
                <!-- Eye Open Icon -->
                <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
                <!-- Eye Closed Icon -->
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage" class="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800/50 rounded-2xl p-4">
            <div class="flex items-center">
              <svg class="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <p class="text-red-700 dark:text-red-400 text-sm font-medium">
                {{ dat === 'datakril' ? translateText(errorMessage) : errorMessage }}
              </p>
            </div>
          </div>

          <!-- Submit Button -->
          <button 
            type="submit"
            :disabled="isLoading"
            class="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none shadow-lg hover:shadow-xl text-lg"
          >
            <span v-if="!isLoading" class="flex items-center justify-center">
              {{ dat === 'datakril' ? translateText('Kirish') : 'Kirish' }}
              <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
              </svg>
            </span>
            <span v-else class="flex items-center justify-center">
              <svg class="animate-spin w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ dat === 'datakril' ? translateText('Kutilmoqda') : 'Kutilmoqda' }}
            </span>
          </button>
        </form>
      </div>
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

/* Input focus animation */
input:focus {
  animation: inputFocus 0.3s ease-out;
}

@keyframes inputFocus {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
  100% {
    transform: scale(1);
  }
}

/* Button hover animation */
button:not(:disabled):hover {
  animation: buttonHover 0.3s ease-out;
}

@keyframes buttonHover {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-2px);
  }
  100% {
    transform: translateY(0);
  }
}
</style>