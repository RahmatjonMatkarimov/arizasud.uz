<template>
  <div class="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 transition-all duration-300">
    <div class="flex flex-col justify-center items-center p-4">
      <div class="w-full max-w-6xl mt-8">
        <!-- Header Section -->
        <div class="mb-8 text-center">
          <h1 class="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent mb-2">
            {{ dat === "datakril" ? translateText("Qo'llab-quvvatlash markazi") : "Qo'llab-quvvatlash markazi" }}
          </h1>
          <p class="text-slate-600 dark:text-slate-300 text-lg">
            {{ dat === "datakril" ? translateText("Sizning takliflaringiz va muammolaringizni hal qilamiz") : "Sizning takliflaringiz va muammolaringizni hal qilamiz" }}
          </p>
        </div>

        <!-- Main Container -->
        <div class="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/50 overflow-hidden">
          <!-- Ticket List Header -->
          <div class="bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 p-6">
            <div class="flex justify-between items-center">
              <div class="flex items-center space-x-4">
                <div class="p-3 bg-white/20 rounded-xl">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <div>
                  <h2 class="text-2xl font-bold text-white">
                    {{ dat === "datakril" ? translateText("Yangi taklif va shikoyatlar") : "Yangi taklif va shikoyatlar" }}
                  </h2>
                  <p class="text-blue-100 text-sm mt-1">
                    {{ dat === "datakril" ? translateText("Barcha so'rovlar ro'yxati") : "Barcha so'rovlar ro'yxati" }}
                  </p>
                </div>
              </div>
              <div class="text-right">
                <div class="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/30">
                  <div class="text-white font-bold text-lg">{{ state.tickets.length }}</div>
                  <div class="text-blue-100 text-sm">{{ dat === "datakril" ? translateText("ta so'rov") : "ta so'rov" }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Content Area -->
          <div class="p-6">
            <!-- Empty State -->
            <div v-if="state.tickets.length === 0" class="text-center py-16">
              <div class="mb-6">
                <div class="mx-auto w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full flex items-center justify-center">
                  <svg class="w-12 h-12 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                  </svg>
                </div>
              </div>
              <h3 class="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
                {{ dat === "datakril" ? translateText("Hali so'rovlar yo'q") : "Hali so'rovlar yo'q" }}
              </h3>
              <p class="text-slate-500 dark:text-slate-400">
                {{ dat === "datakril" ? translateText("Birinchi qo'llab-quvvatlash so'rovingizni yarating") : "Birinchi qo'llab-quvvatlash so'rovingizni yarating" }}
              </p>
            </div>

            <!-- Tickets Grid -->
            <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div v-for="ticket in state.tickets" :key="ticket.id" 
                   class="group relative bg-gradient-to-br from-white to-slate-50 dark:from-slate-700 dark:to-slate-800 rounded-xl shadow-lg hover:shadow-2xl border border-slate-200 dark:border-slate-600 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                
                <!-- Ticket View Mode -->
                <template v-if="state.editingTicketId !== ticket.id">
                  <div class="p-6">
                    <!-- Status Indicator -->
                    <div class="flex items-center justify-between mb-4">
                      <div class="flex items-center space-x-2">
                        <div class="w-3 h-3 bg-blue-400 rounded-full"></div>
                        <span class="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-full">
                          {{ dat === "datakril" ? translateText("Yuborilgan") : "Yuborilgan" }}
                        </span>
                      </div>
                      <div class="text-xs text-slate-500 dark:text-slate-400">
                        #{{ ticket.id }}
                      </div>
                    </div>

                    <!-- Content -->
                    <div class="mb-6">
                      <p class="text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-4">
                        {{ dat === "datakril" ? translateText(ticket.comment) : ticket.comment }}
                      </p>
                    </div>

                    <!-- Meta Info -->
                    <div class="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 mb-6">
                      <div class="flex items-center space-x-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span>{{ formatDate(ticket.createdAt) }}</span>
                      </div>
                    </div>

                    <!-- Actions -->
                    <div class="flex space-x-3">
                      <button @click="startEditing(ticket)" 
                              class="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                        <span>{{ dat === "datakril" ? translateText("Tahrirlash") : "Tahrirlash" }}</span>
                      </button>
                      <button @click="deleteTicket(ticket.id)" 
                              class="flex items-center justify-center bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2.5 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </template>

                <!-- Edit Mode -->
                <template v-else>
                  <div class="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                    <div class="flex items-center space-x-2 mb-4">
                      <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                      <h3 class="font-semibold text-blue-900 dark:text-blue-300">
                        {{ dat === "datakril" ? translateText("So'rovni tahrirlash") : "So'rovni tahrirlash" }}
                      </h3>
                    </div>
                    
                    <textarea
                      v-model="state.editedComment"
                      class="w-full h-32 p-4 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 resize-none"
                      :placeholder="dat === 'datakril' ? translateText('Muammoingizni yangilang...') : 'Muammoingizni yangilang...'"
                      required
                    ></textarea>
                    
                    <div class="flex space-x-3 mt-4">
                      <button @click="updateTicket(ticket.id)" 
                              class="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2.5 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span>{{ dat === "datakril" ? translateText("Saqlash") : "Saqlash" }}</span>
                      </button>
                      <button @click="cancelEditing" 
                              class="flex items-center justify-center bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white px-4 py-2.5 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </template>

                <!-- Decorative Elements -->
                <div class="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-200/20 to-indigo-200/20 dark:from-blue-600/10 dark:to-indigo-600/10 rounded-full -translate-y-10 translate-x-10"></div>
                <div class="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-purple-200/20 to-pink-200/20 dark:from-purple-600/10 dark:to-pink-600/10 rounded-full translate-y-8 -translate-x-8"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, ref, onUnmounted, inject } from "vue";
