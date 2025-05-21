<template>
  <div
    class="min-w-full mx-auto top-[100px] h-[calc(100vh-100px)] fixed border-2 rounded-2xl border-teal-500 bg-gradient-to-br from-gray-900 to-gray-800 backdrop-blur-md">
    <div id="img" class="relative flex min-w-full justify-between h-full">
      <div class="w-full flex flex-col  mx-auto items-center justify-center p-4">
        <div ref="messagesContainer"
          class="min-w-full mb-[190px] mt-[100px] h-[calc(100%-100px)] overflow-y-auto p-4 space-y-4 scrollbar-custom">
          <div v-for="message in messages" :key="message.id" :ref="el => messageRefs[message.id] = el"
            :class="['flex', message.senderId === user?.id ? 'justify-end' : 'justify-start']"
            @contextmenu.prevent="showContextMenu($event, message)">
            <div class="flex items-start max-w-[80%] space-x-2">
              <div v-if="message.senderId !== user?.id" class="w-8 h-8 rounded-full bg-gray-700 flex-shrink-0">
                <img v-if="message.attachmentUrl" :src="getImageUrl(message?.sender?.img)"
                  class="w-full h-full rounded-full object-cover" alt="Sender avatar" />
              </div>
              <div class="flex flex-col space-y-1">
                <div v-if="message.senderId !== user?.id" class="flex items-center space-x-1">
                  <span class="font-semibold text-teal-300 text-sm">{{ message?.sender?.name }} {{ message?.sender?.surname }}</span>
                </div>
                <div :class="[
                  'message-bubble px-3 py-2 max-w-md transition-all duration-200 shadow-md',
                  message.senderId === user?.id
                    ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-tr-none'
                    : 'bg-gradient-to-r from-gray-700 to-gray-600 text-white rounded-tl-none'
                ]">
                  <div v-if="message.replyToMessageId" @click="scrollToRepliedMessage(message.replyToMessageId)"
                    class="border-l-4 border-teal-400/50 rounded-tr-sm rounded-tl-md rounded-bl-md rounded-br-sm p-2 bg-black/30 cursor-pointer hover:bg-black/40 transition">
                    <p v-if="replyMessages[message.replyToMessageId]?.content" class="text-xs text-gray-200">
                      {{ replyMessages[message.replyToMessageId].content }}
                    </p>
                    <img v-else-if="isImage(replyMessages[message.replyToMessageId]?.attachmentUrl)"
                      :src="getMessageImageUrl(replyMessages[message.replyToMessageId]?.attachmentUrl)"
                      class="w-16 h-16 rounded-md object-cover" alt="Replied image" />
                    <video v-else-if="isVideo(replyMessages[message.replyToMessageId]?.attachmentUrl)"
                      :src="getMessageImageUrl(replyMessages[message.replyToMessageId]?.attachmentUrl)"
                      class="w-16 h-16 rounded-md" controls></video>
                    <div v-else-if="isAudio(replyMessages[message.replyToMessageId]?.attachmentUrl)"
                      class="audio-preview flex items-center space-x-2 bg-black/20 p-2 rounded-md">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#38b2ac" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <path d="M9 18V5l12-2v13"></path>
                        <circle cx="6" cy="18" r="3"></circle>
                        <circle cx="18" cy="16" r="3"></circle>
                      </svg>
                      <span class="text-xs text-teal-300">Audio message</span>
                    </div>
                    <a v-else-if="isPDF(replyMessages[message.replyToMessageId]?.attachmentUrl)"
                      :href="getMessageImageUrl(replyMessages[message.replyToMessageId]?.attachmentUrl)" target="_blank"
                      class="text-xs text-red-400 underline">PDF</a>
                    <a v-else-if="isWord(replyMessages[message.replyToMessageId]?.attachmentUrl)"
                      :href="getMessageImageUrl(replyMessages[message.replyToMessageId]?.attachmentUrl)" target="_blank"
                      class="text-xs text-gray-400 underline">Word</a>
                    <div v-else-if="replyMessages[message.replyToMessageId]?.attachmentUrl"
                      class="text-xs text-gray-300">File</div>
                    <img v-else-if="replyMessages[message.replyToMessageId]?.smileyPath"
                      :src="getSmileyUrl(replyMessages[message.replyToMessageId]?.smileyPath)"
                      class="w-16 h-16 p-1 rounded-md" alt="Replied smiley" />
                    <p v-else class="text-xs text-gray-500">Unknown</p>
                  </div>
                  <div class="px-1 text-sm">{{ message.content }}</div>
                  <img v-if="message.smileyPath" :src="getSmileyUrl(message.smileyPath)"
                    class="w-24 h-auto rounded-md mt-1" alt="Message smiley" />
                  <div v-if="message.attachmentUrl" class="border border-teal-500/30 p-1 rounded-md mt-1">
                    <img v-if="isImage(message.attachmentUrl)" :src="getMessageImageUrl(message.attachmentUrl)"
                      class="w-24 h-auto rounded-md hover:scale-105 transition-transform" alt="Attached image" />
                    <video v-else-if="isVideo(message.attachmentUrl)" :src="getMessageImageUrl(message.attachmentUrl)"
                      class="w-24 h-auto rounded-md" controls></video>

                    <!-- Enhanced Audio Player -->
                    <!-- Enhanced Audio Player -->
                    <div v-else-if="isAudio(message.attachmentUrl)"
                      class="audio-player rounded-lg overflow-hidden bg-gray-900/60 border border-teal-500/30 hover:border-teal-400/50 transition-all p-3">
                      <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center space-x-2">
                          <div v-on:click="toggleAudioPlayback"
                            class="h-8 w-8 rounded-full bg-teal-600 flex items-center justify-center audio-play-btn">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"
                              stroke-linecap="round" stroke-linejoin="round" class="play-icon">
                              <polygon points="5 3 19 12 5 21 5 3"></polygon>
                            </svg>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"
                              stroke-linecap="round" stroke-linejoin="round" class="pause-icon hidden">
                              <rect x="6" y="4" width="4" height="16"></rect>
                              <rect x="14" y="4" width="4" height="16"></rect>
                            </svg>
                          </div>
                          <div>
                            <div class="text-xs font-medium text-teal-300">Voice message</div>
                            <div class="text-xs text-gray-400 audio-time">00:00</div>
                          </div>
                        </div>
                        <div class="text-teal-400">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                            <path
                              d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z">
                            </path>
                          </svg>
                        </div>
                      </div>

                      <div class="relative h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          class="absolute left-0 top-0 h-full bg-gradient-to-r from-teal-500 to-teal-300 rounded-full audio-progress"
                          style="width: 0%"></div>
                      </div>

                      <audio :src="getMessageImageUrl(message.attachmentUrl)" class="hidden audio-element"
                        @timeupdate="updateAudioProgress" @loadedmetadata="initAudioPlayer" @ended="audioEnded"></audio>
                    </div>

                    <a v-else-if="isPDF(message.attachmentUrl)" :href="getMessageImageUrl(message.attachmentUrl)"
                      target="_blank" class="text-red-400 underline flex items-center gap-1">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f87171" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round" class="file-icon">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <text x="8" y="16" font-size="8" fill="#f87171">PDF</text>
                      </svg>
                      PDF
                    </a>
                    <a v-else-if="isWord(message.attachmentUrl)" :href="getMessageImageUrl(message.attachmentUrl)"
                      target="_blank" class="text-white underline flex items-center gap-1">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round" class="file-icon">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <text x="8" y="16" font-size="8" fill="#60a5fa">W</text>
                      </svg>
                      Word Document
                    </a>
                    <a v-else :href="getMessageImageUrl(message.attachmentUrl)" target="_blank"
                      class="text-gray-300 flex items-center gap-1">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round" class="file-icon">
                        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                        <polyline points="13 2 13 9 20 9"></polyline>
                      </svg>
                      File
                    </a>
                  </div>
                </div>
                <div class="text-xs text-gray-400 flex items-center space-x-2">
                  <button @click="handleReply(message)" class="text-teal-400 hover:text-teal-300 font-medium">
                    Reply
                  </button>
                  <span>{{ formatDate(message.createdAt) }}</span>
                  <span v-if="message.updated" class="text-gray-500">(Edited)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button v-if="showScrollButton" @click="scrollToBottom"
          class="fixed bottom-[160px] bg-teal-500 text-white p-2 rounded-full shadow-lg hover:bg-teal-600 transition animate-pulse">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>

        <div
          class="fixed bottom-4 w-[calc(100%-500px)] bg-gray-800/90 shadow-xl px-3 py-4 flex flex-col rounded-full border border-teal-500/50 backdrop-blur-sm">
          <div v-if="replyTo" class="w-full bg-gray-700/50 p-2 rounded-md mb-2 flex justify-between items-center">
            <div class="flex items-center space-x-1">
              <span class="text-teal-400 font-semibold text-xs">Replying to:</span>
              <div class="text-gray-300 text-xs">
                {{
                replyMessages[replyTo]?.content?.substring(0, 40) +
                (replyMessages[replyTo]?.content?.length > 40 ? '...' : '') ||
                replyMessages[replyTo]?.attachmentUrl
                ? 'File'
                : replyMessages[replyTo]?.smileyPath
                ? 'Smiley'
                : 'Unknown'
                }}
              </div>
            </div>
            <button @click="cancelReply" class="text-red-400 hover:text-red-500 text-sm">✖</button>
          </div>

          <div v-if="recording" class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="w-3 h-3 bg-red-500 rounded-full mr-1 animate-pulse"></div>
              <span class="text-gray-300 text-xs font-mono">00:{{ formattedRecordingTime }}</span>
            </div>
            <button @click="cancelRecording"
              class="text-red-400 border border-red-400 px-2 py-1 rounded-md text-xs font-semibold hover:bg-red-400 hover:text-gray-900 transition">
              Cancel
            </button>
            <button @click="stopRecording" class="p-1 rounded-full bg-teal-500 hover:bg-teal-600 transition">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 2L11 13"></path>
                <path d="M22 2L15 22L11 13L2 9L22 2Z"></path>
              </svg>
            </button>
          </div>
          <div v-else class="flex items-center w-full space-x-2">
            <button @click="openEmojiPicker" class="text-xl hover:bg-gray-700 p-1 rounded-full transition">😊</button>
            <label class="cursor-pointer p-1 hover:bg-gray-700 rounded-full transition">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#38b2ac" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round">
                <path
                  d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48">
                </path>
              </svg>
              <input type="file" @change="handleFileUpload" class="hidden" />
            </label>
            <input v-model="newMessage" placeholder="Type a message..."
              class="flex-1 border border-gray-600 bg-gray-700 text-gray-200 rounded-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
            <button @click="debouncedSendMessage('text')"
              class="p-1 rounded-full bg-teal-500 hover:bg-teal-600 transition">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 2L11 13"></path>
                <path d="M22 2L15 22L11 13L2 9L22 2Z"></path>
              </svg>
            </button>
            <button @click="recording ? stopRecording() : startRecording()"
              :class="{ 'animate-bounce bg-teal-500': isClicked, 'bg-gray-600': !isClicked }"
              class="p-1 rounded-full hover:bg-teal-600 transition">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#ffffff" stroke="none">
                <path d="M12 1a3 3 0 0 1 3 3v8a3 3 0 0 1-6 0V4a3 3 0 0 1 3-3z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div class="bg-gray-800/90 p-5 rounded-xl shadow-2xl w-72 backdrop-blur-md border border-teal-500/50">
        <h2 class="text-base text-teal-300 font-bold mb-3">Edit Message</h2>
        <input v-model="editedContent"
          class="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-2 py-2 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
        <div class="flex justify-end space-x-2">
          <button @click="updateMessage"
            class="bg-teal-500 text-white w-full px-3 py-2 rounded hover:bg-teal-600 transition text-sm">
            Update
          </button>
          <button @click="showModal = false"
            class="bg-red-500 text-white px-3 py-2 w-full rounded hover:bg-red-600 transition text-sm">
            Cancel
          </button>
        </div>
      </div>
    </div>

    <div v-if="showDeleteConfirm" class="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div class="bg-gray-800/90 p-5 rounded-xl shadow-2xl w-72 backdrop-blur-md border border-teal-500/50">
        <h2 class="text-base text-teal-300 font-bold mb-3">Delete Message</h2>
        <p class="text-gray-300 text-sm mb-3">Are you sure you want to delete this message?</p>
        <div class="flex justify-end space-x-2">
          <button @click="confirmDelete"
            class="bg-red-500 text-white w-full px-3 py-2 rounded hover:bg-red-600 transition text-sm">
            Delete
          </button>
          <button @click="showDeleteConfirm = false"
            class="bg-gray-600 text-white px-3 py-2 w-full rounded hover:bg-gray-700 transition text-sm">
            Cancel
          </button>
        </div>
      </div>
    </div>

    <div v-if="showContextMenuModal"
      class="fixed bg-gray-800/90 border border-teal-500/50 rounded-lg shadow-2xl p-3 z-50 context-menu backdrop-blur-md"
      :style="{ top: contextMenuY + 'px', left: contextMenuX + 'px' }">
      <button v-if="contextMenuMessage?.senderId === user?.id" @click="startEditing(contextMenuMessage)"
        class="block w-full text-left px-2 py-1 text-teal-300 hover:bg-gray-700 rounded text-sm">
        Edit
      </button>
      <button v-if="contextMenuMessage?.senderId === user?.id" @click="confirmDeleteMessage(contextMenuMessage.id)"
        class="block w-full text-left px-2 py-1 text-red-400 hover:bg-gray-700 rounded text-sm">
        Delete
      </button>
      <button @click="handleReply(contextMenuMessage)"
        class="block w-full text-left px-2 py-1 text-teal-300 hover:bg-gray-700 rounded text-sm">
        Reply
      </button>
      <button @click="closeContextMenu"
        class="block w-full text-left px-2 py-1 text-gray-300 hover:bg-gray-700 rounded text-sm">
        Cancel
      </button>
    </div>

    <div v-if="showEmojiPicker"
      class="fixed bottom-[160px] w-[calc(100%-500px)] bg-gray-800/90 shadow-2xl rounded-xl z-50 p-4 grid grid-cols-8 gap-2 max-h-64 overflow-y-auto scrollbar-custom border border-teal-500/50 backdrop-blur-md">
      <button v-for="item in smileys" :key="item.id" @click="debouncedSendMessage('smiley', item.id)"
        class="block rounded-md hover:scale-110 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
        :title="`Smiley ${item.id}`">
        <img :src="getSmileyUrl(item.filePath)" class="w-12 h-12 rounded-md object-contain"
          :alt="`Smiley ${item.id}`" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue';
