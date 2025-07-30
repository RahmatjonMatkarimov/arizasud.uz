```vue
<template>
  <div :class="{ dark: isDark }" class="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
    <div class="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <!-- Header -->
      <div class="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h2 class="text-3xl font-bold text-gray-800 dark:text-white">
            {{ translateText("Mijoz Bo'limlari") }}
          </h2>
          <p class="mt-1 text-gray-600 dark:text-gray-400">
            {{ translateText("Mijoz Ma'lumotlari") }}
          </p>
        </div>
        <button @click="loadSections"
          class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-300">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {{ translateText("Yangilash") }}
        </button>
      </div>

      <!-- Success/Error Messages -->
      <div v-if="message" class="mb-6">
        <div :class="{
          'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700 text-green-800 dark:text-green-200': messageType === 'success',
          'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700 text-red-800 dark:text-red-200': messageType === 'error',
        }" class="border rounded-xl p-4 shadow-sm transition-all duration-300">
          {{ translateText(message) }}
        </div>
      </div>

      <!-- Applications and Sections -->
      <div class="p-6">

        <div v-if="sectionsLoading" class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p class="text-gray-600 dark:text-gray-300">{{ translateText("Yuklanmoqda...") }}</p>
        </div>

        <div v-else-if="applications.length === 0" class="text-center py-12">
          <svg class="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p class="text-gray-500 dark:text-gray-400 text-lg">
            {{ translateText("Hozircha bo'limlar yo'q") }}
          </p>
        </div>

        <div v-else>
          <div v-for="application in applications" :key="application.id" class="mb-10 bg-gray-600 p-5 pb-10 rounded-lg relative">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <div class="flex items-center gap-3">
                <h4 class="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  {{ translateText(application.purpose) }}
                </h4>

              </div>
              <div class="flex gap-2">
                <button @click="openAddModal(application.id)"
                  class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-300">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  {{ translateText("Yangi Bo'lim") }}
                </button>
                <button v-if="application.status !== 'completed'" @click="openStatusModal(application)"
                  class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-300">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                  {{ translateText("Keyingi bosqichga o'tkazish") }}
                </button>
              </div>
            </div>
            <div v-if="application.Sections.length === 0" class="text-center py-6 text-gray-500 dark:text-gray-400">
              {{ translateText("Bu arizada bo'limlar yo'q") }}
            </div>
            <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <div v-for="section in application.Sections" :key="section.id"
                @click="$router.push('/customer-files/' + section.id)"
                class="group relative bg-gray-50 dark:bg-gray-700 rounded-xl p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-600 cursor-pointer">
                <div class="flex flex-col items-center text-center">
                  <div :class="{
                    'folder-icon-accepted': application.status === 'accepted',
                    'folder-icon-waiting': application.status === 'waiting',
                    'folder-icon-completed': application.status === 'completed',
                  }" class="mb-3">
                    <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z" />
                    </svg>
                  </div>
                  <h4 class="font-semibold text-gray-900 dark:text-white text-lg mb-1">
                    {{ translateText(section.name) }}
                  </h4>
                  <p v-if="section.createdAt" class="text-xs text-gray-500 dark:text-gray-400">
                    {{ formatDateShort(section.createdAt) }}
                  </p>
                </div>
                <div class="absolute top-4 right-4">
                  <div class="relative">
                    <button @click.stop="toggleActionMenu(section.id)"
                      class="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-300 text-gray-600 dark:text-gray-300 opacity-0 group-hover:opacity-100">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                    <div v-if="activeMenuId === section.id"
                      class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 z-10">
                      <button @click.stop="editSection(section)"
                        class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center transition-colors duration-200">
                        <svg class="w-4 h-4 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        {{ translateText("Tahrirlash") }}
                      </button>
                      <button @click.stop="deleteSection(section.id)"
                        class="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center transition-colors duration-200 rounded-b-lg">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M19 7l-.867 12.142A2 2 0 01-16.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        {{ translateText("O'chirish") }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-4 text-sm text-gray-600 dark:text-gray-300 ">
              <p>{{ translateText(application.description) }}</p>
                <p :class="getEndDateColor(application.endDate)" class="mt-1 absolute bottom-[10px] right-4 text-end">
                  {{ translateText('Muddat') }}: {{ formatDateShort(application.endDate) }}
                </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Add Section Modal -->
      <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        @click.self="closeAddModal">
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-95"
          :class="{ 'scale-100': showAddModal }">
          <div class="p-6">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-2xl font-semibold text-gray-800 dark:text-white">
                {{ translateText("Yangi Bo'lim Qo'shish") }}
              </h3>
              <button @click="closeAddModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form @submit.prevent="submitSection">
              <div class="mb-6">
                <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ translateText("Bo'lim Nomi") }}
                </label>
                <input type="text" id="name" v-model="sectionData.name" required
                  :placeholder="translateText('Bo\'lim nomini kiriting')"
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300" />
              </div>
              <div class="flex gap-3 justify-end">
                <button type="button" @click="closeAddModal"
                  class="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-300">
                  {{ translateText("Bekor qilish") }}
                </button>
                <button type="submit" :disabled="loading"
                  class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300">
                  {{ loading ? translateText("Yuborilmoqda...") : translateText("Bo'lim Qo'shish") }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Edit Section Modal -->
      <div v-if="editingSection" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        @click.self="closeEditModal">
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-95"
          :class="{ 'scale-100': editingSection }">
          <div class="p-6">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-2xl font-semibold text-gray-800 dark:text-white">
                {{ translateText("Bo'lim Tahrirlash") }}
              </h3>
              <button @click="closeEditModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form @submit.prevent="updateSection">
              <div class="mb-6">
                <label for="editName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ translateText("Bo'lim Nomi") }}
                </label>
                <input type="text" id="editName" v-model="editingSection.name" required
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300" />
              </div>
              <div class="flex gap-3 justify-end">
                <button type="button" @click="closeEditModal"
                  class="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-300">
                  {{ translateText("Bekor qilish") }}
                </button>
                <button type="submit" :disabled="updateLoading"
                  class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300">
                  {{ updateLoading ? translateText("Saqlanmoqda...") : translateText("Saqlash") }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Status Update Modal -->
      <div v-if="showStatusModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        @click.self="closeStatusModal">
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-95"
          :class="{ 'scale-100': showStatusModal }">
          <div class="p-6">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-2xl font-semibold text-gray-800 dark:text-white">
                {{ translateText("Holatni Yangilash") }}
              </h3>
              <button @click="closeStatusModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p class="text-gray-600 dark:text-gray-300 mb-6">
              {{ translateText( "Mijozni keyingi bosqichga o'tkazishni tasdiqlaysizmi?") }}
            </p>
            <div class="flex gap-3 justify-end">
              <button @click="closeStatusModal"
                class="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-300">
                {{ translateText("Bekor qilish") }}
              </button>
              <button @click="updateCustomerStatus" :disabled="isSubmitting"
                class="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300">
                {{ isSubmitting ? translateText("Yuborilmoqda...") : translateText("Yangilash") }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { URL } from "@/auth/url";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import translateText from "@/auth/Translate copy";

const route = useRoute();
const customerId = ref(route.params.id);
const SelectedStatus = ref(route.params.status);

// Theme management
const isDark = ref(false);

// Modal states
const showAddModal = ref(false);
const showStatusModal = ref(false);
const activeMenuId = ref(null);
const selectedCustomerForStatus = ref(null);
const isSubmitting = ref(false);

// Reactive data
const sectionData = ref({
  name: "",
  customerId: customerId.value,
  applicationId: "",
});

const applications = ref([]);
const sections = ref([]); // Kept for backward compatibility
const loading = ref(false);
const sectionsLoading = ref(false);
const updateLoading = ref(false);
const message = ref("");
const messageType = ref("success");
const editingSection = ref(null);

// Theme toggle
const toggleTheme = () => {
  isDark.value = !isDark.value;
  localStorage.setItem("theme", isDark.value ? "dark" : "light");
};

// Modal management
const openAddModal = (applicationId = "") => {
  showAddModal.value = true;
  sectionData.value.applicationId = applicationId;
  activeMenuId.value = null;
};

const closeAddModal = () => {
  showAddModal.value = false;
  resetForm();
};

const openStatusModal = (application) => {
  selectedCustomerForStatus.value = application;
  showStatusModal.value = true;
};

const closeStatusModal = () => {
  showStatusModal.value = false;
  selectedCustomerForStatus.value = null;
};

const toggleActionMenu = (sectionId) => {
  activeMenuId.value = activeMenuId.value === sectionId ? null : sectionId;
};

// Compute end date color
const getEndDateColor = (endDate) => {
  if (!endDate) return "text-gray-600 dark:text-gray-400";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);
  const diffTime = end - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays <= 1) return "text-red-600 dark:text-red-400";
  if (diffDays <= 3) return "text-yellow-600 dark:text-yellow-400";
  return "text-green-600 dark:text-green-400";
};

// Backend functions
const submitSection = async () => {
  if (!sectionData.value.name.trim()) {
    showMessage(translateText("Bo'lim nomi kiritilishi kerak!"), "error");
    return;
  }
  if (!sectionData.value.applicationId) {
    showMessage(translateText("Ariza tanlanishi kerak!"), "error");
    return;
  }

  loading.value = true;
  message.value = "";

  try {
    const response = await fetch(URL + "/customer-sections", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: sectionData.value.name,
        applicationId: sectionData.value.applicationId,
      }),
    });

    if (response.ok) {
      showMessage(translateText("Bo'lim muvaffaqiyatli qo'shildi!"), "success");
      closeAddModal();
      await loadSections();
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message || translateText("Server xatosi"));
    }
  } catch (error) {
    console.error("Xato:", error);
    showMessage(
      error.message || translateText("Bo'lim qo'shishda xato yuz berdi!"),
      "error"
    );
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  sectionData.value.name = "";
  sectionData.value.applicationId = "";
};

const loadSections = async () => {
  sectionsLoading.value = true;
  try {
    const response = await fetch(URL + `/customers/${customerId.value}`);
    if (response.ok) {
      const res = await response.json();
      const allApplications = res.CustomerApplications || [];
      // Filter applications by status if SelectedStatus is provided
      applications.value = SelectedStatus.value
        ? allApplications.filter((app) => app.status === SelectedStatus.value)
        : allApplications;
      // Flatten sections for backward compatibility
      sections.value = applications.value.flatMap((app) => app.Sections || []);
    } else {
      throw new Error(translateText("Bo'limlarni yuklashda xato"));
    }
  } catch (error) {
    console.error("Bo'limlarni yuklashda xato:", error);
    showMessage(
      translateText("Bo'limlarni yuklashda xato yuz berdi!"),
      "error"
    );
  } finally {
    sectionsLoading.value = false;
  }
};

const editSection = (section) => {
  editingSection.value = {
    ...section,
    applicationId: findApplicationIdForSection(section.id),
  };
  activeMenuId.value = null;
};

const findApplicationIdForSection = (sectionId) => {
  for (const app of applications.value) {
    if (app.Sections.some((s) => s.id === sectionId)) {
      return app.id;
    }
  }
  return "";
};

const closeEditModal = () => {
  editingSection.value = null;
};

const updateSection = async () => {
  if (!editingSection.value.name.trim()) {
    showMessage(translateText("Bo'lim nomi kiritilishi kerak!"), "error");
    return;
  }
  if (!editingSection.value.applicationId) {
    showMessage(translateText("Ariza tanlanishi kerak!"), "error");
    return;
  }

  updateLoading.value = true;

  try {
    const response = await fetch(
      URL + `/customer-sections/${editingSection.value.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editingSection.value.name,
        }),
      }
    );

    if (response.ok) {
      showMessage(
        translateText("Bo'lim muvaffaqiyatli yangilandi!"),
        "success"
      );
      closeEditModal();
      await loadSections();
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message || translateText("Server xatosi"));
    }
  } catch (error) {
    console.error("Xato:", error);
    showMessage(
      error.message || translateText("Bo'lim yangilashda xato yuz berdi!"),
      "error"
    );
  } finally {
    updateLoading.value = false;
  }
};

