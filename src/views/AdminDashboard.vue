<template>
  <div class="admin-dashboard">
    <div class="container-fluid px-4 py-4">
      <!-- ヘッダー -->
      <div class="d-flex align-items-center mb-4">
        <i class="fas fa-crown text-warning me-3 fs-4"></i>
        <h1 class="h3 mb-0">Admin Dashboard</h1>
      </div>

      <!-- 統計カード -->
      <div class="row g-4 mb-4">
        <div class="col-md-3">
          <div class="card">
            <div class="card-body text-center">
              <i class="fas fa-users text-primary fs-2 mb-2"></i>
              <h5>Total Users</h5>
              <h3 class="text-primary">1,247</h3>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card">
            <div class="card-body text-center">
              <i class="fas fa-utensils text-success fs-2 mb-2"></i>
              <h5>Recipes</h5>
              <h3 class="text-success">892</h3>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card">
            <div class="card-body text-center">
              <i class="fas fa-calendar text-info fs-2 mb-2"></i>
              <h5>Events</h5>
              <h3 class="text-info">23</h3>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card">
            <div class="card-body text-center">
              <i class="fas fa-flag text-warning fs-2 mb-2"></i>
              <h5>Reports</h5>
              <h3 class="text-warning">7</h3>
            </div>
          </div>
        </div>
      </div>

      <!-- 管理アクション -->
      <div class="card">
        <div class="card-header">
          <h5 class="card-title mb-0">Quick Actions</h5>
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-6">
              <router-link to="/admin/users" class="btn btn-outline-primary w-100">
                <i class="fas fa-users-cog me-2"></i>Manage Users
              </router-link>
            </div>
            <div class="col-md-6">
              <button class="btn btn-outline-success w-100">
                <i class="fas fa-shield-alt me-2"></i>Content Moderation
              </button>
            </div>
            <div class="col-md-6">
              <button class="btn btn-outline-info w-100">
                <i class="fas fa-chart-bar me-2"></i>View Reports
              </button>
            </div>
            <div class="col-md-6">
              <button class="btn btn-outline-warning w-100">
                <i class="fas fa-cogs me-2"></i>System Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// シンプルな管理者ダッシュボード
// 統計データは将来的にAPIから取得予定
// Simple admin dashboard
// Statistics will be available via API in the future.
</script>

<style scoped>
.admin-dashboard {
  padding-top: 3.5em;
  min-height: 100vh;
  background-color: #f8f9fa;
}

/* Adjustments for desktop with sidebar */
@media (min-width: 992px) {
  .admin-dashboard {
    margin-left: 4.5em;
    transition: margin-left 0.2s ease;
  }
}

/* Mobile Compatible */
@media (max-width: 768px) {
  .admin-dashboard {
    padding-bottom: 4em;
  }
}
</style>