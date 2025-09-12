<template>
    <div class="login-page bg-light min-vh-100 d-flex align-items-center">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-xl-4 col-lg-5 col-md-7 col-sm-9">
                    <div class="card shadow-lg border-0">
                        <div class="card-body p-5">
                            <div class="text-center mb-4">
                                <h2 class="fw-bold text-primary">Global Plate</h2>
                                <p class="text-muted">Sign in to your account</p>
                            </div>

                            <!-- エラー・成功メッセージ -->
                            <!-- Error/Success Message -->
                            <div v-if="message" :class="messageClass" class="alert" role="alert">
                                <i :class="messageIcon" class="me-2"></i>
                                {{ message }}
                            </div>

                            <form @submit.prevent="signin">
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
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"

const router = useRouter()
const route = useRoute()
const auth = getAuth()

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
// Computed for displaying messages
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

// Firebase error code to message mapping
const getErrorMessage = (errorCode) => {
    switch (errorCode) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
            return 'Invalid email or password'
        case 'auth/invalid-email':
            return 'Please enter a valid email address'
        case 'auth/too-many-requests':
            return 'Too many login attempts. Please try again later'
        case 'auth/network-request-failed':
            return 'Network error. Please check your connection'
        case 'auth/user-disabled':
            return 'This account has been disabled'
        default:
            return 'Login failed. Please try again'
    }
}

// Firebase Sign In 
const signin = () => {
    // Validate form
    validateEmail(true)
    validatePassword(true)
    
    // if (!isFormValid.value) {
    //     return
    // }

    isLoading.value = true
    
    signInWithEmailAndPassword(getAuth(), formData.value.email, formData.value.password)
        .then((data) => {
            console.log("Firebase Sign in Successful!")
            console.log("Current User:", auth.currentUser)
            
            showMessage('Login successful!', 'success')
            
            // Remember me機能のために、Local Storageを残す
            if (formData.value.remember) {
                localStorage.setItem('rememberedEmail', formData.value.email)
            } else {
                localStorage.removeItem('rememberedEmail')
            }
            
            // Notify NavBar of auth change
            window.dispatchEvent(new Event('auth-changed'))
            
            // Redirect
            const redirectTo = route.query.redirect || '/dashboard'
            setTimeout(() => {
                router.push({
                    path: "/",
                    query: { message: 'Login-success' }
                })
            }, 1000)
        })
        .catch((error) => {
            console.log('Firebase Auth Error:', error.code)
            showMessage(getErrorMessage(error.code), 'error')
        })
        .finally(() => {
            isLoading.value = false
        })
}

// Load remembered email on mount
onMounted(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail')
    if (rememberedEmail) {
        formData.value.email = rememberedEmail
        formData.value.remember = true
    }
    
    if (route.query.message === 'registration-success') {
        showMessage('Registration successful! Please sign in with your new account.', 'success')
        // クエリパラメータをクリアして、リロード時の再表示を防ぐ
        // Clear query parameters to prevent redisplay on reload
        router.replace({ path: route.path })
    }
})
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