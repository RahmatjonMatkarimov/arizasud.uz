<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 dark:from-gray-900 dark:via-gray-800 dark:to-black p-6 transition-all duration-300"
  >
    <!-- Header -->
    <div class="mb-8">
      <div class="text-center mb-8">
        <h1
          class="flex items-center justify-center gap-3 text-4xl font-bold dark:text-white mb-2"
        >
          <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
            />
          </svg>
          {{
            dat === "datakril"
              ? translateText("Adminlar Ruxsatlari")
              : "Adminlar Ruxsatlari"
          }}
        </h1>
        <p class="dark:text-white/80 text-lg max-w-2xl mx-auto">
          {{
            dat === "datakril"
              ? translateText(
                  "Bu bo'limda adminlar va boshqa foydalanuvchilarning ruxsatlarini boshqarishingiz mumkin."
                )
              : "Bu bo'limda adminlar va boshqa foydalanuvchilarning ruxsatlarini boshqarishingiz mumkin."
          }}
        </p>
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <div
          class="bg-white/10 dark:bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 border border-white/20 dark:border-gray-700/50 hover:transform hover:-translate-y-1 transition-all duration-300"
        >
          <div class="flex items-center gap-4">
            <div
              class="w-12 h-12 bg-blue-500/20 dark:bg-blue-400/20 rounded-xl flex items-center justify-center"
            >
              <svg
                class="w-6 h-6 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div>
              <div class="text-2xl font-bold dark:text-white">{{ admins.length }}</div>
              <div class="dark:text-white/70 dark:text-gray-300 text-sm font-medium">
                {{
                  dat === "datakril"
                    ? translateText("Jami foydalanuvchilar")
                    : "Jami foydalanuvchilar"
                }}
              </div>
            </div>
          </div>
        </div>

        <div
          class="bg-white/10 dark:bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 border border-white/20 dark:border-gray-700/50 hover:transform hover:-translate-y-1 transition-all duration-300"
        >
          <div class="flex items-center gap-4">
            <div
              class="w-12 h-12 bg-green-500/20 dark:bg-green-400/20 rounded-xl flex items-center justify-center"
            >
              <svg
                class="w-6 h-6 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <div class="text-2xl font-bold dark:text-white">{{ allowedCount }}</div>
              <div class="dark:text-white/70 dark:text-gray-300 text-sm font-medium">
                {{
                  dat === "datakril"
                    ? translateText("Ruxsat berilgan")
                    : "Ruxsat berilgan"
                }}
              </div>
            </div>
          </div>
        </div>

        <div
          class="bg-white/10 dark:bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 border border-white/20 dark:border-gray-700/50 hover:transform hover:-translate-y-1 transition-all duration-300"
        >
          <div class="flex items-center gap-4">
            <div
              class="w-12 h-12 bg-red-500/20 dark:bg-red-400/20 rounded-xl flex items-center justify-center"
            >
              <svg
                class="w-6 h-6 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <div class="text-2xl font-bold dark:text-white">{{ blockedCount }}</div>
              <div class="dark:text-white/70 dark:text-gray-300 text-sm font-medium">
                {{ dat === "datakril" ? translateText("Bloklangan") : "Bloklangan" }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Search and Filter Section -->
    <div
      class="bg-white/10 dark:bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20 dark:border-gray-700/50"
    >
      <div class="flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div class="flex-1 w-full lg:w-auto">
          <div class="relative">
            <svg
              class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              :placeholder="
                dat === 'datakril'
                  ? translateText('Ism, familiya yoki lavozim bo\'yicha qidirish...')
                  : 'Ism, familiya yoki lavozim bo\'yicha qidirish...'
              "
              class="w-full pl-12 pr-12 py-3 placeholder-black border-black bg-white/20 dark:bg-gray-700/50 border dark:border-gray-600/50 rounded-xl dark:text-white placeholder-white/60 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            />
            <button
              v-if="searchQuery"
              @click="searchQuery = ''"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white/20 dark:bg-gray-600/50 rounded-full flex items-center justify-center hover:bg-white/30 dark:hover:bg-gray-600/70 transition-colors duration-200"
            >
              <svg
                class="w-4 h-4 dark:text-white/70 dark:text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div class="flex gap-2">
          <button
            @click="filterStatus = 'all'"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-all duration-300',
              filterStatus === 'all'
                ? 'bg-white text-blue-600 dark:bg-gray-100 dark:text-gray-900 shadow-lg'
                : 'bg-white/20 dark:bg-gray-700/50 dark:text-white/80 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-gray-700/70',
            ]"
          >
            {{ dat === "datakril" ? translateText("Barchasi") : "Barchasi" }}
          </button>
          <button
            @click="filterStatus = 'allowed'"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-all duration-300',
              filterStatus === 'allowed'
                ? 'bg-white text-green-600 dark:bg-gray-100 dark:text-gray-900 shadow-lg'
                : 'bg-white/20 dark:bg-gray-700/50 dark:text-white/80 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-gray-700/70',
            ]"
          >
            {{
              dat === "datakril" ? translateText("Ruxsat berilgan") : "Ruxsat berilgan"
            }}
          </button>
          <button
            @click="filterStatus = 'blocked'"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-all duration-300',
              filterStatus === 'blocked'
                ? 'bg-white text-red-600 dark:bg-gray-100 dark:text-gray-900 shadow-lg'
                : 'bg-white/20 dark:bg-gray-700/50 dark:text-white/80 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-gray-700/70',
            ]"
          >
            {{ dat === "datakril" ? translateText("Bloklangan") : "Bloklangan" }}
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div
      v-if="isLoading"
      class="flex flex-col items-center justify-center py-16 bg-white/10 dark:bg-gray-800/30 backdrop-blur-lg rounded-2xl border border-white/20 dark:border-gray-700/50"
    >
      <div
        class="w-12 h-12 border-4 border-white/30 dark:border-gray-600/30 border-t-white dark:border-t-gray-300 rounded-full animate-spin mb-4"
      ></div>
      <p class="dark:text-white/80 dark:text-gray-300 text-lg font-medium">
        {{
          dat === "datakril"
            ? translateText("Ma'lumotlar yuklanmoqda...")
            : "Ma'lumotlar yuklanmoqda..."
        }}
      </p>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="filteredAdmins.length === 0"
      class="text-center py-16 bg-white/10 dark:bg-gray-800/30 backdrop-blur-lg rounded-2xl border border-white/20 dark:border-gray-700/50"
    >
      <svg
        class="w-16 h-16 dark:text-white/50 dark:text-gray-500 mx-auto mb-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
      <h3 class="text-xl font-semibold dark:text-white mb-2">
        {{
          dat === "datakril"
            ? translateText("Hech qanday foydalanuvchi topilmadi")
            : "Hech qanday foydalanuvchi topilmadi"
        }}
      </h3>
      <p class="dark:text-white/70 dark:text-gray-400">
        {{
          dat === "datakril"
            ? translateText(
                "Qidiruv shartlaringizni o'zgartiring yoki filterni bekor qiling"
              )
            : "Qidiruv shartlaringizni o'zgartiring yoki filterni bekor qiling"
        }}
      </p>
    </div>

    <!-- Admin List -->
    <div v-else class="space-y-4">
      <div
        v-for="admin in filteredAdmins"
        :key="admin.id"
        :class="[
          'bg-gray-300 dark:bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 border transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-xl',
          admin.isAllowed
            ? 'border-l-4 border-l-green-400 border-white/20 dark:border-gray-700/50'
            : 'border-l-4 border-l-red-400 border-white/20 dark:border-gray-700/50',
        ]"
      >
        <div
          class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
        >
          <div class="flex items-center gap-4 flex-1">
            <div
              class="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500 rounded-full flex items-center justify-center dark:text-white font-semibold text-lg"
            >
              {{ getInitials(admin.name, admin.surname) }}
            </div>

            <div class="flex-1">
              <h3 class="text-xl font-semibold dark:text-white mb-1">
                {{
                  dat === "datakril"
                    ? translateText(admin.name + " " + admin.surname)
                    : admin.name + " " + admin.surname
                }}
              </h3>
              <div class="flex items-center gap-2 dark:text-white/70 dark:text-gray-400">
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 002 2M8 6v2a2 2 0 002 2m0 0h4m-4 0a2 2 0 01-2-2V8a2 2 0 012-2h4a2 2 0 012 2v2a2 2 0 01-2 2"
                  />
                </svg>
                {{ dat === "datakril" ? translateText(admin.lavozimi) : admin.lavozimi }}
              </div>
            </div>
          </div>

          <div class="flex items-center gap-4 w-full lg:w-auto">
            <div
              :class="[
                'flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium',
                admin.isAllowed
                  ? 'bg-green-500/20 dark:bg-green-400/20 text-green-800 dark:text-green-400'
                  : 'bg-red-500/20 dark:bg-red-400/20 text-red-800 dark:text-red-400',
              ]"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  v-if="admin.isAllowed"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
                <path
                  v-else
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {{
                admin.isAllowed
                  ? dat === "datakril"
                    ? translateText("Ruxsat berilgan")
                    : "Ruxsat berilgan"
                  : dat === "datakril"
                  ? translateText("Bloklangan")
                  : "Bloklangan"
              }}
            </div>

            <label
              :class="[
                'relative inline-flex items-center cursor-pointer',
                processingAdmin === admin.id ? 'opacity-50 cursor-not-allowed' : '',
              ]"
            >
              <input
                type="checkbox"
                :checked="admin.isAllowed"
                @change="() => toggleAdminAccess(admin)"
                :disabled="processingAdmin === admin.id"
                class="sr-only peer"
              />
              <div
                class="relative w-14 h-7 bg-white/20 dark:bg-gray-600/50 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/30 dark:peer-focus:ring-blue-800/30 rounded-full peer peer-checked:after:translate-x-7 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500 dark:peer-checked:bg-green-600 after:flex after:items-center after:justify-center"
              >
                <div class="absolute inset-0 flex items-center justify-center">
                  <svg
                    v-if="processingAdmin === admin.id"
                    class="w-3 h-3 text-gray-400 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watchEffect, inject, computed } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import { URL } from "@/auth/url.js";
