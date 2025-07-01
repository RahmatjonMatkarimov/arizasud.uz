<script setup>
import { ref, computed, inject, onUnmounted } from 'vue';
import { format } from 'date-fns';
import { onMounted } from 'vue';
import axios from 'axios';
import { URL } from '@/auth/url';
import { useRouter } from 'vue-router';
import translateText from '@/auth/Translate';
// Reactive state for navigation
const activeSection = ref('status1'); // Default section: Qabul qilingan fayllar (status1)

// Existing reactive state
const data = ref([]);
const isLoading = inject('isLoading')
const comment = ref('');
const openDropdownId = ref(null);
const isModalOpen = ref(false);
const selectedRejectId = ref(null);
const arr = ref([])
const status = ref();
const router = useRouter();
const expandedDocId = ref(null);
const searchQuery = ref('');
const isReasonModalOpen = ref(false);
const rejectionComment = ref('');
const bunus = ref(false)
const isAdminModalOpen = ref(false);
const adminData = ref([]);
const selectedAdminId = ref(null);
const selectedDoc = ref(null); // Store the full document object
const selectedDocId = ref(null);
const hoveredAdmin = ref(null);
const showHoverModalOpen = ref(false);
const sum3 = ref(0)
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

const statusCards = [
  {
    id: 1,
    title: 'Ko\'rib chiqish uchun kelgan fayllar',
    count: 0,
    documentId: '',
    status: 'accepted',
    color: 'success',
    section: 'status1',
  },
  {
    id: 2,
    title: 'Yurist zimmasiga otkaziladigan fayllar',
    count: 0,
    documentId: 'N/A',
    status: 'rejected',
    color: 'error',
    section: 'status2',
  },
  {
    id: 3,
    title: 'Yordamchi yuristga zimmasiga otkazadigan fayllar',
    count: 0,
    documentId: 'N/A',
    status: 'rejected',
    color: 'as',
    section: 'status3',
  },
  {
    id: 4,
    title: 'To\'liq tugallangan fayllar',
    count: 0,
    documentId: 'N/A',
    status: 'rejected',
    color: 'bonus',
    section: 'status10',
  },
];

const dynamicStatusCards = computed(() => {
  const tasks = data.value.LawyerTask || [];
  const counts = {
    status1: 0,
    status2: 0,
    status3: 0,
    status10: 0,
  };

  tasks.forEach((task) => {
    const latestStatus = task.ClientFileStatusHistory?.[task.ClientFileStatusHistory.length - 1]?.status;
    const statusNumber = getLastChar(latestStatus);
    if (statusNumber === '1') counts.status1 += 1;
    else if (statusNumber === '2') counts.status2 += 1;
    else if (statusNumber === '3') counts.status3 += 1;
    else if (statusNumber === '10') counts.status10 += 1;
  });

  return statusCards.map((card) => ({
    ...card,
    count: counts[card.section] || 0,
    documentId: tasks.find((task) => {
      const latestStatus = task.ClientFileStatusHistory?.[task.ClientFileStatusHistory.length - 1]?.status;
      return getLastChar(latestStatus) === card.section.replace('status', ''); // Use full status number
    })?.clientFile?.name || 'N/A',
  }));
});

// Update confirmAdminSelection to call createTasks
const confirmAdminSelection = async () => {
  if (!selectedAdminId.value || selectedAdminId.value <= 0) {
    console.error('Invalid admin ID:', selectedAdminId.value);
    alert("Iltimos, ma'sul shaxsni tanlang. Admin ID noto‘g‘ri.");
    throw new Error('Invalid admin ID');
  }

  if (!selectedDoc.value || !selectedDoc.value.title || !selectedDocId.value || !selectedDoc.value.clientFile?.id) {
    console.error('Invalid document data:', selectedDoc.value, selectedDocId.value);
    alert("Hujjat ma'lumotlari topilmadi yoki hujjat nomi yoki clientFile ID mavjud emas.");
    throw new Error('Invalid document data');
  }

  const task = data.value.LawyerTask.find((t) => t.id === selectedDocId.value);
  if (!task) {
    console.error('Task not found for ID:', selectedDocId.value);
    alert('Hujjat topilmadi.');
    throw new Error('Task not found');
  }


  const latestStatus = task.ClientFileStatusHistory?.[task.ClientFileStatusHistory.length - 1]?.status;
  const currentStatusNumber = parseInt(getLastChar(latestStatus)) || 1;
  const lawyerId = selectedAdminId.value;

  isLoading.value = true
  try {
    // Update the status with the selected admin ID
    await updateType(selectedDocId.value, currentStatusNumber + 1, '', lawyerId);
    isAdminModalOpen.value = false;
  } catch (error) {
    console.error('Error in confirmAdminSelection:', error.response?.data || error.message);
    throw error; // Propagate error to selectAdmin
  } finally {
    isLoading.value = false
  }
};

