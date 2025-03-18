<!-- DailyWorkLog.vue -->
<template>
    <div class="worklog-manager">
        <!-- Work Log Creation Form -->
        <div class="worklog-form-container">
            <div class="worklog-form-header">
                <h2>Kunlik Bajarilgan Ishlarni Kiritish</h2>
                <span class="subtitle">Bugun qilgan ishlaringizni qayd eting</span>
            </div>
            <form @submit.prevent="createWorkLog" class="worklog-form">
                <div class="form-group">
                    <label for="comment">Bajarilgan Ish Tavsifi</label>
                    <textarea class="text-black"
                        v-model="state.newWorkLog.comment"
                        id="comment"
                        placeholder="Bugun qilgan ishlaringizni yozing..."
                        required
                    ></textarea>
                </div>
                <button type="submit" :disabled="state.isSubmitting" class="submit-btn">
                    <span v-if="state.isSubmitting">Saqlanmoqda...</span>
                    <span v-else>Ishni Saqlash</span>
                </button>
            </form>
        </div>

        <!-- Work Log List -->
        <div class="worklog-list-container">
            <div class="worklog-list-header">
                <h2>Kunlik Ishlar Ro'yxati</h2>
                <span class="log-count">{{ state.workLogs.length }} ta ish qayd etilgan</span>
            </div>
            <div v-if="state.workLogs.length === 0" class="no-logs">
                <p>Hali bajarilgan ishlar qayd etilmagan</p>
            </div>
            <div v-else class="worklog-grid">
                <div v-for="workLog in state.workLogs" :key="workLog.id" class="worklog-card">
                    <div v-if="state.editingWorkLogId !== workLog.id" class="worklog-view">
                        <div class="worklog-content">
                            <p class="worklog-text">{{ workLog.comment }}</p>
                            <div class="worklog-meta">
                                <span class="text-[#172029]">Qayd etilgan: {{ formatDate(workLog.createdAt) }}</span>
                                <span class="text-[#172029]">Foydalanuvchi: {{ workLog.user?.name || 'Foydalanuvchi ' + workLog.userId }}</span>
                            </div>
                        </div>
                        <div class="worklog-actions">
                            <button @click="startEditing(workLog)" class="edit-btn">Tahrirlash</button>
                            <button @click="deleteWorkLog(workLog.id)" class="delete-btn">O'chirish</button>
                        </div>
                    </div>
                    <!-- Edit Form -->
                    <div v-else class="edit-form">
                        <textarea class="text-black" v-model="state.editedComment" required placeholder="Ish tavsifini yangilang..."></textarea>
                        <div class="edit-actions">
                            <button @click="updateWorkLog(workLog.id)" class="save-btn">Saqlash</button>
                            <button @click="cancelEditing" class="cancel-btn">Bekor Qilish</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { reactive, onMounted } from 'vue'
import axios from 'axios'
import { URL } from '@/auth/url'

export default {
    name: 'DailyWorkLog',
    setup() {
        const userId = parseInt(localStorage.getItem('id')) || null

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
        })

        const API_URL = URL + '/reminders'

        const fetchWorkLogs = async () => {
            try {
                const response = await axios.get(`${URL}/admin/${userId}/reminders`)
                state.workLogs = response.data
            } catch (error) {
                console.error('Ishlar ro\'yxatini olishda xatolik:', error)
            }
        }

        const createWorkLog = async () => {
            if (!state.newWorkLog.comment.trim() || !state.newWorkLog.userId) {
                alert('Foydalanuvchi ID topilmadi yoki tavsif bo\'sh')
                return
            }
            state.isSubmitting = true
            try {
                const response = await axios.post(API_URL, {
                    comment: state.newWorkLog.comment,
                    userId: state.newWorkLog.userId
                })
                state.workLogs.unshift(response.data)
                state.newWorkLog.comment = ''
            } catch (error) {
                console.error('Ish qayd etishda xatolik:', error)
            } finally {
                state.isSubmitting = false
            }
        }

        const startEditing = (workLog) => {
            state.editingWorkLogId = workLog.id
            state.editedComment = workLog.comment
            state.editedUserId = workLog.userId
        }

        const updateWorkLog = async (workLogId) => {
            if (!state.editedUserId) {
                alert('Foydalanuvchi ID topilmadi')
                return
            }
            try {
                const response = await axios.put(`${API_URL}/${workLogId}`, {
                    comment: state.editedComment,
                    userId: state.editedUserId
                })
                const index = state.workLogs.findIndex(r => r.id === workLogId)
                state.workLogs[index] = response.data
                state.editingWorkLogId = null
                state.editedComment = ''
            } catch (error) {
                console.error('Ishni yangilashda xatolik:', error)
            }
        }

        const deleteWorkLog = async (workLogId) => {
            if (!confirm('Bu ish qaydnomasini o\'chirishga ishonchingiz komilmi?')) return
            try {
                await axios.delete(`${API_URL}/${workLogId}`)
                state.workLogs = state.workLogs.filter(r => r.id !== workLogId)
            } catch (error) {
                console.error('Ishni o\'chirishda xatolik:', error)
            }
        }

        const cancelEditing = () => {
            state.editingWorkLogId = null
            state.editedComment = ''
        }

        const formatDate = (dateString) => {
            return new Date(dateString).toLocaleString('uz-UZ')
        }

        onMounted(() => {
            if (!userId) {
                console.warn('localStorage\'da foydalanuvchi ID topilmadi')
            }
            fetchWorkLogs()
        })

        return {
            state,
            createWorkLog,
            startEditing,
            updateWorkLog,
            deleteWorkLog,
            cancelEditing,
            formatDate
        }
    }
}
</script>

