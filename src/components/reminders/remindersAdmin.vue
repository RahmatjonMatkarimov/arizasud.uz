<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800 transition-all duration-500">
    <!-- Main Container -->
    <div class="max-w-7xl mx-auto px-6 py-8">
      <!-- Hero Section -->
      <div class="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 dark:from-blue-800 dark:via-purple-800 dark:to-indigo-900 shadow-2xl shadow-blue-500/20 dark:shadow-blue-900/30">
        <div class="absolute inset-0 bg-black/10 dark:bg-white/5"></div>
        <div class="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-48 translate-x-48 blur-3xl"></div>
        <div class="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full translate-y-48 -translate-x-48 blur-3xl"></div>
        
        <div class="relative px-8 py-12">
          <div class="flex justify-between items-center">
            <div class="max-w-2xl">
              <h2 class="text-4xl font-bold text-white mb-4 leading-tight">
                {{ dat === "datakril" ? translateText("Ishchilarning Ishlar Ro'yxati") : "Ishchilarning Ishlar Ro'yxati" }}
              </h2>
              <p class="text-xl text-blue-100 dark:text-blue-200 font-medium">
                {{ dat === "datakril" ? translateText("Barcha bajarilgan ishlar ro'yxati") : "Barcha bajarilgan ishlar ro'yxati" }}
              </p>
            </div>
            <div class="text-center">
              <div class="bg-white/20 dark:bg-white/10 backdrop-blur-lg rounded-3xl px-8 py-6 border border-white/20">
                <div class="text-4xl font-bold text-white mb-2">{{ data.length }}</div>
                <div class="text-lg text-blue-100 dark:text-blue-200 font-medium">
                  {{ dat === "datakril" ? translateText("ta ish") : "ta ish" }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Control Panel -->
      <div class="mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl shadow-gray-200/20 dark:shadow-gray-900/30 border border-gray-200/50 dark:border-gray-700/50">
        <div class="p-6">
          <div class="flex flex-col lg:flex-row gap-6">
            <!-- Search Input -->
            <div class="flex-1 relative group">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-gray-400 dark:text-gray-500 group-focus-within:text-blue-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <input v-model="searchTerm" type="text" :placeholder="dat === 'datakril' ? translateText('Ishlarni qidirish...') : 'Ishlarni qidirish...'" 
                class="w-full pl-12 pr-6 py-4 bg-gray-50/80 dark:bg-gray-700/80 border border-gray-200/80 dark:border-gray-600/80 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 focus:border-transparent transition-all duration-300 text-lg font-medium backdrop-blur-sm" />
            </div>
            
            <!-- Sort Dropdown -->
            <div class="relative">
              <select v-model="sortBy" class="appearance-none bg-gray-50/80 dark:bg-gray-700/80 border border-gray-200/80 dark:border-gray-600/80 rounded-2xl px-6 py-4 pr-12 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 focus:border-transparent transition-all duration-300 text-lg font-medium backdrop-blur-sm cursor-pointer">
                <option value="newest">{{ dat === "datakril" ? translateText("Yangisidan eskisiga") : "Yangisidan eskisiga" }}</option>
                <option value="oldest">{{ dat === "datakril" ? translateText("Eskisidan yangisiga") : "Eskisidan yangisiga" }}</option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <svg class="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Content Area -->
      <div class="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-3xl shadow-2xl shadow-gray-200/20 dark:shadow-gray-900/40 border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
        <!-- Empty State -->
        <div v-if="filteredData.length === 0 && !isLoading" class="text-center py-20 px-8">
          <div class="relative mb-8">
            <div class="w-32 h-32 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center shadow-xl">
              <svg class="w-16 h-16 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
            </div>
            <div class="absolute top-4 right-1/3 w-4 h-4 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 0s"></div>
            <div class="absolute top-8 left-1/3 w-3 h-3 bg-purple-500 rounded-full animate-bounce" style="animation-delay: 0.5s"></div>
            <div class="absolute bottom-8 right-1/4 w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style="animation-delay: 1s"></div>
          </div>
          <h3 class="text-3xl font-bold text-gray-600 dark:text-gray-300 mb-4">
            {{ dat === "datakril" ? translateText("Hali bajarilgan ishlar yo'q") : "Hali bajarilgan ishlar yo'q" }}
          </h3>
          <p class="text-xl text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            {{ dat === "datakril" ? translateText("Bajarilgan ishlar bu yerda ko'rsatiladi") : "Bajarilgan ishlar bu yerda ko'rsatiladi" }}
          </p>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="p-8 space-y-6">
          <div v-for="i in 3" :key="i" class="animate-pulse">
            <div class="flex items-center space-x-6 p-8 bg-gradient-to-r from-gray-100/80 to-gray-50/80 dark:from-gray-700/80 dark:to-gray-800/80 rounded-2xl border border-gray-200/50 dark:border-gray-600/50">
              <div class="w-20 h-20 bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 rounded-2xl"></div>
              <div class="flex-1 space-y-4">
                <div class="h-6 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 rounded-lg w-3/4"></div>
                <div class="h-4 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 rounded w-1/2"></div>
                <div class="h-4 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Work Log Cards -->
        <div v-else class="p-8 space-y-6">
          <div v-for="workLog in filteredData" :key="workLog.id" 
            class="group relative bg-gradient-to-r from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50 rounded-3xl shadow-lg hover:shadow-2xl border border-gray-200/60 dark:border-gray-700/60 transition-all duration-500 cursor-pointer transform hover:-translate-y-2 hover:scale-[1.02] overflow-hidden"
            @click="toggleActive(workLog)">
            
            <!-- Hover Gradient Overlay -->
            <div class="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 dark:from-blue-400/10 dark:to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div class="relative p-8">
              <div class="flex items-start space-x-6">
                <!-- Enhanced User Avatar -->
                <div class="relative flex-shrink-0">
                  <div class="relative">
                    <img :src="'https://backend.arizasud.uz/upload/' + workLog.user.img" 
                      :alt="workLog.user.name"
                      class="w-20 h-20 rounded-2xl object-cover border-4 border-white dark:border-gray-700 shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-500" />
                    <div class="absolute inset-0 rounded-2xl bg-gradient-to-tr from-transparent via-white/10 to-white/30 dark:from-transparent dark:via-white/5 dark:to-white/10"></div>
                  </div>
                  <div class="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl border-4 border-white dark:border-gray-800 flex items-center justify-center shadow-lg transform group-hover:scale-125 transition-transform duration-300">
                    <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                    </svg>
                  </div>
                </div>

                <!-- Enhanced Content -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between mb-4">
                    <div>
                      <h3 class="text-2xl font-bold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 mb-2">
                       {{ dat === 'datakril' ? translateText(`${workLog.user.name} ${workLog.user.surname}`):`${workLog.user.name} ${workLog.user.surname}` }}
                      </h3>
                      <div class="flex items-center space-x-3">
                        <span class="inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 dark:from-green-900/50 dark:to-emerald-900/50 dark:text-green-300 shadow-lg">
                          <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                          </svg>
                          {{ dat === "datakril" ? translateText("Tugallangan") : "Tugallangan" }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div class="bg-gray-50/80 dark:bg-gray-700/50 rounded-2xl p-6 mb-6 border border-gray-200/50 dark:border-gray-600/50">
                    <p class="text-lg text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                      {{ dat === "datakril" ? translateText(workLog.comment) : workLog.comment }}
                    </p>
                  </div>

                  <div class="flex flex-wrap items-center gap-6">
                    <div class="flex items-center space-x-3 text-gray-500 dark:text-gray-400">
                      <div class="p-2 bg-blue-100/80 dark:bg-blue-900/30 rounded-xl">
                        <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                      <div>
                        <span class="text-sm font-medium">
                          {{ dat === "datakril" ? translateText("Қайд этилган:") : "Qayd etilgan:" }}
                        </span>
                        <div class="text-lg font-bold text-gray-700 dark:text-gray-200">
                          {{ formatDate(workLog.createdAt) }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced Success Toast -->
    <div v-if="showToast" 
      class="fixed bottom-8 right-8 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-2xl shadow-2xl transform transition-all duration-500 z-50 border border-green-400/20"
      :class="{ 'translate-y-0 opacity-100 scale-100': showToast, 'translate-y-full opacity-0 scale-95': !showToast }">
      <div class="flex items-center space-x-4">
        <div class="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
          </svg>
        </div>
        <span class="text-lg font-bold">
          {{ dat === "datakril" ? translateText("Muvaffaqiyatli yangilandi!") : "Muvaffaqiyatli yangilandi!" }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed, onUnmounted } from "vue";
import axios from "axios";
import { URL } from "@/auth/url";
import translateText from "@/auth/Translate";

export default {
  setup() {
    const userId = parseInt(localStorage.getItem("id")) || null;
    const data = ref([]);
    const dat = ref(localStorage.getItem("til") || "datalotin");
    const searchTerm = ref("");
    const sortBy = ref("newest");
    const isLoading = ref(true);
    const showToast = ref(false);
    const isDark = ref(
      localStorage.getItem("theme") === "dark" ||
        (!localStorage.getItem("theme") &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
    );

    let intervalId = null;

    // Theme Management
    const toggleTheme = () => {
      isDark.value = !isDark.value;
      localStorage.setItem("theme", isDark.value ? "dark" : "light");
      updateTheme();
    };

    const updateTheme = () => {
      if (isDark.value) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };

    // Language Check
    const checkLanguageChange = () => {
      const currentLang = localStorage.getItem("til") || "datalotin";
      if (currentLang !== dat.value) {
        dat.value = currentLang;
      }
    };

    // Filtered and Sorted Data
    const filteredData = computed(() => {
      let filtered = data.value;

      // Search filter
      if (searchTerm.value) {
        filtered = filtered.filter(
          (workLog) =>
            workLog.comment.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
            `${workLog.user.name} ${workLog.user.surname}`
              .toLowerCase()
              .includes(searchTerm.value.toLowerCase())
        );
      }

      // Sort
      filtered.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return sortBy.value === "newest" ? dateB - dateA : dateA - dateB;
      });

      return filtered;
    });

    // API Functions
    const fetchWorkLogs = async () => {
      try {
        isLoading.value = true;
        const response = await axios.get(`${URL}/reminders`);
        data.value = response.data.filter((workLog) => workLog.isActive === false);
      } catch (error) {
        console.error(
          dat.value === "datakril"
            ? "Ишлар рўйхатини олишда хатолик:"
            : "Ishlar ro'yxatini olishda xatolik:",
          error
        );
        alert(
          dat.value === "datakril"
            ? "Ишлар рўйхатини юклашда хатолик юз берди."
            : "Ishlar ro'yxatini yuklashda xatolik yuz berdi."
        );
      } finally {
        isLoading.value = false;
      }
    };

    const toggleActive = async (workLog) => {
      try {
        const response = await axios.put(`${URL}/reminders/${workLog.id}`, {
          isActive: true,
        });
        showToast.value = true;
        setTimeout(() => (showToast.value = false), 3000);
        await fetchWorkLogs();
      } catch (error) {
        console.error(
          dat.value === "datakril"
            ? "Статусни ўзгартиришда хатолик:"
            : "Statusni o'zgartirishda xatolik:",
          error
        );
        alert(
          dat.value === "datakril"
            ? "Статусни ўзгартиришда хатолик юз берди."
            : "Statusni o'zgartirishda xatolik yuz berdi."
        );
      }
    };

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");

      return `${day}.${month}.${year}  ${hours}:${minutes}`;
    };

    // Lifecycle
    onMounted(async () => {
      updateTheme();
      intervalId = setInterval(checkLanguageChange, 100);

      if (!userId) {
        console.warn(
          dat.value === "datakril"
            ? "localStorage'да фойдаланувчи ID топилмади"
            : "localStorage'da foydalanuvchi ID topilmadi"
        );
        alert(
          dat.value === "datakril"
            ? "Илтимос, тизимга киринг."
            : "Iltimos, tizimga kiring."
        );
        return;
      }
      await fetchWorkLogs();
    });

    onUnmounted(() => {
      if (intervalId) clearInterval(intervalId);
    });

    return {
      data,
      dat,
      searchTerm,
      sortBy,
      isLoading,
      showToast,
      isDark,
      filteredData,
      formatDate,
      toggleActive,
      toggleTheme,
      translateText,
    };
  },
};
</script>