import { io } from 'socket.io-client';
import { debounce } from 'lodash';
import { URL } from '@/auth/url';
import axios from 'axios';

// User data from localStorage
const user = ref({
  id: parseInt(localStorage.getItem('id')) || null,
  username: localStorage.getItem('username') || 'TestUser',
});

// Reactive state
const socket = ref(null);
const messages = ref([]);
const newMessage = ref('');
const editingMessage = ref(null);
const editedContent = ref('');
const showModal = ref(false);
const replyTo = ref(null);
const selectedFile = ref(null);
const recording = ref(false);
const mediaRecorder = ref(null);
const audioChunks = ref([]);
const admins = ref([]);
const smileys = ref([]);
const replyMessages = ref({});
const messageRefs = ref({});
const showDeleteConfirm = ref(false);
const messageToDelete = ref(null);
const showScrollButton = ref(false);
const showContextMenuModal = ref(false);
const contextMenuX = ref(0);
const contextMenuY = ref(0);
const contextMenuMessage = ref(null);
const unreadCount = ref(0);
const userStatus = ref({});
const showEmojiPicker = ref(false);
const isClicked = ref(false);
const recordingTime = ref(0);
const recordingInterval = ref(null);
const messagesContainer = ref(null);
const isSocketConnected = ref(false);

