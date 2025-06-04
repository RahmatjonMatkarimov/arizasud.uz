<template>
  <div class="min-h-screen transition-all duration-700 ease-in-out" :class="themeClasses.background">
    <!-- Glassmorphism Theme Toggle -->
    <div class="fixed top-6 right-6 z-50">
      <button 
        @click="toggleTheme"
        class="group relative p-4 rounded-2xl backdrop-blur-xl bg-white/20 dark:bg-gray-800/30 border border-white/30 dark:border-gray-700/50 shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-500 ease-out"
      >
        <div class="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <Icon :icon="isDark ? 'mdi:weather-sunny' : 'mdi:weather-night'" class="w-5 h-5 relative z-10 text-yellow-400 dark:text-blue-600 transition-all duration-300" />
      </button>
    </div>

    <div class="max-w-7xl mx-auto p-8">
      <!-- Enhanced Header with Gradient -->
      <div class="relative overflow-hidden bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-800/90 dark:to-gray-900/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 p-8 mb-8 group hover:shadow-3xl transition-all duration-700">
        <div class="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <div class="relative z-10">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mr-4 shadow-lg">
                <Icon icon="mdi:warehouse" class="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 class="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent mb-2">
                  Ombor Boshqaruvi
                </h1>
                <p class="text-gray-600 dark:text-gray-300 text-lg">Yangi mahsulotlarni qo'shing va mavjud omborni boshqaring</p>
              </div>
            </div>
            <!-- Create New Product Button -->
            <button 
              @click="openCreateModal"
              class="group relative px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 text-white font-bold rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-500 overflow-hidden"
            >
              <div class="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div class="relative z-10 flex items-center">
                <Icon icon="mdi:plus-circle-outline" class="mr-3 w-5 h-5" />
                Yangi Mahsulot Qo'shish
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- Enhanced Products List -->
      <div class="relative overflow-hidden bg-gradient-to-br from-white/95 to-white/85 dark:from-gray-800/95 dark:to-gray-900/85 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 dark:border-gray-700/40 p-8 group hover:shadow-3xl transition-all duration-700">
        <div class="absolute inset-0 bg-gradient-to-r from-green-500/5 via-teal-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <div class="relative z-10">
          <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center">
            <div class="p-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl mr-3 shadow-lg">
              <Icon icon="mdi:view-list-outline" class="w-5 h-5 text-white" />
            </div>
            Mavjud Mahsulotlar
            <span class="ml-4 px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm rounded-full shadow-lg">
              {{ warehouses.length }}
            </span>
          </h2>

          <div v-if="warehouses.length === 0" class="text-center py-16">
            <div class="relative mb-8">
              <div class="w-32 h-32 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-3xl flex items-center justify-center shadow-2xl">
                <Icon icon="mdi:package-variant-closed" class="w-16 h-16 text-gray-400 dark:text-gray-500" />
              </div>
              <div class="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full animate-bounce"></div>
            </div>
            <h3 class="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-4">Hozircha hech qanday mahsulot yo'q</h3>
            <p class="text-gray-500 dark:text-gray-500 text-lg">Yuqoridagi tugma orqali yangi mahsulot qo'shing</p>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <div 
              v-for="warehouse in warehouses" 
              :key="warehouse.id"
              class="group relative bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-700/90 dark:to-gray-800/70 backdrop-blur-xl rounded-2xl p-6 border border-white/40 dark:border-gray-600/40 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-500 overflow-hidden"
            >
              <div class="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div class="relative z-10">
                <!-- Product Header -->
                <div class="flex items-start justify-between mb-6">
                  <h3 class="text-lg font-bold text-gray-800 dark:text-gray-200 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {{ warehouse.name }}
                  </h3>
                  <div class="flex flex-col items-end gap-2">
                    <span class="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-bold rounded-full shadow-lg">
                      {{ warehouse.quantity }} dona
                    </span>
                    <div v-if="warehouse.condition" class="px-2 py-1 text-xs font-semibold rounded-lg" :class="getConditionStyle(warehouse.condition)">
                      {{ getConditionText(warehouse.condition) }}
                    </div>
                  </div>
                </div>

                <!-- Product Images -->
                <div class="flex gap-4 mb-6">
                  <div v-if="warehouse.imageUrl" class="relative group">
                    <img :src="URL + '/' + warehouse.imageUrl" alt="Mahsulot rasmi" class="w-24 h-24 object-cover rounded-xl border-2 border-white dark:border-gray-600 shadow-lg group-hover:scale-110 transition-transform duration-300" />
                    <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300"></div>
                  </div>
                  <div v-if="warehouse.qrCodeUrl" class="relative group">
                    <img :src="URL + '/' + warehouse.qrCodeUrl" alt="QR kod" class="w-24 h-24 object-cover rounded-xl border-2 border-white dark:border-gray-600 shadow-lg group-hover:scale-110 transition-transform duration-300" />
                    <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300"></div>
                  </div>
                </div>

                <!-- Product Details -->
                <div class="space-y-3 text-sm text-gray-600 dark:text-gray-400 mb-6">
                  <div v-if="warehouse.serialNumber" class="flex items-center">
                    <Icon icon="mdi:barcode" class="w-5 h-5 text-orange-500 mr-3" />
                    <span class="font-medium w-16">S/N:</span>
                    <span class="font-mono">{{ warehouse.serialNumber }}</span>
                  </div>
                  <div v-if="warehouse.location" class="flex items-center">
                    <Icon icon="mdi:map-marker-outline" class="w-5 h-5 text-red-500 mr-3" />
                    <span class="font-medium w-16">Joy:</span>
                    <span class="font-semibold">{{ warehouse.location }}</span>
                  </div>
                  <div v-if="warehouse.purchaseDate" class="flex items-center">
                    <Icon icon="mdi:calendar-outline" class="w-5 h-5 text-cyan-500 mr-3" />
                    <span class="font-medium w-16">Sana:</span>
                    <span>{{ formatDate(warehouse.purchaseDate) }}</span>
                  </div>
                </div>

                <!-- Product Description -->
                <div v-if="warehouse.description" class="mb-6 pt-4 border-t border-gray-200/50 dark:border-gray-600/50">
                  <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed">{{ warehouse.description }}</p>
                </div>

                <!-- Action Buttons -->
                <div class="flex justify-end gap-3">
                  <button 
                    @click="openEditModal(warehouse)"
                    class="group relative p-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 overflow-hidden"
                  >
                    <div class="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <Icon icon="mdi:pencil-outline" class="w-5 h-5 relative z-10" />
                  </button>
                  <button 
                    @click="openDeleteModal(warehouse)"
                    class="group relative p-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 overflow-hidden"
                  >
                    <div class="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <Icon icon="mdi:delete-outline" class="w-5 h-5 relative z-10" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Modal -->
    <Teleport to="body">
      <Transition name="modal" appear>
        <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md" @click="closeCreateModal">
          <div class="relative bg-gradient-to-br from-white/95 to-white/85 dark:from-gray-800/95 dark:to-gray-900/85 backdrop-blur-xl rounded-3xl p-8 w-full max-w-2xl m-6 shadow-2xl border border-white/30 dark:border-gray-700/40 overflow-hidden" @click.stop>
            <div class="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-blue-500/5 to-purple-500/5"></div>
            
            <div class="relative z-10">
              <!-- Modal Header -->
              <div class="flex items-center justify-between mb-8">
                <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
                  <div class="p-2 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl mr-3 shadow-lg">
                    <Icon icon="mdi:plus-circle-outline" class="w-5 h-5 text-white" />
                  </div>
                  Yangi Mahsulot Qo'shish
                </h3>
                <button 
                  @click="closeCreateModal"
                  class="p-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-300"
                >
                  <Icon icon="mdi:close" class="w-5 h-5" />
                </button>
              </div>

              <!-- Create Form -->
              <form @submit.prevent="createWarehouse" enctype="multipart/form-data" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                      <Icon icon="mdi:tag-outline" class="w-5 h-5 text-blue-500 mr-2" />
                      Mahsulot Nomi *
                    </label>
                    <input 
                      v-model="form.name" 
                      type="text"
                      placeholder="Mahsulot nomini kiriting" 
                      required 
                      class="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm text-gray-800 dark:text-gray-200 focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                      <Icon icon="mdi:numeric" class="w-5 h-5 text-green-500 mr-2" />
                      Miqdori *
                    </label>
                    <input 
                      v-model.number="form.quantity" 
                      type="number" 
                      min="1" 
                      placeholder="Miqdorni kiriting" 
                      required 
                      class="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm text-gray-800 dark:text-gray-200 focus:ring-4 focus:ring-green-500/30 focus:border-green-500 transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                      <Icon icon="mdi:check-circle-outline" class="w-5 h-5 text-purple-500 mr-2" />
                      Holati
                    </label>
                    <select 
                      v-model="form.condition"
                      class="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm text-gray-800 dark:text-gray-200 focus:ring-4 focus:ring-purple-500/30 focus:border-purple-500 transition-all duration-300"
                    >
                      <option value="">Holatni tanlang</option>
                      <option value="yangi">✨ Yangi</option>
                      <option value="yaxshi">👍 Yaxshi</option>
                      <option value="qoniqarli">👌 Qoniqarli</option>
                      <option value="tamirlash_kerak">🔧 Tamirlash kerak</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                      <Icon icon="mdi:barcode" class="w-5 h-5 text-orange-500 mr-2" />
                      Seriya Raqami
                    </label>
                    <input 
                      v-model="form.serialNumber" 
                      type="text"
                      placeholder="Seriya raqamini kiriting" 
                      class="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm text-gray-800 dark:text-gray-200 focus:ring-4 focus:ring-orange-500/30 focus:border-orange-500 transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                      <Icon icon="mdi:map-marker-outline" class="w-5 h-5 text-red-500 mr-2" />
                      Joylashuvi
                    </label>
                    <input 
                      v-model="form.location" 
                      type="text"
                      placeholder="Joyni kiriting (A-1, B-5, ...)" 
                      class="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm text-gray-800 dark:text-gray-200 focus:ring-4 focus:ring-red-500/30 focus:border-red-500 transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                      <Icon icon="mdi:calendar-outline" class="w-5 h-5 text-cyan-500 mr-2" />
                      Sotib Olingan Sana
                    </label>
                    <input 
                      v-model="form.purchaseDate" 
                      type="date"
                      class="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm text-gray-800 dark:text-gray-200 focus:ring-4 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                      <Icon icon="mdi:text-box-outline" class="w-5 h-5 text-indigo-500 mr-2" />
                      Tavsif
                    </label>
                    <textarea 
                      v-model="form.description" 
                      placeholder="Mahsulot haqida qo'shimcha ma'lumot..." 
                      rows="4"
                      class="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm text-gray-800 dark:text-gray-200 focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-300 resize-none"
                    ></textarea>
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                      <Icon icon="mdi:image-outline" class="w-5 h-5 text-pink-500 mr-2" />
                      Mahsulot Rasmi
                    </label>
                    <input 
                      type="file" 
                      @change="handleFile"
                      accept="image/*"
                      class="w-full px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm text-gray-800 dark:text-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-pink-500 file:to-purple-600 file:text-white hover:file:from-pink-600 hover:file:to-purple-700 transition-all duration-300 hover:border-pink-400 dark:hover:border-pink-500"
                    />
                    <div v-if="imagePreview" class="mt-4 flex justify-center">
                      <div class="relative group">
                        <img :src="imagePreview" alt="Preview" class="w-32 h-32 object-cover rounded-2xl border-4 border-white dark:border-gray-600 shadow-xl group-hover:scale-105 transition-transform duration-300" />
                        <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="flex justify-end gap-2">
                  <button 
                    type="button"
                    @click="closeCreateModal"
                    class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300"
                  >
                    Bekor Qilish
                  </button>
                  <button 
                    type="submit" 
                    :disabled="loading"
                    class="group relative px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:shadow-xl focus:ring-4 focus:ring-blue-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center overflow-hidden"
                  >
                    <div class="absolute inset-0 bg-gradient-to-r from-blue-700 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div class="relative z-10 flex items-center">
                      <Icon v-if="loading" icon="mdi:loading" class="animate-spin mr-2 w-5 h-5" />
                      {{ loading ? 'Qo\'shilmoqda...' : 'Qo\'shish' }}
                    </div>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Edit Modal -->
    <Teleport to="body">
      <Transition name="modal" appear>
        <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md" @click="closeEditModal">
          <div class="relative bg-gradient-to-br from-white/95 to-white/85 dark:from-gray-800/95 dark:to-gray-900/85 backdrop-blur-xl rounded-3xl p-8 w-full max-w-2xl m-6 shadow-2xl border border-white/30 dark:border-gray-700/40 overflow-hidden" @click.stop>
            <div class="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-cyan-500/5"></div>
            
            <div class="relative z-10">
              <!-- Modal Header -->
              <div class="flex items-center justify-between mb-8">
                <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
                  <div class="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl mr-3 shadow-lg">
                    <Icon icon="mdi:pencil-outline" class="w-5 h-5 text-white" />
                  </div>
                  Mahsulotni Tahrirlash
                </h3>
                <button 
                  @click="closeEditModal"
                  class="p-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-300"
                >
                  <Icon icon="mdi:close" class="w-5 h-5" />
                </button>
              </div>

              <!-- Edit Form -->
              <form @submit.prevent="updateWarehouse" enctype="multipart/form-data" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                      <Icon icon="mdi:tag-outline" class="w-5 h-5 text-blue-500 mr-2" />
                      Mahsulot Nomi *
                    </label>
                    <input 
                      v-model="editForm.name" 
                      type="text"
                      placeholder="Mahsulot nomini kiriting" 
                      required 
                      class="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm text-gray-800 dark:text-gray-200 focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                      <Icon icon="mdi:numeric" class="w-5 h-5 text-green-500 mr-2" />
                      Miqdori *
                    </label>
                    <input 
                      v-model.number="editForm.quantity" 
                      type="number" 
                      min="1" 
                      required 
                      class="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm text-gray-800 dark:text-gray-200 focus:ring-4 focus:ring-green-500/30 focus:border-green-500 transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                      <Icon icon="mdi:check-circle-outline" class="w-5 h-5 text-purple-500 mr-2" />
                      Holati
                    </label>
                    <select 
                      v-model="editForm.condition"
                      class="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm text-gray-800 dark:text-gray-200 focus:ring-4 focus:ring-purple-500/30 focus:border-purple-500 transition-all duration-300"
                    >
                      <option value="">Holatni tanlang</option>
                      <option value="yangi">✨ Yangi</option>
                      <option value="yaxshi">👍 Yaxshi</option>
                      <option value="qoniqarli">👌 Qoniqarli</option>
                      <option value="tamirlash_kerak">🔧 Tamirlash kerak</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                      <Icon icon="mdi:barcode" class="w-5 h-5 text-orange-500 mr-2" />
                      Seriya Raqami
                    </label>
                    <input 
                      v-model="editForm.serialNumber" 
                      type="text"
                      placeholder="Seriya raqamini kiriting" 
                      class="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm text-gray-800 dark:text-gray-200 focus:ring-4 focus:ring-orange-500/30 focus:border-orange-500 transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                      <Icon icon="mdi:map-marker-outline" class="w-5 h-5 text-red-500 mr-2" />
                      Joylashuvi
                    </label>
                    <input 
                      v-model="editForm.location" 
                      type="text"
                      placeholder="Joyni kiriting (A-1, B-5, ...)" 
                      class="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm text-gray-800 dark:text-gray-200 focus:ring-4 focus:ring-red-500/30 focus:border-red-500 transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                      <Icon icon="mdi:calendar-outline" class="w-5 h-5 text-cyan-500 mr-2" />
                      Sotib Olingan Sana
                    </label>
                    <input 
                      v-model="editForm.purchaseDate" 
                      type="date"
                      class="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm text-gray-800 dark:text-gray-200 focus:ring-4 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                      <Icon icon="mdi:text-box-outline" class="w-5 h-5 text-indigo-500 mr-2" />
                      Tavsif
                    </label>
                    <textarea 
                      v-model="editForm.description" 
                      placeholder="Mahsulot haqida qo'shimcha ma'lumot..." 
                      rows="4"
                      class="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm text-gray-800 dark:text-gray-200 focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-300 resize-none"
                    ></textarea>
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                      <Icon icon="mdi:image-outline" class="w-5 h-5 text-pink-500 mr-2" />
                      Mahsulot Rasmi
                    </label>
                    <input 
                      type="file" 
                      @change="handleEditFile"
                      accept="image/*"
                      class="w-full px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm text-gray-800 dark:text-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-pink-500 file:to-purple-600 file:text-white hover:file:from-pink-600 hover:file:to-purple-700 transition-all duration-300 hover:border-pink-400 dark:hover:border-pink-500"
                    />
                    <div v-if="editImagePreview" class="mt-4 flex justify-center">
                      <div class="relative group">
                        <img :src="editImagePreview" alt="Preview" class="w-32 h-32 object-cover rounded-2xl border-4 border-white dark:border-gray-600 shadow-xl group-hover:scale-105 transition-transform duration-300" />
                        <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="flex justify-end gap-2">
                  <button 
                    type="button"
                    @click="closeEditModal"
                    class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300"
                  >
                    Bekor Qilish
                  </button>
                  <button 
                    type="submit" 
                    :disabled="loading"
                    class="group relative px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:shadow-xl focus:ring-4 focus:ring-blue-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center overflow-hidden"
                  >
                    <div class="absolute inset-0 bg-gradient-to-r from-blue-700 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div class="relative z-10 flex items-center">
                      <Icon v-if="loading" icon="mdi:loading" class="animate-spin mr-2 w-5 h-5" />
                      {{ loading ? 'Saqlanmoqda...' : 'Saqlash' }}
                    </div>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Delete Modal -->
    <Teleport to="body">
      <Transition name="modal" appear>
        <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md" @click="closeDeleteModal">
          <div class="relative bg-gradient-to-br from-white/95 to-white/85 dark:from-gray-800/95 dark:to-gray-900/85 backdrop-blur-xl rounded-3xl p-8 w-full max-w-md m-6 shadow-2xl border border-white/30 dark:border-gray-700/40 overflow-hidden" @click.stop>
            <div class="absolute inset-0 bg-gradient-to-br from-red-500/5 via-pink-500/5 to-orange-500/5"></div>
            <div class="relative z-10">
              <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center">
                <div class="p-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl mr-3 shadow-lg">
                  <Icon icon="mdi:delete-outline" class="w-5 h-5 text-white" />
                </div>
                Mahsulotni O'chirish
              </h3>
              <p class="text-gray-600 dark:text-gray-400 mb-6">
                "{{ deleteWarehouse?.name }}" mahsulotini o'chirishni tasdiqlaysizmi? Bu amal qaytarib bo'lmaydi.
              </p>
              <div class="flex justify-end gap-2">
                <button 
                  @click="closeDeleteModal"
                  class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300"
                >
                  Bekor Qilish
                </button>
                <button 
                  @click="deleteWarehouseAction"
                  :disabled="loading"
                  class="group relative px-4 py-2 bg-gradient-to-r from-red-600 to-pink-500 text-white rounded-lg hover:shadow-xl focus:ring-4 focus:ring-red-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center overflow-hidden"
                >
                  <div class="absolute inset-0 bg-gradient-to-r from-red-700 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div class="relative z-10 flex items-center">
                    <Icon v-if="loading" icon="mdi:loading" class="animate-spin mr-2 w-5 h-5" />
                    {{ loading ? 'O\'chirilmoqda...' : 'O\'chirish' }}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';
