<template>
    <div class="modal-overlay" @click.self="closeModal">
        <div class="modal">
            <div class="modal-header">
                <h2>
                    {{ dat === 'datakril' ? translateText('Bildirishnomalar') : 'Bildirishnomalar' }}
                </h2>
                <button class="close-btn" @click="closeModal">×</button>
            </div>

            <div class="notifications-list">
                <div v-for="notification in filteredNotifications" :key="notification.id"
                    class="notification-item relative"
                    :class="{ critical: notification.urgency === 'Due today!', soon: notification.urgency === 'Due tomorrow!' }">
                    <p class="message">
                        {{ dat === 'datakril' ? translateText(notification.message) : notification.message }}
                    </p>
                    <p>{{ formatDate(notification.createdAt) }}</p>
                    <button v-if="!notification.isRead" @click="markAsRead(notification.id)"
                        class="bg-lime-500 text-white px-2 py-1 absolute bottom-2 right-2 rounded hover:bg-lime-600">
                        {{ dat === 'datakril' ? translateText('Tushundim') : 'Tushundim' }}
                    </button>
                </div>

                <div v-if="filteredNotifications.length === 0" class="no-notifications">
                    {{ dat === 'datakril' ? translateText('Hozircha bildirishnimalar yoq') :
                        'Hozircha bildirishnimalar yoq' }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue';
import axios from 'axios';
import { io } from 'socket.io-client';
import { URL } from '@/auth/url';
import translateText from '@/auth/Translate';
import { inject } from 'vue';

const dat = inject('dat')
const unreadCount = ref(0);
const socket = ref(null);
const notifications = ref([]);
const selectedFilter = ref("all");
const selectedTime = ref("alltime");

const emit = defineEmits(['close']);

function closeModal() {
    emit('close');
}
// Format date for display
const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
};

// Fetch notifications
const fetchNotifications = async () => {
    try {
        const response = await axios.get(URL + `/accauntant-notification/user/${parseInt(localStorage.getItem('id'))}`);
        notifications.value = response.data;
    } catch (error) {
        console.error('Error fetching notifications:', error);
    }
};

// Fetch unread count
const fetchUnreadCount = async () => {
    try {
        const userId = parseInt(localStorage.getItem('id')); // foydalanuvchining IDsi
        const response = await axios.get(`${URL}/accauntant-notification/unread/count?userId=${userId}`);
        unreadCount.value = response.data;
    } catch (error) {
        console.error('Error fetching unread count:', error);
    }
};

// Mark notification as read
const markAsRead = async (notificationId) => {
    try {
        await axios.put(URL + `/accauntant-notification/${notificationId}/read`);
        await fetchNotifications();
        await fetchUnreadCount();
    } catch (error) {
        console.error('Error marking notification as read:', error);
    }
};
// Initialize Socket.IO
onMounted(() => {
    socket.value = io(URL, {
        query: { userId: parseInt(localStorage.getItem('id')).toString() }
    });

    socket.value.on('notification', (data) => {
        notifications.value = [
            {
                id: data.id || Date.now(),
                message: data.message,
                createdAt: data.createdAt || new Date(),
                isRead: false
            },
            ...notifications.value
        ];
        unreadCount.value += 1;
    });

    fetchNotifications();
    fetchUnreadCount();
});

// Cleanup Socket.IO
onUnmounted(() => {
    if (socket.value) {
        socket.value.disconnect();
    }
});

const filteredNotifications = computed(() => {
    return notifications.value.filter((n) => {
        const filterMatch =
            selectedFilter.value === "all" ||
            (selectedFilter.value === "critical" && n.urgency === "Due today!") ||
            (selectedFilter.value === "soon" && n.urgency === "Due tomorrow!");

        let timeMatch = true;
        if (selectedTime.value === "today") {
            timeMatch = n.urgency === "Due today!";
        } else if (selectedTime.value === "tomorrow") {
            timeMatch = n.urgency === "Due tomorrow!";
        }

        return filterMatch && timeMatch;
    });
});
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: end;
    z-index: 40;
}

* {
    color: black;
}

.modal {
    background: white;
    padding: 20px;
    width: 500px;
    position: relative;
    max-height: 100vh;
    overflow-y: auto;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.close-btn {
    font-size: 24px;
    background: none;
    border: none;
    cursor: pointer;
}

.filters {
    display: flex;
    gap: 10px;
    margin: 15px 0;
}

select {
    padding: 5px;
    border-radius: 4px;
    border: 1px solid #ccc;
}

.notification-item {
    border: 1px solid #ddd;
    padding: 15px;
    margin-bottom: 10px;
    border-left: 5px solid #007bff;
}

.notification-item.critical {
    border-left-color: red;
    background-color: #fff0f0;
}

.notification-item.soon {
    border-left-color: orange;
    background-color: #fff8e1;
}

.message {
    font-weight: 500;
    margin: 5px 0;
}

.pay-btn {
    margin-top: 10px;
    padding: 8px 12px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.no-notifications {
    text-align: center;
    color: gray;
}
</style>