// Computed property for recording time
const formattedRecordingTime = computed(() => {
  const minutes = Math.floor(recordingTime.value / 60);
  const seconds = recordingTime.value % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
});

// Helper functions
const open = (link) => window.open(link);
const getImageUrl = (img) => (img ? `${URL}/upload/${img}` : '/default-avatar.png');
const getMessageImageUrl = (url) => (url ? `${URL}${url}` : '');
const getSmileyUrl = (path) => (path ? `${URL}/${path}` : '');
const isImage = (url) => url && /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(url);
const isVideo = (url) => url && /\.(mp4|webm|ogg|mov|avi|mkv)$/i.test(url);
const isAudio = (url) => url && /\.(mp3|mpeg|wav|ogg|aac|flac)$/i.test(url);
const isPDF = (url) => url && /\.pdf$/i.test(url);
const isWord = (url) => url && /\.(doc|docx)$/i.test(url);

const formatDate = (date) => {
  return new Date(date).toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    month: 'short',
    day: 'numeric',
  });
};

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

const openEmojiPicker = () => {
  showEmojiPicker.value = !showEmojiPicker.value;
};

const cancelReply = () => {
  replyTo.value = null;
};

const closeContextMenu = () => {
  showContextMenuModal.value = false;
  contextMenuMessage.value = null;
};

