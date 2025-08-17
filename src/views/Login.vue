<template>
  <div class="login-page bg-light min-vh-100 d-flex align-items-center">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-5 col-md-7">
          <div class="card shadow-lg border-0">
            <div class="card-body p-5">
              <div class="text-center mb-4">
                <h2 class="fw-bold text-primary">Global Plate</h2>
                <p class="text-muted">Sign in to your account</p>
              </div>

              <form @submit.prevent="handleLogin">
                <div class="mb-3">
                  <label for="email" class="form-label">Email address</label>
                  <input
                    type="email"
                    class="form-control form-control-lg"
                    id="email"
                    v-model="loginForm.email"
                    required
                    placeholder="your@email.com"
                  >
                </div>

                <div class="mb-3">
                  <label for="password" class="form-label">Password</label>
                  <input
                    type="password"
                    class="form-control form-control-lg"
                    id="password"
                    v-model="loginForm.password"
                    required
                    placeholder="Enter your password"
                  >
                </div>

                <div class="mb-3 form-check">
                  <input
                    type="checkbox"
                    class="form-check-input"
                    id="remember"
                    v-model="loginForm.remember"
                  >
                  <label class="form-check-label" for="remember">
                    Remember Me
                  </label>
                </div>

                <div class="d-grid mb-3">
                  <button
                    type="submit"
                    class="btn btn-primary btn-lg"
                    :disabled="isLoading"
                  >
                    <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                    Log in
                  </button>
                </div>

                <div class="text-center">
                  <a href="#" class="text-decoration-none">Forgot your password</a>
                </div>
              </form>

              <hr class="my-4">

              <div class="text-center">
                <p class="mb-0">
                  If you don't have an account
                  <router-link to="/register" class="text-decoration-none fw-bold"><br>
                    Create New Account
                  </router-link>
                </p>
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
  name: 'Login',
  data() {
    return {
      loginForm: {
        email: '',
        password: '',
        remember: false
      },
      isLoading: false
    }
  },
  methods: {
    async handleLogin() {
      this.isLoading = true
      
      try {
        // TODO: Firebase Authentication実装
        console.log('Try Login:', this.loginForm)
        
        // 仮の成功処理
        setTimeout(() => {
          this.isLoading = false
          this.$router.push('/dashboard')
        }, 1000)
        
      } catch (error) {
        this.isLoading = false
        console.error('Login Error:', error)
        // TODO: エラーハンドリング実装
      }
    }
  },
  meta: {
    title: 'Long in - Global Plate'
  }
}
</script>

<style scoped>
.login-page {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.card {
  border-radius: 15px;
}

.form-control:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.btn-primary {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  border: none;
  border-radius: 10px;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #0056b3 0%, #004085 100%);
}
</style>