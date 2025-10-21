<!--
  Footer Component - Application-wide footer with navigation and information
  フッターコンポーネント - ナビゲーションと情報を含むアプリケーション全体のフッター

  Features / 機能:
  - Brand information and copyright / ブランド情報と著作権表示
  - Navigation links to main sections / 主要セクションへのナビゲーションリンク
  - Social media links (YouTube, Facebook, Instagram) / ソーシャルメディアリンク
  - Legal pages access (Terms, Privacy Policy) / 法的ページへのアクセス
  - Responsive design for mobile and desktop / モバイルとデスクトップ対応のレスポンシブデザイン
  - Accessibility features / アクセシビリティ機能

  Layout Structure / レイアウト構造:
  - Brand (GLOBAL PLATE) - Left column / ブランド情報 - 左列
  - About section / Aboutセクション
  - Social links / ソーシャルリンク
  - Quick navigation to Recipes, Groups, Events, Food Map / レシピ、グループ、イベント、Food Mapへのクイックナビゲーション
  - Legal links (Terms, Privacy) / 法的リンク（利用規約、プライバシーポリシー）

  BR Reference / BR参照:
  - Part of global UI/UX components / グローバルUI/UXコンポーネントの一部
-->

<template>
  <footer class="bg-light border-top mt-auto">
    <div class="container py-5">
      <div class="row">
        <!-- Brand Information Section / ブランド情報セクション -->
        <div class="col-lg-3 col-md-6 mb-4">
          <div class="footer-brand">
            <!-- Brand name and copyright / ブランド名と著作権 -->
            <h5 class="fw-bold text-dark mb-3">GLOBAL PLATE</h5>
            <p class="text-muted small mb-3">© 2025</p>

            <!-- Brand mission statement / ブランドミッションステートメント -->
            <p class="text-muted small mb-3">
              A nutritional food community that connects international students with the world.<br />
              Let's learn about healthy eating habits together.
            </p>
          </div>
        </div>

        <!-- About Section / Aboutセクション -->
        <div class="col-lg-3 col-md-6 mb-4">
          <div class="footer-section">
            <h6 class="fw-bold text-dark mb-3">About</h6>
            <ul class="list-unstyled">
              <li class="mb-2">
                <a href="/" class="text-muted text-decoration-none footer-link">Global Plate</a>
              </li>
            </ul>
          </div>
        </div>

        <!-- Social Media Links Section / ソーシャルメディアリンクセクション -->
        <div class="col-lg-2 col-md-6 mb-4">
          <div class="footer-section">
            <h6 class="fw-bold text-dark mb-3">Links</h6>
            <div class="social-links">
              <!-- YouTube link / YouTubeリンク -->
              <a
                href="https://www.youtube.com/"
                target="_blank"
                class="text-muted me-3 social-link"
              >
                <i class="fab fa-youtube fa-lg"></i>
              </a>

              <!-- Facebook link / Facebookリンク -->
              <a
                href="https://www.facebook.com/"
                target="_blank"
                class="text-muted me-3 social-link"
              >
                <i class="fab fa-facebook fa-lg"></i>
              </a>

              <!-- Instagram link / Instagramリンク -->
              <a
                href="https://www.instagram.com/"
                target="_blank"
                class="text-muted me-3 social-link"
              >
                <i class="fab fa-instagram fa-lg"></i>
              </a>
            </div>
          </div>
        </div>

        <!-- Main Navigation Sections / メインナビゲーションセクション -->
        <div class="col-lg-2 col-md-6 mb-4">
          <div class="footer-section">
            <h6 class="fw-bold text-dark mb-3">Sections</h6>
            <ul class="list-unstyled">
              <!-- Recipes page link / レシピページへのリンク -->
              <li class="mb-2">
                <router-link to="/recipes" class="text-muted text-decoration-none footer-link">
                  Recipes
                </router-link>
              </li>

              <!-- Groups page link / グループページへのリンク -->
              <li class="mb-2">
                <router-link to="/groups" class="text-muted text-decoration-none footer-link">
                  Groups
                </router-link>
              </li>

              <!-- Events page link / イベントページへのリンク -->
              <li class="mb-2">
                <router-link to="/events" class="text-muted text-decoration-none footer-link">
                  Events
                </router-link>
              </li>

              <!-- Food Map page link (placeholder) / Food Mapページへのリンク（プレースホルダー） -->
              <li class="mb-2">
                <a href="/geo-location" class="text-muted text-decoration-none footer-link">
                  Food Map
                </a>
              </li>
            </ul>
          </div>
        </div>

        <!-- Legal Information Section / 法的情報セクション -->
        <div class="col-lg-2 col-md-6 mb-4">
          <div class="footer-section">
            <h6 class="fw-bold text-dark mb-3">Legal</h6>
            <ul class="list-unstyled">
              <!-- Terms of Service link / 利用規約へのリンク -->
              <li class="mb-2">
                <router-link to="/terms" class="text-muted text-decoration-none footer-link">
                  Terms policy
                </router-link>
              </li>

              <!-- Privacy Policy link / プライバシーポリシーへのリンク -->
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
// Static footer component with no dynamic functionality
// 動的機能を持たない静的フッターコンポーネント
// Currently contains only navigation links and static content
// 現在はナビゲーションリンクと静的コンテンツのみを含む
</script>

<style scoped>
/* Footer background styling / フッター背景スタイル */
footer {
  background-color: #f8f9fa !important;
  margin-top: auto;
}

/* Brand section heading / ブランドセクションの見出し */
.footer-brand h5 {
  font-size: 1.1rem;
  letter-spacing: 0.5px;
}

/* Footer section headings / フッターセクションの見出し */
.footer-section h6 {
  font-size: 0.95rem;
  margin-bottom: 1rem;
  color: #404040;
}

/* Footer link styling with hover effect / ホバーエフェクト付きフッターリンクスタイル */
.footer-link {
  font-size: 0.9rem;
  color: #404040 !important;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: #007bff !important;
}

/* Social media links container / ソーシャルメディアリンクコンテナ */
.social-links {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Social media icon styling / ソーシャルメディアアイコンスタイル */
.social-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  transition: all 0.3s ease;
  color: #404040 !important;
  text-decoration: none !important;
  border: none !important;
}

/* Social link hover effect / ソーシャルリンクホバーエフェクト */
.social-link:hover {
  color: #007bff !important;
  background-color: rgba(0, 123, 255, 0.1);
  transform: translateY(-2px);
}

.footer-links {
  font-size: 0.9rem;
}

/* Tablet and medium device responsive styling / タブレットと中型デバイスのレスポンシブスタイル */
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

/* Mobile device responsive styling / モバイルデバイスのレスポンシブスタイル */
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

/* Accessibility: Reduced motion support / アクセシビリティ: モーション軽減サポート */
@media (prefers-reduced-motion: reduce) {
  .footer-link {
    transition: none;
  }
}
</style>
