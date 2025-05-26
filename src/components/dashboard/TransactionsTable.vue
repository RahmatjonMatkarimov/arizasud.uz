<script setup>
defineProps({
  transactions: {
    type: Array,
    required: true
  }
})

import translateText from '@/auth/Translate';
import { onUnmounted, ref } from 'vue';
import { inject, onMounted } from 'vue';
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
</script>

<template>
  <div class="mt-1 dark:bg-gradient-to-r bg-white dark:from-[#2a3655] dark:to-[#3d4e81] dark:border-white/10 dark:hover:shadow-blue-500/10 dark:hover:border-white/20 rounded-lg border border-white/5 shadow-lg hover:shadow-blue-500/5 hover:border-white/10 transition-all duration-300 p-4">
    <h3 class="text-xl font-semibold  text-black dark:text-white mb-2">
      {{ dat === 'datakril' ? translateText('Shartnoma tuzgan mijozlar ro\'yxati') : 'Shartnoma tuzgan mijozlar ro\'yxati' }}
    </h3>
    
    <table class="w-full border-collapse  text-black dark:text-white">
      <thead>
        <tr>
          <th class="py-2 px-3 text-left font-semibold">
            #
          </th>
          <th class="py-2 px-3 text-left font-semibold">
          </th>
          <th class="py-2 px-3 text-left font-semibold">
            {{ dat === 'datakril' ? translateText('F.I.SH:') : 'F.I.SH:' }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(transaction, index) in transactions" :key="index + 1" class= "text-black border-t-2 border-black/30 dark:border-white dark:text-white">
          <td class="py-2 px-3">{{ index + 1 }}</td>
          <td class="py-2 px-3"></td>
          <td class="py-2 px-3">
            {{ dat === 'datakril' ? translateText(`${transaction.name} ${transaction.surname} ${transaction.dadname}`) : `${transaction.name} ${transaction.surname} ${transaction.dadname}` }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>