<script setup>
import KpiCard from '../components/dashboard/KpiCard.vue'
import RevenueChart from '../components/dashboard/RevenueChart.vue'
import TransactionsTable from '../components/dashboard/TransactionsTable.vue'
import InvoicesTable from '../components/dashboard/InvoicesTable.vue'
import { ref, onMounted, onUnmounted } from 'vue'
import '@/style.css'
import axios from 'axios'
import { URL, URL1 } from '@/auth/url'
import { gsap } from 'gsap'
import translateText from '@/auth/Translate'
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

const data = ref(0)
const data1 = ref(0)
const data2 = ref(0)
const data3 = ref(0)
const data4 = ref(0)

const animatedData = ref(0)
const animatedData1 = ref(0)
const animatedData2 = ref(0)
const animatedData3 = ref(0)
const animatedData4 = ref(0)

const chartData = ref(Array(12).fill(0))
const chartData1 = ref(Array(12).fill(0))
const chartOptions = ref({
  scales: {
    y: {
      max: 20000,
      ticks: { stepSize: 4000 }
    }
  }
})

const transactions = ref([])
const invoices = ref([])
const isLoaded = ref(false)
const animationComplete = ref(false)
const isModalOpen = ref(false)
const selectedKpiTitle = ref('')
const modalPosition = ref({ top: 0, left: 0 })

// Sorting variables
const selectedYear = ref(new Date().getFullYear()) // Default to current year (2025)
const selectedMonth = ref(new Date().getMonth()) // Default to current month (4 for May)
const availableYears = ref([]) // Unique years from data
const availableMonths = ref([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]) // All months

// Month names in Uzbek for display
const monthNames = [
  'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
  'Iyul', 'Avgust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'
]

