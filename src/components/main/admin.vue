<template>
  <div
    class="min-h-screen bg-gray-200 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300"
  >
    <div class="flex justify-center pt-4 items-center">
      <h1
        class="text-[40px] font-bold text-center bg-gradient-to-r from-blue-800/50 to-purple-500/50 text-white border-2 mb-4 border-white rounded-lg py-2 px-[100px]"
      >
        {{
          dat === "datakril"
            ? translateText("Sud hujjatlari")
            : "Sud hujjatlari"
        }}
      </h1>
    </div>

<!-- Upload Modal -->
<Transition name="modal" appear>
  <div
    v-if="showModal"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    @click.self="toggleModal"
  >
    <div
      class="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 max-w-md w-full mx-4"
    >
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h2 class="text-xl font-bold text-slate-900 dark:text-white">
            {{ dat === "datakril" ? translateText("Yangi sud yaratish") : "Yangi sud yaratish" }}
          </h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {{ dat === "datakril" ? translateText("Sud hujjatini yarating") : "Sud hujjatini yarating" }}
          </p>
        </div>
        <button
          @click="toggleModal"
          class="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
        >
          <svg class="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="uploadCourt" class="space-y-4 min-w-full">
        <!-- Court Name -->
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {{ dat === "datakril" ? translateText("Sud nomi") : "Sud nomi" }}
          </label>
          <input
            v-model="courtName1"
            class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            type="text"
            :placeholder="dat === 'datakril' ? translateText('Sud nomini kiriting...') : 'Sud nomini kiriting...'"
            required
          />
        </div>

        <!-- File Upload -->
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {{ dat === "datakril" ? translateText("Rasm yuklash") : "Rasm yuklash" }}
          </label>
          <div class="relative">
            <input
              @change="onFileChange1"
              type="file"
              id="file"
              accept="image/*"
              required
              class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div class="w-full p-6 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 hover:border-blue-400 transition-colors text-center">
              <svg class="w-8 h-8 text-slate-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
              </svg>
              <p class="text-sm text-slate-600 dark:text-slate-400">
                {{ dat === "datakril" ? translateText("Rasm tanlang") : "Rasm tanlang" }}
              </p>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <button
          class="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-sm hover:shadow-md"
          type="submit"
        >
          {{ $t("yuklash") }}
        </button>
      </form>

      <!-- Messages -->
      <div class="mt-4 space-y-3">
        <div
          v-if="successMessage1"
          class="p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 text-green-800 dark:text-green-400 rounded-lg text-sm"
        >
          {{ successMessage1 }}
        </div>
        <div
          v-if="errorMessage1"
          class="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-800 dark:text-red-400 rounded-lg text-sm"
        >
          {{ errorMessage1 }}
        </div>
      </div>
    </div>
  </div>
</Transition>

<!-- Upload Modal -->
<Transition name="modal" appear>
  <div
    v-if="showModal"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    @click.self="toggleModal"
  >
    <div
      class="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 max-w-md w-full mx-4"
    >
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h2 class="text-xl font-bold text-slate-900 dark:text-white">
            {{ dat === "datakril" ? translateText("Yangi sud yaratish") : "Yangi sud yaratish" }}
          </h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {{ dat === "datakril" ? translateText("Sud hujjatini yarating") : "Sud hujjatini yarating" }}
          </p>
        </div>
        <button
          @click="toggleModal"
          class="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
        >
          <svg class="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="uploadCourt" class="space-y-4 min-w-full">
        <!-- Court Name -->
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {{ dat === "datakril" ? translateText("Sud nomi") : "Sud nomi" }}
          </label>
          <input
            v-model="courtName1"
            class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            type="text"
            :placeholder="dat === 'datakril' ? translateText('Sud nomini kiriting...') : 'Sud nomini kiriting...'"
            required
          />
        </div>

        <!-- File Upload -->
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {{ dat === "datakril" ? translateText("Rasm yuklash") : "Rasm yuklash" }}
          </label>
          <div class="relative">
            <input
              @change="onFileChange1"
              type="file"
              id="file"
              accept="image/*"
              required
              class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div class="w-full p-6 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 hover:border-blue-400 transition-colors text-center">
              <svg class="w-8 h-8 text-slate-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
              </svg>
              <p class="text-sm text-slate-600 dark:text-slate-400">
                {{ dat === "datakril" ? translateText("Rasm tanlang") : "Rasm tanlang" }}
              </p>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <button
          class="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-sm hover:shadow-md"
          type="submit"
        >
          {{ $t("yuklash") }}
        </button>
      </form>

      <!-- Messages -->
      <div class="mt-4 space-y-3">
        <div
          v-if="successMessage1"
          class="p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 text-green-800 dark:text-green-400 rounded-lg text-sm"
        >
          {{ successMessage1 }}
        </div>
        <div
          v-if="errorMessage1"
          class="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-800 dark:text-red-400 rounded-lg text-sm"
        >
          {{ errorMessage1 }}
        </div>
      </div>
    </div>
  </div>
