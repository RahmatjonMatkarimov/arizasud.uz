<script setup>
defineProps({
  transactions: {
    type: Array,
    required: true
  }
})
import translateText from '@/auth/Translate';
import { inject } from 'vue';
const dat = inject('dat')
</script>

<template>
  <div class="transactions-table card">
    <h3>{{ dat === 'datakril' ? translateText('Shartnoma tuzgan mijozlar ro\'yxati') :
      'Shartnoma tuzgan mijozlar ro\'yxati' }}</h3>
    <table class="table">
      <thead>
        <tr>
          <th>
            #
          </th>
          <th>
          </th>
          <th>{{ dat === 'datakril' ? translateText('F.I.SH:') : 'F.I.SH:' }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(transaction, index) in transactions" :key="index + 1">
          <td>{{ index + 1 }}</td>
          <td></td>
          <td>{{ dat === 'datakril' ? translateText(`${transaction.name} ${transaction.surname} ${transaction.dadname}`)
            : `${transaction.name} ${transaction.surname} ${transaction.dadname}` }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.transactions-table {
  margin-top: 4px;
  @apply bg-gradient-to-r from-[#2a3655] to-[#3d4e81] rounded-lg border border-white/5 shadow-lg hover:shadow-blue-500/5 hover:border-white/10 transition-all duration-300;
}

* {
  color: white;
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

button,
.btn {
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

button:hover,
.btn:hover {
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

.table th,
.table td {
  padding: var(--space-2) var(--space-3);
  text-align: left;
}

.table th {
  /* background-color: var(--color-bg-secondary); */
  font-weight: 600;
}

.table tr:last-child {
  border-bottom: none;
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