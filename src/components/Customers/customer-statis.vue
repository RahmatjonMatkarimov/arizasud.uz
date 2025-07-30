```vue
<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
    <!-- Header -->
    <header class="bg-white dark:bg-gray-800 shadow-xl border-b border-gray-200 dark:border-gray-700 sticky top-0 backdrop-blur-lg bg-opacity-90 dark:bg-opacity-90">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-3">
            <div class="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl shadow-lg">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {{ translateText('Bosh sahifa') }}
              </h1>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ translateText('Mijozlar statistikasi va ma\'lumotlari') }}</p>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Status Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 animate-fade-in">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ translateText('Qabul qilingan') }}</h3>
              <p class="text-3xl font-bold text-green-600 mt-2">{{ statusCounts.accepted }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ translateText('mijoz') }}</p>
            </div>
            <div class="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
              <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 animate-fade-in">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ translateText('Yurist zimmasiga otkazilganlar') }}</h3>
              <p class="text-3xl font-bold text-yellow-600 mt-2">{{ statusCounts.waiting }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ translateText('mijoz') }}</p>
            </div>
            <div class="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-full">
              <svg class="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l1.5 1.5" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 animate-fade-in">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ translateText('Tugallangan') }}</h3>
              <p class="text-3xl font-bold text-blue-600 mt-2">{{ statusCounts.completed }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ translateText('mijoz') }}</p>
            </div>
            <div class="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
              <svg class="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Chart Section -->
        <div class="lg:col-span-2">
          <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 animate-fade-in">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                {{ translateText('Oylik statistika') }}
              </h3>
              <select v-model="selectedMonth" @change="updateChart" class="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option v-for="month in availableMonths" :key="month.value" :value="month.value">
                  {{ month.label }}
                </option>
              </select>
            </div>
            <div class="h-80">
              <canvas ref="chartCanvas" class="w-full h-full"></canvas>
            </div>
          </div>
        </div>

        <!-- Recent Customers -->
        <div class="lg:col-span-1">
          <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 animate-fade-in">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                {{ translateText('Oxirgi mijozlar') }}
              </h3>
            </div>
            <div class="space-y-4 max-h-96 overflow-y-auto">
              <div v-for="app in recentCustomers" :key="app.id" 
                   class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
                <div class="flex items-start space-x-3">
                  <div class="bg-gradient-to-r from-blue-500 to-purple-500 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span class="text-white font-semibold text-sm">
                      {{ getInitials(app.customerName) }}
                    </span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h4 class="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {{ translateText(app.customerName) }} {{ translateText(app.customerSurname) }}
                    </h4>
                    <div class="mt-1 space-y-1">
                      <div class="flex items-center text-xs text-gray-600 dark:text-gray-400">
                        <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {{ app.customerPhone }}
                      </div>
                      <div class="flex items-center text-xs text-gray-600 dark:text-gray-400">
                        <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        {{ translateText(app.purpose) }}
                      </div>
                      <div class="flex items-center justify-between mt-2">
                        <span :class="getStatusColorClass(app.status)" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium">
                          {{ getStatusText(app.status) }}
                        </span>
                        <span class="text-xs text-gray-500 dark:text-gray-400">
                          {{ formatDate(app.endDate) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, nextTick } from 'vue';
import axios from 'axios';
import Chart from 'chart.js/auto';
import translateText from '@/auth/Translate copy';
import { URL } from '@/auth/url';

export default {
  name: 'CustomerDashboard',
  setup() {
    const customers = ref([]);
    const chartCanvas = ref(null);
    const chart = ref(null);
    const loading = ref(true);
    const error = ref(null);
    const selectedMonth = ref(new Date().toISOString().slice(0, 7)); // Default to current month (YYYY-MM)

    // Fetch available months from application data
    const availableMonths = computed(() => {
      const months = new Set();
      customers.value.forEach(customer => {
        customer.CustomerApplications?.forEach(app => {
          if (app.createdAt) {
            const month = new Date(app.createdAt).toISOString().slice(0, 7);
            months.add(month);
          }
        });
      });

      // Map for Uzbek month names
      const uzbekMonths = [
        'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
        'iyul', 'avgust', 'sentyabr', 'oktyabr', 'noyabr', 'dekabr'
      ];

      return Array.from(months)
        .sort((a, b) => b.localeCompare(a))
        .map(month => {
          const [year, monthNum] = month.split('-').map(Number);
          const monthName = uzbekMonths[monthNum - 1];
          return {
            value: month,
            label: `${year} ${monthName}`
          };
        });
    });

    // Compute status counts based on CustomerApplications
    const statusCounts = computed(() => {
      const counts = {
        accepted: 0,
        waiting: 0,
        completed: 0
      };
      customers.value.forEach(customer => {
        customer.CustomerApplications?.forEach(app => {
          if (app.status === 'accepted') counts.accepted++;
          else if (app.status === 'waiting') counts.waiting++;
          else if (app.status === 'completed') counts.completed++;
        });
      });
      return counts;
    });

    // Compute recent applications (not customers) for the recent customers list
    const recentCustomers = computed(() => {
      const applications = [];
      customers.value.forEach(customer => {
        customer.CustomerApplications?.forEach(app => {
          applications.push({
            id: app.id,
            customerName: customer.name || '',
            customerSurname: customer.surname || '',
            customerPhone: customer.phone || '',
            purpose: app.purpose || '',
            status: app.status || '',
            endDate: app.endDate || '',
            createdAt: app.createdAt || app.created_at || new Date().toISOString()
          });
        });
      });
      return applications
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
    });

    const generateChartData = () => {
      const labels = [];
      const acceptedData = [];
      const waitingData = [];
      const completedData = [];

      // Get days in selected month
      const [year, month] = selectedMonth.value.split('-').map(Number);
      const daysInMonth = new Date(year, month, 0).getDate();
      
      // Initialize data for each day in the selected month
      const statusByDate = {};
      for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        statusByDate[dateStr] = {
          accepted: 0,
          waiting: 0,
          completed: 0
        };
        labels.push(day.toString());
      }

      // Count applications by creation date and status for selected month
      customers.value.forEach(customer => {
        customer.CustomerApplications?.forEach(app => {
          if (app.createdAt) {
            const appDate = new Date(app.createdAt).toISOString().slice(0, 10);
            if (appDate.startsWith(selectedMonth.value) && statusByDate[appDate]) {
              statusByDate[appDate][app.status] = (statusByDate[appDate][app.status] || 0) + 1;
            }
          }
        });
      });

      // Convert to arrays for chart
      Object.keys(statusByDate).forEach(date => {
        acceptedData.push(statusByDate[date].accepted);
        waitingData.push(statusByDate[date].waiting);
        completedData.push(statusByDate[date].completed);
      });

      return { labels, acceptedData, waitingData, completedData };
    };

    const initChart = async () => {
      await nextTick();
      if (!chartCanvas.value) return;

      const ctx = chartCanvas.value.getContext('2d');
      const chartData = generateChartData();

      if (chart.value) {
        chart.value.destroy();
      }

      chart.value = new Chart(ctx, {
        type: 'line',
        data: {
          labels: chartData.labels,
          datasets: [
            {
              label: translateText('Qabul qilingan'),
              data: chartData.acceptedData,
              borderColor: '#10b981',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              borderWidth: 3,
              fill: true,
              tension: 0.4,
              pointBackgroundColor: '#10b981',
              pointBorderColor: '#10b981',
              pointRadius: 4,
              pointHoverRadius: 6
            },
            {
              label: translateText('Yurist zimmasiga otkazilganlar'),
              data: chartData.waitingData,
              borderColor: '#f59e0b',
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              borderWidth: 3,
              fill: true,
              tension: 0.4,
              pointBackgroundColor: '#f59e0b',
              pointBorderColor: '#f59e0b',
              pointRadius: 4,
              pointHoverRadius: 6
            },
            {
              label: translateText('Tugallangan'),
              data: chartData.completedData,
              borderColor: '#3b82f6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              borderWidth: 3,
              fill: true,
              tension: 0.4,
              pointBackgroundColor: '#3b82f6',
              pointBorderColor: '#3b82f6',
              pointRadius: 4,
              pointHoverRadius: 6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                padding: 20,
                usePointStyle: true,
                font: {
                  size: 12
                }
              }
            },
            tooltip: {
              mode: 'index',
              intersect: false,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              titleColor: '#374151',
              bodyColor: '#374151',
              borderColor: '#e5e7eb',
              borderWidth: 1,
              cornerRadius: 8,
              padding: 12
            }
          },
          scales: {
            x: {
              display: true,
              grid: {
                display: false
              },
              ticks: {
                font: {
                  size: 11
                },
                color: '#6b7280'
              }
            },
            y: {
              display: true,
              beginAtZero: true,
              grid: {
                color: 'rgba(156, 163, 175, 0.2)',
                drawTicks: false
              },
              ticks: {
                font: {
                  size: 11
                },
                color: '#6b7280',
                padding: 8
              }
            }
          },
          interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
          }
        }
      });
    };

    const updateChart = () => {
      initChart();
    };

    const fetchCustomers = async () => {
      try {
        loading.value = true;
        error.value = null;
        const response = await axios.get(`${URL}/customers`);
        customers.value = response.data.map(customer => ({
          ...customer,
          name: customer.name || '',
          surname: customer.surname || '',
          phone: customer.phone || '',
          province: customer.province ? String(customer.province) : '',
          district: customer.district ? String(customer.district) : '',
          CustomerApplications: customer.CustomerApplications?.map(app => ({
            ...app,
            purpose: app.purpose || '',
            status: app.status || '',
            endDate: app.endDate || '',
            createdAt: app.createdAt || app.created_at || new Date().toISOString()
          })) || []
        }));
      } catch (err) {
        console.error('Error fetching customers:', err);
        error.value = translateText('Mijozlarni yuklashda xatolik yuz berdi');
        customers.value = [];
      } finally {
        loading.value = false;
      }
    };

    const getInitials = (name) => {
      return name?.charAt(0)?.toUpperCase() || '?';
    };

    const getStatusColorClass = (status) => {
      switch (status) {
        case 'accepted':
          return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
        case 'waiting':
          return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30';
        case 'completed':
          return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30';
        default:
          return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30';
      }
    };

    const getStatusText = (status) => {
      switch (status) {
        case 'accepted':
          return translateText('Qabul qilingan');
        case 'waiting':
          return translateText('Yurist zimmasiga otkazilganlar');
        case 'completed':
          return translateText('Tugallangan');
        default:
          return translateText('Noma\'lum');
      }
    };

    const formatDate = (isoDate) => {
      if (!isoDate) return '';
      const date = new Date(isoDate);
      if (isNaN(date.getTime())) return '';
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
    };

    onMounted(async () => {
      await fetchCustomers();
      await nextTick();
      initChart();
    });

    return {
      customers,
      chartCanvas,
      statusCounts,
      recentCustomers,
      selectedMonth,
      availableMonths,
      getInitials,
      getStatusColorClass,
      getStatusText,
      formatDate,
      translateText,
      updateChart
    };
  }
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
```