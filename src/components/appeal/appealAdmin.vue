<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800 transition-all duration-500 relative overflow-hidden">
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
    </div>

    <header class="relative pt-12 pb-8 overflow-hidden">
      <div class="absolute inset-0 opacity-5 dark:opacity-10">
        <div
          class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,theme(colors.lime.500),transparent_70%)]"
        ></div>
      </div>

      <div class="container mx-auto px-4 relative">
        <div class="text-center">
          <h1
            class="text-5xl md:text-7xl font-black text-transparent bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500 bg-clip-text mb-4 tracking-tight"
          >
            {{ dat === "datakril" ? translateText("Interaktiv xizmatilar ro'yxati") : "Interaktiv xizmatilar ro'yxati" }}
          </h1>
          <div class="flex justify-center items-center space-x-4 mt-6">
            <div
              class="h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent w-24"
            ></div>
            <div class="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
            <div
              class="h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent w-24"
            ></div>
          </div>
        </div>
      </div>
    </header>

    <!-- Enhanced Modal for Uploading -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div @click.self="showModal = false" v-if="showModal" class="fixed inset-0 z-50 w-full h-full flex items-center bg-black/60 dark:bg-black/80 backdrop-blur-md justify-center p-4">
        <div class="relative w-full max-w-md bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-2xl flex flex-col items-center justify-center p-8 rounded-3xl transform transition-all duration-300 hover:shadow-3xl">
          <div class="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-3xl blur opacity-20"></div>
          
          <button @click="toggleModal" class="absolute z-40 top-4 right-4 p-3 rounded-full bg-gray-100/80 dark:bg-gray-700/80 hover:bg-red-100 dark:hover:bg-red-900/50 transition-all duration-200 hover:scale-110 hover:rotate-90 group">
            <svg class="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-red-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
          
          <div class="relative z-10 w-full">
            <div class="text-center mb-8">
              <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-2xl mb-4 shadow-lg">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
              </div>
              <h3 class="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">Yangi bo'lim qo'shish</h3>
            </div>
            
            <form @submit.prevent="handleSubmit" class="space-y-6">
              <div class="group">
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-400 transition-colors duration-200">Bo'lim nomi</label>
                <div class="relative">
                  <input 
                    v-model="courtName" 
                    class="w-full bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-xl focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-emerald-500 dark:focus:border-emerald-400 outline-none p-4 transition-all duration-300 hover:border-emerald-300 dark:hover:border-emerald-500" 
                    type="text"
                    placeholder="Bo'lim nomini kiriting" 
                    required 
                  />
                  <div class="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-400/0 to-blue-500/0 group-focus-within:from-emerald-400/10 group-focus-within:to-blue-500/10 transition-all duration-300 pointer-events-none"></div>
                </div>
              </div>

              <div class="group">
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-400 transition-colors duration-200">Havola</label>
                <div class="relative">
                  <input 
                    v-model="url" 
                    class="w-full bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-xl focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-emerald-500 dark:focus:border-emerald-400 outline-none p-4 transition-all duration-300 hover:border-emerald-300 dark:hover:border-emerald-500" 
                    type="text"
                    placeholder="Link kiriting" 
                    required 
                  />
                  <div class="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-400/0 to-blue-500/0 group-focus-within:from-emerald-400/10 group-focus-within:to-blue-500/10 transition-all duration-300 pointer-events-none"></div>
                </div>
              </div>

              <div class="group">
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-400 transition-colors duration-200">Rasm</label>
                <div class="relative">
                  <input 
                    @change="onFileChange" 
                    type="file" 
                    id="file" 
                    accept="image/*" 
                    required
                    class="block w-full text-sm text-gray-900 dark:text-gray-300 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-600 rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-emerald-500 dark:focus:border-emerald-400 p-4 transition-all duration-300 hover:border-emerald-300 dark:hover:border-emerald-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 dark:file:bg-emerald-900/50 dark:file:text-emerald-300 dark:hover:file:bg-emerald-900/70" 
                  />
                </div>
              </div>

              <button 
                class="group relative w-full mt-8 overflow-hidden rounded-xl"
                type="submit"
              >
                <div class="absolute inset-0 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-600 transition-all duration-300 group-hover:scale-105"></div>
                <div class="absolute inset-0 bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <div class="relative flex items-center justify-center gap-3 text-white font-semibold py-4 px-6 transition-all duration-300 group-hover:scale-105">
                  <svg class="w-5 h-5 transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                  <span>{{dat === 'datakril' ? translateText('Yuklash') : 'Yuklash'}}</span>
                </div>
              </button>
            </form>
            
            <Transition
              enter-active-class="transition duration-300 ease-out"
              enter-from-class="opacity-0 translate-y-2"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition duration-200 ease-in"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 translate-y-2"
            >
              <div v-if="successMessage" class="mt-6 p-4 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700 rounded-xl">
                <p class="text-emerald-700 dark:text-emerald-300 font-medium text-center">{{  dat === 'datakrkil' ? translateText(successMessage):successMessage  }}</p>
              </div>
            </Transition>
            
            <Transition
              enter-active-class="transition duration-300 ease-out"
              enter-from-class="opacity-0 translate-y-2"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition duration-200 ease-in"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 translate-y-2"
            >
              <div v-if="errorMessage" class="mt-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-xl">
                <p class="text-red-700 dark:text-red-300 font-medium text-center">{{ dat === 'datakril' ? translateText(errorMessage) : errorMessage }}</p>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Enhanced Modal for Edit/Delete -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div v-if="asd" @click.self="asd = false" class="fixed inset-0 z-50 w-full h-full flex items-center bg-black/60 dark:bg-black/80 backdrop-blur-md justify-center p-4">
        <div class="relative w-full max-w-sm bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-2xl flex flex-col items-center justify-center p-8 rounded-3xl">
          <div class="absolute -inset-1 bg-gradient-to-r from-orange-400 to-red-500 rounded-3xl blur opacity-20"></div>
          
          <button @click="asd = false" class="absolute top-4 z-40 right-4 p-3 rounded-full bg-gray-100/80 dark:bg-gray-700/80 hover:bg-red-100 dark:hover:bg-red-900/50 transition-all duration-200 hover:scale-110 hover:rotate-90 group">
            <svg class="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-red-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
          
          <div class="relative z-10 w-full">
            <div class="text-center mb-8">
              <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl mb-4 shadow-lg">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
                </svg>
              </div>
              <h3 class="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">{{ dat === 'datakril' ? translateText(`Amallar`) :'Amallar' }}</h3>
            </div>
            
            <div class="space-y-4">
              <button 
                @click="Modal"
                class="group relative w-full overflow-hidden rounded-xl"
              >
                <div class="absolute inset-0 bg-gradient-to-r from-emerald-500 to-blue-500 transition-all duration-300 group-hover:scale-105"></div>
                <div class="absolute inset-0 bg-gradient-to-r from-emerald-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <div class="relative flex items-center justify-center gap-3 text-white font-semibold py-4 px-6 transition-all duration-300 group-hover:scale-105">
                  <svg class="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                  <span>{{ dat === 'darakril' ? translateText(`O'zgartirish`) :`O'zgartirish` }}</span>
                </div>
              </button>

              <button 
                @click="removeSelectedItems"
                class="group relative w-full overflow-hidden rounded-xl"
              >
                <div class="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 transition-all duration-300 group-hover:scale-105"></div>
                <div class="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <div class="relative flex items-center justify-center gap-3 text-white font-semibold py-4 px-6 transition-all duration-300 group-hover:scale-105">
                  <svg class="w-5 h-5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                  <span>{{ dat === `datakril` ? translateText(`O'chirish`) : `O'chirish` }}</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Enhanced Modal for Update -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div v-if="PutModal" @click.self="PutModal = false" class="fixed inset-0 z-50 w-full h-full flex items-center bg-black/60 dark:bg-black/80 backdrop-blur-md justify-center p-4">
        <div class="relative w-full max-w-md bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-2xl flex flex-col items-center justify-center p-8 rounded-3xl">
          <div class="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-3xl blur opacity-20"></div>
          
          <button @click="Modal" class="absolute z-40 top-4 right-4 p-3 rounded-full bg-gray-100/80 dark:bg-gray-700/80 hover:bg-red-100 dark:hover:bg-red-900/50 transition-all duration-200 hover:scale-110 hover:rotate-90 group">
            <svg class="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-red-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
          
          <div class="relative z-10 w-full">
            <div class="text-center mb-8">
              <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl mb-4 shadow-lg">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
              </div>
              <h3 class="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">Bo'limni yangilash</h3>
            </div>
            
            <form @submit.prevent="updateCourt" class="space-y-6">
              <div class="group">
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors duration-200">Bo'lim nomi</label>
                <div class="relative">
                  <input 
                    v-model="courtName" 
                    class="w-full bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 outline-none p-4 transition-all duration-300 hover:border-blue-300 dark:hover:border-blue-500" 
                    type="text"
                    placeholder="Bo'lim nomini kiriting" 
                  />
                  <div class="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/0 to-purple-500/0 group-focus-within:from-blue-400/10 group-focus-within:to-purple-500/10 transition-all duration-300 pointer-events-none"></div>
                </div>
              </div>

              <div class="group">
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors duration-200">Havola</label>
                <div class="relative">
                  <input 
                    v-model="url" 
                    class="w-full bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 outline-none p-4 transition-all duration-300 hover:border-blue-300 dark:hover:border-blue-500" 
                    type="text"
                    placeholder="Link kiriting" 
                  />
                  <div class="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/0 to-purple-500/0 group-focus-within:from-blue-400/10 group-focus-within:to-purple-500/10 transition-all duration-300 pointer-events-none"></div>
                </div>
              </div>

              <div class="group">
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors duration-200">Rasm</label>
                <div class="relative">
                  <input 
                    @change="onFileChange" 
                    type="file" 
                    id="file" 
                    accept="image/*"
                    class="block w-full text-sm text-gray-900 dark:text-gray-300 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-600 rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 p-4 transition-all duration-300 hover:border-blue-300 dark:hover:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/50 dark:file:text-blue-300 dark:hover:file:bg-blue-900/70" 
                  />
                </div>
              </div>

              <button 
                class="group relative w-full mt-8 overflow-hidden rounded-xl"
                type="submit"
              >
                <div class="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 group-hover:scale-105"></div>
                <div class="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <div class="relative flex items-center justify-center gap-3 text-white font-semibold py-4 px-6 transition-all duration-300 group-hover:scale-105">
                  <svg class="w-5 h-5 transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                  <span>{{ dat === 'datakril' ? translateText(`Yangilash`) : `Yangilash` }}</span>
                </div>
              </button>
            </form>
            
            <Transition
              enter-active-class="transition duration-300 ease-out"
              enter-from-class="opacity-0 translate-y-2"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition duration-200 ease-in"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 translate-y-2"
            >
              <div v-if="successMessage" class="mt-6 p-4 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700 rounded-xl">
                <p class="text-emerald-700 dark:text-emerald-300 font-medium text-center">{{ dat === 'datakril' ? translateText(successMessage) :successMessage }}</p>
              </div>
            </Transition>
            
            <Transition
              enter-active-class="transition duration-300 ease-out"
              enter-from-class="opacity-0 translate-y-2"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition duration-200 ease-in"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 translate-y-2"
            >
              <div v-if="errorMessage" class="mt-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-xl">
                <p class="text-red-700 dark:text-red-300 font-medium text-center">{{ dat === 'datakril' ? translateText(errorMessage):errorMessage}}</p>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Main Content -->
    <div class="relative z-10 flex flex-col items-center py-2">
      <!-- Enhanced Add Button -->
      <div class="w-full max-w-7xl flex justify-end mb-[100px] animate-fade-in-right">
        <div class="group absolute right-[50px]">
          <div class="absolute -inset-0.5 bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
          <button 
            @click="toggleModal" 
            class="relative flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 dark:from-emerald-600 dark:to-blue-700 dark:hover:from-emerald-700 dark:hover:to-blue-800 text-white font-bold py-4 px-8 rounded-xl shadow-2xl hover:shadow-emerald-500/25 transform hover:scale-105 transition-all duration-300 backdrop-blur-sm border border-white/20"
          >
            <div class="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <svg class="relative w-6 h-6 transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            <span class="relative text-lg">{{ dat === 'datakril' ? translateText(`Qo'shish`) : `Qo'shish` }}</span>
            <div class="absolute -inset-2 bg-gradient-to-r from-emerald-400/30 to-blue-600/30 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </button>
        </div>
      </div>

      <!-- Content Section -->
      <div class="w-full">
        <!-- Enhanced Main Card -->
        <div class="relative px-8">
          <div class="relative">
            <!-- Enhanced Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              <!-- Enhanced Datakril Items -->
              <TransitionGroup
                name="card"
                enter-active-class="transition duration-500 ease-out"
                enter-from-class="opacity-0 scale-90 rotate-3"
                enter-to-class="opacity-100 scale-100 rotate-0"
                leave-active-class="transition duration-300 ease-in"
                leave-from-class="opacity-100 scale-100 rotate-0"
                leave-to-class="opacity-0 scale-90 -rotate-3"
                move-class="transition duration-300 ease-in-out"
              >
                <!-- Enhanced Datalotin Items -->
                <div 
                  v-for="(item, index) in data" 
                  :key="item.id"
                  :style="{ 'animation-delay': `${index * 100}ms` }"
                  class=" relative group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-gray-200/50 dark:border-gray-700/50 hover:border-emerald-400/50 dark:hover:border-gray-500/50 rounded-2xl p-4 shadow-lg hover:shadow-2xl transform transition-all duration-500 cursor-pointer animate-fade-in-up overflow-hidden"
                  @click="goToPath(item.url)"
                >
                  <button 
                    @click.stop="func(item)" 
                    class="absolute top-2 right-1 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 z-40 hover:scale-110 hover:rotate-90"
                  >
                    <svg class="w-5 h-5 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                    </svg>
                  </button>
                  
                  <div class="relative z-10 space-y-6">
                    <div class="relative transition-transform duration-500">
                      <div class="w-full h-[200px] rounded-lg p-2 flex items-center justify-center mb-4 bg-slate-700 dark:group-hover:bg-blue-500/20 text-slate-300 transition-colors duration-300 relative  overflow-hidden shadow-xl border-2 border-white/50 dark:border-gray-600/50">
                        <img 
                          v-if="item.img" 
                          :src="getImageUrl(item.img)" 
                          alt="Service Icon" 
                          class="w-full h-full object-cover transition-transform duration-500"
                        />
                        <div v-else class="w-12 h-12 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-xl flex items-center justify-center">
                          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    <div class="space-y-2">
                      <h3 class="text-xl font-bold text-gray-800 dark:text-white transition-colors duration-300 leading-tight">
                        {{ dat === 'datakril' ? translateText(item.name) :item.name }}
                      </h3>
                    </div>
                  </div>

                  <!-- Hover overlay -->
                  <div class="absolute inset-0 bg-gradient-to-br from-emerald-400/5 via-blue-400/5 to-purple-400/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </TransitionGroup>
            </div>

            <!-- Empty State -->
            <div v-if="(dat === 'datakril' && datakril.length === 0) || (dat === 'datalotin' && data.length === 0)" class="text-center py-16">
              <div class="relative">
                <div class="absolute -inset-4 bg-gradient-to-r from-gray-400/20 to-gray-600/20 rounded-full blur-2xl"></div>
                <div class="relative w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg class="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                  </svg>
                </div>
              </div>
              <h3 class="text-2xl font-bold text-gray-500 dark:text-gray-400 mb-3">{{ dat === 'datakril' ? translateText(`Hozircha bo'limlar yo'q`) : `Hozircha bo'limlar yo'q` }}</h3>
              <p class="text-gray-400 dark:text-gray-500 mb-6">{{ dat === 'datakril' ?translateText(`Yangi bo'lim qo'shish uchun yuqoridagi tugmani bosing`) : `Yangi bo'lim qo'shish uchun yuqoridagi tugmani bosing` }}</p>
              <button 
                @click="toggleModal"
                class="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                {{ dat === 'datakril' ?translateText(`Birinchi bo'limni qo'shish`):`Birinchi bo'limni qo'shish` }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject, ref, watch } from "vue";
