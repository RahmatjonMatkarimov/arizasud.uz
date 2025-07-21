<template>
  <div class="min-h-screen bg-slate-200 flex items-center justify-center px-4">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 animate-slide-up border border-slate-300">
      <h2 class="text-3xl font-bold text-slate-800 text-center mb-6 animate-fade-in">
        Tizimga Kirish
      </h2>

      <form @submit.prevent="setData" class="space-y-4 animate-fade-in delay-200">
        <div>
          <input v-model="username" type="text" placeholder="Foydalanuvchi nomi" class="input-field"
            :class="{ 'border-red-500': usernameError }" minlength="3" maxlength="30" required />
          <p v-if="usernameError" class="text-red-500 text-sm mt-1">
            {{ usernameError }}
          </p>
        </div>

        <div>
          <div class="relative">
            <input v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="Parol"
              class="input-field pr-10" :class="{ 'border-red-500': passwordError }" minlength="6" maxlength="30"
              required />
            <button type="button" @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2">
              <img :src="showPassword ? '/eyes.png' : '/eye.png'" class="w-5 h-5 opacity-70" />
            </button>
          </div>
          <p v-if="passwordError" class="text-red-500 text-sm mt-1">
            {{ passwordError }}
          </p>
        </div>

        <input v-model="tell" type="number" placeholder="Telefon raqam" class="input-field" />
        <input v-model="jshshr" type="number" placeholder="JSHSHR" class="input-field" />

        <button type="submit" :disabled="!isFormValid"
          class="w-full bg-blue-700 hover:bg-blue-800 active:scale-95 transition-transform text-white py-3 rounded-xl font-semibold shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed">
          Kirish
        </button>

        <p v-if="error" class="text-red-500 text-center mt-2 animate-shake">
          {{ error }}
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, inject, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { URL } from "../auth/url";

const isLoading = inject("isLoading");
const password = ref("");
const username = ref("");
const jshshr = ref("");
const tell = ref("");
const sms = ref("");
const modal = ref(false);
const error = ref("");
const router = useRouter();
const url = `${URL}/login`;
const id = ref(null);
const showPassword = ref(false);

// Validation errors
const usernameError = ref("");
const passwordError = ref("");

// Validation constants
const USERNAME_MIN_LENGTH = 3;
const USERNAME_MAX_LENGTH = 30;
const PASSWORD_MIN_LENGTH = 6;
const PASSWORD_MAX_LENGTH = 30;

// Watch for username changes and validate
watch(username, (newValue) => {
  if (newValue.length > 0) {
    if (newValue.length < USERNAME_MIN_LENGTH) {
      usernameError.value = `Foydalanuvchi nomi kamida ${USERNAME_MIN_LENGTH} ta belgi bo'lishi kerak`;
    } else if (newValue.length > USERNAME_MAX_LENGTH) {
      usernameError.value = `Foydalanuvchi nomi ${USERNAME_MAX_LENGTH} ta belgidan ko'p bo'lmasligi kerak`;
    } else {
      usernameError.value = "";
    }
  } else {
    usernameError.value = "";
  }
});

// Watch for password changes and validate
watch(password, (newValue) => {
  if (newValue.length > 0) {
    if (newValue.length < PASSWORD_MIN_LENGTH) {
      passwordError.value = `Parol kamida ${PASSWORD_MIN_LENGTH} ta belgi bo'lishi kerak`;
    } else if (newValue.length > PASSWORD_MAX_LENGTH) {
      passwordError.value = `Parol ${PASSWORD_MAX_LENGTH} ta belgidan ko'p bo'lmasligi kerak`;
    } else {
      passwordError.value = "";
    }
  } else {
    passwordError.value = "";
  }
});

// Check if form is valid
const isFormValid = computed(() => {
  return username.value.length >= USERNAME_MIN_LENGTH &&
    username.value.length <= USERNAME_MAX_LENGTH &&
    password.value.length >= PASSWORD_MIN_LENGTH &&
    password.value.length <= PASSWORD_MAX_LENGTH &&
    !usernameError.value &&
    !passwordError.value;
});

const isMobileDevice = () => {
  return /iphone|ipad|android|mobile/i.test(navigator.userAgent.toLowerCase());
};

const setData = async () => {
  // Clear previous errors
  error.value = "";

  // Final validation before submission
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
      id.value = res.data.data.user.id;
      localStorage.setItem("id", res.data.data.user.id);
      const token = res.data.data.token;
      const role = res.data.data.user.role;
      const expirationTime = new Date().getTime() + 3600000;
      localStorage.setItem("token", token);
      localStorage.setItem("tokenExpiration", expirationTime.toString());
      localStorage.setItem("role", role);

      if (!role) {
        error.value = "Login yoki parol noto'g'ri.";
        isLoading.value = false;
      }
      else if (role === 'operator') {
        router.push(`/home`);
        isLoading.value = false;
      }
      else if (role === 'accauntant' || role === 'chiefAccauntant') {
        router.push(`/Dashboard`);
        isLoading.value = false;
      }
      else if (role !== 'operator' || role !== 'accauntant' || role !== 'chiefAccauntant') {
        router.push(`/admin-list`);
        isLoading.value = false;
      }
      else {
        error.value = "Bu tizimga Kirish huquqingiz mavjud emas";
        isLoading.value = false;
      }
    }
  } catch (err) {
    error.value = "Login yoki parol noto'g'ri.";
    isLoading.value = false;
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.input-field {
  @apply w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm;
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

/* Shake for error */
@keyframes shake {

  0%,
  100% {
    transform: translateX(0);
  }

  20%,
  60% {
    transform: translateX(-8px);
  }

  40%,
  80% {
    transform: translateX(8px);
  }
}

.animate-shake {
  animation: shake 0.4s ease-in-out;
}
</style>