</Transition>

<!-- Edit Modal -->
<Transition name="modal" appear>
  <div
    v-if="PutModal"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    @click.self="Modal"
  >
    <div
      class="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 max-w-md w-full mx-4"
    >
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h2 class="text-xl font-bold text-slate-900 dark:text-white">
            {{ dat === "datakril" ? translateText("Tahrirlash") : "Tahrirlash" }}
          </h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {{ dat === "datakril" ? translateText("Sud ma'lumotlarini tahrirlang") : "Sud ma'lumotlarini tahrirlang" }}
          </p>
        </div>
        <button
          @click="Modal"
          class="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
        >
          <svg class="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="updateCourt" class="space-y-4 min-w-full">
        <!-- Court Name -->
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {{ dat === "datakril" ? translateText("Sud nomi") : "Sud nomi" }}
          </label>
          <input
            v-model="courtName"
            class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            type="text"
            :placeholder="dat === 'datakril' ? translateText('Sud nomini kiriting...') : 'Sud nomini kiriting...'"
            required
          />
        </div>

        <!-- File Upload -->
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {{ dat === "datakril" ? translateText("Rasm yuklash") : "Rasm yuklash" }}
          </label>
          <div class="relative">
            <input
              @change="onFileChange"
              type="file"
              id="file"
              accept="image/*"
              class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div class="w-full p-6 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 hover:border-blue-400 transition-colors text-center">
              <svg class="w-8 h-8 text-slate-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              <p class="text-sm text-slate-600 dark:text-slate-400">
                {{ dat === "datakril" ? translateText("Rasm almashtirish") : "Rasm almashtirish" }}
              </p>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <button
          class="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors shadow-sm hover:shadow-md"
          type="submit"
        >
          {{ dat === "datakril" ? translateText("Yangilash") : "Yangilash" }}
        </button>
      </form>

      <!-- Messages -->
      <div class="mt-4 space-y-3">
        <Transition name="fade">
          <div
            v-if="successMessage"
            class="p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 text-green-800 dark:text-green-400 rounded-lg text-sm"
          >
            {{ successMessage }}
          </div>
        </Transition>
        <Transition name="fade">
          <div
            v-if="errorMessage"
            class="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-800 dark:text-red-400 rounded-lg text-sm"
          >
            {{ errorMessage }}
          </div>
        </Transition>
      </div>
    </div>
  </div>
