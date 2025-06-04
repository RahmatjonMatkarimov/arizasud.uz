<template>
  <div class="min-h-screen transition-all duration-700" :class="themeClasses.background">
    
    <!-- Animated Background Elements -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-10 animate-float-slow"
           :class="isDark ? 'bg-gray-600' : 'bg-gray-300'"></div>
      <div class="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-10 animate-float-reverse"
           :class="isDark ? 'bg-gray-600' : 'bg-gray-300'"></div>
      <div class="absolute top-1/2 left-1/4 w-32 h-32 rounded-full opacity-10 animate-pulse-slow"
           :class="isDark ? 'bg-gray-600' : 'bg-gray-300'"></div>
    </div>

    <!-- Floating Theme Toggle -->
    <div class="fixed top-6 right-6 z-50">
      <button 
        @click="toggleTheme"
        class="group relative p-4 rounded-2xl transition-all duration-500 shadow-md hover:scale-110 backdrop-blur-sm border"
        :class="themeClasses.themeButton"
      >
        <Icon :icon="isDark ? 'mdi:weather-sunny' : 'mdi:weather-night'" 
              class="w-6 h-6 transition-all duration-500 group-hover:rotate-180" />
        
        <!-- Tooltip -->
        <div class="absolute -bottom-12 right-0 px-3 py-1 rounded-lg text-xs font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap"
             :class="themeClasses.tooltip">
          {{ isDark ? 'Light Mode' : 'Dark Mode' }}
        </div>
      </button>
    </div>

    <div class="container mx-auto px-6 py-16 max-w-6xl relative z-10">
      
      <!-- Animated Header Section -->
      <div class="text-center mb-16">
        <div class="relative inline-block">
          <div class="absolute inset-0 rounded-3xl blur-xl opacity-20 animate-pulse-glow"
               :class="isDark ? 'bg-gray-600' : 'bg-gray-300'"></div>
          <div class="relative inline-flex items-center gap-4 px-8 py-4 rounded-3xl backdrop-blur-sm border transition-all duration-500 hover:scale-105"
               :class="themeClasses.headerCard">
            <div class="relative">
              <Icon icon="mdi:package-variant-closed" class="w-8 h-8 animate-bounce-subtle" />
              <div class="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-ping"
                   :class="isDark ? 'bg-gray-600' : 'bg-gray-300'"></div>
            </div>
            <h1 class="text-3xl font-bold" :class="themeClasses.text">
              Kategoriya Boshqaruvi
            </h1>
          </div>
        </div>
        
        <p class="text-xl mt-6 opacity-80 animate-fade-in-up delay-200" :class="themeClasses.subtitle">
          Mahsulot kategoriyalarini professional tarzda boshqaring
        </p>
        
        <!-- Stats Cards -->
        <div class="flex justify-center gap-6 mt-8">
          <div class="px-6 py-3 rounded-2xl backdrop-blur-sm border transition-all duration-300 hover:scale-105 animate-fade-in-up delay-300"
               :class="themeClasses.statCard">
            <div class="text-2xl font-bold" :class="themeClasses.text">{{ categories.length }}</div>
            <div class="text-sm opacity-70" :class="themeClasses.text">Kategoriya</div>
          </div>
          <div class="px-6 py-3 rounded-2xl backdrop-blur-sm border transition-all duration-300 hover:scale-105 animate-fade-in-up delay-500"
               :class="themeClasses.statCard">
            <div class="text-2xl font-bold" :class="themeClasses.accentText">{{ totalItems }}</div>
            <div class="text-sm opacity-70" :class="themeClasses.text">Mahsulot</div>
          </div>
        </div>
      </div>

      <!-- Floating Add Button -->
      <div class="text-center mb-12">
        <button 
          @click="openModal"
          class="group relative inline-flex items-center gap-3 px-10 py-5 rounded-3xl font-bold text-lg transition-all duration-500 hover:scale-110 shadow-md hover:shadow-lg backdrop-blur-sm border"
          :class="themeClasses.addButton"
        >
          <div class="relative flex items-center gap-3">
            <div class="p-2 rounded-xl group-hover:rotate-90 transition-all duration-300"
                 :class="isDark ? 'bg-gray-600' : 'bg-gray-200'">
              <Icon icon="mdi:plus-circle" class="w-6 h-6" />
            </div>
            <span>Yangi Kategoriya Yaratish</span>
            <Icon icon="mdi:sparkles" class="w-5 h-5 animate-pulse" />
          </div>
        </button>
      </div>

      <!-- Categories Grid -->
      <div class="backdrop-blur-sm rounded-3xl p-8 border transition-all duration-500 hover:shadow-lg"
           :class="themeClasses.card">
        
        <div class="flex items-center justify-between mb-10">
          <div class="flex items-center gap-4">
            <div class="p-3 rounded-2xl" :class="isDark ? 'bg-gray-600' : 'bg-gray-200'">
              <Icon icon="mdi:layers" class="w-7 h-7" :class="themeClasses.text" />
            </div>
            <div>
              <h2 class="text-2xl font-bold" :class="themeClasses.text">
                Kategoriyalar
              </h2>
              <p class="text-sm opacity-60 mt-1" :class="themeClasses.text">
                Barcha kategoriyalar ro'yxati
              </p>
            </div>
          </div>
          
          <div class="flex items-center gap-3">
            <div class="px-4 py-2 rounded-full text-sm font-bold border" :class="themeClasses.badge">
              {{ categories.length }} ta kategoriya
            </div>
            <button class="p-2 rounded-xl transition-all duration-300 hover:scale-110" :class="themeClasses.actionButton">
              <Icon icon="mdi:refresh" class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="categories.length === 0" class="text-center py-20 animate-fade-in">
          <div class="relative mb-8">
            <div class="absolute inset-0 rounded-full blur-xl opacity-20 animate-pulse"
                 :class="isDark ? 'bg-gray-600' : 'bg-gray-300'"></div>
            <Icon icon="mdi:package-variant-closed" class="relative w-24 h-24 mx-auto opacity-40 animate-float" :class="themeClasses.text" />
          </div>
          <h3 class="text-2xl font-bold mb-4" :class="themeClasses.text">
            Kategoriyalar yo'q
          </h3>
          <p class="text-lg opacity-60 mb-8" :class="themeClasses.text">
            Birinchi kategoriyangizni yarating va boshqarishni boshlang
          </p>
          <button 
            @click="openModal"
            class="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 hover:scale-105"
            :class="themeClasses.emptyButton"
          >
            <Icon icon="mdi:plus" class="w-5 h-5" />
            Kategoriya Yaratish
          </button>
        </div>

        <!-- Categories Grid -->
        <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="(cat, index) in categories" 
            :key="cat.id"
            @click="goToWarehouse(cat.id)"
            class="group relative p-6 rounded-2xl cursor-pointer transition-all duration-500 hover:scale-105 border"
            :class="[themeClasses.categoryItem, `delay-${index * 100}`]"
            :style="{ animationDelay: `${index * 100}ms` }"
          >
            <div class="relative flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110"
                     :class="themeClasses.categoryIcon">
                  <Icon icon="mdi:folder-outline" class="w-7 h-7" />
                  <div class="absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold"
                       :class="isDark ? 'bg-gray-600 text-white' : 'bg-gray-300 text-black'">
                    {{ cat.warehouses.length || 0 }}
                  </div>
                </div>
                <div>
                  <h3 class="font-bold text-lg transition-all duration-300"
                      :class="themeClasses.text">
                    {{ cat.name }}
                  </h3>
                  <p class="text-sm opacity-60 mt-1 flex items-center gap-2" :class="themeClasses.text">
                    <Icon icon="mdi:cube-outline" class="w-4 h-4" />
                    {{ cat.warehouses.length || 0 }} ta mahsulot
                  </p>
                </div>
              </div>
              
              <div class="flex items-center gap-2">
                <button 
                  @click.stop="editCategory(cat)"
                  class="p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                  :class="themeClasses.editButton"
                >
                  <Icon icon="mdi:pencil" class="w-4 h-4" />
                </button>
                <Icon icon="mdi:chevron-right" 
                      class="w-6 h-6 transition-all duration-500 group-hover:translate-x-2" 
                      :class="themeClasses.accentText" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="text-center mt-16 opacity-60 animate-fade-in delay-1000">
        <p class="text-sm flex items-center justify-center gap-2" :class="themeClasses.text">
          <Icon icon="mdi:heart" class="w-4 h-4 animate-pulse" :class="themeClasses.accentText" />
          © 2024 Kategoriya Boshqaruv Tizimi
          <Icon icon="mdi:heart" class="w-4 h-4 animate-pulse" :class="themeClasses.accentText" />
        </p>
      </div>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <Transition name="modal-overlay">
        <div v-if="showModal" 
             class="fixed inset-0 z-[100] flex items-center justify-center p-4"
             @click="closeModal">
          
          <!-- Backdrop -->
          <div class="absolute inset-0 backdrop-blur-sm transition-all duration-500"
               :class="isDark ? 'bg-black/70' : 'bg-gray-900/50'"></div>
          
          <!-- Modal Content -->
          <Transition name="modal-content">
            <div v-if="showModal"
                 @click.stop
                 class="relative w-full max-w-lg transform transition-all duration-700 animate-modal-entrance"
                 :class="themeClasses.modal">
              
              <!-- Modal Header -->
              <div class="relative flex items-center justify-between p-8 border-b" :class="themeClasses.modalBorder">
                <div class="flex items-center gap-4">
                  <div class="relative w-12 h-12 rounded-2xl flex items-center justify-center"
                       :class="isDark ? 'bg-gray-600' : 'bg-gray-200'">
                    <Icon icon="mdi:plus" class="w-6 h-6" :class="themeClasses.text" />
                  </div>
                  <div>
                    <h3 class="text-2xl font-bold" :class="themeClasses.text">
                      Yangi Kategoriya
                    </h3>
                    <p class="text-sm opacity-60 mt-1" :class="themeClasses.text">
                      Kategoriya ma'lumotlarini kiriting
                    </p>
                  </div>
                </div>
                
                <button 
                  @click="closeModal"
                  class="group p-3 rounded-2xl transition-all duration-300 hover:scale-110"
                  :class="themeClasses.closeButton"
                >
                  <Icon icon="mdi:close" class="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                </button>
              </div>

              <!-- Modal Body -->
              <div class="relative p-8">
                <form @submit.prevent="createCategory" class="space-y-8">
                  <div class="space-y-3">
                    <label class="block text-sm font-bold flex items-center gap-2" :class="themeClasses.label">
                      <Icon icon="mdi:tag-outline" class="w-4 h-4" />
                      Kategoriya nomi
                    </label>
                    <div class="relative group">
                      <input 
                        ref="modalInput"
                        v-model="name"
                        type="text"
                        placeholder="Masalan: Elektronika, Kiyim-kechak, Sport..."
                        required
                        class="w-full px-6 py-4 rounded-2xl border transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:scale-[1.02] bg-transparent backdrop-blur-sm"
                        :class="themeClasses.input"
                      />
                      <div class="absolute inset-y-0 right-0 flex items-center pr-6">
                        <Icon icon="mdi:tag-multiple-outline" class="w-5 h-5 opacity-40 group-focus-within:opacity-100 transition-all duration-300" :class="themeClasses.accentText" />
                      </div>
                    </div>
                    
                    <!-- Character Counter -->
                    <div class="flex justify-between items-center text-xs opacity-60" :class="themeClasses.text">
                      <span>Minimum 2 ta harf</span>
                      <span>{{ name.length }}/50</span>
                    </div>
                  </div>

                  <!-- Action Buttons -->
                  <div class="flex gap-4 pt-6">
                    <button 
                      type="button"
                      @click="closeModal"
                      class="flex-1 py-4 px-6 rounded-2xl font-bold transition-all duration-300 hover:scale-105 border"
                      :class="themeClasses.cancelButton"
                    >
                      <div class="flex items-center justify-center gap-2">
                        <Icon icon="mdi:close-circle-outline" class="w-5 h-5" />
                        Bekor qilish
                      </div>
                    </button>
                    
                    <button 
                      type="submit"
                      :disabled="isSubmitting || !name.trim() || name.length < 2"
                      class="flex-1 py-4 px-6 rounded-2xl font-bold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      :class="isSubmitting ? themeClasses.buttonLoading : themeClasses.submitButton"
                    >
                      <div class="relative flex items-center justify-center gap-2">
                        <Icon :icon="isSubmitting ? 'mdi:loading' : 'mdi:check-circle'" 
                              class="w-5 h-5 transition-all duration-300" 
                              :class="{ 'animate-spin': isSubmitting }" />
                        {{ isSubmitting ? 'Yaratilmoqda...' : 'Kategoriya Yaratish' }}
                      </div>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { URL } from '@/auth/url.js';
