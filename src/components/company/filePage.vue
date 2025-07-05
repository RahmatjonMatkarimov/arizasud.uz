<template>
  <div class="relative min-h-screen bg-stone-50 text-gray-900 font-poppins antialiased dark:bg-gradient-to-br dark:from-gray-800 dark:via-indigo-900 dark:to-teal-900 dark:text-gray-100">
    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="flex justify-end mb-10">
        <button
          @click="toggleModal"
          class="relative bg-gradient-to-r from-teal-400 to-blue-400 dark:from-cyan-400 dark:to-lime-400 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden group"
        >
          <span class="relative z-10 flex items-center gap-2">
            <Icon icon="mdi:plus" class="w-5 h-5" />
            {{ $t("bolim_yaratish") }}
          </span>
          <div class="absolute inset-0 bg-gradient-to-r from-teal-500 to-blue-500 dark:from-cyan-500 dark:to-lime-500 opacity-0 group-hover:opacity-100 transition-opacity duration-400"></div>
        </button>
      </div>

      <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl dark:shadow-[0_0_15px_rgba(34,211,238,0.3)]">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="item in data"
            :key="item.id"
            class="relative bg-gray-50 dark:bg-gray-800/90 rounded-xl p-6 shadow-md dark:shadow-[0_0_8px_rgba(34,211,238,0.2)] hover:shadow-lg hover:scale-[1.03] transition-all duration-300 cursor-pointer group"
            data-testid="card"
          >
            <!-- Menu Button -->
            <div class="absolute z-10" style="top: 16px !important; right: 16px !important;">
              <button
                @click.stop="toggleActionModal(item.id)"
                class="p-2 bg-gray-100/50 dark:bg-gray-700/50 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
                data-testid="menu-button"
              >
                <Icon icon="mdi:dots-vertical" class="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:scale-110 transition-transform duration-200" />
              </button>
            </div>
            <div class="flex items-center space-x-4" @click="Navigate(item.id)">
              <Icon icon="mdi:folder" class="w-12 h-12 text-teal-500 dark:text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
              <h1
                v-if="dat === 'datalotin'"
                class="text-gray-900 dark:text-gray-100 text-lg font-semibold truncate flex-1 text-center"
              >
                {{ item.name }}
              </h1>
              <h1
                v-if="dat === 'datakril'"
                class="text-gray-900 dark:text-gray-100 text-lg font-semibold truncate flex-1 text-center"
              >
                {{ translateText(item.name) }}
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Modal (Centered, Larger) -->
    <Teleport to="body">
      <div
        v-if="showActionModal"
        @click="showActionModal = false"
        class="fixed inset-0 bg-gray-300/70 dark:bg-black/70 flex items-center justify-center z-50"
        data-testid="action-modal-container"
      >
        <div
          @click.stop
          class="relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl px-8 pb-8 w-full max-w-md shadow-2xl border border-gray-200/20 dark:border-[rgba(34,211,238,0.2)] dark:shadow-[0_0_20px_rgba(34,211,238,0.4)] transform transition-all duration-300 scale-100"
          data-testid="action-modal"
        >
          <button
            @click="showActionModal = false"
            class="absolute z-50 p-3 bg-gray-200/50 dark:bg-gray-700/50 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
            style="top: 16px !important; right: 16px !important;"
            data-testid="action-modal-close"
          >
            <Icon icon="mdi:close" class="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>

          <div class="text-center space-y-6 pt-4">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8">
              {{ dat === 'datakril' ? translateText("Amallar") : "Amallar" }}
            </h2>

            <div class="space-y-4">
              <button
                @click.stop="handleEdit(selectedId)"
                class="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-400 dark:to-indigo-400 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold"
              >
                <Icon icon="mdi:pencil" class="w-6 h-6" />
                {{ $t("tahrirlash") }}
              </button>

              <button
                @click.stop="handleDelete(selectedId)"
                class="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-red-500 to-rose-500 dark:from-red-400 dark:to-rose-400 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold"
              >
                <Icon icon="mdi:delete" class="w-6 h-6" />
                {{ $t("remove") }}
              </button>

              <button
                @click="showActionModal = false"
                class="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-gray-400 to-gray-500 dark:from-gray-600 dark:to-gray-700 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold"
              >
                <Icon icon="mdi:cancel" class="w-6 h-6" />
                {{ dat === 'datalotin' ? 'Bekor qilish' : translateText("Bekor qilish") }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Upload Modal -->
    <Teleport to="body">
      <div
        v-if="showModal" @click="showModal = false"
        class="fixed inset-0 bg-gray-300/70 dark:bg-black/70 flex items-center justify-center z-50"
        data-testid="upload-modal-container"
      >
        <div @click.stop
          class="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md shadow-2xl border border-gray-200/20 dark:border-[rgba(34,211,238,0.2)] dark:shadow-[0_0_12px_rgba(34,211,238,0.3)] overflow-visible"
          data-testid="upload-modal"
        >
          <button
            @click="toggleModal"
            class="upload-modal-close absolute z-50 p-3 bg-gray-200/50 dark:bg-gray-700/50 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
            style="top: 16px !important; right: 16px !important;"
            data-testid="upload-modal-close"
          >
            <Icon icon="mdi:close" class="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
          <form @submit.prevent="uploadCourt" class="space-y-6">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 text-center">
              {{ $t("bolim_yaratish") }}
            </h2>
            <input
              v-model="courtName"
              type="text"
              :placeholder="$t('bolimname')"
              class="w-full p-3 rounded-lg bg-gray-100/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-400 dark:focus:ring-cyan-400 transition-all duration-200"
              required
            />
            <div class="flex items-center space-x-3">
              <input
                v-model="isSignable"
                type="checkbox"
                id="signable"
                class="w-5 h-5 text-teal-500 dark:text-cyan-500 bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-700 rounded focus:ring-teal-400 dark:focus:ring-cyan-400"
              />
              <label for="signable" class="text-gray-900 dark:text-gray-100 font-medium capitalize">{{ $t("imzo") }}</label>
            </div>
            <button
              type="submit"
              class="w-full py-3 bg-gradient-to-r from-teal-400 to-blue-400 dark:from-cyan-400 dark:to-lime-400 text-white rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              {{ $t("yuklash") }}
            </button>
            <p v-if="successMessage" class="text-green-500 dark:text-lime-400 text-center font-medium">
              {{ dat === 'datakril' ? translateText(successMessage):successMessage }}
            </p>
            <p v-if="errorMessage" class="text-red-500 dark:text-rose-400 text-center font-medium">{{ dat === 'datakril' ? translateText(errorMessage) : errorMessage }}</p>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Edit Modal -->
    <Teleport to="body">
      <div
        v-if="showModalfile" @click="showModalfile = false"
        class="fixed inset-0 bg-gray-300/70 dark:bg-black/70 flex items-center justify-center z-50"
        data-testid="edit-modal-container"
      >
        <div @click.stop
          class="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md shadow-2xl border border-gray-200/20 dark:border-[rgba(34,211,238,0.2)] dark:shadow-[0_0_12px_rgba(34,211,238,0.3)] overflow-visible"
          data-testid="edit-modal"
        >
          <button
            @click="toggle(null)"
            class="edit-modal-close absolute z-50 p-3 bg-gray-200/50 dark:bg-gray-700/50 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
            style="top: 16px !important; right: 16px !important;"
            data-testid="edit-modal-close"
          >
            <Icon icon="mdi:close" class="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
          <form @submit.prevent="updateFile" class="space-y-6">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 text-center">
              {{ $t("tahrirlash") }}
            </h2>
            <input
              v-model="courtName"
              type="text"
              :placeholder="$t('bolimname')"
              class="w-full p-3 rounded-lg bg-gray-100/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-400 dark:focus:ring-cyan-400 transition-all duration-200"
              required
            />
            <div class="flex items-center space-x-3">
              <input
                v-model="isSignable"
                type="checkbox"
                id="signable-edit"
                class="w-5 h-5 text-teal-500 dark:text-cyan-500 bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-700 rounded focus:ring-teal-400 dark:focus:ring-cyan-400"
              />
              <label for="signable-edit" class="text-gray-900 dark:text-gray-100 font-medium capitalize">{{ $t("imzo") }}</label>
            </div>
            <button
              type="submit"
              class="w-full py-3 bg-gradient-to-r from-teal-400 to-blue-400 dark:from-cyan-400 dark:to-lime-400 text-white rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              {{ $t("tahrirlash") }}
            </button>
            <p v-if="successMessage" class="text-green-500 dark:text-lime-400 text-center font-medium">
              {{ dat === 'datakril' ?translateText(successMessage):successMessage }}
            </p>
            <p v-if="errorMessage" class="text-red-500 dark:text-rose-400 text-center font-medium">{{ dat === 'datakril' ? translateText(errorMessage):errorMessage }}</p>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <div
        v-if="showDeleteModal" @click="showDeleteModal = false"
        class="fixed inset-0 bg-gray-300/70 dark:bg-black/70 flex items-center justify-center z-50"
        data-testid="delete-modal-container"
      >
        <div @click.stop
          class="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md shadow-2xl border border-gray-200/20 dark:border-[rgba(34,211,238,0.2)] dark:shadow-[0_0_12px_rgba(34,211,238,0.3)] overflow-visible"
          data-testid="delete-modal"
        >
          <button
            @click="toggleDeleteModal(null)"
            class="delete-modal-close absolute z-50 p-3 bg-gray-200/50 dark:bg-gray-700/50 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
            style="top: 16px !important; right: 16px !important;"
            data-testid="delete-modal-close"
          >
            <Icon icon="mdi:close" class="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
          <div class="text-center space-y-6">
            <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100">O'chirishni tasdiqlang</h2>
            <div class="flex justify-center space-x-4">
              <button
                @click="removeSelectedItems"
                class="px-6 py-2 bg-red-500 dark:bg-rose-600 text-white rounded-xl shadow-md hover:bg-red-600 dark:hover:bg-rose-700 hover:scale-105 transition-all duration-300"
              >
                <span class="flex items-center gap-2">
                  <Icon icon="mdi:delete" class="w-5 h-5" />
                  {{ $t("remove") }}
                </span>
              </button>
              <button
                @click="toggleDeleteModal(null)"
                class="px-6 py-2 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl shadow-md hover:bg-gray-400 dark:hover:bg-gray-800 hover:scale-105 transition-all duration-300"
              >
                <span class="flex items-center gap-2">
                  <Icon icon="mdi:cancel" class="w-5 h-5" />
                  {{ $t("Bekor_qilish") }}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { URL } from "../../auth/url.js";
import axios from "axios";
import { useRouter } from "vue-router";
import translateText from "@/auth/Translate";
import { Icon } from "@iconify/vue";
import { inject } from "vue";

const router = useRouter();
const data = ref([]);
const showModal = ref(false);
const showModalfile = ref(false);
const showDeleteModal = ref(false);
const showActionModal = ref(false); // New state for action modal
const courtName = ref("");
const isSignable = ref(false);
const isLoading = inject('isLoading')
const successMessage = ref("");
const errorMessage = ref("");
const selectedId = ref(null);
const editingFileId = ref(null);
const imageBaseUrl = `${URL}/Uploads`;
const dat = ref(localStorage.getItem("til") || "datalotin");
const Navigate = (id) => {
  router.push(`/companyFile-view/${id}`);
};

const toggleModal = () => {
  showModal.value = !showModal.value;
  if (!showModal.value) resetForm();
};

// New function for action modal
const toggleActionModal = (id) => {
  selectedId.value = id;
  showActionModal.value = !showActionModal.value;
  if (!showActionModal.value) {
    selectedId.value = null;
  }
};

// Handle edit action from action modal
const handleEdit = (id) => {
  showActionModal.value = false;
  toggle(id);
};

// Handle delete action from action modal
const handleDelete = (id) => {
  showActionModal.value = false;
  toggleDeleteModal(id);
};

const toggle = (id) => {
  editingFileId.value = id;
  showModalfile.value = !showModalfile.value;

  if (id) {
    const item = data.value.find((item) => item.id === id);
    if (item) {
      courtName.value = item.name;
      isSignable.value =
        item.sign === "true" ||
        item.isSignable === "true" ||
        item.sign === true ||
        item.isSignable === true;
    }
  } else {
    resetForm();
  }
};

const toggleDeleteModal = (id) => {
  selectedId.value = id;
  showDeleteModal.value = !showDeleteModal.value;
  if (!showDeleteModal.value) {
    selectedId.value = null;
  }
};

function resetForm() {
  courtName.value = "";
  isSignable.value = false;
  successMessage.value = "";
  errorMessage.value = "";
}

const uploadCourt = async () => {
  const payload = {
    name: courtName.value,
    sign: isSignable.value,
  };
  isLoading.value = true
  try {
    const response = await axios.post(`${URL}/enterprise`, payload, {
      headers: { "Content-Type": "application/json" },
    });
    successMessage.value = "Court muvaffaqiyatli yuklandi!";
    errorMessage.value = "";
    resetForm();
    await getData();
    showModal.value = false;
  } catch (error) {
    console.error("Upload error:", error.response?.data || error.message);
    errorMessage.value =
      "Xatolik yuz berdi: " + (error.response?.data?.message || error.message);
  } finally{isLoading.value = false}
};

const updateFile = async () => {
  const payload = {
    name: courtName.value,
    sign: isSignable.value,
  };
  isLoading.value = true
  try {
    const response = await axios.put(
      `${URL}/enterprise/${editingFileId.value}`,
      payload,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    if (response.status === 200) {
      showModalfile.value = false;
      resetForm();
      await getData();
      successMessage.value = "Fayl muvaffaqiyatli yangilandi!";
    }
  } catch (error) {
    console.error("Update error:", error.response?.data || error.message);
    errorMessage.value =
      "Faylni yangilashda xatolik yuz berdi: " +
      (error.response?.data?.message || error.message);
  }finally{
    isLoading.value = false
  }
};

const removeSelectedItems = async () => {
  if (!selectedId.value) return;
  isLoading.value = true
  try {
    const response = await axios.delete(`${URL}/enterprise/${selectedId.value}`);
    if (response.status === 200) {
      showDeleteModal.value = false;
      selectedId.value = null;
      await getData();
      successMessage.value = "Muvaffaqiyatli o'chirildi!";
    }
  } catch (error) {
    console.error("Delete error:", error.response?.data || error.message);
    errorMessage.value =
      "O'chirishda xatolik yuz berdi: " +
      (error.response?.data?.message || error.message);
  } finally{
    isLoading.value = false
  }
};

const getData = async () => {
  isLoading.value = true
  try {
    const response = await axios.get(`${URL}/enterprise`);
    if (response.status === 200) {
      const filteredData = response.data.filter((item) => item.status === "active");
      data.value = filteredData;
    }
  } catch (error) {
    console.error("Fetch error:", error.response?.data || error.message);
  } finally{isLoading.value = false}
};

const getImageUrl = (filename) => `${imageBaseUrl}/${filename}`;

getData();
</script>

<style scoped>
/* Softer glow for dark mode */
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 8px rgba(34, 211, 238, 0.2), 0 0 16px rgba(163, 230, 53, 0.1); }
  50% { box-shadow: 0 0 12px rgba(34, 211, 238, 0.4), 0 0 24px rgba(163, 230, 53, 0.2); }
}

