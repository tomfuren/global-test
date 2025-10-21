<!--
  ホームページ - Global Plateのランディングページ
  Home Page - Global Plate landing page

  構成 / Structure:
  1. ヒーローセクション: メインビジュアルとCTA / Hero Section: Main visual and CTA
  2. 機能紹介セクション: 3つの主要機能 / Features Section: 3 main features
  3. CTAセクション: 登録への誘導 / CTA Section: Drive to registration

  目的 / Purpose:
  - Global Plateのミッションと価値提案を伝える / Communicate Global Plate's mission and value proposition
  - 新規ユーザーの登録を促進 / Encourage new user registration
  - 主要機能を簡潔に紹介 / Briefly introduce key features
-->
<template>
    <div class="home">
        <!--
          ヒーローセクション - メインビジュアルと行動喚起
          Hero Section - Main visual and call-to-action

          要素 / Elements:
          - グラデーション背景 (青系) / Gradient background (blue theme)
          - プライマリヘッダー: "Global Plate" / Primary header
          - 価値提案: 留学生向け栄養コミュニティ / Value proposition: nutrition community for international students
          - CTAボタン: 登録 & レシピ閲覧 / CTA buttons: Register & View Recipes
          - アイコン: 地球儀アニメーション / Icon: Globe with float animation
        -->
        <section class="hero bg-primary text-white py-5">
            <div class="container">
                <div class="row align-items-center">
                    <!-- 左カラム: テキストコンテンツ / Left Column: Text Content -->
                    <div class="col-lg-6">
                        <h1 class="display-4 fw-bold mb-4">Global Plate</h1>
                        <p class="lead mb-4">
                            A nutritional community connecting international students in Melbourne with the world
                        </p>
                        <p class="mb-4">
                            Share recipes in your country group and learn about healthy eating together.
                            You can meet new friends through cross-cultural culinary exchange.
                        </p>
                        <!-- CTAボタン群 / CTA Button Group -->
                        <div class="d-flex gap-3">
                            <router-link to="/register" class="btn btn-light btn-lg">
                                Join NOW
                            </router-link>
                            <router-link to="/recipes" class="btn btn-outline-light btn-lg">
                                View Recipe
                            </router-link>
                        </div>
                    </div>
                    <!-- 右カラム: 地球儀アイコン (フロートアニメーション) / Right Column: Globe Icon (Float Animation) -->
                    <div class="col-lg-6 text-center">
                        <div class="hero-image">
                            <i class="fas fa-globe fa-10x opacity-75"></i>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!--
          機能紹介セクション - Global Plateの3つの主要機能
          Features Section - Global Plate's 3 main features

          機能カード / Feature Cards:
          1. 国別グループ (National Groups): 同じ国の友人とレシピ共有 / Share recipes with friends from the same country
          2. レシピ共有 (Recipe Sharing): 栄養バランスの良いレシピを投稿・発見 / Post and discover nutritionally balanced recipes
          3. イベント開催 (Event Hosting): 料理教室や文化交流イベント / Cooking classes and cultural exchange events

          デザイン / Design:
          - 3カラムレイアウト (デスクトップ) / 3-column layout (desktop)
          - ホバー時に上にスライド (transform: translateY(-5px)) / Slide up on hover
          - アイコンカラー: プライマリ(青)、成功(緑)、警告(黄) / Icon colors: Primary (blue), Success (green), Warning (yellow)
        -->
        <section class="features py-5">
            <div class="container">
                <!-- セクションヘッダー / Section Header -->
                <div class="row text-center mb-5">
                    <div class="col-12">
                        <h2 class="display-5 mb-3">Global Plate Features</h2>
                        <p class="lead text-muted">
                            Functions to support healthy eating habits of international students
                        </p>
                    </div>
                </div>
                <!-- 機能カードグリッド / Feature Cards Grid -->
                <div class="row g-4">
                    <!-- 機能1: 国別グループ / Feature 1: National Groups -->
                    <div class="col-md-4">
                        <div class="card h-100 border-0 shadow-sm">
                            <div class="card-body text-center p-4">
                                <i class="fas fa-users fa-3x text-primary mb-3"></i>
                                <h5 class="card-title">National Groups</h5>
                                <p class="card-text">
                                Share healthy recipes using familiar ingredients with friends from the same country
                                </p>
                            </div>
                        </div>
                    </div>
                    <!-- 機能2: レシピ共有 / Feature 2: Recipe Sharing -->
                    <div class="col-md-4">
                        <div class="card h-100 border-0 shadow-sm">
                            <div class="card-body text-center p-4">
                                <i class="fas fa-utensils fa-3x text-success mb-3"></i>
                                <h5 class="card-title">Recipe sharing</h5>
                                <p class="card-text">
                                    Post and discover delicious, nutritionally balanced recipes to improve your diet
                                </p>
                            </div>
                        </div>
                    </div>
                    <!-- 機能3: イベント開催 / Feature 3: Event Hosting -->
                    <div class="col-md-4">
                        <div class="card h-100 border-0 shadow-sm">
                            <div class="card-body text-center p-4">
                                <i class="fas fa-calendar-alt fa-3x text-warning mb-3"></i>
                                <h5 class="card-title">Event Hosting</h5>
                                <p class="card-text">
                                    Meet new friends at cooking classes and cultural exchange events
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!--
          CTAセクション - 最終的な登録への誘導
          CTA Section - Final call-to-action for registration

          目的 / Purpose:
          - ページ閲覧者を会員登録へ誘導 / Drive page visitors to sign up
          - Global Plateの価値を再確認 / Reinforce Global Plate's value
          - 登録の障壁を下げる ("Start Free") / Lower registration barrier ("Start Free")

          デザイン / Design:
          - ライトグレー背景 / Light gray background
          - 中央揃え / Center aligned
          - 最大幅8カラム / Max width 8 columns
        -->
        <section class="cta bg-light py-5">
            <div class="container text-center">
                <div class="row">
                    <div class="col-lg-8 mx-auto">
                        <h3 class="mb-4">Start your healthy life abroad</h3>
                        <p class="mb-4">
                            Why not join Global Plate and enjoy delicious and healthy food with international students from all over the world?
                        </p>
                        <router-link to="/register" class="btn btn-primary btn-lg">
                            Start Free
                        </router-link>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
