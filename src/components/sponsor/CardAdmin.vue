<template>
  <div class="min-h-screen bg-gray-200 dark:bg-gray-900">
    <!-- Header Section -->
    <div class="flex justify-center pt-8 mb-4 items-center">
      <h1
        class="text-[40px] font-bold text-center bg-gradient-to-r from-blue-800/50 to-purple-500/50 text-white border-2 mb-4 border-white rounded-lg py-2 px-[100px]"
      >
        {{
          dat === "datakril" ? translateText("Hamkorlar ro'yxati") : "Hamkorlar ro'yxati"
        }}
      </h1>
    </div>

    <!-- Floating Action Button -->
    <button 
  @click="toggleModal"
  class="absolute top-[110px] right-4 group overflow-hidden bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 ease-out"
>
  <div class="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
  <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
  <span class="relative z-10 flex items-center gap-2">
    <svg class="w-5 h-5 transform group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
    </svg>
    {{ dat === "datakril" ? translateText("Qo'shish") : "Qo'shish" }}
  </span>
</button>

    <!-- Upload Modal -->
    <div
      v-if="showModal" @click="showModal = false"
      class="fixed z-50 inset-0 w-full h-full flex items-center bg-black bg-opacity-50 justify-center"
    >
      <div class="relative bg-slate-800 border border-gray-700 rounded-2xl p-8 w-96" @click.stop>
        <button
          @click="toggleModal"
          class="absolute -top-3 -right-3 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors duration-200"
        >
          <svg
            class="w-4 h-4 dark:text-white"
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

        <div class="text-center mb-6">
          <h3 class="text-2xl font-bold dark:text-white mb-2">
            {{
              dat === "datakril"
                ? translateText(`Yangi hamkor qo'shish`)
                : `Yangi hamkor qo'shish`
            }}
          </h3>
          <div class="w-16 h-1 bg-blue-400 mx-auto rounded-full"></div>
        </div>

        <form @submit.prevent="uploadCourt" class="space-y-6">
          <div>
            <input
              v-model="courtName"
              class="w-full bg-slate-700 border border-gray-600 dark:text-white placeholder-gray-400 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
              type="text"
              placeholder="Bo'lim nomini kiriting"
              required
            />
          </div>

          <div
            @click="triggerFileInput"
            @dragover.prevent="handleDragOver"
            @dragleave.prevent="handleDragLeave"
            @drop.prevent="handleDrop"
            class="relative rounded-2xl p-8 cursor-pointer bg-slate-800 border-2 border-dashed border-slate-600 hover:border-slate-400 transition-colors duration-200"
          >
            <div class="text-center">
              <div class="mb-4">
                <div
                  class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500"
                >
                  <svg
                    class="w-8 h-8 dark:text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
              </div>
              <div class="text-xl font-semibold dark:text-white mb-2">
                {{
                  dat === "datakril"
                    ? translateText(`Rasmni bu yerga tashlang`)
                    : `Rasmni bu yerga tashlang`
                }}
              </div>
              <div class="text-slate-400 mb-4">
                {{
                  dat === "datakril"
                    ? translateText(`yoki faylni tanlash uchun bosing`)
                    : `yoki faylni tanlash uchun bosing`
                }}
              </div>
              <div
                class="inline-flex items-center space-x-2 bg-white/10 rounded-full px-6 py-3 dark:text-white font-medium hover:bg-white/20 transition-colors duration-200"
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
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <div>
                  {{
                    dat === "datakril" ? translateText(`Fayl tanlash`) : `Fayl tanlash`
                  }}
                </div>
              </div>
              <div class="text-slate-500 text-sm mt-3">
                {{
                  dat === "datakril"
                    ? translateText(`JPG, PNG, GIF • Maksimal 10MB`)
                    : `JPG, PNG, GIF • Maksimal 10MB`
                }}
              </div>
            </div>
            <input
              @change="onFileChange"
              type="file"
              accept="image/*"
              required
              class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>

          <button
            class="w-full bg-blue-600 hover:bg-blue-700 dark:text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
            type="submit"
          >
            <span class="flex items-center justify-center">
              <svg
                class="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6-cart
