<script setup>
import { ref } from 'vue'

// User data
const user = ref({
  id: 1,
  name: 'John Doe',
  email: 'john.doe@example.com',
  position: 'Accountant',
  joinDate: 'January 15, 2022',
  phone: '(555) 123-4567',
  address: '123 Business St, Suite 456, Business City, ST 12345',
  avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'
})

// Form data for editing
const editForm = ref({
  name: user.value.name,
  email: user.value.email,
  position: user.value.position,
  phone: user.value.phone,
  address: user.value.address,
  password: '',
  confirmPassword: ''
})

// Active tab
const activeTab = ref('profile') // 'profile', 'security', 'preferences'

// Edit mode
const isEditing = ref(false)

// Toggle edit mode
function toggleEdit() {
  if (isEditing.value) {
    // Save logic would go here
    isEditing.value = false
  } else {
    isEditing.value = true
  }
}

// Cancel editing
function cancelEdit() {
  editForm.value = {
    name: user.value.name,
    email: user.value.email,
    position: user.value.position,
    phone: user.value.phone,
    address: user.value.address,
    password: '',
    confirmPassword: ''
  }
  isEditing.value = false
}

// Notification preferences
const notifications = ref({
  email: true,
  browser: true,
  invoices: true,
  payments: true,
  reports: false
})
</script>

