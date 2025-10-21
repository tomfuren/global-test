<!--
  Home Page - Global Plate Landing Page
  ホームページ - Global Plateランディングページ

  Purpose / 目的:
  - Communicate Global Plate's mission and value proposition / Global Plateのミッションと価値提案を伝える
  - Encourage new user registration / 新規ユーザーの登録を促進
  - Showcase key features and benefits / 主要機能と利点を紹介
  - Create compelling first impression / 魅力的な第一印象を作る

  Page Structure / ページ構造:
  1. Hero Section: Main visual with call-to-action / ヒーローセクション: メインビジュアルとCTA
  2. Features Section: Three main features / 機能セクション: 3つの主要機能
  3. Final CTA Section: Registration encouragement / 最終CTAセクション: 登録促進

  Target Audience / ターゲット層:
  - International students in Melbourne / メルボルンの留学生
  - People interested in healthy eating / 健康的な食事に興味がある人々
  - Those seeking cultural exchange / 文化交流を求める人々

  Design Principles / デザイン原則:
  - Clean and modern layout / クリーンでモダンなレイアウト
  - Blue gradient primary color scheme / 青系グラデーションの主要カラー
  - Responsive design for all devices / すべてのデバイス対応のレスポンシブデザイン
  - Engaging animations and transitions / 魅力的なアニメーションとトランジション

  Conversion Goals / 目標:
  - Primary: User registration (Sign up button) / 主要: ユーザー登録（サインアップボタン）
  - Secondary: Recipe browsing (View Recipe button) / 二次: レシピ閲覧（レシピ閲覧ボタン）
-->

