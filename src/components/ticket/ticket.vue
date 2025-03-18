<!-- SupportTicketManager.vue -->
<template>
    <div class="support-ticket-manager">
        <div class="ticket-form-container">
            <div class="ticket-form-header">
                <h2>Yangi Qo'llab-quvvatlash So'rovini Yuborish</h2>
                <span class="subtitle">Biz sizga yordam berish uchun shu yerdamiz</span>
            </div>
            <form @submit.prevent="createTicket" class="ticket-form">
                <div class="form-group">
                    <label for="comment">Muammoingizni Tasvirlab Bering</label>
                    <textarea class="text-black" v-model="state.newTicket.comment" id="comment"
                        placeholder="Iltimos, muammoingiz haqida batafsil ma'lumot bering..." required></textarea>
                </div>
                <button type="submit" :disabled="state.isSubmitting" class="submit-btn">
                    <span v-if="state.isSubmitting">Yuborilmoqda...</span>
                    <span v-else>So'rovni Yuborish</span>
                </button>
            </form>
        </div>
        <div class="ticket-list-container">
            <div class="ticket-list-header">
                <h2>Sizning Qo'llab-quvvatlash So'rovlaringiz</h2>
                <span class="ticket-count">{{ state.tickets.length }} ta so'rov</span>
            </div>
            <div v-if="state.tickets.length === 0" class="no-tickets">
                <p>Hali qo'llab-quvvatlash so'rovlari yo'q</p>
            </div>
            <div v-else class="ticket-grid">
                <div v-for="ticket in state.tickets" :key="ticket.id" class="ticket-card">
                    <div v-if="state.editingTicketId !== ticket.id" class="ticket-view">
                        <div class="ticket-content">
                            <p class="ticket-text">{{ ticket.comment }}</p>
                            <div>
                                <span class="ticket-meta">Yuborilgan: {{ formatDate(ticket.createdAt) }}</span>
                            </div>
                        </div>
                        <div class="ticket-actions">
                            <button @click="startEditing(ticket)" class="edit-btn">Tahrirlash</button>
                            <button @click="deleteTicket(ticket.id)" class="delete-btn">O'chirish</button>
                        </div>
                    </div>
                    <!-- Edit Form -->
                    <div v-else class="edit-form">
                        <textarea class="text-black" v-model="state.editedComment" required
                            placeholder="Muammoingizni yangilang..."></textarea>
                        <div class="edit-actions">
                            <button @click="updateTicket(ticket.id)" class="save-btn">Saqlash</button>
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
    name: 'SupportTicketManager',
    setup() {
        const state = reactive({
            tickets: [],
            newTicket: {
                comment: ''
            },
            isSubmitting: false,
            editingTicketId: null,
            editedComment: ''
        })

        const API_URL = URL + '/ticket'

        const fetchTickets = async () => {
            try {
                const response = await axios.get(API_URL)
                state.tickets = response.data
            } catch (error) {
                console.error('So\'rovlarni olishda xatolik:', error)
            }
        }

        const createTicket = async () => {
            if (!state.newTicket.comment.trim()) return
            state.isSubmitting = true
            try {
                const response = await axios.post(API_URL, {
                    comment: state.newTicket.comment
                })
                state.tickets.unshift(response.data)
                state.newTicket.comment = ''
            } catch (error) {
                console.error('So\'rov yaratishda xatolik:', error)
            } finally {
                state.isSubmitting = false
            }
        }

        const startEditing = (ticket) => {
            state.editingTicketId = ticket.id
            state.editedComment = ticket.comment
        }

        const updateTicket = async (ticketId) => {
            try {
                const response = await axios.put(`${API_URL}/${ticketId}`, {
                    comment: state.editedComment
                })
                const index = state.tickets.findIndex(t => t.id === ticketId)
                state.tickets[index] = response.data
                state.editingTicketId = null
                state.editedComment = ''
            } catch (error) {
                console.error('So\'rovni yangilashda xatolik:', error)
            }
        }

        const deleteTicket = async (ticketId) => {
            if (!confirm('Bu qo\'llab-quvvatlash so\'rovini o\'chirishga ishonchingiz komilmi?')) return
            try {
                await axios.delete(`${API_URL}/${ticketId}`)
                state.tickets = state.tickets.filter(t => t.id !== ticketId)
            } catch (error) {
                console.error('So\'rovni o\'chirishda xatolik:', error)
            }
        }

        const cancelEditing = () => {
            state.editingTicketId = null
            state.editedComment = ''
        }

        const formatDate = (dateString) => {
            return new Date(dateString).toLocaleString('uz-UZ')
        }

        onMounted(() => {
            fetchTickets()
        })

        return {
            state,
            createTicket,
            startEditing,
            updateTicket,
            deleteTicket,
            cancelEditing,
            formatDate
        }
    }
}
</script>

<style scoped>
.support-ticket-manager {
    max-width: 900px;
    margin: 0 auto;
    padding: 30px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.ticket-form-container {
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
    margin-bottom: 30px;
}

.ticket-form-header {
    margin-bottom: 20px;
}

.ticket-form-header h2 {
    color: #2c3e50;
    margin: 0;
    font-size: 24px;
}

.subtitle {
    color: #7f8c8d;
    font-size: 14px;
}

.ticket-form .form-group {
    margin-bottom: 20px;
}

.ticket-form label {
    display: block;
    margin-bottom: 8px;
    color: #34495e;
    font-weight: 500;
}

.ticket-form textarea {
    width: 100%;
    min-height: 120px;
    padding: 12px;
    border: 1px solid #dfe6e9;
    border-radius: 6px;
    resize: vertical;
    font-size: 14px;
    transition: border-color 0.3s;
}

.ticket-form textarea:focus {
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

.ticket-list-container {
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
}

.ticket-list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.ticket-list-header h2 {
    color: #2c3e50;
    margin: 0;
    font-size: 22px;
}

.ticket-count {
    color: #7f8c8d;
    font-size: 14px;
}

.no-tickets {
    text-align: center;
    padding: 20px;
    color: #7f8c8d;
}

.ticket-grid {
    display: grid;
    gap: 15px;
}

.ticket-card {
    background: #f9f9f9;
    border-radius: 6px;
    padding: 15px;
    transition: transform 0.2s;
}

.ticket-card:hover {
    transform: translateY(-2px);
}

.ticket-view {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}

.ticket-content {
    flex: 1;
}

.ticket-text {
    margin: 0 0 10px 0;
    color: #2c3e50;
    font-weight: bold;
    font-size: 15px;
    line-height: 1.5;
}

.ticket-meta {
    color: #7f8c8d;
    font-size: 13px;
}

.ticket-actions {
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