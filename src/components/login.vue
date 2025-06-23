<template>
  <div class="min-h-screen bg-slate-200 flex items-center justify-center px-4">
    <div
      class="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 animate-slide-up border border-slate-300"
    >
      <h2 class="text-3xl font-bold text-slate-800 text-center mb-6 animate-fade-in">
        Tizimga Kirish
      </h2>

      <form @submit.prevent="setData" class="space-y-4 animate-fade-in delay-200">
        <input
          v-model="username"
          type="text"
          placeholder="Foydalanuvchi nomi"
          class="input-field"
          required
        />

        <div class="relative">
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Parol"
            class="input-field pr-10"
            required
          />
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <img
              :src="showPassword ? '/eyes.png' : '/eye.png'"
              class="w-5 h-5 opacity-70"
            />
          </button>
        </div>

        <input
          v-model="tell"
          type="number"
          placeholder="Telefon raqam"
          class="input-field"
        />
        <input v-model="jshshr" type="number" placeholder="JSHSHR" class="input-field" />

        <button
          type="submit"
          class="w-full bg-blue-700 hover:bg-blue-800 active:scale-95 transition-transform text-white py-3 rounded-xl font-semibold shadow-md"
        >
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
import { ref, inject } from "vue";
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

const isMobileDevice = () => {
  return /iphone|ipad|android|mobile/i.test(navigator.userAgent.toLowerCase());
};

const setData = async () => {
  if (isMobileDevice()) {
    error.value = "Telefon orqali tizimga kirish taqiqlangan!";
    return;
  }

  isLoading.value = true;
  try {
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
        error.value = "Foydalanuvchi roli aniqlanmadi.";
      } else if (role) {
        router.push(`/admin-list`);
      } else {
        error.value = "Bu rolda tizimga kirish taqiqlangan.";
      }
    }
  } catch (err) {
    error.value = "Login yoki parol noto'g'ri.";
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
