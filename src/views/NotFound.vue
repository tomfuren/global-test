<template>
  <div class="not-found-page min-vh-100 d-flex align-items-center bg-light">
    <div class="container">
      <div class="row justify-content-center text-center">
        <div class="col-lg-6">
          <div class="not-found-content">
            <!-- 404アイコン -->
            <div class="error-code mb-4">
              <h1 class="display-1 fw-bold text-primary">404</h1>
            </div>
            
            <!-- エラーメッセージ -->
            <div class="error-message mb-4">
              <h2 class="h3 mb-3">Page not found</h2>
              <p class="text-muted mb-4">
                The page you are looking for may not exist, or it may have been moved or deleted.<br>
                Please check the URL and try again.
              </p>
            </div>
            
            <!-- アクションボタン -->
            <div class="error-actions">
              <div class="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                <router-link to="/" class="btn btn-primary btn-lg">
                  <i class="fas fa-home me-2"></i>
                  Return to Home
                </router-link>
                <button @click="goBack" class="btn btn-outline-secondary btn-lg">
                  <i class="fas fa-arrow-left me-2"></i>
                  Return to previous page
                </button>
              </div>
            </div>
            
            <!-- 人気ページへのリンク -->
            <div class="popular-links mt-5">
              <h5 class="mb-3 text-muted">Popular Pages</h5>
              <div class="row g-3">
                <div class="col-md-4">
                  <router-link to="/recipes" class="card text-decoration-none h-100 border-0 shadow-sm">
                    <div class="card-body text-center">
                      <i class="fas fa-utensils fa-2x text-primary mb-2"></i>
                      <h6 class="card-title">Recipe</h6>
                      <p class="card-text small text-muted">Find delicious recipes</p>
                    </div>
                  </router-link>
                </div>
                <div class="col-md-4">
                  <router-link to="/events" class="card text-decoration-none h-100 border-0 shadow-sm">
                    <div class="card-body text-center">
                      <i class="fas fa-calendar fa-2x text-success mb-2"></i>
                      <h6 class="card-title">Events</h6>
                      <p class="card-text small text-muted">Participate in a cooking event</p>
                    </div>
                  </router-link>
                </div>
                <div class="col-md-4">
                  <router-link to="/groups" class="card text-decoration-none h-100 border-0 shadow-sm">
                    <div class="card-body text-center">
                      <i class="fas fa-users fa-2x text-warning mb-2"></i>
                      <h6 class="card-title">group</h6>
                      <p class="card-text small text-muted">Find Group Members!</p>
                    </div>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound',
  methods: {
    goBack() {
      // ブラウザの履歴があれば戻る、なければホームへ
      if (window.history.length > 1) {
        this.$router.go(-1)
      } else {
        this.$router.push('/')
      }
    }
  },
  meta: {
    title: 'Page not found - Global Plate'
  }
}
</script>

<style scoped>
.not-found-page {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.error-code h1 {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

.card {
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}

.btn {
  transition: all 0.3s ease;
}

.btn:hover {
  transform: translateY(-2px);
}

.popular-links .card-body {
  padding: 1.5rem;
}
</style>