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

                            <!-- エラー・成功メッセージ -->
                            <div v-if="message" :class="messageClass" class="alert" role="alert">
                                <i :class="messageIcon" class="me-2"></i>
                                {{ message }}
                            </div>

                            <form @submit.prevent="handleRegister">
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label for="firstName" class="form-label">First Name</label>
                                        <input
                                            type="text"
                                            class="form-control"
                                            :class="{ 'is-invalid': errors.firstName }"
                                            id="firstName"
                                            v-model="formData.firstName"
                                            placeholder="First name"
                                            autocomplete="given-name"
                                            @blur="validateFirstName(true)"
                                            @input="validateFirstName(false)"
                                        >
                                        <div v-if="errors.firstName" class="invalid-feedback">
                                            {{ errors.firstName }}
                                        </div>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label for="lastName" class="form-label">Last Name</label>
                                        <input
                                            type="text"
                                            class="form-control"
                                            :class="{ 'is-invalid': errors.lastName }"
                                            id="lastName"
                                            v-model="formData.lastName"
                                            placeholder="Last Name"
                                            autocomplete="family-name"
                                            @blur="validateLastName(true)"
                                            @input="validateLastName(false)"
                                        >
                                        <div v-if="errors.lastName" class="invalid-feedback">
                                            {{ errors.lastName }}
                                        </div>
                                    </div>
                                </div>

                                <div class="mb-3">
                                    <label for="email" class="form-label">Email Address</label>
                                    <input
                                        type="email"
                                        class="form-control"
                                        :class="{ 'is-invalid': errors.email }"
                                        id="email"
                                        v-model="formData.email"
                                        placeholder="your@email.com"
                                        autocomplete="email"
                                        @blur="validateEmail(true)"
                                        @input="validateEmail(false)"
                                    >
                                    <div v-if="errors.email" class="invalid-feedback">
                                        {{ errors.email }}
                                    </div>
                                </div>

                                <div class="mb-3">
                                    <label for="country" class="form-label">Country</label>
                                    <select
                                        class="form-select"
                                        :class="{ 'is-invalid': errors.country }"
                                        id="country"
                                        v-model="formData.country"
                                        autocomplete="country"
                                        @blur="validateCountry(true)"
                                        @change="validateCountry(true)"
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
                                    <div v-if="errors.country" class="invalid-feedback">
                                        {{ errors.country }}
                                    </div>
                                </div>

                                <div class="mb-3">
                                    <label for="university" class="form-label">University/School</label>
                                    <input
                                        type="text"
                                        class="form-control"
                                        :class="{ 'is-invalid': errors.university }"
                                        id="university"
                                        v-model="formData.university"
                                        placeholder="e.g., Monash University"
                                        autocomplete="organization"
                                        @blur="validateUniversity(true)"
                                        @input="validateUniversity(false)"
                                    >
                                    <div v-if="errors.university" class="invalid-feedback">
                                        {{ errors.university }}
                                    </div>
                                </div>

                                <div class="mb-3">
                                    <label for="password" class="form-label">Password</label>
                                    <input
                                        type="password"
                                        class="form-control"
                                        :class="{ 'is-invalid': errors.password }"
                                        id="password"
                                        v-model="formData.password"
                                        placeholder="At least 8 characters"
                                        autocomplete="new-password"
                                        @blur="validatePassword(true)"
                                        @input="validatePassword(false)"
                                    >
                                    <div v-if="errors.password" class="invalid-feedback">
                                        {{ errors.password }}
                                    </div>
                                </div>

                                <div class="mb-3">
                                    <label for="confirmPassword" class="form-label">Confirm Password</label>
                                    <input
                                        type="password"
                                        class="form-control"
                                        :class="{ 'is-invalid': errors.confirmPassword }"
                                        id="confirmPassword"
                                        v-model="formData.confirmPassword"
                                        placeholder="Re-enter your password"
                                        autocomplete="new-password"
                                        @blur="validateConfirmPassword(true)"
                                        @input="validateConfirmPassword(false)"
                                    >
                                    <div v-if="errors.confirmPassword" class="invalid-feedback">
                                        {{ errors.confirmPassword }}
                                    </div>
                                </div>

                                <div class="mb-3 form-check">
                                    <input
                                        type="checkbox"
                                        class="form-check-input"
                                        :class="{ 'is-invalid': errors.agree }"
                                        id="agree"
                                        v-model="formData.agree"
                                        @change="validateAgree(true)"
                                    >
                                    <label class="form-check-label" for="agree">
                                        I agree to the 
                                        <router-link to="/terms" class="text-decoration-none">Terms of Service</router-link> and
                                        <router-link to="/privacy" class="text-decoration-none">Privacy Policy</router-link>
                                    </label>
                                    <div v-if="errors.agree" class="invalid-feedback">
                                        {{ errors.agree }}
                                    </div>
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