L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              {{ dat === "datakril" ? translateText(`Yuklash`) : `Yuklash` }}
            </span>
          </button>
        </form>

        <p v-if="successMessage" class="text-green-400 text-center mt-4 font-medium">
          {{ dat === "datakril" ? translateText(successMessage) : successMessage }}
        </p>
        <p v-if="errorMessage" class="text-red-400 text-center mt-4 font-medium">
          {{ dat === "datakril" ? translateText(errorMessage) : errorMessage }}
        </p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="w-full flex flex-col justify-center items-center px-6">
      <div class="relative w-full max-w-7xl">
        <div class="">
          <div
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            <div
              v-if="dat === 'datakril'"
              v-for="item in datakril"
              :key="item.id"
              class="relative group bg-slate-700 border border-gray-600 rounded-2xl p-6 hover:border-blue-500 transition-colors duration-200"
            >
              <button
                @click.stop="func(item.id)"
                class="absolute z-10 top-4 right-4 w-8 h-8 bg-slate-600 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors duration-200 opacity-0 group-hover:opacity-100"
              >
                <svg
                  class="w-4 h-4 dark:text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
                  />
                </svg>
              </button>

              <div
                class="flex justify-center items-center mb-6 h-40 bg-slate-600 rounded-xl overflow-hidden"
              >
                <img
                  v-if="item.img"
                  :src="getImageUrl(item.img)"
                  alt="Partner Image"
                  class="max-w-full max-h-full object-contain"
                />
              </div>

              <h3
                class="line-clamp-2 text-xl font-semibold text-center dark:text-white mb-4"
              >
                {{ item.translatedName }}
              </h3>

              <div
                v-if="item.isActive"
                class="absolute inset-0 bg-blue-500/50 rounded-2xl flex items-center justify-center"
              >
                <div class="text-center">
                  <div
                    class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto"
                  >
                    <svg
                      class="w-8 h-8 dark:text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <p class="dark:text-white font-bold text-xl">{{ $t("tez_kunda") }}</p>
                </div>
              </div>
            </div>

            <div
              v-if="dat === 'datalotin'"
              v-for="item in data"
              :key="item.id"
              class="relative group bg-white dark:bg-slate-700 border border-gray-600 rounded-2xl p-6 hover:border-blue-500 transition-colors duration-200"
            >
              <button
                @click.stop="func(item.id)"
                class="absolute z-10 top-4 right-4 w-8 h-8 bg-slate-600 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors duration-200 opacity-0 group-hover:opacity-100"
              >
                <svg
                  class="w-4 h-4 dark:text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
                  />
                </svg>
              </button>

              <div
                class="flex justify-center items-center mb-6 h-40 bg-slate-600 rounded-xl overflow-hidden"
              >
                <img
                  v-if="item.img"
                  :src="getImageUrl(item.img)"
                  alt="Partner Image"
                  class="max-w-full max-h-full object-contain"
                />
              </div>

              <h3
                class="line-clamp-2 text-xl font-semibold text-center dark:text-white mb-4"
              >
                {{ item.name }}
              </h3>

              <div
                v-if="item.isActive"
                class="absolute inset-0 bg-blue-900/40 backdrop-blur-sm dark:bg-blue-500/50 rounded-2xl flex items-center justify-center"
              >
                <div class="text-center">
                  <div
                    class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto"
                  >
                    <svg
                      class="w-8 h-8 dark:text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <p class="dark:text-white font-bold text-xl">{{ $t("tez_kunda") }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div
      v-if="PutModal" @click="PutModal = false"
      class="fixed z-50 inset-0 w-full h-full flex items-center bg-black bg-opacity-50 justify-center"
    >
      <div @click.stop class="relative bg-slate-800 border border-gray-700 rounded-2xl p-8 w-96">
        <button
          @click="Modal"
          class="absolute -top-3 -right-3 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors duration-200"
        >
          <svg
            class="w-4 h-4 dark:text-white"
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

        <div class="text-center mb-6">
          <h3 class="text-2xl font-bold dark:text-white mb-2">
            {{ dat === 'datakril' ? translateText(`Hamkorni tahrirlash`) : `Hamkorni tahrirlash`  }}
          </h3>
          <div class="w-16 h-1 bg-orange-400 mx-auto rounded-full"></div>
        </div>

        <form @submit.prevent="updateCourt" class="space-y-6">
          <div>
            <input
              v-model="courtName"
              class="w-full bg-slate-700 border border-gray-600 dark:text-white placeholder-gray-400 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors duration-200"
              type="text"
              required
            />
          </div>

          <div
            @click="triggerFileInput"
            @dragover.prevent="handleDragOver"
            @dragleave.prevent="handleDragLeave"
            @drop.prevent="handleDrop"
            class="relative rounded-2xl p-8 cursor-pointer bg-slate-800 border-2 border-dashed border-slate-600 hover:border-slate-400 transition-colors duration-200"
          >
            <div class="text-center">
              <div class="mb-4">
                <div
                  class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500"
                >
                  <svg
                    class="w-8 h-8 dark:text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
              </div>
              <div class="text-xl font-semibold dark:text-white mb-2">
                {{
                  dat === "datakril"
                    ? translateText(`Rasmni bu yerga tashlang`)
                    : `Rasmni bu yerga tashlang`
                }}
              </div>
              <div class="text-slate-400 mb-4">
                {{
                  dat === "datakril"
                    ? translateText(`yoki faylni tanlash uchun bosing`)
                    : `yoki faylni tanlash uchun bosing`
                }}
              </div>
              <div
                class="inline-flex items-center space-x-2 bg-white/10 rounded-full px-6 py-3 dark:text-white font-medium hover:bg-white/20 transition-colors duration-200"
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
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <div>
                  {{
                    dat === "datakril" ? translateText(`Fayl tanlash`) : `Fayl tanlash`
                  }}
                </div>
              </div>
            </div>
            <input
              @change="onFileChange"
              type="file"
              accept="image/*"
              required
              class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>

          <button
            class="w-full bg-orange-600 hover:bg-orange-700 dark:text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
            type="submit"
          >
            {{ dat === "datakril" ? translateText(`Yangilash`) : `Yangilash` }}
          </button>
        </form>

        <p v-if="successMessage" class="text-green-400 text-center mt-4 font-medium">
          {{ dat === "datakril" ? translateText(successMessage) : successMessage }}
        </p>
        <p v-if="errorMessage" class="text-red-400 text-center mt-4 font-medium">
          {{ dat === "datakril" ? translateText(errorMessage) : errorMessage }}
        </p>
      </div>
    </div>

    <!-- Action Modal -->
    <div
      v-if="asd" @click="asd = false"
      class="fixed z-50 inset-0 w-full h-full flex items-center bg-black bg-opacity-50 justify-center"
    >
      <div @click.stop class="relative bg-slate-800 border border-gray-700 rounded-2xl p-8 w-[500px]">
        <button
          @click="func(null)"
          class="absolute -top-3 -right-3 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors duration-200"
        >
          <svg
            class="w-4 h-4 dark:text-white"
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

        <div class="text-center mb-8">
          <h3 class="text-2xl font-bold dark:text-white mb-2">
            {{ dat === "datakril" ? translateText(`Amallar`) : `Amallar` }}
          </h3>
          <div class="w-16 h-1 bg-cyan-400 mx-auto rounded-full"></div>
        </div>

        <div class="space-y-4">
          <button
            @click="Modal"
            class="w-full bg-green-600 hover:bg-green-700 dark:text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center"
          >
            <svg
              class="w-6 h-6 mr-3"
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
            {{ dat === "datakril" ? translateText(`O'zgartirish`) : `O'zgartirish` }}
          </button>

          <button
            @click="removeSelectedItems"
            class="w-full bg-red-600 hover:bg-red-700 dark:text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center"
          >
            <svg
              class="w-6 h-6 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              ></path>
            </svg>
            {{ dat === "datakril" ? translateText(`O'chirish`) : `O'chirish` }}
          </button>

          <div
            class="w-full bg-slate-700 border border-gray-600 rounded-xl p-6 flex items-center justify-between"
          >
            <span class="dark:text-white font-semibold flex items-center">
              <svg
                class="w-6 h-6 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              {{
                dat === "datakril" ? translateText(`Ishga tushirish`) : `Ishga tushirish`
              }}
            </span>
            <label class="switch">
              <input
                type="checkbox"
                v-model="selectedItem.isActive"
                @change="updateWorkStatus(selectedItem)"
              />
              <span class="slider"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject, onUnmounted, ref, watch } from "vue";
