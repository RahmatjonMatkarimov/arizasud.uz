<template>
  <div
    v-if="showModal"
    class="fixed inset-0 z-50 w-full h-full flex items-center justify-center bg-black/40 dark:bg-black/70 backdrop-blur-md"
    @click.self="toggleModal(),showModal = false"
  >
    <div @click.stop
      class="relative w-full max-w-lg mx-4 transform transition-all duration-300 ease-out"
    >
      <!-- Modal Container with Glass Effect -->
      <div
        class="relative bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 overflow-hidden"
      >
        <!-- Modern Header -->
        <div
          class="relative px-8 py-6 bg-gradient-to-br from-slate-50/80 to-blue-50/60 dark:from-gray-800/80 dark:to-gray-900/60 backdrop-blur-sm"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div
                class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg"
              >
                <svg
                  class="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                {{
                  dat === "datakril"
                    ? translateText("Bo'lim yaratish")
                    : "Bo'lom yaratish"
                }}
              </h3>
            </div>
            <button
              @click="toggleModal"
              class="w-10 h-10 bg-gray-100/80 dark:bg-gray-700/80 hover:bg-gray-200/80 dark:hover:bg-gray-600/80 rounded-full flex items-center justify-center transition-all duration-200 group backdrop-blur-sm"
            >
              <svg
                class="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors"
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

        <!-- Form Content -->
        <div class="px-8 py-6">
          <form @submit.prevent="uploadCourt" class="space-y-6">
            <!-- Court Name Input -->
            <div class="space-y-2">
              <label
                for="name"
                class="block text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                {{ dat === "datakril" ? translateText("Bo'lim nomi") : "Bo'lim nomi" }}
              </label>
              <div class="relative">
                <input
                  v-model="courtName"
                  type="text"
                  id="name"
                  required
                  class="w-full px-4 py-4 bg-gray-50/80 dark:bg-gray-800/80 border border-gray-200/60 dark:border-gray-700/60 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 outline-none backdrop-blur-sm shadow-sm hover:shadow-md"
                  :placeholder="
                    dat === 'datakril'
                      ? translateText('Bo\'lim nomini kiriting')
                      : 'Bo\'lim nomini kiriting'
                  "
                />
                <div
                  class="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-purple-500/0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                ></div>
              </div>
            </div>

            <!-- File Upload Area -->
            <div class="space-y-2">
              <label
                for="file"
                class="block text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                {{ dat === "datakril" ? translateText("Fayl yuklash") : "Fayl yuklash" }}
              </label>
              <div class="relative">
                <input
                  @change="onFileChange"
                  type="file"
                  id="file"
                  accept="image/*"
                  class="hidden"
                />
                <label
                  for="file"
                  class="relative flex flex-col items-center justify-center w-full h-32 bg-gray-50/80 dark:bg-gray-800/80 border-2 border-dashed border-gray-300/60 dark:border-gray-600/60 rounded-2xl cursor-pointer hover:bg-gray-100/80 dark:hover:bg-gray-700/80 transition-all duration-300 group backdrop-blur-sm shadow-sm hover:shadow-lg hover:border-blue-400/60"
                >
                  <div class="flex flex-col items-center justify-center pt-5 pb-6">
                    <div
                      class="w-12 h-12 mb-3 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md"
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
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        ></path>
                      </svg>
                    </div>
                    <p class="mb-2 text-sm text-gray-600 dark:text-gray-400 font-medium">
                      <span class="font-semibold">{{
                        dat === "datakril"
                          ? translateText("Fayl yuklash uchun bosing")
                          : "Fayl yuklash uchun bosing"
                      }}</span>
                    </p>
                  </div>
                  <!-- Subtle glow effect on hover -->
                  <div
                    class="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400/10 via-transparent to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  ></div>
                </label>
              </div>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              class="relative w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 overflow-hidden group"
            >
              <!-- Button shine effect -->
              <div
                class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
              ></div>

              <span class="relative flex items-center justify-center text-base">
                <svg
                  class="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  ></path>
                </svg>
                {{ dat === "datakril" ? translateText("Yaratish") : "Yaratish" }}
              </span>
            </button>
          </form>

          <!-- Status Messages -->
          <div v-if="successMessage || errorMessage" class="mt-6 space-y-3">
            <div
              v-if="successMessage"
              class="flex items-center p-4 bg-green-50/80 dark:bg-green-900/30 border border-green-200/60 dark:border-green-800/60 rounded-2xl backdrop-blur-sm shadow-sm"
            >
              <div
                class="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-md"
              >
                <svg
                  class="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2.5"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
              <p class="ml-3 text-sm font-medium text-green-800 dark:text-green-300">
                {{ dat === "datakril" ? translateText(successMessage) : successMessage }}
              </p>
            </div>

            <div
              v-if="errorMessage"
              class="flex items-center p-4 bg-red-50/80 dark:bg-red-900/30 border border-red-200/60 dark:border-red-800/60 rounded-2xl backdrop-blur-sm shadow-sm"
            >
              <div
                class="flex-shrink-0 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-md"
              >
                <svg
                  class="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2.5"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <p class="ml-3 text-sm font-medium text-red-800 dark:text-red-300">
                {{ dat === "datakril" ? translateText(errorMessage) : errorMessage }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal Backdrop -->
  <div
    v-if="showModalfiles"
    class="fixed inset-0 z-50 w-full h-full flex items-center bg-gradient-to-br from-black/60 via-gray-900/70 to-black/60 backdrop-blur-md justify-center p-4 animate-in fade-in duration-300"
    @click="toggleFilesModal"
  >
    <!-- Modal Container -->
    <div
      class="relative max-w-lg w-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 transform transition-all duration-500 animate-in zoom-in-95 slide-in-from-bottom-4"
      @click.stop
    >
      <!-- Decorative Elements -->
      <div
        class="absolute -top-1 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
      ></div>
      <div
        class="absolute -top-2 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-pulse"
      ></div>
      <div
        class="absolute -top-2 right-1/4 w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-150"
      ></div>

      <!-- Close Button -->
      <button
        @click="toggleFilesModal"
        class="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300 z-10 group border-4 border-white dark:border-gray-800"
      >
        <svg
          class="w-6 h-6 group-hover:rotate-90 transition-transform duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2.5"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <!-- Modal Header -->
      <div class="px-8 pt-10 pb-6 text-center relative">
        <!-- Background Pattern -->
        <div
          class="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50 dark:from-blue-900/20 dark:via-purple-900/10 dark:to-pink-900/20 rounded-t-3xl"
        ></div>

        <!-- Icon Container -->
        <div
          class="relative z-10 w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transform hover:scale-105 transition-transform duration-300 animate-pulse"
        >
          <div
            class="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 rounded-2xl blur-lg opacity-60 animate-pulse"
          ></div>
          <svg
            class="relative z-10 w-10 h-10 text-white drop-shadow-lg"
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
        </div>

        <!-- Title -->
        <h2
          class="relative z-10 text-3xl font-bold bg-gradient-to-r from-gray-800 via-gray-600 to-gray-800 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent mb-3"
        >
          {{ dat === "datakril" ? translateText("Fayl yuklash") : "Fayl yuklash" }}
        </h2>
        <p class="relative z-10 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
          {{
            dat === "datakril"
              ? translateText("Tizimga yuklash uchun fayl va sud nomini tanlang")
              : "Tizimga yuklash uchun fayl va sud nomini tanlang"
          }}
        </p>
      </div>

      <!-- Modal Body -->
      <div class="px-8 pb-8">
        <form @submit.prevent="uploadfile" class="space-y-8">
          <!-- Court Name Input -->
          <div class="space-y-3">
            <label
              for="name"
              class="block text-sm font-semibold text-gray-700 dark:text-gray-200"
            >
              <span class="flex items-center gap-2">
                <div
                  class="w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-md flex items-center justify-center"
                >
                  <svg
                    class="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                {{
                  dat === "datakril"
                    ? translateText("Fayl nomi kiriting")
                    : "Fayl nomini kiriting"
                }}
              </span>
            </label>
            <div class="relative group">
              <div
                class="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300"
              ></div>
              <input
                v-model="courtName"
                type="text"
                id="name"
                required
                :placeholder="
                  dat === 'datakril'
                    ? translateText('Fayl nomini kiriting')
                    : 'Fayl nomini kiriting'
                "
                class="relative w-full px-6 py-4 bg-gray-50/80 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition-all duration-300 group-hover:bg-gray-100/80 dark:group-hover:bg-gray-600/50 text-lg"
              />
              <div class="absolute inset-y-0 right-0 flex items-center pr-4">
                <div
                  class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center opacity-60 group-focus-within:opacity-100 transition-all duration-300"
                >
                  <svg
                    class="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- File Input -->
          <div class="space-y-3">
            <label
              for="file"
              class="block text-sm font-semibold text-gray-700 dark:text-gray-200"
            >
              <span class="flex items-center gap-2">
                <div
                  class="w-5 h-5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-md flex items-center justify-center"
                >
                  <svg
                    class="w-3 h-3 text-white"
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
                </div>
                {{
                  dat === "datakril" ? translateText("Faylni tanlang") : "Faylni tanlang"
                }}
              </span>
            </label>

            <!-- File Drop Zone -->
            <div class="relative group">
              <div
                class="absolute inset-0 bg-gradient-to-br from-green-500/20 via-blue-500/20 to-purple-500/20 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500"
              ></div>
              <div
                class="relative border-3 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 bg-gradient-to-br from-gray-50/50 via-blue-50/30 to-purple-50/30 dark:from-gray-800/50 dark:via-blue-900/20 dark:to-purple-900/20 group-hover:bg-gradient-to-br group-hover:from-blue-50/60 group-hover:via-purple-50/40 group-hover:to-pink-50/40 dark:group-hover:from-blue-900/30 dark:group-hover:via-purple-900/20 dark:group-hover:to-pink-900/20"
              >
                <input
                  @change="onFileChange"
                  type="file"
                  id="file"
                  class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div class="text-center space-y-4">
                  <!-- Upload Icon -->
                  <div
                    class="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg"
                  >
                    <svg
                      class="h-8 w-8 text-white"
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
                  </div>

                  <!-- Upload Text -->
                  <div class="space-y-2">
                    <p class="text-lg font-semibold text-gray-700 dark:text-gray-300">
                      <span
                        class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                        >{{
                          dat === "datakril"
                            ? translateText("Fayl yuklash")
                            : "Fayl yuklash"
                        }}</span
                      >
                      {{
                        dat === "datakril"
                          ? translateText("uchun bosing")
                          : "uchun bosing"
                      }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="pt-4">
            <button
              type="submit"
              class="w-full py-5 px-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group text-lg"
            >
              <!-- Button Shine Effect -->
              <div
                class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-12"
              ></div>

              <!-- Button Content -->
              <span class="flex items-center justify-center space-x-3 relative z-10">
                <svg
                  class="w-6 h-6 group-hover:animate-bounce"
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
                <span class="tracking-wide">{{
                  dat === "datakril" ? translateText("Yuklash") : "Yuklash"
                }}</span>
                <div class="w-2 h-2 bg-white rounded-full group-hover:animate-ping"></div>
              </span>
            </button>
          </div>
        </form>

        <!-- Success Message -->
        <div
          v-if="successMessage"
          class="mt-6 p-6 bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 dark:from-green-900/30 dark:via-emerald-900/30 dark:to-teal-900/30 border-2 border-green-200 dark:border-green-700 rounded-2xl shadow-lg animate-in slide-in-from-bottom-2 duration-500"
        >
          <div class="flex items-center space-x-4">
            <div class="flex-shrink-0">
              <div
                class="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center animate-bounce"
              >
                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </div>
            </div>
            <div class="flex-1">
              <h4 class="text-lg font-semibold text-green-800 dark:text-green-200">
                {{ dat === "datakril" ? translateText("Muvaffaqiyat") : "Muvaffaqiyat" }}!
              </h4>
              <p class="text-green-700 dark:text-green-300 text-sm mt-1">
                {{ dat === "datakril" ? translateText(successMessage) : successMessage }}
              </p>
            </div>
            <div class="flex-shrink-0">
              <div
                class="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center"
              >
                <div class="w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Error Message -->
        <div
          v-if="errorMessage"
          class="mt-6 p-6 bg-gradient-to-r from-red-50 via-pink-50 to-rose-50 dark:from-red-900/30 dark:via-pink-900/30 dark:to-rose-900/30 border-2 border-red-200 dark:border-red-700 rounded-2xl shadow-lg animate-in slide-in-from-bottom-2 duration-500"
        >
          <div class="flex items-center space-x-4">
            <div class="flex-shrink-0">
              <div
                class="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse"
              >
                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </div>
            </div>
            <div class="flex-1">
              <h4 class="text-lg font-semibold text-red-800 dark:text-red-200">
                {{ dat === "datakril" ? translateText("Xatolik") : "Xatolik" }}!
              </h4>
              <p class="text-red-700 dark:text-red-300 text-sm mt-1">
                {{ dat === "datakril" ? translateText(errorMessage) : errorMessage }}
              </p>
            </div>
            <div class="flex-shrink-0">
              <div
                class="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center"
              >
                <div class="w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="px-8 pb-6">
        <div
          class="flex items-center justify-center space-x-2 text-xs text-gray-400 dark:text-gray-500"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <span>{{
            dat === "datakril"
              ? translateText("Ma'lumotlaringiz xavfsiz va shifrlangan")
              : "Ma'lumotlaringiz xavfsiz va shifrlangan"
          }}</span>
        </div>
      </div>
    </div>
  </div>

  <div
    v-if="fileModal" @click="fileModal = false"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 dark:bg-black/90 backdrop-blur-md animate-in fade-in duration-300"
  >
    <!-- Main Modal Container -->
    <div @click.stop
      class="relative w-full max-w-lg transform animate-in zoom-in-95 duration-300 slide-in-from-bottom-4"
    >
      <!-- Glassmorphism Background -->
      <div
        class="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/95 via-white/90 to-white/95 dark:from-gray-900/95 dark:via-gray-800/90 dark:to-gray-900/95 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-2xl"
      ></div>

      <!-- Content Container -->
      <div class="relative overflow-hidden rounded-3xl">
        <!-- Header Section with Gradient -->
        <div
          class="relative bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 p-8 text-white"
        >
          <!-- Decorative Elements -->
          <div
            class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"
          ></div>
          <div
            class="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"
          ></div>

          <!-- Close Button -->
          <button
            @click="fileModal = false"
            class="absolute z-50 top-6 right-6 w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50 group"
          >
            <svg
              class="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-200"
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

          <!-- Header Content -->
          <div class="relative">
            <div class="flex items-center space-x-4 mb-3">
              <div
                class="w-16 h-16 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20"
              >
                <svg
                  class="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.002 4.002 0 003 15z"
                  ></path>
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M9 12l2 2 4-4"
                  ></path>
                </svg>
              </div>
              <div>
                <h2 class="text-2xl font-bold mb-1">
                  {{
                    dat === "datakril"
                      ? translateText("Fayl yangilash")
                      : "Fayl yangilash"
                  }}
                </h2>
              </div>
            </div>
          </div>
        </div>

        <!-- Form Section -->
        <div class="relative bg-white dark:bg-gray-900 p-8">
          <form @submit.prevent="updatefileCourt" class="space-y-6">
            <!-- Court Name Input -->
            <div class="group">
              <label
                for="name"
                class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3"
              >
                {{ dat === "datakril" ? translateText("Nom kiriting") : "Nom kiriting" }}
              </label>
              <div class="relative">
                <div
                  class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
                >
                  <svg
                    class="w-5 h-5 text-gray-400 dark:text-gray-500 group-focus-within:text-blue-500 transition-colors"
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
                <input
                  v-model="courtName"
                  type="text"
                  id="name"
                  required
                  class="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 text-base"
                  :placeholder="
                    dat === 'datakril'
                      ? translateText('Fayl nomini kiriting')
                      : 'Fayl nomini kiriting'
                  "
                />
              </div>
            </div>

            <!-- File Upload Section -->
            <div class="group">
              <label
                for="file"
                class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3"
              >
                {{
                  dat === "datakril" ? translateText("Faylni tanlang") : "Faylni tanlang"
                }}
              </label>

              <!-- Custom File Upload Area -->
              <div class="relative">
                <input
                  @change="onFileChange"
                  type="file"
                  id="file"
                  class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div
                  class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 text-center hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-all duration-300 group-hover:scale-[1.02]"
                >
                  <div
                    class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/50 dark:to-cyan-900/50 rounded-2xl flex items-center justify-center"
                  >
                    <svg
                      class="w-8 h-8 text-blue-600 dark:text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      ></path>
                    </svg>
                  </div>
                  <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    {{
                      dat === "datakril"
                        ? translateText("Faylni bu yerga tashlang")
                        : "Faylni bu yerga tashlang"
                    }}
                  </h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    {{
                      dat === "datakril"
                        ? translateText("yoki bosing va tanlang")
                        : "yoki bosing va tanlang"
                    }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="button"
                @click="fileModal = false"
                class="flex-1 px-6 py-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-500/10 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {{ dat === "datakril" ? translateText("Bekor qilish") : "Bekor qilish" }}
              </button>
              <button
                type="submit"
                class="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/25 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group"
              >
                <span class="relative z-10 flex items-center justify-center space-x-2">
                  <svg
                    class="w-5 h-5 group-hover:rotate-12 transition-transform duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    ></path>
                  </svg>
                  <span>{{
                    dat === "datakril" ? translateText("Yuklash") : "Yuklash"
                  }}</span>
                </span>
                <div
                  class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                ></div>
              </button>
            </div>
          </form>

          <!-- Messages Section -->
          <div class="mt-8 space-y-4">
            <!-- Success Message -->
            <div
              v-if="successMessage"
              class="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 border border-green-200 dark:border-green-800 rounded-2xl flex items-start space-x-4 animate-in slide-in-from-top duration-500"
            >
              <div
                class="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg"
              >
                <svg
                  class="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
              <div>
                <h4 class="font-semibold text-green-800 dark:text-green-300 mb-1">
                  {{
                    dat === "datakril"
                      ? translateText("Muvaffaqiyatli")
                      : "Muvaffaqiyatli"
                  }}!
                </h4>
                <p class="text-green-700 dark:text-green-400 text-sm">
                  {{
                    dat === "datakril" ? translateText(successMessage) : successMessage
                  }}
                </p>
              </div>
            </div>

            <!-- Error Message -->
            <div
              v-if="errorMessage"
              class="p-6 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/50 dark:to-rose-950/50 border border-red-200 dark:border-red-800 rounded-2xl flex items-start space-x-4 animate-in slide-in-from-top duration-500"
            >
              <div
                class="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg"
              >
                <svg
                  class="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <div>
                <h4 class="font-semibold text-red-800 dark:text-red-300 mb-1">
                  {{
                    dat === "datakril"
                      ? translateText("Xatolik yuz berdi")
                      : "Xatolik yuz berdi"
                  }}!
                </h4>
                <p class="text-red-700 dark:text-red-400 text-sm">
                  {{ dat === "datakril" ? translateText(errorMessage) : errorMessage }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div
    v-if="PutModal" @click="PutModal = false"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 dark:bg-black/90 backdrop-blur-md animate-in fade-in duration-300"
  >
    <!-- Main Modal Container -->
    <div @click.stop
      class="relative w-full max-w-lg transform animate-in zoom-in-95 duration-300 slide-in-from-bottom-4"
    >
      <!-- Glassmorphism Background -->
      <div
        class="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/95 via-white/90 to-white/95 dark:from-gray-900/95 dark:via-gray-800/90 dark:to-gray-900/95 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-2xl"
      ></div>

      <!-- Content Container -->
      <div class="relative overflow-hidden rounded-3xl">
        <!-- Header Section with Gradient -->
        <div
          class="relative bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 p-8 text-white"
        >
          <!-- Decorative Elements -->
          <div
            class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"
          ></div>
          <div
            class="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"
          ></div>

          <!-- Close Button -->
          <button
            @click="PutModal = false"
            class="absolute z-50 top-6 right-6 w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50 group"
          >
            <svg
              class="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-200"
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

          <!-- Header Content -->
          <div class="relative">
            <div class="flex items-center space-x-4 mb-3">
              <div
                class="w-16 h-16 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20"
              >
                <svg
                  class="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  ></path>
                </svg>
              </div>
              <div>
                <h2 class="text-2xl font-bold mb-1">
                  {{
                    dat === "datakril"
                      ? translateText("Ma'lumot Yangilash")
                      : "Ma'lumot Yangilash"
                  }}
                </h2>
                <p class="text-white/80 text-sm">
                  {{
                    dat === "datakril"
                      ? translateText("Bo'lim ma'lumotlarini tahrirlash")
                      : "Bo'lim ma'lumotlarini tahrirlash"
                  }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Form Section -->
        <div class="relative bg-white dark:bg-gray-900 p-8">
          <form @submit.prevent="updateCourt" class="space-y-6">
            <!-- Court Name Input -->
            <div class="group">
              <label
                for="name"
                class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3"
              >
                {{
                  dat === "datakril"
                    ? translateText("Bo'lim nomini kiriting")
                    : "Bo'lim nomini kiriting"
                }}
              </label>
              <div class="relative">
                <div
                  class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
                >
                  <svg
                    class="w-5 h-5 text-gray-400 dark:text-gray-500 group-focus-within:text-blue-500 transition-colors"
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
                <input
                  v-model="courtName"
                  type="text"
                  id="name"
                  required
                  class="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 text-base"
                  :placeholder="
                    dat === 'datakril'
                      ? translateText('Bo\'lim nomini kiriting')
                      : 'Bo\'lim nomini kiriting'
                  "
                />
              </div>
            </div>

            <!-- Image Upload Section -->
            <div class="group">
              <label
                for="file"
                class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3"
              >
                {{
                  dat === "datakril" ? translateText("Rasmni tanlang") : "Rasmni tanlang"
                }}
              </label>

              <!-- Custom Image Upload Area -->
              <div class="relative">
                <input
                  @change="onFileChange"
                  type="file"
                  id="file"
                  accept="image/*"
                  class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div
                  class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 text-center hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-all duration-300 group-hover:scale-[1.02]"
                >
                  <div
                    class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/50 dark:to-cyan-900/50 rounded-2xl flex items-center justify-center"
                  >
                    <svg
                      class="w-8 h-8 text-blue-600 dark:text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      ></path>
                    </svg>
                  </div>
                  <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    {{
                      dat === "datakril"
                        ? translateText("Rasmni bu yerga tashlang")
                        : "Rasmni bu yerga tashlang"
                    }}
                  </h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    {{
                      dat === "datakril"
                        ? translateText("yoki bosing va tanlang")
                        : "yoki bosing va tanlang"
                    }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="button"
                @click="Modal"
                class="flex-1 px-6 py-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-500/10 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {{ dat === "datakril" ? translateText("Bekor qilish") : "Bekor qilish" }}
              </button>
              <button
                type="submit"
                class="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/25 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group"
              >
                <span class="relative z-10 flex items-center justify-center space-x-2">
                  <svg
                    class="w-5 h-5 group-hover:rotate-12 transition-transform duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    ></path>
                  </svg>
                  <span>{{
                    dat === "datakril" ? translateText("Yuklash") : "Yuklash"
                  }}</span>
                </span>
                <div
                  class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                ></div>
              </button>
            </div>
          </form>

          <!-- Messages Section -->
          <div class="mt-8 space-y-4">
            <!-- Success Message -->
            <div
              v-if="successMessage"
              class="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 border border-green-200 dark:border-green-800 rounded-2xl flex items-start space-x-4 animate-in slide-in-from-top duration-500"
            >
              <div
                class="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg"
              >
                <svg
                  class="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
              <div>
                <h4 class="font-semibold text-green-800 dark:text-green-300 mb-1">
                  {{
                    dat === "datakril"
                      ? translateText("Muvaffaqiyatli")
                      : "Muvaffaqiyatli"
                  }}!
                </h4>
                <p class="text-green-700 dark:text-green-400 text-sm">
                  {{
                    dat === "datakril" ? translateText(successMessage) : successMessage
                  }}
                </p>
              </div>
            </div>

            <!-- Error Message -->
            <div
              v-if="errorMessage"
              class="p-6 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/50 dark:to-rose-950/50 border border-red-200 dark:border-red-800 rounded-2xl flex items-start space-x-4 animate-in slide-in-from-top duration-500"
            >
              <div
                class="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg"
              >
                <svg
                  class="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <div>
                <h4 class="font-semibold text-red-800 dark:text-red-300 mb-1">
                  {{
                    dat === "datakril"
                      ? translateText("Xatolik yuz berdi")
                      : "Xatolik yuz berdi"
                  }}
                </h4>
                <p class="text-red-700 dark:text-red-400 text-sm">
                  {{ dat === "datakril" ? translateText(errorMessage) : errorMessage }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div
    v-if="asd"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    @click.self="func(null)"
  >
    <!-- Modal Container -->
    <div @click.stop class="relative w-full max-w-md mx-4 transition-all duration-500 ease-out">
      <!-- Modal Content -->
      <div
        class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <!-- Close Button -->
        <button
          @click="func(null)"
          class="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-all duration-200 group"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <!-- Header Section -->
        <div class="px-6 pt-8 pb-2">
          <div class="text-center">
            <!-- Icon -->
            <div
              class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg"
            >
              <svg
                class="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>

            <!-- Title -->
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {{
                dat === "datakril"
                  ? translateText("Boshqaruv paneli")
                  : "Boshqaruv paneli"
              }}
            </h2>
            <p class="text-gray-600 dark:text-gray-400 text-sm">
              {{
                dat === "datakril"
                  ? translateText("Elementni tahrirlash yoki boshqarish")
                  : "Elementni tahrirlash yoki boshqarish"
              }}
            </p>
          </div>
        </div>

        <!-- Main Content -->
        <div v-if="selectedItem" class="px-6 py-4 space-y-4">
          <!-- Edit Button -->
          <button
            @click="Modal"
            class="group relative w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-start space-x-3 overflow-hidden"
          >
            <!-- Hover Effect -->
            <div
              class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"
            ></div>

            <!-- Icon Container -->
            <div
              class="relative w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-all duration-300 group-hover:rotate-6 group-hover:scale-110"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>

            <!-- Text -->
            <span class="relative text-lg font-medium">{{
              dat === "datakril"
                ? translateText("Elementni tahrirlash yoki boshqarish")
                : "Elementni tahrirlash yoki boshqarish"
            }}</span>
          </button>

          <!-- Delete Button -->
          <button
            @click="removeSelectedItems"
            class="group relative w-full bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-start space-x-3 overflow-hidden"
          >
            <!-- Hover Effect -->
            <div
              class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"
            ></div>

            <!-- Icon Container -->
            <div
              class="relative w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-all duration-300 group-hover:rotate-6 group-hover:scale-110"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>

            <!-- Text -->
            <span class="relative text-lg font-medium">{{ $t("remove") }}</span>
          </button>

          <!-- Status Toggle Card -->
          <div
            class="w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 border border-gray-200 dark:border-gray-600 rounded-xl p-6 transition-all duration-300 hover:shadow-md"
          >
            <div class="flex items-center justify-between">
              <!-- Status Info -->
              <div class="flex items-center space-x-4">
                <!-- Status Icon -->
                <div class="relative">
                  <div
                    class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg"
                  >
                    <svg
                      class="w-6 h-6 text-white"
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
                  </div>
                  <!-- Status Indicator Dot -->
                  <div
                    class="absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 transition-colors duration-300 animate-pulse"
                    :class="selectedItem.workStatus ? 'bg-green-500' : 'bg-red-500'"
                  ></div>
                </div>

                <!-- Status Text -->
                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-white text-lg">
                    {{
                      dat === "datakril"
                        ? translateText("Ishga tushirish")
                        : "Ishga tushirish"
                    }}
                  </h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ dat === "datakril" ? translateText("Holat: ") : "Holat:" }}:
                    <span
                      class="font-medium transition-colors duration-300"
                      :class="
                        selectedItem.workStatus
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      "
                    >
                      {{
                        selectedItem.workStatus
                          ? dat === "datakril"
                            ? translateText("Yoniq")
                            : "Yoniq"
                          : dat === "datakril"
                          ? translateText("O'chiq")
                          : "O'chiq"
                      }}
                    </span>
                  </p>
                </div>
              </div>

              <!-- Toggle Switch Container -->
              <div class="flex items-center space-x-3">
                <span
                  class="text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors duration-300"
                >
                  Off
                </span>

                <!-- Custom Toggle Switch -->
                <label class="relative inline-flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    v-model="selectedItem.workStatus"
                    @change="updateWorkStatus()"
                    class="sr-only peer"
                  />

                  <!-- Toggle Background -->
                  <div
                    class="relative w-14 h-8 bg-gray-300 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all after:duration-300 peer-checked:bg-gradient-to-r peer-checked:from-green-500 peer-checked:to-emerald-600 shadow-inner group-hover:shadow-lg transition-all duration-300 peer-checked:shadow-green-200 dark:peer-checked:shadow-green-900/50"
                  ></div>
                </label>

                <span
                  class="text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors duration-300"
                >
                  On
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 pb-6 pt-2">
          <div class="text-center">
            <div
              class="flex items-center justify-center space-x-2 text-xs text-gray-500 dark:text-gray-400"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>{{
                dat === "datakril"
                  ? translateText("Barcha o'zgarishlar avtomatik saqlanaadi")
                  : "Barcha o'zgarishlar avtomatik saqlanaadi"
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div
    v-if="dropdownVisible"
    @click="dropdownVisible = false"
    class="fixed inset-0 z-40 aniate-in fade-in"
  >
    <div
      @click.stop
      :style="modalPosition"
      class="absolute bg-white border-2 dark:bg-gray-800 shadow-2xl dark:shadow-gray-900/50 rounded-2xl z-50 min-w-[160px] border-gray-400 dark:border-gray-700 animate-in zoom-in-95 slide-in-from-top-2 duration-200 delay-100"
    >
      <!-- Tahrirlash -->
      <div
        @click.stop="Modalfile()"
        class="flex items-center border-b-2 border-gray-400 dark:border-gray-700 gap-3 p-3 cursor-pointer transition-all duration-200 hover:bg-amber-50 dark:hover:bg-amber-900/20 active:scale-95 group mb-1"
      >
        <Icon
          icon="uil:edit"
          width="24"
          height="24"
          class="text-amber-600 dark:text-amber-400 transition-transform duration-200 group-hover:scale-110 flex-shrink-0"
        />
        <h1
          class="text-gray-800 dark:text-gray-200 font-medium text-sm group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-200"
        >
          {{ dat === "datakril" ? translateText("Tahrirlash") : "Tahrirlash" }}
        </h1>
      </div>

      <!-- O'chirish -->
      <div
        @click.stop="removefileItems()"
        class="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-900/20 active:scale-95 group"
      >
        <Icon
          icon="weui:delete-outlined"
          width="24"
          height="24"
          class="text-red-600 dark:text-red-400 transition-transform duration-200 group-hover:scale-110 flex-shrink-0"
        />
        <h1
          class="text-gray-800 dark:text-gray-200 font-medium text-sm group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-200"
        >
          {{ dat === "datakril" ? translateText("O'chirish") : "O'chirish" }}
        </h1>
      </div>
    </div>
  </div>
  <div class="flex min-h-screen bg-gray-200 dark:bg-gray-800 flex-col items-center py-10">
    <div class="w-full flex gap-2 justify-end p-6">
      <button
        v-if="data.length === 0"
        @click="showModalfiles = true"
        class="text-lg font-medium py-2 px-4 bg-lime-500 hover:bg-lime-600 rounded-lg"
      >
        {{ $t("create") }}
      </button>
      <button
        v-if="ServiceData.length === 0"
        @click="showModal = true"
        class="text-lg font-medium py-2 px-4 bg-lime-500 hover:bg-lime-600 rounded-lg"
      >
        {{ $t("bolim_yaratish") }}
      </button>
    </div>
    <div class="w-full z-0 max-w-[1400px] mt-6 mx-auto">
      <Splide
        :options="{
          perPage: 4,
          autoplay: false,
          pagination: true,
          arrows: true,
          gap: '1rem',
          breakpoints: {
            640: { perPage: 1 },
            768: { perPage: 2 },
          },
        }"
        class="h-[180px] flex items-center justify-center"
      >
        <SplideSlide
          class="z-50"
          v-for="item in courts"
          @click="reload(item.id)"
          :key="item.id"
        >
          <div
            class="carousel-item relative min-h-full flex items-center gap-4 dark:bg-gray-800/10 group duration-300 dark:hover:bg-blue-950 hover:shadow-strong shadow-white bg-white border-4 border-gray-300 dark:border-gray-700 rounded-lg p-4 cursor-pointer"
          >
            <div
              class="bg-gradient-to-br to-purple-600 from-blue-500 min-h-12 max-h-12 min-w-12 max-w-12 flex rounded-lg justify-center items-center p-2"
            >
              <img
                v-if="item.img"
                :src="getImageUrl(item.img)"
                alt="Court Image"
                class="min-w-10 min-h-10 max-w-10 max-h-10 rounded-md"
              />
            </div>
            <h3 class="text-md font-medium text-black dark:text-gray-200 truncate-text">
              {{ dat === "datakril" ? translateText(item.name) : item.name }}
            </h3>
          </div>
        </SplideSlide>
      </Splide>
    </div>
    <div
      v-if="data.length == 0"
      class="text-black flex flex-col justify-center mt-16 items-center"
    >
      <div>
        <div
          v-for="(item, index) in ServiceData"
          :key="item.id"
          class="flex items-center gap-4 w-[1200px] dark:text-gray-200 bg-[#ffffff22] h-[70px] text-xl justify-between mb-1 p-2 mt-[14px] shadow-2xl rounded-[10px] duration-300 border-gray-400 dark:border-[#ffffff2c] border-2 bg- cursor-pointer"
        >
          <div
            :class="[index % 3 ? 'bg-red-600/30' : 'bg-blue-600/30']"
            class="p-1 rounded-md"
          >
            <Icon
              icon="bx:file"
              :class="[`${index % 3 ? 'text-red-600' : 'text-blue-600'}`]"
              width="40"
              height="40"
            />
          </div>
          <h1 class="flex-1 text-xl" @click="goToCard(item.id)">
            {{ dat === "datakril" ? translateText(item.fileName) : item.fileName }}
          </h1>
          <div class="flex relative z-40 gap-2">
            <Icon
              @click.stop="aktivebars(item, $event)"
              icon="qlementine-icons:menu-dots-24"
              width="40"
              height="40"
            />
          </div>
        </div>
      </div>
    </div>
    <div v-if="data.length" class="flex flex-col min-w-full items-center mt-6 px-4">
      <div class="w-full rounded-lg p-6 sm:p-10">
        <div class="grid grid-cols-1 min-w-full sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="item in data"
            :key="item.id"
            @click="goToPath(item.id)"
            class="relative dark:bg-gray-800/10 h-[380px] group hover:scale-105 duration-300 dark:hover:bg-blue-950 hover:shadow-strong shadow-white bg-white border-4 border-gray-300 dark:border-gray-700 rounded-lg p-6"
          >
            <Icon
              @click.stop="func(item)"
              icon="qlementine-icons:menu-dots-24"
              width="40"
              height="40"
              class="absolute top-1 right-3 z-10 rotate-90 cursor-pointer dark:text-gray-300 transition-colors duration-200"
            />
            <div class="flex flex-col justify-center gap-4">
              <div
                class="bg-gradient-to-br to-purple-600 from-blue-500 h-[250px] w-full flex rounded-lg justify-center items-center p-2"
              >
                <img
                  v-if="item.img"
                  :src="getImageUrl(item.img)"
                  alt="Court Image"
                  class="w-full h-full rounded-md"
                />
              </div>
              <h3 class="text-lg w-[400px] line-clamp-2 break-words font-medium dark:text-gray-200 text-black">
                {{ dat === "datakril" ? translateText(item.name) : item.name }}
              </h3>
            </div>
            <div
              v-if="item.workStatus"
              class="dark:bg-blue-900/50 bg-blue-500/50 flex justify-center items-end animate-pulse rounded-[5px] inset-0 w-full absolute h-full"
            >
              <b class="text-black dark:text-gray-200 font-bold text-[20px]">{{
                dat === "datakril"
                  ? translateText("Tez Kunda ishga tushadi")
                  : "Tez Kunda ishga tushadi"
              }}</b>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { watch, computed, ref } from "vue";
import { URL } from "../../../auth/url.js";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";
import { Icon } from "@iconify/vue";
import { Splide, SplideSlide } from "@splidejs/vue-splide";
import "@splidejs/splide/dist/css/splide.min.css";

const PutId = ref(null);
const PutModal = ref(false);
const PutfileModal = ref(false);
const fileModal = ref(false);
const data = ref([]);
const showModal = ref(false);
const showModalfiles = ref(false);
const courtName = ref("");
const file = ref(null);
const isLoading = inject('isLoading')
const successMessage = ref("");
const errorMessage = ref("");
const asd = ref(false);
const Id = ref(null);
const selectedFileId = ref(null);
const imageBaseUrl = `${URL}/upload`;
const router = useRouter();
const route = useRoute();
const id1 = ref(route.params.id);
const ServiceData = ref([]);
const courtsId = ref(0);
const aktivebarss = ref(null);
const modalPosition = ref({ top: "0px", left: "0px" });
const dropdownVisible = ref(false);
const datakril = ref([]);
const courts = ref([]);
import translateText from "@/auth/Translate";
import { onMounted } from "vue";
import { onUnmounted } from "vue";
import { inject } from "vue";

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

// Utility function to close all modals, clear messages, and fetch data
const closeModalsAndFetch = async () => {
  showModal.value = false;
  showModalfiles.value = false;
  PutModal.value = false;
  PutfileModal.value = false;
  fileModal.value = false;
  asd.value = false;
  dropdownVisible.value = false; // Added to ensure dropdown is closed
  successMessage.value = ""; // Clear success message
  errorMessage.value = ""; // Clear error message
  courtName.value = ""; // Reset courtName
  file.value = null; // Reset filev
  await getData(); // Fetch fresh data
};
const reload = (id) => {
  id1.value = id;
  getData();
  getCourts();
  router.push(`/aplicationsAdmin/${id}`);
};

const aktivebars = (item, event) => {
  if (event) {
    const modalWidth = 300;
    const modalHeight = 200;
    const padding = 10;

    let left = event.clientX;
    let top = event.clientY;

    if (left + modalWidth > window.innerWidth) {
      left = window.innerWidth - modalWidth - padding;
    }

    if (top + modalHeight > window.innerHeight) {
      top = window.innerHeight - modalHeight - padding;
    }

    left = Math.max(left, padding);
    top = Math.max(top, padding);

    modalPosition.value = {
      top: `${top}px`,
      left: `${left - 40}px`,
    };
  }
  if (item.id) {
    aktivebarss.value = item.id;
    dropdownVisible.value = true;
    courtName.value = item.fileName;
  } else {
    aktivebarss.value = null;
    dropdownVisible.value = false;
  }
};

const selectedItem = computed(() => {
  return data.value.find((item) => item.id === Id.value) || null;
});

const toggleModal = () => {
  showModal.value = !showModal.value;
  successMessage.value = ""; // Clear messages when toggling modal
  errorMessage.value = "";
};

const toggleFilesModal = () => {
  showModalfiles.value = !showModalfiles.value;
  successMessage.value = ""; // Clear messages when toggling modal
  errorMessage.value = "";
};

const Modal = () => {
  PutModal.value = !PutModal.value;
  asd.value = !asd.value;
  successMessage.value = ""; // Clear messages when toggling modal
  errorMessage.value = "";
};

const Modalfile = () => {
  selectedFileId.value = aktivebarss.value;
  fileModal.value = true;
  successMessage.value = ""; // Clear messages when opening modal
  errorMessage.value = "";
};

const func = (item) => {
  if (item) {
    PutId.value = item.id;
    Id.value = item.id;
    courtName.value = item.name;
  } else {
    PutId.value = null;
    Id.value = null;
    courtName.value = "12";
  }
  asd.value = !asd.value;
  successMessage.value = ""; // Clear messages when updating item
  errorMessage.value = "";
};

const goToPath = (id) => {
  router.push(`/ServiceAdmin/${id}`);
};

const goToCard = (id) => {
  router.push(`/edit/${id}/${id1.value}`);
};

const onFileChange = (event) => {
  file.value = event.target.files[0];
};

const uploadfile = async () => {
  if (!file.value) {
    errorMessage.value =
      dat === "datakril"
        ? translateText("Iltimos, fayl tanlang!")
        : "Iltimos, fayl tanlang!";
    return;
  }

  const formData = new FormData();
  formData.append("fileName", courtName.value);
  formData.append("files", file.value);
isLoading.value = true
  try {
    const response = await axios.post(`${URL}/services/${id1.value}/files`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response.status === 200 || response.status === 201) {
      successMessage.value =
        dat === "datakril"
          ? translateText("Fayllar muvaffaqiyatli yuklandi!")
          : "Fayllar muvaffaqiyatli yuklandi!";
      await closeModalsAndFetch();
    } else {
      errorMessage.value =
        dat === "datakril" ? translateText("Xatolik yuz berdi!") : "Xatolik yuz berdi!";
    }
  } catch (error) {
    errorMessage.value =
      dat === "datakril"
        ? translateText(error.response?.data?.message || "Xatolik yuz berdi!")
        : error.response?.data?.message || "Xatolik yuz berdi!";
    console.error("Xatolik tafsilotlari:", error);
  }finally{isLoading.value = false}
};

const uploadCourt = async () => {
  const formData = new FormData();
  formData.append("name", courtName.value);
  formData.append("file", file.value);
  formData.append("servicesId", id1.value);
isLoading.value = true
  try {
    const response = await axios.post(`${URL}/applications`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response.status === 200 || response.status === 201) {
      successMessage.value =
        dat === "datakril"
          ? translateText("Court muvaffaqiyatli yuklandi!")
          : "Court muvaffaqiyatli yuklandi!";
      await closeModalsAndFetch();
    } else {
      errorMessage.value =
        dat === "datakril" ? translateText("Xatolik yuz berdi!") : "Xatolik yuz berdi!";
    }
  } catch (error) {
    errorMessage.value =
      dat === "datakril" ? translateText("Xatolik yuz berdi!") : "Xatolik yuz berdi!";
  }finally{isLoading.value = false}
};

const getData = async () => {
  isLoading.value = true
  try {
    const response = await fetch(`${URL}/services/${id1.value}`);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const result = await response.json();
    courtsId.value = result.courtsId; // Set courtsId.value
    if (Array.isArray(result)) {
      datakril.value = result.map((item) => ({
        ...item,
        translatedName: dat === "datakril" ? translateText(item.name) : item.name,
      }));
      data.value = result.filter((item) => item.status === "active");
    } else if (
      result &&
      typeof result === "object" &&
      Array.isArray(result.applications)
    ) {
      datakril.value = result.applications
        .filter((item) => item.status === "active")
        .sort((a, b) => a.id - b.id)
        .map((item) => ({
          ...item,
          translatedName: dat === "datakril" ? translateText(item.name) : item.name,
        }));
      data.value = result.applications
        .filter((item) => item.status === "active")
        .sort((a, b) => a.id - b.id);
      ServiceData.value = result.files.sort((a, b) => a.id - b.id);
    } else {
      console.error("Unexpected data format:", result);
    }

    // Call getCourts after courtsId.value is set
    await getCourts();
  } catch (error) {
    console.error("Error in getData:", error);
    errorMessage.value =
      dat === "datakril"
        ? translateText("Ma'lumotlarni olishda xatolik yuz berdi!")
        : "Ma'lumotlarni olishda xatolik yuz berdi!";
  }finally{isLoading.value = false}
};

const getCourts = async () => {
  isLoading.value = true
  try {
    const response = await axios.get(`${URL}/courts/${courtsId.value}`);
    const result = response.data;
    courts.value = (result.services || [])
      .filter((item) => item.status === "active")
      .sort((a, b) => a.id - b.id);
  } catch (error) {
    console.error("Error in getCourts:", error);
    errorMessage.value =
      dat === "datakril"
        ? translateText("Sud ma'lumotlarini olishda xatolik yuz berdi!")
        : "Error fetching courts data!";
  }finally{isLoading.value = false}
};

const removeSelectedItems = async () => {
  if (!Id.value) {
    errorMessage.value =
      dat === "datakril" ? translateText("ID topilmadi!") : "ID topilmadi!";
    return;
  }
isLoading.value = true
  try {
    const response = await fetch(`${URL}/applications/${Id.value}`, {
      method: "DELETE",
    });

    if (response.ok) {
      successMessage.value =
        dat === "datakril"
          ? translateText("Element muvaffaqiyatli o‘chirildi!")
          : "Element muvaffaqiyatli o‘chirildi!";
      await closeModalsAndFetch();
    } else {
      errorMessage.value =
        dat === "datakril"
          ? translateText("O‘chirishda xatolik yuz berdi!")
          : "O‘chirishda xatolik yuz berdi!";
    }
  } catch (error) {
    console.error("Xatolik:", error);
    errorMessage.value =
      dat === "datakril"
        ? translateText("Xatolik yuz berdi: " + error.message)
        : "Xatolik yuz berdi: " + error.message;
  }finally{isLoading.value = false}
};

const removefileItems = async () => {
  if (!aktivebarss.value) {
    errorMessage.value =
      dat === "datakril" ? translateText("ID topilmadi!") : "ID topilmadi!";
    return;
  }
isLoading.value = true
  try {
    const response = await fetch(`${URL}/services/files/${aktivebarss.value}`, {
      method: "DELETE",
    });

    if (response.ok) {
      successMessage.value =
        dat === "datakril"
          ? translateText("Fayl muvaffaqiyatli o‘chirildi!")
          : "Fayl muvaffaqiyatli o‘chirildi!";
      await closeModalsAndFetch();
    } else {
      errorMessage.value =
        dat === "datakril"
          ? translateText("Faylni o‘chirishda xatolik yuz berdi!")
          : "Faylni o‘chirishda xatolik yuz berdi!";
    }
  } catch (error) {
    console.error("Xatolik:", error);
    errorMessage.value =
      dat === "datakril"
        ? translateText("Xatolik yuz berdi: " + error.message)
        : "Xatolik yuz berdi: " + error.message;
  }finally{isLoading.value = false}
};

const updatefileCourt = async () => {
  const formData = new FormData();
  formData.append("fileName", courtName.value);
  formData.append("file", file.value);
isLoading.value = true
  try {
    const response = await axios.put(
      `${URL}/services/files/${selectedFileId.value}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    if (response.status === 200) {
      successMessage.value =
        dat === "datakril"
          ? translateText("Fayl muvaffaqiyatli yangilandi!")
          : "Fayl muvaffaqiyatli yangilandi!";
      await closeModalsAndFetch();
    } else {
      errorMessage.value =
        dat === "datakril" ? translateText("Xatolik yuz berdi!") : "Xatolik yuz berdi!";
    }
  } catch (error) {
    errorMessage.value =
      dat === "datakril"
        ? translateText("Xatolik yuz berdi: " + error.message)
        : "Xatolik yuz berdi: " + error.message;
  } finally{isLoading.value = false}
};

const updateCourt = async () => {
  const formData = new FormData();
  formData.append("name", courtName.value);
  formData.append("file", file.value);
  formData.append("servicesId", parseInt(id1.value));
isLoading.value = true
  try {
    const response = await axios.put(`${URL}/applications/${PutId.value}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response.status === 200) {
      successMessage.value =
        dat === "datakril"
          ? translateText("Court muvaffaqiyatli yangilandi!")
          : "Court muvaffaqiyatli yangilandi!";
      await closeModalsAndFetch();
    } else {
      errorMessage.value =
        dat === "datakril" ? translateText("Xatolik yuz berdi!") : "Xatolik yuz berdi!";
    }
  } catch (error) {
    errorMessage.value =
      dat === "datakril"
        ? translateText("Xatolik yuz berdi: " + error.message)
        : "Xatolik yuz berdi: " + error.message;
  }finally{isLoading.value = false}
};

const updateWorkStatus = async () => {
  if (!Id.value) {
    errorMessage.value =
      dat === "datakril" ? translateText("ID topilmadi!") : "ID topilmadi!";
    return;
  }
isLoading.value = true
  try {
    const item = data.value.find((item) => item.id === Id.value);
    if (!item) {
      errorMessage.value =
        dat === "datakril" ? translateText("Element topilmadi!") : "Element topilmadi!";
      return;
    }

    const formData = new FormData();
    formData.append("workStatus", item.workStatus);
    formData.append("servicesId", id1.value);

    const response = await axios.put(`${URL}/applications/${Id.value}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response.status === 200) {
      successMessage.value =
        dat === "datakril"
          ? translateText("Status muvaffaqiyatli yangilandi!")
          : "Status muvaffaqiyatli yangilandi!";
      await closeModalsAndFetch();
    } else {
      errorMessage.value =
        dat === "datakril"
          ? translateText("Statusni yangilashda xatolik yuz berdi!")
          : "Statusni yangilashda xatolik yuz berdi!";
    }
  } catch (error) {
    errorMessage.value =
      dat === "datakril"
        ? translateText("Statusni yangilashda xatolik yuz berdi: " + error.message)
        : "Statusni yangilashda xatolik yuz berdi: " + error.message;
    const item = data.value.find((item) => item.id === Id.value);
    if (item) item.workStatus = !item.workStatus; // Revert on error
    console.log("Xatolik tafsilotlari:", error);
  } finally{isLoading.value = false}
};

watch(
  [showModal, PutModal, asd, fileModal, showModalfiles, PutfileModal, dropdownVisible],
  ([
    modalOpen,
    putModalOpen,
    asdOpen,
    fileModalOpen,
    filesModalOpen,
    putFileModalOpen,
    dropdownOpen,
  ]) => {
    if (
      modalOpen ||
      putModalOpen ||
      asdOpen ||
      fileModalOpen ||
      filesModalOpen ||
      putFileModalOpen ||
      dropdownOpen
    ) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }
);

// Watch route changes to refresh data when id1 changes
watch(id1, async (newId) => {
  if (newId) {
    successMessage.value = "";
    errorMessage.value = "";
    await getData();
  }
});
const getImageUrl = (filename) => `${imageBaseUrl}/${filename}`;
onMounted(() => {
  getData(); // getCourts will be called inside getData after courtsId is set
});
</script>

<style scoped>
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 25px;
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
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 20px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 19px;
  width: 19px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #09ff52;
}

input:checked + .slider:before {
  transform: translateX(24px);
}
.truncate-text {
  display: -webkit-box;
  -webkit-line-clamp: 2; /* faqat 2 ta qator ko'rsatadi */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
