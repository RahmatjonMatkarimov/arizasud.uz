<script setup>
import { ref, computed, inject } from 'vue';
import { format } from 'date-fns';
import { onMounted } from 'vue';
import axios from 'axios';
import { URL } from '@/auth/url';
import { useRouter } from 'vue-router';
import translateText from '@/auth/Translate';
// Reactive state for navigation
const activeSection = ref('status5'); // Default section: Qabul qilingan fayllar (status4)

// Existing reactive state
const data = ref([]);
const comment = ref('');
const openDropdownId = ref(null);
const isModalOpen = ref(false);
const selectedRejectId = ref(null);
const status = ref();
const router = useRouter();
const expandedDocId = ref(null);
const searchQuery = ref('');
const isReasonModalOpen = ref(false);
const rejectionComment = ref('');
const isAdminModalOpen = ref(false);
const adminData = ref([]);
const selectedAdminId = ref(null);
const selectedDoc = ref(null); // Store the full document object
const selectedDocId = ref(null);
const selecteradminId = ref(0)
// New reactive state for admin dropdown modal
const hoveredAdmin = ref(null); // Tracks the hovered admin
const showHoverModal = ref(false); // Toggles hover modal visibility
const dat = inject('dat') // Placeholder for translation flag (adjust as needed)

const statusCards = [
  {
    id: 1,
    title: 'Hujjatlarni yozish jarayonidagi fayllar',
    count: 0,
    documentId: '',
    status: 'accepted',
    color: 'success',
    section: 'status5',
  },
  {
    id: 2,
    title: 'Imzolash uchun yaratilgan shartnomalar',
    count: 0,
    documentId: 'N/A',
    status: 'rejected',
    color: 'error',
    section: 'status1',
  },
];
const filteredTasks = ref([]); // Topda declare qilingan bo'lsin

const tasks = async () => {
  try {
    const res = await axios.get(`${URL}/yurist-tasks`);
    const adminId = localStorage.getItem('id');
    
    // 1. adminId mos keladigan tasklar
    const adminTasks = res.data.filter(task => task.adminId == adminId);
    
    // 2. Oxirgi statusi 'status1' bo'lgan tasklar
    const result = adminTasks.filter(task => {
      const history = task.ClientFileStatusHistory;
      if (!history || history.length === 0) return false;
      const lastStatus = history[history.length - 1].status;
      return lastStatus === 'status1';
    });
    
    filteredTasks.value = result; // reactive sifatida saqlaymiz
    console.log('filteredTasks:', filteredTasks.value);
  } catch (error) {
    console.error("Xatolik yuz berdi:", error);
  }
};


const dynamicStatusCards = computed(() => {
  const tasksList = data.value.LawyerTask || [];
  const counts = {
    status5: 0,
    status1: filteredTasks.value.length, // <--- Bu yerda filteredTasks dan foydalanilyapti
  };

  // Faqat status5 uchun oddiy hisoblash
  tasksList.forEach((task) => {
    const latestStatus = task.ClientFileStatusHistory?.[task.ClientFileStatusHistory.length - 1]?.status;
    const statusNumber = getLastChar(latestStatus);
    if (statusNumber === '5') counts.status5 += 1;
  });

  return statusCards.map((card) => ({
    ...card,
    count: counts[card.section] || 0,
    documentId: (() => {
      const task = tasksList.find((t) => {
        const latestStatus = t.ClientFileStatusHistory?.[t.ClientFileStatusHistory.length - 1]?.status;
        return getLastChar(latestStatus) === card.section.slice(-1);
      });
      return task?.clientFile?.name || 'N/A';
    })(),
  }));
});

