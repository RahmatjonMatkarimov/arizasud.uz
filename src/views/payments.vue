<template>
  <div
    class="flex flex-col lg:flex-row lg:gap-[100px] gap-10 items-center justify-center w-full min-h-[100vh] text-white bg-gradient-to-r from-stone-500 to-slate-800 bg-cover p-6 animate-gradient"
  >


    <!-- Links -->
    <div class="flex flex-col w-full sm:w-[600px] md:w-[800px] gap-2 mt-4 lg:mt-6">
      <Motion
        v-for="(link, index) in socialLinks"
        :key="link.href"
        tag="a"
        :href="link.href"
        :initial="{ opacity: 0, x: 50 }"
        :animate="{ opacity: 1, x: 0 }"
        :transition="{ duration: 0.8, ease: 'ease-out', delay: 0.1 * index }"
        class="flex items-center lg:justify-start gap-4 no-underline text-[20px] duration-300
        w-full lg:text-[25px] text-white border-2 border-gray-500 p-3 rounded-lg hover:bg-gray-600 hover:opacity-55"
      >
        <img :src="link.icon" alt="icon" class="w-6 rounded-lg h-6 lg:w-8 lg:h-8" />
        <h2 class="bg-gradient-to-r from-gray-100 via-blue-500 to-green-800 text-transparent bg-clip-text animate-gradient">
          {{ link.label }}
        </h2>
      </Motion>
    </div>

  </div>
</template>

<script setup>
import { Motion } from '@motionone/vue'
import { ref } from 'vue'
const socialLinks = ref([
  {
    href: 'https://www.apelsin.uz/open-service?serviceId=498617823',
    icon: '/uzum.png',
    label: 'Uzum bank orqali to\'lov qiling',
  },
  {
    href: 'https://alifmobi.page.link/payByQrNasiya?code=0002010102113120000430734208NA223496621603044313070433766304d4ab',
    icon: '/alif.png',
    label: 'Alif mobi orqali to\'lov qiling',
  },
  {
    href: 'https://payme.uz/fallback/merchant/?id=6684025cb3b5f1f6665d398e',
    icon: '/payme.png',
    label: 'Payme orqali to\'lov qiling',
  },
])
</script>

<style scoped>
/* Ensuring that the animate-gradient class applies animation to gradient background */
@keyframes gradient {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradient 10s ease infinite;
}
</style>