// Audio Player Methods
const audioPlayerMethods = {
  initAudioPlayer(event) {
    const audio = event.target;
    const container = audio.closest('.audio-player');
    if (!container) return;

    const timeDisplay = container.querySelector('.audio-time');

    const updateTimeDisplay = () => {
      if (timeDisplay) {
        if (!isNaN(audio.duration) && isFinite(audio.duration)) {
          const durationMinutes = Math.floor(audio.duration / 60);
          const durationSeconds = Math.floor(audio.duration % 60);
          timeDisplay.textContent = `0:00 / ${durationMinutes}:${durationSeconds.toString().padStart(2, '0')}`;
        } else {
          timeDisplay.textContent = '0:00 / --:--';
          setTimeout(() => {
            if (!isNaN(audio.duration) && isFinite(audio.duration)) {
              const durationMinutes = Math.floor(audio.duration / 60);
              const durationSeconds = Math.floor(audio.duration % 60);
              timeDisplay.textContent = `0:00 / ${durationMinutes}:${durationSeconds.toString().padStart(2, '0')}`;
            }
          }, 1000);
        }
      }
    };

    if (audio.readyState >= 2) {
      updateTimeDisplay();
    } else {
      audio.addEventListener('loadedmetadata', updateTimeDisplay, { once: true });
    }
  },

  updateAudioProgress(event) {
    const audio = event.target;
    const container = audio.closest('.audio-player');
    if (!container) return;

    const progressBar = container.querySelector('.audio-progress');
    const timeDisplay = container.querySelector('.audio-time');

    if (!isNaN(audio.duration) && isFinite(audio.duration)) {
      if (progressBar) {
        const percentage = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = `${percentage}%`;
      }

      if (timeDisplay) {
        const currentMinutes = Math.floor(audio.currentTime / 60);
        const currentSeconds = Math.floor(audio.currentTime % 60);
        const durationMinutes = Math.floor(audio.duration / 60);
        const durationSeconds = Math.floor(audio.duration % 60);
        timeDisplay.textContent = `${currentMinutes}:${currentSeconds.toString().padStart(2, '0')} / ${durationMinutes}:${durationSeconds.toString().padStart(2, '0')}`;
      }
    } else {
      if (progressBar) {
        progressBar.style.width = '0%';
      }
      if (timeDisplay) {
        timeDisplay.textContent = '0:00 / --:--';
      }
    }
  },

  audioEnded(event) {
    const audio = event.target;
    const container = audio.closest('.audio-player');
    if (!container) return;

    const playIcon = container.querySelector('.play-icon');
    const pauseIcon = container.querySelector('.pause-icon');
    const progressBar = container.querySelector('.audio-progress');
    const timeDisplay = container.querySelector('.audio-time');

    if (playIcon && pauseIcon) {
      playIcon.classList.remove('hidden');
      pauseIcon.classList.add('hidden');
    }

    if (progressBar) {
      progressBar.style.width = '0%';
    }

    if (timeDisplay) {
      if (!isNaN(audio.duration) && isFinite(audio.duration)) {
        const durationMinutes = Math.floor(audio.duration / 60);
        const durationSeconds = Math.floor(audio.duration % 60);
        timeDisplay.textContent = `0:00 / ${durationMinutes}:${durationSeconds.toString().padStart(2, '0')}`;
      } else {
        timeDisplay.textContent = '0:00 / --:--';
      }
    }

    audio.currentTime = 0;
  },

  toggleAudioPlayback(event) {
    const button = event.currentTarget;
    const container = button.closest('.audio-player');
    if (!container) return;

    const audio = container.querySelector('.audio-element');
    const playIcon = container.querySelector('.play-icon');
    const pauseIcon = container.querySelector('.pause-icon');

    if (!audio || !playIcon || !pauseIcon) {
      console.error('Audio player elements not found');
      return;
    }

    if (audio.paused) {
      audio.play().catch((error) => {
        console.error('Error playing audio:', error);
        alert('Audio playback failed: ' + error.message);
      });
      playIcon.classList.add('hidden');
      pauseIcon.classList.remove('hidden');
    } else {
      audio.pause();
      playIcon.classList.remove('hidden');
      pauseIcon.classList.add('hidden');
    }
  },
};