</Transition>
    <!-- Action Modal -->
    <Transition name="dropdown" appear>
      <div
        v-if="asd"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
        @click.self="func(null)"
      >
        <div
          class="relative bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-lg mx-auto"
        >
          <!-- Header -->
          <div class="px-6 py-5 border-b border-slate-200 dark:border-slate-700">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-200">
                {{ dat === "datakril" ? translateText("Amallar") : "Amallar" }}
              </h3>
              <button
                @click="func(null)"
                class="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors duration-200"
              >
                <svg
                  class="w-5 h-5 text-slate-400"
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
          </div>

          <!-- Content -->
          <div class="p-6 space-y-3">
            <!-- Edit Button -->
            <button
              @click="Modal"
              class="w-full flex items-center p-5 hover:bg-lime-50 dark:hover:bg-lime-900 dark:hover:bg-opacity-30 text-slate-700 dark:text-slate-300 hover:text-lime-700 dark:hover:text-lime-400 rounded-2xl transition-all duration-200 group border border-transparent hover:border-lime-200 dark:hover:border-lime-800"
            >
              <div
                class="flex items-center justify-center w-12 h-12 bg-lime-100 dark:bg-lime-900 dark:bg-opacity-50 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-200"
              >
                <svg
                  class="w-6 h-6 text-lime-600 dark:text-lime-400"
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
              </div>
              <div class="flex-1 text-left">
                <span class="font-semibold text-base block">{{
                  dat === "datakril" ? translateText("Tahrirlash") : "Tahrirlash"
                }}</span>
                <span class="text-sm text-slate-500 dark:text-slate-400 mt-1 block">{{
                  dat === "datakril"
                    ? translateText("Ma'lumotlarni o'zgartirish")
                    : "Ma'lumotlarni o'zgartirish"
                }}</span>
              </div>
              <svg
                class="w-5 h-5 text-slate-400 group-hover:text-lime-500 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </button>

            <!-- Delete Button -->
            <button
              @click="removeSelectedItems"
              class="w-full flex items-center p-5 hover:bg-red-50 dark:hover:bg-red-900 dark:hover:bg-opacity-30 text-slate-700 dark:text-slate-300 hover:text-red-700 dark:hover:text-red-400 rounded-2xl transition-all duration-200 group border border-transparent hover:border-red-200 dark:hover:border-red-800"
            >
              <div
                class="flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900 dark:bg-opacity-50 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-200"
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  ></path>
                </svg>
              </div>
              <div class="flex-1 text-left">
                <span class="font-semibold text-base block">{{
                  dat === "datakril" ? translateText("O'chirish") : "O'chirish"
                }}</span>
                <span class="text-sm text-slate-500 dark:text-slate-400 mt-1 block">{{
                  dat === "datakril"
                    ? translateText("Butunlay o'chirish")
                    : "Butunlay o'chirish"
                }}</span>
              </div>
              <svg
                class="w-5 h-5 text-slate-400 group-hover:text-red-500 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </button>

            <!-- Work Status Toggle -->
            <div
              class="flex items-center justify-between p-5 hover:bg-blue-50 dark:hover:bg-blue-900 dark:hover:bg-opacity-30 rounded-2xl transition-all duration-200 border border-transparent hover:border-blue-200 dark:hover:border-blue-800"
            >
              <div class="flex items-center flex-1">
                <div
                  class="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 dark:bg-opacity-50 rounded-xl mr-4"
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
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    ></path>
                  </svg>
                </div>
                <div class="flex-1">
                  <span
                    class="font-semibold text-base text-slate-700 dark:text-slate-300 block"
                    >{{
                      dat === "datakril"
                        ? translateText("Ishga tushirish")
                        : "Ishga tushirish"
                    }}</span
                  >
                  <span class="text-sm text-slate-500 dark:text-slate-400 mt-1 block">{{
                    dat === "datakril"
                      ? translateText("Faol/nofaol holat")
                      : "Faol/nofaol holat"
                  }}</span>
                </div>
              </div>

              <!-- Toggle Switch -->
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  v-model="selectedCourtWorkStatus"
                  @change="updateWorkStatus"
                  class="sr-only peer"
                />
                <div
                  class="relative w-14 h-7 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-600 peer-checked:after:translate-x-[27px] peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"
                ></div>
              </label>
            </div>

            <!-- Settings Button -->
            <button
              @click="push"
              class="w-full flex items-center p-5 hover:bg-slate-50 dark:hover:bg-slate-700 dark:hover:bg-opacity-50 text-slate-700 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white rounded-2xl transition-all duration-200 group border border-transparent hover:border-slate-200 dark:hover:border-slate-600"
            >
              <div
                class="flex items-center justify-center w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-200"
              >
                <svg
                  class="w-6 h-6 text-slate-600 dark:text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  ></path>
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
              </div>
              <div class="flex-1 text-left">
                <span class="font-semibold text-base block">{{
                  dat === "datakril" ? translateText("Sozlash") : "Sozlash"
                }}</span>
                <span class="text-sm text-slate-500 dark:text-slate-400 mt-1 block">{{
                  dat === "datakril"
                    ? translateText("Qoshimcha sozlamalar")
                    : "Qoshimcha sozlamalar"
                }}</span>
              </div>
              <svg
                class="w-5 h-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
      <!-- Create Button -->
      <div class="flex justify-end">
        <button
          @click="toggleModal"
          class="group flex items-center px-8 py-4 bg-gradient-to-r from-lime-500 via-lime-600 to-emerald-600 dark:from-lime-600 dark:via-lime-700 dark:to-emerald-700 hover:from-lime-600 hover:via-lime-700 hover:to-emerald-700 dark:hover:from-lime-700 dark:hover:via-lime-800 dark:hover:to-emerald-800 text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-2xl dark:shadow-lime-500/20"
        >
          <div
            class="p-2 bg-white/20 rounded-lg mr-3 group-hover:bg-white/30 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              ></path>
            </svg>
          </div>
          <span class="text-lg">{{
            dat === "datakril" ? translateText("Yaratish") : "Yaratish"
          }}</span>
        </button>
      </div>
      <section class="rounded-3xl p-8 md:p-12">
        <div v-if="loading" class="flex flex-col justify-center items-center py-20">
          <div class="relative mb-8">
            <div
              class="animate-spin rounded-full h-16 w-16 border-4 border-lime-200 dark:border-lime-800"
            ></div>
            <div
              class="animate-spin rounded-full h-16 w-16 border-4 border-lime-500 border-t-transparent absolute top-0 left-0"
            ></div>
          </div>
          <p class="text-slate-600 dark:text-slate-400 font-medium">
            {{
              dat === "datakril"
                ? translateText("Ma'lumotlar yuklanmoqda...")
                : "Ma'lumotlar yuklanmoqda..."
            }}
          </p>
        </div>
        <div v-else-if="data.length === 0" class="text-center py-20">
          <div class="relative inline-block mb-8">
            <div
              class="absolute inset-0 bg-gradient-to-r from-lime-400 to-emerald-500 rounded-full blur-xl opacity-20"
            ></div>
            <div class="relative p-6 bg-slate-100 dark:bg-slate-700 rounded-full">
              <svg
                class="w-16 h-16 text-slate-400 dark:text-slate-500 mx-auto"
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
            </div>
          </div>
          <h3 class="text-2xl font-bold text-slate-600 dark:text-slate-400 mb-4">
            {{
              dat === "datakril"
                ? translateText("Hech narsa topilmadi")
                : "Hech narsa topilmadi"
            }}
          </h3>
          <p class="text-slate-500 dark:text-slate-500 text-lg mb-8">
            {{
              dat === "datakril"
                ? translateText("Yangi sud yarating")
                : "Yangi sud yarating"
            }}
          </p>
          <button
            @click="toggleModal"
            class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-lime-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-lime-600 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105"
          >
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
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              ></path>
            </svg>
            {{
              dat === "datakril"
                ? translateText("Birinchi sud yaratish")
                : "Birinchi sud yaratish"
            }}
          </button>
        </div>

        <!-- Courts Grid -->
        <div v-else class="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8">
          <div
            v-for="item in data"
            :key="item.id"
            @click="goToPath(item.id)"
            class="group relative h-[380px] overflow-hidden bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border-2 border-slate-400/50 dark:border-slate-600/50 hover:border-lime-400/50 dark:hover:border-lime-500/50 rounded-2xl p-6 cursor-pointer transition-all hover:shadow-2xl duration-300 shadow-xl dark:hover:shadow-lime-500/10 hover:-translate-y-2 transform"
          >
            <div
              class="absolute inset-0 bg-gradient-to-br from-lime-400/10 to-emerald-500/10 dark:from-lime-400/5 dark:to-emerald-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            ></div>

            <!-- Options Button -->
            <button
              @click.stop="func(item.id, $event)"
              class="absolute top-4 right-4 p-2 opacity-0 group-hover:opacity-100 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-full transition-all duration-200 z-10 backdrop-blur-sm"
            >
              <svg
                class="w-5 h-5 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"
                ></path>
              </svg>
            </button>

            <!-- Court Content -->
            <div class="relative flex flex-col items-center text-center space-y-6">
              <!-- Image -->
              <div
                class="relative group-hover:scale-110 transition-transform duration-300"
              >
                <div
                  class="absolute inset-0 bg-gradient-to-br from-lime-400 to-emerald-500 rounded-2xl blur-md opacity-20 group-hover:opacity-40 transition-opacity"
                ></div>
                <div
                  class="relative h-[250px] w-[370px] bg-gradient-to-br from-lime-100 to-emerald-100 dark:from-lime-900/30 dark:to-emerald-900/30 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-white dark:border-slate-600 shadow-lg"
                >
                  <img
                    v-if="item.img"
                    :src="getImageUrl(item.img)"
                    :alt="dat === 'datakril' ? translateText(item.name) : item.name"
                    class="w-full h-full object-cover"
                  />
                  <svg
                    v-else
                    class="w-10 h-10 text-lime-600 dark:text-lime-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    ></path>
                  </svg>
                </div>
              </div>

              <!-- Name -->
              <div>
                <h4
                  class="font-bold text-lg break-words w-[370px] text-slate-800 dark:text-white group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors duration-200 mb-2 line-clamp-2"
                >
                  {{ dat === "datakril" ? translateText(item.name) : item.name }}
                </h4>

                <div
                  class="w-8 h-0.5 bg-gradient-to-r from-lime-400 to-emerald-500 mx-auto rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                ></div>
              </div>
            </div>

            <!-- Work Status Overlay -->
            <Transition name="fade">
              <div
                v-if="item.workStatus"
                class="absolute inset-0 bg-gradient-to-br from-blue-500/75 via-blue-600/70 to-purple-600/75 dark:from-blue-600/75 dark:via-blue-700/70 dark:to-purple-700/75 backdrop-blur-[2px] rounded-2xl flex items-center justify-center"
              >
                <div class="text-center p-6">
                  <div
                    class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto"
                  >
                    <svg
                      class="w-8 h-8 text-white animate-pulse"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      ></path>
                    </svg>
                  </div>
                  <div
                    class="bg-white/90 dark:bg-white/95 backdrop-blur-sm rounded-xl px-4 py-2"
                  >
                    <span
                      class="text-sm font-bold text-blue-800 dark:text-blue-900 animate-pulse"
                    >
                      {{ dat === "datakril" ? translateText("Tez kunda") : "Tez kunda" }}
                    </span>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useRouter } from "vue-router";
