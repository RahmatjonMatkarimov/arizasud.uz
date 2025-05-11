<script setup>
import translateText from '@/auth/Translate'
import { URL } from '@/auth/url'
import axios from 'axios'
import { inject, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const dat = inject('dat')
console.log(dat)
const router = useRouter()
const currentRoute = router.currentRoute
const user = ref(null)

const menuItems = [
  { name: 'Bosh sahifa', icon: 'chart-line', path: '/dashboard' },
  { name: 'Soliqlar', icon: 'file-invoice', path: '/invoices' },
  { name: 'Ishchilar oyligini hisoblash', icon: 'money-check-dollar', path: '/payroll' },
  { name: 'Xarajatlar', icon: 'chart-pie', path: '/reports' },
]

const getUser = async () => {
  const res = await axios.get(`${URL}/accauntant/${localStorage.getItem('id')}`)
  user.value = res.data
  console.log(user.value)
}
onMounted(() => {
  getUser()
})
</script>

<template>
  <div class="sidebar">
    <div class="logo">
      <h1>{{ dat === 'datakril' ? translateText('Bugalteriya') : 'Bugalteriya' }}</h1>
    </div>
    <nav class="menu">
      <router-link v-for="item in menuItems" :key="item.name" :to="item.path" class="menu-item"
        :class="{ active: currentRoute.value?.path === item.path }">
        <font-awesome-icon :icon="item.icon" />
        <span>{{ dat === 'datakril' ? translateText(item.name) : item.name }}</span>
      </router-link>
    </nav>
    <div class="profile-menu">
      <router-link to="/profile" class="profile-item">
        <div class="avatar">
          <img :src="URL + '/upload/' + user.img" alt="Profile">
        </div>
        <div class="user-info">
          <h3>{{ dat === 'datakril' ? translateText(`${user.name} ${user.surname} ${user.dadname}`) : `${user.name}
            ${user.surname} ${user.dadname}`}}</h3>
          <p>{{ dat === 'datakril' ? translateText(user.lavozimi) : user.lavozimi }}</p>
        </div>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  width: 260px;
  background-color: var(--color-primary);
  color: white;
  display: flex;
  flex-direction: column;
  height: 79vh;
  position: fixed;
  margin-top: 200px;
  top: 0;
}

.logo {
  padding: var(--space-4);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo h1 {
  margin: 0;
  font-size: 1.5rem;
  letter-spacing: 1px;
}

.menu {
  padding: var(--space-3) 0;
  flex: 1;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: var(--space-3) var(--space-4);
  color: rgba(255, 255, 255, 0.8);
  transition: all 0.2s ease;
  margin-bottom: var(--space-1);
}

.menu-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}

.menu-item.active {
  background-color: rgba(255, 255, 255, 0.15);
  color: white;
  border-left: 3px solid var(--color-accent);
}

.menu-item svg {
  width: 1.2em;
  margin-right: var(--space-3);
}

.profile-menu {
  padding: var(--space-3);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.profile-item {
  display: flex;
  align-items: center;
  color: white;
  padding: var(--space-2);
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
}

.profile-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: var(--space-2);
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-info h3 {
  margin: 0;
  font-size: 0.95rem;
}

.user-info p {
  margin: 0;
  font-size: 0.8rem;
  opacity: 0.7;
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

button,
.btn {
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

button:hover,
.btn:hover {
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

.table th,
.table td {
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
  .sidebar {
    width: 100%;
    height: auto;
    position: relative;
  }

  .menu {
    display: flex;
    overflow-x: auto;
    padding: var(--space-2) 0;
  }

  .menu-item {
    flex-direction: column;
    padding: var(--space-2);
    text-align: center;
    margin-right: var(--space-2);
    border-radius: var(--radius-md);
  }

  .menu-item svg {
    margin-right: 0;
    margin-bottom: var(--space-1);
  }

  .menu-item.active {
    border-left: none;
    border-bottom: 3px solid var(--color-accent);
  }

  .profile-menu {
    display: none;
  }
}
</style>