<template>
  <div class="home">
    <!--
      ============================================================================
      Hero Section / ヒーローセクション
      ============================================================================

      The first section visitors see - designed to immediately communicate value
      訪問者が最初に見るセクション - 即座に価値を伝えるように設計

      Components / コンポーネント:
      - Compelling headline / 魅力的な見出し
      - Value proposition text / 価値提案テキスト
      - Two CTA buttons (primary and secondary) / 2つのCTAボタン（主要と二次）
      - Animated globe icon for visual appeal / 視覚的魅力のためのアニメーション地球儀アイコン

      Design Elements / デザイン要素:
      - Blue gradient background (brand colors) / 青系グラデーション背景（ブランドカラー）
      - White text for high contrast / 高コントラストの白テキスト
      - Large, bold typography / 大きく太いタイポグラフィ
      - Floating animation for visual interest / 視覚的興味のためのフローティングアニメーション

      Call-to-Actions / 行動喚起:
      - "Join NOW" (primary): Direct registration / 「今すぐ参加」（主要）: 直接登録
      - "View Recipe" (secondary): Exploration path / 「レシピを見る」（二次）: 探索パス
    -->
    <section class="hero bg-primary text-white py-5">
      <div class="container">
        <div class="row align-items-center">
          <!-- Left Column: Text Content and CTAs / 左カラム: テキストコンテンツとCTA -->
          <div class="col-lg-6">
            <!-- Main Headline / メイン見出し -->
            <!-- Establishes brand identity immediately / 即座にブランドアイデンティティを確立 -->
            <h1 class="display-4 fw-bold mb-4">Global Plate</h1>

            <!-- Primary Value Proposition / 主要な価値提案 -->
            <!-- Explains what Global Plate is in one sentence / Global Plateが何かを一文で説明 -->
            <p class="lead mb-4">
              A nutritional community connecting international students in Melbourne with the world
            </p>

            <!-- Supporting Description / サポート説明 -->
            <!-- Details the benefits and features / 利点と機能の詳細 -->
            <p class="mb-4">
              Share recipes in your country group and learn about healthy eating together. You can
              meet new friends through cross-cultural culinary exchange.
            </p>

            <!-- CTA Button Group / CTAボタングループ -->
            <!-- Primary and secondary action buttons / 主要および二次アクションボタン -->
            <div class="d-flex gap-3">
              <!-- Primary CTA: Registration / 主要CTA: 登録 -->
              <router-link to="/register" class="btn btn-light btn-lg"> Join NOW </router-link>

              <!-- Secondary CTA: Exploration / 二次CTA: 探索 -->
              <router-link to="/recipes" class="btn btn-outline-light btn-lg">
                View Recipe
              </router-link>
            </div>
          </div>

          <!-- Right Column: Visual Element / 右カラム: ビジュアル要素 -->
          <!-- Animated globe icon representing global community / グローバルコミュニティを表すアニメーション地球儀アイコン -->
          <div class="col-lg-6 text-center">
            <div class="hero-image">
              <!-- Globe icon with float animation / フロートアニメーション付き地球儀アイコン -->
              <i class="fas fa-globe fa-10x opacity-75"></i>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!--
      ============================================================================
      Features Section / 機能セクション
      ============================================================================

      Showcases Global Plate's three main features with icons and descriptions
      アイコンと説明付きでGlobal Plateの3つの主要機能を紹介

      Purpose / 目的:
      - Educate visitors about platform capabilities / 訪問者にプラットフォームの機能を教育
      - Build trust through clear feature communication / 明確な機能説明で信頼を構築
      - Encourage deeper engagement with the platform / プラットフォームとのより深い関与を促進

      Layout / レイアウト:
      - Three-column grid on desktop / デスクトップでは3カラムグリッド
      - Single column stack on mobile / モバイルでは単一カラムスタック
      - Equal height cards for visual balance / 視覚的バランスのための均一な高さのカード

      Features Highlighted / ハイライトされた機能:
      1. National Groups: Country-based communities / 国別グループ: 国ベースのコミュニティ
      2. Recipe Sharing: Nutritional content sharing / レシピ共有: 栄養コンテンツ共有
      3. Event Hosting: Cultural exchange events / イベント開催: 文化交流イベント

      Design Pattern / デザインパターン:
      - Icon + Heading + Description format / アイコン + 見出し + 説明形式
      - Hover animation for interactivity / インタラクティビティのためのホバーアニメーション
      - Consistent spacing and alignment / 一貫したスペーシングと配置
    -->
    <section class="features py-5">
      <div class="container">
        <!-- Section Header / セクションヘッダー -->
        <!-- Introduces the features section / 機能セクションを紹介 -->
        <div class="row text-center mb-5">
          <div class="col-12">
            <h2 class="display-5 mb-3">Global Plate Features</h2>
            <p class="lead text-muted">
              Functions to support healthy eating habits of international students
            </p>
          </div>
        </div>

        <!-- Feature Cards Grid / 機能カードグリッド -->
        <div class="row g-4">
          <!--
            Feature Card 1: National Groups
            機能カード1: 国別グループ

            Value Proposition / 価値提案:
            Connect with people from your home country
            出身国の人々とつながる

            Benefits / 利点:
            - Familiar ingredients and recipes / 馴染みのある食材とレシピ
            - Cultural comfort / 文化的快適さ
            - Language support / 言語サポート

            Icon Color: Primary Blue (text-primary)
            アイコンカラー: プライマリブルー
          -->
          <div class="col-md-4">
            <div class="card h-100 border-0 shadow-sm">
              <div class="card-body text-center p-4">
                <!-- Feature icon / 機能アイコン -->
                <i class="fas fa-users fa-3x text-primary mb-3"></i>
                <!-- Feature title / 機能タイトル -->
                <h5 class="card-title">National Groups</h5>
                <!-- Feature description / 機能説明 -->
                <p class="card-text">
                  Share healthy recipes using familiar ingredients with friends from the same
                  country
                </p>
              </div>
            </div>
          </div>

          <!--
            Feature Card 2: Recipe Sharing
            機能カード2: レシピ共有

            Value Proposition / 価値提案:
            Discover and share nutritionally balanced recipes
            栄養バランスの良いレシピを発見・共有

            Benefits / 利点:
            - Healthy eating inspiration / 健康的な食事のインスピレーション
            - Community knowledge sharing / コミュニティ知識共有
            - Dietary improvement / 食生活の改善

            Icon Color: Success Green (text-success)
            アイコンカラー: サクセスグリーン
          -->
          <div class="col-md-4">
            <div class="card h-100 border-0 shadow-sm">
              <div class="card-body text-center p-4">
                <!-- Feature icon / 機能アイコン -->
                <i class="fas fa-utensils fa-3x text-success mb-3"></i>
                <!-- Feature title / 機能タイトル -->
                <h5 class="card-title">Recipe sharing</h5>
                <!-- Feature description / 機能説明 -->
                <p class="card-text">
                  Post and discover delicious, nutritionally balanced recipes to improve your diet
                </p>
              </div>
            </div>
          </div>

          <!--
            Feature Card 3: Event Hosting
            機能カード3: イベント開催

            Value Proposition / 価値提案:
            Join cooking classes and cultural exchange events
            料理教室と文化交流イベントに参加

            Benefits / 利点:
            - Meet new friends / 新しい友達と出会う
            - Learn cooking skills / 料理スキルを学ぶ
            - Cultural exchange / 文化交流

            Icon Color: Warning Yellow (text-warning)
            アイコンカラー: ワーニングイエロー
          -->
          <div class="col-md-4">
            <div class="card h-100 border-0 shadow-sm">
              <div class="card-body text-center p-4">
                <!-- Feature icon / 機能アイコン -->
                <i class="fas fa-calendar-alt fa-3x text-warning mb-3"></i>
                <!-- Feature title / 機能タイトル -->
                <h5 class="card-title">Event Hosting</h5>
                <!-- Feature description / 機能説明 -->
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
      ============================================================================
      Final CTA Section / 最終CTAセクション
      ============================================================================

      Last opportunity to convert visitors into registered users
      訪問者を登録ユーザーに転換する最後の機会

      Purpose / 目的:
      - Reinforce value proposition / 価値提案を再確認
      - Provide final call-to-action / 最終的な行動喚起を提供
      - Reduce registration friction with "Start Free" / 「無料で始める」で登録の摩擦を減らす

      Psychology / 心理学:
      - Social proof through "students from all over the world" / 「世界中の学生」を通じた社会的証明
      - Emotional appeal: "healthy life abroad" / 感情的訴求: 「海外での健康的な生活」
      - Low barrier: "Start Free" instead of "Sign Up" / 低いハードル: 「サインアップ」の代わりに「無料で始める」

      Design / デザイン:
      - Light gray background for subtle separation / 微妙な分離のための薄灰色背景
      - Centered content for focus / フォーカスのための中央揃えコンテンツ
      - Large primary button for visibility / 可視性のための大きなプライマリボタン

      Conversion Optimization / 変換最適化:
      - Clear, action-oriented button text / 明確でアクション指向のボタンテキスト
      - Emphasized benefits / 強調された利点
      - Simple, distraction-free layout / シンプルで気を散らさないレイアウト
    -->
    <section class="cta bg-light py-5">
      <div class="container text-center">
        <div class="row">
          <!-- Centered content column / 中央揃えコンテンツカラム -->
          <div class="col-lg-8 mx-auto">
            <!-- Final value proposition / 最終価値提案 -->
            <h3 class="mb-4">Start your healthy life abroad</h3>

            <!-- Motivational description / 動機付け説明 -->
            <p class="mb-4">
              Why not join Global Plate and enjoy delicious and healthy food with international
              students from all over the world?
            </p>

            <!-- Primary CTA button / 主要CTAボタン -->
            <!-- "Start Free" emphasizes no-cost entry / 「無料で始める」は無料参加を強調 -->
            <router-link to="/register" class="btn btn-primary btn-lg"> Start Free </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
/**
 * Home Component - Landing Page
 * Homeコンポーネント - ランディングページ
 */
export default {
  name: 'Home',
}
</script>

<style scoped>
/**
 * Hero Section Background Gradient
 * ヒーローセクション背景グラデーション
 */
.hero {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
}

/**
 * Hero Image Float Animation
 * ヒーロー画像フロートアニメーション
 */
.hero-image i {
  animation: float 3s ease-in-out infinite;
}

/**
 * Float Animation Keyframes
 * フロートアニメーションキーフレーム
 */
@keyframes float {
  0%,
  100% {
    transform: translateY(0px); /* Start and end position / 開始・終了位置 */
  }
  50% {
    transform: translateY(-10px); /* Mid-animation: 10px up / アニメーション中間: 10px上 */
  }
}

/**
 * Feature Card Hover Transition
 */
.features .card {
  transition: transform 0.3s ease;
}

/**
 * Feature Card Hover Effect
 * 機能カードホバーエフェクト
 */
.features .card:hover {
  transform: translateY(-5px); /* Lift card 5px on hover / ホバー時にカードを5px持ち上げる */
}
</style>
