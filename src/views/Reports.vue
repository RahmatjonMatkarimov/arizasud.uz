<script setup>
import translateText from '@/auth/Translate'
import axios from 'axios'
import { URL } from '@/auth/url'
import { ref, inject, onMounted, watch } from 'vue'
import * as XLSX from 'xlsx'
import { useRoute, useRouter } from 'vue-router';
import PDFViewer from '../components/ppdf.vue'

const selectedFilePath = ref(null)
const router = useRouter()
const dat = inject('dat')
const Showmodal = ref(false)
const showChekbox = ref(false)
const modal = ref(false)
const name = ref('')
const startDate = ref('')
const endDate = ref('')
const totalSum = ref(null)
const file = ref('')
const chek = ref(null)
const ids = ref([])
const isLoading = inject('isLoading');
const accauntantFilesId = ref(null)

const invoices = ref([])

const filters = ref({
  search: '',
  status: '',
  dateFrom: '',
  dateTo: ''
});

// Selected invoice for details view
const selectedInvoice = ref(null)
const showDetails = ref(false)

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
    formData.append('totalSum', parseInt(totalSum.value))
    formData.append('type', 'reports')
    formData.append('file', file.value)
    formData.append('check', chek.value)
    const res = await axios.post(URL + '/accountant-files', formData, {
      headers: {
        "Content-Type": 'multipart/form-data' // Fixed typo in Content-Type
      }
    })
    name.value = ''
    file.value = ''
    startDate.value = ''
    endDate.value = ''
    totalSum.value = null
    Showmodal.value = false
    getFiles()
    console.log(res)
  } catch (err) {
    console.log(err)
  }
  finally {
    isLoading.value = false
  }
}

const getFiles = async () => {
  try {
    const res = await axios.get(URL + '/accountant-files');
    console.log(res);
    let sortedData = res.data.slice().filter(item => item.type === 'reports'); // Clone data

    // Apply search filter
    if (filters.value.search) {
      const searchQuery = filters.value.search.toLowerCase();
      sortedData = sortedData.filter(item => {
        const lastHistory = item.History[item.History.length - 1];
        const status = getStatusClass(lastHistory.endDate).toLowerCase();
        return (
          item.id.toString().includes(searchQuery) ||
          item.name.toLowerCase().includes(searchQuery)
        );
      });
    }

    // Apply sorting based on status filter
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
  }
};

// View invoice details
function viewInvoice(invoice) {
  selectedInvoice.value = invoice
  showDetails.value = true
}

// Close invoice details
function closeDetails() {
  showDetails.value = false
}

const filteridTime = (date) => {
  let years = date.slice(0, 4)
  let month = date.slice(5, 7)
  let day = date.slice(8, 10)
  return `${day}.${month}.${years}`
}

const FilteredDots = (num) => {
  return Number(num).toLocaleString('uz-UZ', { minimumFractionDigits: 0 }).replace(/,/g, '.')
}

async function deleteManyFiles() {
  removeFiles(ids.value)
}

const removeFiles = async (ids) => {
  try {
    const response = await axios.delete(URL + '/accountant-files/many', {
      data: { ids }
    })
    console.log('Deleted:', response.data)
    showChekbox.value = false
    getFiles()
  } catch (error) {
    console.error('Error deleting files:', error.response?.data || error.message)
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
    formData.append('totalSum', parseInt(totalSum.value))
    const res = await axios.post(URL + '/accauntant-files-history', formData, {
      headers: {
        "Content-Type": 'multipart/form-data' // Fixed typo in Content-Type
      }
    })
    modal.value = false
    getFiles()
    console.log(res)
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
    return 'bg-green-600'
  } else if (daysRemaining <= 15 && daysRemaining > 10) {
    return 'bg-yellow-400'
  } else if (daysRemaining <= 10) {
    return 'bg-red-700'
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
    // Fayl ustunlari
    excelRows.push([
      { v: item.name, s: { fill: { fgColor: { rgb: "FFFF00" } } } },  // Sariq fon
      { v: new Date(item.createdAt).toLocaleDateString() },
      '', '', ''
    ])

    // History qatorlari
    item.History.forEach((history) => {
      const endDate = new Date(history.endDate)
      const diffTime = endDate.getTime() - today.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      const rowStyle = diffDays <= 10
        ? { fill: { fgColor: { rgb: "FF0000" } } } // Qizil fon (10 kun yoki kamroq qolgan bo‘lsa)
        : {}

      excelRows.push([
        '',
        '',
        { v: history.totalSum },
        { v: new Date(history.startDate).toLocaleDateString() },
        { v: new Date(history.endDate).toLocaleDateString(), s: rowStyle }
      ])
    })

    // Bo‘sh qator ajratish uchun
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
    console.log('ishladi' + item.pdfPath);

  }
  console.log(item)
};