// Update confirmAdminSelection to call createTasks
const confirmAdminSelection = async () => {
  if (!selectedAdminId.value || selectedAdminId.value <= 0) {
    console.error('Invalid admin ID:', selectedAdminId.value);
    alert("Iltimos, ma'sul shaxsni tanlang. Admin ID noto‘g‘ri.");
    return;
  }

  if (!selectedDoc.value || !selectedDoc.value.title || !selectedDocId.value || !selectedDoc.value.clientFile?.id) {
    console.error('Invalid document data:', selectedDoc.value, selectedDocId.value);
    alert("Hujjat ma'lumotlari topilmadi yoki hujjat nomi yoki clientFile ID mavjud emas.");
    return;
  }

  const task = data.value.LawyerTask.find((t) => t.id === selectedDocId.value);
  if (!task) {
    console.error('Task not found for ID:', selectedDocId.value);
    alert('Hujjat topilmadi.');
    return;
  }


  const latestStatus = task.ClientFileStatusHistory?.[task.ClientFileStatusHistory.length - 1]?.status;
  const currentStatusNumber = parseInt(getLastChar(latestStatus)) || 1;
  const lawyerId = selectedAdminId.value; // Store locally to avoid reset
  try {
    // Update the status with the selected admin ID
    await updateType(selectedDocId.value, currentStatusNumber + 1, '', lawyerId);
    // Create a new task with the document's title
    isAdminModalOpen.value = false;
    selectedAdminId.value = null;
    selectedDocId.value = null;
    selectedDoc.value = null;
  } catch (error) {
    console.error('Error in confirmAdminSelection:', error.response?.data || error.message);
    alert('Xatolik yuz berdi: ' + (error.response?.data?.message || 'Iltimos, qaytadan urinib ko‘ring.'));
  }
};