import { URL } from "../../auth/url.js";
import axios from "axios";

const PutId = ref(null);
const PutModal = ref(false);
const showModal = ref(false);
const asd = ref(false);
const url = ref("");
const courtName = ref("");
const file = ref(null);
const successMessage = ref("");
const errorMessage = ref("");
const data = ref([]);
const imageBaseUrl = `${URL}/upload`;

const toggleModal = () => {
  showModal.value = !showModal.value;
  // Clear messages when opening modal
  successMessage.value = "";
  errorMessage.value = "";
};

const Modal = () => {
  PutModal.value = !PutModal.value;
  asd.value = !asd.value;
  // Clear messages when opening modal
  successMessage.value = "";
  errorMessage.value = "";
};

const func = (item) => {
  PutId.value = item.id;
  url.value = item.url;
  courtName.value = item.name;
  asd.value = !asd.value;
};

const onFileChange = (event) => {
  file.value = event.target.files[0];
};

const handleSubmit = async () => {
  if (PutModal.value) {
    await updateCourt();
  } else {
    await uploadCourt();
  }
};

const uploadCourt = async () => {
  try {
    const formData = new FormData();
    formData.append("name", courtName.value);
    formData.append("file", file.value);
    formData.append("url", url.value);

    const response = await axios.post(`${URL}/appeal`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response.status === 200 || response.status === 201) {
      successMessage.value = "Bo'lim muvaffaqiyatli qo'shildi! ✨";
      errorMessage.value = "";
      courtName.value = "";
      url.value = "";
      file.value = null;
      showModal.value = false
      
      // Reset file input
      const fileInput = document.getElementById('file');
      if (fileInput) fileInput.value = '';
      
      await getData();
      
      // Auto close modal after success
      setTimeout(() => {
        showModal.value = false;
        successMessage.value = "";
      }, 2000);
    }
  } catch (error) {
    console.error("Upload error:", error);
    errorMessage.value = "Xatolik yuz berdi. Iltimos, qayta urinib ko'ring! ❌";
    successMessage.value = "";
  }
};

