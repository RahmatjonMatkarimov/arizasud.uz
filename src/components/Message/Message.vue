<template>
  <div id="asda" class="w-[calc(100%-460px)] top-[200px] h-[calc(100vh-200px)] fixed border-4 rounded-xl border-[#ffcc00]">
    <div id="img" class="relative flex justify-between h-full">
      <div class="w-full mr-[460px] flex flex-col items-center justify-center p-4">
        <div
          ref="messagesContainer"
          class="w-full mb-[420px] h-[calc(100%-120px)] overflow-y-auto p-4 space-y-4"
        >
          <div
            v-for="message in messages"
            :key="message.id"
            :ref="el => messageRefs[message.id] = el"
            :class="['flex', message.senderId === user?.id ? 'justify-end' : 'justify-start']"
            @contextmenu.prevent="showContextMenu($event, message)"
          >
            <div class="flex items-start max-w-[80%] space-x-2">
              <div
                v-if="message.senderId !== user?.id"
                class="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0"
              >
                <img
                  v-if="message.senderImage"
                  :src="getImageUrl(message.senderImage)"
                  class="w-full h-full rounded-full"
                />
              </div>
              <div class="flex flex-col space-y-1">
                <div
                  v-if="message.senderId !== user?.id && message.senderUsername"
                  class="flex items-center space-x-2"
                >
                  <span class="font-medium text-gray-900">{{ message.senderUsername }}</span>
                </div>
                <div
                  :class="[
                    'rounded-3xl px-3 py-3 max-w-sm',
                    message.senderId === user?.id
                      ? 'bg-blue-500 hover:bg-lime-500 border-2 rounded-br-none text-white'
                      : 'bg-gray-500 hover:bg-lime-500 border-2 rounded-bl-none text-white',
                  ]"
                >
                  <div
                    v-if="message.replyToMessageId"
                    @click="scrollToRepliedMessage(message.replyToMessageId)"
                    class="border-l-2 rounded-tr-md rounded-tl-sm rounded-bl-sm rounded-br-md p-2 bg-black bg-opacity-[25%] cursor-pointer"
                  >
                    <p v-if="replyMessages[message.replyToMessageId]?.content">
                      {{ replyMessages[message.replyToMessageId].content }}
                    </p>
                    <img
                      v-else-if="isImage(replyMessages[message.replyToMessageId]?.attachmentUrl)"
                      :src="getMessageImageUrl(replyMessages[message.replyToMessageId]?.attachmentUrl)"
                      class="w-24 h-24 rounded-md p-2"
                    />
                    <video
                      v-else-if="isVideo(replyMessages[message.replyToMessageId]?.attachmentUrl)"
                      :src="getMessageImageUrl(replyMessages[message.replyToMessageId]?.attachmentUrl)"
                      class="w-24 h-24 rounded-md p-2"
                      controls
                    ></video>
                    <div
                      v-else-if="replyMessages[message.replyToMessageId]?.attachmentUrl?.endsWith('.mp3')"
                    >
                      Audio
                    </div>
                    <div
                      v-else-if="replyMessages[message.replyToMessageId]?.attachmentUrl?.endsWith('.pdf')"
                      class="text-red-500 underline"
                    >
                      PDF
                    </div>
                    <div
                      v-else-if="replyMessages[message.replyToMessageId]?.attachmentUrl?.match(/\.(doc|docx)$/i)"
                      class="text-blue-500 underline"
                    >
                      Word
                    </div>
                    <div
                      v-else-if="replyMessages[message.replyToMessageId]?.attachmentUrl"
                    >
                      File
                    </div>
                    <img
                      v-else-if="replyMessages[message.replyToMessageId]?.smileyPath"
                      :src="getSmileyUrl(replyMessages[message.replyToMessageId]?.smileyPath)"
                      class="w-24 p-1 h-24"
                    />
                    <p v-else>Unknown</p>
                  </div>
                  <div class="px-2">{{ message.content }}</div>
                  <img
                    v-if="message.smileyPath"
                    :src="getSmileyUrl(message.smileyPath)"
                    class="w-40 h-auto rounded-lg"
                  />
                  <div v-if="message.attachmentUrl" class="border p-2 rounded-lg">
                    <img
                      v-if="isImage(message.attachmentUrl)"
                      :src="getMessageImageUrl(message.attachmentUrl)"
                      class="w-40 h-auto rounded-lg"
                    />
                    <video
                      v-else-if="isVideo(message.attachmentUrl)"
                      :src="getMessageImageUrl(message.attachmentUrl)"
                      class="w-40 h-auto rounded-lg"
                      controls
                    ></video>
                    <div
                      v-else
                      @click="open(getMessageImageUrl(message.attachmentUrl))"
                      class="hover:text-blue-500 text-[17px] flex items-center gap-3"
                    >
                      <img src="/file.png" width="40px" alt="" />File
                    </div>
                  </div>
                  <audio
                    v-if="message.fileType === 'audio'"
                    :src="getMessageImageUrl(message.attachmentUrl)"
                    controls
                  ></audio>
                </div>
                <div class="text-xs text-gray-500 flex space-x-2">
                  <button
                    @click="handleReply(message)"
                    class="text-green-500 font-bold mx-2"
                  >
                    Reply
                  </button>
                  {{ formatDate(message.createdAt) }}
                  <span v-if="message.updated">(Edited)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          v-if="showScrollButton"
          @click="scrollToBottom"
          class="fixed bottom-[170px] bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600"
        >
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>

        <div class="fixed bottom-4 w-[990px] bg-gray-300 shadow-md px-3 py-8 flex flex-col rounded-3xl">
          <div v-if="replyTo" class="w-full bg-gray-200 p-2 rounded-lg mb-2 flex justify-between items-center">
            <div class="flex items-center space-x-2">
              <span class="text-green-500 font-semibold">Reply:</span>
              <div class="text-black">
                {{
                  replyMessages[replyTo]?.content?.substring(0, 50) +
                  (replyMessages[replyTo]?.content?.length > 50 ? '...' : '') ||
                  replyMessages[replyTo]?.attachmentUrl
                    ? 'File'
                    : replyMessages[replyTo]?.smileyPath
                    ? 'Smiley'
                    : 'Unknown'
                }}
              </div>
            </div>
            <button @click="cancelReply" class="text-red-500 hover:text-red-700">✖</button>
          </div>

          <div v-if="recording" class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="w-5 h-5 bg-red-700 rounded-full mr-3 animate-pulse"></div>
              <span class="text-black text-lg font-mono">00:{{ formattedRecordingTime }}</span>
            </div>
            <button
              @click="stopRecording"
              class="text-red-600 rounded-xl border-4 px-2 font-semibold text-[20px] hover:text-red-700"
            >
              Cancel
            </button>
            <button
              @click="stopRecording"
              :class="{ 'animate-bounce bg-white': isClicked, 'bg-gray-300': !isClicked }"
              class="hover:bg-blue-500 p-2 rounded-full"
            >
              <img src="/arrow.png" width="50px" alt="send" />
            </button>
          </div>
          <div v-else class="flex items-center w-full">
            <h1 @click="openEmojiPicker" class="text-[35px]">🙂</h1>
            <label class="cursor-pointer text-[30px] p-2">
              <img src="/attach-file.png" width="40px" alt="attach" />
              <input type="file" @change="handleFileUpload" class="hidden" />
            </label>
            <input
              v-model="newMessage"
              placeholder="Type a message..."
              class="flex-1 border border-gray-300 rounded-full text-black px-4 py-4 mx-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              @keypress.enter="editingMessage ? updateMessage() : sendMessage('text')"
            />
            <button
              @click="editingMessage ? updateMessage() : sendMessage('text')"
              class="text-blue-500 text-[40px] ml-2"
            >
              ➤
            </button>
            <button
              @click="recording ? stopRecording() : startRecording()"
              :class="{ 'animate-bounce bg-blue-500': isClicked, 'bg-gray-300': !isClicked }"
              class="hover:bg-blue-500 p-2 rounded-full"
            >
              <img src="/microfon.png" width="50px" alt="mic" />
            </button>
          </div>
        </div>
      </div>
    </div>
    <div
      class="bg-blue-800 border-[5px] border-[#ffcc00] rounded-xl fixed top-0 right-0 h-[100vh] w-[460px] overflow-y-auto"
    >
      <div class="mt-[195px] border-t-[5px] border-[#ffcc00]">
        <div
          v-for="(admin, index) in admins"
          class="bg-white m-3 flex items-center hover:bg-lime-500 border-4 rounded-xl border-[#ffcc00] p-3"
          :key="index"
        >
          <h1 class="text-black text-[20px] font-bold mr-2">{{ index + 1 }}</h1>
          <div class="w-16 h-16 mr-2 flex-shrink-0 rounded-full overflow-hidden border border-gray-300">
            <img
              :src="getImageUrl(admin.img)"
              class="w-full h-full object-cover"
              alt="Admin Image"
            />
          </div>
          <div>
            <h1 class="text-[18px] capitalize text-black">{{ admin.name }} {{ admin.surname }}</h1>
            <span class="text-gray-700 capitalize text-[14px]">{{ admin.lavozimi }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 class="text-lg text-black font-bold mb-4">Edit Message</h2>
        <input
          v-model="editedContent"
          class="w-full border-2 text-black rounded px-2 py-1 mb-4"
        />
        <div class="flex justify-end space-x-2">
          <button
            @click="updateMessage"
            class="bg-blue-500 text-white w-full px-4 py-2 rounded"
          >
            Update
          </button>
          <button
            @click="showModal = false"
            class="bg-red-500 text-white px-4 py-2 w-full rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

    <div v-if="showDeleteConfirm" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-80">
        <div class="flex justify-end space-x-2">
          <button
            @click="confirmDelete"
            class="bg-red-500 text-white w-full px-4 py-2 rounded"
          >
            Delete
          </button>
          <button
            @click="showDeleteConfirm = false"
            class="bg-gray-500 text-white px-4 py-2 w-full rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="showContextMenuModal"
      class="fixed bg-white border rounded-lg shadow-lg p-4 z-50 context-menu"
      :style="{ top: contextMenuY + 'px', left: contextMenuX + 'px' }"
    >
      <button
        v-if="contextMenuMessage?.senderId === user?.id"
        @click="startEditing(contextMenuMessage)"
        class="block w-full text-left px-2 py-1 text-blue-500 hover:bg-gray-100"
      >
        Edit
      </button>
      <button
        v-if="contextMenuMessage?.senderId === user?.id"
        @click="confirmDeleteMessage(contextMenuMessage.id)"
        class="block w-full text-left px-2 py-1 text-red-500 hover:bg-gray-100"
      >
        Delete
      </button>
      <button
        @click="handleReply(contextMenuMessage)"
        class="block w-full text-left px-2 py-1 text-green-500 hover:bg-gray-100"
      >
        Reply
      </button>
      <button
        @click="closeContextMenu"
        class="block w-full text-left px-2 py-1 text-gray-500 hover:bg-gray-100"
      >
        Cancel
      </button>
    </div>

    <div
      v-if="showEmojiPicker"
      class="fixed bottom-[160px] flex gap-2 flex-wrap rounded-md z-50 bg-gray-300 p-6"
    >
      <img
        v-for="item in smileys"
        :key="item.id"
        width="90px"
        @click="sendMessage('smiley', item.id)"
        class="block rounded-md"
        :src="getSmileyUrl(item.filePath)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue';
import { io } from 'socket.io-client';
import axios from 'axios';
import { URL } from '@/auth/url';

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
const isImage = (url) => url && /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
const isVideo = (url) => url && /\.(mp4|webm|ogg)$/i.test(url);
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

// Initialize WebSocket connection
const initializeSocket = () => {
  if (!user.value.id) {
    console.error('No user ID found in localStorage');
    alert('Please log in to access the chat');
    return;
  }

  socket.value = io(URL, {
    path: '/socket.io',
    transports: ['websocket', 'polling'],
    auth: { userId: user.value.id },
  });

  socket.value.on('error', (error) => {
    console.error('Socket error:', error);
    alert(error || 'An error occurred with the WebSocket connection');
  });

  socket.value.on('newMessage', (message) => {
    messages.value.push(message);
    if (message.replyToMessageId) {
      getOneMessage(message.replyToMessageId);
    }
    scrollToBottom();
    if (message.senderId !== user.value.id) {
      unreadCount.value++;
    }
  });

  socket.value.on('messageUpdated', (updatedMessage) => {
    const index = messages.value.findIndex((m) => m.id === updatedMessage.id);
    if (index !== -1) {
      messages.value[index] = updatedMessage;
    }
    scrollToBottom();
  });

  socket.value.on('messageDeleted', ({ messageId }) => {
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

  socket.value.emit('join', user.value.id);
};

// API functions
const fetchMessages = async () => {
  try {
    const response = await axios.get(`${URL}/messages`);
    messages.value = response.data;
    messages.value.forEach((msg) => {
      if (msg.replyToMessageId) {
        getOneMessage(msg.replyToMessageId);
      }
    });
    scrollToBottom();
    socket.value.emit('markAsRead', user.value.id);
  } catch (error) {
    console.error('Error fetching messages:', error.message);
    alert('Failed to load messages');
  }
};

const fetchAdmins = async () => {
  try {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const [adminRes, yuristRes, managerRes, yuristAssistantRes, delivererRes] = await Promise.all([
      axios.get(`${URL}/admin`, config),
      axios.get(`${URL}/yurist`, config),
      axios.get(`${URL}/manager`, config),
      axios.get(`${URL}/yuristAssistant`, config),
      axios.get(`${URL}/deliverer`, config),
    ]);
    admins.value = [
      ...adminRes.data,
      ...yuristRes.data,
      ...managerRes.data,
      ...yuristAssistantRes.data,
      ...delivererRes.data,
    ].filter((item) => item.type === 'active');
  } catch (error) {
    console.error('Failed to load admins:', error);
  }
};

const fetchSmileys = async () => {
  try {
    const response = await axios.get(`${URL}/smileys`);
    smileys.value = response.data;
  } catch (error) {
    console.error('Failed to fetch smileys:', error);
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
    } catch (error) {
      console.error('Failed to fetch reply message:', error);
    }
  }
};

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
      socket.value.emit('sendMessage', messageData, (response) => {
        if (!response || !response.success) {
          console.error('Error sending message:', response?.error || 'Unknown error');
          alert(response?.error || 'Failed to send message');
        }
      });
    } else {
      const formData = new FormData();
      formData.append('file', messageData.file);
      formData.append('senderId', messageData.senderId);
      if (messageData.content) formData.append('content', messageData.content);
      if (messageData.smileyId) formData.append('smileyId', messageData.smileyId);
      if (messageData.replyToMessageId) formData.append('replyToMessageId', messageData.replyToMessageId);

      const response = await axios.post(`${URL}/messages`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      socket.value.emit('sendMessage', response.data);
    }

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

const startEditing = (message) => {
  editingMessage.value = message;
  editedContent.value = message.content;
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

  socket.value.emit('updateMessage', updateData, (response) => {
    if (!response || !response.success) {
      console.error('Error updating message:', response?.error || 'Unknown error');
      alert(response?.error || 'Failed to update message');
    }
  });

  newMessage.value = '';
  editingMessage.value = null;
  showModal.value = false;
};

const confirmDeleteMessage = (messageId) => {
  messageToDelete.value = messageId;
  showDeleteConfirm.value = true;
  showContextMenuModal.value = false;
};

const confirmDelete = async () => {
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
  sendMessage(file.type.startsWith('audio') ? 'audio' : 'file');
};

const startRecording = async () => {
  if (recording.value) return;

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.value = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
    audioChunks.value = [];

    mediaRecorder.value.ondataavailable = (event) => {
      if (event.data.size > 0) audioChunks.value.push(event.data);
    };

    mediaRecorder.value.onstop = async () => {
      if (audioChunks.value.length > 0) {
        const audioBlob = new Blob(audioChunks.value, { type: 'audio/mpeg' });
        selectedFile.value = new File([audioBlob], `audio-${Date.now()}.mp3`, { type: 'audio/mpeg' });
        await sendMessage('audio');
      }
      recording.value = false;
      stream.getTracks().forEach((track) => track.stop());
    };

    recording.value = true;
    isClicked.value = true;
    recordingTime.value = 0;
    recordingInterval.value = setInterval(() => recordingTime.value++, 1000);
    mediaRecorder.value.start();
  } catch (error) {
    console.error('Failed to start recording:', error);
    alert('Failed to start recording');
    recording.value = false;
    isClicked.value = false;
  }
};

const stopRecording = () => {
  if (!recording.value || !mediaRecorder.value) return;

  mediaRecorder.value.stop();
  clearInterval(recordingInterval.value);
  isClicked.value = false;
};

const showContextMenu = (event, message) => {
  contextMenuMessage.value = message;
  contextMenuX.value = event.clientX;
  contextMenuY.value = event.clientY;
  showContextMenuModal.value = true;
};

// Lifecycle hooks
onMounted(() => {
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
});

onUnmounted(() => {
  if (socket.value) socket.value.disconnect();
  clearInterval(recordingInterval.value);
  mediaRecorder.value?.stream?.getTracks().forEach((track) => track.stop());
  window.removeEventListener('scroll', () => {});
  document.removeEventListener('click', () => {});
});
</script>

<style>
#img {
  background: url(/logo.png) no-repeat fixed 50% 200px;
  min-height: 100vh;
}

.context-menu {
  min-width: 150px;
}
</style>