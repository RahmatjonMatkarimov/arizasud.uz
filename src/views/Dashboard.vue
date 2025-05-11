<script setup>
import KpiCard from '../components/dashboard/KpiCard.vue'
import RevenueChart from '../components/dashboard/RevenueChart.vue'
import TransactionsTable from '../components/dashboard/TransactionsTable.vue'
import InvoicesTable from '../components/dashboard/InvoicesTable.vue'
import { ref } from 'vue'
import '@/style.css'

// Mock data
const transactions = ref([
  { id: 1, date: 'Sep 21, 2023', description: 'Office Supplies', amount: -200.00 },
  { id: 2, date: 'Sep 19, 2023', description: 'Monthly Subscription', amount: -99.00 },
  { id: 3, date: 'Sep 17, 2023', description: 'Invoice Payment', amount: 2500.00 },
  { id: 4, date: 'Sep 15, 2023', description: 'Invoice Payment', amount: 1000.00 }
])

const invoices = ref([
  { id: 1, number: '#1001', client: 'Acme Corp', status: 'Pending' },
  { id: 2, number: '#1002', client: 'Globex Inc', status: 'Paid' },
  { id: 3, number: '#1003', client: 'Stark Industries', status: 'Paid' },
  { id: 4, number: '#1004', client: 'Wonka Co', status: 'Paid' }
])
</script>

<template>
  <div>
    <div class="kpi-grid">
      <KpiCard title="Revenue" value="$25,000" color="success" />
      <KpiCard title="Expenses" value="$10,500" color="warning" />
      <KpiCard title="Profit" value="$14,500" color="success" />
      <KpiCard title="Accounts Receivable" value="$8,200" color="primary" />
    </div>
    
    <div class="dashboard-grid mt-4">
      <RevenueChart />
      
      <div class="dashboard-tables">
        <TransactionsTable :transactions="transactions" />
        <InvoicesTable :invoices="invoices" class="mt-4" />
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
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
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