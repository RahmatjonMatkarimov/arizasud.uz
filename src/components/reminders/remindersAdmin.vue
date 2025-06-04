<template>
  <div class="container">
    <div class="worklog-manager">
      <div class="worklog-list-container">
        <div class="worklog-list-header">
          <h2>{{ dat === 'datakril' ? translateText("Ишчиларнинг Ишлар Рўйхати") : "Ishchilarning Ishlar Ro'yxati" }}</h2>
          <span class="log-count">{{ data.length }} {{ dat === 'datakril' ? translateText("та иш қайд этилган") : "ta ish qayd etilgan" }}</span>
        </div>
        <div v-if="data.length === 0" class="no-logs">
          <p>{{ dat === 'datakril' ? translateText("Ҳали бажарилган ишлар қайд этилмаган") : "Hali bajarilgan ishlar qayd etilmagan" }}</p>
        </div>
        <div v-else>
          <div v-for="workLog in data" :key="workLog.id" class="worklog-card" @click="toggleActive(workLog)">
            <div class="worklog-view flex items-center gap-5">
              <img class="w-[60px] border" :src="'https://backend.arizasud.uz/upload/' + workLog.user.img" alt="">
              <div class="worklog-content">
                <p class="worklog-text">{{ dat === 'datakril' ? translateText(workLog.comment) : workLog.comment }}</p>
                <div class="worklog-meta">
                  <span class="text-[#172029]">{{ dat === 'datakril' ? translateText("Қайд этилган:") : "Qayd etilgan:" }} {{ formatDate(workLog.createdAt) }}</span>
                  <span class="text-[#172029]">{{ dat === 'datakril' ? translateText("Фойдаланувчи:") : "Foydalanuvchi:" }} {{ workLog.user.name }} {{ workLog.user.surname }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, inject, onUnmounted } from 'vue';
import axios from 'axios';
import { URL } from '@/auth/url';
import translateText from '@/auth/Translate';

export default {
  setup() {
    const userId = parseInt(localStorage.getItem('id')) || null;
    const data = ref([]);
const dat = ref(localStorage.getItem("til") || "datalotin");

let intervalId = null;
const checkLanguageChange = () => {
  const currentLang = localStorage.getItem("til") || "datalotin";
  if (currentLang !== dat.value) {
    dat.value = currentLang;
  }
};

onMounted(() => {
  intervalId = setInterval(checkLanguageChange, 0);
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});

    const fetchWorkLogs = async () => {
      try {
        const response = await axios.get(`${URL}/reminders`);
        data.value = response.data.filter(workLog => workLog.isActive === false);
      } catch (error) {
        console.error(dat.value === 'datakril' ? 'Ишлар рўйхатини олишда хатолик:' : 'Ishlar ro\'yxatini olishda xatolik:', error);
        alert(dat.value === 'datakril' ? 'Ишлар рўйхатини юклашда хатолик юз берди.' : 'Ishlar ro\'yxatini yuklashda xatolik yuz berdi.');
      }
    };

    const toggleActive = async (workLog) => {
      try {
        const response = await axios.put(`${URL}/reminders/${workLog.id}`, {
          isActive: true
        });
        await fetchWorkLogs();
      } catch (error) {
        console.error(dat.value === 'datakril' ? 'Статусни ўзгартиришда хатолик:' : 'Statusni o\'zgartirishda xatolik:', error);
        alert(dat.value === 'datakril' ? 'Статусни ўзгартиришда хатолик юз берди.' : 'Statusni o\'zgartirishda xatolik yuz berdi.');
      }
    };

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleString('uz-UZ');
    };

    onMounted(async () => {
      if (!userId) {
        console.warn(dat.value === 'datakril' ? 'localStorage\'да фойдаланувчи ID топилмади' : 'localStorage\'da foydalanuvchi ID topilmadi');
        alert(dat.value === 'datakril' ? 'Илтимос, тизимга киринг.' : 'Iltimos, tizimga kiring.');
        return;
      }
      await fetchWorkLogs();
    });

    return {
      data,
      dat,
      formatDate,
      toggleActive,
      translateText
    };
  }
};
</script>

<style scoped>
.container {
  min-height: 100vh;
  min-width: 100%;
  background: #1a2a44;
  padding: 100px 0px;
}

.worklog-manager {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.worklog-list-container {
  background: #ffffff;
  padding: 20px;
  border-radius: 8px;
}

.worklog-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #dfe6e9;
}

.worklog-list-header h2 {
  font-size: 20px;
  font-weight: 600;
  color: #34495e;
  margin: 0;
}

.log-count {
  font-size: 14px;
  color: #6366f1;
  background: #e0e7ff;
  padding: 4px 12px;
  border-radius: 12px;
}

.no-logs {
  text-align: center;
  padding: 20px;
  color: #34495e;
}

.no-logs p {
  margin: 0;
  font-size: 14px;
}

.worklog-card {
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 8px;
  background-color: #2c3e50;
  transition: all 0.2s ease;
  cursor: pointer; /* Added to indicate clickability */
}

.worklog-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: #34495e;
}

.worklog-view {
  display: flex;
  align-items: center;
  gap: 15px;
}

.worklog-view img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #3498db;
  padding: 2px;
  background: #fff;
}

.worklog-view img:hover {
  width: 100px;
  height: 100px;
  transition: 500ms ease all;
}

.worklog-text {
  color: #ffffff;
  margin-bottom: 10px;
  line-height: 1.5;
  font-size: 14px;
}

.worklog-meta span {
  display: block;
  font-size: 13px;
  color: #ffffff;
  background: rgba(241, 245, 249, 0.7);
  padding: 4px 8px;
  border-radius: 6px;
  margin: 2px 0;
}
</style>