import Upload from "./upload.vue";
import { URL } from "../../auth/url";
import axios from "axios";
import translateText from "@/auth/Translate";
import { inject } from "vue";

// Reactive variables
const onFileChange1 = (event) => {
  file1.value = event.target.files[0];
};
const courtName1 = ref("");
const file1 = ref(null);
const successMessage1 = ref("");
const isLoading = inject('isLoading')
const errorMessage1 = ref("");
const PutId = ref(0);
const router = useRouter();
const url = `${URL}/courts`;
const imageBaseUrl = `${URL}/upload`;
const showModal = ref(false);
const PutModal = ref(false);
const asd = ref(false);
const selectedId = ref(null);
const selectedCourtWorkStatus = ref(false);
const data = ref([]);
const userId = ref(localStorage.getItem("id") || "0");
const loading = ref(true);
const courtName = ref("");
const file = ref(null);
const successMessage = ref("");
const errorMessage = ref("");
const modalPosition = ref({});
const dat = ref(localStorage.getItem("til") || "datalotin");

const uploadCourt = async () => {
  const formData = new FormData();
  formData.append("name", courtName1.value);
  formData.append("file", file1.value);
isLoading.value = true;
  try {
    await axios.post(`${URL}/courts`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    successMessage1.value = "Court muvaffaqiyatli yuklandi!";
    errorMessage1.value = "";
    courtName1.value = "";
    file1.value = null;
    getData(); // Ma'lumotlarni yangilash
    showModal.value = false; // Modalni yopish
  } catch (error) {
    errorMessage1.value = "Yuklashda xato yuz berdi!";
    successMessage1.value = "";
    console.error("Xatolik:", error);
  } finally{isLoading.value = false}
};
// Methods
const toggleModal = () => {
  showModal.value = !showModal.value;
  clearMessages();
};

const Modal = () => {
  PutModal.value = !PutModal.value;
  asd.value = !asd.value;
  clearMessages();
};

const clearMessages = () => {
  successMessage.value = "";
  errorMessage.value = "";
  setTimeout(() => {
    successMessage.value = "";
    errorMessage.value = "";
  }, 5000);
};

function push() {
  router.push(`/setting/${selectedId.value}`);
}

const func = async (id, event) => {
  if (id === null) {
    asd.value = false;
    return;
  }

  if (event) {
    const modalWidth = 300; // Modalning taxminiy eni (px)
    const modalHeight = 200; // Modalning taxminiy bo'yi (px)

    const padding = 10; // Ekran chetidan masofa

    let left = event.clientX;
    let top = event.clientY;

    // Agar modal o'ng tomonga chiqib ketsa
    if (left + modalWidth > window.innerWidth) {
      left = window.innerWidth - modalWidth - padding;
    }

    // Agar modal pastga chiqib ketsa
    if (top + modalHeight > window.innerHeight) {
      top = window.innerHeight - modalHeight - padding;
    }

    // Sal o'ngga/pastga surib ko‘rinarli qilish (ixtiyoriy)
    left = Math.max(left, padding);
    top = Math.max(top, padding);

    modalPosition.value = {
      top: `${top}px`,
      left: `${left}px`,
    };
  }

  selectedId.value = id;
  PutId.value = id;
  asd.value = !asd.value;
isLoading.value = true;
  try {
    const response = await axios.get(`${URL}/courts/${id}`);
    if (response.status === 200) {
      courtName.value = response.data.name;
      selectedCourtWorkStatus.value = response.data.workStatus;
    }
  } catch (error) {
    console.error("Xatolik:", error);
    errorMessage.value =
      dat === "datakril"
        ? translateText("Ma'lumotlarni yuklashda xatolik yuz berdi")
        : "Ma'lumotlarni yuklashda xatolik yuz berdi";
  } finally{isLoading.value = false}
};
const getData = async () => {
  isLoading.value = true;
  loading.value = true;
  errorMessage.value = null;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP xato: ${response.status}`);

    const result = await response.json();
    const role = localStorage.getItem("role");

    let filteredData = result.filter((item) => item.status === "active"); // faqat active statusli

    if (role !== "bigAdmin") {
      const targetId = String(userId.value).trim();

      filteredData = filteredData.filter((item) => {
        if (!Array.isArray(item.allowed)) return false;

        return item.allowed.some((u) => {
          if (typeof u.userId === "undefined") return false;
          return String(u.userId).trim() === targetId;
        });
      });
    }

    // id bo‘yicha saralash
    filteredData.sort((a, b) => a.id - b.id);
    data.value = filteredData;
  } catch (error) {
    console.error("Xatolik:", error);
    errorMessage.value =
      dat === "datakril"
        ? translateText("Ma'lumotlarni yuklashda xatolik yuz berdi")
        : "Ma'lumotlarni yuklashda xatolik yuz berdi";
  } finally {
    loading.value = false;
    isLoading.value = false
  }
};

const removeSelectedItems = async () => {
  if (!selectedId.value) return;

  if (
    !confirm(
      dat === "datakril"
        ? translateText("Rostdan ham o'chirmoqchimisiz?")
        : "Rostdan ham o'chirmoqchimisiz?"
    )
  )
    return;
isLoading.value = true;
  try {
    const response = await fetch(`${url}/${selectedId.value}`, {
      method: "DELETE",
    });
    if (response.ok) {
      data.value = data.value.filter((item) => item.id !== selectedId.value);
      asd.value = false;
      successMessage.value =
        dat === "datakril"
          ? translateText("Muvaffaqiyatli o'chirildi")
          : "Muvaffaqiyatli o'chirildi";
    } else {
      console.error("O'chirishda xatolik:", response.statusText);
      errorMessage.value =
        dat === "datakril"
          ? translateText("O'chirishda xatolik yuz berdi")
          : "O'chirishda xatolik yuz berdi";
    }
  } catch (error) {
    console.error("Xatolik:", error);
    errorMessage.value =
      dat === "datakril"
        ? translateText("O'chirishda xatolik yuz berdi")
        : "O'chirishda xatolik yuz berdi";
  }finally{isLoading.value = false}
};

const getImageUrl = (filename) => `${imageBaseUrl}/${filename}`;

const goToPath = (id) => {
  router.push(`/AdminPath/${id}`);
};

const onFileChange = (event) => {
  file.value = event.target.files[0];
};

const updateCourt = async () => {
  if (!courtName.value.trim()) {
    errorMessage.value =
      dat === "datakril" ? translateText("Sud nomini kiriting") : "Sud nomini kiriting";
    return;
  }

  const formData = new FormData();
  formData.append("name", courtName.value.trim());
  if (file.value) formData.append("file", file.value);
isLoading.value = true;
  try {
    const response = await axios.put(`${URL}/courts/${PutId.value}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (response.status === 200) {
      const updatedCourt = response.data;
      const index = data.value.findIndex((item) => item.id === PutId.value);
      if (index !== -1) {
        data.value[index] = updatedCourt;
      }
      successMessage.value =
        dat === "datakril"
          ? translateText("Muvaffaqiyatli yangilandi!")
          : "Muvaffaqiyatli yangilandi!";
      courtName.value = "";
      file.value = null;
      PutModal.value = false;
      asd.value = false;
    }
  } catch (error) {
    errorMessage.value =
      dat === "datakril"
        ? translateText(
            "Yangilashda xatolik yuz berdi: " +
              (error.response?.data?.message || error.message)
          )
        : "Yangilashda xatolik yuz berdi: " +
          (error.response?.data?.message || error.message);
  }finally{
    isLoading.value = false
  }
};