/**
 * Homeコンポーネント - ランディングページ
 * Home Component - Landing Page
 *
 * 静的コンテンツのみで、リアクティブステートなし
 * Static content only, no reactive state
 *
 * メタデータ / Metadata:
 * - title: SEO用のページタイトル / Page title for SEO
 */
export default {
  name: 'Home',
  meta: {
    title: 'Global Plate - A nutritional food community that connects international students with the world'
  }
}
</script>

<style scoped>
/**
 * ホームページスタイル / Home Page Styles
 */

/* ヒーローセクションの背景グラデーション / Hero section background gradient */
.hero {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  /* 左上から右下への青系グラデーション / Blue gradient from top-left to bottom-right */
}

/* 地球儀アイコンのフロートアニメーション / Globe icon float animation */
.hero-image i {
  animation: float 3s ease-in-out infinite;
  /* 3秒かけて上下に浮遊 / Float up and down over 3 seconds */
}

/* フロートアニメーションのキーフレーム / Float animation keyframes */
@keyframes float {
  0%, 100% { transform: translateY(0px); } /* 開始・終了位置 / Start/End position */
  50% { transform: translateY(-10px); }    /* 中間位置: 10px上 / Mid position: 10px up */
}

/* 機能カードのホバートランジション / Feature card hover transition */
.features .card {
  transition: transform 0.3s ease;
  /* 0.3秒のトランスフォームアニメーション / 0.3s transform animation */
}

/* 機能カードホバー時のエフェクト / Feature card hover effect */
.features .card:hover {
  transform: translateY(-5px);
  /* 5px上にスライド / Slide up 5px */
}
</style>