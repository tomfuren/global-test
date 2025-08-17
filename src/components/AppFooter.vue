<template>
    <footer class="bg-dark text-white py-4 mt-5">
        <div class="container">
            <div class="row">
                <div class="col-lg-4 mb-3">
                    <h5 class="text-primary">
                    <i class="fas fa-globe me-2"></i>
                        Global Plate
                    </h5>
                    <p class="mb-0">
                        A nutritional food community that connects international students with the world.<br>
                        Let's learn about healthy eating habits together.
                    </p>
                </div>
                
                <div class="col-lg-2 col-md-3 col-sm-6 mb-3">
                    <h6>Service</h6>
                    <ul class="list-unstyled">
                        <li><router-link to="/recipes" class="text-light text-decoration-none">Recipe</router-link></li>
                        <li><router-link to="/groups" class="text-light text-decoration-none">Group</router-link></li>
                        <li><router-link to="/events" class="text-light text-decoration-none">Event</router-link></li>
                    </ul>
                </div>
                
                <div class="col-lg-2 col-md-3 col-sm-6 mb-3">
                    <h6>Support</h6>
                    <ul class="list-unstyled">
                        <li><a href="#" class="text-light text-decoration-none">Help</a></li>
                        <li><a href="#" class="text-light text-decoration-none">Contact</a></li>
                        <li><a href="#" class="text-light text-decoration-none">FAQ</a></li>
                    </ul>
                </div>
                
                <div class="col-lg-2 col-md-3 col-sm-6 mb-3">
                    <h6>legal information</h6>
                    <ul class="list-unstyled">
                        <li><a href="#" class="text-light text-decoration-none">terms of service</a></li>
                        <li><a href="#" class="text-light text-decoration-none">privacy</a></li>
                        <li><a href="#" class="text-light text-decoration-none">Cookie</a></li>
                    </ul>
                </div>
                
                <div class="col-lg-2 col-md-3 col-sm-6 mb-3">
                    <h6>Follow</h6>
                    <div class="social-links">
                    <a href="#" class="text-light me-3"><i class="fab fa-facebook fa-lg"></i></a>
                    <a href="#" class="text-light me-3"><i class="fab fa-instagram fa-lg"></i></a>
                    <a href="#" class="text-light"><i class="fab fa-youtube fa-lg"></i></a>
                    </div>
                </div>
            </div>
            
            <hr class="my-4">
            
            <div class="row align-items-center">
                <div class="col-md-6">
                    <p class="mb-0">&copy; 2025 Global Plate. All rights reserved.</p>
                </div>
                    <div class="col-md-6 text-md-end">
                    <p class="mb-0">Made for international students</p>
                </div>
            </div>
        </div>
    </footer>
</template>

<script>
export default {
  name: 'AppFooter'
}
</script>

<style scoped>
.social-links a {
  transition: all 0.3s ease;
}

.social-links a:hover {
  color: #007bff !important;
  transform: translateY(-2px);
}

footer a:hover {
  color: #007bff !important;
}
</style>