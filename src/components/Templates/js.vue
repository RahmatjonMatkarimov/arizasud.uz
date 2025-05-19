<template>
  <div class="notification-container">
    <div class="header">
      <h2>Bildirishnomalar</h2>
      <div class="header-actions">
        <button @click="fetchNotifications" :disabled="isLoading" class="refresh-btn">
          <i class="fas fa-sync-alt" :class="{ 'fa-spin': isLoading }"></i>
        </button>
        <button @click="markAllAsRead" class="read-all-btn" :disabled="!notifications.length || !unreadNotifications.length">
          Hammani o'qilgan deb belgilash
        </button>
      </div>
    </div>

    <div v-if="error" class="error-message">
      <div class="error-content">
        <span>{{ error }}</span>
        <button @click="clearError" class="close-btn">×</button>
      </div>
    </div>

    <div class="status-bar">
      <div class="connection-status" :class="{ connected: isConnected }">
        <i class="fas" :class="isConnected ? 'fa-plug' : 'fa-plug-circle-exclamation'"></i>
        {{ isConnected ? 'Serverga ulangan' : 'Server bilan aloqa yo\'q' }}
        <button v-if="!isConnected" @click="reconnect" class="reconnect-btn">
          Ulanish
        </button>
      </div>
      <div class="notification-badge" v-if="unreadCount > 0">
        {{ unreadCount }} o'qilmagan
      </div>
    </div>

    <div class="tabs">
      <button 
        @click="activeTab = 'notifications'" 
        :class="{ active: activeTab === 'notifications' }"
        class="tab-btn"
      >
        Bildirishnomalar
      </button>
      <button 
        @click="activeTab = 'online'" 
        :class="{ active: activeTab === 'online' }"
        class="tab-btn"
      >
        Online Foydalanuvchilar
      </button>
      <button 
        v-if="isAdmin"
        @click="activeTab = 'send'" 
        :class="{ active: activeTab === 'send' }"
        class="tab-btn"
      >
        Bildirishnoma Yuborish
      </button>
    </div>

    <!-- Notifications Tab -->
    <div v-if="activeTab === 'notifications'" class="tab-content">
      <div v-if="isLoading" class="loading">
        <div class="spinner"></div>
        <p>Bildirishnomalar yuklanmoqda...</p>
      </div>
      
      <div v-else-if="notifications.length === 0" class="empty-state">
        <i class="fas fa-bell-slash"></i>
        <p>Hozircha bildirishnomalar yo'q</p>
      </div>
      
      <div v-else class="notifications-list">
        <div 
          v-for="notification in notifications" 
          :key="notification.id" 
          class="notification-item"
          :class="{ unread: !notification.read }"
          @click="markAsRead(notification.id)"
        >
          <div class="notification-icon">
            <i class="fas" :class="getNotificationIcon(notification.type)"></i>
          </div>
          <div class="notification-content">
            <div class="notification-message">{{ notification.message }}</div>
            <div class="notification-time">{{ formatDate(notification.sentAt) }}</div>
          </div>
          <div class="notification-status">
            <i v-if="notification.read" class="fas fa-check read-icon"></i>
            <i v-else class="fas fa-circle unread-icon"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Online Users Tab -->
    <div v-if="activeTab === 'online'" class="tab-content">
      <div v-if="isLoading" class="loading">
        <div class="spinner"></div>
        <p>Online foydalanuvchilar yuklanmoqda...</p>
      </div>
      
      <div v-else-if="onlineUsers.length === 0" class="empty-state">
        <i class="fas fa-users-slash"></i>
        <p>Hozircha online foydalanuvchilar yo'q</p>
      </div>
      
      <div v-else class="users-list">
        <div v-for="user in onlineUsers" :key="user.id" class="user-item">
          <div class="user-avatar">
            <i class="fas fa-user"></i>
            <span class="online-indicator"></span>
          </div>
          <div class="user-info">
            <div class="user-name">{{ user.name }} {{ user.surname }}</div>
            <div class="user-status">Online</div>
          </div>
          <div v-if="isAdmin" class="user-actions">
            <button @click="prepareNotification(user)" class="notify-btn">
              <i class="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Send Notification Tab (Admin only) -->
    <div v-if="activeTab === 'send' && isAdmin" class="tab-content">
      <div class="send-notification-form">
        <h3>Bildirishnoma yuborish</h3>
        
        <div class="form-group">
          <label for="recipientType">Qabul qiluvchilar:</label>
          <select v-model="notificationForm.recipientType" id="recipientType" class="form-control">
            <option value="all">Barcha foydalanuvchilar</option>
            <option value="single">Bitta foydalanuvchi</option>
          </select>
        </div>
        
        <div v-if="notificationForm.recipientType === 'single'" class="form-group">
          <label for="recipient">Foydalanuvchi:</label>
          <select v-model="notificationForm.recipientId" id="recipient" class="form-control">
            <option v-for="user in onlineUsers" :key="user.id" :value="user.id">
              {{ user.name }} {{ user.surname }}
            </option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="notificationType">Bildirishnoma turi:</label>
          <select v-model="notificationForm.type" id="notificationType" class="form-control">
            <option value="ALERT">Ogohlantirish</option>
            <option value="REMINDER">Eslatma</option>
            <option value="WORK_END">Ish tugashi</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="message">Xabar:</label>
          <textarea 
            v-model="notificationForm.message" 
            id="message" 
            rows="3" 
            class="form-control"
            placeholder="Bildirishnoma matni..."
          ></textarea>
        </div>
        
        <div class="form-actions">
          <button 
            @click="sendNotification" 
            class="send-btn" 
            :disabled="!notificationForm.message || isSending"
          >
            <i class="fas fa-paper-plane"></i>
            Yuborish
          </button>
          
          <button @click="testBirthdayCheck" class="test-btn">
            <i class="fas fa-birthday-cake"></i>
            Tug'ilgan kunlarni tekshirish
          </button>
        </div>
      </div>
    </div>

    <!-- Notification Detail Modal -->
    <div v-if="selectedNotification" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Bildirishnoma ma'lumotlari</h3>
          <button @click="selectedNotification = null" class="close-btn">×</button>
        </div>
        <div class="modal-body">
          <div class="notification-detail">
            <div class="detail-row">
              <span class="detail-label">Turi:</span>
              <span class="detail-value">{{ getNotificationTypeName(selectedNotification.type) }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Vaqti:</span>
              <span class="detail-value">{{ formatDateFull(selectedNotification.sentAt) }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Holati:</span>
              <span class="detail-value">{{ selectedNotification.read ? 'O\'qilgan' : 'O\'qilmagan' }}</span>
            </div>
            <div class="detail-row message-row">
              <span class="detail-label">Xabar:</span>
              <div class="detail-message">{{ selectedNotification.message }}</div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button 
            @click="markAsRead(selectedNotification.id)" 
            class="read-btn" 
            :disabled="selectedNotification.read"
          >
            O'qilgan deb belgilash
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, defineProps, defineEmits } from 'vue';
import useNotification from './js';

export default {
  name: 'NotificationPanel',
  
  props: {
    userId: {
      type: [String, Number],
      required: true
    },
    isAdmin: {
      type: Boolean,
      default: false
    }
  },
  
  emits: ['notification-read', 'notification-sent'],
  
  setup(props, { emit }) {
    // State
    const activeTab = ref('notifications');
    const selectedNotification = ref(null);
    const isSending = ref(false);
    
    // Notification form data
    const notificationForm = ref({
      recipientType: 'all', // 'all' or 'single'
      recipientId: null,
      type: 'ALERT',
      message: ''
    });
    
    // Initialize notification composable
    const userIdRef = ref(localStorage.getItem('id'));
    const {
      notifications,
      unreadCount,
      onlineUsers,
      isConnected,
      isLoading,
      error,
      fetchNotifications,
      fetchOnlineUsers,
      markAsRead: markNotificationAsRead,
      markAllAsRead: markAllNotificationsAsRead,
      sendNotificationToUser,
      sendNotificationToAll,
      testBirthdayCheck,
      clearError,
      reconnect
    } = useNotification(userIdRef);
    
    // Computed
    const unreadNotifications = computed(() => {
      return notifications.value.filter(n => !n.read);
    });
    
    // Methods
    const markAsRead = async (notificationId) => {
      await markNotificationAsRead(notificationId);
      emit('notification-read', notificationId);
    };
    
    const markAllAsRead = async () => {
      await markAllNotificationsAsRead();
      emit('notification-read', 'all');
    };
    
    const prepareNotification = (user) => {
      activeTab.value = 'send';
      notificationForm.value.recipientType = 'single';
      notificationForm.value.recipientId = user.id;
    };
    
    const sendNotification = async () => {
      if (!notificationForm.value.message) return;
      
      isSending.value = true;
      
      try {
        if (notificationForm.value.recipientType === 'single' && notificationForm.value.recipientId) {
          await sendNotificationToUser(
            notificationForm.value.recipientId, 
            notificationForm.value.message,
            notificationForm.value.type
          );
        } else {
          await sendNotificationToAll(
            notificationForm.value.message,
            notificationForm.value.type
          );
        }
        
        // Reset form
        notificationForm.value.message = '';
        emit('notification-sent', {
          type: notificationForm.value.type,
          recipientType: notificationForm.value.recipientType,
          recipientId: notificationForm.value.recipientId
        });
      } catch (err) {
        console.error('Failed to send notification:', err);
      } finally {
        isSending.value = false;
      }
    };
    
    // Helper methods
    const getNotificationIcon = (type) => {
      switch(type) {
        case 'ALERT': return 'fa-exclamation-triangle';
        case 'REMINDER': return 'fa-calendar-check';
        case 'WORK_END': return 'fa-business-time';
        default: return 'fa-bell';
      }
    };
    
    const getNotificationTypeName = (type) => {
      switch(type) {
        case 'ALERT': return 'Ogohlantirish';
        case 'REMINDER': return 'Eslatma';
        case 'WORK_END': return 'Ish tugashi';
        default: return 'Bildirishnoma';
      }
    };
    
    const formatDate = (dateString) => {
      if (!dateString) return '';
      
      const date = new Date(dateString);
      const now = new Date();
      const diff = Math.floor((now - date) / 1000); // seconds
      
      if (diff < 60) {
        return 'Hozirgina';
      } else if (diff < 3600) {
        return `${Math.floor(diff / 60)} daqiqa oldin`;
      } else if (diff < 86400) {
        return `${Math.floor(diff / 3600)} soat oldin`;
      } else if (diff < 172800) {
        return 'Kecha';
      } else {
        return date.toLocaleDateString('uz-UZ');
      }
    };
    
    const formatDateFull = (dateString) => {
      if (!dateString) return '';
      
      const date = new Date(dateString);
      return date.toLocaleString('uz-UZ', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };
    
    // Lifecycle
    onMounted(() => {
      fetchNotifications();
      fetchOnlineUsers();
    });
    
    return {
      // State
      activeTab,
      notifications,
      unreadCount,
      onlineUsers,
      isConnected,
      isLoading,
      error,
      selectedNotification,
      notificationForm,
      isSending,
      unreadNotifications,
      
      // Methods
      fetchNotifications,
      fetchOnlineUsers,
      markAsRead,
      markAllAsRead,
      clearError,
      reconnect,
      prepareNotification,
      sendNotification,
      testBirthdayCheck,
      
      // Helpers
      getNotificationIcon,
      getNotificationTypeName,
      formatDate,
      formatDateFull
    };
  }
};
</script>

<style scoped>
.notification-container {
  font-family: 'Roboto', sans-serif;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #3f51b5;
  color: white;
}

.header h2 {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 500;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.refresh-btn {
  background-color: transparent;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1.1rem;
  padding: 5px;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.refresh-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.refresh-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.read-all-btn {
  background-color: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  cursor: pointer;
  font-size: 0.8rem;
  padding: 5px 10px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.read-all-btn:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.read-all-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error-message {
  background-color: #ffebee;
  color: #c62828;
  padding: 10px 20px;
  margin: 0;
  border-bottom: 1px solid #ffcdd2;
}

.error-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-btn {
  background: none;
  border: none;
  color: #c62828;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0 5px;
}

.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 20px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
  font-size: 0.85rem;
}

.connection-status {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #f44336;
}

.connection-status.connected {
  color: #4caf50;
}

.reconnect-btn {
  background-color: #f44336;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 0.8rem;
  padding: 3px 8px;
  border-radius: 3px;
  margin-left: 8px;
}

.notification-badge {
  background-color: #f44336;
  color: white;
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 500;
}

.tabs {
  display: flex;
  background-color: #f9f9f9;
  border-bottom: 1px solid #e0e0e0;
}

.tab-btn {
  flex: 1;
  background: none;
  border: none;
  padding: 12px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
  border-bottom: 2px solid transparent;
}

.tab-btn:hover {
  background-color: #f0f0f0;
}

.tab-btn.active {
  background-color: #fff;
  color: #3f51b5;
  border-bottom: 2px solid #3f51b5;
}

.tab-content {
  max-height: 500px;
  overflow-y: auto;
  padding: 10px 0;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #757575;
  font-size: 0.9rem;
}

.spinner {
  width: 30px;
  height: 30px;
  border: 3px solid #e0e0e0;
  border-top: 3px solid #3f51b5;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #9e9e9e;
  text-align: center;
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 15px;
  opacity: 0.5;
}

.empty-state p {
  margin: 0;
  font-size: 0.95rem;
}

.notifications-list {
  display: flex;
  flex-direction: column;
}

.notification-item {
  display: flex;
  padding: 12px 20px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.2s;
}

.notification-item:hover {
  background-color: #f9f9f9;
}

.notification-item.unread {
  background-color: #e8f0fe;
}

.notification-item.unread:hover {
  background-color: #d4e4fd;
}

.notification-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background-color: #e0e0e0;
  border-radius: 50%;
  margin-right: 15px;
}

.notification-item.unread .notification-icon {
  background-color: #bbdefb;
  color: #1976d2;
}

.notification-content {
  flex: 1;
}

.notification-message {
  font-size: 0.95rem;
  color: #212121;
  margin-bottom: 5px;
  line-height: 1.4;
}

.notification-time {
  font-size: 0.75rem;
  color: #757575;
}

.notification-status {
  display: flex;
  align-items: center;
  margin-left: 10px;
}

.read-icon {
  color: #9e9e9e;
  font-size: 0.8rem;
}

.unread-icon {
  color: #2196f3;
  font-size: 0.5rem;
}

.users-list {
  display: flex;
  flex-direction: column;
}

.user-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.user-avatar {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: #e0e0e0;
  border-radius: 50%;
  margin-right: 15px;
}

.online-indicator {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 10px;
  height: 10px;
  background-color: #4caf50;
  border-radius: 50%;
  border: 2px solid white;
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: 0.95rem;
  color: #212121;
  margin-bottom: 2px;
}

.user-status {
  font-size: 0.75rem;
  color: #4caf50;
}

.user-actions {
  display: flex;
}

.notify-btn {
  background-color: #3f51b5;
  border: none;
  color: white;
  cursor: pointer;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  transition: background-color 0.2s;
}

.notify-btn:hover {
  background-color: #303f9f;
}

.send-notification-form {
  padding: 20px;
}

.send-notification-form h3 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 1.1rem;
  color: #424242;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-size: 0.9rem;
  color: #757575;
}

.form-control {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 0.95rem;
  color: #212121;
}

.form-control:focus {
  outline: none;
  border-color: #3f51b5;
}

textarea.form-control {
  resize: vertical;
  min-height: 80px;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.send-btn {
  background-color: #3f51b5;
  border: none;
  color: white;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s;
}

.send-btn:hover {
  background-color: #303f9f;
}

.send-btn:disabled {
  background-color: #c5cae9;
  cursor: not-allowed;
}

.test-btn {
  background-color: #9c27b0;
  border: none;
  color: white;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s;
}

.test-btn:hover {
  background-color: #7b1fa2;
}

/* Modal Styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #212121;
}

.modal-body {
  padding: 20px;
}

.modal-footer {
  padding: 15px 20px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: flex-end;
}

.notification-detail {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-row {
  display: flex;
}

.detail-label {
  width: 80px;
  font-weight: 500;
  color: #757575;
  font-size: 0.9rem;
}

.detail-value {
  color: #212121;
  font-size: 0.9rem;
}

.message-row {
  flex-direction: column;
}

.detail-message {
  margin-top: 8px;
  padding: 12px;
  background-color: #f5f5f5;
  border-radius: 4px;
  color: #212121;
  line-height: 1.5;
}

.read-btn {
  background-color: #3f51b5;
  border: none;
  color: white;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.read-btn:hover {
  background-color: #303f9f;
}

.read-btn:disabled {
  background-color: #c5cae9;
  cursor: not-allowed;
}

@media (max-width: 480px) {
  .notification-container {
    border-radius: 0;
    height: 100vh;
    display: flex;
    flex-direction: column;
  }
  
  .tab-content {
    flex: 1;
    overflow-y: auto;
  }
  
  .tabs {
    overflow-x: auto;
  }
  
  .form-actions {
    flex-direction: column;
  }
}
</style>