.dark .animate-pulse-glow {
  animation: pulse-glow 2.5s infinite ease-in-out;
}

/* Button ripple effect */
button {
  position: relative;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

button:hover {
  transform: translateY(-2px) scale(1.05);
}

button::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.5s ease, height 0.5s ease;
}

button:hover::after {
  width: 250px;
  height: 250px;
}

/* Card zoom effect */
.group {
  transition: transform 0.4s ease, box-shadow 0.4s ease;
}

.group:hover {
  transform: scale(1.03) translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.dark .group:hover {
  box-shadow: 0 8px 16px rgba(34, 211, 238, 0.2);
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f5f5f4;
  border-radius: 4px;
}

.dark ::-webkit-scrollbar-track {
  background: #312e81;
}

::-webkit-scrollbar-thumb {
  background: #a1a1aa;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #2dd4bf;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #22d3ee;
}

/* Font optimization */
@font-face {
  font-family: 'Poppins';
  src: url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
}

/* Force close button positioning */
.upload-modal-close {
  position: absolute !important;
  top: 16px !important;
  right: 16px !important;
  z-index: 50 !important;
}

.edit-modal-close {
  position: absolute !important;
  top: 16px !important;
  right: 16px !important;
  z-index: 50 !important;
}

.delete-modal-close {
  position: absolute !important;
  top: 16px !important;
  right: 16px !important;
  z-index: 50 !important;
}

/* Action modal animation */
@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

[data-testid="action-modal"] {
  animation: modalSlideIn 0.3s ease-out;
}
</style>