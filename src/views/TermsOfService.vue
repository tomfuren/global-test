<template>
  <div class="terms-page bg-light min-vh-100 py-5">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="card shadow-sm border-0">
            <div class="card-body p-5">
              <div class="text-center mb-5">
                <h1 class="fw-bold text-primary">Terms of Service</h1>
                <p class="text-muted">Last updated: {{ lastUpdated }}</p>
              </div>

              <div class="terms-content">
                <section class="mb-4">
                  <h2 class="h4 text-primary mb-3">1. Acceptance of Terms</h2>
                  <p>
                    By accessing and using Global Plate ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. 
                    If you do not agree to abide by these Terms of Service, you are not authorized to use or access this service.
                  </p>
                </section>

                <section class="mb-4">
                  <h2 class="h4 text-primary mb-3">2. Description of Service</h2>
                  <p>
                    Global Plate is a web application designed to connect international students through food and nutrition. 
                    The platform allows users to:
                  </p>
                  <ul>
                    <li>Share and discover healthy recipes</li>
                    <li>Join country-specific groups and communities</li>
                    <li>Participate in cooking events and cultural exchanges</li>
                    <li>Access nutrition education resources</li>
                  </ul>
                </section>

                <section class="mb-4">
                  <h2 class="h4 text-primary mb-3">3. User Registration</h2>
                  <p>
                    To use certain features of Global Plate, you must register for an account by providing accurate, current, and complete information. 
                    You are responsible for safeguarding your password and all activities that occur under your account.
                  </p>
                </section>

                <section class="mb-4">
                  <h2 class="h4 text-primary mb-3">4. User Content and Conduct</h2>
                  <p>Users agree to:</p>
                  <ul>
                    <li>Share only accurate and appropriate recipe information</li>
                    <li>Respect cultural differences and dietary restrictions</li>
                    <li>Not post harmful, offensive, or inappropriate content</li>
                    <li>Not share content that violates intellectual property rights</li>
                    <li>Maintain a supportive and inclusive community environment</li>
                  </ul>
                </section>

                <section class="mb-4">
                  <h2 class="h4 text-primary mb-3">5. Health and Safety Disclaimer</h2>
                  <p>
                    Global Plate provides general nutrition and cooking information for educational purposes only. 
                    This information is not intended as medical advice. Users should consult healthcare professionals 
                    for specific dietary needs, allergies, or health conditions.
                  </p>
                </section>

                <section class="mb-4">
                  <h2 class="h4 text-primary mb-3">6. Intellectual Property</h2>
                  <p>
                    Users retain ownership of their original content (recipes, photos, comments) but grant Global Plate 
                    a license to use, display, and distribute such content on the platform. The Global Plate platform, 
                    design, and functionality are protected by copyright and other intellectual property laws.
                  </p>
                </section>

                <section class="mb-4">
                  <h2 class="h4 text-primary mb-3">7. Privacy and Data Protection</h2>
                  <p>
                    Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, 
                    to understand our practices regarding the collection and use of your personal information.
                  </p>
                </section>

                <section class="mb-4">
                  <h2 class="h4 text-primary mb-3">8. Limitation of Liability</h2>
                  <p>
                    Global Plate is provided "as is" without warranties of any kind. We are not liable for any damages 
                    arising from your use of the service, including but not limited to direct, indirect, incidental, 
                    or consequential damages.
                  </p>
                </section>

                <section class="mb-4">
                  <h2 class="h4 text-primary mb-3">9. Termination</h2>
                  <p>
                    We reserve the right to terminate or suspend your account and access to the service immediately, 
                    without prior notice, for any breach of these Terms of Service or for any other reason we deem appropriate.
                  </p>
                </section>

                <section class="mb-4">
                  <h2 class="h4 text-primary mb-3">10. Changes to Terms</h2>
                  <p>
                    We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. 
                    Your continued use of Global Plate after changes are posted constitutes your acceptance of the revised terms.
                  </p>
                </section>

                <section class="mb-4">
                  <h2 class="h4 text-primary mb-3">11. Contact Information</h2>
                  <p>
                    If you have any questions about these Terms of Service, please contact us at:
                  </p>
                  <p>
                    Email: support@globalplate.com<br>
                    Address: Melbourne, Australia
                  </p>
                </section>
              </div>

              <div class="text-center mt-5">
                <router-link to="/register" class="btn btn-primary me-3">
                  I Accept - Create Account
                </router-link>
                <router-link to="/" class="btn btn-outline-secondary">
                  Return to Home
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const lastUpdated = ref('July 2025')
</script>

<style scoped>
.terms-page {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.card {
  border-radius: 15px;
}

.terms-content {
  line-height: 1.7;
}

.terms-content h2 {
  border-bottom: 2px solid #e9ecef;
  padding-bottom: 0.5rem;
}

.terms-content ul {
  padding-left: 1.5rem;
}

.terms-content li {
  margin-bottom: 0.5rem;
}

.btn {
  border-radius: 10px;
  padding: 0.75rem 2rem;
}
</style>