<template>
  <div>
    <div class="profile-header card">
      <div class="profile-info">
        <div class="profile-avatar">
          <img :src="user.avatar" alt="Profile Photo">
        </div>
        <div class="profile-details">
          <h2>{{ user.name }}</h2>
          <p class="profile-position">{{ user.position }}</p>
          <p class="profile-joined">Member since {{ user.joinDate }}</p>
        </div>
      </div>
      <div class="profile-actions">
        <button class="btn-primary" @click="toggleEdit">
          {{ isEditing ? 'Save Changes' : 'Edit Profile' }}
        </button>
        <button v-if="isEditing" class="btn-secondary" @click="cancelEdit">
          Cancel
        </button>
      </div>
    </div>
    
    <div class="profile-tabs">
      <div 
        class="tab" 
        :class="{ active: activeTab === 'profile' }" 
        @click="activeTab = 'profile'"
      >
        Profile Information
      </div>
      <div 
        class="tab" 
        :class="{ active: activeTab === 'security' }" 
        @click="activeTab = 'security'"
      >
        Security
      </div>
      <div 
        class="tab" 
        :class="{ active: activeTab === 'preferences' }" 
        @click="activeTab = 'preferences'"
      >
        Preferences
      </div>
    </div>
    
    <!-- Profile Information Tab -->
    <div v-if="activeTab === 'profile'" class="card profile-content">
      <form class="profile-form">
        <div class="form-group">
          <label for="name">Full Name</label>
          <input 
            id="name" 
            type="text" 
            v-model="editForm.name" 
            :disabled="!isEditing"
            class="form-input"
          >
        </div>
        
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            id="email" 
            type="email" 
            v-model="editForm.email" 
            :disabled="!isEditing"
            class="form-input"
          >
        </div>
        
        <div class="form-group">
          <label for="position">Position</label>
          <input 
            id="position" 
            type="text" 
            v-model="editForm.position" 
            :disabled="!isEditing"
            class="form-input"
          >
        </div>
        
        <div class="form-group">
          <label for="phone">Phone</label>
          <input 
            id="phone" 
            type="tel" 
            v-model="editForm.phone" 
            :disabled="!isEditing"
            class="form-input"
          >
        </div>
        
        <div class="form-group">
          <label for="address">Address</label>
          <textarea 
            id="address" 
            v-model="editForm.address" 
            :disabled="!isEditing"
            class="form-textarea"
            rows="3"
          ></textarea>
        </div>
      </form>
    </div>
    
    <!-- Security Tab -->
    <div v-if="activeTab === 'security'" class="card profile-content">
      <form class="profile-form">
        <div class="form-group">
          <label for="current-password">Current Password</label>
          <input 
            id="current-password" 
            type="password" 
            :disabled="!isEditing"
            class="form-input"
          >
        </div>
        
        <div class="form-group">
          <label for="new-password">New Password</label>
          <input 
            id="new-password" 
            type="password" 
            v-model="editForm.password"
            :disabled="!isEditing"
            class="form-input"
          >
        </div>
        
        <div class="form-group">
          <label for="confirm-password">Confirm New Password</label>
          <input 
            id="confirm-password" 
            type="password" 
            v-model="editForm.confirmPassword"
            :disabled="!isEditing"
            class="form-input"
          >
        </div>
        
        <div class="security-section">
          <h3>Login Sessions</h3>
          <div class="session-item">
            <div class="session-info">
              <span class="session-device">Chrome on Windows</span>
              <span class="session-ip">192.168.1.1</span>
              <span class="session-time">Active now</span>
            </div>
            <button class="btn-secondary">Logout</button>
          </div>
          
          <div class="session-item">
            <div class="session-info">
              <span class="session-device">Safari on macOS</span>
              <span class="session-ip">192.168.1.2</span>
              <span class="session-time">Last active: 2 days ago</span>
            </div>
            <button class="btn-secondary">Logout</button>
          </div>
        </div>
      </form>
    </div>
    
    <!-- Preferences Tab -->
    <div v-if="activeTab === 'preferences'" class="card profile-content">
      <div class="preferences-section">
        <h3>Notification Preferences</h3>
        <div class="preference-item">
          <div class="preference-info">
            <span class="preference-label">Email Notifications</span>
            <span class="preference-description">Receive notifications via email</span>
          </div>
          <label class="toggle">
            <input type="checkbox" v-model="notifications.email" :disabled="!isEditing">
            <span class="toggle-slider"></span>
          </label>
        </div>
        
        <div class="preference-item">
          <div class="preference-info">
            <span class="preference-label">Browser Notifications</span>
            <span class="preference-description">Receive notifications in browser</span>
          </div>
          <label class="toggle">
            <input type="checkbox" v-model="notifications.browser" :disabled="!isEditing">
            <span class="toggle-slider"></span>
          </label>
        </div>
        
        <div class="preference-item">
          <div class="preference-info">
            <span class="preference-label">Invoice Alerts</span>
            <span class="preference-description">Get notified about new invoices</span>
          </div>
          <label class="toggle">
            <input type="checkbox" v-model="notifications.invoices" :disabled="!isEditing">
            <span class="toggle-slider"></span>
          </label>
        </div>
        
        <div class="preference-item">
          <div class="preference-info">
            <span class="preference-label">Payment Alerts</span>
            <span class="preference-description">Get notified about payments</span>
          </div>
          <label class="toggle">
            <input type="checkbox" v-model="notifications.payments" :disabled="!isEditing">
            <span class="toggle-slider"></span>
          </label>
        </div>
        
        <div class="preference-item">
          <div class="preference-info">
            <span class="preference-label">Report Notifications</span>
            <span class="preference-description">Get notified when reports are ready</span>
          </div>
          <label class="toggle">
            <input type="checkbox" v-model="notifications.reports" :disabled="!isEditing">
            <span class="toggle-slider"></span>
          </label>
        </div>
      </div>
      
      <div class="preferences-section">
        <h3>Display Preferences</h3>
        <div class="display-preferences">
          <div class="form-group">
            <label for="theme">Theme</label>
            <select id="theme" class="form-select" :disabled="!isEditing">
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System Default</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="language">Language</label>
            <select id="language" class="form-select" :disabled="!isEditing">
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="date-format">Date Format</label>
            <select id="date-format" class="form-select" :disabled="!isEditing">
              <option value="mdy">MM/DD/YYYY</option>
              <option value="dmy">DD/MM/YYYY</option>
              <option value="ymd">YYYY-MM-DD</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-4);
}

.profile-info {
  display: flex;
  align-items: center;
}

.profile-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: var(--space-4);
  border: 3px solid var(--color-bg-secondary);
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-details h2 {
  margin: 0 0 var(--space-1) 0;
}

.profile-position {
  color: var(--color-text-secondary);
  margin: 0 0 var(--space-1) 0;
}

.profile-joined {
  font-size: 0.875rem;
  color: var(--color-text-tertiary);
  margin: 0;
}

.profile-actions {
  display: flex;
  gap: var(--space-2);
}

