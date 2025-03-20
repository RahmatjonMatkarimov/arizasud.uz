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
            <div v-for="workLog in data" :key="workLog.id" class="worklog-card">
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
  import { ref, onMounted, inject,  } from 'vue';
  import axios from 'axios';
  import { URL } from '@/auth/url';
  import translateText from '@/auth/Translate';
  
  export default {
    setup() {
      const userId = parseInt(localStorage.getItem('id')) || null;
      const data = ref([]);
      const dat = inject('dat')
  
      const fetchWorkLogs = async () => {
        try {
          const response = await axios.get(`${URL}/reminders`);
          data.value = response.data;
          console.log(response.data);
        } catch (error) {
          console.error(dat.value === 'datakril' ? 'Ишлар рўйхатини олишда хатолик:' : 'Ishlar ro\'yxatini olishda xatolik:', error);
          alert(dat.value === 'datakril' ? 'Ишлар рўйхатини юклашда хатолик юз берди.' : 'Ishlar ro\'yxatini yuklashda xatol Petter yuz berdi.');
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
        translateText
      };
    }
  };
  </script>
  
  <style scoped>
  .container {
    background-color: #3486eb;
    padding: 100px 0px;
  }
  
  .worklog-manager {
    max-width: 800px;
    margin: 20px auto;
    padding: 20px;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .worklog-list-container {
    background: rgba(255, 255, 255, 0.95);
    border: none;
    padding: 20px;
    border-radius: 8px;
    backdrop-filter: blur(5px);
  }
  
  .worklog-list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 2px solid #7f9cf5;
  }
  
  .worklog-list-header h2 {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
    background: linear-gradient(to right, #3498db, #8e44ad);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  .log-count {
    font-size: 14px;
    color: #6366f1;
    background: #e0e7ff;
    padding: 4px 10px;
    border-radius: 12px;
  }
  
  .no-logs {
    text-align: center;
    padding: 30px;
    color: #7c3aed;
    background: #f3e8ff;
    border-radius: 8px;
    margin: 10px 0;
  }
  
  .no-logs p {
    margin: 0;
    font-size: 16px;
    font-weight: 500;
  }
  
  .worklog-card {
    border: none;
    padding: 15px;
    margin-bottom: 15px;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    background-color: #4a91e8;
  }
  
  .worklog-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
    background-color: #036ff2;
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
    border: 2px solid #60a5fa;
    padding: 2px;
    background: #fff;
  }
  
  .worklog-view img:hover {
    width: 100px;
    height: 100px;
    transition: 500ms ease all;
  }
  
  .worklog-text {
    margin: 0 0 12px 0;
    color: #ffffff;
    font-size: 16px;
    line-height: 1.5;
    font-weight: 500;
  }
  
  .worklog-meta {
    font-size: 13px;
    color: #475569;
  }
  
  .worklog-meta span {
    display: block;
    margin: 6px 0;
    padding: 4px 8px;
    border-radius: 6px;
    background: rgba(241, 245, 249, 0.7);
  }
  
  .worklog-meta span:first-child {
    background: rgba(147, 197, 253, 0.2);
    color: #ffffff;
  }
  
  .worklog-meta span:last-child {
    background: rgba(167, 243, 208, 0.2);
    color: #ffffff;
  }
  </style>