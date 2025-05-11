<script setup>
import { ref, onMounted } from 'vue'
import { Pie, Bar } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title)

// Report selection
const selectedReport = ref('income')
const selectedPeriod = ref('year')

// Chart data for expense categories
const expenseData = ref({
  labels: ['Rent', 'Utilities', 'Salaries', 'Marketing', 'Software', 'Office Supplies', 'Other'],
  datasets: [
    {
      data: [2000, 450, 4200, 1200, 800, 350, 600],
      backgroundColor: [
        '#26a69a', 
        '#42b3a5', 
        '#5ec0b1', 
        '#79ccbd', 
        '#95d8c9', 
        '#b1e4d5', 
        '#cdeee1'
      ],
      borderWidth: 0
    }
  ]
})

// Chart data for income by client
const incomeData = ref({
  labels: ['Acme Corp', 'Globex Inc', 'Stark Industries', 'Wonka Co', 'Wayne Enterprises', 'Other'],
  datasets: [
    {
      data: [3500, 2500, 1800, 1200, 4200, 1500],
      backgroundColor: [
        '#3182ce', 
        '#4a90e2', 
        '#639fee', 
        '#7badf2', 
        '#93bbf5', 
        '#accaf8'
      ],
      borderWidth: 0
    }
  ]
})

// Chart data for revenue over time
const revenueTimeData = ref({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
  datasets: [
    {
      label: 'Revenue',
      data: [15000, 22000, 19000, 23000, 21000, 25000, 24000, 26000, 27000],
      backgroundColor: 'rgba(50, 131, 210, 1)',
    },
    {
      label: 'Expenses',
      data: [8000, 9000, 8500, 10000, 9500, 11000, 10500, 12000, 11500],
      backgroundColor: 'rgba(40, 169, 156, 1)',
    }
  ]
})

// Chart options
const pieOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right',
      labels: {
        padding: 20,
        usePointStyle: true
      }
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          let label = context.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed !== null) {
            label += '$' + context.parsed.toFixed(2);
          }
          return label;
        }
      }
    }
  }
})

const barOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.05)'
      },
      ticks: {
        callback: function(value) {
          return '$' + value.toLocaleString();
        }
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
      callbacks: {
        label: function(context) {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed.y !== null) {
            label += '$' + context.parsed.y.toFixed(2);
          }
          return label;
        }
      }
    }
  }
})

// Report periods
const periods = [
  { id: 'month', label: 'This Month' },
  { id: 'quarter', label: 'This Quarter' },
  { id: 'year', label: 'This Year' },
  { id: 'custom', label: 'Custom Range' }
]

// Report types
const reportTypes = [
  { id: 'income', label: 'Income by Client' },
  { id: 'expenses', label: 'Expenses by Category' },
  { id: 'revenue', label: 'Revenue vs Expenses' },
  { id: 'profit', label: 'Profit Margin' }
]
</script>

