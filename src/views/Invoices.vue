<script setup>
import translateText from '@/auth/Translate'
import axios from 'axios'
import { URL } from '@/auth/url'
import { ref, inject, onMounted, watch, computed, onUnmounted } from 'vue'
import * as XLSX from 'xlsx'
import { useRoute, useRouter } from 'vue-router';
import PDFViewer from '../components/ppdf.vue'
import { useSearchStore } from '@/components/Templates/searchQuary'
const searchStore = useSearchStore()
const selectedFilePath = ref(null)
const router = useRouter()
const dat = ref(localStorage.getItem('til') || 'datalotin');

let intervalId = null;
const checkLanguageChange = () => {
  const currentLang = localStorage.getItem('til') || 'datalotin';
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
const Showmodal = ref(false)
const showChekbox = ref(false)
const modal = ref(false)
const name = ref('')
const startDate = ref('')
const endDate = ref('')
const totalSumInternal = ref('') // Internal state for raw number
const totalSumDisplay = ref('') // Display value with formatting
const file = ref('')
const chek = ref(null)
const ids = ref([])
const isLoading = inject('isLoading');
const accauntantFilesId = ref(null)

const invoices = ref([])

const filters = ref({
  // search: '',
  status: '',
  dateFrom: '',
  dateTo: ''
});

// Selected invoice for details view
const selectedInvoice = ref(null)
const showDetails = ref(false)

// Remove the computed property and replace with a function to format the display
const formatTotalSum = (value) => {
  if (!value) return ''
  return Number(value).toLocaleString('uz-UZ', { minimumFractionDigits: 0 }).replace(/,/g, '.')
}

// Function to handle totalSum input changes
const handleTotalSumChange = (event) => {
  const value = event.target.value
  // Remove all non-numeric characters
  const cleanedValue = value.replace(/[^0-9]/g, '')
  totalSumInternal.value = cleanedValue
  totalSumDisplay.value = formatTotalSum(cleanedValue)
}

// Function to prevent non-numeric input
const handleTotalSumKeydown = (event) => {
  // Allow: backspace, delete, tab, escape, enter, and navigation keys
  if ([8, 9, 27, 13, 46, 37, 38, 39, 40].includes(event.keyCode) ||
      // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      (event.ctrlKey && [65, 67, 86, 88].includes(event.keyCode))) {
    return
  }
  
  // Allow only numeric keys (0-9)
  if (event.keyCode >= 48 && event.keyCode <= 57) {
    return
  }
  
  // Allow numpad keys (0-9)
  if (event.keyCode >= 96 && event.keyCode <= 105) {
    return
  }
  
  // Prevent all other keys
  event.preventDefault()
}

// Function to handle totalSum input on blur (when user finishes typing)
const handleTotalSumBlur = () => {
  totalSumDisplay.value = formatTotalSum(totalSumInternal.value)
}

const handleImageUpload = (event) => {
  file.value = event.target.files[0]
}
const handleCkekUpload = (event) => {
  chek.value = event.target.files[0]
}

const upload = async () => {
  isLoading.value = true
  try {
    const formData = new FormData()
    formData.append('name', name.value)
    formData.append('userId', parseInt(localStorage.getItem('id')))
    formData.append('startDate', new Date(startDate.value).toISOString())
    formData.append('endDate', new Date(endDate.value).toISOString())
    formData.append('totalSum', parseInt(totalSumInternal.value)) // Send raw number
    formData.append('type', 'taxes')
    formData.append('file', file.value)
    formData.append('check', chek.value)
    const res = await axios.post(URL + '/accountant-files', formData, {
      headers: {
        "Content-Type": 'multipart/form-data'
      }
    })
    name.value = ''
    file.value = ''
    startDate.value = ''
    endDate.value = ''
    totalSumInternal.value = ''
    totalSumDisplay.value = ''
    Showmodal.value = false
    getFiles()
  } catch (err) {
    console.log(err)
  }
  finally {
    isLoading.value = false
  }
}

const getFiles = async () => {
  isLoading.value = false
  try {
    const res = await axios.get(URL + '/accountant-files');;
    let sortedData = res.data.slice().filter(item => item.type === 'taxes');

    if (searchStore.query) {
      const searchQuery = searchStore.query.toLowerCase();
      sortedData = sortedData.filter(item => {
        const lastHistory = item.History[item.History.length - 1];
        const status = getStatusClass(lastHistory.endDate).toLowerCase();
        return (
          item.id.toString().includes(searchQuery) ||
          item.name.toLowerCase().includes(searchQuery)
        );
      });
    }

    switch (filters.value.status) {
      case 'az':
        sortedData.sort((a, b) =>
          a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
        );
        break;
      case 'Paid':
        sortedData.sort((a, b) => b.id - a.id);
        break;
      case 'total':
        sortedData.sort((a, b) => {
          const endDateA = new Date(a.History[a.History.length - 1].endDate);
          const endDateB = new Date(b.History[b.History.length - 1].endDate);
          const now = new Date();
          const diffA = Math.abs(endDateA - now);
          const diffB = Math.abs(endDateB - now);
          return diffA - diffB;
        });
        break;
      default:
        break;
    }

    invoices.value = sortedData;
  } catch (err) {
    console.error('Error fetching files:', err);
  } finally {
    isLoading.value = false
  }
};

function viewInvoice(invoice) {
  selectedInvoice.value = invoice
  showDetails.value = true
}

function closeDetails() {
  showDetails.value = false
}

const filteridTime = (date) => {
  let years = date?.slice(0, 4)
  let month = date?.slice(5, 7)
  let day = date?.slice(8, 10)
  return `${day}.${month}.${years}`
}

const FilteredDots = (num) => {
  return Number(num).toLocaleString('uz-UZ', { minimumFractionDigits: 0 }).replace(/,/g, '.')
}

async function deleteManyFiles() {
  removeFiles(ids.value)
}

const removeFiles = async (ids) => {
  isLoading.value = true
  try {
    const response = await axios.delete(URL + '/accountant-files/many', {
      data: { ids }
    })
    showChekbox.value = false
    getFiles()
  } catch (error) {
    console.error('Error deleting files:', error.response?.data || error.message)
  } finally{
    isLoading.value = false
  }
}

const selectedAll = () => {
  invoices.value.forEach((el) => {
    ids.value.push(el.id)
  })
}

const openModal = (id) => {
  modal.value = true
  accauntantFilesId.value = id
}

const postHistory = async () => {
  isLoading.value = true
  try {
    const formData = new FormData()
    formData.append('file', chek.value)
    formData.append('accauntantFilesId', parseInt(accauntantFilesId.value))
    formData.append('startDate', new Date(startDate.value).toISOString())
    formData.append('endDate', new Date(endDate.value).toISOString())
    formData.append('totalSum', parseInt(totalSumInternal.value)) // Send raw number
    const res = await axios.post(URL + '/accauntant-files-history', formData, {
      headers: {
        "Content-Type": 'multipart/form-data'
      }
    })
    modal.value = false
    getFiles()
  } catch (err) {
    console.log(err)
  } finally {
    isLoading.value = false
  }
}

const getBorderClass = (endDate) => {
  if (!endDate) return 'border-black'
  const today = new Date()
  const end = new Date(endDate)
  const timeDiff = end - today
  const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24))

  if (daysRemaining > 15) {
    return 'green'
  } else if (daysRemaining <= 15 && daysRemaining > 10) {
    return 'yellow'
  } else if (daysRemaining <= 10) {
    return 'red'
  }
  return 'border-black'
}

