<template>
  <div class="min-h-screen bg-slate-200 flex items-center justify-center px-4">
    <!-- Login Form -->
    <div v-if="!showFaceModal" class="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 animate-slide-up border border-slate-300">
      <h2 class="text-3xl font-bold text-slate-800 text-center mb-6 animate-fade-in">
        Tizimga Kirish
      </h2>

      <form @submit.prevent="setData" class="space-y-4 animate-fade-in delay-200">
        <div>
          <input
            v-model="username"
            type="text"
            placeholder="Foydalanuvchi nomi"
            class="input-field"
            :class="{ 'border-red-500': usernameError }"
            minlength="3"
            maxlength="30"
            required
          />
          <p v-if="usernameError" class="text-red-500 text-sm mt-1">
            {{ usernameError }}
          </p>
        </div>

        <div>
          <div class="relative">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Parol"
              class="input-field pr-10"
              :class="{ 'border-red-500': passwordError }"
              minlength="6"
              maxlength="30"
              required
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <img :src="showPassword ? '/eyes.png' : '/eye.png'" class="w-5 h-5 opacity-70" />
            </button>
          </div>
          <p v-if="passwordError" class="text-red-500 text-sm mt-1">
            {{ passwordError }}
          </p>
        </div>

        <button
          type="submit"
          :disabled="!isFormValid || isLoading.value"
          class="w-full bg-blue-700 hover:bg-blue-800 active:scale-95 transition-transform text-white py-3 rounded-xl font-semibold shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {{ isLoading.value ? 'Yuklanmoqda...' : 'Kirish' }}
        </button>

        <p v-if="error" class="text-red-500 text-center mt-2 animate-shake">
          {{ error }}
        </p>
      </form>
    </div>

    <!-- Face Verification Modal -->
    <div
      v-if="showFaceModal"
      @click="showFaceModal = false; stopScanner()"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 dark:bg-gray-800/80"
    >
      <div @click.stop class="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 relative">
        <button
          @click="showFaceModal = false; stopScanner()"
          class="absolute top-4 right-4 text-gray-500 hover:text-red-500 dark:hover:text-red-400 text-3xl font-bold rotate-45"
        >
          +
        </button>
        <h2 class="text-2xl font-semibold text-center text-gray-800 dark:text-white mb-6">
          Yuzni Skaner Qilish
        </h2>
        <div v-if="isScanning" class="relative w-full max-w-md mx-auto">
          <video ref="video" autoplay class="w-full rounded-xl border border-gray-500/50"></video>
          <canvas ref="canvas" class="hidden"></canvas>
          <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div class="w-48 h-64 border-4 border-dashed border-green-500 rounded-lg opacity-50"></div>
          </div>
        </div>
        <div v-if="capturedImage" class="mt-4">
          <img :src="capturedImage.url" class="w-full h-64 object-cover rounded-lg border border-gray-500/50" />
          <button
            @click="removeCapturedImage"
            class="absolute top-6 right-12 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
          >
            &times;
          </button>
        </div>
        <div class="flex justify-center gap-4 mt-4">
          <button
            v-if="!isScanning && !capturedImage"
            @click="startScanner"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition"
            :disabled="isLoading.value"
          >
            Skanerlash
          </button>
          <button
            v-if="isScanning"
            @click="captureImage"
            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl transition"
            :disabled="isLoading.value"
          >
            Suratga Olish
          </button>
          <button
            v-if="isScanning"
            @click="stopScanner"
            class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition"
            :disabled="isLoading.value"
          >
            To'xtatish
          </button>
          <button
            v-if="capturedImage"
            @click="submitFace"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition"
            :disabled="isLoading.value"
          >
            {{ isLoading.value ? 'Yuklanmoqda...' : 'Tasdiqlash' }}
          </button>
        </div>
        <p v-if="error" class="text-center text-red-500 dark:text-red-400 mt-2 text-sm">
          {{ error }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { ref, inject, computed, watch, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { URL } from '../../auth/url';

const isLoading = inject('isLoading', ref(false));
const router = useRouter();
const url = `${URL}/login`;

const username = ref('');
const password = ref('');
const showPassword = ref(false);
const usernameError = ref('');
const passwordError = ref('');
const error = ref('');
const showFaceModal = ref(false);
const isScanning = ref(false);
const video = ref(null);
const canvas = ref(null);
const capturedImage = ref(null);
const userId = ref(null);
const tempToken = ref(null);

const USERNAME_MIN_LENGTH = 3;
const USERNAME_MAX_LENGTH = 30;
const PASSWORD_MIN_LENGTH = 6;
const PASSWORD_MAX_LENGTH = 30;

watch(username, (newValue) => {
  if (newValue.length > 0) {
    if (newValue.length < USERNAME_MIN_LENGTH) {
      usernameError.value = `Foydalanuvchi nomi kamida ${USERNAME_MIN_LENGTH} ta belgi bo'lishi kerak`;
    } else if (newValue.length > USERNAME_MAX_LENGTH) {
      usernameError.value = `Foydalanuvchi nomi ${USERNAME_MAX_LENGTH} ta belgidan ko'p bo'lmasligi kerak`;
    } else {
      usernameError.value = '';
    }
  } else {
    usernameError.value = '';
  }
});

watch(password, (newValue) => {
  if (newValue.length > 0) {
    if (newValue.length < PASSWORD_MIN_LENGTH) {
      passwordError.value = `Parol kamida ${PASSWORD_MIN_LENGTH} ta belgi bo'lishi kerak`;
    } else if (newValue.length > PASSWORD_MAX_LENGTH) {
      passwordError.value = `Parol ${PASSWORD_MAX_LENGTH} ta belgidan ko'p bo'lmasligi kerak`;
    } else {
      passwordError.value = '';
    }
  } else {
    passwordError.value = '';
  }
});

const isFormValid = computed(() => {
  return (
    username.value.length >= USERNAME_MIN_LENGTH &&
    username.value.length <= USERNAME_MAX_LENGTH &&
    password.value.length >= PASSWORD_MIN_LENGTH &&
    password.value.length <= PASSWORD_MAX_LENGTH &&
    !usernameError.value &&
    !passwordError.value
  );
});

const isMobileDevice = () => {
  return /iphone|ipad|android|mobile/i.test(navigator.userAgent.toLowerCase());
};

const setData = async () => {
  error.value = '';

  if (!isFormValid.value) {
    error.value = "Ma'lumotlarni to'g'ri kiriting";
    return;
  }

  if (isMobileDevice()) {
    error.value = "Telefon orqali tizimga kirish taqiqlangan!";
    return;
  }

  try {
    isLoading.value = true;
    const res = await axios.post(url, {
      username: username.value.trim(),
      password: password.value.trim(),
    });

    if (res.data.statusCode === 200) {
      userId.value = res.data.data.userId;
      tempToken.value = res.data.data.tempToken;
      showFaceModal.value = true;
    }
  } catch (err) {
    error.value = "Login yoki parol noto'g'ri.";
  } finally {
    isLoading.value = false;
  }
};

const startScanner = async () => {
  // Ensure running in browser environment
  if (typeof window === 'undefined' || !window.navigator.mediaDevices) {
    error.value = 'Kamera qo‘llab-quvvatlanmaydi';
    isScanning.value = false;
    showFaceModal.value = false;
    return;
  }

  isScanning.value = true;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (video.value) {
      video.value.srcObject = stream;
    }
  } catch (err) {
    console.error('Error accessing webcam:', err);
    error.value = 'Kameraga kirishda xatolik';
    isScanning.value = false;
    showFaceModal.value = false;
  }
};

const stopScanner = () => {
  if (video.value && video.value.srcObject) {
    const stream = video.value.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach(track => track.stop());
    video.value.srcObject = null;
  }
  isScanning.value = false;
};

const captureImage = () => {
  if (!video.value || !canvas.value) {
    error.value = 'Kamera yoki canvas topilmadi';
    return;
  }

  const context = canvas.value.getContext('2d');
  if (!context) {
    error.value = 'Canvas kontekstini olishda xatolik';
    return;
  }

  canvas.value.width = video.value.videoWidth;
  canvas.value.height = video.value.videoHeight;
  context.drawImage(video.value, 0, 0, canvas.value.width, canvas.value.height);

  canvas.value.toBlob(blob => {
    if (!blob) {
      error.value = 'Rasmni yaratishda xatolik';
      return;
    }
    if (!window.URL || !window.URL.createObjectURL) {
      error.value = 'URL.createObjectURL qo‘llab-quvvatlanmaydi';
      return;
    }
    const url = window.URL.createObjectURL(blob);
    const file = new File([blob], `face-${Date.now()}.jpg`, { type: 'image/jpeg' });
    capturedImage.value = { url, file };
    stopScanner();
  }, 'image/jpeg');
};

const removeCapturedImage = () => {
  if (capturedImage.value && capturedImage.value.url && window.URL && window.URL.revokeObjectURL) {
    window.URL.revokeObjectURL(capturedImage.value.url);
  }
  capturedImage.value = null;
  isScanning.value = false;
  startScanner();
};

const submitFace = async () => {
  if (!capturedImage.value) {
    error.value = 'Iltimos, yuz tasvirini oling';
    return;
  }

  const formData = new FormData();
  formData.append('userId', userId.value.toString());
  formData.append('tempToken', tempToken.value);
  formData.append('faceImage', capturedImage.value.file);

  try {
    isLoading.value = true;
    const res = await axios.post(`${URL}/login/verify-face`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (res.data.statusCode === 200) {
      const { token, user } = res.data.data;
      const expirationTime = new Date().getTime() + 3600000; // 1 hour
      localStorage.setItem('token', token);
      localStorage.setItem('tokenExpiration', expirationTime.toString());
      localStorage.setItem('role', user.role);
      localStorage.setItem('id', user.id);

      if (user.role === 'operator') {
        router.push('/main');
      } else if (user.role === 'accauntant' || user.role === 'chiefAccauntant') {
        router.push('/Dashboard');
      } else {
        router.push('/admin-list');
      }
    }
  } catch (err) {
    error.value = 'Yuzingiz tasdiqlashdan o\'ta olmadi';
  } finally {
    isLoading.value = false;
    if (capturedImage.value && capturedImage.value.url && window.URL && window.URL.revokeObjectURL) {
      window.URL.revokeObjectURL(capturedImage.value.url);
    }
    capturedImage.value = null;
  }
};

onMounted(() => {
  watch(showFaceModal, (newValue) => {
    if (newValue) {
      startScanner();
    } else {
      stopScanner();
      if (capturedImage.value && capturedImage.value.url && window.URL && window.URL.revokeObjectURL) {
        window.URL.revokeObjectURL(capturedImage.value.url);
      }
      capturedImage.value = null;
    }
  });
});

onUnmounted(() => {
  stopScanner();
  if (capturedImage.value && capturedImage.value.url && window.URL && window.URL.revokeObjectURL) {
    window.URL.revokeObjectURL(capturedImage.value.url);
  }
  capturedImage.value = null;
});
</script>

<style scoped>
.input-field {
  @apply w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm;
}

video {
  max-width: 100%;
  height: auto;
}

/* Animations */
@keyframes slide-up {
  0% {
    opacity: 0;
    transform: translateY(40px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-up {
  animation: slide-up 0.6s ease-out;
}

@keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.animate-fade-in {
  animation: fade-in 1s ease-in;
}

.delay-200 {
  animation-delay: 0.2s;
  animation-fill-mode: both;
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  20%, 60% {
    transform: translateX(-8px);
  }
  40%, 80% {
    transform: translateX(8px);
  }
}

.animate-shake {
  animation: shake 0.4s ease-in-out;
}
</style>