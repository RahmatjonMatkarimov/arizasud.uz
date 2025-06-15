<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import axios from 'axios'
import { URL } from '@/auth/url'
import translateText from '@/auth/Translate'
import { inject } from 'vue'

const isLoading = inject('isLoading')
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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

// Reactive theme state
const isDark = ref(document.documentElement.classList.contains('dark'))

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
      backgroundColor: 'rgba(220, 38, 38, 0.1)',
      borderWidth: 2,
      tension: 0.3,
      pointBackgroundColor: '#dc2626',
    },
  ],
})

// Watch for theme changes using MutationObserver
const setupThemeWatcher = () => {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        isDark.value = document.documentElement.classList.contains('dark')
      }
    })
  })

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  })

  return observer
}

// Theme-aware chart options - now reactive to isDark changes
const chartOptions = computed(() => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: chartData.value.yMax || 20000,
        ticks: {
          stepSize: chartData.value.stepSize || 5000,
          color: isDark.value ? '#ffffff' : '#000000',
        },
        grid: {
          color: isDark.value ? 'rgba(255, 255, 255, 0.2)' : 'rgba(107, 114, 128, 0.3)',
        },
      },
      x: {
        ticks: {
          color: isDark.value ? '#ffffff' : '#000000',
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
          color: isDark.value ? '#ffffff' : '#000000',
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        titleColor: isDark.value ? '#ffffff' : '#000000',
        bodyColor: isDark.value ? '#ffffff' : '#000000',
        backgroundColor: isDark.value ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.9)',
        borderColor: isDark.value ? 'rgba(255, 255, 255, 0.2)' : 'rgba(107, 114, 128, 0.3)',
        borderWidth: 1,
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
  }
})

const getDATA = async () => {
  isLoading.value = false
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

    // Store scaling values in chartData for computed options
    chartData.value.yMax = yMax
    chartData.value.stepSize = Math.ceil(yMax / 5)

    // Update chart data
    chartData.value.datasets[0].data = [...revenueSums]
    chartData.value.datasets[1].data = [...expenseSums]
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally{
    isLoading.value = false
  }
}

let observer = null

onMounted(() => {
  getDATA()
  observer = setupThemeWatcher()
})

// Cleanup observer when component unmounts
import { onUnmounted } from 'vue'
onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>

<template>
  <div class="chart-container min-h-full overflow-hidden">
    <h3 class="chart-title">
      {{ dat === 'datakril' ? translateText('Xarajatlar va Foyda') : 'Xarajatlar va Foyda' }}
    </h3>
    <div class="chart">
      <Line v-if="chartData.datasets[0].data.some(val => val > 0) || chartData.datasets[1].data.some(val => val > 0)"
        :data="chartData" :options="chartOptions" />
      <p v-else class="no-data-text">
        {{ dat === 'datakril' ? translateText('Hech qanday malumot yo\'q') : 'Hech qanday malumot yo\'q' }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.chart-container {
  @apply p-4 rounded-lg border shadow-lg transition-all duration-300 w-full relative;
  
  /* Light mode styles */
  @apply bg-gradient-to-r from-blue-50 to-indigo-100 border-gray-200 hover:shadow-xl hover:border-gray-300;
  
  /* Dark mode styles */
  @apply dark:bg-gradient-to-r dark:from-[#2a3655] dark:to-[#3d4e81] dark:border-white/10 dark:hover:shadow-blue-500/10 dark:hover:border-white/20;
}

.chart-title {
  @apply mb-3 font-semibold text-lg;
  
  /* Light mode text */
  @apply text-black;
  
  /* Dark mode text */
  @apply dark:text-white;
}

.no-data-text {
  @apply text-center py-8 text-base;
  
  /* Light mode text */
  @apply text-gray-900;
  
  /* Dark mode text */
  @apply dark:text-gray-300;
}

.chart {
  min-height: 300px;
  width: 100%; 
}
</style>