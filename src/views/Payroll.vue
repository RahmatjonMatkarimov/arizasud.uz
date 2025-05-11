<script setup>
import { ref } from 'vue'

// Mock employee data
const employees = ref([
  { 
    id: 1, 
    name: 'John Smith', 
    position: 'Software Developer',
    salary: 75000,
    payPeriod: 'Monthly',
    bankAccount: '**** **** **** 1234',
    taxRate: 22,
    deductions: 450
  },
  { 
    id: 2, 
    name: 'Jane Doe', 
    position: 'Marketing Specialist',
    salary: 65000,
    payPeriod: 'Monthly',
    bankAccount: '**** **** **** 5678',
    taxRate: 20,
    deductions: 380
  },
  { 
    id: 3, 
    name: 'Robert Johnson', 
    position: 'Project Manager',
    salary: 85000,
    payPeriod: 'Monthly',
    bankAccount: '**** **** **** 9012',
    taxRate: 24,
    deductions: 520
  },
  { 
    id: 4, 
    name: 'Lisa Chen', 
    position: 'UX Designer',
    salary: 70000,
    payPeriod: 'Monthly',
    bankAccount: '**** **** **** 3456',
    taxRate: 21,
    deductions: 420
  },
])

// Mock payroll history
const payrollHistory = ref([
  {
    id: 1,
    date: 'Aug 31, 2023',
    totalAmount: 18700,
    employeeCount: 4,
    status: 'Completed'
  },
  {
    id: 2,
    date: 'Jul 31, 2023',
    totalAmount: 18700,
    employeeCount: 4,
    status: 'Completed'
  },
  {
    id: 3,
    date: 'Jun 30, 2023',
    totalAmount: 18100,
    employeeCount: 4,
    status: 'Completed'
  },
  {
    id: 4,
    date: 'May 31, 2023',
    totalAmount: 18100,
    employeeCount: 4,
    status: 'Completed'
  }
])

// Selected view
const activeView = ref('employees') // 'employees' or 'history'

// Calculate monthly payment for an employee
function calculateMonthlySalary(employee) {
  const baseSalary = employee.salary / 12;
  const taxAmount = baseSalary * (employee.taxRate / 100);
  const netSalary = baseSalary - taxAmount - employee.deductions;
  return {
    gross: baseSalary.toFixed(2),
    tax: taxAmount.toFixed(2),
    deductions: employee.deductions.toFixed(2),
    net: netSalary.toFixed(2)
  };
}
</script>

<template>
  <div>
    <div class="view-tabs">
      <div 
        class="tab" 
        :class="{ active: activeView === 'employees' }" 
        @click="activeView = 'employees'"
      >
        Employees
      </div>
      <div 
        class="tab" 
        :class="{ active: activeView === 'history' }" 
        @click="activeView = 'history'"
      >
        Payroll History
      </div>
    </div>
    
    <!-- Employees View -->
    <div v-if="activeView === 'employees'" class="card">
      <div class="employee-actions">
        <button class="btn-primary">Add Employee</button>
        <button class="btn-secondary">Run Payroll</button>
      </div>
      
      <div class="employee-list">
        <table class="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Position</th>
              <th>Pay Period</th>
              <th class="text-right">Gross Salary</th>
              <th class="text-right">Tax</th>
              <th class="text-right">Deductions</th>
              <th class="text-right">Net Salary</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="employee in employees" :key="employee.id">
              <td>{{ employee.name }}</td>
              <td>{{ employee.position }}</td>
              <td>{{ employee.payPeriod }}</td>
              <td class="text-right">${{ calculateMonthlySalary(employee).gross }}</td>
              <td class="text-right">${{ calculateMonthlySalary(employee).tax }}</td>
              <td class="text-right">${{ calculateMonthlySalary(employee).deductions }}</td>
              <td class="text-right">${{ calculateMonthlySalary(employee).net }}</td>
              <td>
                <div class="action-buttons">
                  <button class="btn-icon">Edit</button>
                  <button class="btn-icon">Details</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Payroll History View -->
    <div v-if="activeView === 'history'" class="card">
      <div class="history-actions">
        <button class="btn-primary">Run New Payroll</button>
      </div>
      
      <div class="payroll-history">
        <table class="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Employees</th>
              <th class="text-right">Total Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in payrollHistory" :key="record.id">
              <td>{{ record.date }}</td>
              <td>{{ record.employeeCount }}</td>
              <td class="text-right">${{ record.totalAmount.toFixed(2) }}</td>
              <td>
                <span class="badge badge-success">{{ record.status }}</span>
              </td>
              <td>
                <div class="action-buttons">
                  <button class="btn-icon">View Details</button>
                  <button class="btn-icon">Download</button>
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
.view-tabs {
  display: flex;
  margin-bottom: var(--space-4);
  background-color: var(--color-bg-primary);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.tab {
  padding: var(--space-3) var(--space-4);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 2px solid transparent;
}

.tab:hover {
  background-color: var(--color-bg-secondary);
}

.tab.active {
  background-color: var(--color-bg-primary);
  border-bottom: 2px solid var(--color-accent);
  color: var(--color-accent);
}

.employee-actions, .history-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}

.employee-list, .payroll-history {
  overflow-x: auto;
}

.action-buttons {
  display: flex;
  gap: var(--space-1);
}

.btn-icon {
  padding: var(--space-1) var(--space-2);
  font-size: 0.875rem;
  border: 1px solid var(--color-bg-tertiary);
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
@media (max-width: 768px) {
  .view-tabs {
    flex-direction: column;
  }
  
  .tab {
    text-align: center;
  }
}
</style>