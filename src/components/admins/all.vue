<script setup lang="ts">
import { f } from 'html2pdf.js';
import { ref } from 'vue'
import { useRouter } from 'vue-router';

const router = useRouter()
const cards = ref([
  {
    title: 'Barcha Ishchilar Ro\'yxati',
    icon: 'users',
    bgColor: 'bg-gradient-to-br from-[#667eea] to-[#764ba2]',
    iconColor: 'text-white',
    routerLink: '/all'
  },
  {
    title: 'Ishchilarni Hujjatini Yaratuvchi Devonxona Mudiri',
    icon: 'building',
    bgColor: 'bg-gradient-to-br from-[#667eea] to-[#764ba2]',
    iconColor: 'text-white',
    routerLink: '/operators'
  },
  {
    title: 'Yurist-Ekspert Yaratish Bo\'limi',
    icon: 'user-tie',
    bgColor: 'bg-gradient-to-br from-[#667eea] to-[#764ba2]',
    iconColor: 'text-white',
    routerLink: '/yurists'
  },
  {
    title: 'Ishchi Hodimlarni Yaratish (Admin Yaratish)',
    icon: 'user-plus',
    bgColor: 'bg-gradient-to-br from-[#667eea] to-[#764ba2]',
    iconColor: 'text-white',
    routerLink: '/admins'
  }
])
</script>

<template>
  <div class="min-h-screen px-4 py-8 bg-gray-100">
    <h1 class="text-center text-gray-800 text-4xl font-bold mb-12 drop-shadow-md">
      Ishchi hodimlar bo'limi
    </h1>
    <div class="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 p-4">
      <div
        v-for="(card, index) in cards"
        :key="index"
        class="relative group rounded-2xl overflow-hidden bg-gradient-to-br from-[#667eea] to-[#764ba2] p-8 min-h-[200px] cursor-pointer duration-300 shadow-lg hover:-translate-y-2 hover:shadow-2xl"
        @click="router.push(card.routerLink)"
        :initial="{ opacity: 0, scale: 0.8 }"
        :enter="{ 
          opacity: 1, 
          scale: 1, 
          transition: { 
            duration: 500,
            delay: index * 100 
          } 
        }"
      >
        <div class="relative z-10 h-full flex flex-col justify-center items-center">
          <font-awesome-icon
            :icon="card.icon" 
            class="text-5xl mb-6 drop-shadow-md text-white   group-hover:text-black"
          />
          <h3 class="text-white text-lg font-semibold text-center leading-tight drop-shadow-sm">
            {{ card.title }}
          </h3>
        </div>
      </div>
    </div>
  </div>
</template>

