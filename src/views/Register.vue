<template>
  <div class="register-page bg-light min-vh-100 d-flex align-items-center py-5">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-6 col-md-8">
          <div class="card shadow-lg border-0">
            <div class="card-body p-5">
              <div class="text-center mb-4">
                <h2 class="fw-bold text-primary">Global Plate</h2>
                <p class="text-muted">Create your account</p>
              </div>

              <form @submit.prevent="handleRegister">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="firstName" class="form-label">First Name</label>
                    <input
                      type="text"
                      class="form-control"
                      id="firstName"
                      v-model="registerForm.firstName"
                      placeholder="John"
                    >
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="lastName" class="form-label">Last Name</label>
                    <input
                      type="text"
                      class="form-control"
                      id="lastName"
                      v-model="registerForm.lastName"
                      placeholder="Doe"
                    >
                  </div>
                </div>

                <div class="mb-3">
                  <label for="email" class="form-label">Email Address</label>
                  <input
                    type="email"
                    class="form-control"
                    id="email"
                    v-model="registerForm.email"
                    placeholder="your@email.com"
                  >
                </div>

                <div class="mb-3">
                  <label for="country" class="form-label">Country</label>
                  <select
                    class="form-select"
                    id="country"
                    v-model="registerForm.country"
                  >
                    <option value="">Select your country</option>
                    <option value="japan">Japan</option>
                    <option value="china">China</option>
                    <option value="korea">South Korea</option>
                    <option value="india">India</option>
                    <option value="thailand">Thailand</option>
                    <option value="vietnam">Vietnam</option>
                    <option value="indonesia">Indonesia</option>
                    <option value="malaysia">Malaysia</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div class="mb-3">
                  <label for="university" class="form-label">University/School</label>
                  <input
                    type="text"
                    class="form-control"
                    id="university"
                    v-model="registerForm.university"
                    placeholder="e.g., University of Melbourne"
                  >
                </div>

                <div class="mb-3">
                  <label for="password" class="form-label">Password</label>
                  <input
                    type="password"
                    class="form-control"
                    id="password"
                    v-model="registerForm.password"
                    placeholder="At least 8 characters"
                  >
                </div>

                <div class="mb-3">
                  <label for="confirmPassword" class="form-label">Confirm Password</label>
                  <input
                    type="password"
                    class="form-control"
                    id="confirmPassword"
                    v-model="registerForm.confirmPassword"
                    placeholder="Re-enter your password"
                  >
                </div>

                <div class="mb-3 form-check">
                  <input
                    type="checkbox"
                    class="form-check-input"
                    id="agree"
                    v-model="registerForm.agree"
                  >
                  <label class="form-check-label" for="agree">
                    I agree to the 
                    <a href="#" class="text-decoration-none">Terms of Service</a> and
                    <a href="#" class="text-decoration-none">Privacy Policy</a>
                  </label>
                </div>

                <div class="d-grid mb-3">
                  <button
                    type="submit"
                    class="btn btn-primary btn-lg"
                    :disabled="isLoading"
                  >
                    <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                    Create Account
                  </button>
                </div>
              </form>

              <hr class="my-4">

              <div class="text-center">
                <p class="mb-0">
                  Already have an account?
                  <router-link to="/login" class="text-decoration-none fw-bold">
                    Sign In
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
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'Register',
  setup() {
    const router = useRouter()
    const isLoading = ref(false)

    const registerForm = reactive({
      firstName: '',
      lastName: '',
      email: '',
      country: '',
      university: '',
      password: '',
      confirmPassword: '',
      agree: false
    })

    const handleRegister = async () => {
      isLoading.value = true
      
      try {
        // TODO: 後でFirebase Authentication実装
        console.log('Register attempt:', registerForm)
        
        // 仮の処理
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        router.push('/login')
        
      } catch (error) {
        console.error('Register error:', error)
      } finally {
        isLoading.value = false
      }
    }

    return {
      registerForm,
      isLoading,
      handleRegister
    }
  }
}
</script>

<style scoped>
.register-page {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.card {
  border-radius: 15px;
}

.form-control:focus,
.form-select:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.btn-primary {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  border: none;
  border-radius: 10px;
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #0056b3 0%, #004085 100%);
}
</style>