import axios from "axios";
import { URL } from "../../auth/url";
import translateText from "@/auth/Translate";
import { onMounted } from "vue";

const PutId = ref(null);
const PutModal = ref(false);
const data = ref([]);
const showModal = ref(false);
const courtName = ref("");
const file = ref(null);
const successMessage = ref("");
const errorMessage = ref("");
const asd = ref(false);
const selectedItem = ref({ isActive: false });
const imageBaseUrl = `${URL}/upload`;

const datakril = ref([]);
const dat = ref(localStorage.getItem("til") || "datalotin");

let intervalId = null;
const checkLanguageChange = () => {
  const currentLang = localStorage.getItem("til") || "datalotin";
  if (currentLang !== dat.value) {
    dat.value = currentLang;
  }
};

onMounted(() => {
  intervalId = setInterval(checkLanguageChange, 1000);
  getData();
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});

const isLoading = inject("isLoading");

const getData = async () => {
  isLoading.value = true;
  try {
    const response = await fetch(`${URL}/partners`);
    if (response.ok) {
      const result = await response.json();
      datakril.value = result
        .sort((a, b) => a.id - b.id)
        .map((item) => ({
          ...item,
          translatedName: translateText(item.name),
        }))
        .filter((item) => item.status === "active");
      data.value = result
        .filter((item) => item.status === "active")
        .sort((a, b) => a.id - b.id);
    } else {
      console.error("Ma'lumotlarni olishda xatolik:", response.statusText);
    }
  } catch (error) {
    console.error("Xatolik:", error);
  } finally {
    isLoading.value = false;
  }
};

