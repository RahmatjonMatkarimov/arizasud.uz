<script setup>
import translateText from '@/auth/Translate'
import axios from 'axios'
import { URL } from '@/auth/url'
import { ref, inject, onMounted, watch } from 'vue'

const dat = inject('dat')
const Showmodal = ref(false)
const showChekbox = ref(false)
const name = ref('')
const startDate = ref('')
const endDate = ref('')
const totalSum = ref(null)
const file = ref('')
const ids = ref([])

const invoices = ref([])

// Filters
const filters = ref({
  search: '',
  status: '',
  dateFrom: '',
  dateTo: ''
})

// Selected invoice for details view
const selectedInvoice = ref(null)
const showDetails = ref(false)
const handleImageUpload = (event) => {
  file.value = event.target.files[0];
};

const upload = async () => {
  const formData = new FormData()
  formData.append('name', name.value)
  formData.append('file', file.value)
  formData.append('userId', parseInt(localStorage.getItem('id')))
  formData.append('startDate', new Date(startDate.value).toISOString())
  formData.append('endDate', new Date(endDate.value).toISOString())
  formData.append('totalSum', parseInt(totalSum.value))
  formData.append('type', 'taxes')
  const res = await axios.post(URL + '/accountant-files', formData, {
    headers: {
      "Content-Type": 'mulpar/formData'
    }
  });
  name.value = '';
  file.value = '';
  startDate.value = '';
  endDate.value = '';
  totalSum.value = null
  Showmodal.value = false
  getFiles()
  console.log(res)
}

const getFiles = async () => {
  const res = await axios.get(URL + '/accountant-files')

  let sortedData = res.data.slice() // clone data

  switch (filters.value.status) {
    case 'az':
      sortedData.sort((a, b) =>
        a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
      )
      break
    case 'Paid': // "teskari raqam" deb yozilgan
      sortedData.sort((a, b) => b.id - a.id) // katta id oldin
      break
    default:
      break
  }

  invoices.value = sortedData
}


// View invoice details
function viewInvoice(invoice) {
  selectedInvoice.value = invoice
  showDetails.value = true
}

// Close invoice details
function closeDetails() {
  showDetails.value = false
}

const filteridTime = (date) => {
  let years = date.slice(0, 4);
  let month = date.slice(5, 7);
  let day = date.slice(8, 10)
  return `${day}.${month}.${years}`
}

const FilteredDots = (num) => {
  return Number(num).toLocaleString('uz-UZ', { minimumFractionDigits: 0 }).replace(/,/g, '.')
}

async function deleteManyFiles() {
  removeFiles(ids.value)
}

const removeFiles = async (ids) => {
  try {
    const response = await axios.delete(URL + '/accountant-files/many', {
      data: { ids }, // muhim: DELETE so‘rovda data mustaqil beriladi
    });
    console.log('Deleted:', response.data);
    showChekbox = false
    getFiles()
  } catch (error) {
    console.error('Error deleting files:', error.response?.data || error.message);
  }
}

const selectedAll = () => {
  invoices.value.forEach((el) => {
    ids.value.push(el.id)
  })
}
watch(() => filters.value.status, () => {
  getFiles()
})

onMounted(() => {
  getFiles()
})
</script>

<template>
  <div>
    <!-- Invoices List View -->
    <div v-if="!showDetails" class="card">
      <div class="filters">
        <div class="filter-row">
          <div class="filter-group">
            <label class="text-black" for="search">{{ dat === 'datakril' ? translateText('Qidiruv:') : 'Qidiruv:'
            }}</label>
            <input id="search" type="search" v-model="filters.search" :placeholder="$t('qidiruv')" class="form-input" />
          </div>
          <div class="flex justify-end">
<select id="status" v-model="filters.status"
  class="border focus:w-[500px] focus:border-blue-600 duration-500 text-black border-black h-[40px] w-[300px]">
  <option class="text-black" value="">Tartib raqam</option>
  <option class="text-black" value="Paid">Teskari Yaratilish vaqti</option>
  <option class="text-black" value="az">A-Z nom bo‘yicha</option>