// Initialize audio players
const setupNewAudioPlayers = () => {
  nextTick(() => {
    const newAudios = document.querySelectorAll('.audio-player audio:not([data-initialized])');
    newAudios.forEach((audio) => {
      audio.setAttribute('data-initialized', 'true');
      audio.addEventListener('loadedmetadata', audioPlayerMethods.initAudioPlayer);
      audio.addEventListener('timeupdate', audioPlayerMethods.updateAudioProgress);
      audio.addEventListener('ended', audioPlayerMethods.audioEnded);
      const container = audio.closest('.audio-player');
      if (container) {
        const playButton = container.querySelector('.audio-play-btn');
        if (playButton) {
          const newButton = playButton.cloneNode(true);
          playButton.parentNode.replaceChild(newButton, playButton);
          newButton.addEventListener('click', audioPlayerMethods.toggleAudioPlayback);
        }
      }
      audio.load();
    });
  });
};

// Initialize WebSocket connection
const initializeSocket = () => {
  if (!user.value.id) {
    console.error('No user ID found in localStorage');
    alert('Please log in to access the chat');
    return;
  }

  if (!URL || typeof URL !== 'string') {
    console.error('Invalid or undefined URL:', URL);
    alert('Cannot connect to server: Invalid URL configuration');
    return;
  }

  if (socket.value) {
    socket.value.disconnect();
    socket.value.off();
  }

  console.log('Initializing Socket.IO with URL:', URL);

  socket.value = io(URL, {
    path: '/socket.io',
    transports: ['websocket', 'polling'],
    auth: { userId: user.value.id },
  });

  socket.value.on('connect', () => {
    console.log('Socket connected');
    isSocketConnected.value = true;
    socket.value.emit('join', user.value.id); // Ensure join after connect
  });

  socket.value.on('disconnect', () => {
    console.log('Socket disconnected');
    isSocketConnected.value = false;
  });

  socket.value.on('error', (error) => {
    console.error('Socket error:', error);
    alert(error || 'An error occurred with the WebSocket connection');
    isSocketConnected.value = false;
  });

  socket.value.on('newMessage', (message) => {
    console.log('Received new message:', message);
    // Prevent duplicates by checking message ID
    if (!messages.value.some((msg) => msg.id === message.id)) {
      messages.value.push(message);
      if (message.replyToMessageId) {
        getOneMessage(message.replyToMessageId);
      }
      scrollToBottom();
      nextTick(() => setupNewAudioPlayers());
      if (message.senderId !== user.value.id) {
        unreadCount.value++;
      }
    }
  });

  socket.value.on('messageUpdated', (updatedMessage) => {
    console.log('Received updated message:', updatedMessage);
    const index = messages.value.findIndex((m) => m.id === updatedMessage.id);
    if (index !== -1) {
      messages.value[index] = updatedMessage;
    }
    scrollToBottom();
  });

  socket.value.on('messageDeleted', ({ messageId }) => {
    console.log('Received deleted message ID:', messageId);
    messages.value = messages.value.filter((m) => m.id !== messageId);
    scrollToBottom();
  });

  socket.value.on('messagesRead', ({ userId }) => {
    if (userId === user.value.id) {
      unreadCount.value = 0;
    }
  });

  socket.value.on('userStatus', ({ userId, status }) => {
    userStatus.value[userId] = status;
  });

  socket.value.on('unreadCount', ({ count }) => {
    unreadCount.value = count;
  });
};

