<template>
  <footer class="bg-light border-top mt-auto">
    <div class="container py-5">
      <div class="row">
        <!-- ブランド情報 -->
        <div class="col-lg-3 col-md-6 mb-4">
          <div class="footer-brand">
            <h5 class="fw-bold text-dark mb-3">GLOBAL PLATE</h5>
            <p class="text-muted small mb-3">© 2025</p>
            <p class="text-muted small mb-3">
                A nutritional food community that connects international students with the world.<br>
                Let's learn about healthy eating habits together.
            </p>
          </div>
        </div>

        <!-- About セクション -->
        <div class="col-lg-3 col-md-6 mb-4">
          <div class="footer-section">
            <h6 class="fw-bold text-dark mb-3">About</h6>
            <ul class="list-unstyled">
              <li class="mb-2">
                <a href="#" class="text-muted text-decoration-none footer-link">Global Plate</a>
              </li>
            </ul>
          </div>
        </div>

        <!-- Links セクション -->
        <div class="col-lg-2 col-md-6 mb-4">
          <div class="footer-section">
            <h6 class="fw-bold text-dark mb-3">Links</h6>
            <div class="social-links">
                <a href="https://www.youtube.com/" target="_blank" class="text-muted me-3 social-link">
                    <i class="fab fa-youtube fa-lg"></i>
                </a>
                <a href="https://www.facebook.com/" target="_blank" class="text-muted me-3 social-link">
                    <i class="fab fa-facebook fa-lg"></i>
                </a>
                <a href="https://www.instagram.com/" target="_blank" class="text-muted me-3 social-link">
                    <i class="fab fa-instagram fa-lg"></i>
                </a>
            </div>
          </div>
        </div>

        <!-- Sections セクション -->
        <div class="col-lg-2 col-md-6 mb-4">
          <div class="footer-section">
            <h6 class="fw-bold text-dark mb-3">Sections</h6>
            <ul class="list-unstyled">
              <li class="mb-2">
                <router-link to="/recipes" class="text-muted text-decoration-none footer-link">
                  Recipes
                </router-link>
              </li>
              <li class="mb-2">
                <router-link to="/groups" class="text-muted text-decoration-none footer-link">
                  Groups
                </router-link>
              </li>
              <li class="mb-2">
                <router-link to="/events" class="text-muted text-decoration-none footer-link">
                  Events
                </router-link>
              </li>
              <li class="mb-2">
                <a href="#" class="text-muted text-decoration-none footer-link">
                  Food Map
                </a>
              </li>
            </ul>
          </div>
        </div>

        <!-- Legal セクション -->
        <div class="col-lg-2 col-md-6 mb-4">
          <div class="footer-section">
            <h6 class="fw-bold text-dark mb-3">Legal</h6>
            <ul class="list-unstyled">
              <li class="mb-2">
                <router-link to="/terms" class="text-muted text-decoration-none footer-link">
                  Terms policy
                </router-link>
              </li>
              <li class="mb-2">
                <router-link to="/privacy" class="text-muted text-decoration-none footer-link">
                  Privacy Policy
                </router-link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
// フッターは現状、静的コンテンツなので、何もなし
</script>

<style scoped>
footer {
  background-color: #f8f9fa !important;
  margin-top: auto;
}

.footer-brand h5 {
  font-size: 1.1rem;
  letter-spacing: 0.5px;
}

.footer-section h6 {
  font-size: 0.95rem;
  margin-bottom: 1rem;
  color: #404040;
}

.footer-link {
  font-size: 0.9rem;
  color: #404040 !important;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: #007bff !important;
}

.social-links {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.social-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  transition: all 0.3s ease;
  color: #404040 !important;
  text-decoration: none !important; /* underlineを強制的に削除 */
  border: none !important; /* ボーダーを強制的に削除 */
}

.social-link:hover {
  color: #007bff !important;
  background-color: rgba(0, 123, 255, 0.1);
  transform: translateY(-2px);
}

.footer-links {
  font-size: 0.9rem;
}

/* レスポンシブ対応 */
@media (max-width: 767.98px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .footer-brand h5 {
    font-size: 1rem;
  }
  
  .footer-section h6 {
    font-size: 0.9rem;
    margin-bottom: 0.75rem;
  }
  
  .footer-link {
    font-size: 0.85rem;
  }
  
  .col-lg-3,
  .col-lg-2,
  .col-md-6 {
    margin-bottom: 2rem;
  }
}

@media (max-width: 575.98px) {
  .container {
    padding-left: 15px;
    padding-right: 15px;
  }
  
  .py-5 {
    padding-top: 2rem !important;
    padding-bottom: 2rem !important;
  }
  
  .footer-links {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
}

/* アクセシビリティ対応 */
@media (prefers-reduced-motion: reduce) {
  .footer-link {
    transition: none;
  }
}
</style>