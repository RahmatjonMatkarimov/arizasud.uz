<script setup>
import { ref, onMounted } from 'vue'
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const chartData = ref({
  labels: ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyn', 'Iyl', 'Aug', 'Sen'],
  datasets: [
    {
      label: 'Revenue',
      data: [10000, 18000, 14000, 16000, 20000, 18000, 22000, 26000, 322, ],
      borderColor: '#3182ce',
      backgroundColor: 'rgba(49, 130, 206, 0.1)',
      borderWidth: 2,
      tension: 0.3,
      pointBackgroundColor: '#3182ce',
    },
    {
      label: 'Expenses',
      data: [5000, 7000, 6500, 9500, 8000, 8500, 9000, 9500, 8000],
      borderColor: '#26a69a',
      backgroundColor: 'rgba(38, 166, 154, 0.05)',
      borderWidth: 2,
      tension: 0.3,
      pointBackgroundColor: '#26a69a',
    }
  ]
})

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.05)'
      }
    },
    x: {
      grid: {
        display: false
      }
    }
  },
  plugins: {
    legend: {
      position: 'top',
      labels: {
        usePointStyle: true,
        padding: 20
      }
    },
    tooltip: {
      mode: 'index',
      intersect: false,
    }
  },
  interaction: {
    mode: 'nearest',
    axis: 'x',
    intersect: false
  },
  animation: {
    duration: 1000
  }
})
</script>

<template>
  <div class="chart-container">
    <h3>Revenue & Expenses</h3>
    <div class="chart">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<style scoped>
.chart-container {
  background-color: white;
  padding: var(--space-4);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
}

.chart-container h3 {
  margin-bottom: var(--space-3);
}
*{
  color: black;
  }
* {
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
  text-decoration: none;
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
.chart {
  height: 300px;
}
</style>