<template>
  <div>
    <div class="w-full fixed mb-32 top-0 z-20 mx-auto">
      <!-- Toggle Button for Aside -->
      <button @click="toggleAside" :class="[
        'fixed z-30 bg-blue-800 hover:bg-blue-900 text-white w-11 h-11 flex items-center justify-center',
        isAsideVisible ? 'left-[420px] top-[50%] duration-700 rounded-r-lg' : 'left-0 top-[50%] duration-700 rounded-r-lg'
      ]">
        <img src="/menu1.png"
          :class="['w-6 h-6 transition-transform duration-500', isAsideVisible ? 'rotate-180' : 'rotate-0']" />
      </button>

      <div v-if="dat === 'datakril'" class="bg-blue-800 flex h-[200px] p-2">
        <!-- Existing content for datakril -->
        <div class="flex items-start gap-6 mb-8">
          <div @click="router.push(`/profileUser/${userInfoLotin.id}`)"
            class="flex gap-2 flex-col justify-center items-center">
            <div class="w-36 h-36 border-2 border-profile-blue rounded-lg overflow-hidden">
              <img :src="getImageUrl(userInfoLotin.img)" alt="Profile Image" />
            </div>
            <h1 class="font-bold border-2 border-profile-blue rounded-lg overflow-hidden px-2">{{ userInfo.name }} {{
              userInfo.surname }}</h1>
          </div>
          <div class="flex-1 w-[300px] bg-profile-blue m-2 text-white rounded-lg">
            <div class="mb-4 relative w-full flex border p-4 rounded-lg break-words">
              <span class="font-medium capitalize">{{ $t('fuqaro_lavozimi') }}:</span>
              <span class="block group capitalize truncate max-w-[250px] ml-2 cursor-pointer">
                {{ userInfo.lavozimi }}
                <span
                  class="absolute capitalize left-0 -bottom-7 w-auto min-w-max bg-lime-500 text-black text-[16px] p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  <div class="flex justify-center items-center">
                    <h1 style="text-shadow: 0 0 5px #fff,0 0 10px #fff;"
                      class="text-black text-[16px] font-bold text-center rounded-lg">{{ userInfo.lavozimi }} </h1>
                  </div>
                </span>
              </span>
            </div>
            <div class="flex border rounded-lg px-4 items-center">
              <span class="font-medium capitalize">{{ $t('tizim_holati') }}:</span>
              <div class="flex h-10 items-center ml-2">
                <span class="mr-2">{{ isOnline ? "Onlayn" : "Oflayn" }}</span>
                <div class="flex gap-1">
                  <div class="w-6 h-6 rounded-full" :class="isOnline ? 'bg-green-500' : 'bg-red-500'"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-col flex-wrap">
          <button v-if="role !== 'bigAdmin'" @click="router.push('/reminders')"
            class="border capitalize bg-lime-600 p-2 m-2 text-black rounded hover:bg-lime-700 duration-500">
            {{ $t('hisobot') }}
          </button>
          <button @click="go(userInfoLotin.id)"
            class="border capitalize bg-lime-600 p-2 m-2 text-black rounded hover:bg-lime-700 duration-500">
            {{ $t('ish_haqqi_kalkulyatori') }}
          </button>
          <a href="https://www.zoom.com/uz" target="_blank"
            class="border bg-lime-600 py-2 px-6 m-2 text-center text-black rounded hover:bg-lime-700 duration-500 capitalize">
            {{ $t('zoom_boglanish') }}
          </a>
          <button @click="go2(userInfoLotin.id)"
            class="border capitalize bg-lime-600 p-2 m-2 text-black rounded hover:bg-lime-700 duration-500">
            {{ $t('hodim_majburiyatlari') }}
          </button>
          <button @click="go3(userInfoLotin.id)"
            class="border capitalize bg-lime-600 p-2 m-2 text-black rounded hover:bg-lime-700 duration-500">
            {{ $t('hodim_vazifalari') }}
          </button>
          <button v-if="data?.ticket" @click="router.push('/ticketAdmin')"
            class="border capitalize bg-lime-600 p-2 m-2 text-black rounded hover:bg-lime-700 duration-500">
            {{ $t('taklif_va_shikoyat') }}
          </button>
          <div @click="gonotif(userInfo.id)"
            class="relative bg-lime-600 hover:bg-lime-700 duration-500 flex border items-center capitalize px-6 m-2 rounded">
            <img class="w-10 -ml-4 mr-9" src="/chat.png" alt="">
            {{ $t('muhim_sms') }}
            <span v-if="notificationCount > 0"
              class="ml-2 absolute top-[2px] left-[37px] bg-red-500 text-white rounded-full px-2 py-1 h-5 text-[13px]">
              <h1 class="-mt-1 capitalize">{{ notificationCount }}</h1>
            </span>
          </div>
          <div @click="gochat1(userInfo.id)"
            class="relative bg-lime-600 hover:bg-lime-700 duration-500 flex border items-center capitalize px-6 m-2 rounded">
            <img class="w-10 -ml-4 mr-9" src="/chat.png" alt="">
            {{ $t('chat-guruh') }}
            <span v-if="messageCount > 0"
              class="ml-2 absolute top-[2px] left-[37px] bg-red-500 text-white rounded-full px-2 py-1 h-5 text-[13px]">
              <h1 class="-mt-1 capitalize">{{ messageCount }}</h1>
            </span>
          </div>
          <div class="absolute top-1 right-1">
            <div class="relative">
              <button @click="toggleDropdown"
                class="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 rounded-lg px-4 py-2 shadow-md">
                <img :src="selectedFlag" class="w-5 rounded h-5" />
                <span>{{ selectedLabel }}</span>
                <svg class="w-4 h-4 transition-transform transform" :class="{ 'rotate-180': isOpen }"
                  fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clip-rule="evenodd"></path>
                </svg>
              </button>
              <div v-if="isOpen"
                class="absolute right-0 mt-2 w-40 bg-blue-700 border rounded-lg shadow-md overflow-hidden transition-opacity">
                <div @click="setLanguage('uzb', 'Uz', '/uzb.png')"
                  class="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-blue-800 transition">
                  <img src="/uzb.png" class="w-5 rounded h-5" />
                  <span>Uz</span>
                </div>
                <div @click="setLanguage('ўзб', 'Уз', '/uzb.png')"
                  class="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-blue-800 transition">
                  <img src="/uzb.png" class="w-5 rounded h-5" />
                  <span>Уз</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="dat === 'datalotin'" class="bg-blue-800 flex h-[200px] p-2">
        <!-- Existing content for datalotin -->
        <div class="flex items-start gap-6 mb-8">
          <div @click="router.push(`/profileUser/${userInfoLotin.id}`)"
            class="flex gap-2 flex-col justify-center items-center">
            <div class="w-36 h-36 border-2 border-profile-blue rounded-lg overflow-hidden">
              <img :src="getImageUrl(userInfoLotin.img)" alt="Profile Image" />
            </div>
            <h1 class="font-bold border-2 border-profile-blue rounded-lg overflow-hidden px-2">{{ userInfoLotin.name }}
              {{ userInfoLotin.surname }}</h1>
          </div>
          <div class="flex-1 w-[300px] bg-profile-blue m-2 text-white rounded-lg">
            <div class="mb-4 relative w-full flex border p-4 rounded-lg break-words">
              <span class="font-medium capitalize">{{ $t('fuqaro_lavozimi') }}:</span>
              <span class="block group capitalize truncate max-w-[250px] ml-2 cursor-pointer">
                {{ userInfoLotin.lavozimi }}
                <span
                  class="absolute capitalize left-0 -bottom-7 w-auto min-w-max bg-lime-500 text-black text-[16px] p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  <div class="flex justify-center items-center">
                    <h1 style="text-shadow: 0 0 5px #fff,0 0 10px #fff;"
                      class="text-black text-[16px] font-bold text-center rounded-lg">{{ userInfoLotin.lavozimi }} </h1>
                  </div>
                </span>
              </span>
            </div>
            <div class="flex border rounded-lg px-4 items-center">
              <span class="font-medium capitalize">{{ $t('tizim_holati') }}:</span>
              <div class="flex h-10 items-center ml-2">
                <span class="mr-2">{{ isOnline ? "Onlayn" : "Oflayn" }}</span>
                <div class="flex gap-1">
                  <div class="w-6 h-6 rounded-full" :class="isOnline ? 'bg-green-500' : 'bg-red-500'"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-col flex-wrap">
          <button v-if="role !== 'bigAdmin'" @click="router.push('/reminders')"
            class="border capitalize bg-lime-600 p-2 m-2 text-black rounded hover:bg-lime-700 duration-500">
            {{ $t('hisobot') }}
          </button>
          <button @click="go(userInfoLotin.id)"
            class="border capitalize bg-lime-600 p-2 m-2 text-black rounded hover:bg-lime-700 duration-500">
            {{ $t('ish_haqqi_kalkulyatori') }}
          </button>
          <a href="https://www.zoom.com/uz" target="_blank"
            class="border bg-lime-600 py-2 px-6 m-2 text-center text-black rounded hover:bg-lime-700 duration-500 capitalize">
            {{ $t('zoom_boglanish') }}
          </a>
          <button @click="go2(userInfoLotin.id)"
            class="border capitalize bg-lime-600 p-2 m-2 text-black rounded hover:bg-lime-700 duration-500">
            {{ $t('hodim_majburiyatlari') }}
          </button>
          <button @click="go3(userInfoLotin.id)"
            class="border capitalize bg-lime-600 p-2 m-2 text-black rounded hover:bg-lime-700 duration-500">
            {{ $t('hodim_vazifalari') }}
          </button>
          <button v-if="data?.ticket" @click="router.push('/ticketAdmin')"
            class="border capitalize bg-lime-600 p-2 m-2 text-black rounded hover:bg-lime-700 duration-500">
            {{ $t('taklif_va_shikoyat') }}
          </button>
          <div @click="gonotif(userInfo.id)"
            class="relative bg-lime-600 hover:bg-lime-700 duration-500 flex border items-center capitalize px-6 m-2 rounded">
            <img class="w-10 -ml-4 mr-9" src="/chat.png" alt="">
            {{ $t('muhim_sms') }}
            <span v-if="notificationCount > 0"
              class="ml-2 absolute top-[2px] left-[37px] bg-red-500 text-white rounded-full px-2 py-1 h-5 text-[13px]">
              <h1 class="-mt-1 capitalize">{{ notificationCount }}</h1>
            </span>
          </div>
          <div @click="gochat1(userInfo.id)"
            class="relative bg-lime-600 hover:bg-lime-700 duration-500 flex border items-center capitalize px-6 m-2 rounded">
            <img class="w-10 -ml-4 mr-9" src="/chat.png" alt="">
            {{ $t('chat-guruh') }}
            <span v-if="messageCount > 0"
              class="ml-2 absolute top-[2px] left-[37px] bg-red-500 text-white rounded-full px-2 py-1 h-5 text-[13px]">
              <h1 class="-mt-1 capitalize">{{ messageCount }}</h1>
            </span>
          </div>
        </div>
        <div class="absolute top-1 right-1">
          <div class="relative">
            <button @click="toggleDropdown"
              class="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 rounded-lg px-4 py-2 shadow-md">
              <img :src="selectedFlag" class="w-5 rounded h-5" />
              <span>{{ selectedLabel }}</span>
              <svg class="w-4 h-4 transition-transform transform" :class="{ 'rotate-180': isOpen }" fill="currentColor"
                viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd"></path>
              </svg>
            </button>
            <div v-if="isOpen"
              class="absolute right-0 mt-2 w-40 bg-blue-700 border rounded-lg shadow-md overflow-hidden transition-opacity">
              <div @click="setLanguage('uzb', 'Uz', '/uzb.png')"
                class="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-blue-800 transition">
                <img src="/uzb.png" class="w-5 rounded h-5" />
                <span>Uz</span>
              </div>
              <div @click="setLanguage('ўзб', 'Уз', '/uzb.png')"
                class="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-blue-800 transition">
                <img src="/uzb.png" class="w-5 rounded h-5" />
                <span>Уз</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex">
      <Aside class="fixed left-0 top-0 h-full w-64 transition-all duration-700 ease-in-out"
        :class="{ 'translate-x-0 opacity-100': isAsideVisible, '-translate-x-full opacity-0': !isAsideVisible }" />
      <main
        :class="['flex-1 mt-[200px] transition-all duration-700 ease-in-out', isAsideVisible ? 'ml-[420px]' : 'ml-[0px]']">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, inject, watch } from "vue";
