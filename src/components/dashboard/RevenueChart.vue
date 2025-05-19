<script setup>
import { ref, onMounted } from 'vue'
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import axios from 'axios'
import { URL } from '@/auth/url'
import translateText from '@/auth/Translate'
import { inject } from 'vue'

const dat = inject('dat')

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const chartData = ref({
  labels: ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyn', 'Iyl', 'Aug', 'Sen', 'Okt', 'Noy', 'Dek'],
  datasets: [
    {
      label: 'Foyda',
      data: Array(12).fill(0),
      borderColor: '#3182ce',
      backgroundColor: 'rgba(49, 130, 206, 0.1)',
      borderWidth: 2,
      tension: 0.3,
      pointBackgroundColor: '#3182ce',
    },
    {
      label: 'Xarajatlar',
      data: Array(12).fill(0),
      borderColor: '#dc2626',
      backgroundColor: 'rgba(250,250,250, 0.1)', // Slightly transparent for better contrast
      borderWidth: 2,
      tension: 0.3,
      pointBackgroundColor: '#dc2626',
    },
  ],
})

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 5000,
        color: '#ffffff', // White ticks on y-axis
      },
      grid: {
        color: 'rgba(255, 255, 255, 0.2)', // Lighter grid lines for contrast
      },
    },
    x: {
      ticks: {
        color: '#ffffff', // White ticks on x-axis
      },
      grid: {
        display: false,
      },
    },
  },
  plugins: {
    legend: {
      position: 'top',
      labels: {
        usePointStyle: true,
        padding: 20,
        color: '#ffffff', // White legend text
      },
    },
    tooltip: {
      mode: 'index',
      intersect: false,
      titleColor: '#ffffff', // White tooltip title
      bodyColor: '#ffffff', // White tooltip body
      backgroundColor: 'rgba(0, 0, 0, 0.8)', // Dark tooltip background for contrast
    },
  },
  interaction: {
    mode: 'nearest',
    axis: 'x',
    intersect: false,
  },
  animation: {
    duration: 1000,
  },
})

const getDATA = async () => {
  try {
    const revenueSums = Array(12).fill(0)
    const expenseSums = Array(12).fill(0)

    // 1. accountant-files
    const res = await axios.get(URL + '/accountant-files')
    res.data.forEach((item) => {
      if (Array.isArray(item.History)) {
        item.History.forEach((history) => {
          if (history.createdAt && !isNaN(Number(history.totalSum))) {
            const monthIndex = new Date(history.createdAt).getMonth()
            expenseSums[monthIndex] += Number(history.totalSum)
          }
        })
      }
    })

    // 2. client-files — only first ClientPayment[0]
    const clientRes = await axios.get(URL + '/client-files')
    clientRes.data.forEach((file) => {
      const payment = file.ClientPayment?.[0]
      if (payment && payment.createdAt && !isNaN(Number(payment.TotalSum))) {
        const monthIndex = new Date(payment.createdAt).getMonth()
        revenueSums[monthIndex] += Number(payment.TotalSum)
      }
    })

    // Calculate the maximum value for dynamic scaling
    const maxRevenue = Math.max(...revenueSums)
    const maxExpense = Math.max(...expenseSums)
    const maxValue = Math.max(maxRevenue, maxExpense)
    const yMax = maxValue > 0 ? Math.ceil(maxValue * 1.1 / 5000) * 5000 : 20000

    // Update chartOptions with dynamic y-axis max
    chartOptions.value.scales.y.max = yMax
    chartOptions.value.scales.y.ticks.stepSize = Math.ceil(yMax / 5)

    // Update chart data
    chartData.value.datasets[0].data = [...revenueSums]
    chartData.value.datasets[1].data = [...expenseSums]
    console.log('Revenue Sums:', revenueSums)
    console.log('Expense Sums:', expenseSums)
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

onMounted(() => {
  getDATA()
})
</script>

<template>
  <div class="chart-container">
    <h3>{{ dat === 'datakril' ? translateText('Xarajatlar va Foyda') : 'Xarajatlar va Foyda' }}</h3>
    <div class="chart">
      <Line v-if="chartData.datasets[0].data.some(val => val > 0) || chartData.datasets[1].data.some(val => val > 0)"
        :data="chartData" :options="chartOptions" />
      <p v-else>{{ dat === 'datakril' ? translateText('Hech qanday malumot yo\'q') : 'Hech qanday malumot yo\'q' }}</p>
    </div>
  </div>
</template>

<style scoped>
.chart-container {
  padding: var(--space-4);
  @apply bg-gradient-to-r from-[#2a3655] to-[#3d4e81] rounded-lg border border-white/5 shadow-lg hover:shadow-blue-500/5 hover:border-white/10 transition-all duration-300;
  width: 100%;
  position: relative;
}

.chart-container h3 {
  margin-bottom: var(--space-3);
  color: #ffffff; /* White color for h3 */
}

.chart-container p {
  color: #ffffff; /* White color for p */
}

.chart {
  min-height: 300px;
  width: 100%;
}
</style>