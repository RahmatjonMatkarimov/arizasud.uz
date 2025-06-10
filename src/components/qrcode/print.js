export function printContent(printHTML) {
  const printWindow = window.open("", "_blank");
  printWindow.document.write(printHTML);
  printWindow.document.close();
  setTimeout(() => {
    printWindow.focus();
    printWindow.print();
  }, 100);
  setTimeout(() => {
    printWindow.close();
  }, 100);
  printWindow.addEventListener("afterprint", () => {
    printWindow.close();
  });
}