<template>
  <div>
    <div class="card report-controls">
      <div class="controls-row">
        <div class="control-group">
          <label for="report-type">Report Type:</label>
          <select id="report-type" v-model="selectedReport" class="form-select">
            <option v-for="type in reportTypes" :key="type.id" :value="type.id">
              {{ type.label }}
            </option>
          </select>
        </div>
        
        <div class="control-group">
          <label for="report-period">Period:</label>
          <select id="report-period" v-model="selectedPeriod" class="form-select">
            <option v-for="period in periods" :key="period.id" :value="period.id">
              {{ period.label }}
            </option>
          </select>
        </div>
        
        <div class="control-actions">
          <button class="btn-primary">Generate Report</button>
          <button class="btn-secondary">Download PDF</button>
        </div>
      </div>
    </div>
    
    <div class="report-grid">
      <!-- Income by Client -->
      <div v-if="selectedReport === 'income'" class="card chart-card">
        <h3>Income by Client - {{ periods.find(p => p.id === selectedPeriod).label }}</h3>
        <div class="chart-container">
          <Pie :data="incomeData" :options="pieOptions" />
        </div>
        <div class="summary-stats">
          <div class="stat-item">
            <span class="stat-label">Total Income:</span>
            <span class="stat-value">$14,700.00</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Top Client:</span>
            <span class="stat-value">Wayne Enterprises ($4,200.00)</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Average Invoice:</span>
            <span class="stat-value">$2,450.00</span>
          </div>
        </div>
      </div>
      
      <!-- Expenses by Category -->
      <div v-if="selectedReport === 'expenses'" class="card chart-card">
        <h3>Expenses by Category - {{ periods.find(p => p.id === selectedPeriod).label }}</h3>
        <div class="chart-container">
          <Pie :data="expenseData" :options="pieOptions" />
        </div>
        <div class="summary-stats">
          <div class="stat-item">
            <span class="stat-label">Total Expenses:</span>
            <span class="stat-value">$9,600.00</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Largest Category:</span>
            <span class="stat-value">Salaries ($4,200.00)</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Smallest Category:</span>
            <span class="stat-value">Office Supplies ($350.00)</span>
          </div>
        </div>
      </div>
      
      <!-- Revenue vs Expenses -->
      <div v-if="selectedReport === 'revenue'" class="card chart-card">
        <h3>Revenue vs Expenses - {{ periods.find(p => p.id === selectedPeriod).label }}</h3>
        <div class="chart-container">
          <Bar :data="revenueTimeData" :options="barOptions" />
        </div>
        <div class="summary-stats">
          <div class="stat-item">
            <span class="stat-label">Total Revenue:</span>
            <span class="stat-value">$202,000.00</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Total Expenses:</span>
            <span class="stat-value">$89,500.00</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Net Profit:</span>
            <span class="stat-value">$112,500.00</span>
          </div>
        </div>
      </div>
      
      <!-- Profit Margin -->
      <div v-if="selectedReport === 'profit'" class="card chart-card">
        <h3>Profit Margin - {{ periods.find(p => p.id === selectedPeriod).label }}</h3>
        <div class="profit-summary">
          <div class="profit-kpi">
            <div class="kpi-circle">
              <span class="kpi-percentage">55.7%</span>
            </div>
            <p class="kpi-label">Profit Margin</p>
          </div>
          
          <div class="profit-details">
            <div class="profit-detail-item">
              <span class="detail-label">Total Revenue:</span>
              <span class="detail-value">$202,000.00</span>
            </div>
            <div class="profit-detail-item">
              <span class="detail-label">Total Expenses:</span>
              <span class="detail-value">$89,500.00</span>
            </div>
            <div class="profit-detail-item">
              <span class="detail-label">Net Profit:</span>
              <span class="detail-value">$112,500.00</span>
            </div>
            <div class="profit-detail-item">
              <span class="detail-label">Previous Period:</span>
              <span class="detail-value">52.3% (+3.4%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.report-controls {
  margin-bottom: var(--space-4);
}

.controls-row {
  display: flex;
  align-items: flex-end;
  gap: var(--space-3);
}

.control-group {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.control-group label {
  margin-bottom: var(--space-1);
  font-weight: 500;
  font-size: 0.875rem;
}

.form-select {
  padding: var(--space-2);
  border: 1px solid var(--color-bg-tertiary);
  border-radius: var(--radius-md);
  font-size: 0.95rem;
}

.form-select:focus {
  outline: none;
  border-color: var(--color-accent);
}

.control-actions {
  display: flex;
  gap: var(--space-2);
}

.btn-primary {
  background-color: var(--color-accent);
  color: white;
}

.btn-secondary {
  background-color: var(--color-bg-secondary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-bg-tertiary);
}

.chart-card {
  margin-bottom: var(--space-4);
}

.chart-card h3 {
  margin-bottom: var(--space-3);
}

.chart-container {
  height: 300px;
  margin-bottom: var(--space-4);
}

.summary-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-3);
  padding-top: var(--space-3);
  border-top: 1px solid var(--color-bg-tertiary);
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-bottom: var(--space-1);
}

.stat-value {
  font-weight: 600;
  font-size: 1.1rem;
}

/* Profit Margin Styles */
.profit-summary {
  display: flex;
  gap: var(--space-5);
  align-items: center;
  padding: var(--space-3) 0;
}

.profit-kpi {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.kpi-circle {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-color: var(--color-success);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--space-2);
  position: relative;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.kpi-circle::before {
  content: '';
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  bottom: 10px;
  border-radius: 50%;
  border: 5px solid rgba(255, 255, 255, 0.2);
}

.kpi-percentage {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
}

.kpi-label {
  font-weight: 500;
  font-size: 1.1rem;
}

.profit-details {
  flex: 1;
}

.profit-detail-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--space-2);
  padding-bottom: var(--space-2);
  border-bottom: 1px solid var(--color-bg-tertiary);
}

.profit-detail-item:last-child {
  border-bottom: none;
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
.detail-label {
  font-weight: 500;
}

.detail-value {
  font-weight: 600;
}

@media (max-width: 768px) {
  .controls-row {
    flex-direction: column;
    gap: var(--space-2);
  }
  
  .control-actions {
    margin-top: var(--space-2);
  }
  
  .summary-stats {
    grid-template-columns: 1fr;
  }
  
  .profit-summary {
    flex-direction: column;
  }
}
</style>