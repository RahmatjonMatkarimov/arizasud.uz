<template>
  <Transition name="fade">
    <div v-if="showLoading" class="fixed inset-0 flex justify-center items-center bg-black/30 backdrop-blur-lg" style="z-index:9999999999999999;">
    <span class="loader"></span>
    <!-- <video src="../public/loader_no_bg (1).webm" width="150" loop autoplay muted ></video> -->
    </div>
  </Transition>
  <ticketModal v-if="hidden" />
  <ErrorComponent v-if="errorCode" :errorCode="errorCode" />
  <RouterView v-else />
</template>

<script setup>
import { ref, provide, onMounted, onUnmounted, watch } from 'vue';
import axios from 'axios';
import ErrorComponent from '@/components/error.vue';
import { URL } from './auth/url';
import ticketModal from './components/ticket/ticketModal.vue';

const errorCode = ref(null);
const isLoading = ref(false);
const showLoading = ref(false);
const hidden = ref(false);

provide('isLoading', isLoading);
provide('hidden', hidden);

watch(isLoading, (newValue) => {
  if (newValue) {
    showLoading.value = true;
  } else {
    setTimeout(() => {
      showLoading.value = false;
    }, 1000);
  }
});

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

/* Fade transition effekti */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}

.loader {
  height: 400px;
  aspect-ratio: 2;
  border-bottom: 3px solid #0000;
  background: 
    linear-gradient(90deg,#fff 50%,#0000 0)
    -25% 100%/50% 3px repeat-x border-box;
  position: relative;
  animation: l3-0 .75s linear infinite;
}
.loader:before {
  content: "";
  position: absolute;
  inset: auto 42.5% 0;
  aspect-ratio: 1;
  border-radius: 50%;
  background: #fff;
  animation: l3-1 .75s cubic-bezier(0,900,1,900) infinite;
}
@keyframes l3-0 {
  to {background-position: -125% 100%}
}
@keyframes l3-1 {
  0%,2% {bottom: 0%}
  98%,to {bottom:.1%}
}
</style>