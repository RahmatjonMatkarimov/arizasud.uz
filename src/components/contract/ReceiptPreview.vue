<template>
    <div class="receipt-preview">
      <div class="preview-header">
        <h2>Chiptani ko'rish</h2>
        <button @click="print">🖨️ Chop etish</button>
      </div>
  
      <!-- Bu yerda receiptHTML ni v-html orqali ko'rsatamiz -->
      <div id="receipt-content" v-html="receiptHTML"></div>
    </div>
  </template>
  
  <script setup>
  import { defineProps } from 'vue';
  
  const props = defineProps({
    receiptHTML: {
      type: String,
      required: true
    }
  });
  
  const print = () => {
    const content = document.getElementById('receipt-content').innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head><title>Chipta</title></head>
        <body>${content}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };
  </script>
  
  <style scoped>
  .receipt-preview {
    padding: 20px;
    max-width: 800px;
    margin: auto;
    font-family: Arial, sans-serif;
  }
  .preview-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  </style>