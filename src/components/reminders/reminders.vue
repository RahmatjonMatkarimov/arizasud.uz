<!-- DailyWorkLog.vue -->
<template>
    <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-6 transition-colors duration-300">
        <div class="max-w-4xl mx-auto space-y-8">
            <!-- Form Container -->
            <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors duration-300">
                <!-- Header -->
                <div class="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 px-8 py-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <h1 class="text-2xl font-bold text-white mb-2">
                                {{ dat === 'datalotin' ? 'Kunlik Bajarilgan Ishlarni Kiritish' : translateText("Kunlik Bajarilgan Ishlarni Kiritish") }}
                            </h1>
                            <p class="text-blue-100 text-sm">
                                {{ dat === 'datalotin' ? 'Bugun qilgan ishlaringizni qayd eting' : translateText("Bugun qilgan ishlaringizni qayd eting") }}
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Form -->
                <form @submit.prevent="createWorkLog" class="p-8">
                    <div class="space-y-6">
                        <div>
                            <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                                {{ dat === 'datalotin' ? 'Bajarilgan Ish Tavsifi' : translateText("Bajarilgan Ish Tavsifi") }}
                            </label>
                            <div class="relative">
                                <textarea 
                                    v-model="state.newWorkLog.comment" 
                                    id="comment"
                                    :placeholder="dat === 'datakril' ? translateText('Bugun qilgan ishlaringizni yozing...') : 'Bugun qilgan ishlaringizni yozing...'"
                                    required
                                    class="w-full h-32 px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 
                                           bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100
                                           focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900
                                           resize-none transition-all duration-200 placeholder-slate-400 dark:placeholder-slate-500"
                                ></textarea>
                                <div class="absolute bottom-3 right-3 text-xs text-slate-400 dark:text-slate-500">
                                    {{ state.newWorkLog.comment.length }}/500
                                </div>
                            </div>
                        </div>
                        
                        <div class="flex justify-end">
                            <button 
                                type="submit" 
                                :disabled="state.isSubmitting || !state.newWorkLog.comment.trim()"
                                class="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700
                                       disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed
                                       text-white font-semibold rounded-xl shadow-lg hover:shadow-xl
                                       transform transition-all duration-200 hover:scale-105 disabled:hover:scale-100
                                       focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900"
                            >
                                <div class="flex items-center space-x-2">
                                    <svg v-if="state.isSubmitting" class="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                    </svg>
                                    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                    </svg>
                                    <span>
                                        <span v-if="state.isSubmitting">
                                            {{ dat === 'datalotin' ? 'Saqlanmoqda...' : translateText("Saqlanmoqda...") }}
                                        </span>
                                        <span v-else>
                                            {{ dat === 'datalotin' ? 'Ishni Saqlash' : translateText("Ishni Saqlash") }}
                                        </span>
                                    </span>
                                </div>
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <!-- Work Logs List -->
            <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors duration-300">
                <!-- List Header -->
                <div class="px-8 py-6 border-b border-slate-200 dark:border-slate-700">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-3">
                            <div class="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2"></path>
                                </svg>
                            </div>
                            <div>
                                <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100">
                                    {{ dat === 'datakril' ? translateText("Kunlik Ishlar Ro\'yxati") : 'Kunlik Ishlar Ro\'yxati' }}
                                </h2>
                                <p class="text-sm text-slate-600 dark:text-slate-400">
                                    {{ dat === 'datakril' ? translateText(`Barcha bajarilgan ishlar ro'yxati`) : `Barcha bajarilgan ishlar ro'yxati` }}
                                </p>
                            </div>
                        </div>
                        <div class="flex items-center space-x-2">
                            <div class="px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 rounded-full">
                                <span class="text-blue-700 dark:text-blue-300 font-semibold text-sm">
                                    {{ state.workLogs.length }} {{ dat === 'datakril' ? translateText('ta ish qayd etilgan') : 'ta ish qayd etilgan' }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Empty State -->
                <div v-if="state.workLogs.length === 0" class="p-12 text-center">
                    <div class="max-w-md mx-auto">
                        <div class="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg class="w-10 h-10 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z"></path>
                            </svg>
                        </div>
                        <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                            {{ dat === 'datakril' ? translateText('Hech qanday ish qayd etilmagan') : 'Hech qanday ish qayd etilmagan' }}
                        </h3>
                        <p class="text-slate-600 dark:text-slate-400">
                            {{ dat === 'datakril' ? translateText('Hali bajarilgan ishlar qayd etilmagan') : 'Hali bajarilgan ishlar qayd etilmagan' }}
                        </p>
                    </div>
                </div>

                <!-- Work Logs Grid -->
                <div v-else class="p-6">
                    <div class="space-y-4">
                        <div v-for="workLog in state.workLogs" :key="workLog.id" 
                             class="group bg-slate-50 dark:bg-slate-700 rounded-xl p-6 border border-slate-200 dark:border-slate-600
                                    hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200
                                    hover:bg-white dark:hover:bg-slate-600">
                            
                            <!-- View Mode -->
                            <div v-if="state.editingWorkLogId !== workLog.id" class="space-y-4">
                                <div class="flex items-start space-x-4">
                                    <!-- User Avatar -->
                                    <div class="flex-shrink-0">
                                        <div v-if="workLog.user && workLog.user.img" 
                                             class="relative group/avatar">
                                            <img :src="'https://backend.arizasud.uz/upload/' + workLog.user.img" 
                                                 alt="User avatar"
                                                 class="w-12 h-12 rounded-full object-cover border-2 border-blue-200 dark:border-blue-700
                                                        group-hover/avatar:border-blue-400 dark:group-hover/avatar:border-blue-500
                                                        transition-all duration-200 group-hover/avatar:scale-110">
                                        </div>
                                        <div v-else class="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                                            <span class="text-white font-semibold text-lg">U</span>
                                        </div>
                                    </div>

                                    <!-- Content -->
                                    <div class="flex-1 min-w-0">
                                        <div class="bg-white dark:bg-slate-600 rounded-lg p-4 border border-slate-200 dark:border-slate-500">
                                            <p class="text-slate-900 dark:text-slate-100 leading-relaxed">
                                                {{ dat === 'datakril' ? translateText(workLog.comment) : workLog.comment }}
                                            </p>
                                        </div>
                                        
                                        <div class="mt-3 flex items-center justify-between">
                                            <div class="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"></path>
                                                </svg>
                                                <span>
                                                    {{ dat === 'datakril' ? translateText('Qayd etilgan:') : 'Qayd etilgan:' }} 
                                                    {{ formatDate(workLog.createdAt) }}
                                                </span>
                                            </div>

                                            <!-- Actions -->
                                            <div v-if="!workLog.isActive" class="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                <button @click="startEditing(workLog)" 
                                                        class="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 dark:bg-amber-900 dark:hover:bg-amber-800
                                                               text-amber-700 dark:text-amber-300 rounded-lg text-sm font-medium
                                                               transition-colors duration-200 flex items-center space-x-1">
                                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5m-1.414-9.414a2 2 0 1 1 2.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                                    </svg>
                                                    <span>{{ dat === 'datakril' ? translateText('Tahrirlash') : 'Tahrirlash' }}</span>
                                                </button>
                                                
                                                <button @click="deleteWorkLog(workLog.id)" 
                                                        class="px-3 py-1.5 bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800
                                                               text-red-700 dark:text-red-300 rounded-lg text-sm font-medium
                                                               transition-colors duration-200 flex items-center space-x-1">
                                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3M4 7h16"></path>
                                                    </svg>
                                                    <span>{{ dat === 'datakril' ? translateText('O\'chirish') : 'O\'chirish' }}</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Edit Mode -->
                            <div v-else class="space-y-4">
                                <textarea 
                                    v-model="state.editedComment" 
                                    required
                                    :placeholder="dat === 'datakril' ? translateText('Иш тавсифини янгилаг...') : 'Ish tavsifini yangilang...'"
                                    class="w-full h-32 px-4 py-3 rounded-xl border-2 border-blue-300 dark:border-blue-600 
                                           bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100
                                           focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900
                                           resize-none transition-all duration-200 placeholder-slate-400 dark:placeholder-slate-500"
                                ></textarea>
                                
                                <div class="flex items-center justify-end space-x-3">
                                    <button @click="cancelEditing" 
                                            class="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-500
                                                   text-slate-700 dark:text-slate-300 rounded-lg font-medium
                                                   transition-colors duration-200 flex items-center space-x-2">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                        </svg>
                                        <span>{{ dat === 'datakril' ? translateText('Bekor Qilish') : 'Bekor Qilish' }}</span>
                                    </button>
                                    
                                    <button @click="updateWorkLog(workLog.id)" 
                                            class="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700
                                                   text-white rounded-lg font-medium shadow-lg hover:shadow-xl
                                                   transform transition-all duration-200 hover:scale-105
                                                   flex items-center space-x-2">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                        <span>{{ dat === 'datakril' ? translateText('Saqlash') : 'Saqlash' }}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { reactive, onMounted, ref, onUnmounted, inject } from 'vue';
import axios from 'axios';
import { URL } from '@/auth/url';
import translateText from '@/auth/Translate';

export default {
    name: 'DailyWorkLog',
    setup() {
        const userId = parseInt(localStorage.getItem('id')) || null;
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

        const state = reactive({
            workLogs: [],
            newWorkLog: {
                comment: '',
                userId: userId
            },
            isSubmitting: false,
            editingWorkLogId: null,
            editedComment: '',
            editedUserId: userId
        });

        const API_URL = URL + '/reminders';

        const fetchWorkLogs = async () => {
            try {
                const response = await axios.get(`${URL}/admin/${userId}/reminder`);
                state.workLogs = response.data.Reminder;
            } catch (error) {
                console.error(dat.value === 'datakril' ? 'Ишлар рўйхатини олишда хатолик:' : 'Ishlar ro\'yxatini olishda xatolik:', error);
            }
        };

        const createWorkLog = async () => {
            if (!state.newWorkLog.comment.trim() || !state.newWorkLog.userId) {
                alert(dat.value === 'datakril' ? 'Фойдаланувчи ID топилмади ёки тавсиф бўш' : 'Foydalanuvchi ID topilmadi yoki tavsif bo\'sh');
                return;
            }
            state.isSubmitting = true;
            try {
                const response = await axios.post(API_URL, {
                    comment: state.newWorkLog.comment,
                    userId: state.newWorkLog.userId
                });
                state.workLogs.unshift(response.data);
                state.newWorkLog.comment = '';
                fetchWorkLogs();
            } catch (error) {
                console.error(dat.value === 'datakril' ? 'Иш қайд этишда хатолик:' : 'Ish qayd etishda xatolik:', error);
            } finally {
                state.isSubmitting = false;
            }
        };

        const startEditing = (workLog) => {
            state.editingWorkLogId = workLog.id;
            state.editedComment = workLog.comment;
            state.editedUserId = workLog.userId;
        };

        const updateWorkLog = async (workLogId) => {
            if (!state.editedUserId) {
                alert(dat.value === 'datakril' ? 'Фойдаланувчи ID топилмади' : 'Foydalanuvchi ID topilmadi');
                return;
            }
            try {
                const response = await axios.put(`${API_URL}/${workLogId}`, {
                    comment: state.editedComment,
                    userId: state.editedUserId
                });
                const index = state.workLogs.findIndex(r => r.id === workLogId);
                state.workLogs[index] = response.data;
                state.editingWorkLogId = null;
                state.editedComment = '';
                fetchWorkLogs();
            } catch (error) {
                console.error(dat.value === 'datakril' ? 'Ишни янгилашда хатолик:' : 'Ishni yangilashda xatolik:', error);
            }
        };

        const deleteWorkLog = async (workLogId) => {
            if (!confirm(dat.value === 'datakril' ? 'Бу иш қайдномасини ўчиришга ишончингиз комилми?' : 'Bu ish qaydnomasini o\'chirishga ishonchingiz komilmi?')) return;
            try {
                await axios.delete(`${API_URL}/${workLogId}`);
                state.workLogs = state.workLogs.filter(r => r.id !== workLogId);
                fetchWorkLogs();
            } catch (error) {
                console.error(dat.value === 'datakril' ? 'Ишни ўчиришда хатолик:' : 'Ishni o\'chirishda xatolik:', error);
            }
        };

        const cancelEditing = () => {
            state.editingWorkLogId = null;
            state.editedComment = '';
        };

        const formatDate = (dateString) => {
            return new Date(dateString).toLocaleString('uz-UZ');
        };

        onMounted(() => {
            if (!userId) {
                console.warn(dat.value === 'datakril' ? 'localStorage\'да фойдаланувчи ID топилмади' : 'localStorage\'da foydalanuvchi ID topilmadi');
            }
            fetchWorkLogs();
        });

        return {
            state,
            dat,
            createWorkLog,
            startEditing,
            updateWorkLog,
            deleteWorkLog,
            cancelEditing,
            formatDate,
            translateText
        };
    }
}
</script>