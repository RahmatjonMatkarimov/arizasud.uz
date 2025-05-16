<script setup>
import KpiCard from '../components/dashboard/KpiCard.vue'
import RevenueChart from '../components/dashboard/RevenueChart.vue'
import TransactionsTable from '../components/dashboard/TransactionsTable.vue'
import InvoicesTable from '../components/dashboard/InvoicesTable.vue'
import { ref } from 'vue'
import '@/style.css'
import { onMounted } from 'vue'
import axios from 'axios'
import { URL, URL1 } from '@/auth/url'

const data = ref(0) 
const data1 = ref(0) 
const data2 = ref(0) 
const data3 = ref(0) 

const chartData = ref(Array(12).fill(0)) 
const chartData1 = ref(Array(12).fill(0)) 
const transactions = ref([])
const invoices = ref([])
const chartOptions = ref({
  scales: {
    y: {
      max: 20000,
      ticks: { stepSize: 4000 }
    }
  }
})
function formatNumberWithDots(number) {
  const numStr = number.toString();
  const reversed = numStr.split('').reverse().join('');
  const chunked = [];

  for (let i = 0; i < reversed.length; i += 3) {
    chunked.push(reversed.slice(i, i + 3));
  }

  const formatted = chunked.join('.').split('').reverse().join('');
  return formatted;
}
const GetClient = async () => {
    try {
        const response = await axios.get(`${URL1}/commoners`);
        invoices.value = response.data.slice(-5);
    } catch (error) {
        console.error("Xatolik yuz berdi:", error);
    }
};
const GetClient1 = async () => {
    try {
        const response = await axios.get(`${URL}/client`);
        transactions.value = response.data.slice(-5);
    } catch (error) {
        console.error("Xatolik yuz berdi:", error);
    }
};

const getDATA = async () => {
  try {
    let totalRevenue = 0
    let totalExpense = 0
    let totalExpense1 = 0
    let totalExpense2 = 0
    const revenueSums = Array(12).fill(0)
    const expenseSums = Array(12).fill(0)
    const expenseSums1 = Array(12).fill(0)
    const expenseSums2 = Array(12).fill(0)

    const res = await axios.get(URL + '/accountant-files')
    res.data.forEach((item) => {
      if (Array.isArray(item.History)) {
        item.History.forEach((history) => {
          if (history.createdAt && !isNaN(Number(history.totalSum))) {
            const monthIndex = new Date(history.createdAt).getMonth()
            expenseSums[monthIndex] += Number(history.totalSum)
            totalExpense += Number(history.totalSum)
          }
        })
      }
    })
    const filter1 = res.data.filter(item => item.type === 'reports');
    filter1.forEach((item) => {
      if (Array.isArray(item.History)) {
        item.History.forEach((history) => {
          if (history.createdAt && !isNaN(Number(history.totalSum))) {
            const monthIndex = new Date(history.createdAt).getMonth()
            expenseSums2[monthIndex] += Number(history.totalSum)
            totalExpense2 += Number(history.totalSum)
          }
        })
      }
    })
    const filter2 = res.data.filter(item => item.type === 'taxes');
    filter2.forEach((item) => {
      if (Array.isArray(item.History)) {
        item.History.forEach((history) => {
          if (history.createdAt && !isNaN(Number(history.totalSum))) {
            const monthIndex = new Date(history.createdAt).getMonth()
            expenseSums1[monthIndex] += Number(history.totalSum)
            totalExpense1 += Number(history.totalSum)
          }
        })
      }
    })

    const clientRes = await axios.get(URL + '/client-files')
    clientRes.data.forEach((file) => {
      const payment = file.ClientPayment?.[0]
      if (payment && payment.createdAt && !isNaN(Number(payment.TotalSum))) {
        const monthIndex = new Date(payment.createdAt).getMonth()
        revenueSums[monthIndex] += Number(payment.TotalSum)
        totalRevenue += Number(payment.TotalSum)
      }
    })

    data.value = totalRevenue
    data1.value = totalExpense
    data2.value = totalExpense1
    data3.value = totalExpense2
    chartData.value = revenueSums
    chartData1.value = expenseSums

    const maxRevenue = Math.max(...revenueSums)
    const maxExpense = Math.max(...expenseSums)
    const maxValue = Math.max(maxRevenue, maxExpense)
    const yMax = maxValue > 0 ? Math.ceil(maxValue * 1.1 / 5000) * 5000 : 20000
    chartOptions.value.scales.y.max = yMax
    chartOptions.value.scales.y.ticks.stepSize = Math.ceil(yMax / 5)
  } catch (error) {
    console.error('Error fetching data:', error.message)
    if (error.response) {
      console.error('Error response:', error.response.data)
    }
  }
}

onMounted(() => {
  getDATA()
  GetClient()
  GetClient1()
})
</script>

<template>
  <div class="p-6 min-h-screen bg-gray-200">
    <div class="container mx-auto">
      <div class="kpi-grid">
        <KpiCard title="Foyda" :value="formatNumberWithDots(data) + ` so'm`" color="success" />
        <KpiCard title="Umumiy Xarajatlar" :value="formatNumberWithDots(data1) + ` so'm`" color="warning" />
        <KpiCard title="Soliq Xarajatlari" :value="formatNumberWithDots(data2) + ` so'm`" color="success" />
        <KpiCard title="Korxona Xarajati" :value="formatNumberWithDots(data3) + ` so'm`" color="primary" />
      </div>

      <div class="dashboard-grid mt-4">
        <RevenueChart :revenueData="chartData" :expenseData="chartData1" :options="chartOptions" />
        <div class="dashboard-tables">
          <TransactionsTable :transactions="transactions" />
          <InvoicesTable :invoices="invoices" class="mt-4" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-4);
  margin-bottom: var(--space-4);
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--space-4);
}

* {
  color: black;
}


body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
  background-color: var(--color-bg-secondary);
  color: var(--color-text-primary);
}

h1 {
  font-size: 2rem;
  line-height: 1.2;
  font-weight: 600;
  margin-bottom: var(--space-4);
}

h2 {
  font-size: 1.5rem;
  line-height: 1.3;
  font-weight: 600;
  margin-bottom: var(--space-3);
}

h3 {
  font-size: 1.25rem;
  line-height: 1.4;
  font-weight: 600;
  margin-bottom: var(--space-2);
}

a {
  text-decoration: none;
  color: var(--color-accent);
}

button,
.btn {
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: var(--color-accent);
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

button:hover,
.btn:hover {
  background-color: #2c73b4;
}

.card {
  background-color: var(--color-bg-primary);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  box-shadow: var(--shadow-md);
}

.text-success {
  color: var(--color-success);
}

.text-warning {
  color: var(--color-warning);
}

.text-error {
  color: var(--color-error);
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  padding: var(--space-2) var(--space-3);
  text-align: left;
}

.table th {
  background-color: var(--color-bg-secondary);
  font-weight: 600;
}

.table tr {
  border-bottom: 1px solid var(--color-bg-tertiary);
}

.table tr:last-child {
  border-bottom: none;
}

.table tr:hover {
  background-color: var(--color-bg-secondary);
}

.badge {
  display: inline-block;
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
  font-weight: 500;
}

.badge-success {
  background-color: rgba(56, 161, 105, 0.1);
  color: var(--color-success);
}

.badge-pending {
  background-color: rgba(237, 137, 54, 0.1);
  color: var(--color-warning);
}

.negative {
  color: var(--color-error);
}

.positive {
  color: var(--color-success);
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