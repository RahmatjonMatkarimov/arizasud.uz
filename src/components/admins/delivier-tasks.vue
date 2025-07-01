<script setup>
import { ref, computed, inject, onUnmounted } from 'vue';
import { format } from 'date-fns';
import { onMounted } from 'vue';
import axios from 'axios';
import { URL } from '@/auth/url';
import { useRouter } from 'vue-router';
import translateText from '@/auth/Translate';

// Reactive state for navigation
const activeSection = ref('status8'); // Default section: Qabul qilingan fayllar (status4)

// Existing reactive state
const data = ref([]);
const comment = ref('');
const openDropdownId = ref(null);
const isModalOpen = ref(false);
const selectedRejectId = ref(null);
const isLoading = inject('isLoading')
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
const hoveredAdmin = ref(null);
const showHoverModalOpen = ref(false);
const hoverPosition = ref({ top: 0, left: 0 });
const hoverTimeout = ref(null);
const hideTimeout = ref(null);
const showHoverModal = (admin, event) => {
  if (!event || !event.currentTarget) {
    console.error('Event or currentTarget is null');
    return;
  }
  hoveredAdmin.value = admin;
  showHoverModalOpen.value = true;
  const rect = event.currentTarget.getBoundingClientRect();
  const modalWidth = 300;
  const modalHeight = 300;
  let top = rect.bottom + window.scrollY + 5;
  let left = rect.left + window.scrollX;
  if (left + modalWidth > window.innerWidth) {
    left = rect.right + window.scrollX - modalWidth;
  }
  if (top + modalHeight > window.innerHeight + window.scrollY) {
    top = rect.top + window.scrollY - modalHeight - 5;
  }
  hoverPosition.value = { top, left };
};

const hideHoverModal = () => {
  showHoverModalOpen.value = false;
  hoveredAdmin.value = null;
};

const showHoverModalDelayed = (admin, element) => {
  if (hoverTimeout.value) {
    clearTimeout(hoverTimeout.value);
    hoverTimeout.value = null;
  }
  if (hideTimeout.value) {
    clearTimeout(hideTimeout.value);
    hideTimeout.value = null;
  }
  
  if (!element) {
    console.error('Element is null');
    return;
  }
  
  hoveredAdmin.value = admin;
  showHoverModalOpen.value = true;
  
  const rect = element.getBoundingClientRect();
  
  const modalWidth = 300;
  const modalHeight = 300;
  
  let top = rect.bottom + window.scrollY + 5;
  let left = rect.left + window.scrollX;
  
  // Boundary checks
  if (left + modalWidth > window.innerWidth) {
    left = rect.right + window.scrollX - modalWidth;
  }
  
  if (top + modalHeight > window.innerHeight + window.scrollY) {
    top = rect.top + window.scrollY - modalHeight - 5;
  }
  
  hoverPosition.value = { top, left };
};

const hideHoverModalDelayed = () => {
  
  // Clear existing timeouts
  if (hoverTimeout.value) {
    clearTimeout(hoverTimeout.value);
    hoverTimeout.value = null;
  }
  if (hideTimeout.value) {
    clearTimeout(hideTimeout.value);
    hideTimeout.value = null;
  }
  
  hideTimeout.value = setTimeout(() => {
    hideHoverModal();
  }, 100);
};
const cancelHide = () => {
  if (hideTimeout.value) {
    clearTimeout(hideTimeout.value);
    hideTimeout.value = null;
  }
};
const cleanup = () => {
  if (hoverTimeout.value) {
    clearTimeout(hoverTimeout.value);
  }
  if (hideTimeout.value) {
    clearTimeout(hideTimeout.value);
  }
};
const dat = ref(localStorage.getItem("til") || "datalotin");

let intervalId = null;
const checkLanguageChange = () => {
  const currentLang = localStorage.getItem("til") || "datalotin";
  if (currentLang !== dat.value) {
    dat.value = currentLang;
  }
};

onMounted(() => {
  intervalId = setInterval(checkLanguageChange, 0);
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});

