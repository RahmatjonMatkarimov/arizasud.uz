<script setup>
defineProps({
  invoices: {
    type: Array,
    required: true
  }
})

import translateText from '@/auth/Translate';
import { inject } from 'vue';
const dat = inject('dat')
</script>

<template>
  <div class="invoices-table card">
    <h3 class="text-white">{{ dat === 'datakril' ? translateText('Ariza yozgan mijozlar ro\'yxati ') : 'Ariza yozgan mijozlar ro\'yxati ' }}</h3>
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
        <tr v-for="(transaction,index) in invoices" :key="index+1">
          <td>{{ index+1 }}</td>
          <td></td>
          <td>{{ dat === 'datakril' ? translateText(`${transaction.name} ${transaction.surname} ${transaction.dadname}`) : `${transaction.name} ${transaction.surname} ${transaction.dadname}`}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.invoices-table {
  margin-top: 4px;
}

.card {
  border-radius: var(--radius-md);
  padding: var(--space-4);
  @apply bg-gradient-to-r from-[#2a3655] to-[#3d4e81] rounded-lg border border-white/5 shadow-lg hover:shadow-blue-500/5 hover:border-white/10 transition-all duration-300;

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
  color: white;
}

.table th {
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