watch(() => filters.value.search, () => {
  getFiles();
});
watch(() => filters.value.status, () => {
  getFiles()
})

onMounted(() => {
  getFiles()
})
</script>

<template>
  <div class="animated-gradient p-7 min-h-screen">
    <!-- Invoices List View -->
    <div v-if="!showDetails" class="rounded-lg p-6">
      <div class="mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div class="flex flex-col">
            <div class="relative z-0 w-full mb-6 group">
  <input
    type="text"
    v-model="filters.search"
    name="text"
    id="text"
    class="block py-2.5 px-0 w-[300px] focus:w-[500px] duration-200 focus:text-lg bg-transparent rounded-md border-2 focus:border-0 focus:border-b-2 border-gray-300 appearance-none outline-none focus:ring-0 peer"
    placeholder=" "
  />
  <label
    for="text"
    class="absolute text-lg text-white duration-300 transform -translate-y-6 scale-75 top-[9px] -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus pl-3 peer-focus:pl-0 peer-focus:-translate-y-6"
  >
    {{ dat === 'datakril' ? translateText('Qidiruv:') : 'Qidiruv:' }}
  </label>
</div>
          </div>
          <div class="flex justify-end md:col-span-2">
            <div class="mb-3">
              <select id="status" v-model="filters.status"
                class="block w-full px-4 py-3 border border-gray-300 bg-[#fff0] text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500">
                <option value="">{{ dat === 'datakril' ? translateText('Tartib raqam') : 'Tartib raqam' }}</option>
                <option value="Paid">{{ dat === 'datakril' ? translateText('Teskari Yaratilish vaqti') : 'Teskari Yaratilish vaqti' }}</option>
                <option value="az">{{ dat === 'datakril' ? translateText('A-Z nom bo‘yicha') : 'A-Z nom bo‘yicha' }}</option>
                <option value="total">{{ dat === 'datakril' ? translateText('Tugash vaqti kelganlar') : 'Tugash vaqti kelganlar' }}</option>
              </select>
            </div>
          </div>
        </div>
        <div class="flex justify-end gap-4">
          <button @click="Showmodal = !Showmodal"
            class="bg-lime-600 text-white px-4 py-2 rounded-md hover:bg-lime-700 transition">
            {{ dat === 'datakril' ? translateText('Yangi hisobot yaratish') : 'Yangi hisobot yaratish' }}
          </button>
          <!-- New Excel Download Button -->
          <button @click="downloadExcel"
            class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
            {{ dat === 'datakril' ? translateText('Download Excel') : 'Download Excel' }}
          </button>
        </div>
      </div>
      <div class="flex justify-end gap-2 mb-4">
        <div v-if="showChekbox" @click="deleteManyFiles()"
          class="py-2 px-4 bg-red-700 hover:bg-red-800 rounded-lg cursor-pointer transition">
          {{ dat === 'datakril' ? translateText('O\'chirish') : 'O\'chirish' }}
        </div>
        <div v-if="!showChekbox" @click="showChekbox = true"
          class="py-2 px-4 bg-red-700 hover:bg-red-800 rounded-lg cursor-pointer transition">
          {{ dat === 'datakril' ? translateText('O\'chirishni rejimini yoqish') : 'O\'chirishni rejimini yoqish' }}
        </div>
        <div v-if="showChekbox" @click="showChekbox = false"
          class="py-2 px-4 bg-yellow-600 hover:bg-yellow-700 rounded-lg cursor-pointer transition">
          {{ dat === 'datakril' ? translateText('O\'chirishni rejimini bekor qilish') : 'O\'chirishni rejimini bekor qilish' }}
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full border-collapse">
          <thead>
            <tr class="bg-gray-100 w-full grid grid-cols-8 gap-2 items-center">
              <th class="p-3 text-center font-semibold text-black">{{ dat === 'datakril' ? translateText('Hisob-faktura #') : 'Hisob-faktura #' }}</th>
              <th class="p-3 text-center font-semibold text-black">{{ dat === 'datakril' ? translateText('Korxona') : 'Korxona' }}</th>
              <th class="p-3 text-center font-semibold text-black">{{ dat === 'datakril' ? translateText('To\'langan sana') : 'To\'langan sana' }}</th>
              <th class="p-3 text-center font-semibold text-black">{{ dat === 'datakril' ? translateText('Qayta to\'lov sanasi') : 'Qayta to\'lov sanasi' }}</th>
              <th class="p-3 text-center font-semibold text-black">{{ dat === 'datakril' ? translateText('Narx') : 'Narx' }}</th>
              <th class="p-3 text-center font-semibold text-black">{{ dat === 'datakril' ? translateText('Holati') : 'Holati' }}</th>
              <th class="p-3 text-center font-semibold text-black flex justify-center items-center gap-4">
                {{ dat === 'datakril' ? translateText('Harakatlar') : 'Harakatlar' }}
              </th>
              <th class="p-1">
                <div v-if="ids.length" @click="selectedAll()"
                  class="py-2 px-4 bg-lime-500 hover:bg-lime-600 rounded-lg cursor-pointer transition">
                  {{ dat === 'datakril' ? translateText('Barchasini belgilash') : 'Barchasini belgilash' }}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in invoices" :key="item.id" class="text-center">
              <td colspan="7" class="py-1">
                <div :class="[getBorderClass(item.History[item.History.length - 1].endDate), 'rounded-lg p-2']"
                  class="flex justify-between items-center">
                  <div class="w-full grid grid-cols-8 gap-2 items-center">
                    <div class="text-center">{{ item.id }}</div>
                    <div class="text-center">{{ item.name }}</div>
                    <div class="text-center">{{ filteridTime(item.History[item.History.length - 1].startDate) }}</div>
                    <div class="text-center">{{ filteridTime(item.History[item.History.length - 1].endDate) }}</div>
                    <div class="text-center">{{ FilteredDots(item.History[item.History.length - 1].totalSum) }} {{ dat === 'datakril' ? translateText('So\'m') : 'So\'m' }}</div>
                    <div>
                      <span class="inline-block px-2 py-1 text-center rounded-lg text-sm font-medium bg-black bg-opacity-20">
                        {{ dat === 'datakril'? translateText(getStatusClass(item.History[item.History.length - 1].endDate)):getStatusClass(item.History[item.History.length - 1].endDate) }}
                      </span>
                    </div>
                    <button class="border border-gray-300 px-2 py-1 rounded text-sm bg-blue-500 hover:bg-blue-600"
                      @click="handleViewInvoice(item)">
                      {{ dat === 'datakril' ? translateText('Shartnomani ko\'rish') : 'Shartnomani ko\'rish' }}
                    </button>
                    <div class="flex justify-evenly items-center">
                      <button class="border border-gray-300 px-2 py-1 rounded text-sm bg-blue-500 hover:bg-blue-600"
                        @click="router.push({
                          path: '/invoicesChild',
                          query: { addressId: item.id }
                        })">{{ dat === 'datakril' ? translateText('Ko\'rish') : 'Ko\'rish' }}</button>
                      <button @click="openModal(item.id)"
                        class="border border-gray-300 px-2 py-1 rounded text-sm text-black bg-yellow-500 hover:bg-yellow-600">{{ dat === 'datakril' ? translateText('Qayta to\'lash') : 'Qayta to\'lash' }}</button>
                      <div v-if="showChekbox">
                        <input type="checkbox" v-model="ids" :value="item.id" :id="'checkbox-' + item.id"
                          class="hidden peer" />
                        <label :for="'checkbox-' + item.id"
                          class="inline-flex items-center justify-center w-5 h-5 rounded border border-gray-400 peer-checked:bg-blue-600 peer-checked:border-blue-600 cursor-pointer transition">
                          <svg v-if="ids.includes(item.id)" class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor" stroke-width="3">
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
        <div class="text-blue-600 font-medium cursor-pointer" @click="closeDetails">
          {{ dat === 'datakril' ? translateText('← Orqaga qaytish') : '← Orqaga qaytish' }}
        </div>
      </div>

      <div class="flex justify-end gap-4">
        <button @click="closeDetails"
          class="border border-gray-300 px-4 py-2 rounded-md text-black hover:bg-gray-100">{{ dat === 'datakril' ? translateText('Chiqish') : 'Chiqish' }}</button>
        <button class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">{{ dat === 'datakril' ? translateText('Excel qilib yuklab olish') : 'Excel qilib yuklab olish' }}</button>
      </div>
    </div>
  </div>
  <div v-if="selectedFilePath"
    class="fixed max-h-[100vh] overflow-auto flex justify-center animated-gradient z-40 items-center min-w-full inset-0">
    <div class="text-blue-600 font-medium cursor-pointer" @click="selectedFilePath = false">
      <img src="../../public/reject-White.png" class="absolute top-4 right-4 w-[50px]" alt="{{ dat === 'datakril' ? translateText('Yopish') : 'Yopish' }}">
    </div>
    <PDFViewer :file-path="selectedFilePath" />
  </div>
  <!-- Create Report Modal -->
  <div v-if="Showmodal" class="fixed inset-0 bg-black bg-opacity-80 z-40 flex justify-center items-center">
    <div class="bg-slate-800 w-[500px] top-0 duration-500 rounded-lg p-6 relative flex flex-col gap-2">
      <img @click="Showmodal = false" src="../../public/reject-White.png"
        class="absolute top-2 right-2 w-8 cursor-pointer" alt="{{ dat === 'datakril' ? translateText('Yopish') : 'Yopish' }}" />
      <h4 class="text-lg text-white font-semibold">{{ dat === 'datakril' ? translateText('Hisobot yaratish') : 'Hisobot yaratish' }}</h4>
      <label>{{ dat === 'datakril' ? translateText('Korxona nomini kiriting') : 'Korxona nomini kiriting' }}</label>
      <input v-model="name" type="text" class="text-black outline-none p-2 rounded-md"
        :placeholder="dat === 'datakril' ? translateText('Hisobot nomi kiriting') : 'Hisobot nomi kiriting'" />

      <label>{{ dat === 'datakril' ? translateText('To\'lanadigan summani') : 'To\'lanadigan summani' }}</label>
      <input v-model="totalSum" type="number" class="text-black outline-none p-2 rounded-md"
        :placeholder="dat === 'datakril' ? translateText('To\'lanadigan summani') : 'To\'lanadigan summani'" />

      <label>{{ dat === 'datakril' ? translateText('Shartnoma amal qilishni boshlagan sanani kiriting') : 'Shartnoma amal qilishni boshlagan sanani kiriting' }}</label>
      <input v-model="startDate" type="date" class="text-black outline-none p-2 rounded-md" />

      <label>{{ dat === 'datakril' ? translateText('Shartnoma amal qilishdan tugaydigan sanani kiriting') : 'Shartnoma amal qilishdan tugaydigan sanani kiriting' }}</label>
      <input v-model="endDate" type="date" class="text-black outline-none p-2 rounded-md" />
      <div class="flex">
        <div>
          <label>{{ dat === 'datakril' ? translateText('Shartnomani kiriting') : 'Shartnomani kiriting' }}</label>
          <input @change="handleImageUpload" type="file" class="outline-none p-2 rounded-md" />
        </div>
        <div>
          <label>{{ dat === 'datakril' ? translateText('Chekni kiriting') : 'Chekni kiriting' }}</label>
          <input @change="handleCkekUpload" type="file" class="outline-none p-2 rounded-md" />
        </div>
      </div>
      <div class="flex gap-2">
        <button @click="Showmodal = false"
          class="bg-red-600 text-white px-4 py-2 w-full rounded-md hover:bg-red-700">{{ dat === 'datakril' ? translateText('Bekor qilish') : 'Bekor qilish' }}</button>
        <button @click="upload"
          class="bg-blue-600 text-white px-4 py-2 w-full rounded-md hover:bg-blue-700">{{ dat === 'datakril' ? translateText('Yuborish') : 'Yuborish' }}</button>
      </div>
    </div>
  </div>

  <!-- Repayment Modal -->
  <div v-if="modal" class="fixed inset-0 group bg-black bg-opacity-80 z-40 flex justify-center items-center">
    <div class="bg-slate-800 w-[500px] top-0 rounded-lg p-6 relative flex flex-col gap-2">
      <img @click="modal = false" src="../../public/reject-White.png" class="absolute top-2 right-2 w-8 cursor-pointer"
        alt="{{ dat === 'datakril' ? translateText('Yopish') : 'Yopish' }}" />
      <h4 class="text-lg font-semibold">{{ dat === 'datakril' ? translateText('Qayta to\'lash') : 'Qayta to\'lash' }}</h4>
      <label>{{ dat === 'datakril' ? translateText('To\'lanadigan summani') : 'To\'lanadigan summani' }}</label>
      <input v-model="totalSum" type="number" class="outline-none text-black p-2 rounded-md"
        :placeholder="dat === 'datakril' ? translateText('To\'lanadigan summani') : 'To\'lanadigan summani'" />
      <label>{{ dat === 'datakril' ? translateText('Shartnoma amal qilishni boshlagan sanani kiriting') : 'Shartnoma amal qilishni boshlagan sanani kiriting' }}</label>
      <input v-model="startDate" type="date" class="outline-none text-black p-2 rounded-md" />
      <label>{{ dat === 'datakril' ? translateText('Shartnoma amal qilishdan tugaydigan sanani kiriting') : 'Shartnoma amal qilishdan tugaydigan sanani kiriting' }}</label>
      <input v-model="endDate" type="date" class="outline-none text-black p-2 rounded-md" />
      <label>{{ dat === 'datakril' ? translateText('Chekni kiriting') : 'Chekni kiriting' }}</label>
      <input @change="handleCkekUpload" type="file" class="outline-none p-2 rounded-md" />
      <div class="flex gap-2">
        <button @click="modal = false" class="bg-red-600 text-white px-4 py-2 w-full rounded-md hover:bg-red-700">{{ dat === 'datakril' ? translateText('Bekor qilish') : 'Bekor qilish' }}</button>
        <button @click="postHistory"
          class="bg-blue-600 text-white px-4 py-2 w-full rounded-md hover:bg-blue-700">{{ dat === 'datakril' ? translateText('Yuborish') : 'Yuborish' }}</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animated-gradient {
  background: linear-gradient(45deg, #1a3c34, #4a5568, #2f855a, #2d3748);
  background-size: 400% 400%;
  animation: gradientAnimation 15s ease infinite;
  padding: 1.75rem;
  min-height: 100vh;
}

@keyframes gradientAnimation {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}
</style>