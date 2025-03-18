<template>
    <div class="worklog-manager">
        <div class="worklog-list-container">
            <div class="worklog-list-header">
                <h2>Ishchilarning Ishlar Ro'yxati</h2>
                <span class="log-count">{{ data.length }} ta ish qayd etilgan</span>
            </div>

            <div v-if="data.length === 0" class="no-logs">
                <p>Hali bajarilgan ishlar qayd etilmagan</p>
            </div>
            <div v-else>
                <div v-for="workLog in data" :key="workLog.id" class="worklog-card">
                    <div class="worklog-view flex items-center gap-5">
                        <div class="">
                            <img class="w-[60px]" :src="'https://backend.arizasud.uz/upload/' + workLog.user.img"
                                alt="">
                        </div>
                        <div class="worklog-content">
                            <p class="worklog-text">{{ workLog.comment }}</p>
                            <div class="worklog-meta">
                                <span class="text-[#172029]">Qayd etilgan: {{ formatDate(workLog.createdAt) }}</span>
                                <span class="text-[#172029]">Foydalanuvchi: {{ workLog.user.name }} {{
                                    workLog.user.surname }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { URL } from '@/auth/url'

export default {
    setup() {
        const userId = parseInt(localStorage.getItem('id')) || null
        const data = ref([])

        const fetchWorkLogs = async () => {
            try {
                const response = await axios.get(`${URL}/reminders`)
                data.value = response.data
                console.log(response.data)
            } catch (error) {
                console.error('Ishlar ro\'yxatini olishda xatolik:', error)
                alert('Ishlar ro\'yxatini yuklashda xatolik yuz berdi.')
            }
        }

        const formatDate = (dateString) => {
            return new Date(dateString).toLocaleString('uz-UZ')
        }

        onMounted(async () => {
            if (!userId) {
                console.warn('localStorage\'da foydalanuvchi ID topilmadi')
                alert('Iltimos, tizimga kiring.')
                return
            }
            await fetchWorkLogs()
        })

        return {
            data,
            formatDate
        }
    }
}
</script>

<style scoped>
.worklog-manager {
    max-width: 800px;
    margin: 20px auto;
    padding: 20px;
}

.worklog-list-container {
    background: #fff;
    border: 1px solid #eee;
    padding: 15px;
}

.worklog-list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
}

.worklog-list-header h2 {
    margin: 0;
    font-size: 20px;
    color: #333;
}

.log-count {
    font-size: 14px;
    color: #666;
}

.no-logs {
    text-align: center;
    padding: 20px;
    color: #666;
}

.worklog-card {
    border: 1px solid #eee;
    padding: 15px;
    margin-bottom: 10px;
    background: #fafafa;
}

.worklog-text {
    margin: 0 0 10px 0;
    color: #333;
    font-size: 15px;
}

.worklog-meta {
    font-size: 13px;
    color: #666;
}

.worklog-meta span {
    display: block;
    margin: 5px 0;
}
</style>