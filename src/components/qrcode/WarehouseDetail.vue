

<template>
  <div class="min-h-screen transition-all duration-700 dark:bg-[#1a2642] dark:text-gray-200 ease-in-out">
    <!-- Theme Toggle Button -->
    <div class="fixed top-6 right-6 z-50">
      <button 
        @click="toggleTheme"
        class="group relative p-4 rounded-2xl backdrop-blur-xl bg-white/20 dark:bg-gray-800/30 border border-white/30 dark:border-gray-700/50 shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-500 ease-out"
      >
        <div class="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <Icon :icon="isDark ? 'mdi:weather-sunny' : 'mdi:weather-night'" class="w-5 h-5 relative z-10 text-yellow-400 dark:text-blue-600 transition-all duration-300" />
      </button>
    </div>

    <div class="max-w-4xl mx-auto p-8">
      <!-- Back Button -->
      <div class="mb-6">
        <button 
          @click="goBack"
          class="group relative px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-500 overflow-hidden"
        >
          <div class="absolute inset-0 bg-gradient-to-r from-blue-700 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div class="relative z-10 flex items-center">
            <Icon icon="mdi:arrow-left" class="mr-2 w-5 h-5" />
            Orqaga
          </div>
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-16">
        <Icon icon="mdi:loading" class="w-16 h-16 text-blue-500 animate-spin mx-auto" />
        <p class="text-gray-600 dark:text-gray-300 text-lg mt-4">Yuklanmoqda...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-16">
        <div class="w-32 h-32 mx-auto bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900 dark:to-red-800 rounded-3xl flex items-center justify-center shadow-2xl">
          <Icon icon="mdi:alert-circle-outline" class="w-16 h-16 text-red-500" />
        </div>
        <h3 class="text-2xl font-bold text-red-600 dark:text-red-400 mt-4 mb-2">Xatolik yuz berdi</h3>
        <p class="text-gray-600 dark:text-gray-400">{{ error }}</p>
      </div>

      <!-- Warehouse Details -->
      <div v-else class="relative overflow-hidden bg-gradient-to-br from-white/95 to-white/85 dark:from-gray-800/95 dark:to-gray-900/85 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 dark:border-gray-700/40 p-8 group hover:shadow-3xl transition-all duration-700">
        <div class="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <div class="relative z-10">
          <!-- Header -->
          <div class="flex items-center justify-between mb-8">
            <div class="flex items-center">
              <div class="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mr-4 shadow-lg">
                <Icon icon="mdi:warehouse" class="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent">
                  {{ warehouse.name }}
                </h1>
                <p class="text-gray-600 dark:text-gray-300 text-lg mt-1">{{ warehouse.category?.name || 'Kategoriya topilmadi' }}</p>
              </div>
            </div>
            <div class="flex gap-3">
              <button 
                @click="openEditModal"
                class="group relative p-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 overflow-hidden"
              >
                <div class="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Icon icon="mdi:pencil-outline" class="w-5 h-5 relative z-10" />
              </button>
              <button 
                @click="openDeleteModal"
                class="group relative p-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 overflow-hidden"
              >
                <div class="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Icon icon="mdi:delete-outline" class="w-5 h-5 relative z-10" />
              </button>
            </div>
          </div>

          <!-- Images -->
          <div class="flex gap-6 mb-8">
            <div v-if="warehouse.imageUrl" class="relative group">
              <img :src="URL + '/' + warehouse.imageUrl" alt="Mahsulot rasmi" class="w-48 h-48 object-cover rounded-2xl border-4 border-white dark:border-gray-600 shadow-xl group-hover:scale-105 transition-transform duration-300" />
              <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300"></div>
            </div>
            <div v-if="warehouse.qrCodeUrl" class="relative group">
              <img :src="URL + '/' + warehouse.qrCodeUrl" alt="QR kod" class="w-48 h-48 object-cover rounded-2xl border-4 border-white dark:border-gray-600 shadow-xl group-hover:scale-105 transition-transform duration-300" />
              <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300"></div>
            </div>
          </div>

          <!-- Details -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div class="space-y-4">
              <div class="flex items-center">
                <Icon icon="mdi:numeric" class="w-6 h-6 text-green-500 mr-3" />
                <span class="font-semibold text-gray-700 dark:text-gray-300">Miqdori:</span>
                <span class="ml-2 text-gray-800 dark:text-gray-200">{{ warehouse.quantity }} dona</span>
              </div>
              <div class="flex items-center">
                <Icon icon="mdi:check-circle-outline" class="w-6 h-6 text-purple-500 mr-3" />
                <span class="font-semibold text-gray-700 dark:text-gray-300">Holati:</span>
                <span class="ml-2" :class="getConditionStyle(warehouse.condition)">{{ getConditionText(warehouse.condition) }}</span>
              </div>
              <div v-if="warehouse.serialNumber" class="flex items-center">
                <Icon icon="mdi:barcode" class="w-6 h-6 text-orange-500 mr-3" />
                <span class="font-semibold text-gray-700 dark:text-gray-300">Seriya Raqami:</span>
                <span class="ml-2 font-mono text-gray-800 dark:text-gray-200">{{ warehouse.serialNumber }}</span>
              </div>
            </div>
            <div class="space-y-4">
              <div v-if="warehouse.location" class="flex items-center">
                <Icon icon="mdi:map-marker-outline" class="w-6 h-6 text-red-500 mr-3" />
                <span class="font-semibold text-gray-700 dark:text-gray-300">Joylashuvi:</span>
                <span class="ml-2 text-gray-800 dark:text-gray-200">{{ warehouse.location }}</span>
              </div>
              <div v-if="warehouse.purchaseDate" class="flex items-center">
                <Icon icon="mdi:calendar-outline" class="w-6 h-6 text-cyan-500 mr-3" />
                <span class="font-semibold text-gray-700 dark:text-gray-300">Sotib Olingan Sana:</span>
                <span class="ml-2 text-gray-800 dark:text-gray-200">{{ formatDate(warehouse.purchaseDate) }}</span>
              </div>
            </div>
          </div>

          <!-- Description -->
          <div v-if="warehouse.description" class="border-t border-gray-200/50 dark:border-gray-600/50 pt-6">
            <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
              <Icon icon="mdi:text-box-outline" class="w-6 h-6 text-indigo-500 mr-3" />
              Tavsif
            </h3>
            <p class="text-gray-600 dark:text-gray-400 leading-relaxed">{{ warehouse.description }}</p>
          </div>
        </div>
      </div>
    </div>

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
                </div>

                <!-- Description Field (Full Width) -->
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

                <!-- Image Upload Field (Full Width) -->
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

                <!-- Form Actions -->
                <div class="flex justify-end gap-3 pt-4">
                  <button 
                    type="button"
                    @click="closeEditModal"
                    class="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 font-semibold"
                  >
                    Bekor Qilish
                  </button>
                  <button 
                    type="submit" 
                    :disabled="loading"
                    class="group relative px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl hover:shadow-xl focus:ring-4 focus:ring-blue-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center overflow-hidden font-semibold"
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
              <p class="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                "{{ warehouse.name }}" mahsulotini o'chirishni tasdiqlaysizmi? Bu amal qaytarib bo'lmaydi.
              </p>
              <div class="flex justify-end gap-3">
                <button 
                  @click="closeDeleteModal"
                  class="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 font-semibold"
                >
                  Bekor Qilish
                </button>
                <button 
                  @click="deleteWarehouseAction"
                  :disabled="loading"
                  class="group relative px-6 py-3 bg-gradient-to-r from-red-600 to-pink-500 text-white rounded-xl hover:shadow-xl focus:ring-4 focus:ring-red-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center overflow-hidden font-semibold"
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
import { useRoute, useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import { URL } from '@/auth/url.js';

const route = useRoute();
const router = useRouter();
const warehouse = ref({});
const loading = ref(false);
const error = ref(null);
const isDark = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const editImage = ref(null);

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

const editImagePreview = computed(() => {
  if (editImage.value) return URL.createObjectURL(editImage.value);
  if (editForm.value.imageUrl) return `${URL}/${editForm.value.imageUrl}`;
  return null;
});

const getConditionStyle = (condition) => {
  switch (condition) {
    case 'yangi': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-2 py-1 rounded-lg';
    case 'yaxshi': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded-lg';
    case 'qoniqarli': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 px-2 py-1 rounded-lg';
    case 'tamirlash_kerak': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 px-2 py-1 rounded-lg';
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

const fetchWarehouse = async () => {
  loading.value = true;
  error.value = null;
  try {
    const { data } = await axios.get(`${URL}/warehouse/${route.params.id}`);
    warehouse.value = data;
    editForm.value = {
      id: data.id,
      name: data.name,
      quantity: data.quantity,
      description: data.description || '',
      condition: data.condition || '',
      serialNumber: data.serialNumber || '',
      location: data.location || '',
      purchaseDate: data.purchaseDate ? new Date(data.purchaseDate).toISOString().split('T')[0] : '',
      imageUrl: data.imageUrl || ''
    };
  } catch (err) {
    error.value = err.response?.data?.message || 'Mahsulot ma\'lumotlarini yuklashda xatolik yuz berdi';
    console.error('Fetch error:', err);
  } finally {
    loading.value = false;
  }
};

const handleEditFile = (event) => {
  editImage.value = event.target.files[0];
};

const updateWarehouse = async () => {
  loading.value = true;
  try {
    const formData = new FormData();
    formData.append('name', editForm.value.name);
    formData.append('quantity', editForm.value.quantity);
    formData.append('categoryId', warehouse.value.categoryId);
    if (editForm.value.description) formData.append('description', editForm.value.description);
    if (editForm.value.condition) formData.append('condition', editForm.value.condition);
    if (editForm.value.serialNumber) formData.append('serialNumber', editForm.value.serialNumber);
    if (editForm.value.location) formData.append('location', editForm.value.location);
    if (editForm.value.purchaseDate) formData.append('purchaseDate', editForm.value.purchaseDate);
    if (editImage.value) formData.append('image', editImage.value);

    await axios.patch(`${URL}/warehouse/${editForm.value.id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    editImage.value = null;
    closeEditModal();
    await fetchWarehouse();
  } catch (err) {
    error.value = err.response?.data?.message || 'Mahsulotni yangilashda xatolik yuz berdi';
    console.error('Update error:', err);
  } finally {
    loading.value = false;
  }
};

const deleteWarehouseAction = async () => {
  loading.value = true;
  try {
    await axios.delete(`${URL}/warehouse/${warehouse.value.id}`);
    closeDeleteModal();
    router.push('/'); // Navigate back to the main page after deletion
  } catch (err) {
    error.value = err.response?.data?.message || 'Mahsulotni o\'chirishda xatolik yuz berdi';
    console.error('Delete error:', err);
  } finally {
    loading.value = false;
  }
};

const openEditModal = () => {
  showEditModal.value = true;
};

const closeEditModal = () => {
  showEditModal.value = false;
  editImage.value = null;
};

const openDeleteModal = () => {
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
};

const goBack = () => {
  router.go(-1); // Navigate to the previous page
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
  fetchWarehouse();
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    isDark.value = savedTheme === 'dark';
  } else {
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
});
</script>

<style scoped>
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