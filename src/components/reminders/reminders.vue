<!-- DailyWorkLog.vue -->
<template>
    <div class="container">
        <div class="worklog-manager">
            <div class="worklog-form-container">
                <div class="worklog-form-header">
                    <h2 v-if="dat === 'datalotin'">Kunlik Bajarilgan Ishlarni Kiritish</h2>
                    <h2 v-if="dat === 'datakril'">{{ translateText("Кунлик Бажарилган Ишларни Киритиш") }}</h2>
                    <span v-if="dat === 'datalotin'" class="subtitle">Bugun qilgan ishlaringizni qayd eting</span>
                    <span v-if="dat === 'datakril'" class="subtitle">{{ translateText("Бугун қилган ишларингизни қайд этинг") }}</span>
                </div>
                <form @submit.prevent="createWorkLog" class="worklog-form">
                    <div class="form-group">
                        <label v-if="dat === 'datalotin'" for="comment">Bajarilgan Ish Tavsifi</label>
                        <label v-if="dat === 'datakril'" for="comment">{{ translateText("Бажарилган Иш Тавсифи") }}</label>
                        <textarea class="w-[725px] text-black" v-model="state.newWorkLog.comment" id="comment"
                            :placeholder="dat === 'datakril' ? translateText('Бугун қилган ишларингизни ёзинг...') : 'Bugun qilgan ishlaringizni yozing...'"
                            required></textarea>
                    </div>
                    <button type="submit" :disabled="state.isSubmitting" class="submit-btn">
                        <span v-if="state.isSubmitting && dat === 'datalotin'">Saqlanmoqda...</span>
                        <span v-if="state.isSubmitting && dat === 'datakril'">{{ translateText("Сақланмоқда...") }}</span>
                        <span v-if="!state.isSubmitting && dat === 'datalotin'">Ishni Saqlash</span>
                        <span v-if="!state.isSubmitting && dat === 'datakril'">{{ translateText("Ишни Сақлаш") }}</span>
                    </button>
                </form>
            </div>

            <div class="worklog-list-container">
                <div class="worklog-list-header">
                    <h2>{{ dat === 'datakril' ? translateText("Кунлик Ишлар Рўйхати") : 'Kunlik Ishlar Ro\'yxati' }}</h2>
                    <span class="log-count">{{ state.workLogs.length }} {{ dat === 'datakril' ? translateText('та иш қайд этилган') : 'ta ish qayd etilgan' }}</span>
                </div>
                <div v-if="state.workLogs.length === 0" class="worklog-card">
                    <p>{{ dat === 'datakril' ? translateText('Ҳали бажарилган ишлар қайд этилмаган') : 'Hali bajarilgan ishlar qayd etilmagan' }}</p>
                </div>
                <div v-else class="worklog-grid">
                    <div v-for="workLog in state.workLogs" :key="workLog.id" class="worklog-card">
                        <div v-if="state.editingWorkLogId !== workLog.id" class="worklog-view">
                            <div class="worklog-content flex items-center gap-5">
                                <img v-if="workLog.user && workLog.user.img" class="w-[60px] border" :src="'https://backend.arizasud.uz/upload/' + workLog.user.img" alt="User image">
                                <div class="worklog-meta">
                                    <p class="worklog-text">{{ dat === 'datakril' ? translateText(workLog.comment) : workLog.comment }}</p>
                                    <span class="text-[#172029]">{{ dat === 'datakril' ? translateText('Қайд этилган:') : 'Qayd etilgan:' }} {{ formatDate(workLog.createdAt) }}</span>
                                </div>
                            </div>
                            <div v-if="!workLog.isActive" class="worklog-actions">
                                <button @click="startEditing(workLog)" class="edit-btn">
                                    {{ dat === 'datakril' ? translateText('Таҳрирлаш') : 'Tahrirlash' }}
                                </button>
                                <button @click="deleteWorkLog(workLog.id)" class="delete-btn">
                                    {{ dat === 'datakril' ? translateText('Ўчириш') : 'O\'chirish' }}
                                </button>
                            </div>
                        </div>
                        <div v-else class="edit-form">
                            <textarea class="text-black w-[725px]" v-model="state.editedComment" required
                                :placeholder="dat === 'datakril' ? translateText('Иш тавсифини янгилаг...') : 'Ish tavsifini yangilang...'"></textarea>
                            <div class="edit-actions">
                                <button @click="updateWorkLog(workLog.id)" class="save-btn">
                                    {{ dat === 'datakril' ? translateText('Сақлаш') : 'Saqlash' }}
                                </button>
                                <button @click="cancelEditing" class="cancel-btn">
                                    {{ dat === 'datakril' ? translateText('Бекор Қилиш') : 'Bekor Qilish' }}
                                </button>
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
        const dat = inject('dat');

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