// Fallback polling for messages (in case socket fails)
const pollMessages = async () => {
  try {
    const response = await axios.get(`${URL}/messages`);
    const newMessages = response.data.filter(
      (msg) => !messages.value.some((m) => m.id === msg.id)
    );
    if (newMessages.length > 0) {
      messages.value.push(...newMessages);
      newMessages.forEach((msg) => {
        if (msg.replyToMessageId) {
          getOneMessage(msg.replyToMessageId);
        }
      });
      scrollToBottom();
      nextTick(() => setupNewAudioPlayers());
    }
  } catch (error) {
    console.error('Error polling messages:', error.message);
  }
};

// API functions
const fetchMessages = async () => {
  try {
    const response = await axios.get(`${URL}/messages`);
    console.log('Fetched messages:', response.data);
    messages.value = response.data; // Replace to ensure fresh state
    messages.value.forEach((msg) => {
      if (msg.replyToMessageId) {
        getOneMessage(msg.replyToMessageId);
      }
    });
    scrollToBottom();
    socket.value?.emit('markAsRead', user.value.id);
    nextTick(() => setupNewAudioPlayers());
  } catch (error) {
    console.error('Error fetching messages:', error.message, error.response?.data);
    alert('Failed to load messages');
  }
};

const fetchSmileys = async () => {
  try {
    const response = await axios.get(`${URL}/smileys`);
    smileys.value = response.data;
    console.log('Fetched smileys:', smileys.value);
  } catch (error) {
    console.error('Failed to fetch smileys:', error);
  }
};

const fetchAdmins = async () => {
  try {
    const response = await axios.get(`${URL}/admins`);
    admins.value = response.data;
    console.log('Fetched admins:', admins.value);
  } catch (error) {
    console.error('Failed to fetch admins:', error);
  }
};

const getOneMessage = async (id) => {
  if (!replyMessages.value[id]) {
    try {
      const response = await axios.get(`${URL}/messages/${id}`);
      replyMessages.value[id] = {
        content: response.data.content || null,
        smileyPath: response.data.smiley?.filePath || null,
        attachmentUrl: response.data.attachmentUrl || null,
        fileType: response.data.fileType || null,
      };
      console.log(`Fetched reply message ${id}:`, replyMessages.value[id]);
    } catch (error) {
      console.error(`Failed to fetch reply message ${id}:`, error);
    }
  }
};

