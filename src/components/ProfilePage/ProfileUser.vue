<script setup>
import { ref, onMounted, onUnmounted, computed, inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { io } from 'socket.io-client';
import { formatDistanceToNow, differenceInMinutes } from 'date-fns';
import { uz } from 'date-fns/locale';
import { URL } from '@/auth/url.js';
import translateText from '@/auth/Translate';

const userInfo = ref(null);
const loading = ref(true);
const error = ref(null);
const route = useRoute();
const router = useRouter();
const id = ref(route.params.id);
const onlineAdmins = ref([]);
const socket = io(URL);
const dat = ref(localStorage.getItem("til") || "datalotin");

let intervalId = null;
const checkLanguageChange = () => {
  const currentLang = localStorage.getItem("til") || "datalotin";
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

const fetchUserData = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Authentication token not found');

    loading.value = true;
    const response = await axios.get(`${URL}/admin/${id.value}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    userInfo.value = response.data;
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to load user data';
    console.error('Error fetching user data:', err);
  } finally {
    loading.value = false;
  }
};

const getImageUrl = (img) => {
  return img ? `${URL}/upload/${img}` : '/default-avatar.png';
};

const getAdminStatus = (admin) => {
  if (!admin?.id) {
    return { status: "Noma'lum", color: "text-gray-500", dotColor: "bg-gray-500" };
  }

  const currentAdminId = id.value.toString();
  const lastSeenDate = admin.lastSeen ? new Date(admin.lastSeen) : null;
  const isOnline = onlineAdmins.value.includes(currentAdminId) ||
    (lastSeenDate && differenceInMinutes(new Date(), lastSeenDate) < 2); // 2 daqiqaga o'zgartirildi

  if (isOnline) {
    return { status: "Onlayn", color: "text-green-500", dotColor: "bg-green-500" };
  }

  if (lastSeenDate) {
    return {
      status: `${formatDistanceToNow(lastSeenDate, { addSuffix: true, locale: uz })} tarmoqda edi`,
      color: "text-red-500",
      dotColor: "bg-red-500",
    };
  }

  return { status: "Oflayn", color: "text-red-500", dotColor: "bg-red-500" };
};

const adminStatus = computed(() =>
  userInfo.value ? getAdminStatus(userInfo.value) :
    { status: "Noma'lum", color: "text-gray-500", dotColor: "bg-gray-500" }
);

const checkOnlineStatus = (onlineAdminIds) => {
  onlineAdmins.value = onlineAdminIds.map(String);
};

onMounted(() => {
  fetchUserData();
  socket.emit('joinAdmin', id.value);
  socket.on('adminOnlineUpdate', checkOnlineStatus);
});

onUnmounted(() => {
  socket.off('adminOnlineUpdate');
  socket.disconnect();
});
</script>

<template>
  <div class="max-w-4xl mx-auto p-6">
    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-profile-blue mx-auto"></div>
      <p class="mt-4 text-gray-600">Loading profile data...</p>
    </div>

    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {{ error }}
    </div>

    <div v-else-if="userInfo" class="bg-blue-800 rounded-lg shadow-md p-6">
      <div class="flex flex-col sm:flex-row gap-6 mb-8">
        <div class="w-48 h-48 border-2 border-profile-blue rounded-lg overflow-hidden flex-shrink-0">
          <img :src="getImageUrl(userInfo.img)" alt="Profile Image" class="w-full h-full object-cover" />
        </div>

        <div class="flex-1 bg-profile-blue text-white p-5 rounded-lg">
          <div class="mb-4">
            <span class="font-medium">
              {{ dat === 'datakril' ? translateText('Fuqaroning lavozimi :') : 'Fuqaroning lavozimi :' }}
            </span>
            <span class="ml-2">
              {{ dat === 'datakril' ? translateText(userInfo.lavozimi) : userInfo.lavozimi }}
            </span>
          </div>
          <div class="flex items-center">
            <span :class="adminStatus.color">{{ adminStatus.status }}</span>
            <div class="w-5 h-5 ml-2 rounded-full" :class="adminStatus.dotColor"></div>
          </div>
        </div>
      </div>

      <div class="space-y-3">
        <div v-for="(value, key) in {
          'Ism va familya': `${userInfo.name} ${userInfo.surname} ${userInfo.dadname}`,
          'Passport raqami': userInfo.userCode,
          'Fuqaroning JSHSHIR raqami': userInfo.uniqueCode,
          'Fuqaroning logini': userInfo.username,
          'Fuqaroning mobil telefon raqami': userInfo.phone
        }" :key="key" class="flex p-3 hover:bg-lime-500 group duration-500 border rounded-md">
          <div v-if="dat === 'datalotin'">
            <span class="group-hover:text-black mr-3 text-[20px] font-medium duration-500">
              {{ key }}:
            </span>
            <span class="flex-1 group-hover:text-black text-[20px] duration-500">
              {{ value }}
            </span>
          </div>
          <div v-if="dat === 'datakril'">
            <span class="group-hover:text-black mr-3 text-[20px] font-medium duration-500">
              {{ translateText(key) }}:
            </span>
            <span class="flex-1 group-hover:text-black text-[20px] duration-500">
              {{ translateText(value) }}
            </span>
          </div>
        </div>

        <button v-for="route in [
          { path: '/requireUserTasksFiles', text: 'hodim_malumotlari' },
          { path: '/requireUserobligationsFiles', text: 'hodim_majburiyatlari' },
          { path: '/requireUserInfoFiles', text: 'hodim_vazifalari' }
        ]" :key="route.path" @click="router.push(route.path)"
          class="border hover:bg-lime-500 duration-500 hover:text-black text-[20px] w-full py-2 rounded-md">
          {{ $t(route.text) }}
        </button>
      </div>
    </div>
  </div>
</template>