const deleteSection = async (sectionId) => {
  activeMenuId.value = null;
  try {
    const response = await fetch(URL + `/customer-sections/${sectionId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      showMessage(
        translateText("Bo'lim muvaffaqiyatli o'chirildi!"),
        "success"
      );
      await loadSections();
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message || translateText("Server xatosi"));
    }
  } catch (error) {
    console.error("Xato:", error);
    showMessage(
      error.message || translateText("Bo'lim o'chirishda xato yuz berdi!"),
      "error"
    );
  }
};

const updateCustomerStatus = async () => {
  if (!selectedCustomerForStatus.value) return;
  isSubmitting.value = true;
  try {
    const newStatus =
      selectedCustomerForStatus.value.status === "accepted"
        ? "waiting"
        : selectedCustomerForStatus.value.status === "waiting"
        ? "completed"
        : "completed";
    await axios.put(
      `${URL}/customers/apllicationId/${selectedCustomerForStatus.value.id}`,
      { status: newStatus }
    );
    showMessage(translateText("Mijoz holati muvaffaqiyatli yangilandi!"), "success");
    await loadSections();
    closeStatusModal();
    setTimeout(() => {
      message.value = "";
    }, 5000);
  } catch (error) {
    console.error("Xato:", error);
    showMessage(
      error.message || translateText("Mijoz holatini yangilashda xatolik yuz berdi!"),
      "error"
    );
  } finally {
    isSubmitting.value = false;
  }
};

const showMessage = (text, type) => {
  message.value = text;
  messageType.value = type;
  setTimeout(() => {
    message.value = "";
  }, 5000);
};

const formatDateShort = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

// Initialize theme from localStorage
onMounted(() => {
  const savedTheme = localStorage.getItem("theme");
  isDark.value = savedTheme === "dark";
  loadSections();

  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".relative")) {
      activeMenuId.value = null;
    }
  });
});
</script>

<style scoped>
/* Folder icon styles */
.folder-icon-accepted {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 8px 16px -4px rgba(59, 130, 246, 0.3);
  transition: all 0.3s ease;
  position: relative;
}

.folder-icon-waiting {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #facc15, #d97706);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 8px 16px -4px rgba(250, 204, 21, 0.3);
  transition: all 0.3s ease;
  position: relative;
}

.folder-icon-completed {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #22c55e, #15803d);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 8px 16px -4px rgba(34, 197, 94, 0.3);
  transition: all 0.3s ease;
  position: relative;
}

.dark .folder-icon-accepted {
  background: linear-gradient(135deg, #60a5fa, #1e40af);
  box-shadow: 0 8px 16px -4px rgba(59, 130, 246, 0.4);
}

.dark .folder-icon-waiting {
  background: linear-gradient(135deg, #facc15, #b45309);
  box-shadow: 0 8px 16px -4px rgba(250, 204, 21, 0.4);
}

.dark .folder-icon-completed {
  background: linear-gradient(135deg, #22c55e, #15803d);
  box-shadow: 0 8px 16px -4px rgba(34, 197, 94, 0.4);
}

.group:hover .folder-icon-accepted,
.group:hover .folder-icon-waiting,
.group:hover .folder-icon-completed {
  transform: translateY(-2px);
  box-shadow: 0 12px 20px -4px rgba(0, 0, 0, 0.2);
}

.folder-icon-accepted::before,
.folder-icon-waiting::before,
.folder-icon-completed::before {
  content: "";
  position: absolute;
  top: -3px;
  left: 8px;
  right: 8px;
  height: 12px;
  background: linear-gradient(135deg, #93c5fd, #3b82f6);
  border-radius: 6px 6px 0 0;
  transform: perspective(20px) rotateX(15deg);
}

.dark .folder-icon-accepted::before {
  background: linear-gradient(135deg, #93c5fd, #60a5fa);
}

.dark .folder-icon-waiting::before {
  background: linear-gradient(135deg, #fef08a, #facc15);
}

.dark .folder-icon-completed::before {
  background: linear-gradient(135deg, #86efac, #22c55e);
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.dark ::-webkit-scrollbar-track {
  background: #374151;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.dark ::-webkit-scrollbar-thumb {
  background: #6b7280;
}

::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Animation for modal */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
```