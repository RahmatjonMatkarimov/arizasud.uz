<script setup>
import translateText from '@/auth/Translate'
import { onUnmounted, ref } from 'vue';
import { inject, onMounted } from 'vue'
const dat = ref(localStorage.getItem('til') || 'datalotin');

let intervalId = null;
const checkLanguageChange = () => {
  const currentLang = localStorage.getItem('til') || 'datalotin';
  if (currentLang !== dat.value) {
    dat.value = currentLang;
  }
};
onMounted(() => {
  intervalId = setInterval(checkLanguageChange, 0);
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});
defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: 'primary'
  }
})

</script>
<div 
class=""></div>
<template>
  <div 
    class="w-full p-6 rounded-lg border border-white/5 shadow-lg hover:shadow-blue-500/5 hover:border-white/10 transition-all duration-300"
  >
    <h3 class="text-lg font-semibold mb-3">
      {{ dat == 'datakril' ? translateText(title) : title }}
    </h3>
    <p class="text-2xl font-mono font-bold">
      {{ dat == 'datakril' ? translateText(value) : value }}
    </p>
  </div>
</template>
