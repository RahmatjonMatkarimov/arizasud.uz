<script setup>
import { ref, onMounted, reactive, nextTick, onUnmounted, inject } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { URL } from '@/auth/url'
import translateText from '@/auth/Translate'

const router = useRouter()
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
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});

const sections = ref([])
const loading = ref(true)
const submitting = ref(false)

// Modal state
const showModal = ref(false)
const modalType = ref('')
const selectedSection = ref(null)

// Form data
const form = reactive({
  name: '',
  descriptions: ''
})

// Toast notification
const toast = reactive({
  show: false,
  type: 'success',
  message: ''
})

async function openModal(type, section = null) {
  modalType.value = type
  selectedSection.value = section ? { ...section } : null // Deep copy to avoid mutation issues
  showModal.value = true

  if (type === 'edit' && selectedSection.value) {
    form.name = selectedSection.value.name || ''
    form.descriptions = selectedSection.value.descriptions || ''
  } else if (type === 'create') {
    form.name = ''
    form.descriptions = ''
  }

  await nextTick()
}

function closeModal() {
  showModal.value = false
  modalType.value = ''
  selectedSection.value = null
  form.name = ''
  form.descriptions = ''
}

function showToast(type, message) {
  toast.type = type
  toast.message = message
  toast.show = true
  setTimeout(() => {
    toast.show = false
  }, 3000)
}

function formatDate(dateString) {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('uz-UZ', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

function viewSectionItems(sectionId) {
  if (sectionId) {
    router.push(`/required-items-section/${sectionId}`)
  } else {
    showToast('error', 'Section ID is missing')
  }
}

async function fetchSections() {
  loading.value = true
  try {
    const res = await fetch(`${URL}/required-items-sections`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}` // Default to empty string if token is missing
      }
    })
    if (res.ok) {
      const data = await res.json()
      sections.value = data.map(item => ({
        sectionId: item.id, // Ensure 'id' from API is mapped to 'sectionId'
        name: item.name || 'Unnamed',
        descriptions: item.descriptions || 'No description',
        createdAt: item.createdAt || new Date().toISOString()
      }))
    } else {
      throw new Error(`Failed to fetch sections. Status: ${res.status}`)
    }
  } catch (error) {
    showToast('error', `Bo'limlarni yuklashda xatolik yuz berdi: ${error.message}`)
  } finally {
    loading.value = false
  }
}

async function handleSubmit() {
  submitting.value = true
  try {
    let url = `${URL}/required-items-sections`
    let method = 'POST'

    if (modalType.value === 'edit' && selectedSection.value?.sectionId) {
      url = `${URL}/required-items-sections/${selectedSection.value.sectionId}`
      method = 'PUT'
    } else if (modalType.value === 'edit' && !selectedSection.value?.sectionId) {
      throw new Error('Section ID is missing for editing')
    }

    const res = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
      },
      body: JSON.stringify({
        name: form.name.trim(),
        descriptions: form.descriptions.trim()
      })
    })

    if (res.ok) {
      showToast('success', modalType.value === 'create' ? "Bo'lim muvaffaqiyatli qo'shildi" : "Bo'lim muvaffaqiyatli yangilandi")
      closeModal()
      await fetchSections()
    } else {
      const errorText = await res.text()
      throw new Error(`Server error: ${res.status} - ${errorText}`)
    }
  } catch (error) {
    showToast('error', `Xatolik yuz berdi: ${error.message}`)
  } finally {
    submitting.value = false
  }
}

