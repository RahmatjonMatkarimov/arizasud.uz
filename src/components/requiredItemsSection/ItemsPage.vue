<template>
    <div :class="[
        'dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 dark:text-white',
        'bg-gradient-to-br from-blue-50 via-white to-indigo-50 text-gray-900',
        'min-h-screen transition-all duration-500 ease-in-out relative overflow-hidden'
    ]">
        <!-- Animated Background Elements -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
            <div
                class="absolute top-10 left-5 w-64 h-64 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse">
            </div>
            <div
                class="absolute bottom-10 right-5 w-80 h-80 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-1000">
            </div>
            <div
                class="absolute top-1/3 left-1/3 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-green-400/5 to-blue-400/5 rounded-full blur-3xl animate-pulse delay-2000">
            </div>
        </div>

        <!-- Header -->
        <div
            class="sticky top-0 backdrop-blur-xl bg-white/90 dark:bg-slate-900/90 border-b border-gray-200/50 dark:border-slate-700/50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 py-4">
                <div class="flex justify-between items-center">
                    <div class="flex items-center space-x-3">
                        <div
                            class="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                            <Icon icon="material-symbols:description" class="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1
                                class="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                {{ dat === 'datakril' ? translateText('Qo\'llanmalar va Fayllar') : 'Qo\'llanmalar va Fayllar' }}
                            </h1>
                            <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">{{ dat === 'datakril' ? translateText('Sayt uchun zarur hujjatlar va qo\'llanmalar') : 'Sayt uchun zarur hujjatlar va qo\'llanmalar' }}</p>
                        </div>
                    </div>
                    <div class="flex items-center space-x-2">
                        <button @click="openModal('create')"
                            class="group px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg flex items-center space-x-1">
                            <Icon icon="material-symbols:add-circle"
                                class="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                            <span>{{ dat === 'datakril' ? translateText('Yangi Qo\'llanma/Fayl') : 'Yangi Qo\'llanma/Fayl' }}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8 relative z-10">
            <!-- Loading State -->
            <div v-if="loading" class="flex flex-col justify-center items-center py-24">
                <div class="relative">
                    <div class="animate-spin rounded-full h-16 w-16 border-4 border-blue-500/30 border-t-blue-500">
                    </div>
                    <div class="absolute inset-0 flex items-center justify-center">
                        <Icon icon="material-symbols:description" class="w-6 h-6 text-blue-500" />
                    </div>
                </div>
                <p class="mt-4 text-base font-medium text-gray-600 dark:text-gray-300 animate-pulse">{{ dat === 'datakril' ? translateText('Qo\'llanmalar va fayllar yuklanmoqda...') : 'Qo\'llanmalar va fayllar yuklanmoqda...' }}</p>
            </div>

            <!-- Empty State -->
            <div v-else-if="items.length === 0" class="text-center py-24">
                <div
                    class="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Icon icon="material-symbols:description-outline"
                        class="w-12 h-12 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 class="text-2xl font-bold mb-3 text-gray-800 dark:text-gray-200">{{ dat === 'datakril' ? translateText('Qo\'llanmalar/fayllar yo\'q') : 'Qo\'llanmalar/fayllar yo\'q' }}</h3>
                <p class="text-base text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">{{ dat === 'datakril' ? translateText('Birinchi qo\'llanma yoki faylni qo\'shish uchun yuqoridagi "Yangi Qo\'llanma/Fayl" tugmasini bosing') : 'Birinchi qo\'llanma yoki faylni qo\'shish uchun yuqoridagi "Yangi Qo\'llanma/Fayl" tugmasini bosing' }}</p>
                <button @click="openModal('create')"
                    class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg space-x-2">
                    <Icon icon="material-symbols:add-circle" class="w-5 h-5" />
                    <span>{{ dat === 'datakril' ? translateText('Birinchi qo\'llanma/faylni qo\'shish') : 'Birinchi qo\'llanma/faylni qo\'shish' }}</span>
                </button>
            </div>

            <!-- Items List -->
            <div v-else class="flex flex-col space-y-6">
                <div v-for="item in items" :key="item.id"
                    class="group relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-200/50 dark:border-slate-700/50 overflow-hidden">
                    <!-- Decorative Background -->
                    <div
                        class="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300">
                    </div>
                    <div
                        class="absolute -top-3 -right-3 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl group-hover:from-blue-400/30 group-hover:to-purple-400/30 transition-all duration-300">
                    </div>

                    <!-- Content -->
                    <div class="relative z-10">
                        <div class="flex items-start space-x-3 mb-4">
                            <div
                                class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
                                <Icon icon="material-symbols:description" class="w-5 h-5 text-white" />
                            </div>
                            <div class="flex-1 min-w-0">
                                <h3
                                    class="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                                    {{ dat === 'datakril' ? translateText(item.name) : item.name }}
                                </h3>
                            </div>
                        </div>

                        <!-- File Content Display -->
                        <div v-if="item.file" class="mb-4">
                            <div v-if="isVideoFile(item.file)" class="w-full">
                                <video :src="URL + item.file" controls class="w-full max-w-md rounded-lg shadow-md"
                                    preload="metadata">
                                    {{ dat === 'datakril' ? translateText('Brauzeringiz video elementini qo\'llab-quvvatlamaydi.') : 'Brauzeringiz video elementini qo\'llab-quvvatlamaydi.' }}
                                </video>
                            </div>
                            <div v-else-if="isImageFile(item.file)" class="w-full">
                                <img :src="URL + item.file" :alt="item.name"
                                    class="w-full max-w-md rounded-lg shadow-md" />
                            </div>
                        </div>
                        <h3
                            class="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                            {{ dat === 'datakril' ? translateText('Tavsif') : 'Tavsif' }}
                        </h3>
                        <p v-if="item.description"
                            class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-2 mt-1">
                            {{ dat === 'datakril' ? translateText(item.description) : item.description }}
                        </p>
                        <!-- Action Buttons -->
                        <div
                            class="flex items-center justify-between pt-3 border-t border-gray-200/50 dark:border-slate-700/50">
                            <div v-if="item.file" class="flex items-center space-x-2">
                                <button v-if="isVideoFile(item.file) || isImageFile(item.file) || isPdfFile(item.file)"
                                    @click="openFileModal(item)"
                                    class="inline-flex items-center px-3 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg text-sm font-medium hover:from-emerald-600 hover:to-teal-600 transform hover:scale-105 transition-all duration-300 shadow-md">
                                    <Icon icon="material-symbols:fullscreen" class="w-4 h-4 mr-1" />
                                    <span>{{ dat === 'datakril' ? translateText('To\'liq ko\'rish') : 'To\'liq ko\'rish' }}</span>
                                </button>
                                <a :href="URL + item.file" download
                                    class="inline-flex items-center px-3 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-slate-600 transition-all duration-300">
                                    <Icon icon="material-symbols:download" class="w-4 h-4 mr-1" />
                                    <span>{{ dat === 'datakril' ? translateText('Yuklab olish') : 'Yuklab olish' }}</span>
                                </a>
                            </div>
                            <div class="flex items-center space-x-2">
                                <button @click.stop="openModal('edit', item)"
                                    class="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transform hover:scale-110 transition-all duration-300">
                                    <Icon icon="material-symbols:edit" class="w-4 h-4" />
                                </button>
                                <button @click.stop="openModal('delete', item)"
                                    class="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transform hover:scale-110 transition-all duration-300">
                                    <Icon icon="material-symbols:delete" class="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Overlay -->
        <div v-if="showModal"
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            @click.self="closeModal">
            <!-- Create/Edit Modal -->
            <div v-if="modalType === 'create' || modalType === 'edit'" @click.stop
                class="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl transform transition-all duration-300 border border-gray-200 dark:border-slate-700">
                <div class="p-6">
                    <div class="flex justify-between items-center mb-6">
                        <div class="flex items-center space-x-3">
                            <div
                                class="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                                <Icon
                                    :icon="modalType === 'create' ? 'material-symbols:add-circle' : 'material-symbols:edit'"
                                    class="w-5 h-5 text-white" />
                            </div>
                            <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                                {{ modalType === 'create' ? dat === 'datakril' ? translateText('Yangi Qo\'llanma/Fayl Qo\'shish') : 'Yangi Qo\'llanma/Fayl Qo\'shish' : dat === 'datakril' ? translateText('Qo\'llanma/Faylni Tahrirlash') : 'Qo\'llanma/Faylni Tahrirlash' }}
                            </h2>
                        </div>
                        <button @click="closeModal"
                            class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors duration-200">
                            <Icon icon="material-symbols:close" class="w-5 h-5" />
                        </button>
                    </div>

                    <form @submit.prevent="handleSubmit" class="space-y-5">
                        <div>
                            <label
                                class="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                <Icon icon="material-symbols:badge" class="w-4 h-4" />
                                <span>{{ dat === 'datakril' ? translateText('Nomi *') : 'Nomi *' }}</span>
                            </label>
                            <input v-model="form.name" type="text" required
                                class="w-full px-3 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-0 transition-all duration-300 placeholder-gray-400"
                                :placeholder="dat === 'datakril' ? translateText('Qo\'llanma yoki fayl nomini kiriting') : 'Qo\'llanma yoki fayl nomini kiriting'" />
                        </div>
                        <div>
                            <label
                                class="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                <Icon icon="material-symbols:description" class="w-4 h-4" />
                                <span>{{ dat === 'datakril' ? translateText('Tavsifi *') : 'Tavsifi *' }}</span>
                            </label>
                            <textarea v-model="form.description" required rows="4"
                                class="w-full px-3 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-0 transition-all duration-300 placeholder-gray-400 resize-none"
                                :placeholder="dat === 'datakril' ? translateText('Qo\'llanma yoki fayl haqida qisqacha ma\'lumot kiriting') : 'Qo\'llanma yoki fayl haqida qisqacha ma\'lumot kiriting'"></textarea>
                        </div>
                        <div>
                            <label
                                class="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                <Icon icon="material-symbols:attach-file" class="w-4 h-4" />
                                <span>{{ dat === 'datakril' ? translateText('Fayl') : 'Fayl' }} {{ modalType === 'edit' ? dat === 'datakril' ? translateText('(Ixtiyoriy)') : '(Ixtiyoriy)' : '' }}</span>
                            </label>
                            <div class="relative">
                                <input ref="fileInput" type="file" @change="onFileChange"
                                    class="w-full px-3 py-3 rounded-xl border-2 border-dashed border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-0 transition-all duration-300 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/30 dark:file:text-blue-400" />
                            </div>
                        </div>
                        <div class="flex space-x-3 pt-5">
                            <button type="button" @click="closeModal"
                                class="flex-1 px-5 py-3 bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-slate-600 transition-all duration-300 flex items-center justify-center space-x-2">
                                <Icon icon="material-symbols:cancel" class="w-4 h-4" />
                                <span>{{ dat === 'datakril' ? translateText('Bekor qilish') : 'Bekor qilish' }}</span>
                            </button>
                            <button type="submit" :disabled="submitting"
                                class="flex-1 px-5 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2">
                                <Icon :icon="submitting ? 'material-symbols:sync' : 'material-symbols:save'"
                                    :class="submitting ? 'animate-spin' : ''" class="w-4 h-4" />
                                <span>{{ submitting ? 'Yuklanmoqda...' : (modalType === 'create' ? dat === 'datakril' ? translateText('Qo\'shish') : 'Qo\'shish' : dat === 'datakril' ? translateText('Saqlash') : 'Saqlash') }}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Delete Modal -->
            <div v-else-if="modalType === 'delete'" @click.stop
                class="w-full max-w-xl bg-white dark:bg-slate-800 rounded-2xl shadow-xl transform transition-all duration-300 border border-gray-200 dark:border-slate-700">
                <div class="p-6 text-center">
                    <div
                        class="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-md">
                        <Icon icon="material-symbols:warning" class="w-8 h-8 text-red-600 dark:text-red-400" />
                    </div>
                    <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {{ dat === 'datakril' ? translateText('Qo\'llanma/Faylni o\'chirish') : 'Qo\'llanma/Faylni o\'chirish' }}
                    </h2>
                    <p class="text-sm text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                        "<strong>{{ dat === 'datakril' ? translateText(selectedItem?.name) : selectedItem?.name }}</strong>" {{ dat === 'datakril' ? translateText('qo\'llanma/faylini o\'chirishni xohlaysizmi? Bu amalni qaytarib bo\'lmaydi.') : 'qo\'llanma/faylini o\'chirishni xohlaysizmi? Bu amalni qaytarib bo\'lmaydi.' }}
                    </p>
                    <div class="flex space-x-3">
                        <button @click="closeModal"
                            class="flex-1 px-5 py-3 bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-slate-600 transition-all duration-300 flex items-center justify-center space-x-2">
                            <Icon icon="material-symbols:cancel" class="w-4 h-4" />
                            <span>{{ dat === 'datakril' ? translateText('Bekor qilish') : 'Bekor qilish' }}</span>
                        </button>
                        <button @click="handleDelete" :disabled="submitting"
                            class="flex-1 px-5 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2">
                            <Icon :icon="submitting ? 'material-symbols:sync' : 'material-symbols:delete'"
                                :class="submitting ? 'animate-spin' : ''" class="w-4 h-4" />
                            <span>{{ submitting ? dat === 'datakril' ? translateText('O\'chirilmoqda...') : 'O\'chirilmoqda...' : dat === 'datakril' ? translateText('O\'chirish') : 'O\'chirish' }}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- File/Video Modal -->
        <div v-if="showFileModal"
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            @click.self="closeFileModal">
            <div @click.stop
                class="w-full max-w-3xl bg-white dark:bg-slate-800 rounded-2xl shadow-xl transform transition-all duration-300 border border-gray-200 dark:border-slate-700 overflow-hidden">
                <div class="p-6">
                    <div class="flex justify-between items-center mb-5">
                        <div class="flex items-center space-x-3">
                            <div
                                class="w-10 h-10 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center shadow-md">
                                <Icon
                                    :icon="isVideoFile(selectedFile?.file) ? 'material-symbols:play-circle' : 'material-symbols:description'"
                                    class="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                                    {{ dat === 'datakril' ? translateText(selectedFile?.name) : selectedFile?.name }}
                                </h2>
                                <p class="text-sm text-gray-500 dark:text-gray-400">
                                    {{ dat === 'datakril' ? translateText(getFileType(selectedFile?.file)) : getFileType(selectedFile?.file) }}
                                </p>
                            </div>
                        </div>
                        <button @click="closeFileModal"
                            class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors duration-200">
                            <Icon icon="material-symbols:close" class="w-5 h-5" />
                        </button>
                    </div>

                    <div class="bg-gray-100 dark:bg-slate-700 rounded-xl p-4">
                        <div v-if="isVideoFile(selectedFile?.file)" class="w-full">
                            <video :src="URL + selectedFile?.file" controls class="w-full rounded-lg shadow-md"
                                preload="metadata">
                                {{ dat === 'datakril' ? translateText('Brauzeringiz video elementini qo\'llab-quvvatlamaydi.') : 'Brauzeringiz video elementini qo\'llab-quvvatlamaydi.' }}
                            </video>
                        </div>
                        <div v-else-if="isImageFile(selectedFile?.file)" class="w-full">
                            <img :src="URL + selectedFile?.file" :alt="selectedFile?.name"
                                class="w-full rounded-lg shadow-md" />
                        </div>
                    </div>

                    <div class="mt-5 flex justify-center">
                        <a :href="URL + selectedFile?.file" download
                            class="inline-flex items-center px-5 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg space-x-2">
                            <Icon icon="material-symbols:download" class="w-4 h-4" />
                            <span>{{ dat === 'datakril' ? translateText('Yuklab olish') : 'Yuklab olish' }}</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <!-- Success/Error Toast -->
        <div v-if="toast.show" :class="[
            'fixed top-4 right-4 z-60 px-4 py-3 rounded-xl shadow-lg transform transition-all duration-300',
            toast.type === 'success' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' : 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
        ]">
            <div class="flex items-center space-x-2">
                <Icon :icon="toast.type === 'success' ? 'material-symbols:check-circle' : 'material-symbols:error'"
                    class="w-5 h-5" />
                <span class="font-medium">{{ dat === 'datakril' ? translateText(toast.message) : toast.message }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { URL } from '@/auth/url'
import { ref, onMounted, reactive, nextTick, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import translateText from '@/auth/Translate'

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

const route = useRoute()
const sectionId = ref(route.params.id)

// Reactive data
const items = ref([])
const loading = ref(true)
const submitting = ref(false)

// Modal state
const showModal = ref(false)
const modalType = ref('')
const selectedItem = ref(null)

// Form data
const form = reactive({
    name: '',
    description: '',
    file: null
})

// Toast notification
const toast = reactive({
    show: false,
    type: 'success',
    message: ''
})

const fileInput = ref(null)

// File modal state
const showFileModal = ref(false)
const selectedFile = ref(null)

// Methods
function openModal(type, item = null) {
    modalType.value = type
    selectedItem.value = item ? { ...item } : null
    showModal.value = true

    if (type === 'edit' && selectedItem.value) {
        form.name = selectedItem.value.name || ''
        form.description = selectedItem.value.description || ''
        form.file = null
    } else if (type === 'create') {
        form.name = ''
        form.description = ''
        form.file = null
    }

    nextTick(() => {
        if (fileInput.value) fileInput.value.value = ''
    })
}

function closeModal() {
    showModal.value = false
    modalType.value = ''
    selectedItem.value = null
    form.name = ''
    form.description = ''
    form.file = null
    if (fileInput.value) fileInput.value.value = ''
}

function onFileChange(e) {
    form.file = e.target.files[0]
}

function showToast(type, message) {
    toast.type = type
    toast.message = message
    toast.show = true
    setTimeout(() => {
        toast.show = false
    }, 4000)
}

async function fetchItems() {
    loading.value = true
    try {
        const res = await fetch(`${URL}/required-items?requiredItemsSectionsId=${sectionId.value}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
            }
        })
        if (res.ok) {
            const data = await res.json()
            items.value = data.map(item => ({
                id: item.id,
                name: item.name || 'Unnamed',
                description: item.description || 'No description',
                file: item.file || null
            }))
        } else {
            throw new Error(`Failed to fetch items. Status: ${res.status}`)
        }
    } catch (error) {
        showToast('error', `Qo'llanmalar/fayllarni yuklashda xatolik yuz berdi: ${error.message}`)
    } finally {
        loading.value = false
    }
}

async function handleSubmit() {
    submitting.value = true
    try {
        const formData = new FormData()
        formData.append('name', form.name.trim())
        formData.append('description', form.description.trim())
        formData.append('requiredItemsSectionsId', sectionId.value)

        if (form.file) {
            formData.append('file', form.file)
        }

        let url = `${URL}/required-items`
        let method = 'POST'

        if (modalType.value === 'edit' && selectedItem.value?.id) {
            url = `${URL}/required-items/${selectedItem.value.id}`
            method = 'PUT'
        } else if (modalType.value === 'edit' && !selectedItem.value?.id) {
            throw new Error('Item ID is missing for editing')
        }

        const res = await fetch(url, {
            method: method,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
            },
            body: formData
        })

        if (res.ok) {
            showToast('success', modalType.value === 'create' ? "Qo'llanma/fayl muvaffaqiyatli qo'shildi" : "Qo'llanma/fayl muvaffaqiyatli yangilandi")
            closeModal()
            await fetchItems()
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
        if (!selectedItem.value?.id) {
            throw new Error('Item ID is missing for deletion')
        }
        const res = await fetch(`${URL}/required-items/${selectedItem.value.id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
            }
        })

        if (res.ok) {
            showToast('success', "Qo'llanma/fayl muvaffaqiyatli o'chirildi")
            closeModal()
            await fetchItems()
        } else {
            const errorText = await res.text()
            throw new Error(`Server error: ${res.status} - ${errorText}`)
        }
    } catch (error) {
        showToast('error', `Qo'llanma/faylni o'chirishda xatolik yuz berdi: ${error.message}`)
    } finally {
        submitting.value = false
    }
}

function isVideoFile(filename) {
    if (!filename) return false
    const videoExtensions = ['.mp4', '.mov', '.avi', '.mkv', '.wmv', '.flv', '.webm', '.m4v', '.3gp']
    return videoExtensions.some(ext => filename.toLowerCase().endsWith(ext))
}

function isImageFile(filename) {
    if (!filename) return false
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg', '.ico']
    return imageExtensions.some(ext => filename.toLowerCase().endsWith(ext))
}

function isPdfFile(filename) {
    if (!filename) return false
    return filename.toLowerCase().endsWith('.pdf')
}

function isDocFile(filename) {
    if (!filename) return false
    const docExtensions = ['.doc', '.docx']
    return docExtensions.some(ext => filename.toLowerCase().endsWith(ext))
}

function isTextFile(filename) {
    if (!filename) return false
    return filename.toLowerCase().endsWith('.txt')
}

function getFileType(filename) {
    if (isVideoFile(filename)) return 'Video fayl'
    if (isImageFile(filename)) return 'Rasm fayli'
    if (isPdfFile(filename)) return 'PDF hujjati'
    if (isDocFile(filename)) return 'Word hujjati'
    if (isTextFile(filename)) return 'Matn fayli'
    return 'Noma\'lum fayl turi'
}

function openFileModal(item) {
    selectedFile.value = { ...item }
    showFileModal.value = true
}

function closeFileModal() {
    showFileModal.value = false
    selectedFile.value = null
}

onMounted(() => {
    if (!sectionId.value) {
        showToast('error', 'Section ID is missing')
        return
    }
    fetchItems()
})
</script>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
    width: 6px;
}

::-webkit-scrollbar-track {
    background: transparent;
}

::-webkit-scrollbar-thumb {
    background: rgba(148, 163, 184, 0.4);
    border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
    background: rgba(148, 163, 184, 0.6);
}

/* Smooth animations */
.v-enter-active,
.v-leave-active {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
}

/* Custom animations */
@keyframes float {

    0%,
    100% {
        transform: translateY(0px);
    }

    50% {
        transform: translateY(-8px);
    }
}

.animate-float {
    animation: float 3s ease-in-out infinite;
}

/* Glassmorphism effect */
.glass {
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.15);
}

.glass-dark {
    background: rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.15);
}

/* Responsive adjustments */
@media (max-width: 640px) {
    .max-w-7xl {
        padding-left: 1rem;
        padding-right: 1rem;
    }

    .text-2xl {
        font-size: 1.25rem;
    }

    .text-lg {
        font-size: 1rem;
    }

    .w-64 {
        width: 12rem;
        height: 12rem;
    }

    .w-80 {
        width: 16rem;
        height: 16rem;
    }

    .w-72 {
        width: 14rem;
        height: 14rem;
    }

    .max-w-md {
        max-width: 100%;
    }
}
</style>