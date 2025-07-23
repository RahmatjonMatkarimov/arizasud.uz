<template>
    <div>
        <div
            class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-all duration-300">
            <div class="container mx-auto p-6 max-w-6xl">

                <!-- Header -->
                <div class="flex justify-between items-center mb-8">
                    <div class="flex items-center space-x-3">
                        <div class="p-3 bg-blue-500 dark:bg-blue-600 rounded-full shadow-lg">
                            <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z">
                                </path>
                            </svg>
                        </div>
                        <h1 class="text-3xl font-bold text-gray-800 dark:text-white">
                            {{ translateText('Mijozlarga SMS yuborish') }}
                        </h1>
                    </div>
                </div>

                <!-- Success Message -->
                <div v-if="showSuccess"
                    class="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-center space-x-3 animate-pulse">
                    <svg class="h-5 w-5 text-green-500 dark:text-green-400" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span class="text-green-700 dark:text-green-300 font-medium">
                        {{ translateText('SMS muvaffaqiyatli yuborildi!') }}
                    </span>
                </div>
                <div v-if="showErr"
                    class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center space-x-3 animate-pulse">
                    <span class="text-red-700 dark:text-red-300 font-medium">
                        {{ translateText('Bu xabar ro\'yxatdan o\'tkazilmagan') }}
                    </span>
                </div>

                <!-- Stats Cards -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div
                        class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
                        <div class="flex items-center space-x-3">
                            <div class="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                <svg class="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z">
                                    </path>
                                </svg>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500 dark:text-gray-400">{{ translateText('Jami mijozlar') }}
                                </p>
                                <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ customers.length }}</p>
                            </div>
                        </div>
                    </div>
                    <div
                        class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
                        <div class="flex items-center space-x-3">
                            <div class="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                                <svg class="h-6 w-6 text-green-600 dark:text-green-400" fill="none"
                                    stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500 dark:text-gray-400">{{ translateText('Tanlangan') }}</p>
                                <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ selectedCustomers.length
                                    }}</p>
                            </div>
                        </div>
                    </div>
                    <div
                        class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
                        <div class="flex items-center space-x-3">
                            <div class="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                                <svg class="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none"
                                    stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z">
                                    </path>
                                </svg>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500 dark:text-gray-400">{{ translateText('Xabar uzunligi')
                                    }}</p>
                                <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ message.length }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    <!-- Mijozlar ro'yxati -->
                    <div
                        class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
                        <div class="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                            <h2 class="text-xl font-semibold text-gray-800 dark:text-white flex items-center space-x-2">
                                <svg class="h-5 w-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z">
                                    </path>
                                </svg>
                                <span>{{ translateText('Mijozlar ro\'yxati') }}</span>
                            </h2>
                        </div>

                        <div class="overflow-x-auto max-h-96">
                            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead class="bg-gray-50 dark:bg-gray-700 sticky top-0">
                                    <tr>
                                        <th class="px-6 py-4 text-left">
                                            <label class="flex items-center space-x-2 cursor-pointer">
                                                <input type="checkbox" v-model="selectAll" @change="toggleSelectAll"
                                                    class="h-4 w-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                                                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    {{ translateText('Barchasi') }}
                                                </span>
                                            </label>
                                        </th>
                                        <th
                                            class="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            {{ translateText('Ism') }}</th>
                                        <th
                                            class="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            {{ translateText('Familiya') }}</th>
                                        <th
                                            class="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            {{ translateText('Telefon') }}</th>
                                    </tr>
                                </thead>
                                <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    <tr v-for="customer in customers" :key="customer.id"
                                        class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                                        :class="selectedCustomers.includes(customer.phone) ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500' : ''">
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <input type="checkbox" v-model="selectedCustomers" :value="customer.phone"
                                                class="h-4 w-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                                        </td>
                                        <td
                                            class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                            {{ translateText(customer.name) }}
                                        </td>
                                        <td
                                            class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                            {{ translateText(customer.surname) }}
                                        </td>
                                        <td
                                            class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                            {{ customer.phone }}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- SMS yuborish formasi -->
                    <div
                        class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
                        <div class="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                            <h2 class="text-xl font-semibold text-gray-800 dark:text-white flex items-center space-x-2">
                                <svg class="h-5 w-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z">
                                    </path>
                                </svg>
                                <span>{{ translateText('SMS yuborish') }}</span>
                            </h2>
                        </div>

                        <div class="p-6 space-y-6">
                            <div>
                                <div
                                    class="flex items-start mb-2 space-x-3 p-4 border-l-4 border-red-600 bg-red-50 dark:bg-red-900/20 rounded-md shadow-sm">
                                    <svg class="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" fill="none"
                                        stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M12 9v2m0 4h.01M12 6a9 9 0 110 18 9 9 0 010-18z" />
                                    </svg>
                                    <p class="text-sm text-red-700 dark:text-red-300 leading-relaxed">
                                        {{ translateText('Ushbu xabarni yuborish uchun') }} <span
                                            class="font-semibold">{{ 
                                            translateText('Eskiz.uz saytida xabarni ro\'yxatdan o\'tkazgan') }}</span>
                                            {{ translateText('bo\'lishingiz shart.') }}
                                    </p>
                                </div>

                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {{ translateText('Xabar matni') }}
                                </label>
                                <textarea v-model="message" :placeholder="translateText('SMS xabarini kiriting...')"
                                    maxlength="160"
                                    class="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 transition-all duration-200 shadow-sm"
                                    rows="6"></textarea>
                                <div class="mt-3 flex justify-between items-center">
                                    <div class="flex items-center space-x-2">
                                        <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        <p class="text-sm text-gray-600 dark:text-gray-400">
                                            {{ translateText('Tanlangan') }}: <span
                                                class="font-semibold text-blue-600 dark:text-blue-400">{{
                                                    selectedCustomers.length }}</span>
                                        </p>
                                    </div>
                                    <p class="text-sm text-gray-600 dark:text-gray-400">
                                        <span
                                            :class="message.length > 160 ? 'text-red-500' : 'text-gray-600 dark:text-gray-400'">
                                            {{ message.length }}/160
                                        </span>
                                    </p>
                                </div>
                            </div>

                            <!-- Yuborish tugmasi -->
                            <button @click="sendSMS" :disabled="!message || selectedCustomers.length === 0 || isLoading"
                                class="w-full flex items-center justify-center space-x-2 px-6 py-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
                                :class="[
                                    (!message || selectedCustomers.length === 0 || isLoading)
                                        ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
                                ]">
                                <div v-if="isLoading"
                                    class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin">
                                </div>
                                <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                                </svg>
                                <span>{{ isLoading ? translateText('Yuborilmoqda...') : translateText('SMS Yuborish')
                                    }}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { URL } from '@/auth/url';
