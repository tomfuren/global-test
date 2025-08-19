<template>
  <div class="dashboard">
    <div class="container py-4">
      <div class="row">
        <div class="col-12">
          <h1>Dashboard</h1>
          <p class="lead">Welcome to Global Plate, {{ currentUser?.firstName }}!</p>
          
          <!-- ユーザー情報表示 -->
          <Card class="mb-4" v-if="currentUser">
            <template #title>Your Profile Information</template>
            <template #content>
              <div class="row">
                <div class="col-md-6">
                  <p><strong>Name:</strong> {{ currentUser.firstName }} {{ currentUser.lastName }}</p>
                  <p><strong>Email:</strong> {{ currentUser.email }}</p>
                  <p><strong>Country:</strong> {{ currentUser.country }}</p>
                </div>
                <div class="col-md-6">
                  <p><strong>University:</strong> {{ currentUser.university }}</p>
                  <p><strong>Member since:</strong> {{ formatDate(currentUser.createdAt) }}</p>
                  <p><strong>Total Users:</strong> {{ totalUsers }}</p>
                </div>
              </div>
            </template>
          </Card>
          
          <!-- LocalStorage Data Display -->
          <Card class="mb-4">
            <template #title>All Registered Users ({{ totalUsers }})</template>
            <template #content>
              <DataTable 
                :value="allUsers" 
                paginator 
                :rows="10"
                :rowsPerPageOptions="[5, 10, 20]"
                tableStyle="min-width: 50rem"
                v-if="allUsers.length > 0"
              >
                <Column field="firstName" header="First Name" sortable>
                  <template #body="slotProps">
                    {{ slotProps.data.firstName }} {{ slotProps.data.lastName }}
                  </template>
                </Column>
                <Column field="email" header="Email" sortable></Column>
                <Column field="country" header="Country" sortable></Column>
                <Column field="university" header="University" sortable></Column>
                <Column field="createdAt" header="Registration Date" sortable>
                  <template #body="slotProps">
                    {{ formatDate(slotProps.data.createdAt) }}
                  </template>
                </Column>
              </DataTable>
              <p v-else class="text-muted">No users registered yet.</p>
            </template>
          </Card>
          
          <button @click="handleLogout" class="btn btn-outline-danger">
            Logout
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
    import { ref, computed, onMounted } from 'vue'
    import { useRouter } from 'vue-router'

    const router = useRouter()

    const currentUser = ref(null)
    const allUsers = ref([])

    // LocalStorageからデータを読み込み
    onMounted(() => {
    currentUser.value = JSON.parse(localStorage.getItem('currentUser'))
    allUsers.value = JSON.parse(localStorage.getItem('users')) || []
    })

    const totalUsers = computed(() => {
    return allUsers.value.length
    })

    const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
    }

    const handleLogout = () => {
    localStorage.removeItem('currentUser')
    router.push('/')
    }
</script>

<style scoped>
    .dashboard {
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        min-height: 100vh;
    }

    /* 追加推奨CSSクラス */
    @media (max-width: 575.98px) {
        .container-fluid {
            padding-left: 10px;
            padding-right: 10px;
        }
        
        .card-body {
            padding: 1rem 0.75rem;
        }
        
        .btn {
            font-size: 0.875rem;
            padding: 0.25rem 0.5rem;
        }
    }

    @media (min-width: 576px) and (max-width: 767.98px) {
        .display-6 {
            font-size: 1.75rem;
        }
    }

    @media (min-width: 1400px) {
        .container-fluid {
            max-width: 1320px;
            margin: 0 auto;
        }
    }
    </style>