<template>
  <div
    class="min-h-screen min-w-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300"
  >
    <!-- Selection Modal: Choose Folder or File -->
    <div
      v-if="showSelectionModal" @click="showSelectionModal = false"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <div @click.stop
        class="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-8 w-full max-w-md mx-4 transform transition-all duration-300 scale-100"
      >
        <!-- Header -->
        <div class="text-center mb-6">
          <div
            class="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Icon icon="material-symbols:add-rounded" class="w-8 h-8 text-white" />
          </div>
          <h3 class="text-2xl font-bold text-slate-800 dark:text-slate-100">
            {{ dat === "datakril" ? translateText("Yangi element yaratish") : "Yangi element yaratish" }}
          </h3>
          <p class="text-slate-600 dark:text-slate-400 mt-2">
            {{ dat === "datakril" ? translateText("Folder yoki fayl yaratishni tanlang") : "Folder yoki fayl yaratishni tanlang" }}
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-4">
          <button
            v-if="!hasFilesAtRoot"
            @click="selectFolderCreation"
            :disabled="hasFilesAtRoot"
            class="w-full group relative overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-slate-400 disabled:to-slate-500 text-white rounded-xl py-4 px-6 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:hover:transform-none disabled:cursor-not-allowed"
          >
            <div class="flex items-center justify-center space-x-3">
              <Icon icon="material-symbols:folder-rounded" class="w-5 h-5" />
              <span>{{ $t("bolim_yaratish") }}</span>
            </div>
            <div
              class="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"
            ></div>
          </button>

          <button
            v-if="!hasFoldersAtRoot && !currentFolderId"
            @click="selectFileCreation"
            :disabled="hasFoldersAtRoot && !currentFolderId"
            class="w-full group relative overflow-hidden bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-slate-400 disabled:to-slate-500 text-white rounded-xl py-4 px-6 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:hover:transform-none disabled:cursor-not-allowed"
          >
            <div class="flex items-center justify-center space-x-3">
              <Icon icon="material-symbols:description-rounded" class="w-5 h-5" />
              <span>{{ $t("file") }} {{ $t("createAdminButton") }}</span>
            </div>
            <div
              class="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"
            ></div>
          </button>

          <button
            @click="closeSelectionModal"
            class="w-full bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-xl py-3 px-6 font-semibold transition-colors duration-200"
          >
            {{ $t("Bekor_qilish") }}
          </button>
        </div>
      </div>
    </div>

    <!-- Folder/File Creation Modal -->
    <div
      v-if="togle" @click="togle =false"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <div @click.stop
        class="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-8 w-full max-w-lg mx-4"
      >
        <!-- Header -->
        <div class="text-center mb-6">
          <div
            class="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Icon icon="material-symbols:edit-rounded" class="w-8 h-8 text-white" />
          </div>
          <h3 class="text-2xl font-bold text-slate-800 dark:text-slate-100">
            {{
              isFolderCreation
                ? isEditing
                  ? dat === "datakril"
                    ? translateText("Bo'limni tahrirlash")
                    : "Bo'limni tahrirlash"
                  : dat === "datakril"
                    ? translateText("Yangi bo'lim")
                    : "Yangi bo'lim"
                : isEditing
                ? dat === "datakril"
                  ? translateText("Faylni tahrirlash")
                  : "Faylni tahrirlash"
                : dat === "datakril"
                  ? translateText("Yangi fayl")
                  : "Yangi fayl"
            }}
          </h3>
        </div>

        <!-- Form -->
        <div class="space-y-6">
          <!-- Name Input -->
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              {{ isFolderCreation ? dat === 'datakril' ? translateText('Bo\'lim nomi'):'Bo\'lim nomi' : dat === 'datakril' ? translateText('Fayl nomi') : 'Fayl nomi' }}
            </label>
            <div class="relative">
              <input
                type="text"
                v-model="selectedName"
                :placeholder="$t('filename')"
                class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-800 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
              />
              <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                <Icon
                  icon="material-symbols:edit-outline-rounded"
                  class="w-5 h-5 text-slate-400"
                />
              </div>
            </div>
          </div>

          <!-- File Input (only for files) -->
          <div v-if="!isFolderCreation" class="space-y-2">
            <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              {{ dat === 'datakril' ? translateText('Fayl tanlash') : 'Fayl tanlash' }}
            </label>
            <div class="relative">
              <input
                type="file"
                id="fileInput"
                @change="handleFileChange"
                class="hidden"
              />
              <label
                for="fileInput"
                class="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors duration-200 bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <div class="text-center">
                  <Icon
                    icon="line-md:uploading-loop"
                    class="w-10 h-10 text-slate-400 mx-auto mb-3"
                  />
                  <p class="text-slate-600 dark:text-slate-400 font-medium">
                    {{ dat === 'datakril' ? translateText('Faylni yuklash uchun bosing') : 'Faylni yuklash uchun bosing' }}
                  </p>
                  <p class="text-sm text-slate-500 dark:text-slate-500 mt-1">
                    {{ dat === 'datakril' ? translateText('yoki bu yerga tashlang') : 'yoki bu yerga tashlang' }}
                  </p>
                </div>
              </label>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-4 pt-4">
            <button
              @click="back()"
              class="flex-1 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-xl py-3 px-6 font-semibold transition-colors duration-200"
            >
              {{ $t("Bekor_qilish") }}
            </button>

            <button
              v-if="!isFolderCreation"
              @click="isEditing ? updateFile() : uploadFile()"
              :disabled="hasFoldersAtRoot && !currentFolderId"
              class="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-slate-400 disabled:to-slate-500 text-white rounded-xl py-3 px-6 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:hover:transform-none disabled:cursor-not-allowed"
            >
              {{ isEditing ? $t("editModal.updateButton") : $t("yuklash") }}
            </button>

            <button
              v-if="isFolderCreation"
              @click="isEditing ? updateFolder() : createFolder()"
              :disabled="hasFilesAtRoot"
              class="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-slate-400 disabled:to-slate-500 text-white rounded-xl py-3 px-6 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:hover:transform-none disabled:cursor-not-allowed"
            >
              {{ isEditing ? $t("editModal.updateButton") : $t("bolim_yaratish") }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="asd" @click="asd = false"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <div @click.stop
        class="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-8 w-full max-w-md mx-4"
      >
        <!-- Warning Icon -->
        <div class="text-center mb-6">
          <div
            class="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Icon icon="material-symbols:warning-rounded" class="w-8 h-8 text-white" />
          </div>
          <h3 class="text-xl font-bold text-slate-800 dark:text-slate-100">
            {{ dat === "datakril" ? translateText("O'chirish tasdiqlash") : "O'chirish tasdiqlash" }}
          </h3>
          <p class="text-slate-600 dark:text-slate-400 mt-2">
            {{ dat === "datakril" ? translateText("Tanlangan elementni o'chirmoqchimisiz?") : "Tanlangan elementni o'chirmoqchimisiz?" }}
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-4">
          <button
            @click="func(null)"
            class="flex-1 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-xl py-3 px-6 font-semibold transition-colors duration-200"
          >
            {{ $t("Bekor_qilish") }}
          </button>
          <button
            @click="removeSelectedItems"
            class="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl py-3 px-6 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            {{ $t("remove") }}
          </button>
        </div>
      </div>
    </div>

    <!-- Create Button -->
    <div class="flex justify-end p-6">
      <button
        @click="promptForFolderOrFile"
        id="add"
        class="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-2xl px-8 py-4 font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
      >
        <div class="flex items-center space-x-3">
          <Icon
            icon="material-symbols:add-rounded"
            class="w-6 h-6 transform group-hover:rotate-90 transition-transform duration-300"
          />
          <span>{{ $t("create") }}</span>
        </div>
        <div
          class="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
        ></div>
      </button>
    </div>

    <!-- Files and Folders Display -->
    <div class="px-6 pb-6">
      <!-- Files Only View -->
      <div v-if="isFolders == false" class="max-w-7xl mx-auto">
        <div class="">
          <div class="space-y-4">
            <div v-for="(item, index) in ServiceData" :key="item.id">
              <div
                v-if="!item.isFolder"
                @click="toggleFolder(item)"
                class="group relative bg-gradient-to-r from-white to-slate-50 dark:from-slate-700 dark:to-slate-800 hover:from-blue-50 hover:to-indigo-50 dark:hover:from-slate-600 dark:hover:to-slate-700 border-2 border-slate-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500 rounded-2xl p-6 cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <div class="flex items-center space-x-6">
                  <!-- File Icon -->
                  <div class="flex-shrink-0">
                    <div
                      class="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl flex items-center justify-center"
                    >
                      <Icon
                        icon="material-symbols:description-rounded"
                        class="w-6 h-6 text-white"
                      />
                    </div>
                  </div>

                  <!-- File Name -->
                  <div
                    class="flex-1 min-w-0"
                    @click.stop="item.isFolder ? null : goToCard(item.id)"
                  >
                    <h3
                      class="text-xl font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200"
                    >
                      {{ dat === "datakril" ? translateText(item.name) : item.name }}
                    </h3>
                  </div>

                  <!-- Action Buttons -->
                  <div
                    class="flex-shrink-0 flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <button
                      @click.stop="editFile(item)"
                      class="w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-xl flex items-center justify-center transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-110"
                    >
                      <Icon icon="material-symbols:edit-rounded" class="w-5 h-5" />
                    </button>
                    <button
                      @click.stop="func(item.id)"
                      class="w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-xl flex items-center justify-center transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-110"
                    >
                      <Icon icon="material-symbols:delete-rounded" class="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Folders and Files View -->
      <div class="max-w-7xl mx-auto space-y-8">
        <div v-for="(item, index) in ServiceData" :key="item.id">
          <div v-if="item.isFolder">
            <!-- Folder Header -->
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center space-x-4">
                <div
                  class="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg"
                >
                  <Icon
                    icon="material-symbols:folder-rounded"
                    class="w-8 h-8 text-white"
                  />
                </div>
                <h2
                  class="text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent"
                >
                  {{ dat === "datakril" ? translateText(item.name) : item.name }}
                </h2>
              </div>
              <button
                @click.stop="func(item.id)"
                class="w-12 h-12 bg-red-500 hover:bg-red-600 text-white rounded-xl flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-110"
              >
                <Icon icon="material-symbols:delete-rounded" class="w-6 h-6" />
              </button>
            </div>

            <!-- Folder Content -->
            <div
              class="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 p-8"
            >
              <!-- Add File Button -->
              <div class="mb-6">
                <button
                  @click="promptForFileInFolder(item.id)"
                  class="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl px-6 py-3 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div class="flex items-center space-x-2">
                    <Icon
                      icon="material-symbols:add-rounded"
                      class="w-5 h-5 transform group-hover:rotate-90 transition-transform duration-200"
                    />
                    <span>{{ $t("create") }}</span>
                  </div>
                  <div
                    class="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"
                  ></div>
                </button>
              </div>

              <!-- Files in Folder -->
              <div class="space-y-4">
                <div
                  v-for="(file, fileIndex) in folderContents[item.id]"
                  :key="file.id"
                  class="group relative bg-gradient-to-r from-white to-slate-50 dark:from-slate-700 dark:to-slate-800 hover:from-green-50 hover:to-emerald-50 dark:hover:from-slate-600 dark:hover:to-slate-700 border border-slate-200 dark:border-slate-600 hover:border-green-300 dark:hover:border-green-500 rounded-xl p-4 cursor-pointer transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <div class="flex items-center space-x-4">
                    <!-- File Icon -->
                    <div class="flex-shrink-0">
                      <div
                        class="w-10 h-10 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center"
                      >
                        <Icon
                          icon="material-symbols:description-rounded"
                          class="w-5 h-5 text-white"
                        />
                      </div>
                    </div>

                    <!-- File Name -->
                    <div class="flex-1 min-w-0" @click="goToCard(file.id)">
                      <h4
                        class="text-lg font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-200"
                      >
                        {{ dat === "datakril" ? translateText(file.name) : file.name }}
                      </h4>
                    </div>

                    <!-- Action Buttons -->
                    <div
                      class="flex-shrink-0 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <button
                        @click.stop="editFile(file)"
                        class="w-9 h-9 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center transition-colors duration-200 shadow-md hover:shadow-lg transform hover:scale-110"
                      >
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
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        @click.stop="func(file.id)"
                        class="w-9 h-9 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center transition-colors duration-200 shadow-md hover:shadow-lg transform hover:scale-110"
                      >
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
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
</template>

<script setup>
import { ref, onMounted, inject, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { URL } from "../../../auth/url.js";
import { Icon } from "@iconify/vue";

const { t } = useI18n();
const ServiceId = ref(null);
const ServiceData = ref([]);
const selectedFile = ref(null);
const selectedName = ref("");
const togle = ref(false);
const asd = ref(false);
const isEditing = ref(false);
const isFolderCreation = ref(false);
const editingFileId = ref(null);
const currentFolderId = ref(null);
const folderContents = ref({});
const showSelectionModal = ref(false);
const route = useRoute();
const router = useRouter();
const numericId = ref(parseInt(route.params.id));

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

const hasFilesAtRoot = computed(() => ServiceData.value.some((item) => !item.isFolder));
const hasFoldersAtRoot = computed(() => ServiceData.value.some((item) => item.isFolder));

import translateText from "@/auth/Translate";
import { da } from "date-fns/locale";
import { onUnmounted } from "vue";
onMounted(async () => {
  ServiceId.value = numericId.value;
  await getCourtsData();
  for (const item of ServiceData.value) {
    if (item.isFolder) {
      await getFolderContents(item.id);
    }
  }
});

const isFolders = ref(Boolean);

const getCourtsData = async () => {
  try {
    const response = await fetch(`${URL}/applications/${ServiceId.value}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    isFolders.value = data.isFolder;
    ServiceData.value = [
      ...(data.files || []).map((item) => ({ ...item, isFolder: false })),
      ...(data.folders || []).map((item) => ({ ...item, isFolder: true })),
    ]
      .filter((item) => item.status === "active")
      .sort((a, b) => a.id - b.id);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    alert("Error fetching data!");
  }
};

const getFolderContents = async (folderId) => {
  try {
    const response = await fetch(`${URL}/folders/${folderId}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    folderContents.value[folderId] = data.files
      .map((item) => ({ ...item, isFolder: false }))
      .filter((item) => item.status === "active");
  } catch (error) {
    console.error("Error fetching folder contents:", error.message);
    alert("Error fetching folder contents!");
  }
};

const toggleFolder = async (item) => {
  if (!item.isFolder) return;
  if (!folderContents.value[item.id]) {
    await getFolderContents(item.id);
  }
};

const handleFileChange = (event) => {
  selectedFile.value = event.target.files[0];
};

const promptForFolderOrFile = () => {
  showSelectionModal.value = true;
  currentFolderId.value = null;
  selectedName.value = "";
  selectedFile.value = null;
};

const selectFolderCreation = () => {
  if (hasFilesAtRoot.value) {
    alert("Bo'lim yaratib bo'lmaydi, chunki fayllar ildiz darajasida mavjud!");
    return;
  }
  isFolderCreation.value = true;
  showSelectionModal.value = false;
  togle.value = true;
};

const selectFileCreation = () => {
  if (hasFoldersAtRoot.value && !currentFolderId.value) {
    alert("File yaratib bo'lmaydi, chunki bo'limlar ildiz darajasida mavjud!");
    return;
  }
  isFolderCreation.value = false;
  showSelectionModal.value = false;
  togle.value = true;
};

const closeSelectionModal = () => {
  showSelectionModal.value = false;
};

const promptForFileInFolder = (folderId) => {
  isFolderCreation.value = false;
  currentFolderId.value = folderId;
  selectedName.value = "";
  togle.value = true;
};

const createFolder = async () => {
  if (!selectedName.value.trim()) {
    alert("Iltimos nom kiriting!");
    return;
  }
  if (hasFilesAtRoot.value) {
    alert("Bo'lim yaratib bo'lmadi, chunki fayllar ildiz darajasida allaqachon mavjud!");
    return;
  }

  try {
    const folderData = {
      name: selectedName.value,
      applicationsId: parseInt(ServiceId.value),
    };

    const response = await fetch(`${URL}/folders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(folderData),
    });

    if (!response.ok) throw new Error(await response.text());
    resetForm(); // Close all modals
    await getCourtsData(); // Refresh data
  } catch (error) {
    console.error("Folder creation error:", error);
    alert("Error creating folder!");
  }
};

const uploadFile = async () => {
  if (!selectedFile.value || !selectedName.value.trim()) {
    alert("Iltimos nom kiriting va fayl tanlang!");
    return;
  }
  if (hasFoldersAtRoot.value && !currentFolderId.value) {
    alert("File yaratib bo'lmaydi, chunki bo'limlar ildiz darajasida mavjud!");
    return;
  }

  const formData = new FormData();
  formData.append("file", selectedFile.value);
  formData.append("name", selectedName.value);
  currentFolderId.value
    ? formData.append("folderId", String(currentFolderId.value))
    : formData.append("applicationsId", String(ServiceId.value));

  try {
    const response = await fetch(`${URL}/files`, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) throw new Error("Upload failed");
    resetForm(); // Close all modals
    currentFolderId.value
      ? await getFolderContents(currentFolderId.value)
      : await getCourtsData();
    for (const item of ServiceData.value) {
      if (item.isFolder) {
        await getFolderContents(item.id);
      }
    }
  } catch (error) {
    console.error("File upload error:", error);
    alert("Error uploading file!");
  }
};

const editFile = (item) => {
  isEditing.value = true;
  editingFileId.value = item.id;
  selectedName.value = item.name;
  selectedFile.value = null;
  isFolderCreation.value = item.isFolder;
  currentFolderId.value = item.folderId || null;
  togle.value = true;
};

const updateFile = async () => {
  if (!selectedName.value.trim() || !editingFileId.value) {
    alert("Iltimos, nom kiriting va elementni tanlang!");
    return;
  }

  const formData = new FormData();
  formData.append("name", selectedName.value);
  if (selectedFile.value) formData.append("file", selectedFile.value);
  if (currentFolderId.value) {
    formData.append("folderId", String(currentFolderId.value));
  } else {
    formData.append("applicationsId", String(ServiceId.value));
  }

  try {
    const response = await fetch(`${URL}/files/${editingFileId.value}`, {
      method: "PUT",
      body: formData,
    });
    if (!response.ok) throw new Error(await response.text());
    resetForm(); // Close all modals
    for (const item of ServiceData.value) {
      if (item.isFolder) {
        await getFolderContents(item.id);
      }
    }
    currentFolderId.value
      ? await getFolderContents(currentFolderId.value)
      : await getCourtsData(); // Refresh data
  } catch (error) {
    console.error("File update error:", error);
    alert("Error updating file!");
  }
};

const updateFolder = async () => {
  try {
    const folderData = {
      name: selectedName.value,
      applicationsId: parseInt(ServiceId.value),
    };

    const response = await fetch(`${URL}/folders/${editingFileId.value}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(folderData),
    });
    if (!response.ok) throw new Error(await response.text());
    resetForm(); // Close all modals
    await getCourtsData(); // Refresh data
    for (const item of ServiceData.value) {
      if (item.isFolder) {
        await getFolderContents(item.id);
      }
    }
  } catch (error) {
    console.error("Folder update error:", error);
    alert("Error updating folder!");
  }
};

const removeSelectedItems = async () => {
  try {
    const item =
      ServiceData.value.find((item) => item.id === numericId.value) ||
      Object.values(folderContents.value)
        .flat()
        .find((file) => file.id === numericId.value);
    const endpoint = item?.isFolder
      ? `${URL}/folders/${numericId.value}`
      : `${URL}/files/${numericId.value}`;
    const response = await fetch(endpoint, { method: "DELETE" });
    if (!response.ok) throw new Error(await response.text());
    resetForm(); // Close all modals
    asd.value = false; // Close delete confirmation modal
    currentFolderId.value
      ? await getFolderContents(currentFolderId.value)
      : await getCourtsData(); // Refresh data
  } catch (error) {
    console.error("Delete error:", error);
    alert("Error deleting item!");
  }
};

const resetForm = () => {
  togle.value = false;
  isEditing.value = false;
  isFolderCreation.value = false;
  selectedName.value = "";
  selectedFile.value = null;
  editingFileId.value = null;
  currentFolderId.value = null;
  showSelectionModal.value = false; // Ensure selection modal is closed
};

const back = resetForm;

const func = (id) => {
  numericId.value = id;
  asd.value = id !== null;
};

const goToCard = (id) => {
  router.push(`/FileAdmin/${id}`);
};
</script>

<style lang="scss" scoped>
.file-upload-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.file-upload-area {
  display: flex;
  flex-direction: column;
  align-items: center;
}

input[type="file"] {
  margin: 10px 0;
  color: white;
}
</style>
