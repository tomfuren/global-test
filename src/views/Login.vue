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
                                        :class="{ 'is-invalid': errors.email }"
                                        id="email"
                                        v-model="formData.email"
                                        placeholder="your@email.com"
                                        @blur="validateEmail(true)"
                                        @input="validateEmail(false)"
                                    >
                                    <div v-if="errors.email" class="invalid-feedback">
                                        {{ errors.email }}
                                    </div>
                                </div>

                                <div class="mb-3">
                                    <label for="password" class="form-label">Password</label>
                                    <input
                                        type="password"
                                        class="form-control form-control-lg"
                                        :class="{ 'is-invalid': errors.password }"
                                        id="password"
                                        v-model="formData.password"
                                        placeholder="Enter your password"
                                        @blur="validatePassword(true)"
                                        @input="validatePassword(false)"
                                    >
                                    <div v-if="errors.password" class="invalid-feedback">
                                        {{ errors.password }}
                                    </div>
                                </div>

                                <div class="mb-3 form-check">
                                    <input
                                        type="checkbox"
                                        class="form-check-input"
                                        id="remember"
                                        v-model="formData.remember"
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
                                    <a href="#" class="text-decoration-none">Forgot your password?</a>
                                </div>
                            </form>

                            <hr class="my-4">

                            <div class="text-center">
                                <p class="mb-0">
                                Don't have an account?<br>
                                <router-link to="/register" class="text-decoration-none fw-bold">
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

<script setup>
    import { ref, computed } from 'vue'
    import { useRouter, useRoute } from 'vue-router'

    const router = useRouter()
    const route = useRoute()

    const formData = ref({
        email: '',
        password: '',
        remember: false
    })

    const errors = ref({
        email: null,
        password: null
    })

    const isLoading = ref(false)
    const message = ref('')
    const messageType = ref('')

    const validateEmail = (blur) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        
        if (!formData.value.email.trim()) {
            if (blur) errors.value.email = "Email address is required"
        } else if (!emailPattern.test(formData.value.email.trim())) {
            if (blur) errors.value.email = "Please enter a valid email address"
        } else {
            errors.value.email = null
        }
    }

    // メッセージ表示用のcomputed
    const messageClass = computed(() => {
        return messageType.value === 'error' ? 'alert-danger' : 'alert-success'
    })

    const messageIcon = computed(() => {
        return messageType.value === 'error' ? 'fas fa-exclamation-triangle' : 'fas fa-check-circle'
    })

    const showMessage = (msg, type = 'success') => {
        message.value = msg
        messageType.value = type
        setTimeout(() => {
            message.value = ''
        }, 3000)
    }

    const validatePassword = (blur) => {
        if (!formData.value.password) {
            if (blur) errors.value.password = "Password is required"
        } else if (formData.value.password.length < 6) {
            if (blur) errors.value.password = "Password must be at least 6 characters"
        } else {
            errors.value.password = null
        }
    }

    const handleLogin = async () => {
        // すべてのフィールドを検証
        validateEmail(true)
        validatePassword(true)
        
        // エラーがない場合のみ送信
        if (!errors.value.email && !errors.value.password) {
            isLoading.value = true
            
            // LocalStorageへの対応
            try {
                // LocalStorageから登録済みユーザーを取得
                const users = JSON.parse(localStorage.getItem('users')) || []
                const user = users.find(u => u.email === formData.value.email)
                
                if (user) {
                    // ログイン成功 - ユーザー情報をLocalStorageに保存
                    localStorage.setItem('currentUser', JSON.stringify(user))
                    showMessage('Login successful!', 'success')
                    
                    // リダイレクト
                    const redirectTo = route.query.redirect || '/dashboard'
                    setTimeout(() => {
                        router.push(redirectTo)
                    }, 1000)
                } else {
                    showMessage('Invalid email or password', 'error')
                }
                
            } catch (error) {
                console.error('Login error:', error)
                showMessage('Login failed. Please try again.', 'error')
            } finally {
                isLoading.value = false
            }
        }
    }
</script>

<style scoped>
.invalid-feedback {
  display: block;
}

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

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #0056b3 0%, #004085 100%);
}
</style>