const updateWorkStatus = async () => {
  isLoading.value = true;
  try {
    const response = await axios.put(`${URL}/courts/${selectedId.value}`, {
      workStatus: selectedCourtWorkStatus.value,
    });
    if (response.status === 200) {
      const updatedCourt = response.data;
      const index = data.value.findIndex((item) => item.id === selectedId.value);
      if (index !== -1) {
        data.value[index] = updatedCourt;
      }
      successMessage.value =
        dat === "datakril"
          ? translateText("Holat muvaffaqiyatli yangilandi!")
          : "Holat muvaffaqiyatli yangilandi!";
    }
  } catch (error) {
    errorMessage.value =
      dat === "datakril"
        ? translateText(
            "Holatni yangilashda xatolik yuz berdi: " +
              (error.response?.data?.message || error.message)
          )
        : "Holatni yangilashda xatolik yuz berdi: " +
          (error.response?.data?.message || error.message);
    selectedCourtWorkStatus.value = !selectedCourtWorkStatus.value;
  } finally{
    isLoading.value = false
  }
};

// Watchers
watch([showModal, PutModal, asd], ([modalOpen, putModalOpen, asdOpen]) => {
  if (modalOpen || putModalOpen || asdOpen) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
});

watch([successMessage, errorMessage], () => {
  if (successMessage.value || errorMessage.value) {
    setTimeout(() => {
      successMessage.value = "";
      errorMessage.value = "";
    }, 5000);
  }
});