// Send message function
const sendMessage = async (type, smileyId = null) => {
  if (type === 'text' && !newMessage.value.trim() && !selectedFile.value && !smileyId) return;

  const messageData = {
    senderId: user.value.id,
    content: type === 'text' ? newMessage.value.trim() : null,
    replyToMessageId: replyTo.value || null,
    file: type === 'file' || type === 'audio' ? selectedFile.value : null,
    smileyId: type === 'smiley' ? smileyId : null,
  };

  try {
    if (!messageData.file) {
      // For non-file messages (text or smiley), use Socket.IO
      socket.value.emit('sendMessage', messageData, (response) => {
        if (!response || !response.success) {
          console.error('Error sending message:', response?.error || 'Unknown error');
          alert(response?.error || 'Failed to send message');
        }
      });
    } else {
      // For file messages, use HTTP POST request
      const formData = new FormData();
      formData.append('file', messageData.file);
      formData.append('senderId', messageData.senderId);
      if (messageData.content) formData.append('content', messageData.content);
      if (messageData.smileyId) formData.append('smileyId', messageData.smileyId);
      if (messageData.replyToMessageId) formData.append('replyToMessageId', messageData.replyToMessageId);

      const response = await axios.post(`${URL}/messages`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Immediately add the sent file message to the UI
      if (!messages.value.some((msg) => msg.id === response.data.id)) {
        messages.value.push(response.data);
        if (response.data.replyToMessageId) {
          getOneMessage(response.data.replyToMessageId);
        }
        scrollToBottom();
        nextTick(() => setupNewAudioPlayers());
      }
    }

    // Reset UI state
    newMessage.value = '';
    replyTo.value = null;
    selectedFile.value = null;
    showEmojiPicker.value = false;
    scrollToBottom();
  } catch (error) {
    console.error('Error sending message:', error.message);
    alert('Failed to send message');
  }
};

// Debounced sendMessage
const debouncedSendMessage = debounce((type, smileyId = null) => {
  sendMessage(type, smileyId);
}, 300);

const startEditing = (message) => {
  editingMessage.value = message;
  editedContent.value = message.content || '';
  showModal.value = true;
  showContextMenuModal.value = false;
};

const updateMessage = async () => {
  if (!editedContent.value.trim() || !editingMessage.value) return;

  const updateData = {
    messageId: editingMessage.value.id,
    content: editedContent.value,
    userId: user.value.id,
  };

  console.log('Updating message:', updateData);
  socket.value.emit('updateMessage', updateData, (response) => {
    if (!response || !response.success) {
      console.error('Error updating message:', response?.error || 'Unknown error');
      alert(response?.error || 'Failed to update message');
    }
  });

  editingMessage.value = null;
  editedContent.value = '';
  showModal.value = false;
};

const confirmDeleteMessage = (messageId) => {
  messageToDelete.value = messageId;
  showDeleteConfirm.value = true;
  showContextMenuModal.value = false;
};

const confirmDelete = async () => {
  if (!messageToDelete.value) return;
  console.log('Deleting message ID:', messageToDelete.value);
  socket.value.emit('deleteMessage', { messageId: messageToDelete.value, userId: user.value.id }, (response) => {
    if (!response || !response.success) {
      console.error('Error deleting message:', response?.error || 'Unknown error');
      alert(response?.error || 'Failed to delete message');
    }
  });
  showDeleteConfirm.value = false;
  messageToDelete.value = null;
};

const handleReply = (message) => {
  replyTo.value = message.id;
  getOneMessage(message.id);
  showContextMenuModal.value = false;
};

const scrollToRepliedMessage = async (replyToMessageId) => {
  if (!messageRefs.value[replyToMessageId]) await getOneMessage(replyToMessageId);
  await nextTick();
  messageRefs.value[replyToMessageId]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const validTypes = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'audio/mpeg', 'video/mp4', 'video/webm', 'video/ogg',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  if (!validTypes.includes(file.type)) {
    alert('Unsupported file type');
    return;
  }

  if (file.size > 10 * 1024 * 1024) {
    alert('File size exceeds 10MB limit');
    return;
  }

  selectedFile.value = file;
  debouncedSendMessage(file.type.startsWith('audio') ? 'audio' : 'file');
};

const startRecording = async () => {
  if (recording.value) {
    console.log('Recording already in progress');
    return;
  }

  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const audioDevices = devices.filter((device) => device.kind === 'audioinput');
    if (audioDevices.length === 0) {
      console.error('No audio input devices found');
      alert('Mikrofon topilmadi. Iltimos, mikrofon ulanganligini yoki yoqilganligini tekshiring.');
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.value = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
    audioChunks.value = [];

    mediaRecorder.value.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.value.push(event.data);
        console.log('Audio chunk recorded:', event.data.size);
      }
    };

    mediaRecorder.value.onstop = async () => {
      console.log('Recording stopped, chunks:', audioChunks.value.length);
      if (audioChunks.value.length > 0) {
        const audioBlob = new Blob(audioChunks.value, { type: 'audio/mpeg' });
        console.log('Audio Blob:', { size: audioBlob.size, type: audioBlob.type });
        selectedFile.value = new File([audioBlob], `audio-${Date.now()}.mp3`, { type: 'audio/mpeg' });
        await debouncedSendMessage('audio');
      }
      recording.value = false;
      isClicked.value = false;
      stream.getTracks().forEach((track) => track.stop());
      clearInterval(recordingInterval.value);
      audioChunks.value = [];
    };

    recording.value = true;
    isClicked.value = true;
    recordingTime.value = 0;
    recordingInterval.value = setInterval(() => recordingTime.value++, 1000);
    mediaRecorder.value.start();
    console.log('Recording started');
  } catch (error) {
    console.error('Failed to start recording:', error.name, error.message);
    let errorMessage = 'Ovoz yozib olishda xato: ' + error.message;
    if (error.name === 'NotFoundError') {
      errorMessage = 'Mikrofon topilmadi. Iltimos, mikrofon ulanganligini yoki yoqilganligini tekshiring.';
    } else if (error.name === 'NotAllowedError') {
      errorMessage = 'Mikrofon ruxsati rad etildi. Iltimos, brauzer sozlamalarida mikrofon ruxsatini yoqing.';
    } else if (error.name === 'SecurityError') {
      errorMessage = 'Xavfsiz kontekst talab qilinadi. Iltimos, HTTPS yoki localhost orqali foydalaning.';
    }
    alert(errorMessage);
    recording.value = false;
    isClicked.value = false;
  }
};

const stopRecording = () => {
  if (!recording.value || !mediaRecorder.value) {
    console.log('No active recording to stop');
    return;
  }

  mediaRecorder.value.stop();
  console.log('Recording stop requested');
};

const cancelRecording = () => {
  if (!recording.value || !mediaRecorder.value) {
    console.log('No active recording to cancel');
    return;
  }

  mediaRecorder.value.stop();
  audioChunks.value = [];
  recording.value = false;
  isClicked.value = false;
  clearInterval(recordingInterval.value);
  mediaRecorder.value.stream.getTracks().forEach((track) => track.stop());
  console.log('Recording cancelled');
};