function formatNumberWithDots(number) {
  return Math.floor(number).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const getClientInvoices = async () => {
  try {
    const response = await axios.get(`${URL1}/commoners`);
    let fetchedInvoices = response.data;
    if (selectedYear.value && selectedMonth.value !== null) {
      fetchedInvoices = fetchedInvoices.filter(item => {
        const date = new Date(item.createdAt);
        return date.getFullYear() === Number(selectedYear.value) && date.getMonth() === Number(selectedMonth.value);
      });
    }
    invoices.value = fetchedInvoices.slice(-5);
  } catch (error) {
    console.error("Error fetching invoices:", error);
  }
};

const getClientTransactions = async () => {
  try {
    const response = await axios.get(`${URL}/client`);
    let fetchedTransactions = response.data;
    if (selectedYear.value && selectedMonth.value !== null) {
      fetchedTransactions = fetchedTransactions.filter(item => {
        const date = new Date(item.createdAt);
        return date.getFullYear() === Number(selectedYear.value) && date.getMonth() === Number(selectedMonth.value);
      });
    }
    transactions.value = fetchedTransactions.slice(-5);
  } catch (error) {
    console.error("Error fetching transactions:", error);
  }
};

const fetchFinancialData = async () => {
  try {
    let totalRevenue = 0;
    let totalRevenue1 = 0;
    let totalExpense = 0;
    let totalTaxExpense = 0;
    let totalBusinessExpense = 0;
    const monthlyRevenue = Array(12).fill(0);
    const monthlyExpenses = Array(12).fill(0);
    const monthlyTaxExpenses = Array(12).fill(0);
    const monthlyBusinessExpenses = Array(12).fill(0);

    const accountantResponse = await axios.get(`${URL}/accountant-files`);
    let accountantItems = accountantResponse.data;

    // Extract unique years from clientFiles (last ClientPayment) and accountantItems
    const yearsSet = new Set();
    accountantItems.forEach(item => {
      if (Array.isArray(item.History)) {
        item.History.forEach(history => {
          if (history.createdAt) {
            yearsSet.add(new Date(history.createdAt).getFullYear());
          }
        });
      }
    });
    const clientResponse = await axios.get(`${URL}/client-files`);
    clientResponse.data.forEach(file => {
      const payment = file.ClientPayment?.[file.ClientPayment.length - 1];
      if (payment?.createdAt) {
        yearsSet.add(new Date(payment.createdAt).getFullYear());
      }
    });
    availableYears.value = Array.from(yearsSet).sort((a, b) => a - b);

    // Filter accountant items by year and month
    accountantItems = accountantItems.map(item => ({
      ...item,
      History: Array.isArray(item.History)
        ? item.History.filter(history => {
            if (!history.createdAt) return false;
            const date = new Date(history.createdAt);
            return (
              date.getFullYear() === Number(selectedYear.value) &&
              date.getMonth() === Number(selectedMonth.value)
            );
          })
        : item.History,
    }));

    // Calculate expenses
    accountantItems.forEach(item => {
      if (Array.isArray(item.History)) {
        item.History.forEach(history => {
          if (history.createdAt && !isNaN(Math.floor(history.totalSum))) {
            const monthIndex = new Date(history.createdAt).getMonth();
            monthlyExpenses[monthIndex] += Math.floor(history.totalSum);
            totalExpense += Math.floor(history.totalSum);
          }
        });
      }
    });

    // Calculate business expenses
    const businessExpenseItems = accountantItems.filter(item => item.type === 'reports');
    businessExpenseItems.forEach(item => {
      if (Array.isArray(item.History)) {
        item.History.forEach(history => {
          if (history.createdAt && !isNaN(Math.floor(history.totalSum))) {
            const monthIndex = new Date(history.createdAt).getMonth();
            monthlyBusinessExpenses[monthIndex] += Math.floor(history.totalSum);
            totalBusinessExpense += Math.floor(history.totalSum);
          }
        });
      }
    });

    // Calculate tax expenses
    const taxExpenseItems = accountantItems.filter(item => item.type === 'taxes');
    taxExpenseItems.forEach(item => {
      if (Array.isArray(item.History)) {
        item.History.forEach(history => {
          if (history.createdAt && !isNaN(Math.floor(history.totalSum))) {
            const monthIndex = new Date(history.createdAt).getMonth();
            monthlyTaxExpenses[monthIndex] += Math.floor(history.totalSum);
            totalTaxExpense += Math.floor(history.totalSum);
          }
        });
      }
    });

    // Filter and sort client files by last ClientPayment's createdAt
    let clientFiles = clientResponse.data;
    if (selectedYear.value && selectedMonth.value !== null) {
      clientFiles = clientFiles
        .filter(file => {
          const payment = file.ClientPayment?.[file.ClientPayment.length - 1];
          if (!payment?.createdAt) return false;
          const date = new Date(payment.createdAt);
          return (
            date.getFullYear() === Number(selectedYear.value) &&
            date.getMonth() === Number(selectedMonth.value)
          );
        })
        .sort((a, b) => {
          const aPayment = a.ClientPayment?.[a.ClientPayment.length - 1];
          const bPayment = b.ClientPayment?.[b.ClientPayment.length - 1];
          return new Date(aPayment?.createdAt || 0) - new Date(bPayment?.createdAt || 0);
        }); // Sort by last ClientPayment's createdAt ascending
    }

    // Calculate totalRevenue and totalRevenue1 from the last ClientPayment
    clientFiles.forEach(file => {
      const payment = file.ClientPayment?.[file.ClientPayment.length - 1]; // Get the last payment
      if (payment && payment.createdAt && !isNaN(Math.floor(payment.TotalSum))) {
        const monthIndex = new Date(payment.createdAt).getMonth(); // Use payment.createdAt for month
        monthlyRevenue[monthIndex] += Math.floor(payment.TotalSum);
        totalRevenue += Math.floor(payment.TotalSum);
        totalRevenue1 += Math.floor(payment.remainingSum || 0); // Use 0 if remainingSum is undefined
      }
    });

    // Update reactive variables
    data.value = totalRevenue;
    data1.value = totalExpense;
    data2.value = totalTaxExpense;
    data3.value = totalBusinessExpense;
    data4.value = totalRevenue1;
    chartData.value = monthlyRevenue;
    chartData1.value = monthlyExpenses;

    // Update chart options
    const maxRevenue = Math.max(...monthlyRevenue);
    const maxExpense = Math.max(...monthlyExpenses);
    const maxValue = Math.max(maxRevenue, maxExpense);
    const yMax = maxValue > 0 ? Math.ceil(maxValue * 1.1 / 5000) * 5000 : 20000;

    chartOptions.value.scales.y.max = yMax;
    chartOptions.value.scales.y.ticks.stepSize = Math.ceil(yMax / 5);

    isLoaded.value = true;
    startAnimations();
  } catch (error) {
    console.error('Error fetching financial data:', error.message);
    if (error.response) {
      console.error('Error response:', error.response.data);
    }
    isLoaded.value = true;
  }
};
function hisoblaFoiz(value, percent) {
  return (value * percent) / 100;
}

const startAnimations = () => {
  const kpiCards = document.querySelectorAll('.kpi-card')
  gsap.fromTo(kpiCards, 
    { y: 30, opacity: 0, scale: 0.9 }, 
    { 
      y: 0, 
      opacity: 1, 
      scale: 1, 
      stagger: 0.15, 
      duration: 0.8, 
      ease: "back.out(1.7)",
      onComplete: animateCounters
    }
  )
}

const animateCounters = () => {
  gsap.to(animatedData, {
    duration: 2,
    value: data.value - hisoblaFoiz(data.value, 13),
    ease: "power2.out",
    onUpdate: () => { animatedData.value = Math.round(animatedData.value) }
  })
  gsap.to(animatedData4, {
    duration: 2,
    value: data4.value,
    ease: "power2.out",
    onUpdate: () => { animatedData4.value = Math.round(animatedData4.value) }
  })
  gsap.to(animatedData1, {
    duration: 2,
    value: data1.value,
    ease: "power2.out",
    onUpdate: () => { animatedData1.value = Math.round(animatedData1.value) }
  })
  gsap.to(animatedData2, {
    duration: 2,
    value: data2.value,
    ease: "power2.out",
    onUpdate: () => { animatedData2.value = Math.round(animatedData2.value) }
  })
  gsap.to(animatedData3, {
    duration: 2,
    value: data3.value,
    ease: "power2.out",
    onUpdate: () => { animatedData3.value = Math.round(animatedData3.value) },
    onComplete: animateChartAndTables
  })
}

const animateChartAndTables = () => {
  gsap.fromTo('.chart-container', 
    { opacity: 0, y: 40 }, 
    { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
  )
  const tableRows = document.querySelectorAll('tbody tr')
  gsap.fromTo(tableRows, 
    { opacity: 0, x: -20 }, 
    { opacity: 1, x: 0, stagger: 0.1, duration: 0.5, ease: "power1.out" }
  )
  animationComplete.value = true
}

const openModal = (title, event) => {
  selectedKpiTitle.value = title
  const card = event.currentTarget
  const rect = card.getBoundingClientRect()
  const scrollY = window.scrollY
  const scrollX = window.scrollX
  modalPosition.value = {
    top: rect.bottom + scrollY + 10,
    left: rect.left + scrollX
  }
  isModalOpen.value = true
  gsap.fromTo('.modal', 
    { opacity: 0, y: -20 }, 
    { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
  )
}

const closeModal = () => {
  gsap.to('.modal', 
    { 
      opacity: 0, 
      y: -20, 
      duration: 0.3, 
      ease: "power2.in", 
      onComplete: () => { isModalOpen.value = false }
    }
  )
}

const handleSortChange = async () => {
  isLoaded.value = false;
  await Promise.all([fetchFinancialData(), getClientInvoices(), getClientTransactions()]);
}

onMounted(() => {
  gsap.fromTo('.loading-pulse', 
    { scale: 0.8, opacity: 0.5 },
    { scale: 1, opacity: 1, duration: 0.8, ease: "power1.inOut", repeat: -1, yoyo: true }
  )
  fetchFinancialData()
  getClientInvoices()
  getClientTransactions()
})
</script>

<template>
  <div class="p-6 min-h-screen bg-gray-200 dark:bg-gradient-to-br from-slate-800 to-slate-900 text-gray-100 antialiased">
    <div class="container mx-auto">
      <!-- Loading State -->
      <div v-if="!isLoaded" class="flex flex-col items-center justify-center h-screen">
        <div class="loading-pulse">
          <svg class="animate-spin h-12 w-12 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <p class="mt-4 text-white">{{ dat === 'datakril' ? translateText("Ma'lumotlar yuklanmoqda...") : "Ma'lumotlar yuklanmoqda..." }}</p>
      </div>

      <!-- Dashboard Content -->
      <div v-else>
        <!-- Sort Dropdowns -->
        <div class="mb-4 flex justify-end text-[20px] space-x-4">
          <div>
            <label for="yearSelect" class="mr-2 text-gray-600 dark:text-gray-300">{{ dat === 'datakril' ? translateText("Yil:") : "Yil:" }}</label>
            <select 
              id="yearSelect" 
              v-model="selectedYear" 
              @change="handleSortChange" 
              class="p-2 rounded-lg bg-white dark:bg-slate-700 text-gray-800 dark:text-white border border-gray-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
            </select>
          </div>
          <div>
            <label for="monthSelect" class="mr-2 text-gray-600 dark:text-gray-300">{{ dat === 'datakril' ? translateText("Oy:") : "Oy:" }}</label>
            <select 
              id="monthSelect" 
              v-model="selectedMonth" 
              @change="handleSortChange" 
              class="p-2 rounded-lg bg-white dark:bg-slate-700 text-gray-800 dark:text-white border border-gray-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option v-for="(month, index) in monthNames" :key="index" :value="index">{{ month }}</option>
            </select>
          </div>
        </div>

        <!-- KPI Cards Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-4">
          <KpiCard 
            class="kpi-card transition-all bg-gray-300 text-gray-600 w-full dark:text-white dark:bg-gradient-to-r from-[#2a3655] to-[#3d4e81] rounded-lg dark:border border-white/5 shadow-lg hover:shadow-blue-500/5 hover:border-white/10 duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl relative overflow-hidden group cursor-pointer" 
            title="Soliq Xarajatlari" 
            :value="formatNumberWithDots(animatedData2) + ` so'm`" 
          />
          <KpiCard 
            class="kpi-card transition-all text-blue-600 dark:text-white bg-blue-500 bg-opacity-20 w-full dark:bg-gradient-to-r from-[#2a3655] to-[#3d4e81] rounded-lg dark:border border-white/5 shadow-lg hover:shadow-blue-500/5 hover:border-white/10 duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl relative overflow-hidden group cursor-pointer" 
            title="Korxona Xarajati" 
            :value="formatNumberWithDots(animatedData3) + ` so'm`" 
          />
          <KpiCard 
            class="kpi-card transition-all text-purple-600 dark:text-white bg-purple-500 bg-opacity-20 w-full dark:bg-gradient-to-r from-[#2a3655] to-[#3d4e81] rounded-lg dark:border border-white/5 shadow-lg hover:shadow-blue-500/5 hover:border-white/10 duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl relative overflow-hidden group cursor-pointer" 
            title="Umumiy Xarajatlar" 
            :value="formatNumberWithDots(animatedData1) + ` so'm`" 
          />
          <KpiCard 
            class="kpi-card transition-all w-full text-orange-600 dark:text-white bg-orange-500 bg-opacity-20 dark:bg-gradient-to-r from-[#2a3655] to-[#3d4e81] rounded-lg dark:border border-white/5 shadow-lg hover:shadow-blue-500/5 hover:border-white/10 duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl relative overflow-hidden group cursor-pointer" 
            title="Shartmona bo'yicha qarzlar" 
            :value="formatNumberWithDots(animatedData4) + ` so'm`" 
          />
          <KpiCard 
            class="kpi-card transition-all w-full dark:bg-gradient-to-r text-green-600 dark:text-white bg-green-500 bg-opacity-20 from-[#2a3655] to-[#3d4e81] rounded-lg dark:border border-white/5 shadow-lg hover:shadow-blue-500/5 hover:border-white/10 duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl relative overflow-hidden group cursor-pointer" 
            title="Foyda" 
            :value="formatNumberWithDots(animatedData) + ` so'm`" 
            @click="openModal('Foyda', $event)"
          />
        </div>

        <!-- Dashboard Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
          <!-- Chart Container -->
          <div class="lg:col-span-2">
            <div class="chart-container min-h-full flex justify-center items-center relative bg-slate-400/20 dark:bg-slate-700/50 backdrop-blur-sm rounded-lg p-4 shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border-gradient-to-r from-green-400 via-blue-500 to-red-500">
              <RevenueChart class="min-h-full" :revenueData="chartData" :expenseData="chartData1" :options="chartOptions" />
            </div>
          </div>
          
          <!-- Tables Container -->
          <div class="flex flex-col justify-center space-y-4">
            <div class="chart-container relative bg-slate-400/20 dark:bg-slate-700/50 backdrop-blur-sm rounded-lg p-4 shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
              <TransactionsTable :transactions="transactions" />
            </div>
            <div class="chart-container relative bg-slate-400/20 dark:bg-slate-700/50 backdrop-blur-sm rounded-lg p-4 shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
              <InvoicesTable :invoices="invoices" />
            </div>
          </div>
        </div>

        <!-- Modal -->
        <div 
          v-if="isModalOpen" 
          class="modal fixed bg-white dark:bg-slate-800 rounded-xl p-8 w-full max-w-md shadow-xl z-50 border border-gray-100 dark:border-slate-700 bg-opacity-100 dark:bg-opacity-100 transition-all duration-300"
          :style="{ top: `${modalPosition.top}px`, left: `${modalPosition.left - 70}px` }"
        >
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
              {{ dat === 'datakril'? translateText(selectedKpiTitle) : selectedKpiTitle }}
            </h2>
            <button 
              @click="isModalOpen = false" 
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="space-y-4">
            <div class="flex items-center p-3 bg-gray-50 dark:bg-slate-700 rounded-lg dark:border-none border border-gray-800">
              <span class="text-gray-600 dark:text-gray-300 font-medium w-[250px]">{{ dat === 'datakril' ? translateText('Umumiy foyda:') : 'Umumiy foyda:' }}</span>
              <span class="ml-auto font-semibold text-gray-800 dark:text-white">
                {{ formatNumberWithDots(data) }} {{ dat === 'datakril' ? translateText("so'm") : "so'm" }}
              </span>
            </div>
            <div class="flex items-center p-3 bg-gray-50 dark:bg-slate-700 rounded-lg dark:border-none border border-gray-800">
              <span class="text-gray-600 dark:text-gray-300 font-medium w-[250px]">{{ dat === 'datakril' ? translateText("Jismoniy shaxs daromad solig'i (JShDS) – 12%") : "Jismoniy shaxs daromad solig'i (JShDS) – 12%" }}</span>
              <span class="ml-auto font-semibold text-gray-800 dark:text-white">
                {{ formatNumberWithDots(hisoblaFoiz(data, 12)) }} {{ dat === 'datakril' ? translateText("so'm") : "so'm" }}
              </span>
            </div>
            <div class="flex items-center p-3 bg-gray-50 dark:bg-slate-700 rounded-lg dark:border-none border border-gray-800">
              <span class="text-gray-600 dark:text-gray-300 font-medium w-[250px]">{{ dat === 'datakril' ? translateText("Majburiy pensiya badali (shaxsiy jamg'arma) – 1%") : "Majburiy pensiya badali (shaxsiy jamg'arma) – 1%" }}</span>
              <span class="ml-auto font-semibold text-gray-800 dark:text-white">
                {{ formatNumberWithDots(hisoblaFoiz(data, 1)) }} {{ dat === 'datakril' ? translateText("so'm") : "so'm" }}
              </span>
            </div>
            <div class="flex items-center p-3 bg-green-50 dark:bg-green-900/50 rounded-lg dark:border-none border border-gray-800">
              <span class="text-gray-600 dark:text-gray-300 font-medium w-[250px]">{{ dat === 'datakril' ? translateText("Sof foyda:") : "Sof foyda:" }}</span>
              <span class="ml-auto font-bold text-green-600 dark:text-green-400">
                {{ formatNumberWithDots(data - hisoblaFoiz(data, 13)) }} {{ dat === 'datakril' ? translateText("so'm") : "so'm" }}
              </span>
            </div>
          </div>
          <div class="mt-6 flex justify-end">
            <button 
              @click="isModalOpen = false" 
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
            >
              {{ dat === 'datakril' ? translateText("Yopish") : "Yopish" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom styles for animations and effects that can't be replicated with Tailwind alone */

/* Shimmer effect for KPI cards */
.kpi-card::after {
  content: '';
  position: absolute;
  top: -100%;
  left: -100%;
  width: 70px;
  height: 70px;
  background: rgba(255, 255, 255, 0.15);
  transform: rotate(45deg);
  transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
}

.kpi-card:hover::after {
  top: -30px;
  left: 80%;
}

/* Animated gradient border for chart containers */
.chart-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, #38A169, #3182CE, #E53E3E);
  background-size: 200% 100%;
  animation: gradientBorder 3s ease infinite;
}

@keyframes gradientBorder {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
</style>