import { useRouter } from "vue-router";
import Aside from "../aside.vue";
import axios from "axios";
import { URL } from "@/auth/url.js";
import { io } from "socket.io-client";
import { useI18n } from "vue-i18n";
import { provide } from "vue";
import translateText from "@/auth/Translate";

const { locale } = useI18n();
const isOpen = ref(false);
const selectedFlag = ref("/uzb.png");
const selectedLabel = ref("Uz");
const dat = ref("datalotin");
provide("dat", dat);
const isLoading = inject('isLoading');
const isAsideVisible = ref(false);
const ids = localStorage.getItem("id");
const newIds = parseInt(ids);
const role = localStorage.getItem("role");
const data = ref({});
const router = useRouter();
const id = localStorage.getItem("id");
const newId = id ? parseInt(id) : null;
const error = ref(null);
const userInfo = ref({});
const userInfoLotin = ref({});
const isOnline = ref(false);
const notificationCount = ref(0);
const messageCount = ref(parseInt(localStorage.getItem('messageCount')) || 0);

// Socket.IO ulanishi
const socket = io(URL, {
  path: '/socket.io',
  transports: ['websocket', 'polling'],
  withCredentials: true,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  timeout: 20000,
  auth: { userId: id },
});

// Watch messageCount va localStorage'ga saqlash
watch(messageCount, (newVal) => {
  localStorage.setItem('messageCount', newVal);
});

