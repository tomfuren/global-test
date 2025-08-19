<template>
  <div class="privacy-page bg-light min-vh-100 py-5">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="card shadow-sm border-0">
            <div class="card-body p-5">
              <div class="text-center mb-5">
                <h1 class="fw-bold text-primary">Privacy Policy</h1>
                <p class="text-muted">Last updated: {{ lastUpdated }}</p>
              </div>

              <div class="privacy-content">
                <section class="mb-4">
                  <h2 class="h4 text-primary mb-3">1. Information We Collect</h2>
                  <p>
                    Global Plate collects information you provide directly to us when you create an account, 
                    use our services, or communicate with us. This may include:
                  </p>
                  <ul>
                    <li><strong>Personal Information:</strong> Name, email address, country of origin, university/school</li>
                    <li><strong>Profile Information:</strong> Dietary preferences, cooking skill level, bio</li>
                    <li><strong>Content:</strong> Recipes, photos, comments, ratings, and reviews you share</li>
                    <li><strong>Usage Data:</strong> How you interact with our platform and features</li>
                    <li><strong>Device Information:</strong> Browser type, operating system, IP address</li>
                  </ul>
                </section>

                <section class="mb-4">
                  <h2 class="h4 text-primary mb-3">2. How We Use Your Information</h2>
                  <p>We use the information we collect to:</p>
                  <ul>
                    <li>Provide, maintain, and improve our services</li>
                    <li>Create and manage your account</li>
                    <li>Connect you with relevant groups and communities</li>
                    <li>Personalize your experience and content recommendations</li>
                    <li>Send you important updates and notifications</li>
                    <li>Ensure platform safety and prevent misuse</li>
                    <li>Comply with legal obligations</li>
                  </ul>
                </section>

                <section class="mb-4">
                  <h2 class="h4 text-primary mb-3">3. Information Sharing</h2>
                  <p>
                    We do not sell, trade, or rent your personal information to third parties. 
                    We may share your information in the following circumstances:
                  </p>
                  <ul>
                    <li><strong>Public Content:</strong> Recipes, comments, and profiles you choose to make public</li>
                    <li><strong>Group Members:</strong> Basic profile information with members of groups you join</li>
                    <li><strong>Service Providers:</strong> Trusted partners who help us operate our platform</li>
                    <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                    <li><strong>Business Transfers:</strong> In connection with mergers or acquisitions</li>
                  </ul>
                </section>

                <section class="mb-4">
                  <h2 class="h4 text-primary mb-3">4. Data Storage and Security</h2>
                  <p>
                    We implement appropriate technical and organizational measures to protect your personal information 
                    against unauthorized access, alteration, disclosure, or destruction. However, no internet transmission 
                    is completely secure, and we cannot guarantee absolute security.
                  </p>
                  <p>
                    Your data may be stored and processed in countries other than your own. By using Global Plate, 
                    you consent to the transfer of your information to these locations.
                  </p>
                </section>

                <section class="mb-4">
                  <h2 class="h4 text-primary mb-3">5. Your Rights and Choices</h2>
                  <p>You have the right to:</p>
                  <ul>
                    <li><strong>Access:</strong> Request a copy of your personal information</li>
                    <li><strong>Update:</strong> Correct or update your account information</li>
                    <li><strong>Delete:</strong> Request deletion of your account and personal data</li>
                    <li><strong>Portability:</strong> Request your data in a machine-readable format</li>
                    <li><strong>Object:</strong> Object to certain processing of your personal information</li>
                    <li><strong>Privacy Settings:</strong> Control who can see your profile and content</li>
                  </ul>
                </section>

                <section class="mb-4">
                  <h2 class="h4 text-primary mb-3">6. Cookies and Tracking</h2>
                  <p>
                    Global Plate uses cookies and similar technologies to enhance your experience, 
                    remember your preferences, and analyze platform usage. You can control cookie 
                    settings through your browser, but some features may not function properly if cookies are disabled.
                  </p>
                </section>

                <section class="mb-4">
                  <h2 class="h4 text-primary mb-3">7. Children's Privacy</h2>
                  <p>
                    Global Plate is intended for users aged 18 and above. We do not knowingly collect 
                    personal information from children under 18. If we become aware that we have collected 
                    such information, we will take steps to delete it promptly.
                  </p>
                </section>

                <section class="mb-4">
                  <h2 class="h4 text-primary mb-3">8. International Users</h2>
                  <p>
                    Global Plate is primarily designed for international students studying in Australia. 
                    If you access our service from other countries, please be aware that your information 
                    may be transferred to and processed in Australia, which may have different data protection 
                    laws than your home country.
                  </p>
                </section>

                <section class="mb-4">
                  <h2 class="h4 text-primary mb-3">9. Data Retention</h2>
                  <p>
                    We retain your personal information for as long as necessary to provide our services 
                    and fulfill the purposes outlined in this policy. When you delete your account, 
                    we will delete your personal information, though some information may be retained 
                    for legal or legitimate business purposes.
                  </p>
                </section>

                <section class="mb-4">
                  <h2 class="h4 text-primary mb-3">10. Changes to This Policy</h2>
                  <p>
                    We may update this Privacy Policy from time to time. We will notify you of any material 
                    changes by posting the new policy on this page and updating the "Last updated" date. 
                    Your continued use of Global Plate after changes are posted constitutes your acceptance of the updated policy.
                  </p>
                </section>

                <section class="mb-4">
                  <h2 class="h4 text-primary mb-3">11. Contact Us</h2>
                  <p>
                    If you have any questions, concerns, or requests regarding this Privacy Policy 
                    or your personal information, please contact us at:
                  </p>
                  <div class="contact-info bg-light p-3 rounded">
                    <p class="mb-1"><strong>Email:</strong> privacy@globalplate.com</p>
                    <p class="mb-1"><strong>Address:</strong> Melbourne, Australia</p>
                    <p class="mb-0"><strong>Response Time:</strong> We aim to respond within 30 days</p>
                  </div>
                </section>
              </div>

              <div class="text-center mt-5">
                <router-link to="/register" class="btn btn-primary me-3">
                  I Understand - Create Account
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
.privacy-page {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.card {
  border-radius: 15px;
}

.privacy-content {
  line-height: 1.7;
}

.privacy-content h2 {
  border-bottom: 2px solid #e9ecef;
  padding-bottom: 0.5rem;
}

.privacy-content ul {
  padding-left: 1.5rem;
}

.privacy-content li {
  margin-bottom: 0.5rem;
}

.contact-info {
  border-left: 4px solid #007bff;
}

.btn {
  border-radius: 10px;
  padding: 0.75rem 2rem;
}
</style>