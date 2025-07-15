<template>
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-300">
        <div class="container mx-auto px-4 py-8">
            <!-- Header Section -->
            <div class="flex justify-between items-center mb-8">
                <div>
                    <h1 class="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                        Javoblar
                    </h1>
                    <p class="text-gray-600 dark:text-gray-400 mt-2">
                        Javob berilgan savollar ro'yxati
                    </p>
                </div>
                
                <!-- New Question Button -->
                <button 
                    @click="openModal" 
                    class="group relative px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                    <span class="flex items-center space-x-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                        </svg>
                        <span>Yangi savol</span>
                    </span>
                </button>
            </div>

            <!-- Stats -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div class="flex items-center space-x-3">
                        <div class="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                            <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                        </div>
                        <div>
                            <p class="text-sm text-gray-600 dark:text-gray-400">Javob berilgan</p>
                            <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ data.length }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Data Display -->
            <div class="space-y-6">
                <div 
                    v-for="item in data" 
                    :key="item.id" 
                    class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-lg dark:shadow-gray-900/20 border border-gray-200 dark:border-gray-700 transition-all duration-300 overflow-hidden"
                >
                    <div class="p-6">
                        <!-- User Header -->
                        <div class="flex items-center space-x-4 mb-6">
                            <div class="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                                {{ item.name.charAt(0) }}{{ item.surname.charAt(0) }}
                            </div>
                            <div>
                                <h3 class="font-semibold text-gray-900 dark:text-gray-100 text-lg">
                                    {{ item.name }} {{ item.surname }}
                                </h3>
                                <div class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                    <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span>Javob berilgan</span>
                                </div>
                            </div>
                        </div>

                        <!-- Question Section -->
                        <div class="space-y-4">
                            <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border-l-4 border-blue-500">
                                <div class="flex items-start space-x-3">
                                    <div class="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                        <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                        </svg>
                                    </div>
                                    <div class="flex-1">
                                        <span class="text-sm font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">Savol</span>
                                        <p class="text-gray-700 dark:text-gray-300 mt-1 leading-relaxed">{{ item.question }}</p>
                                    </div>
                                </div>
                            </div>

                            <!-- Answer Section -->
                            <div class="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border-l-4 border-green-500">
                                <div class="flex items-start space-x-3">
                                    <div class="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                        <svg class="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/>
                                        </svg>
                                    </div>
                                    <div class="flex-1">
                                        <span class="text-sm font-medium text-green-600 dark:text-green-400 uppercase tracking-wide">Javob</span>
                                        <p class="text-gray-700 dark:text-gray-300 mt-1 leading-relaxed">{{ item.answer }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Empty State -->
                <div v-if="data.length === 0" class="text-center py-16">
                    <div class="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                    </div>
                    <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Hali javoblar yo'q</h3>
                    <p class="text-gray-600 dark:text-gray-400 mb-4">Javob berilgan savollar bu yerda ko'rsatiladi</p>
                    <button 
                        @click="openModal" 
                        class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                        </svg>
                        Birinchi savolni yuboring
                    </button>
                </div>
            </div>
        </div>

        <!-- Modal -->
        <div v-if="showModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div class="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-3">
                            <div class="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                            </div>
                            <div>
                                <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100">Yangi savol</h2>
                                <p class="text-sm text-gray-600 dark:text-gray-400">Savolingizni yuboring</p>
                            </div>
                        </div>
                        <button 
                            @click="closeModal" 
                            class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors duration-200"
                        >
                            <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>
                </div>

                <div class="p-6 space-y-6">
                    <!-- Personal Information -->
                    <div class="space-y-4">
                        <h3 class="font-medium text-gray-900 dark:text-gray-100 flex items-center space-x-2">
                            <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                            </svg>
                            <span>Shaxsiy ma'lumotlar</span>
                        </h3>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="space-y-2">
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Ism</label>
                                <input 
                                    v-model="formData.name" 
                                    type="text" 
                                    placeholder="Ismingizni kiriting" 
                                    class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                >
                            </div>
                            <div class="space-y-2">
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Familiya</label>
                                <input 
                                    v-model="formData.surname" 
                                    type="text" 
                                    placeholder="Familiyangizni kiriting" 
                                    class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                >
                            </div>
                        </div>
                    </div>

                    <!-- Question -->
                    <div class="space-y-2">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            <span>Savolingiz</span>
                        </label>
                        <textarea 
                            v-model="formData.question" 
                            placeholder="Savolingizni batafsil yozing..." 
                            class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none min-h-[120px]"
                            rows="4"
                        ></textarea>
                    </div>

                    <!-- Form Validation Message -->
                    <div v-if="!isFormValid" class="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                        <div class="flex items-center space-x-2">
                            <svg class="w-4 h-4 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                            </svg>
                            <span class="text-sm text-yellow-700 dark:text-yellow-300">Barcha maydonlarni to'ldiring</span>
                        </div>
                    </div>
                </div>

                <div class="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                    <button 
                        @click="closeModal" 
                        class="px-6 py-3 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-xl hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200"
                    >
                        Bekor qilish
                    </button>
                    <button 
                        @click="submitForm" 
                        :disabled="!isFormValid"
                        class="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:transform-none disabled:shadow-none"
                    >
                        <span class="flex items-center space-x-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                            </svg>
                            <span>Savolni yuborish</span>
                        </span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { inject, onMounted, ref, computed } from 'vue';
import { URL } from '@/auth/url';
import axios from 'axios';

const data = ref([]);
const isLoading = inject('isLoading');
const showModal = ref(false);
const formData = ref({
    name: '',
    surname: '',
    question: ''
});

const isFormValid = computed(() => {
    return formData.value.name.trim() && 
           formData.value.surname.trim() && 
           formData.value.question.trim();
});

const getQuestions = async () => {
    isLoading.value = true;
    try {
        const response = await axios.get(`${URL}/question-answer`);
        data.value = response.data.filter(item => item.isAnswered);
    } catch (error) {
        console.log(error);
    } finally {
        isLoading.value = false;
    }
};

const openModal = () => {
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
    formData.value = { name: '', surname: '', question: '' };
};

const submitForm = async () => {
    if (!isFormValid.value) return;
    
    isLoading.value = true;
    try {
        await axios.post(`${URL}/question-answer`, formData.value);
        await getQuestions();
        closeModal();
    } catch (err) {
        console.log(err);
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    getQuestions();
});
</script>