import { Icon } from '@iconify/vue';
import { URL } from '@/auth/url.js';

const route = useRoute();
const warehouses = ref([]);
const loading = ref(false);
const image = ref(null);
const isDark = ref(false);
const showCreateModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const deleteWarehouse = ref(null);
const editImage = ref(null);

const form = ref({
  name: '',
  quantity: 1,
  description: '',
  condition: '',
  serialNumber: '',
  location: '',
  purchaseDate: ''
});

const editForm = ref({
  id: null,
  name: '',
  quantity: 1,
  description: '',
  condition: '',
  serialNumber: '',
  location: '',
  purchaseDate: '',
  imageUrl: ''
});

const themeClasses = computed(() => ({
  background: isDark.value ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 to-gray-100'
}));

const imagePreview = computed(() => {
  return image.value ? URL.createObjectURL(image.value) : null;
});

const editImagePreview = computed(() => {
  if (editImage.value) return URL.createObjectURL(editImage.value);
  if (editForm.value.imageUrl) return `${URL}/${editForm.value.imageUrl}`;
  return null;
});

const getConditionStyle = (condition) => {
  switch (condition) {
    case 'yangi': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'yaxshi': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'qoniqarli': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'tamirlash_kerak': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    default: return '';
  }
};

const getConditionText = (condition) => {
  switch (condition) {
    case 'yangi': return '✨ Yangi';
    case 'yaxshi': return '👍 Yaxshi';
    case 'qoniqarli': return '👌 Qoniqarli';
    case 'tamirlash_kerak': return '🔧 Tamirlash kerak';
    default: return condition;
  }
};

