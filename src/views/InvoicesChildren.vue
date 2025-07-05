<script setup>
import translateText from '@/auth/Translate'
import axios from 'axios'
import { URL } from '@/auth/url'
import { ref, inject, onMounted } from 'vue'
import * as XLSX from 'xlsx'
import { useRoute, useRouter } from 'vue-router'
import PDFViewer from '../components/ppdf.vue'
import { onUnmounted } from 'vue'
import { is } from 'date-fns/locale'

const dat = ref(localStorage.getItem('til') || 'datalotin');
const router = useRouter()
const route = useRoute()
const invoices = ref([])
const id = ref(route.query.addressId)
const selectedFilePath = ref(null)
const isLoading = inject('isLoading')

// Handle "Ko'rish" tugmasi
const handleViewInvoice = (history) => {
  if (history.pdfFile) {
    const fullPath = `${URL}${history.pdfFile}`
    selectedFilePath.value = fullPath
  } else {
    console.warn(history)
  }
}

// Filters
const filters = ref({
  search: '',
  status: '',
  dateFrom: '',
  dateTo: ''
})

// Get files by ID
const getFiles = async () => {
  isLoading.value = true
  try {
    const res = await axios.get(`${URL}/accountant-files/${id.value}`)
    invoices.value.push(res.data)
  } catch (err) {
    console.error('Fayl olishda xato:', err)
  } finally { 
    isLoading.value = false
  }
}

// Format dates
const filteridTime = (date) => {
  let years = date.slice(0, 4)
  let month = date.slice(5, 7)
  let day = date.slice(8, 10)
  return `${day}.${month}.${years}`
}

// Format numbers
const FilteredDots = (num) => {
  return Number(num).toLocaleString('uz-UZ', { minimumFractionDigits: 0 }).replace(/,/g, '.')
}

// Excel yuklab olish
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

onMounted(() => {
  getFiles()
})
</script>

<template>
  <div class="dark:bg-[#1a2642] dark:text-gray-200 p-7 min-h-screen">
    <div class="dark:bg-[#8b8b8b0f] bg-gray-300  rounded-lg shadow-xl p-6">
      <div class="flex justify-between items-center mb-6 pb-4 border-b">
        <div class="text-blue-400 font-medium cursor-pointer" @click="router.push('/invoices')">
          ← {{ dat === 'datakril' ? translateText('Orqaga qaytish') : 'Orqaga qaytish' }}
        </div>
      </div>

      <div>
        <div v-for="item in invoices" :key="item.id">
          <h1><span class="font-bold">{{ dat === 'datakril' ? translateText('Korxona nomi') : 'Korxona nomi' }}:</span> {{ item.name }}</h1>
          <h1><span class="font-bold">{{ dat === 'datakril' ? translateText('Hisob-fakturasi') : 'Hisob-fakturasi' }}:</span> {{ item.id }}</h1>

          <table class="w-full border-collapse mt-4">
            <thead>
              <tr class="grid bg-white dark:bg-gradient-to-r from-[#2a3655] to-[#3d4e81] rounded-lg dark:border border-white/5 shadow-lg hover:shadow-blue-500/5 hover:border-white/10 duration-300  ease-in-out transform hover:-translate-y-1 hover:shadow-2xl  grid-cols-4 gap-2 items-center">
                <th class="p-3 text-center font-semibold">{{ dat === 'datakril' ? translateText('Shartnoma tuzilgan vaqt') : 'Shartnoma tuzilgan vaqt' }}</th>
                <th class="p-3 text-center font-semibold">{{ dat === 'datakril' ? translateText('Keyingi to\'lov vaqti') : 'Keyingi to\'lov vaqti' }}</th>
                <th class="p-3 text-center font-semibold">{{ dat === 'datakril' ? translateText('Keyingi to\'lov qilinadigan narx') : 'Keyingi to\'lov qilinadigan narx' }}</th>
                <th class="p-3 text-center font-semibold">{{ dat === 'datakril' ? translateText('Chekni ko\'rish') : 'Chekni ko\'rish' }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="history in item.History" :key="history.id" class="text-center">
                <td colspan="4" class="pt-2">
                  <div class="flex justify-between bg-white rounded-md py-2 dark:bg-gradient-to-r from-[#2a3655] to-[#3d4e81] dark:border border-white/5 shadow-lg hover:shadow-blue-500/5 hover:border-white/10 duration-300  ease-in-out transform hover:-translate-y-1 hover:shadow-2xl  items-center">
                    <div class="w-full grid grid-cols-4 gap-2 items-center">
                      <div class="text-center text-[16px]">{{ filteridTime(history.startDate) }}</div>
                      <div class="text-center text-[16px]">{{ filteridTime(history.endDate) }}</div>
                      <div class="text-center text-[16px]">{{ FilteredDots(history.totalSum) }}</div>
                      <div>
                        <button class="border w-[200px] border-gray-300 text-white px-2 py-1 rounded text-sm bg-blue-500 hover:bg-blue-600"
                        @click="handleViewInvoice(history)">
                        {{ dat === 'datakril' ? translateText('Ko\'rish') : 'Ko\'rish' }}
                      </button>
                    </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="flex justify-end mt-4 gap-4">
        <button @click="router.push('/invoices')"
          class="border border-gray-300 px-4 py-2 rounded-md">{{ dat === 'datakril' ? translateText('Chiqish') : 'Chiqish' }}</button>
        <button @click="downloadExcel" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          {{ dat === 'datakril' ? translateText('Excel qilib yuklab olish') : 'Excel qilib yuklab olish' }}
        </button>
      </div>
    </div>
  </div>

  <!-- PDF Viewer Modal -->
  <div v-if="selectedFilePath" @click="selectedFilePath = null" class="fixed inset-0 z-40 flex min-h-[100vh]  justify-center dark:bg-[#1a2642] bg-white items-center">
    <div class="absolute top-4 right-4 cursor-pointer" @click="selectedFilePath = null">
      <button 
          class="text-2xl dark:text-gray-400 hover:text-gray-300 transition-all duration-300 hover:scale-110 hover:rotate-90 animate-fade-in">
          ×
      </button>
    </div>
    <div @click.stop class="w-full max-w-5xl p-5 max-h-[100vh] overflow-auto">
      <PDFViewer v-if="selectedFilePath" :file-path="selectedFilePath" />
    </div>
  </div>
</template>
<style scoped>
.cardGradient {
  background: linear-gradient(45deg, #3A4C76, #23385F, #56688F, #23385F);
  background-size: 400% 400%;
  animation: gradientAnimation 15s ease infinite;
  border-radius: 0.5rem;
  padding: 0.5rem;
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