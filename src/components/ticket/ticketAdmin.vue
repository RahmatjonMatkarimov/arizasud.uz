<template>
    <div class="container">
        <div class="flex flex-col justify-center items-center">
            <div class="support-ticket-manager mt-10">
                <div class="ticket-list-container">
                    <div class="ticket-list-header">
                        <h2>{{ dat === 'datakril' ? translateText('Yangi taklif va shikoyatlar') : 'Yangi taklif va shikoyatlar' }}</h2>
                        <span class="ticket-count">{{ state.tickets.length }} {{ dat === 'datakril' ? translateText('ta so\'rov') : 'ta so\'rov' }}</span>
                    </div>
                    <div class="ticket-grid">
                        <div v-if="state.tickets.length === 0" class="ticket-card empty-state">
                            <p>{{ dat === 'datakril' ? translateText(`Hali qo'llab-quvvatlash so'rovlari yo'q`) : `Hali qo'llab-quvvatlash so'rovlari yo'q` }}</p>
                        </div>
                        <div v-for="ticket in state.tickets" :key="ticket.id" class="ticket-card">
                            <template v-if="state.editingTicketId !== ticket.id">
                                <div class="ticket-view">
                                    <div class="ticket-content">
                                        <p class="ticket-text">{{ dat === 'datakril' ? translateText(ticket.comment) : ticket.comment }}</p>
                                        <div class="ticket-meta">
                                            <span>{{ dat === 'datakril' ? translateText(`Yuborilgan:`) : 'Yuborilgan:' }} {{ formatDate(ticket.createdAt) }}</span>
                                        </div>
                                    </div>
                                    <div class="ticket-actions">
                                        <button @click="startEditing(ticket)" class="edit-btn">
                                            {{ dat === 'datakril' ? translateText(`Tahrirlash:`) : 'Tahrirlash:' }}
                                        </button>
                                        <button @click="deleteTicket(ticket.id)" class="delete-btn">
                                            {{ dat === 'datakril' ? translateText(`O'chirish:`) : `O'chirish:` }}
                                        </button>
                                    </div>
                                </div>
                            </template>
                            <template v-else>
                                <div class="edit-form">
                                    <textarea class="text-black" v-model="state.editedComment" required
                                        placeholder="Muammoingizni yangilang..."></textarea>
                                    <div class="edit-actions">
                                        <button @click="updateTicket(ticket.id)" class="save-btn">
                                            {{ dat === 'datakril' ? translateText(`Saqlash`) : `Saqlash` }}
                                            
                                        </button>
                                        <button @click="cancelEditing" class="cancel-btn">
                                            {{ dat === 'datakril' ? translateText(`Bekor Qilish`) : `Bekor Qilish` }}
                                        </button>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, onMounted, ref, onUnmounted, inject } from 'vue'
import axios from 'axios'
import { URL } from '@/auth/url'
import translateText from '@/auth/Translate'

const dat = inject('dat');

const state = reactive({
    tickets: [],
    newTicket: { comment: '' },
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
let intervalId = null;
onMounted(() => {
    fetchTickets()
    intervalId = setInterval(checkLanguageChange, 0);
})
onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});
</script>

<style lang="scss" scoped>
.container {
    min-height: 100vh;
    min-width: 100%;
    background: #1a2a44;
}

.support-ticket-manager {
    width: 100%;
    max-width: 800px;
    padding: 20px;
    background: #f5f7fa;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.ticket-list-container {
    background: #ffffff;
    padding: 20px;
    border-radius: 8px;
}

.ticket-list-header {
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #dfe6e9;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.ticket-list-header h2 {
    font-size: 20px;
    font-weight: 600;
    color: #34495e;
    margin: 0;
}

.ticket-count {
    font-size: 14px;
    color: #6366f1;
    background: #e0e7ff;
    padding: 4px 12px;
    border-radius: 12px;
}

.ticket-grid {
    display: grid;
    gap: 15px;
}

.ticket-card {
    padding: 15px;
    border-radius: 8px;
    background-color: #2c3e50;
    transition: all 0.2s ease;
}

.ticket-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    background-color: #34495e;
}

.empty-state {
    background-color: transparent;
    text-align: center;
    padding: 20px;
}

.empty-state p {
    color: #34495e;
}

.ticket-view {
    display: flex;
    justify-content: space-between;
    gap: 15px;
}

.ticket-content {
    flex: 1;
}

.ticket-text {
    color: #ffffff;
    margin-bottom: 10px;
    line-height: 1.5;
    font-size: 14px;
}

.ticket-meta span {
    display: inline-block;
    font-size: 13px;
    color: #ffffff;
    background: rgba(241, 245, 249, 0.7);
    padding: 4px 8px;
    border-radius: 6px;
}

.ticket-actions,
.edit-actions {
    display: flex;
    gap: 10px;
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