const fetchWarehouses = async () => {
  try {
    const { data } = await axios.get(`${URL}/warehouse`);
    warehouses.value = data.filter(w => w.categoryId === parseInt(route.query.categoryId));
  } catch (error) {
    console.error('Omborlarni yuklashda xatolik:', error);
  }
};

const handleFile = (event) => {
  image.value = event.target.files[0];
};

const handleEditFile = (event) => {
  editImage.value = event.target.files[0];
};

const createWarehouse = async () => {
  loading.value = true;
  try {
    const formData = new FormData();
    formData.append('name', form.value.name);
    formData.append('quantity', form.value.quantity);
    formData.append('categoryId', route.query.categoryId);
    if (form.value.description) formData.append('description', form.value.description);
    if (form.value.condition) formData.append('condition', form.value.condition);
    if (form.value.serialNumber) formData.append('serialNumber', form.value.serialNumber);
    if (form.value.location) formData.append('location', form.value.location);
    if (form.value.purchaseDate) formData.append('purchaseDate', form.value.purchaseDate);
    if (image.value) formData.append('image', image.value);

    await axios.post(`${URL}/warehouse`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    resetForm();
    closeCreateModal();
    await fetchWarehouses();
  } catch (error) {
    console.error('Mahsulot qo\'shishda xatolik:', error);
  } finally {
    loading.value = false;
  }
};

const openCreateModal = () => {
  resetForm();
  showCreateModal.value = true;
};

const closeCreateModal = () => {
  showCreateModal.value = false;
  resetForm();
};

const openEditModal = (warehouse) => {
  editForm.value = {
    id: warehouse.id,
    name: warehouse.name,
    quantity: warehouse.quantity,
    description: warehouse.description || '',
    condition: warehouse.condition || '',
    serialNumber: warehouse.serialNumber || '',
    location: warehouse.location || '',
    purchaseDate: warehouse.purchaseDate || '',
    imageUrl: warehouse.imageUrl || ''
  };
  editImage.value = null;
  showEditModal.value = true;
};

const closeEditModal = () => {
  showEditModal.value = false;
  editForm.value = { id: null, name: '', quantity: 1, description: '', condition: '', serialNumber: '', location: '', purchaseDate: '', imageUrl: '' };
  editImage.value = null;
};

const updateWarehouse = async () => {
  loading.value = true;
  try {
    const formData = new FormData();
    formData.append('name', editForm.value.name);
    formData.append('quantity', editForm.value.quantity);
    formData.append('categoryId', route.query.categoryId);
    if (editForm.value.description) formData.append('description', editForm.value.description);
    if (editForm.value.condition) formData.append('condition', editForm.value.condition);
    if (editForm.value.serialNumber) formData.append('serialNumber', editForm.value.serialNumber);
    if (editForm.value.location) formData.append('location', editForm.value.location);
    if (editForm.value.purchaseDate) formData.append('purchaseDate', editForm.value.purchaseDate);
    if (editImage.value) formData.append('image', editImage.value);

    await axios.put(`${URL}/warehouse/${editForm.value.id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    resetForm();
    editImage.value = null;

    closeEditModal();
    await fetchWarehouses();
  } catch (error) {
    console.error('Mahsulotni yangilashda xatolik:', error);
  } finally {
    loading.value = false;
  }
};

const openDeleteModal = (warehouse) => {
  deleteWarehouse.value = warehouse;
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  deleteWarehouse.value = null;
};

const deleteWarehouseAction = async () => {
  loading.value = true;
  try {
    await axios.delete(`${URL}/warehouse/${deleteWarehouse.value.id}`);
    closeDeleteModal();
    await fetchWarehouses();
  } catch (error) {
    console.error('Mahsulotni o\'chirishda xatolik:', error);
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  form.value = {
    name: '',
    quantity: 1,
    description: '',
    condition: '',
    serialNumber: '',
    location: '',
    purchaseDate: ''
  };
  image.value = null;
  const fileInput = document.querySelector('input[type="file"]');
  if (fileInput) fileInput.value = '';
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('uz-UZ');
};

const toggleTheme = () => {
  isDark.value = !isDark.value;
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
};

onMounted(() => {
  fetchWarehouses();
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    isDark.value = savedTheme === 'dark';
  } else {
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active > div,
.modal-leave-active > div {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from > div,
.modal-leave-to > div {
  transform: translateY(-20px);
  opacity: 0;
}
</style>