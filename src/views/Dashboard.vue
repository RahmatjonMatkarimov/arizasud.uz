<script>
import KpiCard from "../components/dashboard/KpiCard.vue";
import RevenueChart from "../components/dashboard/RevenueChart.vue";
import TransactionsTable from "../components/dashboard/TransactionsTable.vue";
import InvoicesTable from "../components/dashboard/InvoicesTable.vue";
import axios from "axios";
import { URL, URL1 } from "@/auth/url";
import { gsap } from "gsap";
import translateText from "@/auth/Translate";

export default {
  name: "Dashboard",
  components: { KpiCard, RevenueChart, TransactionsTable, InvoicesTable },
  data() {
    return {
      dat: localStorage.getItem("til") || "datalotin",
      intervalId: null,
      data: 0,
      data1: 0,
      data2: 0,
      data3: 0,
      data4: 0,
      data5: 0,
      data6: 0,
      animatedOylik: 0,
      data7: 0,
      oylik: 0,
      animatedData: 0,
      animatedData1: 0,
      animatedData2: 0,
      animatedData3: 0,
      animatedData4: 0,
      chartData: Array(12).fill(0),
      chartData1: Array(12).fill(0),
      transactions: [],
      invoices: [],
      isLoaded: false,
      animationComplete: false,
      isModalOpen: false,
      selectedKpiTitle: "",
      modalPosition: { top: 0, left: 0 },
      modalContent: [],
      selectedYear: new Date().getFullYear(),
      selectedMonth: new Date().getMonth(),
      availableYears: [],
      availableMonths: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      chartOptions: { scales: { y: { max: 20000, ticks: { stepSize: 4000 } } } },
      monthNames: [
        "Yanvar",
        "Fevral",
        "Mart",
        "Aprel",
        "May",
        "Iyun",
        "Iyul",
        "Avgust",
        "Sentyabr",
        "Oktyabr",
        "Noyabr",
        "Dekabr",
      ],
    };
  },
  methods: {
    translateText,
    async GetOylik() {
      try {
        const { data } = await axios.get(`${URL}/salary/calculate-all-to-date`);
        this.oylik = data.summary;
      } catch (error) {
        console.error("Error fetching salary:", error);
      }
    },
    async Getqarz() {
      try {
        const { data } = await axios.get(`${URL}/client-files/with-debt`);
        this.data5 = data.count;
      } catch (error) {
        console.error(error);
      }
    },
    checkLanguageChange() {
      const currentLang = localStorage.getItem("til") || "datalotin";
      if (currentLang !== this.dat) this.dat = currentLang;
    },
    formatNumberWithDots(number) {
      return Math.floor(number)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    async getClientInvoices() {
      try {
        const { data } = await axios.get(`${URL1}/commoners`);
        this.invoices = data
          .filter((item) => {
            const date = new Date(item.createdAt);
            return (
              date.getFullYear() === Number(this.selectedYear) &&
              date.getMonth() === Number(this.selectedMonth)
            );
          })
          .slice(-5);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    },
    async getClientTransactions() {
      try {
        const { data } = await axios.get(`${URL}/client`);
        this.transactions = data
          .filter((item) => {
            const date = new Date(item.createdAt);
            return (
              date.getFullYear() === Number(this.selectedYear) &&
              date.getMonth() === Number(this.selectedMonth)
            );
          })
          .slice(-5);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    },
    async fetchFinancialData() {
      try {
        let totalRevenue = 0,
          totalRevenue1 = 0,
          totalExpense = 0,
          totalTaxExpense = 0,
          totalBusinessExpense = 0;
        const monthlyRevenue = Array(12).fill(0),
          monthlyExpenses = Array(12).fill(0);

        const { data: accountantItems } = await axios.get(`${URL}/accountant-files`);
        const yearsSet = new Set();
        accountantItems.forEach((item) => {
          if (Array.isArray(item.History)) {
            item.History.forEach((history) => {
              if (history.createdAt)
                yearsSet.add(new Date(history.createdAt).getFullYear());
            });
          }
        });
        const { data: clientFiles } = await axios.get(`${URL}/client-files`);
        clientFiles.forEach((file) => {
          const payment = file.ClientPayment?.[file.ClientPayment.length - 1];
          if (payment?.createdAt) yearsSet.add(new Date(payment.createdAt).getFullYear());
        });
        this.availableYears = Array.from(yearsSet).sort((a, b) => a - b);

        accountantItems.forEach((item) => {
          if (Array.isArray(item.History)) {
            item.History.filter((history) => {
              if (!history.createdAt) return false;
              const date = new Date(history.createdAt);
              return (
                date.getFullYear() === Number(this.selectedYear) &&
                date.getMonth() === Number(this.selectedMonth)
              );
            }).forEach((history) => {
              if (!isNaN(Math.floor(history.totalSum))) {
                const monthIndex = new Date(history.createdAt).getMonth();
                monthlyExpenses[monthIndex] += Math.floor(history.totalSum);
                totalExpense += Math.floor(history.totalSum);
              }
            });
          }
        });

        accountantItems
          .filter((item) => item.type === "reports")
          .forEach((item) => {
            if (Array.isArray(item.History)) {
              item.History.forEach((history) => {
                if (history.createdAt && !isNaN(Math.floor(history.totalSum))) {
                  const monthIndex = new Date(history.createdAt).getMonth();
                  monthlyExpenses[monthIndex] += Math.floor(history.totalSum);
                  totalBusinessExpense += Math.floor(history.totalSum);
                }
              });
            }
          });

        accountantItems
          .filter((item) => item.type === "taxes")
          .forEach((item) => {
            if (Array.isArray(item.History)) {
              item.History.forEach((history) => {
                if (history.createdAt && !isNaN(Math.floor(history.totalSum))) {
                  const monthIndex = new Date(history.createdAt).getMonth();
                  monthlyExpenses[monthIndex] += Math.floor(history.totalSum);
                  totalTaxExpense += Math.floor(history.totalSum);
                }
              });
            }
          });

        const filteredClientFiles = clientFiles
          .filter((file) => {
            const payment = file.ClientPayment?.[file.ClientPayment.length - 1];
            if (!payment?.createdAt) return false;
            const date = new Date(payment.createdAt);
            return (
              date.getFullYear() === Number(this.selectedYear) &&
              date.getMonth() === Number(this.selectedMonth)
            );
          })
          .sort(
            (a, b) =>
              new Date(a.ClientPayment?.[a.ClientPayment.length - 1]?.createdAt || 0) -
              new Date(b.ClientPayment?.[b.ClientPayment.length - 1]?.createdAt || 0)
          );

        this.data7 = filteredClientFiles.filter((file) => {
          const payment = file.ClientPayment?.[file.ClientPayment.length - 1];
          if (!payment?.createdAt) return false;
          const paymentDate = new Date(payment.createdAt);
          const today = new Date();
          return (
            paymentDate.getFullYear() === today.getFullYear() &&
            paymentDate.getMonth() === today.getMonth() &&
            paymentDate.getDate() === today.getDate()
          );
        }).length;

        filteredClientFiles.forEach((file) => {
          const payment = file.ClientPayment?.[file.ClientPayment.length - 1];
          file.ClientPayment?.length > 0 && this.data6++;
          if (payment && payment.createdAt && !isNaN(Math.floor(payment.TotalSum))) {
            const monthIndex = new Date(payment.createdAt).getMonth();
            monthlyRevenue[monthIndex] += Math.floor(payment.TotalSum);
            totalRevenue += Math.floor(payment.TotalSum);
            totalRevenue1 += Math.floor(payment.remainingSum || 0);
          }
        });

        this.data = totalRevenue;
        this.data1 = totalExpense;
        this.data2 = totalTaxExpense;
        this.data3 = totalBusinessExpense;
        this.data4 = totalRevenue1;
        this.chartData = monthlyRevenue;
        this.chartData1 = monthlyExpenses;

        const maxValue = Math.max(
          Math.max(...monthlyRevenue),
          Math.max(...monthlyExpenses)
        );
        this.chartOptions.scales.y.max =
          maxValue > 0 ? Math.ceil((maxValue * 1.1) / 5000) * 5000 : 20000;
        this.chartOptions.scales.y.ticks.stepSize = Math.ceil(
          this.chartOptions.scales.y.max / 5
        );

        this.isLoaded = true;
        this.startAnimations();
      } catch (error) {
        console.error("Error fetching financial data:", error.message);
        this.isLoaded = true;
      }
    },
    hisoblaFoiz(value, percent) {
      return (value * percent) / 100;
    },
    startAnimations() {
      gsap.fromTo(
        ".kpi-card",
        { y: 30, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: 0.15,
          duration: 0.8,
          ease: "back.out(1.7)",
          onComplete: this.animateCounters,
        }
      );
    },
    animateCounters() {
      gsap.to(this.$data, {
        duration: 2,
        animatedData: this.data - this.hisoblaFoiz(this.data, 13),
        ease: "power2.out",
        onUpdate: () => (this.animatedData = Math.round(this.animatedData)),
      });
      gsap.to(this.$data, {
        duration: 2,
        animatedData4: this.data4,
        ease: "power2.out",
        onUpdate: () => (this.animatedData4 = Math.round(this.animatedData4)),
      });
      gsap.to(this.$data, {
        duration: 2,
        animatedData1: this.data1,
        ease: "power2.out",
        onUpdate: () => (this.animatedData1 = Math.round(this.animatedData1)),
      });
      gsap.to(this.$data, {
        duration: 2,
        animatedOylik: this.oylik.totalAllSalaries,
        ease: "power2.out",
        onUpdate: () => (this.animatedOylik = Math.round(this.animatedOylik)),
      });
      gsap.to(this.$data, {
        duration: 2,
        animatedData2: this.data2,
        ease: "power2.out",
        onUpdate: () => (this.animatedData2 = Math.round(this.animatedData2)),
      });
      gsap.to(this.$data, {
        duration: 2,
        animatedData3: this.data3,
        ease: "power2.out",
        onUpdate: () => (this.animatedData3 = Math.round(this.animatedData3)),
        onComplete: this.animateChartAndTables,
      });
    },
    animateChartAndTables() {
      gsap.fromTo(
        ".chart-container",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
      );
      gsap.fromTo(
        "tbody tr",
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, stagger: 0.1, duration: 0.5, ease: "power1.out" }
      );
      this.animationComplete = true;
    },
    openModal(title, event, contentType) {
      this.selectedKpiTitle = title;
      const rect = event.currentTarget.getBoundingClientRect();
      this.modalPosition = {
        top: rect.bottom + window.scrollY + 10,
        left: rect.left + window.scrollX,
      };
      this.modalContent = this.getModalContent(contentType);
      this.isModalOpen = true;
      gsap.fromTo(
        ".modal",
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
      );
    },
    getModalContent(contentType) {
      const t = (text) => (this.dat === "datakril" ? this.translateText(text) : text);
      switch (contentType) {
        case "profit":
          return [
            {
              label: t("Umumiy foyda:"),
              value: this.formatNumberWithDots(this.data),
              suffix: t("so'm"),
              class: "bg-gray-50 dark:bg-slate-700",
            },
            {
              label: t("Jismoniy shaxs daromad solig'i (JShDS) – 12%"),
              value: this.formatNumberWithDots(this.hisoblaFoiz(this.data, 12)),
              suffix: t("so'm"),
              class: "bg-gray-50 dark:bg-slate-700",
            },
            {
              label: t("Majburiy sug'urta badali – 1%"),
              value: this.formatNumberWithDots(this.hisoblaFoiz(this.data, 1)),
              suffix: t("so'm"),
              class: "bg-gray-50 dark:bg-slate-700",
            },
            {
              label: t("Sof foyda:"),
              value: this.formatNumberWithDots(
                this.data - this.hisoblaFoiz(this.data, 13)
              ),
              suffix: t("so'm"),
              class: "bg-green-50 dark:bg-green-900/50",
              valueClass: "text-green-600 dark:text-green-400 font-bold",
            },
          ];
        case "expenses":
          return [
            {
              label: t("Soliq Xarajatlari:"),
              value: this.formatNumberWithDots(this.animatedData2),
              suffix: t("so'm"),
              class: "bg-gray-50 dark:bg-slate-700",
            },
            {
              label: t("Korxona Xarajatlari:"),
              value: this.formatNumberWithDots(this.animatedData3),
              suffix: t("so'm"),
              class: "bg-gray-50 dark:bg-slate-700",
            },
          ];
        case "ish":
          return [
            {
              label: t("Barcha ishchilarning yakuniy oylik maoshi:"),
              value: this.formatNumberWithDots(this.oylik.totalAllSalaries),
              suffix: t("so'm"),
              class: "bg-purple-50 dark:bg-purple-900/50",
              valueClass: "text-purple-600 dark:text-purple-400 font-bold",
            },
            {
              label: t("Barcha ishchilarning bonuslari yig'indisi:"),
              value: this.formatNumberWithDots(this.oylik.totalAllBonuses),
              suffix: t("so'm"),
              class: "bg-purple-50 dark:bg-purple-900/50",
              valueClass: "text-purple-600 dark:text-purple-400 font-bold",
            },
            {
              label: t("Barcha ishchilarning jarimalari yig'indisi:"),
              value: this.formatNumberWithDots(this.oylik.totalAllDeductions),
              suffix: t("so'm"),
              class: "bg-red-50 dark:bg-red-900/50",
              valueClass: "text-red-600 dark:text-red-400 font-bold",
            },
            {
              label: t("Umumiy oylik:"),
              value: this.formatNumberWithDots(this.oylik.totalAllSalaries+ this.oylik.totalAllBonuses - this.oylik.totalAllDeductions),
              suffix: t("so'm"),
              class: "bg-green-50 dark:bg-green-900/50",
              valueClass: "text-green-600 dark:text-green-400 font-bold",
            },
          ];
        case "debts":
          return [
            {
              label: t("Bugun tuzgan shartmonalar soni:"),
              value: this.formatNumberWithDots(this.data7),
              class: "bg-gray-50 dark:bg-slate-700",
            },
            {
              label: t("Shartmona bo'yicha qarzlar soni"),
              value: this.formatNumberWithDots(this.data5),
              class: "bg-red-50 dark:bg-red-900/50",
              valueClass: "text-red-600 dark:text-red-400 font-bold",
            },
            {
              label: t("Bugungacha shartmona tuzganlar soni:"),
              value: this.formatNumberWithDots(this.data6),
              class: "bg-green-50 dark:bg-green-900/50",
              valueClass: "text-green-600 dark:text-green-400 font-bold",
            },
          ];
        default:
          return [];
      }
    },
    closeModal() {
      gsap.to(".modal", {
        opacity: 0,
        y: -20,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => (this.isModalOpen = false),
      });
    },
    async handleSortChange() {
      this.isLoaded = false;
      await Promise.all([
        this.fetchFinancialData(),
        this.getClientInvoices(),
        this.getClientTransactions(),
      ]);
    },
  },
  mounted() {
    this.intervalId = setInterval(this.checkLanguageChange, 0);
    gsap.fromTo(
      ".loading-pulse",
      { scale: 0.8, opacity: 0.5 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.8,
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true,
      }
    );
    this.fetchFinancialData();
    this.getClientInvoices();
    this.getClientTransactions();
    this.GetOylik();
    this.Getqarz();
  },
  beforeDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  },
};
</script>

<style>
@import "@/style.css";
</style>

<template>
  <div
    class="p-6 min-h-screen bg-gray-200 dark:bg-gradient-to-br from-slate-800 to-slate-900 text-gray-100"
  >
    <div class="container mx-auto">
      <div v-if="!isLoaded" class="flex flex-col items-center justify-center h-screen">
        <div class="loading-pulse">
          <svg
            class="animate-spin h-12 w-12 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
        <p class="mt-4 text-white">
          {{
            dat === "datakril"
              ? translateText("Ma'lumotlar yuklanmoqda...")
              : "Ma'lumotlar yuklanmoqda..."
          }}
        </p>
      </div>
      <div v-else>
        <div class="mb-4 flex justify-end text-[20px] space-x-4">
          <div>
            <label for="yearSelect" class="mr-2 text-gray-600 dark:text-gray-300">{{
              dat === "datakril" ? translateText("Yil:") : "Yil:"
            }}</label>
            <select
              id="yearSelect"
              v-model="selectedYear"
              @change="handleSortChange"
              class="p-2 rounded-lg bg-white dark:bg-slate-700 text-gray-800 dark:text-white border border-gray-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option v-for="year in availableYears" :key="year" :value="year">
                {{ year }}
              </option>
            </select>
          </div>
          <div>
            <label for="monthSelect" class="mr-2 text-gray-600 dark:text-gray-300">{{
              dat === "datakril" ? translateText("Oy:") : "Oy:"
            }}</label>
            <select
              id="monthSelect"
              v-model="selectedMonth"
              @change="handleSortChange"
              class="p-2 rounded-lg bg-white dark:bg-slate-700 text-gray-800 dark:text-white border border-gray-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option v-for="(month, index) in monthNames" :key="index" :value="index">
                {{ month }}
              </option>
            </select>
          </div>
        </div>
        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4"
        >
          <KpiCard
            class="kpi-card transition-all text-purple-600 dark:text-white bg-purple-500 bg-opacity-20 dark:bg-gradient-to-r from-[#2a3655] to-[#3d4e81] rounded-lg dark:border border-white/5 shadow-lg hover:shadow-blue-500/5 hover:border-white/10 duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl relative overflow-hidden group cursor-pointer"
            title="Ishchilarni yakuniy oylik maoshi"
            :value="formatNumberWithDots(animatedOylik) + ` so'm`"
            @click="openModal('Ishchilar maoshi', $event, 'ish')"
          />
          <KpiCard
            class="kpi-card transition-all text-purple-600 dark:text-white bg-purple-500 bg-opacity-20 dark:bg-gradient-to-r from-[#2a3655] to-[#3d4e81] rounded-lg dark:border border-white/5 shadow-lg hover:shadow-blue-500/5 hover:border-white/10 duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl relative overflow-hidden group cursor-pointer"
            title="Umumiy Xarajatlar"
            :value="formatNumberWithDots(animatedData1) + ` so'm`"
            @click="openModal('Umumiy xarajatlar', $event, 'expenses')"
          />
          <KpiCard
            class="kpi-card transition-all text-orange-600 dark:text-white bg-orange-500 bg-opacity-20 dark:bg-gradient-to-r from-[#2a3655] to-[#3d4e81] rounded-lg dark:border border-white/5 shadow-lg hover:shadow-blue-500/5 hover:border-white/10 duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl relative overflow-hidden group cursor-pointer"
            title="Shartmona bo'yicha qarzlar"
            :value="formatNumberWithDots(animatedData4) + ` so'm`"
            @click="openModal('Shartmona bo\'yicha qarzlar', $event, 'debts')"
          />
          <KpiCard
            class="kpi-card transition-all text-green-600 dark:text-white bg-green-500 bg-opacity-20 dark:bg-gradient-to-r from-[#2a3655] to-[#3d4e81] rounded-lg dark:border border-white/5 shadow-lg hover:shadow-blue-500/5 hover:border-white/10 duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl relative overflow-hidden group cursor-pointer"
            title="Foyda"
            :value="formatNumberWithDots(animatedData) + ` so'm`"
            @click="openModal('Foyda', $event, 'profit')"
          />
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
          <div class="lg:col-span-2">
            <div
              class="chart-container min-h-full bg-slate-400/20 dark:bg-slate-700/50 backdrop-blur-sm rounded-lg p-4 shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border-gradient-to-r from-green-400 via-blue-500 to-red-500"
            >
              <RevenueChart
                class="min-h-full"
                :revenueData="chartData"
                :expenseData="chartData1"
                :options="chartOptions"
              />
            </div>
          </div>
          <div class="flex flex-col justify-center space-y-4">
            <div
              class="chart-container bg-slate-400/20 dark:bg-slate-700/50 backdrop-blur-sm rounded-lg p-4 shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
              <TransactionsTable :transactions="transactions" />
            </div>
            <div
              class="chart-container bg-slate-400/20 dark:bg-slate-700/50 backdrop-blur-sm rounded-lg p-4 shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
              <InvoicesTable :invoices="invoices" />
            </div>
          </div>
        </div>
        <div v-if="isModalOpen" @click="isModalOpen = false" class="fixed inset-0 z-40">
          <div
            class="modal fixed bg-white dark:bg-slate-800 rounded-xl p-8 w-full max-w-md shadow-xl z-50 border border-gray-100 dark:border-slate-700"
            :style="{
              top: `${modalPosition.top}px`,
              left: `${modalPosition.left - 70}px`,
            }"
          >
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">
                {{
                  dat === "datakril" ? translateText(selectedKpiTitle) : selectedKpiTitle
                }}
              </h2>
              <button
                @click="closeModal"
                class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div class="space-y-4">
              <div
                v-for="(item, index) in modalContent"
                :key="index"
                :class="[
                  'flex items-center p-3 rounded-lg dark:border-none border border-gray-800',
                  item.class,
                ]"
              >
                <span class="text-gray-600 dark:text-gray-300 font-medium w-[240px]">{{
                  item.label
                }}</span>
                <span
                  :class="[
                    'ml-auto font-semibold text-gray-800 dark:text-white',
                    item.valueClass || '',
                  ]"
                  >{{ item.value }} {{ item.suffix || "" }}</span
                >
              </div>
            </div>
            <div class="mt-6 flex justify-end">
              <button
                @click="closeModal"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                {{ dat === "datakril" ? translateText("Yopish") : "Yopish" }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.kpi-card::after {
  content: "";
  position: absolute;
  top: -100%;
  left: -100%;
  width: 70px;
  height: 70px;
  background: rgba(255, 255, 255, 0.15);
  transform: rotate(45deg);
  transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
}
.kpi-card:hover::after {
  top: -30px;
  left: 80%;
}
.chart-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, #38a169, #3182ce, #e53e3e);
  background-size: 200% 100%;
  animation: gradientBorder 3s ease infinite;
}
@keyframes gradientBorder {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