import { onUnmounted } from "vue";
import translateText from "@/auth/Translate";
import { da } from "date-fns/locale";

const isLoading = inject("isLoading");
const route = useRoute();
const id = ref(null);
const admins = ref([]);
const allowedUsers = ref([]);
const selectedAdminId = ref(null);
const processingAdmin = ref(null);
const searchQuery = ref("");
const filterStatus = ref("all");

const dat = ref(localStorage.getItem("til") || "datalotin");
// Notification system
const notification = ref({
  show: false,
  type: "success",
  message: "",
});

// Computed properties
const allowedCount = computed(
  () => admins.value.filter((admin) => admin.isAllowed).length
);
const blockedCount = computed(
  () => admins.value.filter((admin) => !admin.isAllowed).length
);

const filteredAdmins = computed(() => {
  let filtered = admins.value;

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (admin) =>
        admin.name.toLowerCase().includes(query) ||
        admin.surname.toLowerCase().includes(query) ||
        admin.lavozimi.toLowerCase().includes(query)
    );
  }

  // Status filter
  if (filterStatus.value === "allowed") {
    filtered = filtered.filter((admin) => admin.isAllowed);
  } else if (filterStatus.value === "blocked") {
    filtered = filtered.filter((admin) => !admin.isAllowed);
  }

  return filtered;
});

