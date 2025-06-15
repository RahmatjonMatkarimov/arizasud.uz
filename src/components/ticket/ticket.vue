<template>
  <div class="container">
    <div class="flex flex-col justify-center items-center">
      <Header class="min-w-full"></Header>
      <div class="support-ticket-manager mt-10">
        <div class="ticket-form-container">
          <div class="relative ticket-form-header">
            <h2 v-if="dat === 'datalotin'">
              Shikoyat va e’tirozlaringizni, shuningdek, qo‘shimcha takliflaringizni yozib
              qoldiring.
            </h2>
            <h2 v-if="dat === 'datakril'">
              {{
                translateText(
                  "Shikoyat va e’tirozlaringizni, shuningdek, qo‘shimcha takliflaringizni yozib qoldiring."
                )
              }}
            </h2>
            <div class="absolute bottom-1 right-1 justify-end">
              <span v-if="dat === 'datalotin'" class="subtitle"
                >Biz sizga yordam berish uchun shu yerdamiz</span
              >
              <span v-if="dat === 'datakril'" class="subtitle">{{
                translateText("Biz sizga yordam berish uchun shu yerdamiz")
              }}</span>
            </div>
          </div>
          <form @submit.prevent="createTicket" class="ticket-form">
            <div class="form-group">
              <label v-if="dat === 'datalotin'" for="comment"
                >Muammoingizni Tasvirlab Bering</label
              >
              <label v-if="dat === 'datakril'" for="comment">{{
                translateText("Muammoingizni Tasvirlab Bering")
              }}</label>
              <textarea
                class="text-black w-[725px]"
                v-model="state.newTicket.comment"
                id="comment"
                :placeholder="
                  dat === 'datakril'
                    ? translateText(
                        'Iltimos, muammoingiz haqida batafsil ma\'lumot bering...'
                      )
                    : 'Iltimos, muammoingiz haqida batafsil ma\'lumot bering...'
                "
                required
              ></textarea>
            </div>
            <div class="flex gap-2">
              <button
                v-if="dat === 'datalotin'"
                type="submit"
                :disabled="state.isSubmitting"
                class="submit-btn"
              >
                {{ state.isSubmitting ? "Yuborilmoqda..." : "So'rovni Yuborish" }}
              </button>
              <button
                v-if="dat === 'datakril'"
                type="submit"
                :disabled="state.isSubmitting"
                class="submit-btn"
              >
                {{
                  state.isSubmitting
                    ? translateText("Yuborilmoqda...")
                    : translateText("So'rovni Yuborish")
                }}
              </button>
              <button @click="router.go(-1)" class="bg-blue-500 rounded-md px-8 py-2">
                {{
                  dat === "datakril" ? translateText("Orqaga qaytish") : "Orqaga qaytish"
                }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, ref, onUnmounted } from 'vue'
import axios from 'axios'
import { URL } from '@/auth/url'
import translateText from '@/auth/Translate'
import Header from '../header.vue'
import { useRouter } from 'vue-router'
import { inject } from 'vue'

const router = useRouter()
const isLoading = inject(`isLoading`)
const dat = ref(localStorage.getItem('til') || 'datalotin');
const checkLanguageChange = () => {
  const currentLang = localStorage.getItem('til') || 'datalotin';
  if (currentLang !== dat.value) {
    dat.value = currentLang;
  }
};

const state = reactive({
  tickets: [],
  newTicket: { comment: '' },
  isSubmitting: false,
  editingTicketId: null,
  editedComment: ''
})

const API_URL = URL + '/ticket'

const fetchTickets = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get(API_URL)
    state.tickets = response.data
  } catch (error) {
    console.error('So\'rovlarni olishda xatolik:', error)
  } finally{
    isLoading.value = false
  }
}

const createTicket = async () => {
  if (!state.newTicket.comment.trim()) return
  state.isSubmitting = true;
  isLoading.value = true;
  try {
    const response = await axios.post(API_URL, {
      comment: state.newTicket.comment
    })
    state.tickets.unshift(response.data)
    state.newTicket.comment = ''
  } catch (error) {
    console.error('So\'rov yaratishda xatolik:', error)
  } finally {
    state.isSubmitting = false;
    isLoading.value = false;
  }
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

.ticket-form-container {
  background: #ffffff;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.ticket-form-header {
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #dfe6e9;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    font-size: 20px;
    font-weight: 600;
    color: #34495e;
    margin: 0;
  }
}

.subtitle {
  display: inline-block;
  font-size: 15px;
  color: #6366f1;
  background: #e0e7ff;
  padding: 4px 12px;
  border-radius: 12px;
}

.ticket-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    color: #34495e;
    font-weight: 500;
  }
}

.ticket-form textarea,
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

  &:focus {
    border-color: #3498db;
    outline: none;
  }
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

  &:hover:not(:disabled) {
    background: #c0c0c0;
  }

  &:disabled {
    background: #bdc3c7;
    cursor: not-allowed;
  }
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

  h2 {
    font-size: 20px;
    font-weight: 600;
    color: #34495e;
    margin: 0;
  }
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

  p {
    color: #34495e;
  }
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

  &:hover {
    background: #7f8c8d;
    transform: translateY(-1px);
  }
}

.delete-btn {
  background: #e74c3c;
  color: #ffffff;
  padding: 6px 12px;
  border-radius: 6px;
  transition: all 0.3s ease;
  border: none;

  &:hover {
    background: #c0392b;
    transform: translateY(-1px);
  }
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.save-btn {
  background: #2ecc71;
  color: #ffffff;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.3s ease;
  border: none;

  &:hover {
    background: #27ae60;
    transform: translateY(-1px);
  }
}

.cancel-btn {
  background: #95a5a6;
  color: #ffffff;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.3s ease;
  border: none;

  &:hover {
    background: #7f8c8d;
    transform: translateY(-1px);
  }
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

  &:hover:not(:disabled) {
    opacity: 0.9;
  }

  &:disabled {
    cursor: not-allowed;
  }
}
</style>
