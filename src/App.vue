<template>
  <div v-if="isLoading" class="fixed inset-0 flex justify-center items-center bg-black bg-opacity-80 z-50">
    <span class="loader"></span>
  </div>
  <ticketModal v-if="hidden" />
  <ErrorComponent v-if="errorCode" :errorCode="errorCode" />
  <RouterView v-else />
</template>

<script setup>
import { ref, provide, onMounted, onUnmounted } from 'vue';
import axios from 'axios';
import ErrorComponent from '@/components/error.vue';
import { URL } from './auth/url';
import { useRouter } from 'vue-router';
import ticketModal from './components/ticket/ticketModal.vue';
import NotificationButton from './components/NotificationButton.vue'
const errorCode = ref(null);
const isLoading = ref(false);
const hidden = ref(false);
const router = useRouter();

// Global provide qilish
provide('isLoading', isLoading);
provide('hidden', hidden);

const fetchData = async (url) => {
  isLoading.value = true;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    errorCode.value = error.response?.status || 500;
    throw error;
  } finally {
    isLoading.value = false;
  }
};

// Ctrl+Enter hodisasini ushlash
const handleKeyDown = (event) => {
  if (event.ctrlKey && event.key === 'Enter') {
    hidden.value = true; // hidden ni true qilish
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
  fetchData(URL);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});

defineExpose({ fetchData });
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  /* color: white; */
  font-family: Cambria;
}
.loader {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: block;
  margin: 15px auto;
  position: relative;
  color: #FFF;
  box-sizing: border-box;
  animation: animloader 2s linear infinite;
}

@keyframes animloader {
  0% {
    box-shadow: 14px 0 0 -2px, 38px 0 0 -2px, -14px 0 0 -2px, -38px 0 0 -2px;
  }

  25% {
    box-shadow: 14px 0 0 -2px, 38px 0 0 -2px, -14px 0 0 -2px, -38px 0 0 2px;
  }

  50% {
    box-shadow: 14px 0 0 -2px, 38px 0 0 -2px, -14px 0 0 2px, -38px 0 0 -2px;
  }

  75% {
    box-shadow: 14px 0 0 2px, 38px 0 0 -2px, -14px 0 0 -2px, -38px 0 0 -2px;
  }

  100% {
    box-shadow: 14px 0 0 -2px, 38px 0 0 2px, -14px 0 0 -2px, -38px 0 0 -2px;
  }
}
</style>