<style scoped>
.container {
    min-height: 100vh;
    min-width: 100%;
    background: #1a2a44;
    padding: 30px 0px;
}

.worklog-manager {
    max-width: 800px;
    margin: 20px auto;
    padding: 20px;
    background: #f5f7fa;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.worklog-form-container {
    background: #ffffff;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
}

.worklog-form-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #dfe6e9;
}

.worklog-form-header h2 {
    font-size: 20px;
    font-weight: 600;
    color: #34495e;
    margin: 0;
}

.subtitle {
    font-size: 15px;
    color: #6366f1;
    background: #e0e7ff;
    padding: 4px 12px;
    border-radius: 12px;
}

.worklog-form {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.form-group label {
    color: #34495e;
    font-weight: 500;
}

.worklog-form textarea {
    min-width: 100%;
    min-height: 120px;
    padding: 12px;
    border: 1px solid #dfe6e9;
    border-radius: 6px;
    resize: vertical;
    font-size: 14px;
    transition: border-color 0.3s;
    background: white;
}

.worklog-form textarea:focus {
    border-color: #3498db;
    outline: none;
}

.submit-btn {
    align-self: flex-start;
    background: #d3d3d3;
    color: #34495e;
    padding: 10px 24px;
    border-radius: 6px;
    font-weight: 500;
    transition: background 0.3s;
    border: none;
}

.submit-btn:hover:not(:disabled) {
    background: #c0c0c0;
}

.submit-btn:disabled {
    background: #bdc3c7;
    cursor: not-allowed;
}

.worklog-list-container {
    background: #ffffff;
    padding: 20px;
    border-radius: 8px;
}

.worklog-list-header {
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #dfe6e9;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.worklog-list-header h2 {
    font-size: 20px;
    font-weight: 600;
    color: #34495e;
    margin: 0;
}

.log-count {
    font-size: 14px;
    color: #6366f1;
    background: #e0e7ff;
    padding: 4px 12px;
    border-radius: 12px;
}

.worklog-grid {
    display: grid;
    gap: 15px;
}

.worklog-card {
    padding: 15px;
    border-radius: 8px;
    background-color: #2c3e50;
    transition: all 0.2s ease;
}

.worklog-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    background-color: #34495e;
}

.worklog-view {
    display: flex;
    justify-content: space-between;
    gap: 15px;
}

.worklog-content {
    flex: 1;
}

.worklog-text {
    color: #ffffff;
    margin-bottom: 10px;
    line-height: 1.5;
    font-size: 14px;
}

.worklog-meta span {
    display: inline-block;
    font-size: 13px;
    color: #ffffff;
    background: rgba(241, 245, 249, 0.7);
    padding: 4px 8px;
    border-radius: 6px;
}

.worklog-actions,
.edit-actions {
    display: flex;
    gap: 10px;
}

.worklog-content img {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #3498db;
    padding: 2px;
    background: #fff;
}

.worklog-content img:hover {
    width: 100px;
    height: 100px;
    transition: 500ms ease all;
}

.edit-btn {
    background: #95a5a6;
    color: #ffffff;
    padding: 6px 12px;
    border-radius: 6px;
    transition: all 0.3s ease;
    border: none;
}

.edit-btn:hover {
    background: #7f8c8d;
    transform: translateY(-1px);
}

.delete-btn {
    background: #e74c3c;
    color: #ffffff;
    padding: 6px 12px;
    border-radius: 6px;
    transition: all 0.3s ease;
    border: none;
}

.delete-btn:hover {
    background: #c0392b;
    transform: translateY(-1px);
}

.edit-form {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.edit-form textarea {
    width: 100%;
    min-height: 120px;
    padding: 12px;
    border: 1px solid #dfe6e9;
    border-radius: 6px;
    resize: vertical;
    font-size: 14px;
    transition: border-color 0.3s;
    background: white;
}

.edit-form textarea:focus {
    border-color: #3498db;
    outline: none;
}

.save-btn {
    background: #2ecc71;
    color: #ffffff;
    padding: 8px 16px;
    border-radius: 6px;
    transition: all 0.3s ease;
    border: none;
}

.save-btn:hover {
    background: #27ae60;
    transform: translateY(-1px);
}

.cancel-btn {
    background: #95a5a6;
    color: #ffffff;
    padding: 8px 16px;
    border-radius: 6px;
    transition: all 0.3s ease;
    border: none;
}

.cancel-btn:hover {
    background: #7f8c8d;
    transform: translateY(-1px);
}

button {
    border: none;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
}

button:hover:not(:disabled) {
    opacity: 0.9;
}

button:disabled {
    cursor: not-allowed;
}
</style>