const showContextMenu = (event, message) => {
  contextMenuMessage.value = message;
  contextMenuX.value = event.clientX;
  contextMenuY.value = event.clientY;
  showContextMenuModal.value = true;
};

// Lifecycle hooks
let pollingInterval = null;
onMounted(() => {
  console.log('Component mounted, initializing socket');
  initializeSocket();
  fetchMessages();
  fetchAdmins();
  fetchSmileys();
  window.addEventListener('scroll', () => {
    if (messagesContainer.value) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainer.value;
      showScrollButton.value = scrollTop + clientHeight < scrollHeight - 50;
    }
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.context-menu')) closeContextMenu();
  });
  setupNewAudioPlayers();
  // Start polling as a fallback (every 30 seconds)
  pollingInterval = setInterval(pollMessages, 30000);
});

onUnmounted(() => {
  console.log('Component unmounted, cleaning up');
  if (socket.value) {
    socket.value.disconnect();
    socket.value.off();
  }
  clearInterval(recordingInterval.value);
  clearInterval(pollingInterval);
  mediaRecorder.value?.stream?.getTracks().forEach((track) => track.stop());
  window.removeEventListener('scroll', () => {});
  document.removeEventListener('click', () => {});
});
</script>
<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');

#img {
  background: linear-gradient(135deg, rgba(26, 32, 44, 0.9), rgba(45, 55, 72, 0.9)),
    url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><circle cx="10" cy="10" r="2" fill="rgba(56, 178, 172, 0.2)"/><circle cx="30" cy="30" r="2" fill="rgba(56, 178, 172, 0.2)"/></svg>') repeat;
  min-height: 100vh;
}

.scrollbar-custom {
  scrollbar-width: thin;
  scrollbar-color: #38b2ac #1a202c;
}

.scrollbar-custom::-webkit-scrollbar {
  width: 6px;
}

.scrollbar-custom::-webkit-scrollbar-track {
  background: #1a202c;
  border-radius: 3px;
}

.scrollbar-custom::-webkit-scrollbar-thumb {
  background: #38b2ac;
  border-radius: 3px;
}

.scrollbar-custom::-webkit-scrollbar-thumb:hover {
  background: #2c7a7b;
}

.context-menu {
  min-width: 140px;
  border-radius: 8px;
  background: rgba(26, 32, 44, 0.9);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
}

body {
  font-family: 'Poppins', sans-serif;
}

input,
button {
  transition: all 0.3s ease;
}

button:hover {
  transform: translateY(-2px);
}

.message-bubble {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.message-bubble:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.message-bubble img,
.message-bubble video,
.message-bubble audio {
  border-radius: 6px;
  max-width: 160px;
}

audio {
  width: 100%;
  max-width: 160px;
  border-radius: 6px;
  background: #2d3748;
  padding: 3px;
}

audio::-webkit-media-controls-panel {
  background: #2d3748;
  border-radius: 6px;
}

audio::-webkit-media-controls-play-button,
audio::-webkit-media-controls-current-time-display,
audio::-webkit-media-controls-time-remaining-display {
  color: #e2e8f0;
}

.file-icon {
  transition: transform 0.3s ease;
}

.file-icon:hover {
  transform: scale(1.15);
}

svg {
  display: inline-block;
  vertical-align: middle;
}

@media (max-width: 1024px) {
  .min-w-full {
    width: 100%;
    top: 0;
    height: 100vh;
    border: none;
    border-radius: 0;
  }

  .fixed.bottom-4 {
    width: calc(100% - 32px);
  }

  .grid-cols-8 {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
}
.audio-player {
  transition: all 0.3s ease;
}

.audio-player:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
}

.audio-play-btn {
  cursor: pointer;
  transition: all 0.2s ease;
}

.audio-play-btn:hover {
  transform: scale(1.1);
  background-color: #2dd4bf;
}

.audio-progress {
  transition: width 0.1s linear;
}

/* Custom scrollbar for the message container */
.scrollbar-custom::-webkit-scrollbar {
  width: 6px;
}

.scrollbar-custom::-webkit-scrollbar-track {
  background: rgba(75, 85, 99, 0.1);
  border-radius: 10px;
}

.scrollbar-custom::-webkit-scrollbar-thumb {
  background: rgba(45, 212, 191, 0.5);
  border-radius: 10px;
}

.scrollbar-custom::-webkit-scrollbar-thumb:hover {
  background: rgba(45, 212, 191, 0.7);
}
@media (max-width: 640px) {
  .grid-cols-8 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .w-12.h-12 {
    width: 40px;
    height: 40px;
  }

  .message-bubble {
    padding: 8px;
    font-size: 0.875rem;
  }

  .message-bubble img,
  .message-bubble video,
  .message-bubble audio {
    max-width: 120px;
  }

  svg {
    width: 20px;
    height: 20px;
  }
}
</style>