// Status cards configuration
const statusCards = [
  {
    id: 1,
    title: 'Sudga taqdim etish jarayonidagi fayllar',
    count: 0,
    documentId: '',
    status: 'accepted',
    color: 'success',
    section: 'status8',
  },
  {
    id: 2,
    title: 'Sudga taqdim etilgan fayllar',
    count: 0,
    documentId: 'N/A',
    status: 'rejected',
    color: 'error',
    section: 'status9',
  },
];

// Compute dynamic status cards with counts and documentId
const dynamicStatusCards = computed(() => {
  const tasks = data.value.LawyerTask || [];
  const counts = {
    status8: 0,
    status9: 0,
  };

  tasks.forEach((task) => {
    const latestStatus = task.ClientFileStatusHistory?.[task.ClientFileStatusHistory.length - 1]?.status;
    const statusNumber = getLastChar(latestStatus);
    if (statusNumber === '8') counts.status8 += 1;
    else if (statusNumber === '9') counts.status9 += 1;
  });

  return statusCards.map((card) => ({
    ...card,
    count: counts[card.section] || 0,
    documentId: tasks.find((task) => {
      const latestStatus = task.ClientFileStatusHistory?.[task.ClientFileStatusHistory.length - 1]?.status;
      return getLastChar(latestStatus) === card.section.slice(-1);
    })?.clientFile?.name || 'N/A',
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
  isLoading.value = true
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
  } finally{
    isLoading.value =false
  }
};

const getAdmin = async () => {
  isLoading.value =true
  try {
    const response = await axios.get(`${URL}/yurist`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    adminData.value = response.data; // Store admin data
  } catch (error) {
    console.error('Error fetching admin data:', error);
  } finally{
    isLoading.value = false
  }
};

// Function to set active section
const setActiveSection = (section) => {
  activeSection.value = section;
};

// Existing functions
const getData = async () => {
  isLoading.value = true
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
        return ['8', '9'].includes(latestStatus);
      }
      return false;
    });

    data.value = { ...fetchedData, LawyerTask: filteredTasks };
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally { 
    isLoading.value = false
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
  isLoading.value = true
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
    if (newStatus == 7) {
      await axios.put(`${URL}/yurist-tasks/${selectedRejectId.value}`, {
        lawyerId: +selecteradminId.value, // Joriy foydalanuvchi lawyer bolidi
        adminId: +localStorage.getItem('id'), // Taskdagi adminId saqlanadi
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    // Oddiy taklif qilish yoki keyingi bosqichga o'tish
    else if (newStatus === 10) {
      await axios.put(`${URL}/yurist-tasks/${selectedDocId.value}`, {
        lawyerId: +adminId || +selectedAdminId.value,
        adminId: +localStorage.getItem('id'), // Taskdagi adminId saqlanadi
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
  }finally{
    isLoading.value = false
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

  if (currentStatusNumber >= 10) {
    alert("Keyingi bosqich mavjud emas, hujjat eng yuqori holatda.");
    return;
  }
  if (activeSection.value === 'status5') {
    selectedDocId.value = id;
    selectedDoc.value = filteredDocuments.value.find((doc) => doc.id === id) || null;
    isAdminModalOpen.value = true;
    getAdmin(); // Oddiy admin ma'lumotlar
  } else if (activeSection.value === 'status9') {
    selectedDocId.value = id;
    selectedDoc.value = filteredDocuments.value.find((doc) => doc.id === id) || null;
    isAdminModalOpen.value = true;
    getAdmin();
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
    '1': 'Imzolash uchun shartnoma yaratildi',
    '2': 'Shartnoma ko\'rib chiqish jarayonida',
    '3': 'Yurist zimmasiga otkazildi',
    '4': 'Kerakli hujjatlar yig\'ib chiqilmoqda',
    '5': 'Hujjatlarni yozish jarayonida',
    '6': 'Imlo xatolarini tekshirish jarayonida',
    '7': 'Davlat boji va boshqa to\'lovlarni buyurtmachi to\'liq to\'lashini kutish jarayonida',
    '8': 'Sudga taqdim etish jarayonida',
    '9': 'Sudga taqdim etildi',
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

// Fix filteredDocuments to use correct property name
const filteredDocuments = computed(() => {
  const tasks = data.value.LawyerTask || [];
  return tasks
    .filter((task) => {
      const latestStatus = task.ClientFileStatusHistory?.[task.ClientFileStatusHistory.length - 1]?.status;
      const statusNumber = getLastChar(latestStatus);
      return statusNumber === activeSection.value.slice(-1);
    })
    .map((task) => ({
      id: task.id,
      title: task.name || 'N/A',
      clientFile: task.clientFile, // Fixed typo: clentFile -> clientFile
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
    '1': 'Imzolash uchun shartnoma yaratildi',
    '2': 'Shartnoma ko\'rib chiqish jarayonida',
    '3': 'Yurist zimmasiga otkazildi',
    '4': 'Kerakli hujjatlar yig\'ib chiqilmoqda',
    '5': 'Hujjatlarni yozish jarayonida',
    '6': 'Imlo xatolarini tekshirish jarayonida',
    '7': 'Davlat boji va boshqa to\'lovlarni buyurtmachi to\'liq to\'lashini kutish jarayonida',
    '8': 'Sudga taqdim etish jarayonida',
    '9': 'Sudga taqdim etildi',
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
});
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
    <!-- Main Content -->
    <main class="flex-1 py-8">
      <div class="container mx-auto px-6">
        <!-- Status Cards as Navigation -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div
            v-for="card in dynamicStatusCards"
            :key="card.id"
            @click="setActiveSection(card.section)"
            class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border-l-4 transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer"
            :class="{
              'border-green-500': card.color === 'success' && activeSection === card.section,
              'border-red-500': card.color === 'error' && activeSection === card.section,
              'border-gray-500': card.color === 'as' && activeSection === card.section,
            }"
          >
            <div class="flex justify-between items-start">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {{ dat === 'datakril' ? translateText(card.title) : card.title }}
              </h3>
            </div>
            <div class="mt-4">
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ card.count }}</p>
            </div>
          </div>
        </div>

        <!-- Document List Section -->
        <div class="animate-fade-in">
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            <div class="p-6 flex justify-between items-center bg-gray-50 dark:bg-gray-700">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {{ dat === 'datakril' ? translateText('Yangi fayllar') : 'Yangi fayllar' }}
              </h3>
              <div class="flex space-x-3">
                <input
                  v-model="searchQuery"
                  type="text"
                  :placeholder="dat === 'datakril' ? translateText('Hujjat qidirish...') : 'Hujjat qidirish...'"
                  class="px-4 py-2 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-300"
                />
              </div>
            </div>

            <ul class="bg-white dark:bg-gray-800">
              <li v-for="(doc, index) in filteredDocuments" :key="doc.id">
                <div
                  class="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex items-center space-x-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300"
                  @click="toggleExpand(doc.id)"
                >
                  <div class="flex-1">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center space-x-4">
                        <div
                          class="w-10 h-10 border-2 border-blue-600 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-semibold"
                        >
                          {{ index + 1 }}
                        </div>
                        <span class="font-medium text-gray-900 dark:text-gray-100 line-clamp-1">
                          {{ dat === 'datakril' ? translateText(doc.title) : doc.title }}
                        </span>
                      </div>
                      <div class="flex items-center space-x-4">
                        <span class="text-sm text-gray-500 dark:text-gray-400 hidden md:block">
                          {{ format(new Date(doc.date), 'dd.MM.yyyy') }}
                        </span>
                        <span
                          class="text-gray-500 dark:text-gray-400 transition-transform duration-300"
                          :class="{ 'rotate-180': expandedDocId === doc.id }"
                        >
                          ▼
                        </span>
                      </div>
                    </div>

                    <div v-if="expandedDocId === doc.id" class="mt-6 w-full">
                      <div class="grid grid-cols-1 md:grid-cols-1 gap-4">
                        <div>
                          <p class="py-1 text-gray-500 dark:text-gray-400">
                            <span class="font-medium text-gray-800 dark:text-gray-200">
                              {{ dat === 'datakril' ? translateText('Ma\'sul Shaxs:') : 'Ma\'sul Shaxs:' }}
                            </span>
                            {{
                              dat === 'datakril'
                                ? translateText(`${doc.user.name} ${doc.user.surname} ${doc.user.dadname}`)
                                : `${doc.user.name} ${doc.user.surname} ${doc.user.dadname}`
                            }}
                          </p>
                          <p class="py-1">
                            <span class="font-medium text-gray-800 dark:text-gray-200">
                              {{ dat === 'datakril' ? translateText('Holati: ') : 'Holati: ' }}
                            </span>
                            <span class="text-gray-500 dark:text-gray-400" :class="getStatusColor(doc.status)">
                              {{
                                dat === 'datakril'
                                  ? translateText(getStatus(getLastChar(doc.status)))
                                  : getStatus(getLastChar(doc.status))
                              }}
                            </span>
                          </p>
                        </div>
                        <div>
                          <p class="md:hidden py-1 text-gray-500 dark:text-gray-400">
                            <span class="font-medium text-gray-800 dark:text-gray-200">
                              {{ dat === 'datakril' ? translateText('Sana:') : 'Sana:' }}
                            </span>
                            {{ format(new Date(doc.date), 'dd.MM.yyyy') }}
                          </p>
                        </div>
                      </div>

                      <!-- Workflow Timeline -->
                      <div class="mt-6">
                        <h4 class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                          {{ dat === 'datakril' ? translateText('Ish jarayoni holati') : 'Ish jarayoni holati' }}
                        </h4>
                        <div class="w-full overflow-scroll ">
                          <div class="inline-block min-w-full">
                            <div class="flex items-center max-w-[10px]">
                              <template v-for="(step, index) in getTimelineSteps(doc.history)" :key="step.id">
                                <div
                                  :class="[
                                    'relative flex flex-col rounded-xl bg-white dark:bg-gray-800 items-center p-3 max-w-[140px]',
                                    step.isLatestRejectionWithComment ? 'border-4 border-red-600' : 'border-4 border-green-600',
                                  ]"
                                >
                                  <div class="relative z-10">
                                    <div
                                      class="rounded-full flex items-center justify-center w-10 h-10"
                                      :class="!step.isLatestRejectionWithComment ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300' : 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300'"
                                    >
                                      <img
                                        class="w-6 h-6"
                                        :src="step.isLatestRejectionWithComment ? '/x.png' : '/check-mark.png'"
                                        :alt="
                                          dat === 'datakril'
                                            ? translateText(step.isLatestRejectionWithComment ? 'Rad etildi' : 'Bajarildi')
                                            : step.isLatestRejectionWithComment
                                            ? 'Rejected'
                                            : 'Completed'
                                        "
                                      />
                                    </div>
                                  </div>
                                  <div class="mt-3 text-center">
                                    <div class="group relative">
                                      <p class="text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-2 w-[120px] mb-1">
                                        {{ dat === 'datakril' ? translateText(step.title) : step.title }}
                                      </p>
                                      <p
                                        class="absolute -ml-[70%] hidden -mt-2 rounded-md z-40 bg-gray-800 dark:bg-gray-700 text-gray-200 dark:text-gray-100 group-hover:block min-w-[300px] text-center p-2"
                                      >
                                        {{ dat === 'datakril' ? translateText(step.title) : step.title }}
                                      </p>
                                    </div>
                                    <p class="text-sm text-orange-500 dark:text-orange-400">
                                      {{ format(new Date(step.date), 'dd.MM.yyyy') }}
                                    </p>
                                  </div>
                                </div>
                                <div v-if="index < getTimelineSteps(doc.history).length - 1">
                                  <div class="w-16 h-5 bg-gray-300 rotate-180 dark:bg-gray-700">
                                    <div
                                      class="h-full bg-green-600 dark:bg-green-700 bg-stripes"
                                      style="width: 100%"
                                    ></div>
                                  </div>
                                </div>
                              </template>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="mt-6 flex justify-end space-x-3">
                        <button
                          @click="router.push('/Check/' + doc.clientFile.clientSection.clientSectionBody.client.id)"
                          class="btn bg-blue-600 dark:bg-blue-500 text-white text-sm hover:bg-blue-700 dark:hover:bg-blue-600"
                        >
                          {{
                            dat === 'datakril'
                              ? translateText('Buyurtmachini shaxsiy kabinetiga otish')
                              : 'Buyurtmachini shaxsiy kabinetiga otish'
                          }}
                        </button>
                        <button
                          v-if="hasRejectionComment(doc.history)"
                          class="btn bg-yellow-600 dark:bg-yellow-500 text-white text-sm hover:bg-yellow-700 dark:hover:bg-yellow-600"
                          @click="openReasonModal(getLatestRejectionComment(doc.history))"
                        >
                          {{ dat === 'datakril' ? translateText('Sababni Ko\'rish') : 'Sababni Ko\'rish' }}
                        </button>
                        <button
                          class="btn bg-red-600 dark:bg-red-500 text-white text-sm hover:bg-red-700 dark:hover:bg-red-600"
                          @click="openRejectModal(doc)"
                        >
                          {{ dat === 'datakril' ? translateText('Rad etish') : 'Rad etish' }}
                        </button>
                        <button
                          class="btn bg-green-600 dark:bg-green-500 text-white text-sm hover:bg-green-700 dark:hover:bg-green-600"
                          @click="moveToNextStage(doc.id)"
                        >
                          {{
                            dat === 'datakril'
                              ? translateText('Keyingi bosqichga o\'tish')
                              : 'Keyingi bosqichga o\'tish'
                          }}
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

    <!-- Rejection Modal -->
    <div
      v-if="isModalOpen"
      @click="isModalOpen = false"
      class="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
    >
      <div @click.stop class="bg-white dark:bg-gray-800 p-6 rounded-2xl w-[400px] shadow-2xl">
        <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {{ dat === 'datakril' ? translateText('Rad qilish sababi') : 'Rad qilish sababi' }}
        </h2>
        <textarea
          v-model="comment"
          :placeholder="dat === 'datakril' ? translateText('Izoh kiriting...') : 'Izoh kiriting...'"
          class="w-full bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-500 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-300"
          required
        ></textarea>
        <div class="flex justify-end space-x-3 mt-4">
          <button @click="cancelReject" class="btn bg-gray-500 dark:bg-gray-600 text-gray-100 text-sm hover:bg-gray-600 dark:hover:bg-gray-700">
            {{ dat === 'datakril' ? translateText('Bekor qilish') : 'Bekor qilish' }}
          </button>
          <button @click="confirmReject" class="btn bg-red-600 dark:bg-red-500 text-white text-sm hover:bg-red-700 dark:hover:bg-red-600">
            {{ dat === 'datakril' ? translateText('Yuborish') : 'Yuborish' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Reason Modal -->
    <div
      v-if="isReasonModalOpen"
      @click="isReasonModalOpen = false"
      class="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
    >
      <div @click.stop class="bg-white dark:bg-gray-800 p-6 rounded-2xl w-[400px] shadow-2xl">
        <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {{ dat === 'datakril' ? translateText('Rad qilish sababi') : 'Rad qilish sababi' }}
        </h2>
        <p class="text-gray-600 dark:text-gray-300 break-words mb-4">{{ rejectionComment }}</p>
        <div class="flex justify-end">
          <button @click="closeReasonModal" class="btn bg-gray-500 dark:bg-gray-600 text-gray-100 text-sm hover:bg-gray-600 dark:hover:bg-gray-700">
            {{ dat === 'datakril' ? translateText('Yopish') : 'Yopish' }}
          </button>
        </div>
      </div>
    </div>

<!-- Admin Selection Modal -->
<div
  v-if="isAdminModalOpen"
  @click="isAdminModalOpen = false"
  class="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
>
  <div
    @click.stop
    class="bg-white dark:bg-gray-800 p-4 rounded-2xl w-[400px] max-h-[500px] border border-gray-300 dark:border-gray-700 overflow-y-auto shadow-2xl"
  >
    <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 px-3">
      {{ dat === 'datakril' ? translateText('Ma\'sul shaxsni tanlang') : 'Ma\'sul shaxsni tanlang' }}
    </h2>
    <div class="flex flex-col gap-3">
      <div
        v-for="admin in adminData"
        :key="admin.id"
        class="p-3 flex gap-4 border border-blue-600 rounded-lg items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200 relative"
        @click="selectAdmin(admin)"
        @mouseenter="showHoverModalDelayed(admin, $event.currentTarget)"
        @mouseleave="hideHoverModalDelayed"
      >
        <img
          class="w-12 h-12 rounded-full object-cover"
          :src="URL + '/upload/' + admin.img"
          :alt="dat === 'datakril' ? translateText('Rasm') : 'Image'"
        />
        <h1 class="text-sm font-bold text-gray-900 dark:text-gray-100">
          {{
            dat === 'datakril'
              ? translateText(`${admin.name} ${admin.surname} ${admin.dadname}`)
              : `${admin.name} ${admin.surname} ${admin.dadname}`
          }}
        </h1>
      </div>
    </div>
    <div class="flex justify-end space-x-3 mt-4 px-3">
      <button
        @click="cancelAdminSelection"
        class="btn bg-gray-500 dark:bg-gray-600 text-gray-100 text-sm hover:bg-gray-600 dark:hover:bg-gray-700"
      >
        {{ dat === 'datakril' ? translateText('Bekor qilish') : 'Bekor qilish' }}
      </button>
    </div>
  </div>
</div>

<!-- Hover Modal (outside the main modal) -->
<div
  v-if="showHoverModalOpen && hoveredAdmin"
  class="fixed p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-2xl z-[60] max-h-[300px] overflow-y-auto min-w-[370px]"
  :style="{ top: `${hoverPosition.top-80}px`, left: `${hoverPosition.left+350}px` }"
  @mouseenter="cancelHide"
  @mouseleave="hideHoverModalDelayed"
>
  <p class="text-gray-900 dark:text-gray-100 font-medium mb-2">
    {{ dat === 'datakril' ? translateText('Bajaradigan ishlari') : 'Bajaradigan ishlari' }}
  </p>
  <div v-if="hoveredAdmin?.LawyerTask?.length > 0">
    <div
      class="text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 flex justify-between p-3 rounded-lg my-2"
      v-for="item in hoveredAdmin.LawyerTask"
      :key="item.id"
    >
      <p class="text-gray-800 dark:text-gray-200 text-sm">
        {{ dat === 'datakril' ? translateText(item.name) : item.name }}
      </p>
      <h1 class="text-gray-800 dark:text-gray-200 text-sm">
        {{ dat === 'datakril' ? translateText('holati:') : 'holati:' }}
        <span class="text-red-500 dark:text-red-400">
          {{
            item.ClientFileStatusHistory[item.ClientFileStatusHistory.length - 1]?.status === 'status8'
              ? dat === 'datakril'
                ? translateText('Sudga taqdim etish jarayonida')
                : 'Sudga taqdim etish jarayonida'
              : item.ClientFileStatusHistory[item.ClientFileStatusHistory.length - 1]?.status === 'status5'
              ? dat === 'datakril'
                ? translateText('Hujjatlarni yozish jarayonida')
                : 'Hujjatlarni yozish jarayonida'
              : ''
          }}
        </span>
      </h1>
    </div>
  </div>
  <div v-else class="text-gray-600 dark:text-gray-300 text-center p-2 text-sm">
    {{ dat === 'datakril' ? translateText('Bajaradigan ishlari yo\'q') : 'Bajaradigan ishlari yo\'q' }}
  </div>
</div>


  </div>
</template>

<style scoped>
.btn {
  @apply inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed;
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

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

/* Progress Bar Stripes */
.bg-stripes {
  background-image: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.1) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.1) 50%,
    rgba(255, 255, 255, 0.1) 75%,
    transparent 75%,
    transparent
  );
  background-size: 1rem 1rem;
  animation: progress-bar-stripes 1s linear infinite;
}

@keyframes progress-bar-stripes {
  from {
    background-position: 1rem 0;
  }
  to {
    background-position: 0 0;
  }
}

/* Custom Shadow */
.shadow-2xl {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}
</style>