onMounted(() => {
  getData();
});

onUnmounted(() => {
  document.body.style.overflow = "";
});
</script>

<style scoped>
/* [Previous styles unchanged, included for completeness] */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(-20px);
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-15px) scale(0.95);
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.switch {
  position: relative;
  display: inline-block;
  width: 56px;
  height: 28px;
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
  background: linear-gradient(135deg, #cbd5e1, #94a3b8);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 28px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.slider:before {
  position: absolute;
  content: "";
  height: 22px;
  width: 22px;
  left: 3px;
  bottom: 3px;
  background: linear-gradient(135deg, #ffffff, #f8fafc);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 50%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1);
}

input:checked + .slider {
  background: linear-gradient(135deg, #10b981, #059669);
  box-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
}

input:checked + .slider:before {
  transform: translateX(28px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2), 0 2px 6px rgba(0, 0, 0, 0.1);
}

@media (prefers-color-scheme: dark) {
  .slider {
    background: linear-gradient(135deg, #475569, #334155);
  }

  input:checked + .slider {
    background: linear-gradient(135deg, #22c55e, #16a34a);
    box-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
  }
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(241, 245, 249, 0.8);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #cbd5e1, #94a3b8);
  border-radius: 4px;
  transition: background 0.3s ease;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #94a3b8, #64748b);
}

@media (prefers-color-scheme: dark) {
  ::-webkit-scrollbar-track {
    background: rgba(51, 65, 85, 0.8);
  }

  ::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #475569, #334155);
  }

  ::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #64748b, #475569);
  }
}

.group:hover .card-glow {
  opacity: 1;
  transform: scale(1.05);
}

@keyframes gradient-shift {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradient-shift 3s ease infinite;
}

.mygr {
  box-shadow: 0px 81px 400px -62px rgba(20, 255, 0, 1);
  -webkit-box-shadow: 0px 81px 400px -62px rgba(20, 255, 0, 1);
  -moz-box-shadow: 0px 81px 400px -62px rgba(20, 255, 0, 1);
}

@keyframes pulse-ring {
  0% {
    transform: scale(0.33);
  }
  40%,
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: scale(1.33);
  }
}

.pulse-ring {
  animation: pulse-ring 1.25s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
}

@supports (backdrop-filter: blur(10px)) {
  .backdrop-blur-custom {
    backdrop-filter: blur(10px) saturate(150%);
  }
}

.focus-ring:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.3);
}

.dark .glass-effect {
  background: rgba(51, 65, 85, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(148, 163, 184, 0.1);
}

* {
  transition-property: color, background-color, border-color, text-decoration-color, fill,
    stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

@media print {
  .no-print {
    display: none !important;
  }

  .print-optimize {
    background: white !important;
    color: black !important;
    box-shadow: none !important;
  }
}

@media (prefers-contrast: high) {
  .contrast-enhance {
    border: 2px solid currentColor;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

@media (max-width: 640px) {
  .mobile-optimize {
    font-size: 16px;
  }
}

@supports (-webkit-touch-callout: none) {
  .safari-fix {
    transform: translateZ(0);
  }
}
</style>
