<script setup>
</script>

<template>
  <header class="header">
    <h1 class="page-title">{{ $route.meta.title }}</h1>
    <div class="header-actions">
      <div class="search-box">
        <font-awesome-icon icon="faSearch" />
        <input type="text" placeholder="Search..." />
      </div>
      <div class="user-profile">
        <div class="icon-button">
          <font-awesome-icon icon="bell" />
          <span class="notification-badge">3</span>
        </div>
        <router-link to="/profile" class="profile-link">
          <div class="avatar">
            <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg" alt="Profile" />
          </div>
        </router-link>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-4);
  background-color: var(--color-bg-primary);
  box-shadow: var(--shadow-sm);
  border-bottom: 1px solid var(--color-bg-tertiary);
}
*{
  color: black;
}
.page-title {
  margin: 0;
  font-size: 1.5rem;
}

.header-actions {
  display: flex;
  align-items: center;
}

.search-box {
  position: relative;
  margin-right: var(--space-4);
}

.search-box svg {
  position: absolute;
  left: var(--space-3);
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-tertiary);
}

.search-box input {
  padding: var(--space-2) var(--space-2) var(--space-2) calc(var(--space-3) * 2 + 1em);
  border: 1px solid var(--color-bg-tertiary);
  border-radius: var(--radius-md);
  font-size: 0.95rem;
  width: 200px;
  transition: all 0.2s ease;
}

.search-box input:focus {
  outline: none;
  border-color: var(--color-accent);
  width: 250px;
}

.user-profile {
  display: flex;
  align-items: center;
}

.icon-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--color-bg-secondary);
  margin-right: var(--space-3);
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;
}

.icon-button:hover {
  background-color: var(--color-bg-tertiary);
}

.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: var(--color-error);
  color: white;
  font-size: 0.7rem;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
  .header {
    padding: var(--space-3);
  }
  
  .search-box {
    display: none;
  }
}
</style>