const toggleModal = () => {
  showModal.value = !showModal.value;
};

const Modal = () => {
  PutModal.value = !PutModal.value;
  asd.value = !asd.value;
};

const func = (id) => {
  PutId.value = id;
  asd.value = !asd.value;
  if (id) {
    const item =
      data.value.find((item) => item.id === id) ||
      datakril.value.find((item) => item.id === id);
    selectedItem.value = { ...item };
  } else {
    selectedItem.value = { isActive: false };
  }
};

const onFileChange = (event) => {
  file.value = event.target.files[0];
};

const uploadCourt = async () => {
  const formData = new FormData();
  formData.append("name", courtName.value);
  formData.append("file", file.value);
  isLoading.value = true;

  try {
    await axios.post(`${URL}/partners`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    successMessage.value = "Court muvaffaqiyatli yuklandi!";
    errorMessage.value = "";
    courtName.value = "";
    file.value = null;
    getData();
    showModal.value = false;
  } catch (error) {
    errorMessage.value = "Xatolik yuz berdi!";
  } finally {
    isLoading.value = false;
  }
};

const updateCourt = async () => {
  const formData = new FormData();
  formData.append("name", courtName.value);
  formData.append("file", file.value);
  isLoading.value = true;

  try {
    const response = await axios.put(`${URL}/partners/${PutId.value}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (response.status === 200) {
      successMessage.value = "Court muvaffaqiyatli yangilandi!";
      courtName.value = "";
      file.value = null;
      PutModal.value = false;
      getData();
    }
  } catch (error) {
    errorMessage.value = "Xatolik yuz berdi: " + error.message;
  } finally {
    isLoading.value = false;
  }
};

const removeSelectedItems = async () => {
  if (!PutId.value) return;
  isLoading.value = true;
  try {
    const response = await fetch(`${URL}/partners/${PutId.value}`, {
      method: "DELETE",
    });
    if (response.ok) {
      asd.value = false;
      await getData();
      successMessage.value = "Muvaffaqiyatli o'chirildi!";
      errorMessage.value = "";
    } else {
      errorMessage.value = "O'chirishda xatolik yuz berdi!";
    }
  } catch (error) {
    errorMessage.value = "Xatolik yuz berdi: " + error.message;
  } finally {
    isLoading.value = false;
  }
};

const updateWorkStatus = async (item) => {
  try {
    const endpoint = item.isActive
      ? `${URL}/partners/${item.id}/isActive`
      : `${URL}/partners/${item.id}/isFalse`;
    await axios.get(endpoint);
    getData();
  } catch (error) {
    console.error("Error updating workStatus:", error);
  }
};

const getImageUrl = (filename) => `${imageBaseUrl}/${filename}`;

watch([showModal, PutModal, asd], ([modalOpen, editModalOpen, actionModalOpen]) => {
  document.body.style.overflow =
    modalOpen || editModalOpen || actionModalOpen ? "hidden" : "";
});
</script>

<style>
.switch {
  position: relative;
  display: inline-block;
  width: 80px;
  height: 36px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #dc2626;
  transition: background-color 0.3s;
  border-radius: 18px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 28px;
  width: 28px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: transform 0.3s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #16a34a;
}

input:checked + .slider:before {
  transform: translateX(44px);
}
</style>