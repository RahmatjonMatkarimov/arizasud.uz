<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="visible" class="fixed inset-0 bg-black/70 dark:bg-black/80 flex items-center justify-center z-50">
      <div 
        class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-80 max-w-[90%] overflow-hidden transform transition-all"
        :class="visible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'"
      >
        <div class="p-5">
          <h3 class="text-gray-900 dark:text-gray-100 text-lg font-semibold text-center mb-4">
            {{ dat === 'datakril' ? translateText('Haqiqatan ham chiqmoqchimisiz?'):`Haqiqatan ham chiqmoqchimisiz?` }}
          </h3>
          <div class="flex space-x-2 mt-5">
            <button
              @click="$emit('cancel')"
              class="flex-1 py-2 px-4 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
            >
              {{ dat === 'datakril' ? translateText(`Bekor qilish`):`Bekor qilish` }}
            </button>
            <button
              @click="$emit('confirm')"
              class="flex-1 py-2 px-4 rounded-lg bg-indigo-600 dark:bg-indigo-500 text-white font-medium hover:bg-indigo-700 dark:hover:bg-indigo-400 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
            >
              {{ dat === 'datakril' ? translateText(`Ha, chiqish`) :  `Ha, chiqish`}}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import translateText from '@/auth/Translate';
import { onMounted, onUnmounted, ref } from 'vue';

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
  visible: Boolean
})
defineEmits(['confirm', 'cancel'])
</script>