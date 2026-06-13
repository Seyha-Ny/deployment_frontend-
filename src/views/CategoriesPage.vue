<script setup>
import { ref, onMounted } from 'vue'
import { categoriesApi } from '../api.js'

const categories = ref([])
const loading = ref(false)
const showForm = ref(false)
const editing = ref(null)
const form = ref({ name: '', description: '' })
const submitting = ref(false)

async function fetchCategories() {
  loading.value = true
  try {
    const { data } = await categoriesApi.index()
    categories.value = data.data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

function openCreate() {
  editing.value = null
  form.value = { name: '', description: '' }
  showForm.value = true
}

function openEdit(category) {
  editing.value = category.id
  form.value = { name: category.name, description: category.description || '' }
  showForm.value = true
}

async function submitForm() {
  submitting.value = true
  try {
    if (editing.value) {
      await categoriesApi.update(editing.value, form.value)
    } else {
      await categoriesApi.store(form.value)
    }
    showForm.value = false
    await fetchCategories()
  } catch (e) {
    console.error(e)
  } finally {
    submitting.value = false
  }
}

async function deleteCategory(id) {
  if (!confirm('Are you sure you want to delete this category?')) return
  try {
    await categoriesApi.destroy(id)
    await fetchCategories()
  } catch (e) {
    console.error(e)
  }
}

onMounted(fetchCategories)
</script>

<template>
  <div class="page">
    <div class="page-header">
      <h2>Categories</h2>
      <button class="btn btn-primary" @click="openCreate">+ New Category</button>
    </div>

    <div v-if="loading" class="loading">Loading...</div>

    <table v-else class="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Description</th>
          <th>Products</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="cat in categories" :key="cat.id">
          <td>{{ cat.id }}</td>
          <td>{{ cat.name }}</td>
          <td>{{ cat.description || '-' }}</td>
          <td>{{ cat.products_count ?? 0 }}</td>
          <td class="actions">
            <button class="btn btn-sm btn-edit" @click="openEdit(cat)">Edit</button>
            <button class="btn btn-sm btn-danger" @click="deleteCategory(cat.id)">Delete</button>
          </td>
        </tr>
        <tr v-if="categories.length === 0">
          <td colspan="5" class="empty">No categories found.</td>
        </tr>
      </tbody>
    </table>

    <div v-if="showForm" class="modal-overlay" @click.self="showForm = false">
      <div class="modal">
        <h3>{{ editing ? 'Edit Category' : 'New Category' }}</h3>
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label>Name</label>
            <input v-model="form.name" required class="form-control" />
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea v-model="form.description" class="form-control" rows="3"></textarea>
          </div>
          <div class="form-actions">
            <button type="button" class="btn btn-secondary" @click="showForm = false">Cancel</button>
            <button type="submit" class="btn btn-primary" :disabled="submitting">
              {{ submitting ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
