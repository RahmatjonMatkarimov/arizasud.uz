<script setup>
import translateText from '@/auth/Translate'
import axios from 'axios'
import { URL } from '@/auth/url'
import { ref, inject, onMounted } from 'vue'
import * as XLSX from 'xlsx'
import { useRoute, useRouter } from 'vue-router'
import PDFViewer from '../components/ppdf.vue'

const dat = inject('dat')
const router = useRouter()
const route = useRoute()
const invoices = ref([])
const id = ref(route.query.addressId)
const selectedFilePath = ref(null)

// Handle "Ko'rish" tugmasi
const handleViewInvoice = (history) => {
  if (history.pdfFile) {
    const fullPath = `${URL}${history.pdfFile}`
    selectedFilePath.value = fullPath
    console.log('PDF yuklanmoqda:', fullPath)
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
  try {
    const res = await axios.get(`${URL}/accountant-files/${id.value}`)
    invoices.value.push(res.data)
    console.log(invoices.value)
  } catch (err) {
    console.error('Fayl olishda xato:', err)
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
  <div class="animated-gradient p-7 min-h-screen">
    <div class="bg-black bg-opacity-20 rounded-lg shadow-lg p-6">
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
              <tr class="grid cardGradent grid-cols-4 gap-2 items-center">
                <th class="p-3 text-center font-semibold">{{ dat === 'datakril' ? translateText('Shartnoma tuzilgan vaqt') : 'Shartnoma tuzilgan vaqt' }}</th>
                <th class="p-3 text-center font-semibold">{{ dat === 'datakril' ? translateText('Keyingi to\'lov vaqti') : 'Keyingi to\'lov vaqti' }}</th>
                <th class="p-3 text-center font-semibold">{{ dat === 'datakril' ? translateText('Keyingi to\'lov qilinadigan narx') : 'Keyingi to\'lov qilinadigan narx' }}</th>
                <th class="p-3 text-center font-semibold">{{ dat === 'datakril' ? translateText('Chekni ko\'rish') : 'Chekni ko\'rish' }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="history in item.History" :key="history.id" class="text-center">
                <td colspan="4" class="pt-2">
                  <div class="flex justify-between rounded-md py-2 cardGradent items-center">
                    <div class="w-full grid grid-cols-4 gap-2 items-center">
                      <div class="text-center text-[16px]">{{ filteridTime(history.startDate) }}</div>
                      <div class="text-center text-[16px]">{{ filteridTime(history.endDate) }}</div>
                      <div class="text-center text-[16px]">{{ FilteredDots(history.totalSum) }}</div>
                      <button class="border border-gray-300 px-2 py-1 rounded text-sm bg-blue-500 hover:bg-blue-600"
                        @click="handleViewInvoice(history)">
                        {{ dat === 'datakril' ? translateText('Ko\'rish') : 'Ko\'rish' }}
                      </button>
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
  <div v-if="selectedFilePath" class="fixed inset-0 z-40 flex min-h-[100vh] justify-center animated-gradient items-center">
    <div class="absolute top-4 right-4 cursor-pointer" @click="selectedFilePath = null">
      <img src="../../public/reject-White.png" class="w-10 h-10" alt="{{ dat === 'datakril' ? translateText('Yopish') : 'Yopish' }}">
    </div>
    <div class="w-full max-w-5xl max-h-[100vh] overflow-auto">
      <PDFViewer v-if="selectedFilePath" :file-path="selectedFilePath" />
    </div>
  </div>
</template>
<style scoped>
.animated-gradient {
  background: linear-gradient(45deg, #23385F, #3A4C76, #56688F, #23385F);
  background-size: 400% 400%;
  animation: gradientAnimation 15s ease infinite;
  padding: 1.75rem;
  min-height: 100vh;
}

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