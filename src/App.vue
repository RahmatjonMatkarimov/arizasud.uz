<template>
  <Transition name="fade">
    <div v-if="showLoading" class="fixed inset-0 flex justify-center items-center bg-black/90" style="z-index:9999999999999999;">
    <span class="loader"></span>
    </div>
  </Transition>
  <ticketModal v-if="hidden" />
  <ErrorComponent v-if="errorCode" :errorCode="errorCode" />
  <RouterView v-else />
</template>

<script setup>
import { ref, provide, onMounted, onUnmounted, watch } from 'vue';
import { userInfo, syncLocalStorageWithToken } from '@/utils/auth'
import { computed } from 'vue'
import axios from 'axios';
import ErrorComponent from '@/components/Others/error.vue';
import { URL } from './auth/url';
import ticketModal from './components/ticket/ticketModal.vue';

const errorCode = ref(null);
const isLoading = ref(false);
const showLoading = ref(false);
const hidden = ref(false);

provide('isLoading', isLoading);
provide('hidden', hidden);

syncLocalStorageWithToken()
const currentUser = computed(() => userInfo)

watch(isLoading, (newValue) => {
  if (newValue) {
    showLoading.value = true;
  } else {
    setTimeout(() => {
      showLoading.value = false;
    }, 300);
  }
});

const fetchData = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    errorCode.value = error.response?.status || 500;
    throw error;
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
}

.loader {
  color: #ffffff;
  font-size: 45px;
  text-indent: -9999em;
  overflow: hidden;
  width: 1em;
  height: 1em;
  border-radius: 50%;
  position: relative;
  transform: translateZ(0);
  animation: mltShdSpin 1.7s infinite ease, round 1.7s infinite ease;
}

@keyframes mltShdSpin {
  0% {
    box-shadow: 0 -0.83em 0 -0.4em,
    0 -0.83em 0 -0.42em, 0 -0.83em 0 -0.44em,
    0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
  }
  5%,
  95% {
    box-shadow: 0 -0.83em 0 -0.4em, 
    0 -0.83em 0 -0.42em, 0 -0.83em 0 -0.44em, 
    0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
  }
  10%,
  59% {
    box-shadow: 0 -0.83em 0 -0.4em, 
    -0.087em -0.825em 0 -0.42em, -0.173em -0.812em 0 -0.44em, 
    -0.256em -0.789em 0 -0.46em, -0.297em -0.775em 0 -0.477em;
  }
  20% {
    box-shadow: 0 -0.83em 0 -0.4em, -0.338em -0.758em 0 -0.42em,
     -0.555em -0.617em 0 -0.44em, -0.671em -0.488em 0 -0.46em, 
     -0.749em -0.34em 0 -0.477em;
  }
  38% {
    box-shadow: 0 -0.83em 0 -0.4em, -0.377em -0.74em 0 -0.42em,
     -0.645em -0.522em 0 -0.44em, -0.775em -0.297em 0 -0.46em, 
     -0.82em -0.09em 0 -0.477em;
  }
  100% {
    box-shadow: 0 -0.83em 0 -0.4em, 0 -0.83em 0 -0.42em, 
    0 -0.83em 0 -0.44em, 0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
  }
}

@keyframes round {
  0% { transform: rotate(0deg) }
  100% { transform: rotate(360deg) }
}
 
</style>