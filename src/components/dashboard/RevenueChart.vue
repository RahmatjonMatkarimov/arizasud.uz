
<script setup>
import { ref, onMounted } from 'vue'
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import axios from 'axios'
import { URL } from '@/auth/url'

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
      borderColor: '#dc2626', // Red color for expenses
      backgroundColor: 'rgba(220, 38, 38, 0.1)',
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
      },
      grid: {
        color: 'rgba(0, 0, 0, 0.05)',
      },
    },
    x: {
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
      },
    },
    tooltip: {
      mode: 'index',
      intersect: false,
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
    <h3>Revenue vs Expenses</h3>
    <div class="chart">
      <Line
        v-if="chartData.datasets[0].data.some(val => val > 0) || chartData.datasets[1].data.some(val => val > 0)"
        :data="chartData"
        :options="chartOptions"
      />
      <p v-else>No data available to display the chart.</p>
    </div>
  </div>
</template>

<style scoped>
.chart-container {
  background-color: white;
  padding: var(--space-4);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  width: 100%;
  position: relative;
}

.chart-container h3 {
  margin-bottom: var(--space-3);
}

.chart {
  min-height: 300px; /* Allow growth beyond 300px */
  width: 100%;
}

* {
  color: black;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
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
  text-decorationprinter-friendly: none;
  color: var(--color-accent);
}

button, .btn {
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

button:hover, .btn:hover {
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

.table th, .table td {
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
</style>