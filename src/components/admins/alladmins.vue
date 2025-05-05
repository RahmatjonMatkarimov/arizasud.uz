<template>
  <div class="flex justify-center mt-8 items-center">
    <h1
      class="text-black text-[40px] font-bold text-center bg-lime-500 border-[3px] border-black rounded-lg py-2 px-[100px]">
      {{ dat === 'datakril' ? translateText('Barcha ishchilar ro\'yxati') : 'Barcha ishchilar ro\'yxati' }}
    </h1>
  </div>
  <div class="min-h-screen flex items-center flex-col p-4">
    <div class="flex items-end gap-3">
      <!-- Big Admins Section -->
      <div v-for="item in bigadmin" :key="item.id"
        class="relative mt-8 flex flex-col md:flex-row items-center justify-between p-4 bg-white shadow-md rounded-lg border border-gray-200">
        <div @click="path(item.id)" class="relative flex flex-col md:flex-row items-center justify-between p-4 w-full">
          <div class="w-24 h-24 flex-shrink-0 rounded-full overflow-hidden border border-gray-300">
            <img :src="getImageUrl(item.img)" class="w-full h-full object-cover" alt="Admin Image" />
          </div>
          <div class="ml-4 flex-grow">
            <h1 class="text-2xl font-semibold text-gray-700">
              {{ t('adminCard.fioLabel') }}
              {{ dat === 'datakril' ? translateText(item.surname) : item.surname }}
              {{ dat === 'datakril' ? translateText(item.name) : item.name }}
              {{ dat === 'datakril' ? translateText(item.dadname) : item.dadname }}
            </h1>
            <h1 class="text-lg text-gray-500">
              {{ t('adminCard.loginLabel') }}
              {{ dat === 'datakril' ? translateText(item.username) : item.username }}
            </h1>
            <div class="mb-4 relative text-gray-700 flex w-fit break-words">
              <span class="font-medium text-gray-700">{{ t('adminCard.roleLabel') }}</span>
              <span class="block group truncate text-gray-700 max-w-[450px] ml-2 cursor-pointer">
                {{ dat === 'datakril' ? translateText(item.lavozimi) : item.lavozimi }}
                <span
                  class="absolute left-0 top-full mt-1 w-auto max-w-[550px] bg-gray-800 text-white text-sm px-2 py-1 rounded hidden group-hover:block">
                  {{ dat === 'datakril' ? translateText(item.lavozimi) : item.lavozimi }}
                </span>
              </span>
            </div>
            <div class="flex items-center">
              <span class="mr-2 text-sm text-gray-500">{{ t('adminCard.statusLabel') }}</span>
              <span :class="getAdminStatus(item).color">
                {{ getAdminStatus(item).status }}
              </span>
              <div class="flex items-center gap-2 ml-2">
                <div class="w-5 h-5 rounded-full" :class="checkIsOnline(item) ? 'bg-green-500' : 'bg-red-500'"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Yordamchi Section -->
      <div v-for="item in yordamchi" :key="item.id" class="relative mt-8">
        <div @click="path(item.id)"
          class="relative bg-white p-4 flex justify-center items-center shadow-md rounded-lg border border-gray-200">
          <div class="w-16 h-16 flex-shrink-0 rounded-full overflow-hidden border border-gray-300">
            <img :src="getImageUrl(item.img)" class="w-full h-full object-cover" alt="Admin Image" />
          </div>
          <div class="ml-4 flex justify-between flex-grow">
            <div class="flex">
              <div>
                <h1 class="text-xl font-semibold text-gray-700">
                  {{ t('adminCard.fioLabel') }}
                  {{ dat === 'datakril' ? translateText(item.surname) : item.surname }}
                  {{ dat === 'datakril' ? translateText(item.name) : item.name }}
                  {{ dat === 'datakril' ? translateText(item.dadname) : item.dadname }}
                </h1>
                <div class="mb-4 relative text-gray-700 flex w-fit break-words">
                  <span class="font-medium text-gray-700">{{ t('adminCard.roleLabel') }}</span>
                  <span class="block group truncate text-gray-700 max-w-[450px] ml-2 cursor-pointer">
                    {{ dat === 'datakril' ? translateText(item.lavozimi) : item.lavozimi }}
                    <span
                      class="absolute left-0 top-full mt-1 w-auto max-w-[550px] bg-gray-800 text-white text-sm px-2 py-1 rounded hidden group-hover:block">
                      {{ dat === 'datakril' ? translateText(item.lavozimi) : item.lavozimi }}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Two Section -->
    <div class="w-full flex flex-wrap justify-center gap-4 mt-8">
      <div v-for="item in two" :key="item.id"
        class="relative w-[700px] flex flex-col md:flex-row items-center justify-between p-4 bg-white shadow-md rounded-lg border border-gray-200">
        <div @click="path(item.id)" class="relative flex flex-col md:flex-row items-center justify-between p-4 w-full">
          <div class="w-16 h-16 flex-shrink-0 rounded-full overflow-hidden border border-gray-300">
            <img :src="getImageUrl(item.img)" class="w-full h-full object-cover" alt="Admin Image" />
          </div>
          <div class="ml-4 flex-grow">
            <h1 class="text-2xl font-semibold text-gray-700">
              {{ t('adminCard.fioLabel') }}
              {{ dat === 'datakril' ? translateText(item.surname) : item.surname }}
              {{ dat === 'datakril' ? translateText(item.name) : item.name }}
              {{ dat === 'datakril' ? translateText(item.dadname) : item.dadname }}
            </h1>
            <h1 class="text-lg text-gray-500">
              {{ t('adminCard.loginLabel') }}
              {{ dat === 'datakril' ? translateText(item.username) : item.username }}
            </h1>
            <div class="mb-4 relative text-gray-700 flex w-fit break-words">
              <span class="font-medium text-gray-700">{{ t('adminCard.roleLabel') }}</span>
              <span class="block group truncate text-gray-700 max-w-[450px] ml-2 cursor-pointer">
                {{ dat === 'datakril' ? translateText(item.lavozimi) : item.lavozimi }}
                <span
                  class="absolute left-0 top-full mt-1 w-auto max-w-[550px] bg-gray-800 text-white text-sm px-2 py-1 rounded hidden group-hover:block">
                  {{ dat === 'datakril' ? translateText(item.lavozimi) : item.lavozimi }}
                </span>
              </span>
            </div>
            <div class="flex items-center">
              <span class="mr-2 text-sm text-gray-500">{{ t('adminCard.statusLabel') }}</span>
              <span :class="getAdminStatus(item).color">
                {{ getAdminStatus(item).status }}
              </span>
              <div class="flex items-center gap-2 ml-2">
                <div class="w-5 h-5 rounded-full" :class="checkIsOnline(item) ? 'bg-green-500' : 'bg-red-500'"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Regular Admins Section -->
      <div class="w-full flex flex-wrap justify-center gap-4 mt-8">
        <div v-for="item in admins" :key="item.id"
          class="relative w-[700px] flex flex-col md:flex-row items-center justify-between p-4 bg-white shadow-md rounded-lg border border-gray-200">
          <div @click="path(item.id)"
            class="relative flex flex-col md:flex-row items-center justify-between p-4 w-full">
            <div class="w-16 h-16 flex-shrink-0 rounded-full overflow-hidden border border-gray-300">
              <img :src="getImageUrl(item.img)" class="w-full h-full object-cover" alt="Admin Image" />
            </div>
            <div class="ml-4 flex-grow">
              <h1 class="text-2xl font-semibold text-gray-700">
                {{ t('adminCard.fioLabel') }}
                {{ dat === 'datakril' ? translateText(item.surname) : item.surname }}
                {{ dat === 'datakril' ? translateText(item.name) : item.name }}
                {{ dat === 'datakril' ? translateText(item.dadname) : item.dadname }}
              </h1>
              <h1 class="text-lg text-gray-500">
                {{ t('adminCard.loginLabel') }}
                {{ dat === 'datakril' ? translateText(item.username) : item.username }}
              </h1>
              <div class="mb-4 relative text-gray-700 flex w-fit break-words">
                <span class="font-medium text-gray-700">{{ t('adminCard.roleLabel') }}</span>
                <span class="block group truncate text-gray-700 max-w-[450px] ml-2 cursor-pointer">
                  {{ dat === 'datakril' ? translateText(item.lavozimi) : item.lavozimi }}
                  <span
                    class="absolute left-0 top-full mt-1 w-auto max-w-[550px] bg-gray-800 text-white text-sm px-2 py-1 rounded hidden group-hover:block">
                    {{ dat === 'datakril' ? translateText(item.lavozimi) : item.lavozimi }}
                  </span>
                </span>
              </div>
              <div class="flex items-center">
                <span class="mr-2 text-sm text-gray-500">{{ t('adminCard.statusLabel') }}</span>
                <span :class="getAdminStatus(item).color">
                  {{ getAdminStatus(item).status }}
                </span>
                <div class="flex items-center gap-2 ml-2">
                  <div class="w-5 h-5 rounded-full" :class="checkIsOnline(item) ? 'bg-green-500' : 'bg-red-500'"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, inject } from "vue";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { uz } from "date-fns/locale";