// Admin ma'lumotlarini olish
const fetchAdminData = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get(`${URL}/${localStorage.getItem("role")}/${newIds}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    data.value = response.data.permissions[response.data.permissions.length - 1];
  } catch (error) {
    console.error("Xatolik yuz berdi:", error);
  } finally {
    isLoading.value = false;
  }
};

// Dropdown'ni ochish/yopish
const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};
// Tilni o'zgartirish
const setLanguage = (lang, label, flag) => {
  dat.value = lang === "ўзб" ? "datakril" : "datalotin";
  locale.value = lang;
  selectedLabel.value = label;
  selectedFlag.value = flag;
  isOpen.value = false;
};

// Aside'ni ochish/yopish
const toggleAside = () => {
  isAsideVisible.value = !isAsideVisible.value;
};

// Rasm URL'ini olish
const getImageUrl = (img) => {
  return img ? `${URL}/upload/${img}` : "/default-avatar.png";
};

// Navigatsiya funksiyalari
const go = (id) => router.push(`/salaryCalculator/${id}`);
const go1 = (id) => router.push(`/requireUserInfoFiles`);
const go2 = (id) => router.push(`/requireUserobligationsFiles`);
const go3 = (id) => router.push(`/requireUserTasksFiles`);
const gonotif = (id) => router.push(`/notifications/${id}`);
const gochat1 = (id) => router.push(`/chat/${id}`);

// Foydalanuvchi ma'lumotlarini olish
const getData = async () => {
  isLoading.value = true;
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token topilmadi. Foydalanuvchi avtorizatsiyadan o'tmagan.");

    const response = await axios.get(`${URL}/${localStorage.getItem('role')}/${newId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    userInfo.value = { ...response.data };
    for (const key in userInfo.value) {
      if (typeof userInfo.value[key] === "string") {
        userInfo.value[key] = translateText(userInfo.value[key]);
      }
    }
    userInfoLotin.value = response.data;

    // Onlayn foydalanuvchilarni olish
    const onlineResponse = await axios.get(`${URL}/${localStorage.getItem('role')}/online`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    checkOnlineStatus(onlineResponse.data.map((admin) => String(admin.id)));
    await fetchNotifications();
  } catch (err) {
    console.error("Xatolik:", err.response?.data || err.message);
    error.value = "Ma'lumotlarni yuklashda xatolik yuz berdi.";
  } finally {
    isLoading.value = false;
  }
};

// Bildirishnomalarni olish
const fetchNotifications = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token topilmadi. Foydalanuvchi avtorizatsiyadan o'tmagan.");

    const response = await axios.get(`${URL}/${localStorage.getItem('role')}/${newId}/notifications/unread-count`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    notificationCount.value = response.data;
  } catch (error) {
    console.error("Xatolik o'qilmagan xabarnomalar sonini olishda:", error);
  }
};
const fetchMassage = async () => {
  try {
    const response = await axios.get(`${URL}/messages/unread/${newId}`,);
    console.log(response.data)
    messageCount.value = response.data.length
  } catch (error) {
    console.error("Xatolik o'qilmagan xabarnomalar sonini olishda:", error);
  }
};