// Helper functions
const getInitials = (name, surname) => {
  return (name?.charAt(0) || "") + (surname?.charAt(0) || "");
};

const showNotification = (type, message) => {
  notification.value = { show: true, type, message };
  setTimeout(() => {
    hideNotification();
  }, 5000);
};

const hideNotification = () => {
  notification.value.show = false;
};

// API functions
const getAdminsAndOthers = async () => {
  isLoading.value = true;
  try {
    const res = await axios.get(`${URL}/deliverer/allUsers`);
    admins.value = res.data.filter((user) => user.role !== "bigAdmin");
    updateAdminStatuses();
  } catch (error) {
    console.error("Xatolik (getAdminsAndOthers):", error);
    showNotification("error", "Ma'lumotlarni yuklashda xatolik yuz berdi");
  } finally {
    isLoading.value = false;
  }
};

const getAllowedUsers = async (courtId) => {
  isLoading.value = true;
  try {
    const response = await axios.get(`${URL}/allowed-users/${courtId}`);
    allowedUsers.value = response.data;
    updateAdminStatuses();
  } catch (error) {
    console.error("Xatolik (getAllowedUsers):", error);
    showNotification("error", "Ruxsatlar ro'yxatini yuklashda xatolik");
  } finally {
    isLoading.value = false;
  }
};

const updateAdminStatuses = () => {
  admins.value.forEach((admin) => {
    admin.isAllowed = allowedUsers.value.some((user) => user.userId === admin.id);
  });
};

const addUserToAllowed = async (adminId) => {
  isLoading.value = true;
  try {
    await axios.post(`${URL}/allowed-users/${id.value}/${adminId}`);
    await getAllowedUsers(id.value);
    showNotification("success", "Foydalanuvchiga ruxsat berildi");
  } catch (error) {
    console.error("Xatolik (addUserToAllowed):", error);
    showNotification("error", "Ruxsat berishda xatolik yuz berdi");
    throw error;
  } finally {
    isLoading.value = false;
  }
};

const removeUserFromAllowed = async (adminId) => {
  isLoading.value = true;
  try {
    await axios.delete(`${URL}/allowed-users/${id.value}/${adminId}`);
    await getAllowedUsers(id.value);
    showNotification("success", "Foydalanuvchi bloklandi");
  } catch (error) {
    console.error("Xatolik (removeUserFromAllowed):", error);
    showNotification("error", "Bloklashda xatolik yuz berdi");
    throw error;
  } finally {
    isLoading.value = false;
  }
};

const toggleAdminAccess = async (admin) => {
  processingAdmin.value = admin.id;
  isLoading.value = true;
  try {
    if (admin.isAllowed) {
      await removeUserFromAllowed(admin.id);
    } else {
      await addUserToAllowed(admin.id);
    }
  } catch (error) {
    console.error("Xatolik (toggleAdminAccess):", error);
  } finally {
    processingAdmin.value = null;
    isLoading.value = false;
  }
};

// Lifecycle
onMounted(() => {
  id.value = route.params.id;
  if (id.value) {
    getAdminsAndOthers();
    getAllowedUsers(id.value);
  }
});

watchEffect(() => {
  if (route.params.id && route.params.id !== id.value) {
    id.value = route.params.id;
    getAdminsAndOthers();
    getAllowedUsers(id.value);
  }
});
</script>
