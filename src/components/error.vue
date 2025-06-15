<template>
  <div class="min-h-screen w-full bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 dark:from-black dark:via-slate-900 dark:to-blue-950 flex items-center justify-center p-4 transition-all duration-300">
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-10">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,0.3),transparent_70%)]"></div>
      <div class="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
    </div>

    <!-- Error Modal -->
    <div class="relative z-10 max-w-2xl w-full">
      <!-- Main Error Card -->
      <div class="bg-white/10 dark:bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/20 dark:border-white/10 shadow-2xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-500">
        
        <!-- Header Section -->
        <div class="relative bg-gradient-to-r from-red-500/20 via-pink-500/20 to-red-600/20 dark:from-red-600/30 dark:via-pink-600/30 dark:to-red-700/30 p-8 text-center">
          <!-- Decorative Elements -->
          <div class="absolute top-0 left-0 w-full h-full opacity-30">
            <div class="absolute top-4 right-8 w-16 h-16 border-2 border-white/20 rounded-full animate-spin-slow"></div>
            <div class="absolute bottom-4 left-8 w-12 h-12 border-2 border-white/20 rounded-full animate-pulse"></div>
          </div>
          
          <!-- Error Code -->
          <div class="relative mb-6">
            <div class="text-8xl md:text-9xl font-black bg-gradient-to-br from-red-400 to-pink-600 dark:from-red-300 dark:to-pink-500 bg-clip-text text-transparent animate-pulse drop-shadow-2xl">
              {{ errorCode }}
            </div>
            <div class="absolute -top-4 -right-4 w-6 h-6 bg-red-400 rounded-full animate-ping"></div>
          </div>

          <!-- Error Icon -->
          <div class="flex justify-center mb-6">
            <div class="relative">
              <div class="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center shadow-2xl animate-bounce">
                <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path v-if="errorCode === 404" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  <path v-else-if="errorCode === 500" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                  <path v-else-if="errorCode === 403" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div class="absolute -inset-2 bg-gradient-to-r from-red-400 to-pink-600 rounded-full opacity-20 animate-ping"></div>
            </div>
          </div>
        </div>

        <!-- Content Section -->
        <div class="p-8 text-center space-y-6">
          <!-- Title -->
          <h1 class="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-slate-300 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
            {{ title }}
          </h1>

          <!-- Message -->
          <p class="text-lg text-slate-300 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
            {{ message }}
          </p>

          <!-- Additional Info -->
          <div class="bg-white/5 dark:bg-white/5 rounded-2xl p-6 border border-white/10">
            <div class="flex items-center justify-center space-x-4 text-sm text-slate-400 dark:text-slate-500">
              <div class="flex items-center space-x-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>{{ new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }) }}</span>
              </div>
              <div class="w-1 h-1 bg-slate-400 rounded-full"></div>
              <div class="flex items-center space-x-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>Xatolik kodi: {{ errorCode }}</span>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <!-- Primary Button -->
            <router-link to="/" class="group">
              <button class="w-full sm:w-auto relative overflow-hidden bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg">
                <span class="relative z-10 flex items-center justify-center space-x-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                  </svg>
                  <span>Asosiy sahifaga qaytish</span>
                </span>
                <div class="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </router-link>

            <!-- Secondary Button -->
            <button @click="refreshPage" class="w-full sm:w-auto relative overflow-hidden bg-white/10 hover:bg-white/20 dark:bg-white/5 dark:hover:bg-white/10 text-white border border-white/20 hover:border-white/30 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
              <span class="flex items-center justify-center space-x-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                <span>Sahifani yangilash</span>
              </span>
            </button>
          </div>

          <!-- Help Section -->
          <div class="pt-6 text-center">
            <p class="text-sm text-slate-400 dark:text-slate-500 mb-3">
              Yordam kerakmi?
            </p>
            <div class="flex justify-center space-x-6">
              <h1 class="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors duration-200">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <span class="text-sm">Ctrl + Enter</span>
              </h1>
            </div>
          </div>
        </div>
      </div>

      <!-- Floating Elements -->
      <div class="absolute -top-4 -left-4 w-8 h-8 bg-blue-400/30 rounded-full animate-ping"></div>
      <div class="absolute -bottom-4 -right-4 w-6 h-6 bg-purple-400/30 rounded-full animate-ping delay-1000"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    errorCode: {
      type: Number,
      required: true
    }
  },
  computed: {
    title() {
      const titles = {
        404: "Sahifa topilmadi",
        500: "Server xatosi",
        403: "Ruxsat berilmagan",
        400: "Noto'g'ri so'rov",
        401: "Autentifikatsiya talab qilinadi",
        502: "Gateway xatosi",
        503: "Xizmat mavjud emas"
      };
      return titles[this.errorCode] || "Noma'lum xato";
    },
    message() {
      const messages = {
        404: "Siz qidirgan sahifa mavjud emas yoki o'chirilgan bo'lishi mumkin. Iltimos, manzilni tekshiring yoki asosiy sahifaga qayting.",
        500: "Ma'lum sabablarga ko'ra, tizim vaqtincha faoliyat ko'rsatmayapti. Agar tizim sizga zarur bo'lsa, operatorlarga bog'laning.",
        403: "Bu sahifaga kirish uchun ruxsatingiz yo'q. Administrator bilan bog'laning yoki tizimga qaytadan kiring.",
        400: "So'rovingiz noto'g'ri shakllangan. Iltimos, ma'lumotlarni tekshiring va qaytadan urinib ko'ring.",
        401: "Bu sahifani ko'rish uchun tizimga kirishingiz kerak. Iltimos, hisobingizga kiring.",
        502: "Gateway xatosi yuz berdi. Server bilan bog'lanishda muammo. Keyinroq qaytadan urinib ko'ring.",
        503: "Xizmat vaqtincha mavjud emas. Texnik ishlar olib borilayotgan bo'lishi mumkin."
      };
      return messages[this.errorCode] || "Noma'lum xatolik yuz berdi. Iltimos, keyinroq qaytadan urinib ko'ring.";
    }
  },
  methods: {
    refreshPage() {
      window.location.reload();
    }
  }
};
</script>

<style scoped>
/* Custom animations */
@keyframes animate-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes fade-in-0 {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes zoom-in-95 {
  from {
    transform: scale(0.95);
  }
  to {
    transform: scale(1);
  }
}

@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-in {
  animation: animate-in 0.5s ease-out;
}

.fade-in-0 {
  animation: fade-in-0 0.5s ease-out;
}

.zoom-in-95 {
  animation: zoom-in-95 0.5s ease-out;
}

.animate-spin-slow {
  animation: spin-slow 8s linear infinite;
}

/* Utility classes */
.duration-500 {
  animation-duration: 0.5s;
}

.delay-1000 {
  animation-delay: 1s;
}

/* Line clamp for text truncation */
.line-clamp-3 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}
</style>