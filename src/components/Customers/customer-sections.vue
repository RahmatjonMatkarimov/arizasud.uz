<template>
  <div
    :class="{ dark: isDark }"
    class="min-h-screen transition-colors duration-300"
  >
    <div
      class="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300"
    >
      <div class="max-w-6xl mx-auto p-6">
        <!-- Header with Theme Toggle -->
        <div class="mb-8 flex justify-between items-center">
          <div>
            <h2 class="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              {{ translateText("Mijoz Bo'limlari") }}
            </h2>
            <p class="text-gray-600 dark:text-gray-300">
              {{ translateText("Mijoz Ma'lumotlari") }}
            </p>
          </div>
          <div class="flex items-center gap-4">
            <!-- Add New Section Button -->
            <button
              @click="openAddModal"
              class="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <svg
                class="w-5 h-5 inline-block mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                ></path>
              </svg>
              {{ translateText("Yangi Bo'lim") }}
            </button>
          </div>
        </div>

        <!-- Success/Error Messages -->
        <div v-if="message" class="mb-6">
          <div
            :class="{
              'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 text-green-800 dark:text-green-300':
                messageType === 'success',
              'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700 text-red-800 dark:text-red-300':
                messageType === 'error',
            }"
            class="border rounded-xl p-4 transition-all duration-300"
          >
            {{ translateText(message) }}
          </div>
        </div>

        <!-- Sections Grid -->
        <div
          class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors duration-300"
        >
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-semibold text-gray-800 dark:text-white">
              {{ translateText("Mavjud Bo'limlar") }}
            </h3>
            <button
              @click="loadSections"
              class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              <svg
                class="w-4 h-4 inline-block mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                ></path>
              </svg>
              {{ translateText("Yangilash") }}
            </button>
          </div>

          <div v-if="sectionsLoading" class="text-center py-12">
            <div
              class="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"
            ></div>
            <p class="text-gray-600 dark:text-gray-300">
              {{ translateText("Yuklanmoqda...") }}
            </p>
          </div>

          <div v-else-if="sections.length === 0" class="text-center py-12">
            <svg
              class="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              ></path>
            </svg>
            <p class="text-gray-500 dark:text-gray-400 text-lg">
              {{ translateText("Hozircha bo'limlar yo'q") }}
            </p>
          </div>

          <div
            v-else
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <div
              v-for="section in sections"
              :key="section.id"
              @click="$router.push('/customer-files/' + section.id)"
              class="group relative bg-gray-50 dark:bg-gray-700 rounded-xl p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-600"
            >
              <!-- Folder Icon -->
              <div class="flex flex-col items-center text-center mb-4">
                <div class="folder-icon mb-3">
                  <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z"
                    />
                  </svg>
                </div>
                <h4
                  class="font-semibold text-gray-900 dark:text-white text-lg mb-2"
                >
                  {{ translateText(section.name) }}
                </h4>
                <p
                  v-if="section.createdAt"
                  class="text-xs text-gray-500 dark:text-gray-400"
                >
                  {{ formatDateShort(section.createdAt) }}
                </p>
              </div>

              <!-- Actions Menu -->
              <div class="absolute top-4 right-4">
                <div class="relative">
                  <button
                    @click.stop="toggleActionMenu(section.id)"
                    class="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-300 text-gray-600 dark:text-gray-300 opacity-0 group-hover:opacity-100"
                  >
                    <svg
                      class="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                      ></path>
                    </svg>
                  </button>

                  <!-- Dropdown Menu -->
                  <div
                    v-if="activeMenuId === section.id"
                    class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 z-10"
                  >
                    <button
                      @click.stop="editSection(section)"
                      class="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center transition-colors duration-200"
                    >
                      <svg
                        class="w-4 h-4 mr-3 text-yellow-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        ></path>
                      </svg>
                      {{ translateText("Tahrirlash") }}
                    </button>
                    <button
                      @click.stop="deleteSection(section.id)"
                      class="w-full text-left px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center transition-colors duration-200 rounded-b-lg"
                    >
                      <svg
                        class="w-4 h-4 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 01-16.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        ></path>
                      </svg>
                      {{ translateText("O'chirish") }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Add Section Modal -->
        <div
          v-if="showAddModal"
          class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          @click.self="closeAddModal"
        >
          <div
            class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300"
          >
            <div class="p-6">
              <div class="flex justify-between items-center mb-6">
                <h3
                  class="text-2xl font-semibold text-gray-800 dark:text-white"
                >
                  {{ translateText("Yangi Bo'lim Qo'shish") }}
                </h3>
                <button
                  @click="closeAddModal"
                  class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  <svg
                    class="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>

              <form @submit.prevent="submitSection">
                <div class="mb-6">
                  <label
                    for="name"
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    {{ translateText("Bo'lim Nomi") }}
                  </label>
                  <input
                    type="text"
                    id="name"
                    v-model="sectionData.name"
                    required
                    :placeholder="translateText('Bo\'lim nomini kiriting')"
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                  />
                </div>

                <div class="flex gap-3 justify-end">
                  <button
                    type="button"
                    @click="closeAddModal"
                    class="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-300"
                  >
                    {{ translateText("Bekor qilish") }}
                  </button>
                  <button
                    type="submit"
                    :disabled="loading"
                    class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300"
                  >
                    {{
                      loading
                        ? translateText("Yuborilmoqda...")
                        : translateText("Bo'lim Qo'shish")
                    }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Edit Modal -->
        <div
          v-if="editingSection"
          class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          @click.self="closeEditModal"
        >
          <div
            class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300"
          >
            <div class="p-6">
              <div class="flex justify-between items-center mb-6">
                <h3
                  class="text-2xl font-semibold text-gray-800 dark:text-white"
                >
                  {{ translateText("Bo'lim Tahrirlash") }}
                </h3>
                <button
                  @click="closeEditModal"
                  class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  <svg
                    class="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>

              <form @submit.prevent="updateSection">
                <div class="mb-6">
                  <label
                    for="editName"
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    {{ translateText("Bo'lim Nomi") }}
                  </label>
                  <input
                    type="text"
                    id="editName"
                    v-model="editingSection.name"
                    required
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                  />
                </div>

                <div class="flex gap-3 justify-end">
                  <button
                    type="button"
                    @click="closeEditModal"
                    class="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-300"
                  >
                    {{ translateText("Bekor qilish") }}
                  </button>
                  <button
                    type="submit"
                    :disabled="updateLoading"
                    class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300"
                  >
                    {{
                      updateLoading
                        ? translateText("Saqlanmoqda...")
                        : translateText("Saqlash")
                    }}
                  </button>
                </div>
              </form>
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
import translateText from "@/auth/Translate copy";

const route = useRoute();
const customerId = ref(route.params.id);

// Theme management
const isDark = ref(false);

// Modal states
const showAddModal = ref(false);
const activeMenuId = ref(null);

// Reactive data
const sectionData = ref({
  name: "",
  customerId: customerId.value,
});

const sections = ref([]);
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
const openAddModal = () => {
  showAddModal.value = true;
  activeMenuId.value = null;
};

const closeAddModal = () => {
  showAddModal.value = false;
  resetForm();
};

const toggleActionMenu = (sectionId) => {
  activeMenuId.value = activeMenuId.value === sectionId ? null : sectionId;
};

// Backend functions
const submitSection = async () => {
  if (!sectionData.value.name.trim()) {
    showMessage(translateText("Bo'lim nomi kiritilishi kerak!"), "error");
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
        customerId: sectionData.value.customerId,
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
      "error",
    );
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  sectionData.value.name = "";
};

const loadSections = async () => {
  sectionsLoading.value = true;
  try {
    const response = await fetch(URL + `/customers/${customerId.value}`);
    if (response.ok) {
      const res = await response.json();
      console.log(res);
      sections.value = res.CustomerApplications[0].Sections || [];
    } else {
      throw new Error(translateText("Bo'limlarni yuklashda xato"));
    }
  } catch (error) {
    console.error("Bo'limlarni yuklashda xato:", error);
    showMessage(
      translateText("Bo'limlarni yuklashda xato yuz berdi!"),
      "error",
    );
  } finally {
    sectionsLoading.value = false;
  }
};

const editSection = (section) => {
  editingSection.value = { ...section };
  activeMenuId.value = null;
};

const closeEditModal = () => {
  editingSection.value = null;
};

const updateSection = async () => {
  if (!editingSection.value.name.trim()) {
    showMessage(translateText("Bo'lim nomi kiritilishi kerak!"), "error");
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
          customerId: editingSection.value.customerId,
        }),
      },
    );

    if (response.ok) {
      showMessage(
        translateText("Bo'lim muvaffaqiyatli yangilandi!"),
        "success",
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
      "error",
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
        "success",
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
      "error",
    );
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
.folder-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 8px 16px -4px rgba(245, 158, 11, 0.3);
  transition: all 0.3s ease;
  position: relative;
}

.dark .folder-icon {
  background: linear-gradient(135deg, #f59e0b, #b45309);
  box-shadow: 0 8px 16px -4px rgba(245, 158, 11, 0.4);
}

.group:hover .folder-icon {
  transform: translateY(-2px);
  box-shadow: 0 12px 20px -4px rgba(245, 158, 11, 0.4);
}

.dark .group:hover .folder-icon {
  box-shadow: 0 12px 20px -4px rgba(245, 158, 11, 0.5);
}

.folder-icon::before {
  content: "";
  position: absolute;
  top: -3px;
  left: 8px;
  right: 8px;
  height: 12px;
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  border-radius: 6px 6px 0 0;
  transform: perspective(20px) rotateX(15deg);
}

.dark .folder-icon::before {
  background: linear-gradient(135deg, #fbbf24, #d97706);
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
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