const getAdmin = async () => {
  try {
    const response = await axios.get(`${URL}/yuristAssistant`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    adminData.value = response.data;
  } catch (error) {
    console.error('Error fetching admin data:', error);
  }
};
// Function to set active section
const setActiveSection = (section) => {
  activeSection.value = section;
};

// Existing functions
const getData = async () => {
  try {
    const response = await axios.get(`${URL}/yuristAssistant/${localStorage.getItem('id')}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    const fetchedData = response.data;

    const filteredTasks = fetchedData.LawyerTask.filter((item) => {
      if (item.ClientFileStatusHistory && item.ClientFileStatusHistory.length > 0) {
        const latestStatusEntry = item.ClientFileStatusHistory[item.ClientFileStatusHistory.length - 1];
        const latestStatus = getLastChar(latestStatusEntry.status);
        status.value = latestStatus;
        return ['5', '1'].includes(latestStatus); // Only status4 and status6
      }
      return false;
    });

    data.value = { ...fetchedData, LawyerTask: filteredTasks };
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const getLastChar = (str) => {
  if (!str || typeof str !== 'string') return null;
  return str.trim().slice(-1);
};
const openRejectModal = (id) => {
  selectedRejectId.value = id.id;
  isModalOpen.value = true;
  openDropdownId.value = null;
  selecteradminId.value = id.adminId
};
// Update updateType to avoid resetting selectedAdminId
const updateType = async (id, newStatus, commentText = '', adminId = null) => {
  try {
    const payload = {
      changedById: adminId || localStorage.getItem('id'),
      clientFileId: id,
      comment: commentText,
      status: `status${newStatus}`,
    };

    if (adminId) {
      payload.assignedAdminId = adminId;
    }
    await axios.post(`${URL}/client-file-status-history`, payload);

    // Rad etish bo'lsa (newStatus < currentStatusNumber)
    if (newStatus ==4) {
      await axios.put(`${URL}/yurist-tasks/${selectedRejectId.value}`, {
        lawyerId: +selecteradminId.value, // Joriy foydalanuvchi lawyer bolidi
        adminId: 43, // Taskdagi adminId saqlanadi
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } 
    // Oddiy taklif qilish yoki keyingi bosqichga o'tish
    else if (newStatus === 6) {
      await axios.put(`${URL}/yurist-tasks/${id}`, {
        lawyerId: +adminId || +selectedAdminId.value,
        adminId: +localStorage.getItem('id'),
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Status tarixini yangilash

    openDropdownId.value = null;
    isModalOpen.value = false;
    comment.value = '';
    selectedRejectId.value = null;
    isAdminModalOpen.value = false;

    getData();
  } catch (error) {
    console.error('Error updating data:', error);
    alert("Xatolik yuz berdi: " + error.message);
  }
};


const cancelReject = () => {
  isModalOpen.value = false;
  comment.value = '';
  selectedRejectId.value = null;
};

const confirmReject = () => {
  if (!comment.value.trim()) {
    alert('Iltimos, rad etish sababini kiriting.');
    return;
  }

  const task = data.value.LawyerTask.find((t) => t.id === selectedRejectId.value);
  if (!task) {
    console.error("Rad etish uchun hujjat topilmadi, ID:", selectedRejectId.value);
    alert("Hujjat topilmadi. Iltimos, qaytadan urinib ko'ring.");
    return;
  }

  const latestStatus = task.ClientFileStatusHistory?.[task.ClientFileStatusHistory.length - 1]?.status;
  const currentStatusNumber = parseInt(getLastChar(latestStatus)) || 1;

  if (currentStatusNumber <= 1) {
    alert('Bu hujjatni rad etish mumkin emas, chunki u allaqachon eng past holatda.');
    return;
  }

  updateType(selectedRejectId.value, currentStatusNumber - 1, comment.value);
};

const moveToNextStage = (id) => {
  const task = data.value.LawyerTask.find((t) => t.id === id);
  const latestStatus = task.ClientFileStatusHistory?.[task.ClientFileStatusHistory.length - 1]?.status;
  const currentStatusNumber = parseInt(getLastChar(latestStatus)) || 1;

  if (currentStatusNumber >= 9) {
    alert("Keyingi bosqich mavjud emas, hujjat eng yuqori holatda.");
    return;
  }
  if (activeSection.value === 'status5') {
    selectedDocId.value = id;
    selectedDoc.value = filteredDocuments.value.find((doc) => doc.id === id) || null;
    isAdminModalOpen.value = true;
    getAdmin(); // Oddiy admin ma'lumotlar
  } else {
    updateType(id, currentStatusNumber + 1);
  }
};

const selectAdmin = (admin) => {
  selectedAdminId.value = admin.id;
  confirmAdminSelection(); // Call confirmAdminSelection to handle status update and task creation
};
const cancelAdminSelection = () => {
  isAdminModalOpen.value = false;
  selectedAdminId.value = null;
  selectedDocId.value = null;
  selectedDoc.value = null; // Clear selected document
  hoveredAdmin.value = null;
  showHoverModal.value = false;
};

// New function to open reason modal
const openReasonModal = (comment) => {
  rejectionComment.value = comment;
  isReasonModalOpen.value = true;
};

// New function to close reason modal
const closeReasonModal = () => {
  isReasonModalOpen.value = false;
  rejectionComment.value = '';
};

// Function to check if the latest rejection has a non-empty comment
const hasRejectionComment = (history) => {
  if (!history || history.length < 2) return false;
  const sortedHistory = [...history].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  const latestEntry = sortedHistory[sortedHistory.length - 1];
  const secondLatestEntry = sortedHistory[sortedHistory.length - 2];
  const currentStatusNumber = parseInt(getLastChar(latestEntry.status)) || 1;
  const previousStatusNumber = parseInt(getLastChar(secondLatestEntry.status)) || 1;
  return (
    currentStatusNumber < previousStatusNumber &&
    latestEntry.comment &&
    latestEntry.comment.trim() !== ''
  );
};

// Function to get the comment from the latest rejection
const getLatestRejectionComment = (history) => {
  if (!history || history.length < 2) return '';
  const sortedHistory = [...history].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  const latestEntry = sortedHistory[sortedHistory.length - 1];
  const secondLatestEntry = sortedHistory[sortedHistory.length - 2];
  const currentStatusNumber = parseInt(getLastChar(latestEntry.status)) || 1;
  const previousStatusNumber = parseInt(getLastChar(secondLatestEntry.status)) || 1;
  if (
    currentStatusNumber < previousStatusNumber &&
    latestEntry.comment &&
    latestEntry.comment.trim() !== ''
  ) {
    return latestEntry.comment;
  }
  return '';
};

const getStatus = (status) => {
  if (!status) return null;
  const statusMap = {
    '1': dat === 'datakril' ? translateText('Imzolash uchun shartnoma yaratildi') : 'Imzolash uchun shartnoma yaratildi',
    '2': dat === 'datakril' ? translateText('Shartnoma ko\'rib chiqish jarayonida') : 'Shartnoma ko\'rib chiqish jarayonida',
    '3': dat === 'datakril' ? translateText('Yurist zimmasiga otkazildi') : 'Yurist zimmasiga otkazildi',
    '4': dat === 'datakril' ? translateText('Kerakli hujjatlar yig\'ib chiqilmoqda') : 'Kerakli hujjatlar yig\'ib chiqilmoqda',
    '5': dat === 'datakril' ? translateText('Hujjatlarni yozish jarayonida') : 'Hujjatlarni yozish jarayonida',
    '6': dat === 'datakril' ? translateText('Imlo xatolarini tekshirish jarayonida') : 'Imlo xatolarini tekshirish jarayonida',
    '7': dat === 'datakril' ? translateText('Davlat boji va boshqa to\'lovlarni buyurtmachi to\'liq to\'lashini kutish jarayonida') : 'Davlat boji va boshqa to\'lovlarni buyurtmachi to\'liq to\'lashini kutish jarayonida',
    '8': dat === 'datakril' ? translateText('Sudga taqdim etish jarayonida') : 'Sudga taqdim etish jarayonida',
    '9': dat === 'datakril' ? translateText('Sudga taqdim etildi') : 'Sudga taqdim etildi',
  };
  return statusMap[status] || null;
};

const getStatusColor = (status) => {
  const statusNumber = getLastChar(status);
  switch (statusNumber) {
    case '1':
      return 'text-primary-600';
    case '2':
      return 'text-warning-600';
    case '3':
      return 'text-success-600';
    default:
      return 'text-gray-600';
  }
};
const filteredDocuments = computed(() => {
  let tasks = data.value.LawyerTask || [];

  // Agar joriy aktiv section 'status1' bo'lsa, filteredTasks dan olish
  if (activeSection.value === 'status1') {
    tasks = filteredTasks.value;
  }

  return tasks
    .filter((task) => {
      const latestStatus = task.ClientFileStatusHistory?.[task.ClientFileStatusHistory.length - 1]?.status;
      const statusNumber = getLastChar(latestStatus);
      return statusNumber === activeSection.value.slice(-1);
    })
    .map((task) => ({
      id: task.id,
      title: task.name || 'N/A',
      clientFile: task.clientFile,
      status: task.ClientFileStatusHistory?.[task.ClientFileStatusHistory.length - 1]?.status,
      date: task.createdAt || new Date(),
      user: task.user,
      adminId: task.adminId,
      type: task.clientFile?.type || 'contract',
      assignedTo: 'Legal Department',
      priority: 'medium',
      history: task.ClientFileStatusHistory || [],
    }))
    .filter((doc) =>
      doc.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
});
// Compute timeline steps for each document based on ClientFileStatusHistory
const getTimelineSteps = (history) => {
  const steps = [];
  const statusMap = {
    '1': dat === 'datakril' ? translateText('Imzolash uchun shartnoma yaratildi') : 'Imzolash uchun shartnoma yaratildi',
    '2': dat === 'datakril' ? translateText('Shartnoma ko\'rib chiqish jarayonida') : 'Shartnoma ko\'rib chiqish jarayonida',
    '3': dat === 'datakril' ? translateText('Yurist zimmasiga otkazildi') : 'Yurist zimmasiga otkazildi',
    '4': dat === 'datakril' ? translateText('Kerakli hujjatlar yig\'ib chiqilmoqda') : 'Kerakli hujjatlar yig\'ib chiqilmoqda',
    '5': dat === 'datakril' ? translateText('Hujjatlarni yozish jarayonida') : 'Hujjatlarni yozish jarayonida',
    '6': dat === 'datakril' ? translateText('Imlo xatolarini tekshirish jarayonida') : 'Imlo xatolarini tekshirish jarayonida',
    '7': dat === 'datakril' ? translateText('Davlat boji va boshqa to\'lovlarni buyurtmachi to\'liq to\'lashini kutish jarayonida') : 'Davlat boji va boshqa to\'lovlarni buyurtmachi to\'liq to\'lashini kutish jarayonida',
    '8': dat === 'datakril' ? translateText('Sudga taqdim etish jarayonida') : 'Sudga taqdim etish jarayonida',
    '9': dat === 'datakril' ? translateText('Sudga taqdim etildi') : 'Sudga taqdim etildi',
  };

  const sortedHistory = [...history].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  const currentStatusNumber = sortedHistory.length > 0
    ? parseInt(getLastChar(sortedHistory[sortedHistory.length - 1].status)) || 1
    : 1;

  const latestStatusEntries = {};
  sortedHistory.forEach((entry) => {
    const statusNumber = parseInt(getLastChar(entry.status)) || 1;
    if (statusNumber <= currentStatusNumber) {
      latestStatusEntries[statusNumber] = entry;
    }
  });

  const isLatestRejection = hasRejectionComment(history);
  const latestRejectionStatus = isLatestRejection
    ? parseInt(getLastChar(sortedHistory[sortedHistory.length - 1].status)) || 1
    : null;

  Object.keys(latestStatusEntries)
    .map(Number)
    .sort((a, b) => a - b)
    .forEach((statusNumber, index) => {
      const entry = latestStatusEntries[statusNumber];
      const isRejection =
        index > 0 &&
        statusNumber < parseInt(getLastChar(latestStatusEntries[Object.keys(latestStatusEntries)[index - 1]].status));

      steps.push({
        id: index + 1,
        title: statusMap[statusNumber] || `Step ${statusNumber}`,
        completed: true,
        date: entry.createdAt || new Date(),
        comment: entry.comment || '',
        isRejection: isRejection,
        isLatestRejectionWithComment: isLatestRejection && statusNumber === latestRejectionStatus,
      });
    });

  return steps;
};

const toggleExpand = (id) => {
  expandedDocId.value = expandedDocId.value === id ? null : id;
};

onMounted(() => {
  getData();
  tasks()
});
</script>

<template>
  <div class="min-h-screen flex flex-col bg">
    <!-- Main Content -->
    <main class="flex-1 py-6">
      <div class="container mx-auto px-4">
        <!-- Status Cards as Navigation -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div v-for="card in dynamicStatusCards" :key="card.id" @click="setActiveSection(card.section)"
            class="bg-indigo-300 rounded-xl shadow-soft p-5 h-full border-l-[6px] transition-all duration-300 hover:shadow-medium cursor-pointer"
            :class="{
              'border-success-500': card.color === 'success' && activeSection === card.section,
              'border-error-500': card.color === 'error' && activeSection === card.section,
              'border-gray-500': card.color === 'as' && activeSection === card.section,
            }">
            <div class="flex justify-between items-start">
              <h3 class="text-[19px] font-semibold text-gray-800">{{ dat=== 'datakril' ? translateText(card.title):card.title }}</h3>
            </div>
            <div class="mt-4">
              <p class="text-3xl font-bold text-gray-900 mb-1">{{ card.count }}</p>
            </div>
          </div>
        </div>

        <!-- Document List Section (Filtered by Status) -->
        <div class="animate-fade-in">
          <div class="bg-white rounded-xl shadow-soft overflow-hidden">
            <div class="p-4 flex justify-between items-center bg-indigo-300">
              <h3 class="text-[19px] font-semibold text-gray-800">
                {{ dat === 'datakril' ? translateText('Yangi fayllar') : 'Yangi fayllar' }}
              </h3>
              <div class="flex space-x-2">
                <input v-model="searchQuery" type="text"
                  :placeholder="dat === 'datakril' ? translateText('Hujjat qidirish...') : 'Hujjat qidirish...'"
                  class="px-3 py-1.5 border bg-lime-600 search text-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
            </div>

            <ul class="bg-indigo-300">
              <li v-for="(doc, index) in filteredDocuments" :key="doc.id">
                <div class="px-5 py-4 border-b border-gray-300 flex items-center space-x-3 cursor-pointer"
                  @click="toggleExpand(doc.id)">
                  <div class="flex-1">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center space-x-3">
                        <div
                          class="w-10 h-10 border-2 rounded-full flex items-center justify-center text-primary-800 font-semibold">
                          {{ index + 1 }}
                        </div>
                        <span class="font-medium text-gray-900 line-clamp-1">{{ dat === 'datakril' ? translateText(doc.title) : doc.title }}</span>
                      </div>
                      <div class="flex items-center space-x-4">
                        <span class="text-sm text-gray-500 hidden md:block">
                          {{ format(new Date(doc.date), 'dd.MM.yyyy') }}
                        </span>
                        <span class="text-gray-400 transition-transform duration-300"
                          :class="{ 'rotate-180': expandedDocId === doc.id }">
                          ▼
                        </span>
                      </div>
                    </div>

                    <div v-if="expandedDocId === doc.id" class="mt-4 text-sm text-gray-600 animate-fade-in">
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p class="py-1 text-gray-600">
                            <span class="font-medium text-gray-600">
                              {{ dat === 'datakril' ? translateText('Ma\'sul Shaxs:') : 'Ma\'sul Shaxs:' }}
                            </span>
                            {{ dat === 'datakril' ? translateText(`${doc.user.name} ${doc.user.surname} ${doc.user.dadname}`) : `${doc.user.name} ${doc.user.surname} ${doc.user.dadname}` }}
                          </p>
                          <p class="py-1">
                            <span class="font-medium text-gray-600">
                              {{ dat === 'datakril' ? translateText('Holati: ') : 'Holati: ' }}
                            </span>
                            <span class="text-gray-600" :class="getStatusColor(doc.status)">
                              {{ dat === 'datakril' ? translateText(getStatus(getLastChar(doc.status))) : getStatus(getLastChar(doc.status)) }}
                            </span>
                          </p>
                        </div>
                        <div>
                          <p class="md:hidden py-1">
                            <span class="font-medium text-gray-600">
                              {{ dat === 'datakril' ? translateText('Sana:') : 'Sana:' }}
                            </span>
                            {{ format(new Date(doc.date), 'dd.MM.yyyy') }}
                          </p>
                        </div>
                      </div>

                      <!-- Workflow Timeline Inside Each Document -->
                      <div class="mt-6">
                        <h4 class="text-sm font-semibold text-gray-800 mb-2">
                          {{ dat === 'datakril' ? translateText('Ish jarayoni holati') : 'Ish jarayoni holati' }}
                        </h4>
                        <div class="overflow-x-auto max-w-[81%]">
                          <div class="inline-block min-w-full">
                            <div class="flex overflow-x-auto items-center">
                              <template v-for="(step, index) in getTimelineSteps(doc.history)" :key="step.id">
                                <div :class="[
                                  'relative flex flex-col rounded-xl bg-white items-center p-1 max-w-[135px]',
                                  step.isLatestRejectionWithComment ? 'border-[6px] border-red-600' : 'border-[6px] border-lime-600'
                                ]">
                                  <div class="relative z-10">
                                    <div class="rounded-full bg-gray-200 flex items-center justify-center text-gray-600"
                                      :class="step.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'">
                                      <img class="w-[50px]"
                                        :src="step.isLatestRejectionWithComment ? '/x.png' : '/check-mark.png'"
                                        :alt="dat === 'datakril' ? translateText(step.isLatestRejectionWithComment ? 'Rad etildi' : 'Bajarildi') : (step.isLatestRejectionWithComment ? 'Rejected' : 'Completed')" />
                                    </div>
                                  </div>
                                  <div class="mt-2 text-center">
                                    <div class="group relative">
                                      <p class="text-[16px] font-medium text-gray-700 p-1 line-clamp-2 w-[120px] mb-1">
                                        {{ dat === 'datakril' ? translateText(step.title) : step.title }}
                                      </p>
                                      <p
                                        class="absolute hidden -mt-2 rounded-md z-40 bg-gray-600 group-hover:block min-w-[300px] text-center">
                                        {{ dat === 'datakril' ? translateText(step.title) : step.title }}
                                      </p>
                                    </div>
                                    <p class="text-[16px] text-orange-500">
                                      {{ format(new Date(step.date), 'dd.MM.yyyy') }}
                                    </p>
                                  </div>
                                </div>
                                <div v-if="index < getTimelineSteps(doc.history).length - 1">
                                  <div class="w-[70px] rotate-180 h-5 overflow-hidden">
                                    <div class="h-full bg-lime-600 bg-stripes" style="width: 100%"></div>
                                  </div>
                                </div>
                              </template>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="mt-4 flex justify-end space-x-2">
                        <button @click="router.push('/Check/' + doc.clientFile.clientSection.clientSectionBody.client.id)"
                          class="btn bg-indigo-400 text-sm">
                          {{ dat === 'datakril' ? translateText('Buyurtmachini shaxsiy kabinetiga otish') : 'Buyurtmachini shaxsiy kabinetiga otish' }}
                        </button>
                        <button v-if="hasRejectionComment(doc.history)" class="btn bg-yellow-500 text-white text-sm"
                          @click="openReasonModal(getLatestRejectionComment(doc.history))">
                          {{ dat === 'datakril' ? translateText('Sababni Ko\'rish') : 'Sababni Ko\'rish' }}
                        </button>
                        <button v-if="activeSection !== 'status1'" class="btn bg-red-500 text-white text-sm" @click="openRejectModal(doc)">
                          {{ dat === 'datakril' ? translateText('Rad etish') : 'Rad etish' }}
                        </button>
                        <button v-if="activeSection !== 'status1'" class="btn btn-primary text-sm"
                          @click="moveToNextStage(doc.id)">
                          {{ dat === 'datakril' ? translateText('Keyingi bosqichga o\'tish') : 'Keyingi bosqichga o\'tish' }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  </div>
  <!-- Existing Rejection Modal -->
  <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div class="bg-white p-6 rounded-lg w-[400px]">
      <h2 class="text-xl text-black font-bold mb-4">
        {{ dat === 'datakril' ? translateText('Rad qilish sababi') : 'Rad qilish sababi' }}
      </h2>
      <textarea v-model="comment"
        :placeholder="dat === 'datakril' ? translateText('Izoh kiriting...') : 'Izoh kiriting...'"
        class="w-full border p-2 rounded mb-4 text-gray-600" required></textarea>
      <div class="flex justify-end">
        <button @click="cancelReject" class="btn btn-secondary text-sm mr-2">
          {{ dat === 'datakril' ? translateText('Bekor qilish') : 'Bekor qilish' }}
        </button>
        <button @click="confirmReject" class="btn bg-red-500 text-white text-sm">
          {{ dat === 'datakril' ? translateText('Yuborish') : 'Yuborish' }}
        </button>
      </div>
    </div>
  </div>
  <!-- Existing Reason Modal -->
  <div v-if="isReasonModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div class="bg-white p-6 rounded-lg w-[400px]">
      <h2 class="text-xl text-black font-bold mb-4">
        {{ dat === 'datakril' ? translateText('Rad etish sababi') : 'Rad qilish sababi' }}
      </h2>
      <p class="text-gray-600 break-words mb-4">{{ rejectionComment }}</p>
      <div class="flex justify-end">
        <button @click="closeReasonModal" class="btn btn-secondary text-sm">
          {{ dat === 'datakril' ? translateText('Yopish') : 'Yopish' }}
        </button>
      </div>
    </div>
  </div>
  <!-- New Admin Selection Modal -->
  <div v-if="isAdminModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div class="bg-gray-200 p-2 rounded-lg w-[400px] max-h-[500px] border border-gray-300 shadow-lg">
      <h2 class="text-xl text-black font-bold mb-4 px-3">
        {{ dat === 'datakril' ? translateText('Ma\'sul shaxsni tanlang') : 'Ma\'sul shaxsni tanlang' }}
      </h2>
      <div class="flex flex-col gap-2">
        <div v-for="admin in adminData" :key="admin.id"
          class="p-3 flex gap-4 border-2 border-blue-500 h-[70px] rounded-md items-center cursor-pointer hover:bg-gray-300 text-black relative"
          @click="selectAdmin(admin)" @mouseenter="hoveredAdmin = admin; showHoverModal = true"
          @mouseleave="showHoverModal = false">
          <img class="w-[50px]" :src="URL + '/upload/' + admin.img"
            :alt="dat === 'datakril' ? translateText('Rasm') : 'Image'" />
          <h1 class="text-black text-[15px] font-bold">
            {{ dat === 'datakril' ? translateText(`${admin.name} ${admin.surname} ${admin.dadname}`) : `${admin.name} ${admin.surname} ${admin.dadname}` }}
          </h1>
          <!-- Hover Modal -->
          <div v-if="showHoverModal && hoveredAdmin?.id === admin.id"
            class="absolute bottom-0 -right-[250px] p-3 bg-white border border-gray-300 rounded-lg shadow-lg z-20 max-h-[500px] overflow-scroll min-w-[300px]">
            <p class="text-black">
              {{ dat === 'datakril' ? translateText('Bajaradigan ishlari') : 'Bajaradigan ishlari' }}
            </p>
            <div v-if="admin?.LawyerTask?.length > 0">
              <div class="text-black bg-gray-300 flex justify-between p-2 rounded-lg my-1"
                v-for="item in admin.LawyerTask" :key="item.id">
                <p class="text-black">
                  {{ dat === 'datakril' ? translateText(item.name) : item.name }}
                </p>
                <h1 class="text-black">{{ dat=='datakril'? translateText('holati:'):'holati:' }} <span class="text-red-500">
                        {{
                          item.ClientFileStatusHistory[item.ClientFileStatusHistory.length - 1]?.status === 'status4' ?
                            dat === 'datakril'?translateText('1-Bosqich'):'1-Bosqich' :
                            item.ClientFileStatusHistory[item.ClientFileStatusHistory.length - 1]?.status === 'status6' ?
                              '2-Bosqichda' :
                              item.ClientFileStatusHistory[item.ClientFileStatusHistory.length - 1]?.status === 'status7' ?
                        '3-Bosqichda' :
                        ''
                        }}
                      </span></h1>
              </div>
            </div>
            <div v-else class="text-black text-center p-2">
              {{ dat === 'datakril' ? translateText('Bajaradigan ishlari yo\'q') : 'Bajaradigan ishlari yo\'q' }}
            </div>
          </div>
        </div>
      </div>
      <div class="flex justify-end space-x-2 mt-4 px-3">
        <button @click="cancelAdminSelection" class="btn btn-secondary text-sm">
          {{ dat === 'datakril' ? translateText('Bekor qilish') : 'Bekor qilish' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.workflow-line {
  height: 2px;
  position: absolute;
  top: 16px;
  z-index: 0;
}

.workflow-line-completed {
  background: linear-gradient(90deg, #22C55E, #22C55E);
}

.workflow-line-pending {
  background: repeating-linear-gradient(90deg, #D1D5DB, #D1D5DB 4px, #F3F4F6 4px, #F3F4F6 8px);
}

.badge {
  @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium;
}

.btn {
  @apply inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-primary {
  @apply bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500;
}

.btn-secondary {
  @apply bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-primary-500;
}

.btn-sm {
  @apply px-2.5 py-1.5 text-xs rounded;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.infinite-border {
  position: relative;
  min-width: 75px;
  font-size: 24px;
  display: flex;
  min-height: 20px;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.border-line {
  position: absolute;
  top: 50%;
  right: 0;
  min-width: 200%;
  white-space: nowrap;
  font-size: 140px;
  font-weight: 900;
  animation: moveLine 5s linear infinite;
  pointer-events: none;
  user-select: none;
}
@keyframes progress-bar-stripes {
  from {
    background-position: 1rem 0;
  }

  to {
    background-position: 0 0;
  }
}

.bg-stripes {
  background-image: linear-gradient(45deg,
      rgba(255, 255, 255, 0.15) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.15) 50%,
      rgba(255, 255, 255, 0.15) 75%,
      transparent 75%,
      transparent);
  background-size: 1rem 1rem;
  animation: progress-bar-stripes 1s linear infinite;
}
@keyframes moveLine {
  0% {
    transform: translateX(140%);
  }

  100% {
    transform: translateX(200%);
  }
}

.bg {
  background: linear-gradient(to bottom, #0e1125 40%, #454e78 100%);
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

.search {
  color: white !important;
}

.search::placeholder {
  color: white !important;
}
</style>