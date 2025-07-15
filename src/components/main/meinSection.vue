<template>
  <div class="relative min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">

    <!-- Main content -->
    <div class="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 text-center">
      <div class="mx-auto">
        <!-- Main heading -->
        <h1 class="text-5xl sm:text-6xl md:text-7xl font-bold mb-8 text-gray-900 dark:text-white">
          {{ translateText(`O‘zbekiston sudlariga ariza topshirishni yengillashtiruvchi tizim – `) }}ArizaSud.uz
        </h1>
        
        <!-- Subtitle -->
        <p class="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
          {{ translateText(`Sud arizalarini tez va oson yuboring, hujjatlaringizni onlayn boshqaring va professional yuridik yordam oling. Biz bilan huquqiy masalalaringizni hal qilish yanada oson!`) }}
        </p>

        <!-- Call to action -->
        <div class="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
          <button @click="getStarted" 
            class="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            Boshlash
          </button>
          
          <button @click="learnMore" 
            class="px-8 py-4 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold text-lg rounded-lg transition-all duration-300">
            Batafsil
          </button>
        </div>

        <!-- Key features -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div class="text-center">
            <div class="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">{{ translateText(`Tezkor`) }}</h3>
            <p class="text-gray-600 dark:text-gray-400">{{ translateText(`Eng tez va samarali sud jarayoni`) }}</p>
          </div>

          <div class="text-center">
            <div class="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">{{ translateText(`Xavfsiz`) }} </h3>
            <p class="text-gray-600 dark:text-gray-400">{{ translateText(`Ma'lumotlaringiz to'liq himoyalangan`) }}</p>
          </div>

          <div class="text-center">
            <div class="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">{{ translateText(`Qulay`) }} </h3>
            <p class="text-gray-600 dark:text-gray-400">{{ translateText(`Har qanday qurilmadan foydalaning`) }}</p>
          </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div class="text-center">
            <div class="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">1000+</div>
            <div class="text-gray-600 dark:text-gray-400">{{ translateText(`Muvaffaqiyatli ishlar`) }}</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">99%</div>
            <div class="text-gray-600 dark:text-gray-400">{{ translateText(`Mamnuniyat`) }}</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">24/7</div>
            <div class="text-gray-600 dark:text-gray-400">{{ translateText(`Xizmat ko'rsatish`) }}</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">50+</div>
            <div class="text-gray-600 dark:text-gray-400">{{ translateText(`Bizning hamkorlarimiz`) }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Simple scroll indicator -->
    <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2">
      <div class="w-6 h-10 border-2 border-gray-400 dark:border-gray-300 rounded-full flex justify-center">
        <div class="w-1 h-3 bg-gray-400 dark:bg-gray-300 rounded-full mt-2 animate-bounce"></div>
      </div>
    </div>
  </div>
  <!-- <User></User> -->
  <!-- <Admin></Admin> -->
</template>

<script setup>
import translateText from '@/auth/Translate copy';
import User from "@/components/main/job/admin.vue";
import Admin from '@/components/main/questions/admin.vue'

const getStarted = () => {
  // Navigate to main services
  window.location.href = '/main';
};

const learnMore = () => {
  // Scroll to about section or show modal
  const aboutSection = document.querySelector('.about-section');
  if (aboutSection) {
    aboutSection.scrollIntoView({ behavior: 'smooth' });
  }
};
</script>

<style scoped>
/* Minimal custom styles */
</style>