const getStatusClass = (endDate) => {
  if (!endDate) return 'Nomalum'
  const today = new Date()
  const end = new Date(endDate)
  const timeDiff = end - today
  const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24))

  if (daysRemaining > 15) {
    return 'To\'langan'
  } else if (daysRemaining <= 15 && daysRemaining > 10) {
    return 'Qayla to\'lov yaqinlashmoqda'
  } else if (daysRemaining <= 10) {
    return 'Qayta to\'lov qilish'
  }
  return 'border-black'
}

const downloadExcel = () => {
  const today = new Date()
  const excelRows = []

  invoices.value.forEach((item) => {
    excelRows.push([
      { v: item.name, s: { fill: { fgColor: { rgb: "FFFF00" } } } },
      { v: new Date(item.createdAt).toLocaleDateString() },
      '', '', ''
    ])

    item.History.forEach((history) => {
      const endDate = new Date(history.endDate)
      const diffTime = endDate.getTime() - today.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      const rowStyle = diffDays <= 10
        ? { fill: { fgColor: { rgb: "FF0000" } } }
        : {}

      excelRows.push([
        '',
        '',
        { v: history.totalSum },
        { v: new Date(history.startDate).toLocaleDateString() },
        { v: new Date(history.endDate).toLocaleDateString(), s: rowStyle }
      ])
    })

    excelRows.push(['', '', '', '', ''])
  })

  const ws = XLSX.utils.aoa_to_sheet(excelRows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Invoices')
  XLSX.writeFile(wb, 'hisobot.xlsx')
}

const handleViewInvoice = (item) => {
  if (item.pdfPath) {
    selectedFilePath.value = URL + item.pdfPath;
  }
};

watch(() => searchStore.query, () => {
  getFiles();
});

watch(() => filters.value.status, () => {
  getFiles()
})

onMounted(() => {
  getFiles()
})
</script>
<style scoped>
/* Existing styles with added animations */
.red {
  @apply bg-[#ff0000] text-white text-[22px] rounded-lg transition-all duration-300 transform hover:scale-100
}

.yellow {
  @apply bg-[#fbff00] text-black text-[22px] rounded-lg border border-white/5 shadow-lg hover:shadow-yellow-500/20 hover:border-white/10 transition-all duration-300 transform hover:scale-100;
}

.green {
  @apply bg-[#04ff00] text-black text-[22px] rounded-lg border border-white/5 shadow-lg hover:shadow-green-500/20 hover:border-white/10 transition-all duration-300 transform hover:scale-100;
}

/* Modal Animation */
.modal-enter-active,
.modal-leave-active {
  @apply transition-all duration-500 ease-in-out;
}

.modal-enter-from,
.modal-leave-to {
  @apply opacity-0 translate-y-10;
}

.modal-enter-to,
.modal-leave-from {
  @apply opacity-100 translate-y-0;
}

/* Table Row Animation */
tbody tr {
  @apply transition-all duration-300 ease-in-out;
}

tbody tr:hover {
  @apply transform scale-[1.01] shadow-md;
}

/* Button Hover Animation */
button {
  @apply transition-all duration-200 ease-in-out;
}

button:hover {
  @apply transform scale-105 shadow-lg;
}

/* PDF Viewer Animation */
.pdf-viewer-enter-active,
.pdf-viewer-leave-active {
  @apply transition-all duration-500 ease-in-out;
}

.pdf-viewer-enter-from,
.pdf-viewer-leave-to {
  @apply opacity-0 scale-95;
}

.pdf-viewer-enter-to,
.pdf-viewer-leave-from {
  @apply opacity-100 scale-100;
}

/* Checkbox Animation */
input[type="checkbox"] + label {
  @apply transition-all duration-200 ease-in-out;
}

input[type="checkbox"]:checked + label {
  @apply bg-blue-600 border-blue-600 scale-110;
}

/* Select Dropdown Animation */
select {
  @apply transition-all duration-200 ease-in-out;
}

select:focus {
  @apply ring-2 ring-blue-500 scale-105;
}

/* Fade-in for table on mount */
.table-container {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

<template>
  <div class="dark:bg-[#1a2642] text-gray-800  dark:text-gray-200 p-7 min-h-screen">
    <!-- Invoices List View -->
    <div v-if="!showDetails" class="rounded-lg p-6 table-container">
      <div class="mb-6">
        <div class="flex justify-end gap-4">
          <div>
            <select
              id="status"
              v-model="filters.status"
              class="block text-black dark:text-white dark:bg-[#1a2642] bg-white w-full px-4 py-3 border dark:border-gray-300 border-gray-700 bg-[#fff0] text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option class="text-black dark:bg-[#1a2642] bg-white dark:text-white" value="">{{ dat === 'datakril' ? translateText('Tartib raqam') : 'Tartib raqam' }}</option>
              <option class="text-black dark:bg-[#1a2642] bg-white dark:text-white" value="Paid">{{ dat === 'datakril' ? translateText('Teskari Yaratilish vaqti') : 'Teskari Yaratilish vaqti' }}</option>
              <option class="text-black dark:bg-[#1a2642] bg-white dark:text-white" value="az">{{ dat === 'datakril' ? translateText('A-Z nom bo‘yicha') : 'A-Z nom bo‘yicha' }}</option>
              <option class="text-black dark:bg-[#1a2642] bg-white dark:text-white" value="total">{{ dat === 'datakril' ? translateText('Tugash vaqti kelganlar') : 'Tugash vaqti kelganlar' }}</option>
            </select>
          </div>
          <button
            @click="Showmodal = !Showmodal"
            class="bg-lime-600 text-white px-4 py-2 rounded-md hover:bg-lime-700 transition"
          >
            {{ dat === 'datakril' ? translateText('Yangi hisobot yaratish') : 'Yangi hisobot yaratish' }}
          </button>
          <button
            @click="downloadExcel"
            class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            {{ dat === 'datakril' ? translateText('Excel qilib yuklab olish') : 'Excel qilib yuklab olish' }}
          </button>
          <div class="flex justify-end gap-2">
            <div
              v-if="showChekbox"
              @click="deleteManyFiles()"
              class="py-2 px-4 bg-red-700 text-white flex justify-center items-center hover:bg-red-800 rounded-lg cursor-pointer transition"
            >
              {{ dat === 'datakril' ? translateText('O\'chirish') : 'O\'chirish' }}
            </div>
            <div
              v-if="!showChekbox"
              @click="showChekbox = true"
              class="py-2 px-4 bg-red-700 text-white flex justify-center items-center hover:bg-red-800 rounded-lg cursor-pointer transition"
            >
              {{ dat === 'datakril' ? translateText('O\'chirishni rejimini yoqish') : 'O\'chirishni rejimini yoqish' }}
            </div>
            <div
              v-if="showChekbox"
              @click="showChekbox = false"
              class="py-2 px-4 flex justify-center items-center bg-yellow-600 hover:bg-yellow-700 rounded-lg cursor-pointer transition"
            >
              {{ dat === 'datakril' ? translateText('O\'chirishni rejimini bekor qilish') : 'O\'chirishni rejimini bekor qilish' }}
            </div>
          </div>
        </div>
      </div>
      <div class="">
        <table class="w-full border-collapse">
          <thead>
            <tr class="dark:text-white  mb-1 w-full grid grid-cols-8 gap-2 items-center">
              <th class="p-3 text-center font-semibold">{{ dat === 'datakril' ? translateText('Hisob-faktura #') : 'Hisob-faktura #' }}</th>
              <th class="p-3 text-center font-semibold">{{ dat === 'datakril' ? translateText('Korxona') : 'Korxona' }}</th>
              <th class="p-3 text-center font-semibold">{{ dat === 'datakril' ? translateText('To\'langan sana') : 'To\'langan sana' }}</th>
              <th class="p-3 text-center font-semibold">{{ dat === 'datakril' ? translateText('Qayta to\'lov sanasi') : 'Qayta to\'lov sanasi' }}</th>
              <th class="p-3 text-center font-semibold">{{ dat === 'datakril' ? translateText('Narx') : 'Narx' }}</th>
              <th class="p-3 text-center font-semibold">{{ dat === 'datakril' ? translateText('Holati') : 'Holati' }}</th>
              <th class="p-3 text-center font-semibold flex justify-center items-center gap-4">
                {{ dat === 'datakril' ? translateText('Harakatlar') : 'Harakatlar' }}
              </th>
              <th class="p-1">
                <div
                  v-if="ids.length"
                  @click="selectedAll()"
                  class="py-2 px-4 bg-lime-500 hover:bg-lime-600 rounded-lg cursor-pointer transition"
                >
                  {{ dat === 'datakril' ? translateText('Barchasini belgilash') : 'Barchasini belgilash' }}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in invoices" :key="item.id" class="text-center">
              <td colspan="7" class="py-1">
                <div
                  :class="[getBorderClass(item.History[item.History.length - 1]?.endDate), 'rounded-lg p-2']"
                  class="flex justify-between items-center"
                >
                  <div class="w-full grid grid-cols-8 gap-2 items-center">
                    <div class="text-center">{{ item.id }}</div>
                    <div class="text-center">{{ dat === 'datakril' ? translateText(item.name) : item.name }}</div>
                    <div class="text-center">{{ filteridTime(item.History[item.History.length - 1]?.startDate) }}</div>
                    <div class="text-center">{{ filteridTime(item.History[item.History.length - 1]?.endDate) }}</div>
                    <div class="text-center">{{ FilteredDots(item.History[item.History.length - 1]?.totalSum) }} {{ dat === 'datakril' ? translateText('So\'m') : 'So\'m' }}</div>
                    <div>
                      <span class="inline-block px-2 py-1 text-center rounded-lg text-sm font-medium bg-black bg-opacity-20">
                        {{ dat === 'datakril' ? translateText(getStatusClass(item.History[item.History.length - 1]?.endDate)) : getStatusClass(item.History[item.History.length - 1]?.endDate) }}
                      </span>
                    </div>
                    <button
                      class="border border-gray-300 text-white px-2 py-1 rounded text-sm bg-blue-500 hover:bg-blue-600"
                      @click="handleViewInvoice(item)"
                    >
                      {{ dat === 'datakril' ? translateText('Shartnomani ko\'rish') : 'Shartnomani ko\'rish' }}
                    </button>
                    <div class="flex justify-evenly items-center">
                      <button
                        class="border border-gray-300 text-white px-2 py-1 rounded text-sm bg-blue-500 hover:bg-blue-600"
                        @click="router.push({ path: '/invoicesChild', query: { addressId: item.id } })"
                      >
                        {{ dat === 'datakril' ? translateText('Ko\'rish') : 'Ko\'rish' }}
                      </button>
                      <button
                        @click="openModal(item.id)"
                        class="border border-gray-300 px-2 py-1 rounded text-sm text-black bg-yellow-500 hover:bg-yellow-600"
                      >
                        {{ dat === 'datakril' ? translateText('Qayta to\'lash') : 'Qayta to\'lash' }}
                      </button>
                      <div v-if="showChekbox">
                        <input
                          type="checkbox"
                          v-model="ids"
                          :value="item.id"
                          :id="'checkbox-' + item.id"
                          class="hidden peer"
                        />
                        <label
                          :for="'checkbox-' + item.id"
                          class="inline-flex items-center justify-center w-5 h-5 rounded border border-gray-400 peer-checked:bg-blue-600 peer-checked:border-blue-600 cursor-pointer transition"
                        >
                          <svg
                            v-if="ids.includes(item.id)"
                            class="w-4 h-4 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            stroke-width="3"
                          >
                            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- Invoice Details View -->
    <div v-else class="bg-white rounded-lg shadow-lg p-6">
      <div class="flex justify-between items-center mb-6 pb-4 border-b">
        <div
          class="text-blue-600 font-medium cursor-pointer transition-all duration-200 hover:scale-105"
          @click="closeDetails"
        >
          {{ dat === 'datakril' ? translateText('← Orqaga qaytish') : '← Orqaga qaytish' }}
        </div>
      </div>
      <div class="flex justify-end gap-4">
        <button
          @click="closeDetails"
          class="border border-gray-300 px-4 py-2 rounded-md text-black hover:bg-gray-100"
        >
          {{ dat === 'datakril' ? translateText('Chiqish') : 'Chiqish' }}
        </button>
        <button
          class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          {{ dat === 'datakril' ? translateText('Excel qilib yuklab olish') : 'Excel qilib yuklab olish' }}
        </button>
      </div>
    </div>
  </div>
  <!-- PDF Viewer -->
  <transition name="pdf-viewer">
    <div
      v-if="selectedFilePath"
      class="fixed inset-0 z-40 flex min-h-[100vh] justify-center dark:bg-[#1a2642] bg-white items-center"
    >
      <div
        class="absolute top-4 right-4 cursor-pointer"
        @click="selectedFilePath = null"
      >
        <button
          class="text-2xl dark:text-gray-400 hover:text-gray-300 transition-all duration-300 hover:scale-110 hover:rotate-90 animate-fade-in"
        >
          ×
        </button>
      </div>
      <div class="w-full max-w-5xl p-5 max-h-[100vh] overflow-auto">
        <PDFViewer v-if="selectedFilePath" :file-path="selectedFilePath" />
      </div>
    </div>
  </transition>
  <!-- Create Report Modal -->
  <transition name="modal">
    <div
      v-if="Showmodal" @click="Showmodal = false"
      class="fixed inset-0 bg-black bg-opacity-80 z-40 flex justify-center items-center"
    >
      <div @click.stop
        class="bg-slate-800 text-white w-[700px] top-0 duration-500 rounded-lg p-6 relative flex flex-col gap-2"
      >
        <img
          @click="Showmodal = false"
          src="../../public/reject-White.png"
          class="absolute top-2 right-2 w-8 cursor-pointer hover:scale-110 transition-all duration-200"
          :alt="dat === 'datakril' ? translateText('Yopish') : 'Yopish'"
        />
        <h4 class="text-lg text-white font-semibold">{{ dat === 'datakril' ? translateText('Hisobot yaratish') : 'Hisobot yaratish' }}</h4>
        <label>{{ dat === 'datakril' ? translateText('Korxona nomini kiriting') : 'Korxona nomini kiriting' }}</label>
        <input
          v-model="name"
          type="text"
          class="text-black outline-none p-2 rounded-md transition-all duration-200 focus:ring-2 focus:ring-blue-500"
          :placeholder="dat === 'datakril' ? translateText('Hisobot nomi kiriting') : 'Hisobot nomi kiriting'"
        />
        <label>{{ dat === 'datakril' ? translateText('To\'lanadigan summani') : 'To\'lanadigan summani' }}</label>
        <input
          :value="totalSumDisplay"
          @input="handleTotalSumChange"
          @keydown="handleTotalSumKeydown"
          @blur="handleTotalSumBlur"
          type="text"
          class="text-black outline-none p-2 rounded-md transition-all duration-200 focus:ring-2 focus:ring-blue-500"
          :placeholder="dat === 'datakril' ? translateText('To\'lanadigan summani') : 'To\'lanadigan summani'"
        />
        <label>{{ dat === 'datakril' ? translateText('Shartnoma amal qilishni boshlagan sanani kiriting') : 'Shartnoma amal qilishni boshlagan sanani kiriting' }}</label>
        <input
          v-model="startDate"
          type="date"
          class="text-black outline-none p-2 rounded-md transition-all duration-200 focus:ring-2 focus:ring-blue-500"
        />
        <label>{{ dat === 'datakril' ? translateText('Shartnoma amal qilishdan tugaydigan sanani kiriting') : 'Shartnoma amal qilishdan tugaydigan sanani kiriting' }}</label>
        <input
          v-model="endDate"
          type="date"
          class="text-black outline-none p-2 rounded-md transition-all duration-200 focus:ring-2 focus:ring-blue-500"
        />
        <div class="flex">
          <div>
            <label>{{ dat === 'datakril' ? translateText('Shartnomani kiriting') : 'Shartnomani kiriting' }}</label>
            <input
              @change="handleImageUpload"
              type="file"
              class="outline-none p-2 rounded-md transition-all duration-200"
            />
          </div>
          <div>
            <label>{{ dat === 'datakril' ? translateText('Chekni kiriting') : 'Chekni kiriting' }}</label>
            <input
              @change="handleCkekUpload"
              type="file"
              class="outline-none p-2 rounded-md transition-all duration-200"
            />
          </div>
        </div>
        <div class="flex gap-2">
          <button
            @click="Showmodal = false"
            class="bg-red-600 text-white px-4 py-2 w-full rounded-md hover:bg-red-700"
          >
            {{ dat === 'datakril' ? translateText('Bekor qilish') : 'Bekor qilish' }}
          </button>
          <button
            @click="upload"
            class="bg-blue-600 text-white px-4 py-2 w-full rounded-md hover:bg-blue-700"
          >
            {{ dat === 'datakril' ? translateText('Yuborish') : 'Yuborish' }}
          </button>
        </div>
      </div>
    </div>
  </transition>
  <!-- Repayment Modal -->
  <transition name="modal">
    <div
      v-if="modal" @click="modal = false"
      class="fixed inset-0 group bg-black bg-opacity-80 z-40 flex justify-center items-center"
    >
      <div
      @click.stop

        class="bg-slate-800 w-[500px] top-0 text-white rounded-lg p-6 relative flex flex-col gap-2"
      >
        <img
          @click="modal = false"
          src="../../public/reject-White.png"
          class="absolute top-2 right-2 w-8 cursor-pointer hover:scale-110 transition-all duration-200"
          :alt="dat === 'datakril' ? translateText('Yopish') : 'Yopish'"
        />
        <h4 class="text-lg font-semibold">{{ dat === 'datakril' ? translateText('Qayta to\'lash') : 'Qayta to\'lash' }}</h4>
        <label>{{ dat === 'datakril' ? translateText('To\'lanadigan summani') : 'To\'lanadigan summani' }}</label>
        <input
          :value="totalSumDisplay"
          @input="handleTotalSumChange"
          @keydown="handleTotalSumKeydown"
          @blur="handleTotalSumBlur"
          type="text"
          class="outline-none text-black p-2 rounded-md transition-all duration-200 focus:ring-2 focus:ring-blue-500"
          :placeholder="dat === 'datakril' ? translateText('To\'lanadigan summani') : 'To\'lanadigan summani'"
        />
        <label>{{ dat === 'datakril' ? translateText('Shartnoma amal qilishni boshlagan sanani kiriting') : 'Shartnoma amal qilishni boshlagan sanani kiriting' }}</label>
        <input
          v-model="startDate"
          type="date"
          class="outline-none text-black p-2 rounded-md transition-all duration-200 focus:ring-2 focus:ring-blue-500"
        />
        <label>{{ dat === 'datakril' ? translateText('Shartnoma amal qilishdan tugaydigan sanani kiriting') : 'Shartnoma amal qilishdan tugaydigan sanani kiriting' }}</label>
        <input
          v-model="endDate"
          type="date"
          class="outline-none text-black p-2 rounded-md transition-all duration-200 focus:ring-2 focus:ring-blue-500"
        />
        <label>{{ dat === 'datakril' ? translateText('Chekni kiriting') : 'Chekni kiriting' }}</label>
        <input
          @change="handleCkekUpload"
          type="file"
          class="outline-none p-2 rounded-md transition-all duration-200"
        />
        <div class="flex gap-2">
          <button
            @click="modal = false"
            class="bg-red-600 text-white px-4 py-2 w-full rounded-md hover:bg-red-700"
          >
            {{ dat === 'datakril' ? translateText('Bekor qilish') : 'Bekor qilish' }}
          </button>
          <button
            @click="postHistory"
            class="bg-blue-600 text-white px-4 py-2 w-full rounded-md hover:bg-blue-700"
          >
            {{ dat === 'datakril' ? translateText('Yuborish') : 'Yuborish' }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>