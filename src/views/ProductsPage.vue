<script setup>
import { ref, onMounted } from 'vue'
import { productsApi, categoriesApi } from '../api.js'

const products = ref([])
const categories = ref([])
const loading = ref(false)
const showForm = ref(false)
const editing = ref(null)
const form = ref({ category_id: '', name: '', description: '', price: '', stock: '' })
const submitting = ref(false)

async function fetchProducts() {
  loading.value = true
  try {
    const { data } = await productsApi.index()
    products.value = data.data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

async function fetchCategories() {
  try {
    const { data } = await categoriesApi.index()
    categories.value = data.data
  } catch (e) {
    console.error(e)
  }
}

function openCreate() {
  editing.value = null
  form.value = { category_id: '', name: '', description: '', price: '', stock: '' }
  showForm.value = true
}

function openEdit(product) {
  editing.value = product.id
  form.value = {
    category_id: product.category_id,
    name: product.name,
    description: product.description || '',
    price: product.price,
    stock: product.stock,
  }
  showForm.value = true
}

async function submitForm() {
  submitting.value = true
  try {
    const payload = { ...form.value }
    if (payload.stock !== '') payload.stock = Number(payload.stock)
    if (editing.value) {
      await productsApi.update(editing.value, payload)
    } else {
      await productsApi.store(payload)
    }
    showForm.value = false
    await fetchProducts()
  } catch (e) {
    console.error(e)
  } finally {
    submitting.value = false
  }
}

async function deleteProduct(id) {
  if (!confirm('Are you sure you want to delete this product?')) return
  try {
    await productsApi.destroy(id)
    await fetchProducts()
  } catch (e) {
    console.error(e)
  }
}

onMounted(() => {
  fetchCategories()
  fetchProducts()
})
</script>

<template>
  <div class="page">
    <div class="page-header">
      <h2>Products</h2>
      <button class="btn btn-primary" @click="openCreate">+ New Product</button>
    </div>

    <div v-if="loading" class="loading">Loading...</div>

    <table v-else class="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Category</th>
          <th>Price</th>
          <th>Stock</th>
          <th>Description</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in products" :key="p.id">
          <td>{{ p.id }}</td>
          <td>{{ p.name }}</td>
          <td>{{ p.category?.name || '-' }}</td>
          <td>${{ Number(p.price).toFixed(2) }}</td>
          <td>{{ p.stock }}</td>
          <td>{{ p.description || '-' }}</td>
          <td class="actions">
            <button class="btn btn-sm btn-edit" @click="openEdit(p)">Edit</button>
            <button class="btn btn-sm btn-danger" @click="deleteProduct(p.id)">Delete</button>
          </td>
        </tr>
        <tr v-if="products.length === 0">
          <td colspan="7" class="empty">No products found.</td>
        </tr>
      </tbody>
    </table>

    <div v-if="showForm" class="modal-overlay" @click.self="showForm = false">
      <div class="modal">
        <h3>{{ editing ? 'Edit Product' : 'New Product' }}</h3>
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label>Category</label>
            <select v-model="form.category_id" required class="form-control">
              <option value="" disabled>Select category</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Name</label>
            <input v-model="form.name" required class="form-control" />
          </div>
          <div class="form-group">
            <label>Price</label>
            <input v-model="form.price" type="number" step="0.01" min="0" required class="form-control" />
          </div>
          <div class="form-group">
            <label>Stock</label>
            <input v-model="form.stock" type="number" min="0" class="form-control" />
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