import { Icon } from '@iconify/vue';

const name = ref('');
const categories = ref([]);
const router = useRouter();
const isDark = ref(false);
const isSubmitting = ref(false);
const showModal = ref(false);
const modalInput = ref(null);

const totalItems = computed(() => {
  return categories.value.reduce((total, cat) => total + (cat.itemCount || 0), 0);
});

const themeClasses = computed(() => ({
  background: isDark.value 
    ? 'bg-gray-900' 
    : 'bg-gray-100',
  
  themeButton: isDark.value
    ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:border-gray-600'
    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-200 hover:border-gray-400',
  
  tooltip: isDark.value
    ? 'bg-gray-800 text-gray-300 border-gray-700'
    : 'bg-white text-gray-700 border-gray-300 shadow-sm',
  
  headerCard: isDark.value
    ? 'bg-gray-800/80 border-gray-700 text-gray-300'
    : 'bg-white/80 border-gray-300 text-gray-700',
  
  subtitle: isDark.value ? 'text-gray-400' : 'text-gray-600',
  
  statCard: isDark.value
    ? 'bg-gray-800/50 border-gray-700/50'
    : 'bg-white/50 border-gray-300/50',
  
  addButton: isDark.value
    ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 hover:border-gray-500'
    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-200 hover:border-gray-400',
  
  card: isDark.value
    ? 'bg-gray-800/50 border-gray-700/50'
    : 'bg-white/50 border-gray-300/50',
  
  text: isDark.value ? 'text-gray-300' : 'text-gray-700',
  
  accentText: isDark.value ? 'text-gray-400' : 'text-gray-600',
  
  badge: isDark.value
    ? 'bg-gray-700/50 text-gray-400 border-gray-600'
    : 'bg-gray-200/50 text-gray-600 border-gray-300',
  
  actionButton: isDark.value
    ? 'bg-gray-700/50 hover:bg-gray-600/50 text-gray-400'
    : 'bg-gray-200/50 hover:bg-gray-300/50 text-gray-600',
  
  emptyButton: isDark.value
    ? 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
    : 'bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300',
  
  categoryItem: isDark.value
    ? 'bg-gray-800/30 border-gray-700/50 hover:bg-gray-800/50 hover:border-gray-600'
    : 'bg-white/50 border-gray-300/50 hover:bg-white/80 hover:border-gray-400',
  
  categoryIcon: isDark.value
    ? 'bg-gray-700/50 text-gray-400 group-hover:bg-gray-600/50'
    : 'bg-gray-200/50 text-gray-600 group-hover:bg-gray-300/50',
  
  editButton: isDark.value
    ? 'bg-gray-700/50 hover:bg-gray-600/50 text-gray-400'
    : 'bg-gray-200/50 hover:bg-gray-300/50 text-gray-600',
  
  modal: isDark.value
    ? 'bg-gray-800/90 border-gray-700/50'
    : 'bg-white/90 border-gray-300/50',
  
  modalBorder: isDark.value ? 'border-gray-700/50' : 'border-gray-300/50',
  
  label: isDark.value ? 'text-gray-400' : 'text-gray-600',
  
  closeButton: isDark.value
    ? 'bg-gray-700/50 hover:bg-gray-600/50 text-gray-400 border-gray-600'
    : 'bg-gray-200/50 hover:bg-gray-300/50 text-gray-600 border-gray-300',
  
  input: isDark.value
    ? 'bg-gray-800/30 border-gray-700 text-gray-300 placeholder-gray-500 focus:bg-gray-800/50 focus:border-gray-600'
    : 'bg-white/30 border-gray-300 text-gray-700 placeholder-gray-400 focus:bg-white/50 focus:border-gray-400',
  
  cancelButton: isDark.value
    ? 'bg-gray-700/50 hover:bg-gray-600/50 text-gray-400 border-gray-600'
    : 'bg-gray-200/50 hover:bg-gray-300/50 text-gray-600 border-gray-300',
  
  submitButton: isDark.value
    ? 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
    : 'bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300',
  
  buttonLoading: isDark.value
    ? 'bg-gray-600 text-gray-400'
    : 'bg-gray-300 text-gray-600'
}));