async function handleDelete() {
  submitting.value = true
  try {
    if (!selectedSection.value?.sectionId) {
      throw new Error('Section ID is missing for deletion')
    }
    const res = await fetch(`${URL}/required-items-sections/${selectedSection.value.sectionId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
      }
    })

    if (res.ok) {
      showToast('success', "Bo'lim muvaffaqiyatli o'chirildi")
      closeModal()
      await fetchSections()
    } else {
      const errorText = await res.text()
      throw new Error(`Server error: ${res.status} - ${errorText}`)
    }
  } catch (error) {
    showToast('error', `Bo'limni o'chirishda xatolik yuz berdi: ${error.message}`)
  } finally {
    submitting.value = false
  }
}

onMounted(fetchSections)
</script>

<template>
  <div :class="['dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 dark:text-white', 'bg-gradient-to-br from-blue-50 via-white to-indigo-50 text-gray-900', 'min-h-screen transition-all duration-500 ease-in-out']">
    <!-- Header -->
    <div class="sticky top-0 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {{ dat === 'datakril' ? translateText('Sayt Qo\'llanmasi va Materiallar') : 'Sayt Qo\'llanmasi va Materiallar' }}
        </h1>
        <div class="flex items-center space-x-4">
          <button
            @click.stop.prevent="openModal('create')"
            class="px-6 py-2 flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Icon icon="mdi:plus" class="mr-2" />{{ dat === 'datakril' ? translateText('Yangi Material Qo\'shish') : 'Yangi Material Qo\'shish' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-6xl mx-auto px-6 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="sections.length === 0" class="text-center py-20">
        <div class="text-6xl mb-4">
          <Icon icon="mdi:folder-outline" class="text-gray-400" />
        </div>
        <h3 class="text-2xl font-semibold mb-2">{{ dat === 'datakril' ? translateText('Materiallar mavjud emas') : 'Materiallar mavjud emas' }}</h3>
        <p class="text-gray-500 mb-6">{{ dat === 'datakril' ? translateText('Birinchi materialni qo\'shish uchun yuqoridagi tugmani bosing') : 'Birinchi materialni qo\'shish uchun yuqoridagi tugmani bosing' }}</p>
        <button
          @click.stop.prevent="openModal('create')"
          class="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
        >
          <Icon icon="mdi:plus" class="mr-2" />{{ dat === 'datakril' ? translateText('Birinchi Materialni Qo\'shish') : 'Birinchi Materialni Qo\'shish' }}
        </button>
      </div>

      <!-- Sections Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="section in sections"
          :key="section.sectionId"
          class="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50"
        >
          <!-- Section Header -->
          <div class="flex justify-between items-start mb-4">
            <div class="flex-1">
              <h3 class="text-xl font-bold mb-2 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {{ dat === 'datakril' ? translateText(section.name) : section.name }}
              </h3>
              <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {{ dat === 'datakril' ? translateText(section.descriptions) : section.descriptions || 'Tavsif mavjud emas' }}
              </p>
            </div>
            <div class="flex space-x-2 z-40 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                @click.stop.prevent="openModal('edit', section)"
                class="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                title="Tahrirlash"
              >
                <Icon icon="mdi:pencil" class="text-sm" />
              </button>
              <button
                @click.stop.prevent="openModal('delete', section)"
                class="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                title="O'chirish"
              >
                <Icon icon="mdi:delete" class="text-sm" />
              </button>
            </div>
          </div>

          <!-- Section Footer -->
          <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div class="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
              <span class="flex items-center">
                <Icon icon="mdi:calendar" class="mr-1" />
                {{ formatDate(section.createdAt) }}
              </span>
              <button
                @click.stop="viewSectionItems(section.sectionId)"
                class="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
              >
                <Icon icon="mdi:arrow-right" class="mr-1" />
                {{ dat === 'datakril' ? translateText('Fayllar') : 'Fayllar' }}
              </button>
            </div>
          </div>

          <!-- Decorative Elements -->
          <div class="absolute top-2 right-2 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-xl group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all duration-300"></div>
        </div>
      </div>
    </div>

    <!-- Modal Overlay -->
    <div
      v-if="showModal"
      class="modal-overlay fixed inset-0 z-10000 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      @click="closeModal"
    >
      <!-- Create/Edit Modal -->
      <div
        v-if="modalType === 'create' || modalType === 'edit'"
        @click.stop
        class="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl transform transition-all duration-300 scale-100"
      >
        <div class="p-8">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ modalType === 'create' ? dat === 'datakril' ? translateText('Yangi Material Qo\'shish') : 'Yangi Material Qo\'shish' : dat === 'datakril' ? translateText('Materialni Tahrirlash') : 'Materialni Tahrirlash' }}
            </h2>
            <button
              @click.stop.prevent="closeModal"
              class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <Icon icon="mdi:close" class="text-xl" />
            </button>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {{ dat === 'datakril' ? translateText('Material Nomi *') : 'Material Nomi *' }}
              </label>
              <input
                v-model="form.name"
                type="text"
                required
                class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-0 transition-colors placeholder-gray-400"
                :placeholder="dat === 'datakril' ? translateText('Material nomini kiriting (masalan: Sayt qo\'llanmasi)') : 'Material nomini kiriting (masalan: Sayt qo\'llanmasi)'"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {{ dat === 'datakril' ? translateText('Material Tavsifi *') : 'Material Tavsifi *' }}
              </label>
              <textarea
                v-model="form.descriptions"
                required
                rows="4"
                class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-0 transition-colors placeholder-gray-400 resize-none"
                :placeholder="dat === 'datakril' ? translateText('Material haqida qisqacha ma\'lumot bering') : 'Material haqida qisqacha ma\'lumot bering'"
              ></textarea>
            </div>

            <div class="flex space-x-4 pt-4">
              <button
                type="button"
                @click.stop.prevent="closeModal"
                class="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                {{ dat === 'datakril' ? translateText('Bekor qilish') : 'Bekor qilish' }}
              </button>
              <button
                type="submit"
                :disabled="submitting"
                class="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
              >
                <Icon v-if="submitting" icon="mdi:loading" class="mr-2 animate-spin" />
                {{ submitting ? 'Yuklanmoqda...' : (modalType === 'create' ? dat === 'datakril' ? translateText('Qo\'shish') : 'Qo\'shish' : dat === 'datakril' ? translateText('Saqlash') : 'Saqlash') }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Delete Modal -->
      <div
        v-else-if="modalType === 'delete'"
        @click.stop
        class="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl transform transition-all duration-300 scale-100"
      >
        <div class="p-8 text-center">
          <div class="w-16 h-16 bg-red-500/20 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon icon="mdi:alert-circle" class="text-2xl text-red-600 dark:text-red-400" />
          </div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {{ dat === 'datakril' ? translateText('Materialni O\'chirish') : 'Materialni O\'chirish' }}
          </h2>
          <p class="text-gray-600 dark:text-gray-300 mb-6">
            "<strong>{{ dat === 'datakril' ? translateText(selectedSection?.name) : selectedSection?.name }}</strong>" {{ dat === 'datakril' ? translateText('materialini') : 'materialini' }} {{ dat === 'datakril' ? translateText('o\'chirishni xohlaysizmi? Bu materialdagi barcha fayllar ham o\'chiriladi va bu amalni qaytarib bo\'lmaydi.') : 'o\'chirishni xohlaysizmi? Bu materialdagi barcha fayllar ham o\'chiriladi va bu amalni qaytarib bo\'lmaydi.' }}
          </p>
          <div class="flex space-x-4">
            <button
              @click.stop.prevent="closeModal"
              class="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              {{ dat === 'datakril' ? translateText('Bekor qilish') : 'Bekor qilish' }}
            </button>
            <button
              @click.stop.prevent="handleDelete"
              :disabled="submitting"
              class="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
            >
              <Icon v-if="submitting" icon="mdi:loading" class="mr-2 animate-spin" />
              {{ submitting ? dat === 'datakril' ? translateText('O\'chirilmoqda...') : 'O\'chirilmoqda...' : dat === 'datakril' ? translateText('O\'chirish') : 'O\'chirish' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Success/Error Toast -->
    <div
      v-if="toast.show"
      :class="[
        'fixed top-4 right-4 z-10001 px-6 py-4 rounded-xl shadow-2xl transform transition-all duration-300',
        toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
      ]"
    >
      <div class="flex items-center">
        <Icon :icon="toast.type === 'success' ? 'mdi:check-circle' : 'mdi:alert-circle'" class="mr-3" />
        <span class="font-medium">{{ dat === 'datakril' ? translateText(toast.message) : toast.message }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.5);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.8);
}

/* Modal overlay */
.modal-overlay {
  z-index: 10000;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  visibility: visible;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
}

/* Smooth animations */
.v-enter-active,
.v-leave-active {
  transition: all 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* Ensure buttons are clickable */
.group {
  pointer-events: auto;
}

.group button {
  pointer-events: auto;
}
</style>