</select>

          </div>
        </div>
        <div class="filter-actions">
          <button @click="Showmodal = !Showmodal" class="btn-primary">{{ dat === 'datakril' ?
            translateText('Yangi hisobot yaratish') :
            'Yangi hisobot yaratish' }}</button>

        </div>
      </div>
      <div class="flex justify-end gap-2">
        <div v-if="ids.length" class="py-4 bg-lime-500 hover:bg-lime-600 duration-300 rounded-lg px-4 "
          @click="selectedAll()">Barchasini
          belgilash</div>
        <div v-if="showChekbox" class="py-4 bg-red-700 hover:bg-red-800 rounded-lg px-4 duration-300"
          @click="deleteManyFiles()">O'chirish
        </div>
        <div v-if="!showChekbox" @click="showChekbox = true"
          class="py-4 bg-red-700 hover:bg-red-800 rounded-lg px-4 duration-300">O'chirishni yoqish
        </div>
      </div>
      <div class="invoice-list">
        <table class="table">
          <thead>
            <tr>
              <th>Hisob-faktura #</th>
              <th>Korxona</th>
              <th>To'langan sana</th>
              <th>Qayta to'lov sanasi</th>
              <th class="text-right">Narx</th>
              <th>Holati</th>
              <th>Harakatlar</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in invoices" :key="item.id">

              <td>{{ item.id }}</td>
              <td>{{ item.name }}</td>
              <td>{{ filteridTime(item.History[item.History.length - 1].startDate) }}</td>
              <td>{{ filteridTime(item.History[item.History.length - 1].endDate) }}</td>
              <td class="text-right">{{ FilteredDots(item.History[item.History.length - 1].totalSum) }} So'm</td>
              <td>
                <span class="badge" :class="item.status === 'Paid' ? 'badge-success' : 'badge-pending'">
                  {{ item.type }}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <button class="btn-icon" @click="viewInvoice(item.History[item.History.length - 1])">View</button>
                  <button class="btn-icon">Edit</button>
                  <div v-if="showChekbox">
                    <input type="checkbox" v-model="ids" :value="item.id" :id="'checkbox-' + item.id"
                      class="peer hidden" />
                    <label :for="'checkbox-' + item.id"
                      class="inline-flex items-center justify-center w-5 h-5 rounded border border-gray-400 peer-checked:bg-blue-600 peer-checked:border-blue-600 transition duration-200 cursor-pointer">
                      <svg v-if="ids.includes(item.id)" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </label>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Invoice Details View -->
    <div v-else class="invoice-details card">
      <div class="invoice-header">
        <div class="back-button" @click="closeDetails">
          &larr; Back to Invoices
        </div>
        <h2>Invoice {{ selectedInvoice.number }}</h2>
        <div class="invoice-status">
          <span class="badge" :class="selectedInvoice.status === 'Paid' ? 'badge-success' : 'badge-pending'">
            {{ selectedInvoice.status }}
          </span>
        </div>
      </div>

      <div class="invoice-info">
        <div class="info-section">
          <h3>Bill To:</h3>
          <p class="client-name">{{ selectedInvoice.client }}</p>
          <p>123 Client Street</p>
          <p>Business City, ST 12345</p>
          <p>client@example.com</p>
        </div>

        <div class="info-section">
          <div class="info-row">
            <span class="info-label">Invoice Number:</span>
            <span class="info-value">{{ selectedInvoice.id }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Invoice Date:</span>
            <span class="info-value">{{ selectedInvoice.startDate }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Due Date:</span>
            <span class="info-value">{{ selectedInvoice.endDate }}</span>
          </div>
        </div>
      </div>

      <div class="invoice-items">
        <table class="table">
          <thead>
            <tr>
              <th>Description</th>
              <th class="text-right">Quantity</th>
              <th class="text-right">Rate</th>
              <th class="text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in selectedInvoice.items" :key="index">
              <td>{{ item.description }}</td>
              <td class="text-right">{{ item.id }}</td>
              <td class="text-right">${{ item.totalSum.toFixed(2) }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" class="text-right"><strong>Total:</strong></td>
              <td class="text-right"><strong>${{ selectedInvoice.totalSum.toFixed(2) }}</strong></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div class="invoice-actions">
        <button class="btn-secondary">Print</button>
        <button class="btn-primary">Mark as Paid</button>
      </div>
    </div>
  </div>

  <div v-if="Showmodal" class="
  fixed inset-0 bg-black bg-opacity-80 z-40 flex justify-center items-center 
  ">
    <div class=" bg-white flex-col rounded relative flex gap-2 p-4">
      <img @click="Showmodal = false" src="../../public/reject.png" class="absolute top-1 right-1 w-[30px]" alt="">
      <h4 class="text-[19px]">Hisobot yaratish</h4>
      <input v-model="name" type="text" class="border border-black p-1 block rounded"
        placeholder="Hisobot nomi kiriting" />
      <input v-model="totalSum" type="number" class="border border-black p-1 block rounded"
        placeholder="To'lanadigan summani" />
      <input v-model="startDate" type="date" class="border border-black p-1 block rounded" placeholder="" />
      <input v-model="endDate" type="date" class="border border-black p-1 block rounded" placeholder="" />
      <input @change="handleImageUpload" type="file" class="border border-black p-1 block rounded" />
      <button @click="upload">Yuborish</button>
    </div>
  </div>
</template>

<style scoped>
.filters {
  margin-bottom: var(--space-4);
}

input {
  color: black;
}

.filter-row {
  display: grid;
  grid-template-columns: 2fr 1fr;
  justify-content: space-between;
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

.form-input,
.form-select {
  padding: var(--space-2);
  border: 1px solid black;
  width: 300px;
  border-radius: var(--radius-md);
  transition: 500ms;
  font-size: 0.95rem;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  width: 80%;
  border-color: var(--color-accent);
}

.filter-actions {
  display: flex;
  justify-content: end;
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

.invoice-list {
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

/* Invoice Details Styles */
.invoice-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-4);
  padding-bottom: var(--space-3);
  border-bottom: 1px solid var(--color-bg-tertiary);
}

.back-button {
  cursor: pointer;
  color: var(--color-accent);
  font-weight: 500;
}

.invoice-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
  margin-bottom: var(--space-4);
}

.info-section {
  padding: var(--space-3);
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-md);
}

.client-name {
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: var(--space-1);
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--space-2);
}

.info-label {
  font-weight: 500;
  color: var(--color-text-secondary);
}

.invoice-items {
  margin-bottom: var(--space-4);
}

body {
  margin: 0;
  color: black;
  min-width: 320px;
  min-height: 100vh;
  background-color: var(--color-bg-secondary);
  color: var(--color-text-primary);
}

h1 {
  font-size: 2rem;
  color: black;
  line-height: 1.2;
  font-weight: 600;
  margin-bottom: var(--space-4);
}

h2 {
  font-size: 1.5rem;
  color: black;
  line-height: 1.3;
  font-weight: 600;
  margin-bottom: var(--space-3);
}

h3 {
  font-size: 1.25rem;
  color: black;
  line-height: 1.4;
  font-weight: 600;
  margin-bottom: var(--space-2);
}

a {
  text-decoration: none;
  color: black;
  color: var(--color-accent);
}

button,
.btn {
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  color: black;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: var(--color-accent);
  color: white;
  background-color: #2c73b4;
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
  color: black;
  padding: var(--space-4);
  box-shadow: var(--shadow-md);
}

.text-success {
  color: black;
  color: var(--color-success);
}

.text-warning {
  color: black;
  color: var(--color-warning);
}

.text-error {
  color: black;
  color: var(--color-error);
}

.table {
  width: 100%;
  color: black;
  border-collapse: collapse;
}

.table th,
.table td {
  padding: var(--space-2) var(--space-3);
  color: black;
  text-align: left;
}

.table th {
  background-color: var(--color-bg-secondary);
  color: black;
  font-weight: 600;
}

.table tr {
  color: black;
  border-bottom: 1px solid var(--color-bg-tertiary);
}

.table tr:last-child {
  color: black;
  border-bottom: none;
}

.table tr:hover {
  color: black;
  background-color: var(--color-bg-secondary);
}

.badge {
  display: inline-block;
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
  color: black;
  font-weight: 500;
}

.badge-success {
  background-color: rgba(56, 161, 105, 0.1);
  color: black;
  color: var(--color-success);
}

.badge-pending {
  background-color: rgba(237, 137, 54, 0.1);
  color: black;
  color: var(--color-warning);
}

.negative {
  color: black;
  color: var(--color-error);
}

.positive {
  color: black;
  color: var(--color-success);
}

.invoice-actions {
  display: flex;
  justify-content: flex-end;
  color: black;
  gap: var(--space-3);
}

@media (max-width: 768px) {

  .filter-row,
  .invoice-info {
    color: black;
    grid-template-columns: 1fr;
  }

  .invoice-header {
    flex-direction: column;
    color: black;
    align-items: flex-start;
    gap: var(--space-2);
  }
}
</style>