<script setup>
    import { ref, computed } from 'vue'
    import { useRouter } from 'vue-router'

    const router = useRouter()

    const formData = ref({
        firstName: '',
        lastName: '',
        email: '',
        country: '',
        university: '',
        password: '',
        confirmPassword: '',
        agree: false
    })

    const errors = ref({
        firstName: null,
        lastName: null,
        email: null,
        country: null,
        university: null,
        password: null,
        confirmPassword: null,
        agree: null
    })

    const isLoading = ref(false)
    const message = ref('')
    const messageType = ref('')

    // メッセージ表示用のcomputed
    const messageClass = computed(() => {
    return messageType.value === 'error' ? 'alert-danger' : 'alert-success'
    })

    const messageIcon = computed(() => {
    return messageType.value === 'error' ? 'fas fa-exclamation-triangle' : 'fas fa-check-circle'
    })

    // LocalStorageでのメッセージ用
    const showMessage = (msg, type = 'success') => {
    message.value = msg
    messageType.value = type
    setTimeout(() => {
        message.value = ''
    }, 3000)
    }

    const validateFirstName = (blur) => {
    if (!formData.value.firstName.trim()) {
        if (blur) errors.value.firstName = "First name is required"
    } else if (formData.value.firstName.trim().length < 2) {
        if (blur) errors.value.firstName = "First name must be at least 2 characters"
    } else {
        errors.value.firstName = null
    }
    }

    const validateLastName = (blur) => {
    if (!formData.value.lastName.trim()) {
        if (blur) errors.value.lastName = "Last name is required"
    } else if (formData.value.lastName.trim().length < 2) {
        if (blur) errors.value.lastName = "Last name must be at least 2 characters"
    } else {
        errors.value.lastName = null
    }
    }

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

    const validateCountry = (blur) => {
    if (!formData.value.country || formData.value.country === '') {
        if (blur) errors.value.country = "Please select your country"
    } else {
        errors.value.country = null
    }
    }

    const validateUniversity = (blur) => {
    if (!formData.value.university.trim()) {
        if (blur) errors.value.university = "University/School is required"
    } else if (formData.value.university.trim().length < 3) {
        if (blur) errors.value.university = "University name must be at least 3 characters"
    } else {
        errors.value.university = null
    }
    }

    const validatePassword = (blur) => {
    const password = formData.value.password
    
    if (!password) {
        if (blur) errors.value.password = "Password is required"
    } else if (password.length < 8) {
        if (blur) errors.value.password = "Password must be at least 8 characters"
    } else if (!/(?=.*[a-z])/.test(password)) {
        if (blur) errors.value.password = "Password must contain at least one lowercase letter"
    } else if (!/(?=.*[A-Z])/.test(password)) {
        if (blur) errors.value.password = "Password must contain at least one uppercase letter"
    } else if (!/(?=.*\d)/.test(password)) {
        if (blur) errors.value.password = "Password must contain at least one number"
    } else {
        errors.value.password = null
    }
    }

    const validateConfirmPassword = (blur) => {
    if (!formData.value.confirmPassword) {
        if (blur) errors.value.confirmPassword = "Please confirm your password"
    } else if (formData.value.password !== formData.value.confirmPassword) {
        if (blur) errors.value.confirmPassword = "Passwords do not match"
    } else {
        errors.value.confirmPassword = null
    }
    }

    const validateAgree = (blur) => {
    if (!formData.value.agree) {
        if (blur) errors.value.agree = "You must agree to the Terms of Service and Privacy Policy"
    } else {
        errors.value.agree = null
    }
    }

    // Local Storageを使ったユーザー検証
    const handleRegister = async () => {
        // すべてのフィールドを検証
        validateFirstName(true)
        validateLastName(true)
        validateEmail(true)
        validateCountry(true)
        validateUniversity(true)
        validatePassword(true)
        validateConfirmPassword(true)
        validateAgree(true)
        
        // エラーがない場合のみ送信
        if (!errors.value.firstName && !errors.value.lastName && !errors.value.email && 
            !errors.value.country && !errors.value.university && !errors.value.password && 
            !errors.value.confirmPassword && !errors.value.agree) {
            
            isLoading.value = true
            
            try {
                // TODO: 後でFirebase Authentication実装
                // LocalStorageから既存ユーザーを取得
                const users = JSON.parse(localStorage.getItem('users')) || []
                
                // // 仮の処理
                // await new Promise(resolve => setTimeout(resolve, 1000))
                
                // // 登録成功後はログインページへ
                // router.push('/login')

                // メール重複チェック
                const emailExists = users.some(user => user.email === formData.value.email)
                if (emailExists) {
                    showMessage('Email already exists', 'error')
                    return
                }
                
                // 新しいユーザーを作成
                const newUser = {
                    id: Date.now().toString(),
                    firstName: formData.value.firstName,
                    lastName: formData.value.lastName,
                    email: formData.value.email,
                    country: formData.value.country,
                    university: formData.value.university,
                    createdAt: new Date().toISOString()
                }
                
                // ユーザーをLocalStorageに追加
                users.push(newUser)
                localStorage.setItem('users', JSON.stringify(users))
                
                showMessage('Registration successful!', 'success')
                
                // 登録成功後はログインページへ
                setTimeout(() => {
                    router.push('/login')
                }, 1500)
            
            } catch (error) {
                console.error('Register error:', error)
                showMessage('Registration failed. Please try again.', 'error')
            } finally {
                isLoading.value = false
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

    .invalid-feedback {
        display: block;
    }
</style>