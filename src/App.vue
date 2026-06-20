<script setup>
import { ref } from 'vue'
import CategoriesPage from './views/CategoriesPage.vue'
import ProductsPage from './views/ProductsPage.vue'
import { useNotifications } from './notifications.js'

const activeTab = ref('categories')
const { notifications } = useNotifications()
</script>

<template>
  <div class="app-container">
    <header class="app-header">
      <h1>Admin Dashboard</h1>
    </header>
    <nav class="tabs">
      <button
        :class="['tab', { active: activeTab === 'categories' }]"
        @click="activeTab = 'categories'"
      >
        Categories
      </button>
      <button
        :class="['tab', { active: activeTab === 'products' }]"
        @click="activeTab = 'products'"
      >
        Products
      </button>
    </nav>
    <main class="main-content">
      <CategoriesPage v-if="activeTab === 'categories'" />
      <ProductsPage v-if="activeTab === 'products'" />
    </main>

    <div class="notifications-container">
      <div
        v-for="n in notifications"
        :key="n.id"
        :class="['notification', 'notification-' + n.type]"
      >
        {{ n.message }}
      </div>
    </div>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #f5f5f5;
  color: #333;
}

.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.app-header {
  margin-bottom: 1.5rem;
}

.app-header h1 {
  color: #2c3e50;
}

.tabs {
  display: flex;
  gap: 0;
  margin-bottom: 2rem;
  border-bottom: 2px solid #e0e0e0;
}

.tab {
  padding: 0.75rem 1.5rem;
  border: none;
  background: none;
  font-size: 1rem;
  cursor: pointer;
  color: #666;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  transition: all 0.2s;
}

.tab:hover {
  color: #333;
}

.tab.active {
  color: #42b883;
  border-bottom-color: #42b883;
  font-weight: 600;
}

.main-content {
  background: #fff;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* ===== Shared Table Styles ===== */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.page-header h2 {
  font-size: 1.25rem;
  color: #2c3e50;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #999;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.table th {
  font-weight: 600;
  color: #666;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.table tbody tr:hover {
  background: #f9f9f9;
}

.empty {
  text-align: center;
  color: #999;
  padding: 2rem !important;
}

.actions {
  white-space: nowrap;
}

/* ===== Buttons ===== */
.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-sm {
  padding: 0.35rem 0.75rem;
  font-size: 0.8rem;
}

.btn-primary {
  background: #42b883;
  color: #fff;
}

.btn-primary:hover {
  background: #38a373;
}

.btn-secondary {
  background: #e0e0e0;
  color: #333;
}

.btn-secondary:hover {
  background: #ccc;
}

.btn-edit {
  background: #e8f0fe;
  color: #1a73e8;
  margin-right: 0.5rem;
}

.btn-edit:hover {
  background: #d2e3fc;
}

.btn-danger {
  background: #fce8e6;
  color: #d93025;
}

.btn-danger:hover {
  background: #f8d7da;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ===== Modal ===== */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal {
  background: #fff;
  border-radius: 12px;
  padding: 2rem;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
}

.modal h3 {
  margin-bottom: 1.5rem;
  color: #2c3e50;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.35rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #555;
}

.form-control {
  width: 100%;
  padding: 0.6rem 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: border-color 0.2s;
}

.form-control:focus {
  outline: none;
  border-color: #42b883;
  box-shadow: 0 0 0 2px rgba(66, 184, 131, 0.15);
}

textarea.form-control {
  resize: vertical;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

/* ===== Notifications ===== */
.notifications-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 200;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 400px;
}

.notification {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.notification-error {
  background: #fce8e6;
  color: #c5221f;
  border: 1px solid #f5c6cb;
}

.notification-success {
  background: #e6f4ea;
  color: #1e7e34;
  border: 1px solid #c3e6cb;
}

/* ===== Page wrapper (used by views) ===== */
.page {
  width: 100%;
}
</style>
