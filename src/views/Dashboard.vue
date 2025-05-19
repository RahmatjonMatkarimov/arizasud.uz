<script setup>
import KpiCard from '../components/dashboard/KpiCard.vue'
import RevenueChart from '../components/dashboard/RevenueChart.vue'
import TransactionsTable from '../components/dashboard/TransactionsTable.vue'
import InvoicesTable from '../components/dashboard/InvoicesTable.vue'
import { ref, onMounted } from 'vue'
import '@/style.css'
import axios from 'axios'
import { URL, URL1 } from '@/auth/url'
import { gsap } from 'gsap'

const data = ref(0)
const data1 = ref(0)
const data2 = ref(0)
const data3 = ref(0)

const animatedData = ref(0)
const animatedData1 = ref(0)
const animatedData2 = ref(0)
const animatedData3 = ref(0)

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

function formatNumberWithDots(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

const getClientInvoices = async () => {
  try {
    const response = await axios.get(`${URL1}/commoners`);
    invoices.value = response.data.slice(-5);
  } catch (error) {
    console.error("Error fetching invoices:", error);
  }
};

const getClientTransactions = async () => {
  try {
    const response = await axios.get(`${URL}/client`);
    transactions.value = response.data.slice(-5);
  } catch (error) {
    console.error("Error fetching transactions:", error);
  }
};

const fetchFinancialData = async () => {
  try {
    let totalRevenue = 0
    let totalExpense = 0
    let totalTaxExpense = 0
    let totalBusinessExpense = 0
    const monthlyRevenue = Array(12).fill(0)
    const monthlyExpenses = Array(12).fill(0)
    const monthlyTaxExpenses = Array(12).fill(0)
    const monthlyBusinessExpenses = Array(12).fill(0)

    const accountantResponse = await axios.get(`${URL}/accountant-files`)
    
    accountantResponse.data.forEach((item) => {
      if (Array.isArray(item.History)) {
        item.History.forEach((history) => {
          if (history.createdAt && !isNaN(Number(history.totalSum))) {
            const monthIndex = new Date(history.createdAt).getMonth()
            monthlyExpenses[monthIndex] += Number(history.totalSum)
            totalExpense += Number(history.totalSum)
          }
        })
      }
    })
    
    const businessExpenseItems = accountantResponse.data.filter(item => item.type === 'reports');
    businessExpenseItems.forEach((item) => {
      if (Array.isArray(item.History)) {
        item.History.forEach((history) => {
          if (history.createdAt && !isNaN(Number(history.totalSum))) {
            const monthIndex = new Date(history.createdAt).getMonth()
            monthlyBusinessExpenses[monthIndex] += Number(history.totalSum)
            totalBusinessExpense += Number(history.totalSum)
          }
        })
      }
    })
    
    const taxExpenseItems = accountantResponse.data.filter(item => item.type === 'taxes');
    taxExpenseItems.forEach((item) => {
      if (Array.isArray(item.History)) {
        item.History.forEach((history) => {
          if (history.createdAt && !isNaN(Number(history.totalSum))) {
            const monthIndex = new Date(history.createdAt).getMonth()
            monthlyTaxExpenses[monthIndex] += Number(history.totalSum)
            totalTaxExpense += Number(history.totalSum)
          }
        })
      }
    })

    const clientResponse = await axios.get(`${URL}/client-files`)
    clientResponse.data.forEach((file) => {
      const payment = file.ClientPayment?.[0]
      if (payment && payment.createdAt && !isNaN(Number(payment.TotalSum))) {
        const monthIndex = new Date(payment.createdAt).getMonth()
        monthlyRevenue[monthIndex] += Number(payment.TotalSum)
        totalRevenue += Number(payment.TotalSum)
      }
    })

    data.value = totalRevenue
    data1.value = totalExpense
    data2.value = totalTaxExpense
    data3.value = totalBusinessExpense
    chartData.value = monthlyRevenue
    chartData1.value = monthlyExpenses

    const maxRevenue = Math.max(...monthlyRevenue)
    const maxExpense = Math.max(...monthlyExpenses)
    const maxValue = Math.max(maxRevenue, maxExpense)
    const yMax = maxValue > 0 ? Math.ceil(maxValue * 1.1 / 5000) * 5000 : 20000
    
    chartOptions.value.scales.y.max = yMax
    chartOptions.value.scales.y.ticks.stepSize = Math.ceil(yMax / 5)
    
    isLoaded.value = true
    startAnimations()
  } catch (error) {
    console.error('Error fetching financial data:', error.message)
    if (error.response) {
      console.error('Error response:', error.response.data)
    }
    isLoaded.value = true
  }
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
    value: data.value,
    ease: "power2.out",
    onUpdate: () => { animatedData.value = Math.round(animatedData.value) }
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
  <div class="p-6 dashboard min-h-screen bg-gray-200">
    <div class="container mx-auto">
      <div v-if="!isLoaded" class="loading-container">
        <div class="loading-pulse">
          <svg class="animate-spin h-12 w-12 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <p class="mt-4 text-white">Ma'lumotlar yuklanmoqda...</p>
      </div>

      <div v-else>
        <div class="kpi-grid">
          <KpiCard class="kpi-card" title="Umumiy Xarajatlar" :value="formatNumberWithDots(animatedData1) + ` so'm`" color="warning" />
          <KpiCard class="kpi-card" title="Soliq Xarajatlari" :value="formatNumberWithDots(animatedData2) + ` so'm`" color="success" />
          <KpiCard class="kpi-card" title="Korxona Xarajati" :value="formatNumberWithDots(animatedData3) + ` so'm`" color="primary" />
          <KpiCard class="kpi-card" title="Shartmona bo'yicha qarzlar" :value="formatNumberWithDots(animatedData) + ` so'm`" color="success" />
          <KpiCard class="kpi-card" title="Foyda" :value="formatNumberWithDots(animatedData) + ` so'm`" color="success" />
        </div>

        <div class="dashboard-grid mt-4">
          <div class="chart-container">
            <RevenueChart class="h-full" :revenueData="chartData" :expenseData="chartData1" :options="chartOptions" />
          </div>
          <div class="flex flex-col justify-center">
            <div class="chart-container">
              <TransactionsTable :transactions="transactions" />
            </div>
            <div class="chart-container mt-4">
              <InvoicesTable :invoices="invoices" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: var(--space-4);
  margin-bottom: var(--space-4);
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--space-4);
}

* {
  color: white;
}

.dashboard {
  @apply bg-[#1a2642] text-gray-100 antialiased min-h-screen;
  background: linear-gradient(135deg, #1a2642 0%, #121c30 100%);
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80vh;
}

.kpi-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;
}

.kpi-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
}

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

.table-wrapper {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  background-color: rgba(41, 58, 91, 0.5);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.table-wrapper:hover {
  transform: translateY(-3px);
}

.chart-container {
  position: relative;
  background-color: rgba(41, 58, 91, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  overflow: hidden;
}

.chart-container:hover {
  transform: translateY(-3px);
}

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

@media (max-width: 1200px) {
  .kpi-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .kpi-grid {
    grid-template-columns: 1fr;
  }
}
</style>