<template>
  <div class="dark:bg-gray-800 bg-gray-200 min-h-screen">
    <!-- Add Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 w-full h-full flex items-center justify-center modal-backdrop bg-black bg-opacity-60"
    >
      <div
        class="relative w-full max-w-md mx-4 modal-content bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8"
      >
        <!-- Close Button -->
        <button
          @click="toggleModal"
          class="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full close-btn hover:bg-red-500/20 transition-all duration-300 group"
        >
          <svg
            class="w-5 h-5 text-white/70 group-hover:text-red-400 transition-colors"
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

        <!-- Header -->
        <div class="text-center mb-8">
          <div
            class="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center"
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
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              ></path>
            </svg>
          </div>
          <p class="text-white/60 text-sm">
            {{ dat === "datakril" ? translateText("Fayl yuklang") : "Fayl yuklang" }}
          </p>
        </div>

        <!-- Form -->
        <form @submit.prevent="uploadCourt" ref="form" class="space-y-6">
          <!-- Court Name Input -->
          <div class="space-y-2">
            <label class="block text-white/80 text-sm font-medium">{{
              dat === "datakril" ? translateText("Nom kiriting") : "Nom kiriting"
            }}</label>
            <div class="relative">
              <input
                v-model="courtName1"
                class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 backdrop-blur-sm transition-all duration-300"
                type="text"
                id="name"
                :placeholder="
                  dat === 'datakril'
                    ? translateText('Nom kiriting...')
                    : 'Nom kiriting...'
                "
                required
              />
              <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg
                  class="w-5 h-5 text-white/40"
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
          </div>

          <!-- File Upload -->
          <div class="space-y-2">
            <label class="block text-white/80 text-sm font-medium">{{
              dat === "datakril" ? translateText("Fayl yuklash") : "Fayl yuklash"
            }}</label>
            <div
              class="relative file-input-wrapper rounded-xl p-6 text-center border-2 border-dashed border-white/30 bg-white/5 hover:border-green-500/50 hover:bg-green-500/5 transition-all duration-300"
            >
              <input
                ref="fileInput1"
                @change="onFileChange1"
                type="file"
                id="file"
                accept="image/*"
                class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                required
              />
              <div class="space-y-2">
                <svg
                  class="w-12 h-12 mx-auto text-white/40"
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
                <div>
                  <p class="text-white/70 font-medium">
                    {{
                      dat === "datakril"
                        ? translateText("Faylni yuklash uchun bosing")
                        : "Faylni yuklash uchun bosing"
                    }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <button
            class="w-full py-4 px-6 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-green-500/25 transform hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group"
            type="submit"
          >
            <span class="relative z-10 flex items-center justify-center space-x-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                ></path>
              </svg>
              <span>{{ dat === "datakril" ? translateText("yuklash") : "yuklash" }}</span>
            </span>
            <div
              class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
            ></div>
          </button>
        </form>

        <!-- Messages -->
        <div class="mt-6 space-y-2">
          <div
            v-if="successMessage1"
            class="p-3 bg-green-500/20 border border-green-500/30 rounded-lg"
          >
            <p class="text-green-200 text-sm flex items-center">
              <svg
                class="w-4 h-4 mr-2"
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
              {{ successMessage1 }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Add File Modal -->
    <div
      v-if="showModalfiles"
      class="fixed inset-0 z-50 w-full h-full flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <div
        class="relative w-full max-w-lg mx-4 bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-xl border border-slate-600/30 rounded-3xl shadow-2xl p-8 transform transition-all duration-300"
      >
        <!-- Decorative Background Elements -->
        <div
          class="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-3xl"
        ></div>
        <div
          class="absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-xl"
        ></div>
        <div
          class="absolute -bottom-2 -left-2 w-16 h-16 bg-gradient-to-br from-green-500/20 to-cyan-500/20 rounded-full blur-lg"
        ></div>

        <!-- Close Button -->
        <button
          @click="toggleFilesModal"
          class="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-full flex items-center justify-center shadow-lg hover:shadow-red-500/25 transform hover:scale-110 hover:rotate-90 transition-all duration-300 group z-10"
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
              stroke-width="2.5"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>

        <!-- Content Container -->
        <div class="relative z-10">
          <!-- Header -->
          <div class="text-center mb-8">
            <div
              class="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg"
            >
              <svg
                class="w-10 h-10 text-white"
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
            <h2
              class="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-2"
            >
              {{ dat === "datakril" ? translateText("Fayl yuklash") : "Fayl yuklash" }}
            </h2>
          </div>

          <!-- Form -->
          <form @submit.prevent="uploadfile" class="space-y-6">
            <!-- Court Name Input -->
            <div class="space-y-2">
              <label class="block text-slate-300 text-sm font-semibold tracking-wide">{{
                dat === "datakril"
                  ? translateText("Fayl nomini kiriting")
                  : "Fayl nomini kiriting"
              }}</label>
              <div class="relative group">
                <input
                  v-model="courtName"
                  class="w-full px-4 py-4 bg-slate-700/50 border border-slate-600/50 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm transition-all duration-300 group-hover:bg-slate-700/70"
                  type="text"
                  :placeholder="
                    dat === 'datakril' ? translateText('Fayl nomi') : 'Fayl nomi'
                  "
                  required
                />
                <div class="absolute inset-y-0 right-0 flex items-center pr-4">
                  <svg
                    class="w-5 h-5 text-slate-400 transition-colors group-focus-within:text-blue-400"
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
            </div>

            <!-- File Upload -->
            <div class="space-y-2">
              <label class="block text-slate-300 text-sm font-semibold tracking-wide">{{
                dat === "datakril" ? translateText("Fayl tanlash") : "Fayl tanlash"
              }}</label>
              <div class="relative">
                <div
                  class="relative border-2 border-dashed border-slate-600/50 rounded-2xl p-8 text-center bg-slate-700/30 hover:border-blue-500/50 hover:bg-slate-700/50 transition-all duration-300 group cursor-pointer"
                >
                  <input
                    @change="onFileChange"
                    type="file"
                    class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    required
                  />
                  <div class="space-y-3">
                    <div
                      class="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all duration-300"
                    >
                      <svg
                        class="w-8 h-8 text-slate-400 group-hover:text-blue-400 transition-colors"
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
                    <div>
                      <p
                        class="text-slate-300 font-medium group-hover:text-white transition-colors"
                      >
                        {{
                          dat === "datakril"
                            ? translateText("Faylni yuklash uchun bosing")
                            : "Faylni yuklash uchun bosing"
                        }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Submit Button -->
            <button
              class="w-full py-4 px-6 bg-gradient-to-r from-lime-500 to-green-600 hover:from-lime-600 hover:to-green-700 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-lime-500/25 transform hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group"
              type="submit"
            >
              <span class="relative z-10 flex items-center justify-center space-x-3">
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
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  ></path>
                </svg>
                <span>{{
                  dat === "datakril" ? translateText("yuklash") : "yuklash"
                }}</span>
              </span>
              <!-- Button shine effect -->
              <div
                class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
              ></div>
              <!-- Button glow -->
              <div
                class="absolute inset-0 bg-gradient-to-r from-lime-400/0 via-lime-400/20 to-lime-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              ></div>
            </button>
          </form>
        </div>
      </div>
    </div>

    <!-- Update File Modal -->
    <div
      v-if="fileModal"
      class="fixed inset-0 z-50 w-full h-full flex items-center justify-center bg-black/70 backdrop-blur-md"
    >
      <div
        class="relative w-full max-w-lg mx-4 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-2xl border border-slate-500/40 rounded-3xl shadow-2xl p-8 transform transition-all duration-300 animate-in"
      >
        <!-- Animated Background Elements -->
        <div
          class="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-purple-500/5 to-cyan-500/10 rounded-3xl"
        ></div>
        <div
          class="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-orange-500/30 to-red-500/20 rounded-full blur-2xl animate-pulse"
        ></div>
        <div
          class="absolute -bottom-4 -right-4 w-20 h-20 bg-gradient-to-br from-purple-500/30 to-pink-500/20 rounded-full blur-xl animate-pulse delay-1000"
        ></div>
        <div
          class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl"
        ></div>

        <!-- Close Button -->
        <button
          @click="fileModal = false"
          class="absolute -top-4 -right-4 w-14 h-14 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 rounded-full flex items-center justify-center shadow-2xl hover:shadow-red-500/40 transform hover:scale-110 hover:rotate-180 transition-all duration-500 group z-20"
        >
          <svg
            class="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
          <!-- Button ring effect -->
          <div
            class="absolute inset-0 rounded-full border-2 border-red-400/50 animate-ping"
          ></div>
        </button>

        <!-- Content Container -->
        <div class="relative z-10">
          <!-- Header -->
          <div class="text-center mb-8">
            <div class="relative w-24 h-24 mx-auto mb-6">
              <div
                class="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl transform rotate-6 opacity-80"
              ></div>
              <div
                class="relative bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl flex items-center justify-center w-full h-full shadow-xl"
              >
                <svg
                  class="w-12 h-12 text-white"
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
            </div>
            <h2
              class="text-3xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent mb-3"
            >
              {{
                dat === "datakril"
                  ? translateText("Faylni yangilash")
                  : "Faylni yangilash"
              }}
            </h2>
          </div>

          <!-- Form -->
          <form @submit.prevent="updatefileCourt" class="space-y-6">
            <!-- Court Name Input -->
            <div class="space-y-3">
              <label
                class="block text-slate-300 text-sm font-semibold tracking-wide uppercase"
                >{{
                  dat === "datakril" ? translateText("Nom kiriting") : "Nom kiriting"
                }}</label
              >
              <div class="relative group">
                <input
                  v-model="courtName"
                  class="w-full px-5 py-4 bg-slate-700/40 border border-slate-600/40 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/60 focus:border-orange-500/60 backdrop-blur-sm transition-all duration-300 group-hover:bg-slate-700/60 focus:bg-slate-700/70"
                  type="text"
                  :placeholder="
                    dat === 'datakril'
                      ? translateText('Nom kiriting...')
                      : 'Nom kiriting...'
                  "
                  required
                />
                <div class="absolute inset-y-0 right-0 flex items-center pr-4">
                  <svg
                    class="w-5 h-5 text-slate-400 transition-colors group-focus-within:text-orange-400"
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
                <!-- Input glow effect -->
                <div
                  class="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500/0 via-orange-500/20 to-orange-500/0 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"
                ></div>
              </div>
            </div>

            <!-- File Upload -->
            <div class="space-y-3">
              <label
                class="block text-slate-300 text-sm font-semibold tracking-wide uppercase"
                >{{
                  dat === "datakril" ? translateText("Fayl yuklang") : "Fayl yuklash"
                }}</label
              >
              <div class="relative">
                <div
                  class="relative border-2 border-dashed border-slate-600/40 rounded-2xl p-8 text-center bg-slate-700/20 hover:border-orange-500/60 hover:bg-slate-700/40 transition-all duration-300 group cursor-pointer overflow-hidden"
                >
                  <input
                    @change="onFileChange"
                    type="file"
                    accept="image/*"
                    class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />

                  <!-- Background Pattern -->
                  <div class="absolute inset-0 opacity-10">
                    <div
                      class="absolute top-4 left-4 w-2 h-2 bg-orange-400 rounded-full"
                    ></div>
                    <div
                      class="absolute top-4 right-8 w-1 h-1 bg-red-400 rounded-full"
                    ></div>
                    <div
                      class="absolute bottom-6 left-8 w-1.5 h-1.5 bg-pink-400 rounded-full"
                    ></div>
                    <div
                      class="absolute bottom-4 right-4 w-2 h-2 bg-purple-400 rounded-full"
                    ></div>
                  </div>

                  <div class="space-y-4 relative z-5">
                    <div
                      class="w-20 h-20 mx-auto bg-gradient-to-r from-orange-500/30 to-red-500/30 rounded-3xl flex items-center justify-center group-hover:from-orange-500/50 group-hover:to-red-500/50 transition-all duration-300 group-hover:scale-110"
                    >
                      <svg
                        class="w-10 h-10 text-slate-300 group-hover:text-orange-300 transition-colors duration-300"
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
                    <div>
                      <p
                        class="text-slate-300 font-semibold group-hover:text-white transition-colors duration-300"
                      >
                        {{
                          dat === "datakril"
                            ? translateText("Faylni yuklash uchun bosing")
                            : "Faylni yuklash uchun bosing"
                        }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Submit Button -->
            <button
              class="w-full py-5 px-6 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-orange-500/30 transform hover:-translate-y-2 hover:scale-[1.03] transition-all duration-400 relative overflow-hidden group"
              type="submit"
            >
              <span class="relative z-10 flex items-center justify-center space-x-3">
                <svg
                  class="w-7 h-7 group-hover:rotate-12 transition-transform duration-300"
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
                <span class="tracking-wide">{{
                  dat === "datakril" ? translateText("yuklash") : "yuklash"
                }}</span>
              </span>

              <!-- Multiple shine effects -->
              <div
                class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
              ></div>
              <div
                class="absolute inset-0 bg-gradient-to-r from-transparent via-orange-300/20 to-transparent transform skew-x-12 translate-x-full group-hover:-translate-x-full transition-transform duration-1200 delay-200"
              ></div>

              <!-- Pulsing glow -->
              <div
                class="absolute inset-0 bg-gradient-to-r from-orange-400/0 via-orange-400/30 to-orange-400/0 opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300"
              ></div>
            </button>
          </form>
        </div>
      </div>
    </div>

    <!-- Update Modal -->
    <div
      v-if="PutModal"
      class="fixed inset-0 z-50 w-full h-full flex items-center justify-center bg-black/75 backdrop-blur-lg"
    >
      <div
        class="relative w-full max-w-md mx-4 bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-3xl border border-slate-500/30 rounded-3xl shadow-2xl p-8 transform transition-all duration-300"
      >
        <!-- Floating Geometric Elements -->
        <div
          class="absolute -top-6 -left-6 w-20 h-20 bg-gradient-to-br from-indigo-500/40 to-purple-600/30 rounded-2xl rotate-45 blur-lg animate-pulse"
        ></div>
        <div
          class="absolute -bottom-4 -right-4 w-16 h-16 bg-gradient-to-br from-cyan-500/40 to-blue-600/30 rounded-full blur-xl animate-pulse delay-700"
        ></div>
        <div
          class="absolute top-1/3 -right-2 w-12 h-12 bg-gradient-to-br from-emerald-500/30 to-teal-600/20 rounded-lg rotate-12 blur-md animate-pulse delay-300"
        ></div>

        <!-- Overlay Pattern -->
        <div
          class="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-cyan-500/5 rounded-3xl"
        ></div>

        <!-- Close Button -->
        <button
          @click="Modal"
          class="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 rounded-full flex items-center justify-center shadow-xl hover:shadow-indigo-500/30 transform hover:scale-125 hover:-rotate-90 transition-all duration-400 group z-20"
        >
          <svg
            class="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
          <!-- Ripple Effect -->
          <div
            class="absolute inset-0 rounded-full border border-indigo-400/60 animate-ping opacity-30"
          ></div>
        </button>

        <!-- Content Container -->
        <div class="relative z-10">
          <!-- Header Section -->
          <div class="text-center mb-8">
            <div class="relative w-20 h-20 mx-auto mb-5">
              <!-- Floating rings -->
              <div
                class="absolute inset-0 rounded-full border-2 border-indigo-400/30 animate-spin"
              ></div>
              <div
                class="absolute inset-2 rounded-full border border-purple-400/40 animate-pulse"
              ></div>

              <!-- Main icon container -->
              <div
                class="relative bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center w-full h-full shadow-lg"
              >
                <svg
                  class="w-10 h-10 text-white"
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
              </div>
            </div>

            <h2
              class="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2"
            >
              {{
                dat === "datakril"
                  ? translateText("Ma'lumotlarni yangilash")
                  : "Ma'lumotlarni yangilash"
              }}
            </h2>
            <p class="text-slate-400 text-sm">
              {{
                dat === "datakril"
                  ? translateText("Ma'lumotlarni o'zgartiring va saqlang")
                  : "Ma'lumotlarni o'zgartiring va saqlang"
              }}
            </p>
          </div>

          <!-- Form -->
          <form @submit.prevent="updateCourt" class="space-y-6">
            <!-- Court Name Input -->
            <div class="space-y-2">
              <label class="block text-slate-300 text-sm font-medium">{{
                dat === "datakril" ? translateText("Nom kiriting") : "Nom kiriting"
              }}</label>
              <div class="relative group">
                <input
                  v-model="courtName"
                  class="w-full px-4 py-4 bg-slate-700/40 border border-slate-600/40 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 backdrop-blur-sm transition-all duration-300 group-hover:bg-slate-700/60"
                  type="text"
                  :placeholder="
                    dat === 'datakril'
                      ? translateText('Nom kiriting...')
                      : 'Nom kiriting...'
                  "
                  required
                />
                <div class="absolute inset-y-0 right-0 flex items-center pr-4">
                  <svg
                    class="w-5 h-5 text-slate-400 transition-colors group-focus-within:text-indigo-400"
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
                <!-- Focus glow effect -->
                <div
                  class="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/0 via-indigo-500/10 to-indigo-500/0 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"
                ></div>
              </div>
            </div>

            <!-- File Upload -->
            <div class="space-y-2">
              <label class="block text-slate-300 text-sm font-medium">{{
                dat === "datakril" ? translateText("Yangi rasm") : "Yangi rasm"
              }}</label>
              <div class="relative">
                <div
                  class="relative border-2 border-dashed border-slate-600/50 rounded-2xl p-6 text-center bg-gradient-to-br from-slate-700/30 to-slate-800/30 hover:border-indigo-500/50 hover:bg-gradient-to-br hover:from-indigo-500/10 hover:to-purple-500/10 transition-all duration-300 group cursor-pointer"
                >
                  <input
                    @change="onFileChange"
                    type="file"
                    accept="image/*"
                    class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />

                  <!-- Animated dots pattern -->
                  <div class="absolute inset-0 overflow-hidden rounded-2xl">
                    <div
                      class="absolute top-2 left-4 w-1 h-1 bg-indigo-400/40 rounded-full animate-ping"
                    ></div>
                    <div
                      class="absolute top-6 right-6 w-1 h-1 bg-purple-400/40 rounded-full animate-ping delay-500"
                    ></div>
                    <div
                      class="absolute bottom-4 left-6 w-1 h-1 bg-cyan-400/40 rounded-full animate-ping delay-1000"
                    ></div>
                  </div>

                  <div class="space-y-3 relative z-5">
                    <div
                      class="w-16 h-16 mx-auto bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center group-hover:from-indigo-500/30 group-hover:to-purple-500/30 transition-all duration-300 group-hover:scale-110"
                    >
                      <svg
                        class="w-8 h-8 text-slate-400 group-hover:text-indigo-400 transition-colors duration-300"
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
                    <div>
                      <p
                        class="text-slate-300 font-medium group-hover:text-white transition-colors"
                      >
                        {{
                          dat === "datakril"
                            ? translateText("Yangi fayl tanlang")
                            : "Yangi fayl tanlang"
                        }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Submit Button -->
            <button
              class="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 hover:from-indigo-700 hover:via-purple-700 hover:to-cyan-700 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-indigo-500/25 transform hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group"
              type="submit"
            >
              <span class="relative z-10 flex items-center justify-center space-x-3">
                <svg
                  class="w-6 h-6 group-hover:rotate-180 transition-transform duration-500"
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
                <span>{{
                  dat === "datakril" ? translateText("Yuklash") : "Yuklash"
                }}</span>
              </span>

              <!-- Animated shine effects -->
              <div
                class="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
              ></div>
              <div
                class="absolute inset-0 bg-gradient-to-l from-transparent via-cyan-300/20 to-transparent transform skew-x-12 translate-x-full group-hover:-translate-x-full transition-transform duration-1200 delay-150"
              ></div>

              <!-- Button pulse -->
              <div
                class="absolute inset-0 bg-gradient-to-r from-indigo-400/0 via-indigo-400/20 to-indigo-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              ></div>
            </button>
          </form>
        </div>
      </div>
    </div>
    <div v-if="asd" @click="asd = false" class="fixed inset-0 z-40">
      <div
        :style="modalPosition"
        @click.stop
        class="absolute w-full max-w-md mx-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 overflow-hidden"
      >
        <div
          class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
        ></div>
        <button
          @click="func(null)"
          class="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100/80 dark:bg-gray-800/80 hover:bg-red-50 dark:hover:bg-red-900/50 transition-all duration-300 hover:scale-110 hover:rotate-90 group"
        >
          <svg
            class="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-red-500 transition-colors"
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

        <!-- Modal content -->
        <div class="p-8 pt-12">
          <!-- Action buttons -->
          <div class="space-y-4 mb-6">
            <!-- Edit button -->
            <button
              @click="Modal"
              class="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 dark:from-emerald-600 dark:to-teal-700 p-4 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1"
            >
              <div
                class="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              ></div>
              <div
                class="relative flex items-center justify-center gap-3 text-white font-semibold text-lg"
              >
                <div
                  class="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
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
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    ></path>
                  </svg>
                </div>
                {{ dat === "datakril" ? translateText("Tahrirlash") : "Tahrirlash" }}
              </div>
            </button>

            <!-- Delete button -->
            <button
              @click="removeSelectedItems"
              class="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 dark:from-red-600 dark:to-rose-700 p-4 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1"
            >
              <div
                class="absolute inset-0 bg-gradient-to-r from-red-400 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              ></div>
              <div
                class="relative flex items-center justify-center gap-3 text-white font-semibold text-lg"
              >
                <div
                  class="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    ></path>
                  </svg>
                </div>
                {{ dat === "datakril" ? translateText("O'chirish") : "O'chirish" }}
              </div>
            </button>
          </div>

          <!-- Status toggle card -->
          <div
            class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 border border-gray-200/50 dark:border-gray-600/50 p-6 shadow-xl hover:shadow-xl transition-all duration-500 hover:scale-[1.01] group"
          >
            <!-- Decorative elements -->
            <div
              class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-110 transition-transform duration-700"
            ></div>
            <div
              class="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-emerald-500/10 to-teal-500/10 rounded-full translate-y-12 -translate-x-12 group-hover:scale-110 transition-transform duration-700"
            ></div>

            <div class="relative flex items-center justify-between">
              <div class="flex-1">
                <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">
                  {{
                    dat === "datakril"
                      ? translateText("Ishga tushirish")
                      : "Ishga tushirish"
                  }}
                </h3>
              </div>

              <!-- Toggle switch -->
              <div class="flex items-center gap-3">
                <span
                  class="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors"
                  :class="!workStatus ? 'text-gray-700 dark:text-gray-300' : ''"
                >
                  Off
                </span>

                <label class="relative inline-block">
                  <input
                    type="checkbox"
                    v-model="workStatus"
                    @change="updateWorkStatus"
                    class="sr-only peer"
                  />
                  <div
                    class="relative w-16 h-8 bg-gradient-to-r from-gray-300 to-gray-400 peer-focus:outline-none rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-8 peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all after:duration-300 after:shadow-lg peer-checked:bg-gradient-to-r peer-checked:from-emerald-500 peer-checked:to-teal-600 hover:shadow-lg transition-all duration-300 cursor-pointer"
                  ></div>
                  <!-- Glow effect -->
                  <div
                    class="absolute inset-0 rounded-full opacity-0 peer-checked:opacity-100 bg-gradient-to-r from-emerald-400 to-teal-500 blur-md transition-opacity duration-300 -z-10"
                  ></div>
                </label>

                <span
                  class="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors"
                  :class="workStatus ? 'text-emerald-600 dark:text-emerald-400' : ''"
                >
                  On
                </span>
              </div>
            </div>

            <!-- Status indicator -->
            <div class="mt-4 pt-4 border-t border-gray-600/50 dark:border-gray-600/50">
              <div class="flex items-center gap-2">
                <div
                  class="w-2 h-2 rounded-full transition-all duration-300"
                  :class="
                    workStatus
                      ? 'bg-emerald-500 shadow-emerald-500/50 shadow-md animate-pulse'
                      : 'bg-gray-400'
                  "
                ></div>
                <span class="text-xs font-medium text-gray-600 dark:text-gray-400">
                  {{
                    workStatus
                      ? dat === "datakril"
                        ? translateText("Faol")
                        : "Faol"
                      : dat === "datakril"
                      ? translateText("Nofaol")
                      : "Nofaol"
                  }}
                </span>
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
        class="absolute bg-white border-2 dark:bg-gray-800 shadow-2xl dark:shadow-gray-900/50 rounded-2xl z-50  min-w-[160px] border-gray-400 dark:border-gray-700 animate-in zoom-in-95 slide-in-from-top-2 duration-200 delay-100"
      >
        <!-- Tahrirlash -->
        <div
          @click.stop="Modalfile()"
          class="flex items-center border-b-2 border-gray-400 dark:border-gray-700  gap-3 p-3 cursor-pointer transition-all duration-200 hover:bg-amber-50 dark:hover:bg-amber-900/20 active:scale-95 group mb-1"
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

    <!-- Main Content -->
    <div class="flex flex-col items-center py-10">
      <div
        v-if="data.length || ServiceData.length"
        class="w-full gap-2 flex justify-end px-6"
      >
        <button
          v-if="data.length == 0"
          @click="showModalfiles = true"
          class="text-lg font-medium py-2 px-4 bg-lime-500 hover:bg-lime-600 rounded-lg"
        >
          {{ dat === "datakril" ? translateText("Fayl yaratish") : "Fayl yaratish" }}
        </button>
        <button
          v-if="data.length"
          @click="toggleModal"
          class="text-lg font-medium py-2 px-4 bg-lime-500 hover:bg-lime-600 rounded-lg"
        >
          {{ dat === "datakril" ? translateText("Bo'lim yaratish") : "Bo'lim yaratish" }}
        </button>
      </div>
      <div v-else class="w-full gap-2 flex justify-end px-6">
        <button
          @click="showModalfiles = true"
          class="text-lg font-medium py-2 px-4 bg-lime-500 hover:bg-lime-600 rounded-lg"
        >
          {{ dat === "datakril" ? translateText("Fayl yaratish") : "Fayl yaratish" }}
        </button>
        <button
          @click="toggleModal"
          class="text-lg font-medium py-2 px-4 bg-lime-500 hover:bg-lime-600 rounded-lg"
        >
          {{ dat === "datakril" ? translateText("Bo'lim yaratish") : "Bo'lim yaratish" }}
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
                @click.stop="aktivebars(item.id, $event)"
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
              class="relative dark:bg-gray-800/10 group hover:scale-105 duration-300 dark:hover:bg-blue-950 hover:shadow-strong shadow-white bg-white border-4 border-gray-300 dark:border-gray-700 rounded-lg p-6"
            >
              <Icon
                @click.stop="func(item.id, $event)"
                icon="qlementine-icons:menu-dots-24"
                width="40"
                height="40"
                class="absolute top-1 right-3 z-10 rotate-90 cursor-pointer dark:text-gray-300  transition-colors duration-200"
              />
              <div class="flex flex-col justify-center gap-4">
                <div
                  class="bg-gradient-to-br to-purple-600 from-blue-500 h-16 w-16 flex rounded-lg justify-center items-center p-2"
                >
                  <img
                    v-if="item.img"
                    :src="getImageUrl(item.img)"
                    alt="Court Image"
                    class="w-14 h-14 rounded-md"
                  />
                </div>
                <h3 class="text-lg font-medium dark:text-gray-200 text-black">
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
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { URL } from "../../../auth/url.js";
import axios from "axios";
import translateText from "@/auth/Translate";
import { Splide, SplideSlide } from "@splidejs/vue-splide";
import "@splidejs/splide/dist/css/splide.min.css";
import { Icon } from "@iconify/vue";
import { onUnmounted } from "vue";

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

const router = useRouter();
const route = useRoute();
const courtName1 = ref("");
const file1 = ref(null);
const successMessage1 = ref("");
const errorMessage1 = ref("");
const form = ref(null);
const id4 = route.params.id;
const fileInput1 = ref(null);
const showCustomModal = ref(false);
const dropdownVisible = ref(false);
const onFileChange1 = (event) => {
  file1.value = event.target.files[0];
};

const url = `${URL}/courts`;
const imageBaseUrl = `${URL}/upload`;
const id1 = ref(route.params.id);
const data = ref([]);
const ServiceData = ref([]);
const courts = ref([]);
const showModal = ref(false);
const PutModal = ref(false);
const asd = ref(false);
const showModalfiles = ref(false);
const fileModal = ref(false);
const PutId = ref(null);
const selectedId = ref(null);
const selectedFileId = ref(null);
const courtName = ref("");
const file = ref(null);
const successMessage = ref("");
const errorMessage = ref("");
const workStatus = ref(false);
const aktivebarss = ref(null);

const closeAllModals = () => {
  showModal.value = false;
  PutModal.value = false;
  asd.value = false;
  showModalfiles.value = false;
  fileModal.value = false;
  dropdownVisible.value = false;
};

const reload = (id) => {
  id1.value = id;
  getData();
  getCourts();
  router.push(`/AdminPath/${id}`);
};

const aktivebars = (id, event) => {
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
  if (id) {
    aktivebarss.value = id;
    dropdownVisible.value = true;
  } else {
    dropdownVisible.value = false;
  }
};

const uploadCourt = async () => {
  const formData = new FormData();
  formData.append("name", courtName1.value);
  formData.append("file", file1.value);
  formData.append("courtsId", id4);

  try {
    await axios.post(`${URL}/services`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    successMessage1.value =
      dat.value === "datakril"
        ? translateText("Service muvaffaqiyatli yuklandi!")
        : "Service muvaffaqiyatli yuklandi!";
    errorMessage1.value = "";
    courtName1.value = "";
    file1.value = null;
    if (fileInput1.value) fileInput1.value = "";
    closeAllModals();
    await getData();
    await getCourts();
  } catch (error) {
    errorMessage1.value =
      dat.value === "datakril"
        ? translateText("Yuklashda xato yuz berdi: ") +
          (error.response?.data?.message || error.message)
        : "Yuklashda xato yuz berdi: " + (error.response?.data?.message || error.message);
    successMessage1.value = "";
  }
};

const toggleModal = () => {
  showModal.value = !showModal.value;
};

const toggleFilesModal = () => {
  showModalfiles.value = !showModalfiles.value;
};

const Modal = () => {
  PutModal.value = !PutModal.value;
  asd.value = !asd.value;
};

const modalPosition = ref({});

const func = (id, event) => {
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
      left: `${left}px`,
    };
  }

  PutId.value = id;
  selectedId.value = id;
  asd.value = !asd.value;
  if (id) {
    const selectedItem = data.value.find((item) => item.id === id);
    if (selectedItem) {
      courtName.value = selectedItem.name;
      workStatus.value = selectedItem.workStatus;
    }
  } else {
    courtName.value = "";
    workStatus.value = false;
  }
  getData();
};

const Modalfile = (id) => {
  selectedFileId.value = aktivebarss.value;
  fileModal.value = true;
  const selectedFile = ServiceData.value.find((item) => item.id === aktivebarss.value);
  if (selectedFile) courtName.value = selectedFile.fileName;
  dropdownVisible.value = false;
  getData();
};

const onFileChange = (event) => {
  file.value = event.target.files[0];
};

const getData = async () => {
  try {
    const response = await axios.get(`${url}/${id1.value}`);
    const result = response.data;
    data.value = (result.services || [])
      .filter((item) => item.status === "active")
      .sort((a, b) => a.id - b.id);
    ServiceData.value = result.files || [];
  } catch (error) {
    console.error("Error fetching data:", error);
    errorMessage.value =
      dat.value === "datakril"
        ? translateText("Ma'lumotlarni yuklashda xatolik yuz berdi")
        : "Ma'lumotlarni yuklashda xatolik yuz berdi";
  }
};

const getCourts = async () => {
  try {
    const response = await axios.get(`${URL}/courts`);
    courts.value = [...response.data.filter((court) => court.status === "active")].sort(
      (a, b) => a.id - b.id
    );
    getData();
  } catch (error) {
    console.error("Error fetching courts:", error);
    errorMessage.value =
      dat.value === "datakril"
        ? translateText("Sudlarni yuklashda xatolik yuz berdi")
        : "Sudlarni yuklashda xatolik yuz berdi";
  }
};

const uploadfile = async () => {
  if (!file.value || !courtName.value) {
    errorMessage.value =
      dat.value === "datakril"
        ? translateText("Iltimos, barcha maydonlarni to'ldiring!")
        : "Iltimos, barcha maydonlarni to'ldiring!";
    return;
  }
  const formData = new FormData();
  formData.append("fileName", courtName.value);
  formData.append("files", file.value);
  try {
    await axios.post(`${URL}/courts/${id1.value}/files`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    successMessage.value =
      dat.value === "datakril"
        ? translateText("Fayl muvaffaqiyatli yuklandi!")
        : "Fayl muvaffaqiyatli yuklandi!";
    errorMessage.value = "";
    resetForm();
    closeAllModals();
    await getData();
    await getCourts();
  } catch (error) {
    errorMessage.value =
      dat.value === "datakril"
        ? translateText("Fayl yuklashda xatolik!")
        : "Fayl yuklashda xatolik!";
    console.error("Upload error:", error);
  }
};

const updatefileCourt = async () => {
  if (!courtName.value) {
    errorMessage.value =
      dat.value === "datakril"
        ? translateText("Fayl nomini kiriting!")
        : "Fayl nomini kiriting!";
    return;
  }
  const formData = new FormData();
  formData.append("fileName", courtName.value);
  if (file.value) formData.append("file", file.value);
  try {
    await axios.put(`${URL}/courts/files/${selectedFileId.value}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    successMessage.value =
      dat.value === "datakril"
        ? translateText("Fayl muvaffaqiyatli yangilandi!")
        : "Fayl muvaffaqiyatli yangilandi!";
    errorMessage.value = "";
    resetForm();
    closeAllModals();
    await getData();
    await getCourts();
  } catch (error) {
    errorMessage.value =
      dat.value === "datakril" ? translateText("Yangilashda xatolik!") : "Yangilashda xatolik!";
  }
};

const updateCourt = async () => {
  if (!courtName.value) {
    errorMessage.value =
      dat.value === "datakril" ? translateText("Sud nomini kiriting!") : "Sud nomini kiriting!";
    return;
  }
  const formData = new FormData();
  formData.append("name", courtName.value);
  if (file.value) formData.append("file", file.value);
  formData.append("courtsId", parseInt(id1.value));
  try {
    await axios.put(`${URL}/services/${PutId.value}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    successMessage.value =
      dat.value === "datakril"
        ? translateText("Sud muvaffaqiyatli yangilandi!")
        : "Sud muvaffaqiyatli yangilandi!";
    errorMessage.value = "";
    resetForm();
    closeAllModals();
    await getData();
    await getCourts();
  } catch (error) {
    errorMessage.value =
      dat.value === "datakril" ? translateText("Yangilashda xatolik!") : "Yangilashda xatolik!";
  }
};

const updateWorkStatus = async () => {
  if (!selectedId.value) return;
  const payload = {
    workStatus: workStatus.value,
    courtsId: parseInt(id1.value),
  };
  try {
    await axios.put(`${URL}/services/${selectedId.value}`, payload, {
      headers: { "Content-Type": "application/json" },
    });
    successMessage.value =
      dat.value === "datakril"
        ? translateText("Ishga tushirish holati muvaffaqiyatli yangilandi!")
        : "Ishga tushirish holati muvaffaqiyatli yangilandi!";
    errorMessage.value = "";
    closeAllModals();
    await getData();
    await getCourts();
  } catch (error) {
    errorMessage.value =
      dat.value === "datakril"
        ? translateText("Holadni yangilashda xatolik!")
        : "Holadni yangilashda xatolik!";
    console.error("Update workStatus error:", error);
  }
};

const removeSelectedItems = async () => {
  if (!selectedId.value) return;
  try {
    await axios.delete(`${URL}/services/${selectedId.value}`);
    successMessage.value =
      dat.value === "datakril"
        ? translateText("Sud muvaffaqiyatli o'chirildi!")
        : "Sud muvaffaqiyatli o'chirildi!";
    errorMessage.value = "";
    closeAllModals();
    await getData();
    await getCourts();
  } catch (error) {
    errorMessage.value =
      dat.value === "datakril" ? translateText("O'chirishda xatolik!") : "O'chirishda xatolik!";
  }
};

const removefileItems = async (id) => {
  try {
    await axios.delete(`${URL}/courts/files/${aktivebarss.value}`);
    successMessage.value =
      dat.value === "datakril"
        ? translateText("Fayl muvaffaqiyatli o'chirildi!")
        : "Fayl muvaffaqiyatli o'chirildi!";
    errorMessage.value = "";
    closeAllModals();
    await getData();
    await getCourts();
  } catch (error) {
    errorMessage.value =
      dat.value === "datakril"
        ? translateText("Fayl o'chirishda xatolik!")
        : "Fayl o'chirishda xatolik!";
  }
};

const goToCard = (id) => router.push(`/edit/${id}/${id1.value}`);
const goToPath = (id) => router.push(`/aplicationsAdmin/${id}`);
const getImageUrl = (filename) => `${imageBaseUrl}/${filename}`;

const resetForm = () => {
  courtName.value = "";
  file.value = null;
  successMessage.value = "";
  errorMessage.value = "";
};

watch([showModal, PutModal, asd, showModalfiles, fileModal], () => {
  document.body.style.overflow =
    showModal.value ||
    PutModal.value ||
    asd.value ||
    showModalfiles.value ||
    fileModal.value
      ? "hidden"
      : "";
});

onMounted(() => {
  getData();
  getCourts();
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

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes zoom-in-95 {
  from {
    transform: scale(0.95);
  }
  to {
    transform: scale(1);
  }
}

@keyframes slide-in-from-top-2 {
  from {
    transform: translateY(-0.5rem);
  }
  to {
    transform: translateY(0);
  }
}
.truncate-text {
  display: -webkit-box;
  -webkit-line-clamp: 2; /* faqat 2 ta qator ko'rsatadi */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
.animate-in {
  animation-fill-mode: both;
}
</style>