// Tug'ilgan kunni formatlash
const formattedBirthday = computed(() => {
  if (!userInfoLotin.value?.birthday) return "Ma'lum emas";

  const date = new Date(userInfoLotin.value.birthday);
  if (isNaN(date.getTime())) return "Ma'lum emas";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${day}.${month}.${year}`;
});

// Onlayn holatni tekshirish
const checkOnlineStatus = (onlineAdmins) => {
  isOnline.value = onlineAdmins.includes(String(id));
};

// Lifecycle hooks
onMounted(() => {
  getData();
  fetchAdminData();

  // Validate ID before emitting
  if (!id || isNaN(parseInt(id))) {
    console.error('Invalid user ID:', id);
    return;
  }

  // Socket ulanish hodisalari
  socket.on('connect', () => {
    socket.emit('joinUser', id);
  });

  socket.on('connect_error', (error) => {
    console.error('Socket.IO connection error:', error.message, error);
  });

  socket.on('adminOnlineUpdate', checkOnlineStatus);

  socket.on('newNotification', () => {
    fetchNotifications();
  });

  socket.on('unreadMessageCount', (count) => {
    messageCount.value += count;
    fetchMassage()
    console.log(count)
  });

  fetchNotifications();
  fetchMassage()

  // Bildirishnomalarni vaqti-vaqti bilan yangilash
  const intervalId = setInterval(fetchNotifications, 10000);
  const intervalId1 = setInterval(fetchMassage, 10000);
  provide('intervalId', intervalId);
  provide('intervalId1', intervalId1);
});

onUnmounted(() => {
  socket.off('adminOnlineUpdate');
  socket.off('newNotification');
  socket.off('unreadMessageCount');
  socket.off('connect');
  socket.off('connect_error');
  socket.disconnect();
  const intervalId = inject('intervalId');
  if (intervalId) clearInterval(intervalId);
});
</script>

<style scoped>
aside {
  background-color: #1e3a8a;
}
</style>