import axios from 'axios';
import translateText from '@/auth/Translate copy';

// Reaktiv o'zgaruvchilar
const customers = ref([]);
const selectedCustomers = ref([]);
const selectAll = ref(false);
const message = ref('');
const darkMode = ref(false);
const isLoading = ref(false);
const showSuccess = ref(false);
const showErr = ref(false);

// Dark mode toggle
const toggleDarkMode = () => {
    darkMode.value = !darkMode.value;
    localStorage.setItem('darkMode', darkMode.value.toString());
};

// Mijozlar ro'yxatini olish
const getCustomers = async () => {
    try {
        const res = await axios.get(URL + '/customers');
        // Backenddan kelgan mijoz nomlari va familiyalarini translate qilish
        customers.value = res.data.map(customer => ({
            ...customer,
            name: translateText(customer.name),
            surname: translateText(customer.surname) // Familiyani translate qilish
        }));
    } catch (err) {
        console.error(translateText('Mijozlarni olishda xatolik:'), err);
    }
};

// Barchasini tanlash/tanlamaslik
const toggleSelectAll = () => {
    if (selectAll.value) {
        selectedCustomers.value = [...new Set(customers.value.map(c => c.phone))];
    } else {
        selectedCustomers.value = [];
    }
};

// SMS yuborish
const sendSMS = async () => {
    if (!message.value || selectedCustomers.value.length === 0) {
        alert(translateText('Xabar yoki tanlangan mijozlar bo\'lishi kerak!'));
        return;
    }

    isLoading.value = true;

    try {
        const res = await axios.post(URL + '/sms/send-batch', {
            recipients: selectedCustomers.value,
            message: message.value
        });

        showSuccess.value = true;
        message.value = '';
        selectedCustomers.value = [];
        selectAll.value = false;

        setTimeout(() => {
            showSuccess.value = false;
        }, 3000);

    } catch (err) {
        console.error(translateText('SMS yuborishda xatolik:'), err);
        showErr.value = true;
        setTimeout(() => {
            showErr.value = false;
        }, 3000);
    } finally {
        isLoading.value = false;
    }
};

// SelectAll holatini kuzatish
watch([selectedCustomers, customers], () => {
    selectAll.value = selectedCustomers.value.length === customers.value.length && customers.value.length > 0;
}, { deep: true });

// Komponent yuklanganda
onMounted(() => {
    getCustomers();
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode) {
        darkMode.value = savedDarkMode === 'true';
    }
});
</script>

<style lang="scss" scoped>
@keyframes pulse {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: .8;
    }
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-spin {
    animation: spin 1s linear infinite;
}

.overflow-x-auto::-webkit-scrollbar {
    height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
    background: rgb(243 244 246);
}

.dark .overflow-x-auto::-webkit-scrollbar-track {
    background: rgb(55 65 81);
}

.overflow-x-auto::-webkit-scrollbar-thumb {
    background: rgb(209 213 219);
    border-radius: 9999px;
}

.dark .overflow-x-auto::-webkit-scrollbar-thumb {
    background: rgb(75 85 99);
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
    background: rgb(156 163 175);
}

.dark .overflow-x-auto::-webkit-scrollbar-thumb:hover {
    background: rgb(107 114 128);
}
</style>