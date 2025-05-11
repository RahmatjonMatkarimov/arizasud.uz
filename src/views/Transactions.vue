<script setup>
import { ref } from 'vue'

// Mock data
const transactions = ref([
  { id: 1, date: 'Sep 25, 2023', description: 'Client Payment - Acme Corp', amount: 3500.00, category: 'Income', account: 'Business Checking' },
  { id: 2, date: 'Sep 23, 2023', description: 'Rent Payment', amount: -2000.00, category: 'Expenses', account: 'Business Checking' },
  { id: 3, date: 'Sep 21, 2023', description: 'Office Supplies', amount: -200.00, category: 'Expenses', account: 'Business Credit Card' },
  { id: 4, date: 'Sep 19, 2023', description: 'Software Subscription', amount: -99.00, category: 'Expenses', account: 'Business Credit Card' },
  { id: 5, date: 'Sep 17, 2023', description: 'Client Payment - Globex Inc', amount: 2500.00, category: 'Income', account: 'Business Checking' },
  { id: 6, date: 'Sep 15, 2023', description: 'Client Payment - Stark Industries', amount: 1800.00, category: 'Income', account: 'Business Checking' },
  { id: 7, date: 'Sep 10, 2023', description: 'Utility Bills', amount: -350.00, category: 'Expenses', account: 'Business Checking' },
  { id: 8, date: 'Sep 05, 2023', description: 'Employee Salary', amount: -4200.00, category: 'Payroll', account: 'Business Checking' },
  { id: 9, date: 'Sep 03, 2023', description: 'Client Payment - Wonka Co', amount: 1200.00, category: 'Income', account: 'Business Checking' },
  { id: 10, date: 'Sep 01, 2023', description: 'Internet Bill', amount: -89.99, category: 'Expenses', account: 'Business Credit Card' }
])

const filters = ref({
  search: '',
  category: '',
  dateFrom: '',
  dateTo: '',
  account: ''
})

const categories = ['Income', 'Expenses', 'Payroll', 'Taxes', 'Other']
const accounts = ['Business Checking', 'Business Savings', 'Business Credit Card']

// Computed filtered transactions
const filteredTransactions = computed(() => {
  return transactions.value.filter(transaction => {
    // Filter by search
    if (filters.value.search && !transaction.description.toLowerCase().includes(filters.value.search.toLowerCase())) {
      return false
    }
    
    // Filter by category
    if (filters.value.category && transaction.category !== filters.value.category) {
      return false
    }
    
    // Filter by account
    if (filters.value.account && transaction.account !== filters.value.account) {
      return false
    }
    
    // Add date filters here when implemented
    
    return true
  })
})

// Clear filters
function clearFilters() {
  filters.value = {
    search: '',
    category: '',
    dateFrom: '',
    dateTo: '',
    account: ''
  }
}
</script>

<template>
  <div>
    <div class="card">
      <div class="filters">
        <div class="filter-row">
          <div class="filter-group">
            <label for="search">Search:</label>
            <input 
              id="search" 
              type="text" 
              v-model="filters.search" 
              placeholder="Search transactions..." 
              class="form-input"
            />
          </div>
          
          <div class="filter-group">
            <label for="category">Category:</label>
            <select id="category" v-model="filters.category" class="form-select">
              <option value="">All Categories</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
          
          <div class="filter-group">
            <label for="account">Account:</label>
            <select id="account" v-model="filters.account" class="form-select">
              <option value="">All Accounts</option>
              <option v-for="account in accounts" :key="account" :value="account">
                {{ account }}
              </option>
            </select>
          </div>
        </div>
        
        <div class="filter-actions">
          <button class="btn-secondary" @click="clearFilters">Clear Filters</button>
          <button class="btn-primary">Add Transaction</button>
        </div>
      </div>
      
      <div class="transaction-list">
        <table class="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Account</th>
              <th class="text-right">Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="transaction in filteredTransactions" :key="transaction.id">
              <td>{{ transaction.date }}</td>
              <td>{{ transaction.description }}</td>
              <td>{{ transaction.category }}</td>
              <td>{{ transaction.account }}</td>
              <td class="text-right" :class="{'negative': transaction.amount < 0, 'positive': transaction.amount > 0}">
                {{ transaction.amount < 0 ? `-$${Math.abs(transaction.amount).toFixed(2)}` : `$${transaction.amount.toFixed(2)}` }}
              </td>
              <td>
                <div class="action-buttons">
                  <button class="btn-icon">Edit</button>
                  <button class="btn-icon delete">Delete</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.filters {
  margin-bottom: var(--space-4);
}

.filter-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-3);
  margin-bottom: var(--space-3);
}

.filter-group {
  display: flex;
  flex-direction: column;
}

.filter-group label {
  margin-bottom: var(--space-1);
  font-weight: 500;
  font-size: 0.875rem;
}

.form-input, .form-select {
  padding: var(--space-2);
  border: 1px solid var(--color-bg-tertiary);
  border-radius: var(--radius-md);
  font-size: 0.95rem;
}

.form-input:focus, .form-select:focus {
  outline: none;
  border-color: var(--color-accent);
}

.filter-actions {
  display: flex;
  justify-content: space-between;
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

.transaction-list {
  overflow-x: auto;
}

.action-buttons {
  display: flex;
  gap: var(--space-1);
}

.btn-icon {
  padding: var(--space-1) var(--space-2);
  font-size: 0.875rem;
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-bg-tertiary);
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
.btn-icon.delete {
  color: var(--color-error);
}

@media (max-width: 768px) {
  .filter-row {
    grid-template-columns: 1fr;
  }
}
</style>