import { onUnmounted } from "vue";
import { onMounted } from "vue";
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
  intervalId = setInterval(checkLanguageChange, 100);
  getData();
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});

import translateText from "@/auth/Translate";

const getData = async () => {
  try {
    const response = await fetch(`${URL}/appeal`);
    if (response.ok) {
      const result = await response.json();
      datakril.value = result
        .filter(item => item.status === 'active')
        .sort((a, b) => a.id - b.id)
        .map(item => ({
          ...item,
          translatedName: translateText(item.name)
        }));
      data.value = result
        .filter(item => item.status === 'active')
        .sort((a, b) => a.id - b.id);
    } else {
      console.error("Ma'lumotlarni olishda xatolik:", response.statusText);
    }
  } catch (error) {
    console.error("Network error:", error);
  }
};

const updateCourt = async () => {
  try {
    const formData = new FormData();
    formData.append("name", courtName.value);
    if (file.value) {
      formData.append("file", file.value);
    }
    formData.append("url", url.value);

    const response = await axios.put(`${URL}/appeal/${PutId.value}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response.status === 200) {
      successMessage.value = "Bo'lim muvaffaqiyatli yangilandi! ✨";
      errorMessage.value = "";
      
      await getData();
      PutModal.value = false
      
      // Auto close modals after success
      setTimeout(() => {
        PutModal.value = false;
        asd.value = false;
        successMessage.value = "";
        courtName.value = "";
        url.value = "";
        file.value = null;
      }, 2000);
    }
  } catch (error) {
    console.error("Update error:", error);
    errorMessage.value = "Yangilashda xatolik yuz berdi! ❌";
    successMessage.value = "";
  }
};

const removeSelectedItems = async () => {
  if (!PutId.value) return;

  try {
    const response = await fetch(`${URL}/appeal/${PutId.value}`, { 
      method: "DELETE" 
    });

    if (response.ok) {
      asd.value = false;
      await getData();
      
      // Show success notification
      successMessage.value = "Bo'lim muvaffaqiyatli o'chirildi! ✨";
      setTimeout(() => {
        successMessage.value = "";
      }, 3000);
    } else {
      console.error("O'chirishda xatolik:", response.statusText);
    }
  } catch (error) {
    console.error("Delete error:", error);
  }
};

// Enhanced body scroll lock
watch([showModal, PutModal, asd], ([modalOpen, putModalOpen, deleteModalOpen]) => {
  if (modalOpen || putModalOpen || deleteModalOpen) {
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = '15px'; // Compensate for scrollbar
  } else {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }
});

const goToPath = (url) => {
  if (url) {
    window.open(url, '_blank');
  }
};

const getImageUrl = (filename) => `${imageBaseUrl}/${filename}`;

// Initialize data on component mount
getData();
</script>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  @apply bg-gray-100 dark:bg-gray-800 rounded-full;
}

::-webkit-scrollbar-thumb {
  @apply bg-gradient-to-b from-emerald-400 to-blue-500 rounded-full;
}

::-webkit-scrollbar-thumb:hover {
  @apply from-emerald-500 to-blue-600;
}


/* Smooth focus states */
input:focus, button:focus {
  outline: none;
}

</style>