import { URL } from "@/auth/url.js"; // Ensure this points to your server URL
import { io } from "socket.io-client";
import { useRouter } from "vue-router";
import { useI18n } from 'vue-i18n';


// Vue I18n setup
const { t } = useI18n();

// Socket.IO setup
const socket = io(URL);

// Reactive state
const onlineAdmins = ref([]); // List of currently online admin IDs
const modalOpen = ref(null); // Unused in this template, but kept for consistency
const router = useRouter();
const admins = ref([]); // Regular admins (excluding specific roles)
const bigadmin = ref([]); // Big admins
const yurist = ref([]); // Yurists (used for filtering)
const yordamchi = ref([]); // Yordamchi admins
const two = ref([]); // Admins with specific roles (orinbosar, bolim boshligi)

// Inject 'dat' for language toggle
const dat = inject('dat');

import translateText from "@/auth/Translate";

// Navigation function (currently redirects to '/all' instead of individual profiles)
const path = (id) => {
  router.push(`/all`);
};

// Fetch all admin data from multiple endpoints
const getData = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found in localStorage");
    return;
  }

  const config = { headers: { Authorization: `Bearer ${token}` } };

  try {
    const [adminRes, yuristRes, bigadminsRes, managerRes] = await Promise.all([
      axios.get(`${URL}/admin`, config),
      axios.get(`${URL}/yurist`, config),
      axios.get(`${URL}/bigAdmin`, config),
      axios.get(`${URL}/manager`, config),
    ]);

    // Combine and filter admins
    admins.value = [...yuristRes.data, ...managerRes.data, ...adminRes.data]
      .filter(item => item.type === "active")
      .filter(item => item.lavozimi !== "orinbosar" && item.lavozimi !== "bolim boshligi");

    // Big admins
    bigadmin.value = bigadminsRes.data.filter(item => item.type === "active");

    // Specific roles (orinbosar or bolim boshligi)
    const lavozimlar = ["orinbosar", "bolim boshligi"];
    two.value = yuristRes.data
      .filter(item => lavozimlar.includes(item.lavozimi))
      .filter(item => item.type === "active");

    // Yurists (not directly used in template, but fetched for completeness)
    yurist.value = yuristRes.data.filter(item => item.type === "active");

    // Yordamchi admins
    yordamchi.value = adminRes.data.filter(item => item.lavozimi === "yordamchi");

  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// Check if an admin is online based on lastSeen (within 5 minutes)
const checkIsOnline = (admin) => {
  if (!admin || !admin.lastSeen) return false;

  const lastSeenTime = new Date(admin.lastSeen).getTime();
  const currentTime = new Date().getTime();
  const timeDifference = (currentTime - lastSeenTime) / (1000 * 60); // Convert to minutes

  return timeDifference < 5;
};

// Get admin status (online/offline) and color
const getAdminStatus = (admin) => {
  if (!admin) return { status: t('adminCard.offlineStatus'), color: "text-gray-500" };

  const isOnline = checkIsOnline(admin);
  if (isOnline) {
    return { status: t('adminCard.onlineStatus'), color: "text-green-500" };
  } else if (admin.lastSeen) {
    return {
      status: `${formatDistanceToNow(new Date(admin.lastSeen), {
        addSuffix: true,
        locale: uz,
      })} tarmoqda edi`,
      color: "text-red-500",
    };
  } else {
    return { status: t('adminCard.offlineStatus'), color: "text-gray-500" };
  }
};

// Update online status based on server data
const updateOnlineStatus = (updatedAdmins) => {
  const allAdmins = [...admins.value, ...bigadmin.value, ...two.value, ...yordamchi.value];

  // Update lastSeen for each admin based on the server's response
  updatedAdmins.forEach(updatedAdmin => {
    const admin = allAdmins.find(a => a.id === updatedAdmin.id);
    if (admin) {
      admin.lastSeen = updatedAdmin.lastSeen;
    }
  });

  // Trigger reactivity
  admins.value = [...admins.value];
  bigadmin.value = [...bigadmin.value];
  two.value = [...two.value];
  yordamchi.value = [...yordamchi.value];
};

// Get image URL with fallback
const getImageUrl = (img) => {
  return img ? `${URL}/upload/${img}` : "/default-avatar.png";
};

// Lifecycle hooks
onMounted(() => {
  getData();

  // Socket.IO event listeners
  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
    socket.emit("getOnlineAdmins"); // Request initial online admins
  });

  socket.on("onlineAdmins", (adminsData) => {
    console.log("Initial admins data received:", adminsData);
    updateOnlineStatus(adminsData); // Update with initial data
  });

  socket.on("adminOnlineUpdate", (adminsData) => {
    console.log("Admin online status updated:", adminsData);
    updateOnlineStatus(adminsData); // Update with real-time data
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });

  // Periodic refresh as a fallback
  const interval = setInterval(() => {
    socket.emit("getOnlineAdmins"); // Request latest admin data
  }, 60000); // Every minute

  // Cleanup on unmount
  onUnmounted(() => {
    clearInterval(interval);
    socket.off("onlineAdmins");
    socket.off("adminOnlineUpdate");
    socket.off("disconnect");
    socket.disconnect();
    console.log("Component unmounted, socket disconnected");
  });
});
</script>