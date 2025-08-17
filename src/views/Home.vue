<template>
    <div class="home">
        <!-- Hero Section -->
        <section class="hero bg-primary text-white py-5">
            <div class="container">
                <div class="row align-items-center">
                    <div class="col-lg-6">
                        <h1 class="display-4 fw-bold mb-4">Global Plate</h1>
                        <p class="lead mb-4">
                            A nutritional community connecting international students in Melbourne with the world
                        </p>
                        <p class="mb-4">
                            Share recipes in your country group and learn about healthy eating together.
                            You can meet new friends through cross-cultural culinary exchange.
                        </p>
                        <div class="d-flex gap-3">
                            <router-link to="/register" class="btn btn-light btn-lg">
                                Join NOW
                            </router-link>
                            <router-link to="/recipes" class="btn btn-outline-light btn-lg">
                                View Recipe
                            </router-link>
                        </div>
                    </div>
                    <div class="col-lg-6 text-center">
                        <div class="hero-image">
                            <i class="fas fa-globe fa-10x opacity-75"></i>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Features Section -->
        <section class="features py-5">
            <div class="container">
                <div class="row text-center mb-5">
                    <div class="col-12">
                        <h2 class="display-5 mb-3">Global Plate Features</h2>
                        <p class="lead text-muted">
                            Functions to support healthy eating habits of international students
                        </p>
                    </div>
                </div>
                <div class="row g-4">
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

        <!-- CTA Section -->
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
export default {
  name: 'Home',
  meta: {
    title: 'Global Plate - A nutritional food community that connects international students with the world'
  }
}
</script>

<style scoped>
.hero {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
}

.hero-image i {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.features .card {
  transition: transform 0.3s ease;
}

.features .card:hover {
  transform: translateY(-5px);
}
</style>