.profile-tabs {
  display: flex;
  margin-bottom: var(--space-4);
  background-color: var(--color-bg-primary);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.tab {
  padding: var(--space-3) var(--space-4);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 2px solid transparent;
}

.tab:hover {
  background-color: var(--color-bg-secondary);
}

.tab.active {
  background-color: var(--color-bg-primary);
  border-bottom: 2px solid var(--color-accent);
  color: var(--color-accent);
}

.profile-form {
  max-width: 600px;
}

.form-group {
  margin-bottom: var(--space-4);
}

.form-group label {
  display: block;
  margin-bottom: var(--space-1);
  font-weight: 500;
}

.form-input, .form-select, .form-textarea {
  width: 100%;
  padding: var(--space-2);
  border: 1px solid var(--color-bg-tertiary);
  border-radius: var(--radius-md);
  font-size: 1rem;
  transition: border-color 0.2s ease;
  background-color: white;
}

.form-input:focus, .form-select:focus, .form-textarea:focus {
  outline: none;
  border-color: var(--color-accent);
}

.form-input:disabled, .form-select:disabled, .form-textarea:disabled {
  background-color: var(--color-bg-secondary);
  cursor: not-allowed;
}

.form-textarea {
  resize: vertical;
}

.security-section, .preferences-section {
  margin-top: var(--space-5);
}

.security-section h3, .preferences-section h3 {
  margin-bottom: var(--space-3);
  padding-bottom: var(--space-2);
  border-bottom: 1px solid var(--color-bg-tertiary);
}

.session-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-3);
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-3);
}

.session-info {
  display: flex;
  flex-direction: column;
}

.session-device {
  font-weight: 500;
  margin-bottom: var(--space-1);
}

.session-ip, .session-time {
  font-size: 0.875rem;
  color: var(--color-text-tertiary);
}

.preference-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-3) 0;
  border-bottom: 1px solid var(--color-bg-tertiary);
}

.preference-info {
  display: flex;
  flex-direction: column;
}

.preference-label {
  font-weight: 500;
  margin-bottom: var(--space-1);
}

.preference-description {
  font-size: 0.875rem;
  color: var(--color-text-tertiary);
}

.toggle {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--color-bg-tertiary);
  transition: .4s;
  border-radius: 24px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: var(--color-success);
}

input:checked + .toggle-slider:before {
  transform: translateX(26px);
}

input:disabled + .toggle-slider {
  cursor: not-allowed;
  opacity: 0.7;
}

.display-preferences {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-4);
}
*{
  color: black;
  }
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
  background-color: var(--color-bg-secondary);
  color: var(--color-text-primary);
}

h1 {
  font-size: 2rem;
  line-height: 1.2;
  font-weight: 600;
  margin-bottom: var(--space-4);
}

h2 {
  font-size: 1.5rem;
  line-height: 1.3;
  font-weight: 600;
  margin-bottom: var(--space-3);
}

h3 {
  font-size: 1.25rem;
  line-height: 1.4;
  font-weight: 600;
  margin-bottom: var(--space-2);
}

a {
  text-decoration: none;
  color: var(--color-accent);
}

button, .btn {
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: var(--color-accent);
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

button:hover, .btn:hover {
  background-color: #2c73b4;
}

.card {
  background-color: var(--color-bg-primary);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  box-shadow: var(--shadow-md);
}

.text-success {
  color: var(--color-success);
}

.text-warning {
  color: var(--color-warning);
}

.text-error {
  color: var(--color-error);
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th, .table td {
  padding: var(--space-2) var(--space-3);
  text-align: left;
}

.table th {
  background-color: var(--color-bg-secondary);
  font-weight: 600;
}

.table tr {
  border-bottom: 1px solid var(--color-bg-tertiary);
}

.table tr:last-child {
  border-bottom: none;
}

.table tr:hover {
  background-color: var(--color-bg-secondary);
}

.badge {
  display: inline-block;
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
  font-weight: 500;
}

.badge-success {
  background-color: rgba(56, 161, 105, 0.1);
  color: var(--color-success);
}

.badge-pending {
  background-color: rgba(237, 137, 54, 0.1);
  color: var(--color-warning);
}

.negative {
  color: var(--color-error);
}

.positive {
  color: var(--color-success);
}
@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .profile-info {
    margin-bottom: var(--space-3);
  }
  
  .profile-tabs {
    flex-direction: column;
  }
  
  .tab {
    text-align: center;
  }
  
  .display-preferences {
    grid-template-columns: 1fr;
  }
}
</style>