<style scoped>
.worklog-manager {
    max-width: 900px;
    margin: 0 auto;
    padding: 30px;
}

.worklog-form-container {
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
    margin-bottom: 30px;
}

.worklog-form-header {
    margin-bottom: 20px;
}

.worklog-form-header h2 {
    color: #2c3e50;
    margin: 0;
    font-size: 24px;
}

.subtitle {
    color: #7f8c8d;
    font-size: 14px;
}

.worklog-form .form-group {
    margin-bottom: 20px;
}

.worklog-form label {
    display: block;
    margin-bottom: 8px;
    color: #34495e;
    font-weight: 500;
}

.worklog-form textarea {
    width: 100%;
    min-height: 120px;
    padding: 12px;
    border: 1px solid #dfe6e9;
    border-radius: 6px;
    resize: vertical;
    font-size: 14px;
    transition: border-color 0.3s;
}

.worklog-form textarea:focus {
    border-color: #3498db;
    outline: none;
}

.submit-btn {
    background: #3498db;
    color: white;
    padding: 10px 20px;
    font-size: 16px;
    font-weight: 500;
    transition: background 0.3s;
}

.submit-btn:hover:not(:disabled) {
    background: #2980b9;
}

.submit-btn:disabled {
    background: #bdc3c7;
    cursor: not-allowed;
}

.worklog-list-container {
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
}

.worklog-list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.worklog-list-header h2 {
    color: #2c3e50;
    margin: 0;
    font-size: 22px;
}

.log-count {
    color: #7f8c8d;
    font-size: 14px;
}

.no-logs {
    text-align: center;
    padding: 20px;
    color: #7f8c8d;
}

.worklog-grid {
    display: grid;
    gap: 15px;
}

.worklog-card {
    background: #f9f9f9;
    border-radius: 6px;
    padding: 15px;
    transition: transform 0.2s;
}

.worklog-card:hover {
    transform: translateY(-2px);
}

.worklog-view {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}

.worklog-content {
    flex: 1;
}

.worklog-text {
    margin: 0 0 10px 0;
    color: #2c3e50;
    font-weight: bold;
    font-size: 15px;
    line-height: 1.5;
}

.worklog-meta {
    color: #7f8c8d;
    font-size: 13px;
}

.worklog-meta span {
    display: block;
    margin: 5px 0;
}

.worklog-actions {
    display: flex;
    gap: 10px;
}

.edit-btn {
    background: #f1c40f;
    color: #2c3e50;
    padding: 6px 12px;
    font-size: 13px;
}

.delete-btn {
    background: #e74c3c;
    color: white;
    padding: 6px 12px;
    font-size: 13px;
}

.edit-form textarea {
    width: 100%;
    min-height: 100px;
    padding: 10px;
    border: 1px solid #dfe6e9;
    border-radius: 6px;
    margin-bottom: 15px;
    font-size: 14px;
}

.edit-form textarea:focus {
    border-color: #3498db;
    outline: none;
}

.edit-actions {
    display: flex;
    gap: 10px;
}

.save-btn {
    background: #2ecc71;
    color: white;
    padding: 8px 16px;
    font-size: 13px;
}

.cancel-btn {
    background: #95a5a6;
    color: white;
    padding: 8px 16px;
    font-size: 13px;
}

button:hover:not(:disabled) {
    opacity: 0.9;
}
</style>