const fetchCategories = async () => {
  try {
    const { data } = await axios.get(URL + '/category');
    console.log('Fetched categories:', data);
    categories.value = data;
  } catch (error) {
    console.error('Kategoriyalarni olishda xatolik:', error);
  }
};

const createCategory = async () => {
  if (!name.value.trim() || name.value.length < 2) return;
  
  isSubmitting.value = true;
  
  try {
    await axios.post(URL + '/category', { name: name.value });
    name.value = '';
    await fetchCategories();
    closeModal();
  } catch (error) {
    console.error('Kategoriya qo\'shishda xatolik:', error);
  } finally {
    isSubmitting.value = false;
  }
};

const openModal = () => {
  showModal.value = true;
  nextTick(() => {
    setTimeout(() => {
      modalInput.value?.focus();
    }, 400);
  });
};

const closeModal = () => {
  showModal.value = false;
  setTimeout(() => {
    name.value = '';
    isSubmitting.value = false;
  }, 300);
};

const goToWarehouse = (categoryId) => {
  router.push({ path: '/warehouse', query: { categoryId } });
};

const editCategory = (category) => {
  console.log('Edit category:', category);
};

const toggleTheme = () => {
  isDark.value = !isDark.value;
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
};

onMounted(() => {
  fetchCategories();
  
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    isDark.value = savedTheme === 'dark';
  } else {
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
});
</script>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes float-reverse {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(10px); }
}

@keyframes float-slow {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes pulse-slow {
  0%, 100% { opacity: 0.1; }
  50% { opacity: 0.2; }
}

@keyframes pulse-glow {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 0.3; }
}

@keyframes bounce-subtle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slide-in-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes modal-entrance {
  from { opacity: 0; transform: translateY(-50px) scale(0.9); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.modal-overlay-enter-active, .modal-overlay-leave-active {
  transition: opacity 0.3s ease;
}

.modal-overlay-enter, .modal-overlay-leave-to {
  opacity: 0;
}

.modal-content-enter-active, .modal-content-leave-active {
  transition: transform 0.5s ease, opacity 0.3s ease;
}

.modal-content-enter, .modal-content-leave-to {
  transform: translateY(-50px) scale(0.9);
  opacity: 0;
}

.modal-content-enter-active {
  animation: modal-entrance 0.5s ease forwards;
}

.modal-content-leave-active {
  animation: fade-in 0.3s ease forwards;
}
</style>