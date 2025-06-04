<template>
  <div class="p-5">
    <!-- Faqat Print tugmasi -->
    <button @click="printContent" class="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300">
      Print qilish
    </button>
  </div>
</template>

<script>
export default {
  name: 'PrintComponent',
  data() {
    return {
    }
  },
  methods: {
    printContent() {
      const printWindow = window.open('', '_blank');
      const printHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Print</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              line-height: 1.6;
            }
            @media print {
              body {
                margin: 0;
                padding: 20px;
              }
              @page {
                margin: 0;
              }
            }
          </style>
        </head>
        <body>
          <div>
            <h1>Namuna Hujjat</h1>
            <p>Bu yerda print qilinadigan kontent joylashtiriladi.</p>
            <ul>
              <li>Birinchi element</li>
              <li>Ikkinchi element</li>
              <li>Uchinchi element</li>
            </ul>
            <p>Sana: <strong>${new Date().toLocaleDateString()}</strong></p>
          </div>
        </body>
        </html>
      `;
      
      // Kontentni yozish va print qilish
      printWindow.document.write(printHTML);
      printWindow.document.close();
      
      // Print dialog ochish
      printWindow.focus();
      printWindow.print();
      
      // Print bekor qilingan yoki tugagandan keyin window ni yopish
      setTimeout(() => {
        printWindow.close();
      }, 100);
      
      // Yoki print tugagandan keyin window ni yopish
      printWindow.addEventListener('afterprint', () => {
        printWindow.close();
      });
    }
  }
}
</script>

<style>
/* Tailwind CSS bilan ishlash uchun qo'shimcha style kerak emas */
</style>