const getAdmin = async () => {
  isLoading.value = true
  try {
    const response = await axios.get(`${URL}/yuristAssistant`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    adminData.value = response.data; // Store admin data
  } catch (error) {
    console.error('Error fetching admin data:', error);
  } isLoading.value = false
};

// Function to set active section
const setActiveSection = (section) => {
  activeSection.value = section;
};
const getData = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get(`${URL}/yurist/${localStorage.getItem('id')}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    const fetchedData = response.data;
    const filteredTasks = fetchedData.LawyerTask.filter((item) => {
      if (item.ClientFileStatusHistory && item.ClientFileStatusHistory.length > 0) {
        const latestStatusEntry = item.ClientFileStatusHistory[item.ClientFileStatusHistory.length - 1];
        const latestStatus = getLastChar(latestStatusEntry.status);
        status.value = latestStatus;
        return ['1', '2', '3', '10'].includes(latestStatus);
      }
      return false;
    });
    data.value = { ...fetchedData, LawyerTask: filteredTasks };
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    isLoading.value = false;
  }
};
const addbonuses = async (item) => {
let summa = ref(item.clientFile.ClientPayment[0].TotalSum)
let paymentID = ref(item.clientFile.ClientPayment[0].id)
let count = 0
  arr.value = [...new Set(item.LawyerTaskHistory.map(el => el.lawyerId))];
  const res = await axios.post(`${URL}/deliverer/workdayIds`, {
    userIds: arr.value
  })
  for (let [key, value] of Object.entries(res.data)) {
    const res = await axios.post(URL + "/bonus", {
      userId: parseInt(key),
      workDayId: parseInt(value),
      amount: parseFloat(sum3.value),
      description: item.name,
    });
    count++
  }
  const response = await axios.put(`${URL}/yurist-tasks/${item.id}`, {
    btnStatus: true
  })

    const resp = await axios.put(`${URL}/client-pay/${paymentID.value}`, {
    netProfit: +summa.value - (+sum3.value * +count)
  })
}

const sortes = (item) => {
  const unique = new Map();
  item.LawyerTaskHistory.forEach(el => {
    if (!unique.has(el.lawyerId)) {
      unique.set(el.lawyerId, el); // faqat birinchi uchragan id asosida qo'shiladi
    }
  });
  return Array.from(unique.values()); // obyektlar massivga qayta aylantiriladi
};



const fetchRecords = async () => {
  isLoading.value = true
  try {
    const res = await axios.get(`${URL}/monthly-cost`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    sum3.value = res.data[0].sum3
  } catch (err) {
    showToast(err, "error");
  } finally {
    isLoading.value = false
  }
};
const getLastChar = (str) => {
  if (!str || typeof str !== 'string') return '1'; // Default to '1' if status is invalid
  const match = str.match(/status(\d+)$/); // Extract the number after 'status'
  return match ? match[1] : '1'; // Return the number or default to '1'
};

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

    // status1, status2, status3, status4 uchun so'rov
    if ([1, 2, 3, 4].includes(newStatus)) {
      await axios.post(`${URL}/client-file-status-history`, payload);
    }

    openDropdownId.value = null;
    isModalOpen.value = false;
    comment.value = '';
    selectedRejectId.value = null;
    isAdminModalOpen.value = false;

    await getData(); // Yangilangan ma'lumotlarni qayta yuklash
  } catch (error) {
    console.error('Error updating data:', error.response?.data || error.message);
  } finally {
    isLoading.value = false
  }
};

const openRejectModal = (id) => {
  selectedRejectId.value = id.id;
  
  isModalOpen.value = true;
  openDropdownId.value = null;
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

  if (activeSection.value === 'status3') {
    selectedDocId.value = id;
    selectedDoc.value = filteredDocuments.value.find((doc) => doc.id === id) || null;
    if (!selectedDoc.value) {
      alert('Hujjat ma’lumotlari topilmadi.');
      return;
    }
    isAdminModalOpen.value = true;
  } else {
    updateType(id, currentStatusNumber + 1);
  }
};

const selectAdmin = async (admin) => {
  selectedAdminId.value = admin.id;

  // Store selectedDocId locally to preserve it
  const taskId = selectedDocId.value;

  // Validate taskId before proceeding
  if (!taskId || taskId <= 0) {
    console.error('Invalid task ID:', taskId);
    alert('Hujjat tanlanmadi yoki noto‘g‘ri ID. Iltimos, hujjatni qaytadan tanlang.');
    return;
  }

  // Call confirmAdminSelection to handle status update
  isLoading.value = true
  try {
    await confirmAdminSelection();
  } catch (error) {
    console.error('Error in confirmAdminSelection:', error);
    alert('Holatni yangilashda xatolik yuz berdi. Iltimos, qaytadan urinib ko‘ring.');
    return;
  }

  // Perform the axios.put request using the stored taskId
  try {
    await axios.put(
      `${URL}/yurist-tasks/${taskId}`,
      {
        lawyerId: +selectedAdminId.value,
        adminId: +localStorage.getItem('id'),
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    selectedAdminId.value = null;
    selectedDocId.value = null;
    selectedDoc.value = null;
  } catch (error) {
    console.error('Error updating lawyer task:', error.response?.data || error.message);
    alert('Yurist topshiriqni yangilashda xatolik: ' + (error.response?.data?.message || error.message || 'Iltimos, qaytadan urinib ko‘ring.'));
  } finally {
    isLoading.value = false
  }
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
    '1': dat.value === 'datakril' ? translateText('Imzolash uchun shartnoma yaratildi') : 'Imzolash uchun shartnoma yaratildi',
    '2': dat.value === 'datakril' ? translateText('Shartnoma ko\'rib chiqish jarayonida') : 'Shartnoma ko\'rib chiqish jarayonida',
    '3': dat.value === 'datakril' ? translateText('Yurist zimmasiga otkazildi') : 'Yurist zimmasiga otkazildi',
    '4': dat.value === 'datakril' ? translateText('Kerakli hujjatlar yig\'ib chiqilmoqda') : 'Kerakli hujjatlar yig\'ib chiqilmoqda',
    '5': dat.value === 'datakril' ? translateText('Hujjatlarni yozish jarayonida') : 'Hujjatlarni yozish jarayonida',
    '6': dat.value === 'datakril' ? translateText('Imlo xatolarini tekshirish jarayonida') : 'Imlo xatolarini tekshirish jarayonida',
    '7': dat.value === 'datakril' ? translateText('Davlat boji va boshqa to\'lovlarni buyurtmachi to\'liq to\'lashini kutish jarayonida') : 'Davlat boji va boshqa to\'lovlarni buyurtmachi to\'liq to\'lashini kutish jarayonida',
    '8': dat.value === 'datakril' ? translateText('Sudga taqdim etish jarayonida') : 'Sudga taqdim etish jarayonida',
    '9': dat.value === 'datakril' ? translateText('Sudga taqdim etildi') : 'Sudga taqdim etildi',
    '10': dat.value === 'datakril' ? translateText('Bonuslar') : 'Bonuslar', // Add this line
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
    case '10':
      return 'text-yellow-600';
    default:
      return 'text-gray-600';
  }
};
const filteredDocuments = computed(() => {
  const tasks = data.value.LawyerTask || [];
  const activeStatusNumber = activeSection.value.replace('status', '') || '1';

  return tasks
    .filter((task) => {
      const latestStatus = task.ClientFileStatusHistory?.[task.ClientFileStatusHistory.length - 1]?.status || 'status1';
      const statusNumber = getLastChar(latestStatus);
      return statusNumber === activeStatusNumber;
    })
    .map((task) => ({
      id: task.id,
      all: task,
      title: task.name || 'N/A',
      clientFile: task.clientFile,
      status: task.ClientFileStatusHistory?.[task.ClientFileStatusHistory.length - 1]?.status || 'status1',
      date: task.createdAt || new Date(),
      user: task.user,
      type: task.clientFile?.type || 'contract',
      assignedTo: 'Legal Department',
      priority: 'medium',
      history: task.ClientFileStatusHistory || [],
    }))
    .filter((doc) =>
      doc.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
});
const getTimelineSteps = (history) => {
  const steps = [];
  const statusMap = {
    '1': dat.value === 'datakril' ? translateText('Imzolash uchun shartnoma yaratildi') : 'Imzolash uchun shartnoma yaratildi',
    '2': dat.value === 'datakril' ? translateText('Shartnoma ko\'rib chiqish jarayonida') : 'Shartnoma ko\'rib chiqish jarayonida',
    '3': dat.value === 'datakril' ? translateText('Yurist zimmasiga otkazildi') : 'Yurist zimmasiga otkazildi',
    '4': dat.value === 'datakril' ? translateText('Kerakli hujjatlar yig\'ib chiqilmoqda') : 'Kerakli hujjatlar yig\'ib chiqilmoqda',
    '5': dat.value === 'datakril' ? translateText('Hujjatlarni yozish jarayonida') : 'Hujjatlarni yozish jarayonida',
    '6': dat.value === 'datakril' ? translateText('Imlo xatolarini tekshirish jarayonida') : 'Imlo xatolarini tekshirish jarayonida',
    '7': dat.value === 'datakril' ? translateText('Davlat boji va boshqa to\'lovlarni buyurtmachi to\'liq to\'lashini kutish jarayonida') : 'Davlat boji va boshqa to\'lovlarni buyurtmachi to\'liq to\'lashini kutish jarayonida',
    '8': dat.value === 'datakril' ? translateText('Sudga taqdim etish jarayonida') : 'Sudga taqdim etish jarayonida',
    '9': dat.value === 'datakril' ? translateText('Sudga taqdim etildi') : 'Sudga taqdim etildi',
    '10': dat.value === 'datakril' ? translateText('Bonuslar') : 'Bonuslar',
  };

  const sortedHistory = [...history].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  const currentStatusNumber = sortedHistory.length > 0
    ? getLastChar(sortedHistory[sortedHistory.length - 1].status) || '1'
    : '1';

  const latestStatusEntries = {};
  sortedHistory.forEach((entry) => {
    const statusNumber = getLastChar(entry.status) || '1';
    if (parseInt(statusNumber) <= parseInt(currentStatusNumber)) {
      latestStatusEntries[statusNumber] = entry;
    }
  });

  const isLatestRejection = hasRejectionComment(history);
  const latestRejectionStatus = isLatestRejection
    ? getLastChar(sortedHistory[sortedHistory.length - 1].status) || '1'
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
        isLatestRejectionWithComment: isLatestRejection && statusNumber === parseInt(latestRejectionStatus),
      });
    });

  return steps;
};

const toggleExpand = (id) => {
  expandedDocId.value = expandedDocId.value === id ? null : id;
};

onMounted(() => {
  getData();
  fetchRecords()
  getAdmin();
});
</script>


<template>
  <div
    class="min-h-screen flex flex-col bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
    <!-- Main Content -->
    <main class="flex-1 py-8">
      <div class="container mx-auto px-6">
        <!-- Status Cards as Navigation -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div v-for="card in dynamicStatusCards" :key="card.id" @click="setActiveSection(card.section)"
            class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border-l-4 transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer"
            :class="{
              'border-green-500': card.color === 'success' && activeSection === card.section,
              'border-red-500': card.color === 'error' && activeSection === card.section,
              'border-gray-500': card.color === 'as' && activeSection === card.section,
              'border-yellow-500': card.color === 'bonus' && activeSection === card.section, // Add for status10
            }">
            <div class="flex justify-between items-start">
              <h3 class="text-md font-semibold text-gray-900 dark:text-gray-100">
                {{ dat === 'datakril' ? translateText(card.title) : card.title }}
              </h3>
            </div>
            <div class="mt-4">
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ card.count }}</p>
            </div>
          </div>
        </div>

        <!-- Document List Section -->
        <div class="animate-fade-in ">
          <div class="bg-white dark:bg-gray-800  rounded-2xl shadow-lg overflow-hidden">
            <div class="p-6 flex justify-between items-center bg-gray-50 dark:bg-gray-700">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {{ dat === 'datakril' ? translateText('Yangi fayllar') : 'Yangi fayllar' }}
              </h3>
              <div class="flex space-x-3">
                <input v-model="searchQuery" type="text"
                  :placeholder="dat === 'datakril' ? translateText('Hujjat qidirish...') : 'Hujjat qidirish...'"
                  class="px-4 py-2 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-300" />
              </div>
            </div>

            <ul class="bg-white dark:bg-gray-800 ">
              <li v-for="(doc, index) in filteredDocuments" :key="doc.id">
                <div v-if="bunus" @click="bunus = false"
                  class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
                  <!-- Modal Content -->
                  <div @click.stop
                    class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden transform transition-all duration-300 animate-in zoom-in-95 slide-in-from-bottom-4">
                    <!-- Header -->
                    <div
                      class="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 p-6 text-white relative overflow-hidden">
                      <div class="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                      <div class="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
                      <div class="absolute -bottom-2 -left-2 w-16 h-16 bg-white/10 rounded-full"></div>

                      <div class="relative z-10 flex items-center justify-between">
                        <div>
                          <h2 class="text-3xl font-bold mb-2 flex items-center">
                            {{ dat === 'datakril' ? translateText('Bonuslar') : 'Bonuslar' }}
                          </h2>
                          <p v-if="!doc.all.btnStatus" class="text-white/80 text-lg">
                            {{ dat === 'datakril' ? translateText('Bunus qoshilishi kerak bo\'lgan ishchilar') : 'Bunus qoshilishi kerak bo\'lgan ishchilar' }}
                          </p>
                          <p v-if="doc.all.btnStatus" class="text-white/80 text-lg">
                            {{ dat === 'datakril' ? translateText('Bunus qo\'shilgan ishchilar') : 'Bunus qo\'shilgan ishchilar' }}
                          </p>
                        </div>

                        <button @click="bunus = false"
                          class="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200 flex items-center justify-center group">
                          <svg class="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" fill="none"
                            stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <!-- Content -->
                    <div
                      class="p-6 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                      <!-- Grid of person cards -->
                      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <div v-for="item in sortes(doc.all)" :key="item.id"
                          class="group bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-600 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                          <div class="flex items-center space-x-4">
                            <!-- Avatar -->
                            <div
                              class="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-blue-500  overflow-hidden flex items-center justify-center text-white font-bold text-lg shadow-lg ring-4 ring-white/20">
                              <img :src="URL + '/upload/' + item.img" alt="">
                            </div>
                            <!-- Info -->
                            <div class="flex-1 min-w-0">
                              <h3 class="font-semibold text-gray-900 dark:text-gray-100 text-lg truncate">
                                {{ dat === 'datakril' ? translateText(`${item.name} ${item.surname}`) : `${item.name}
                                ${item.surname}` }}
                              </h3>
                              <p class="text-gray-600 dark:text-gray-400 text-sm truncate">
                                {{ dat === 'datakril' ? translateText(item.dadname) : item.dadname }}
                              </p>
                            </div>

                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Footer -->
                    <div
                      class="bg-gray-50 dark:bg-gray-900 px-6 py-4 flex items-center justify-between rounded-b-3xl border-t border-gray-200 dark:border-gray-700">
                      <div></div>

                      <div class="flex space-x-3">
                        <button @click="bunus = false"
                          class="px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 font-medium">
                          {{ dat === 'datakril' ? translateText('Bekor qilish') : 'Bekor qilish' }}
                        </button>
                        <button @click="addbonuses(doc.all)"
                        v-if="doc.all.clientFile.ClientPayment[0].TotalSum > 1000000 && !doc.all.btnStatus"
                          class="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2">
                          <span>{{ dat === 'datakril' ? translateText('Yuborish') : 'Yuborish' }}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  class="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex items-center space-x-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300"
                  @click="toggleExpand(doc.id)">
                  <div class="flex-1">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center space-x-4">
                        <div
                          class="w-10 h-10 border-2 border-blue-600 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-semibold">
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
                        <span class="text-gray-500 dark:text-gray-400 transition-transform duration-300"
                          :class="{ 'rotate-180': expandedDocId === doc.id }">
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
                                <div :class="[
                                  'relative flex flex-col rounded-xl bg-white dark:bg-gray-800 items-center p-3 max-w-[140px]',
                                  step.isLatestRejectionWithComment ? 'border-4 border-red-600' : 'border-4 border-green-600',
                                ]">
                                  <div class="relative z-10">
                                    <div class="rounded-full flex items-center justify-center w-10 h-10"
                                      :class="!step.isLatestRejectionWithComment ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300' : 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300'">
                                      <img class="w-6 h-6"
                                        :src="step.isLatestRejectionWithComment ? '/x.png' : '/check-mark.png'" :alt="dat === 'datakril'
                                          ? translateText(step.isLatestRejectionWithComment ? 'Rad etildi' : 'Bajarildi')
                                          : step.isLatestRejectionWithComment
                                            ? 'Rejected'
                                            : 'Completed'
                                          " />
                                    </div>
                                  </div>
                                  <div class="mt-3 text-center">
                                    <div class="group relative">
                                      <p
                                        class="text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-2 w-[120px] mb-1">
                                        {{ dat === 'datakril' ? translateText(step.title) : step.title }}
                                      </p>
                                      <p
                                        class="absolute -ml-[70%] hidden -mt-2 rounded-md z-40 bg-gray-800 dark:bg-gray-700 text-gray-200 dark:text-gray-100 group-hover:block min-w-[300px] text-center p-2">
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
                                    <div class="h-full bg-green-600 dark:bg-green-700 bg-stripes" style="width: 100%">
                                    </div>
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
                          class="btn bg-blue-600 dark:bg-blue-500 text-white text-sm hover:bg-blue-700 dark:hover:bg-blue-600">
                          {{
                            dat === 'datakril'
                              ? translateText('Buyurtmachini shaxsiy kabinetiga otish')
                              : 'Buyurtmachini shaxsiy kabinetiga otish'
                          }}
                        </button>
                        <button v-if="hasRejectionComment(doc.history)"
                          class="btn bg-yellow-600 dark:bg-yellow-500 text-white text-sm hover:bg-yellow-700 dark:hover:bg-yellow-600"
                          @click="openReasonModal(getLatestRejectionComment(doc.history))">
                          {{ dat === 'datakril' ? translateText('Sababni Ko\'rish') : 'Sababni Ko\'rish' }}
                        </button>
                        <button v-if="activeSection !== 'status1'&&activeSection !== 'status10'"
                          class="btn bg-red-600 dark:bg-red-500 text-white text-sm hover:bg-red-700 dark:hover:bg-red-600"
                          @click="openRejectModal(doc)">
                          {{ dat === 'datakril' ? translateText('Rad etish') : 'Rad etish' }}
                        </button>
                        <button v-if="activeSection !== 'status10'"
                          class="btn bg-green-600 dark:bg-green-500 text-white text-sm hover:bg-green-700 dark:hover:bg-green-600"
                          @click="moveToNextStage(doc.id)">
                          {{
                            dat === 'datakril'
                              ? translateText('Keyingi bosqichga o\'tish')
                              : 'Keyingi bosqichga o\'tish'
                          }}
                        </button>
                        <button v-if="activeSection === 'status10'"
                          class="btn bg-green-600 dark:bg-green-500 text-white text-sm hover:bg-green-700 dark:hover:bg-green-600"
                          @click="bunus = true">
                          {{
                            dat === 'datakril'
                              ? translateText('bonuslarni tarqatish')
                              : 'bonuslarni tarqatish'
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
    <div v-if="isModalOpen" @click="isModalOpen = false"
      class="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div @click.stop class="bg-white dark:bg-gray-800 p-6 rounded-2xl w-[400px] shadow-2xl">
        <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {{ dat === 'datakril' ? translateText('Rad qilish sababi') : 'Rad qilish sababi' }}
        </h2>
        <textarea v-model="comment"
          :placeholder="dat === 'datakril' ? translateText('Izoh kiriting...') : 'Izoh kiriting...'"
          class="w-full bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-500 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-300"
          required></textarea>
        <div class="flex justify-end space-x-3 mt-4">
          <button @click="cancelReject"
            class="btn bg-gray-500 dark:bg-gray-600 text-gray-100 text-sm hover:bg-gray-600 dark:hover:bg-gray-700">
            {{ dat === 'datakril' ? translateText('Bekor qilish') : 'Bekor qilish' }}
          </button>
          <button @click="confirmReject"
            class="btn bg-red-600 dark:bg-red-500 text-white text-sm hover:bg-red-700 dark:hover:bg-red-600">
            {{ dat === 'datakril' ? translateText('Yuborish') : 'Yuborish' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Reason Modal -->
    <div v-if="isReasonModalOpen" @click="isReasonModalOpen = false"
      class="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div @click.stop class="bg-white dark:bg-gray-800 p-6 rounded-2xl w-[400px] shadow-2xl">
        <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {{ dat === 'datakril' ? translateText('Rad qilish sababi') : 'Rad qilish sababi' }}
        </h2>
        <p class="text-gray-600 dark:text-gray-300 break-words mb-4">{{ rejectionComment }}</p>
        <div class="flex justify-end">
          <button @click="closeReasonModal"
            class="btn bg-gray-500 dark:bg-gray-600 text-gray-100 text-sm hover:bg-gray-600 dark:hover:bg-gray-700">
            {{ dat === 'datakril' ? translateText('Yopish') : 'Yopish' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Admin Selection Modal -->
    <div v-if="isAdminModalOpen" @click="isAdminModalOpen = false"
      class="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div @click.stop
        class="bg-white dark:bg-gray-800 p-4 rounded-2xl w-[400px] max-h-[500px] border border-gray-300 dark:border-gray-700 overflow-y-auto shadow-2xl">
        <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 px-3">
          {{ dat === 'datakril' ? translateText('Ma\'sul shaxsni tanlang') : 'Ma\'sul shaxsni tanlang' }}
        </h2>
        <div class="flex flex-col gap-3">
          <div v-for="admin in adminData" :key="admin.id"
            class="p-3 flex gap-4 border border-blue-600 rounded-lg items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200 relative"
            @click="selectAdmin(admin)" @mouseenter="showHoverModalDelayed(admin, $event.currentTarget)"
            @mouseleave="hideHoverModalDelayed">
            <img class="w-12 h-12 rounded-full object-cover" :src="URL + '/upload/' + admin.img"
              :alt="dat === 'datakril' ? translateText('Rasm') : 'Image'" />
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
          <button @click="cancelAdminSelection"
            class="btn bg-gray-500 dark:bg-gray-600 text-gray-100 text-sm hover:bg-gray-600 dark:hover:bg-gray-700">
            {{ dat === 'datakril' ? translateText('Bekor qilish') : 'Bekor qilish' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Hover Modal (outside the main modal) -->
    <div v-if="showHoverModalOpen && hoveredAdmin"
      class="fixed p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-2xl z-[60] max-h-[300px] overflow-y-auto min-w-[370px]"
      :style="{ top: `${hoverPosition.top - 80}px`, left: `${hoverPosition.left + 350}px` }" @mouseenter="cancelHide"
      @mouseleave="hideHoverModalDelayed">
      <p class="text-gray-900 dark:text-gray-100 font-medium mb-2">
        {{ dat === 'datakril' ? translateText('Bajaradigan ishlari') : 'Bajaradigan ishlari' }}
      </p>
      <div v-if="hoveredAdmin?.LawyerTask?.length > 0">
        <div
          class="text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 flex justify-between p-3 rounded-lg my-2"
          v-for="item in hoveredAdmin.LawyerTask" :key="item.id">
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
  background-image: linear-gradient(45deg,
      rgba(255, 255, 255, 0.1) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.1) 50%,
      rgba(255, 255, 255, 0.1) 75%,
      transparent 75%,
      transparent);
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