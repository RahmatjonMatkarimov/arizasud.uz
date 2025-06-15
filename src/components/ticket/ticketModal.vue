
<template>
  <div v-if="hidden" class="fixed inset-0 z-[99999999] flex items-center justify-center bg-gray-800 bg-opacity-50">
    <div class="support-ticket-manager mt-10">
      <div class="ticket-form-container">
        <div class=" relative ticket-form-header">
          <h2 v-if="dat === 'datalotin'">Shikoyat va e’tirozlaringizni, shuningdek, qo‘shimcha takliflaringizni yozib
            qoldiring.</h2>
            <h2 v-if="dat === 'datakril'">{{ translateText("Shikoyat va e’tirozlaringizni, shuningdek, qo‘shimcha takliflaringizni yozib qoldiring.") }}</h2>
            <div class="absolute bottom-1 right-1 justify-end">
              <span v-if="dat === 'datalotin'" class="subtitle">Biz sizga yordam berish uchun shu yerdamiz</span>
              <span v-if="dat === 'datakril'" class="subtitle">{{ translateText("Biz sizga yordam berish uchun shu yerdamiz") }}</span>
            </div>
          </div>
          <form @submit.prevent="createTicket" class="ticket-form">
            <div class="form-group">
              <label v-if="dat === 'datalotin'" for="comment">Muammoingizni Tasvirlab Bering</label>
              <label v-if="dat === 'datakril'" for="comment">{{ translateText("Muammoingizni Tasvirlab Bering") }}</label>
              <textarea class="text-black w-[725px]" v-model="state.newTicket.comment" id="comment"
              :placeholder="dat === 'datakril' ? translateText('Iltimos, muammoingiz haqida batafsil ma\'lumot bering...') : 'Iltimos, muammoingiz haqida batafsil ma\'lumot bering...'"
              required></textarea>
            </div>
            <div class="flex gap-2">
              <button v-if="dat === 'datalotin'" type="submit" :disabled="state.isSubmitting" class="submit-btn">
                {{ state.isSubmitting ? 'Yuborilmoqda...' : 'So\'rovni Yuborish' }}
              </button>
              <button v-if="dat === 'datakril'" type="submit" :disabled="state.isSubmitting" class="submit-btn">
                {{ state.isSubmitting ? translateText('Yuborilmoqda...') : translateText('So\'rovni Yuborish') }}
              </button>
              <button @click="hidden = false" class="bg-blue-500 rounded-md px-8 py-2">
                {{ dat === 'datakril' ? translateText('Bekor qilish') : 'Bekor qilish' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
</template>

<script setup>
import { reactive, onMounted, ref, inject, onUnmounted } from 'vue'
import axios from 'axios'
import { URL } from '@/auth/url'
import translateText from '@/auth/Translate'

const hidden = inject('hidden')
const isLoading = inject('isLoading')
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
  isLoading.value = true
  try {
    const response = await axios.get(API_URL)
    state.tickets = response.data
  } catch (error) {
    console.error('So\'rovlarni olishda xatolik:', error)
  }finally{isLoading.value=false}
}

const createTicket = async () => {
  if (!state.newTicket.comment.trim()) return
  state.isSubmitting = true
  isLoading.value = true
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
    isLoading.value = false
    hidden.value = false
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
  background: #121212; /* Dark gray background */
}

.support-ticket-manager {
  width: 100%;
  max-width: 800px;
  padding: 20px;
  background: #1e1e1e; /* Darker card background */
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.ticket-form-container {
  background: #252525; /* Slightly lighter dark background */
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.ticket-form-header {
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #424242; /* Darker border */
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    font-size: 20px;
    font-weight: 600;
    color: #e0e0e0; /* Light gray text */
    margin: 0;
  }
}

.subtitle {
  display: inline-block;
  font-size: 15px;
  color: #26a69a; /* Teal accent */
  background: #1b3a38; /* Dark teal background */
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
  width: 100%;

  label {
    color: #e0e0e0; /* Light gray text */
    font-weight: 500;
  }
}

.ticket-form textarea,
.edit-form textarea {
  min-width: 100%;
  min-height: 120px;
  padding: 12px;
  border: 1px solid #424242; /* Darker border */
  border-radius: 6px;
  resize: vertical;
  font-size: 14px;
  transition: border-color 0.3s;
  background: #2c2c2c; /* Dark input background */
  color: #e0e0e0; /* Light text for input */

  &:focus {
    border-color: #26a69a; /* Teal border on focus */
    outline: none;
  }
}

.submit-btn {
  align-self: flex-start;
  background: #424242; /* Neutral gray button */
  color: #e0e0e0; /* Light text */
  padding: 10px 24px;
  border-radius: 6px;
  font-weight: 500;
  transition: background 0.3s;
  border: none;

  &:hover:not(:disabled) {
    background: #616161; /* Lighter gray on hover */
  }

  &:disabled {
    background: #333333; /* Darker disabled state */
    cursor: not-allowed;
  }
}

.ticket-list-container {
  background: #252525; /* Dark container background */
  padding: 20px;
  border-radius: 8px;
}

.ticket-list-header {
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #424242; /* Darker border */
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    font-size: 20px;
    font-weight: 600;
    color: #e0e0e0; /* Light gray text */
    margin: 0;
  }
}

.ticket-count {
  font-size: 14px;
  color: #26a69a; /* Teal accent */
  background: #1b3a38; /* Dark teal background */
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
  background-color: #2c2c2c; /* Dark card background */
  transition: all 0.2s ease;
}

.ticket-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  background-color: #383838; /* Slightly lighter on hover */
}

.empty-state {
  background-color: transparent;
  text-align: center;
  padding: 20px;

  p {
    color: #e0e0e0; /* Light gray text */
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
  color: #e0e0e0; /* Light text */
  margin-bottom: 10px;
  line-height: 1.5;
  font-size: 14px;
}

.ticket-meta span {
  display: inline-block;
  font-size: 13px;
  color: #e0e0e0; /* Light text */
  background: rgba(66, 66, 66, 0.7); /* Semi-transparent dark background */
  padding: 4px 8px;
  border-radius: 6px;
}

.ticket-actions,
.edit-actions {
  display: flex;
  gap: 10px;
}

.edit-btn {
  background: #ab47bc; /* Purple button */
  color: #ffffff;
  padding: 6px 12px;
  border-radius: 6px;
  transition: all 0.3s ease;
  border: none;

  &:hover {
    background: #8e24aa; /* Darker purple on hover */
    transform: translateY(-1px);
  }
}

.delete-btn {
  background: #e91e63; /* Pinkish-red button */
  color: #ffffff;
  padding: 6px 12px;
  border-radius: 6px;
  transition: all 0.3s ease;
  border: none;

  &:hover {
    background: #c2185b; /* Darker red on hover */
    transform: translateY(-1px);
  }
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.save-btn {
  background: #26a69a; /* Teal button */
  color: #ffffff;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.3s ease;
  border: none;

  &:hover {
    background: #1f857a; /* Darker teal on hover */
    transform: translateY(-1px);
  }
}

.cancel-btn {
  background: #ab47bc; /* Purple button */
  color: #ffffff;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.3s ease;
  border: none;

  &:hover {
    background: #8e24aa; /* Darker purple on hover */
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