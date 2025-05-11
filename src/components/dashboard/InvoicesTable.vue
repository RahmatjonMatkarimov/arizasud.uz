<script setup>
defineProps({
  invoices: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <div class="invoices-table card">
    <h3>Latest Invoices</h3>
    <table class="table">
      <thead>
        <tr>
          <th>Invoice#</th>
          <th>Client</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="invoice in invoices" :key="invoice.id">
          <td>{{ invoice.number }}</td>
          <td>{{ invoice.client }}</td>
          <td>
            <span class="badge" :class="invoice.status === 'Paid' ? 'badge-success' : 'badge-pending'">
              {{ invoice.status }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.invoices-table {
  margin-top: var(--space-4);
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
</style>