import axios from "axios";
import { URL } from "@/auth/url";
import translateText from "@/auth/Translate";

const dat = ref(localStorage.getItem("til") || "datalotin");
const isLoading = inject(`isLoading`);

const state = reactive({
  tickets: [],
  newTicket: { comment: "" },
  isSubmitting: false,
  editingTicketId: null,
  editedComment: "",
});

const API_URL = URL + "/ticket";

const fetchTickets = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get(API_URL);
    state.tickets = response.data;
  } catch (error) {
    console.error("So'rovlarni olishda xatolik:", error);
  } finally {
    isLoading.value = false;
  }
};

const createTicket = async () => {
  if (!state.newTicket.comment.trim()) return;
  state.isSubmitting = true;
  isLoading.value = true;
  try {
    const response = await axios.post(API_URL, {
      comment: state.newTicket.comment,
    });
    state.tickets.unshift(response.data);
    state.newTicket.comment = "";
  } catch (error) {
    console.error("So'rov yaratishda xatolik:", error);
  } finally {
    state.isSubmitting = false;
    isLoading.value = false;
  }
};

const startEditing = (ticket) => {
  state.editingTicketId = ticket.id;
  state.editedComment = ticket.comment;
};

const updateTicket = async (ticketId) => {
  isLoading.value = true;
  try {
    const response = await axios.put(`${API_URL}/${ticketId}`, {
      comment: state.editedComment,
    });
    const index = state.tickets.findIndex((t) => t.id === ticketId);
    state.tickets[index] = response.data;
    state.editingTicketId = null;
    state.editedComment = "";
  } catch (error) {
    console.error("So'rovni yangilashda xatolik:", error);
  } finally {
    isLoading.value = false;
  }
};

const deleteTicket = async (ticketId) => {
  isLoading.value = true;
  try {
    await axios.delete(`${API_URL}/${ticketId}`);
    state.tickets = state.tickets.filter((t) => t.id !== ticketId);
  } catch (error) {
    console.error("So'rovni o'chirishda xatolik:", error);
  } finally {
    isLoading.value = false;
  }
};

const cancelEditing = () => {
  state.editingTicketId = null;
  state.editedComment = "";
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString("uz-UZ", {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

onMounted(() => {
  fetchTickets();
});

</script>