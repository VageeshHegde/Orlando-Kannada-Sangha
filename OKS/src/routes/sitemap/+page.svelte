<script>
  import Hero from '$lib/components/Hero.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import Navbar from '$lib/components/Navbar.svelte';
  import PageTitle from '$lib/components/PageTitle.svelte';
</script>

<svelte:head>
  <title>Sitemap - Orlando Kannada Sangha</title>
  <meta name="description" content="Sitemap for Orlando Kannada Sangha - Find all pages and sections of our website.">
</svelte:head>

<Navbar />
<Hero page="Sitemap" />

<!-- Navigation Breadcrumb -->
<!-- <div class="container mt-3">
  <nav aria-label="breadcrumb">
    <ol class="breadcrumb">
      <li class="breadcrumb-item"><a href="/" class="text-decoration-none">Home</a></li>
      <li class="breadcrumb-item active" aria-current="page">Sitemap</li>
    </ol>
  </nav>
</div> -->

<div class="container my-5">
  <PageTitle englishTitle="Website Sitemap" kannadaTitle="ವೆಬ್ಸೈಟ್ ನಕ್ಷೆ" />
  <div class="row justify-content-center">
    <div class="col-lg-10">
      <div class="card shadow-sm">
        <div class="card-body p-4">
          <p class="text-muted text-center mb-4">Navigate through all sections of our website</p>
          
          <div class="sitemap-content">
            <!-- Main Pages -->
            <div class="sitemap-section mb-5">
              <h2 class="section-title">Main Pages</h2>
              <div class="row">
                <div class="col-md-6">
                  <ul class="sitemap-list">
                    <li><a href="/" class="sitemap-link">Home</a></li>
                    <li><a href="/about" class="sitemap-link">About Us</a></li>
                    <li><a href="/events" class="sitemap-link">Events</a></li>
                    <li><a href="/gallery" class="sitemap-link">Gallery</a></li>
                  </ul>
                </div>
                <div class="col-md-6">
                  <ul class="sitemap-list">
                    <li><a href="/membership" class="sitemap-link">Membership</a></li>
                    <li><a href="/kannada-kali" class="sitemap-link">Kannada Kali</a></li>
                    <li><a href="/blog" class="sitemap-link">Blog</a></li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Organization Information -->
            <div class="sitemap-section mb-5">
              <h2 class="section-title">Organization Information</h2>
              <div class="row">
                <div class="col-md-6">
                  <ul class="sitemap-list">
                    <li><a href="/constitution" class="sitemap-link">Constitution</a></li>
                    <li><a href="/by-laws" class="sitemap-link">By-Laws</a></li>
                  </ul>
                </div>
                <div class="col-md-6">
                  <ul class="sitemap-list">
                    <li><a href="/terms-of-use" class="sitemap-link">Terms of Use</a></li>
                    <li><a href="/privacy-policy" class="sitemap-link">Privacy Policy</a></li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- User Account -->
            <div class="sitemap-section mb-5">
              <h2 class="section-title">User Account</h2>
              <div class="row">
                <div class="col-md-6">
                  <ul class="sitemap-list">
                    <li><a href="/login" class="sitemap-link">Login</a></li>
                    <!-- <li><a href="/register" class="sitemap-link">Register</a></li> -->
                  </ul>
                </div>
                <div class="col-md-6">
                  <ul class="sitemap-list">
                    <!-- <li><a href="/reset-password" class="sitemap-link">Reset Password</a></li> -->
                  </ul>
                </div>
              </div>
            </div>

            <!-- Administrative -->
            <!-- <div class="sitemap-section mb-5">
              <h2 class="section-title">Administrative</h2>
              <div class="row">
                <div class="col-md-6">
                  <ul class="sitemap-list">
                    <li><a href="/admin" class="sitemap-link">Admin Panel</a></li>
                  </ul>
                </div>
              </div>
            </div> -->

            <!-- Contact Information -->
            <div class="sitemap-section">
              <h2 class="section-title">Contact Information</h2>
              <div class="contact-info">
                <div class="row">
                  <div class="col-md-6">
                    <div class="contact-item">
                      <h5><i class="fas fa-envelope me-2"></i>Email</h5>
                      <p>info@orlandokannadasangha.org</p>
                    </div>
                  </div>
                  <!-- <div class="col-md-6">
                    <div class="contact-item">
                      <h5><i class="fas fa-phone me-2"></i>Phone</h5>
                      <p>(407) 123-4567</p>
                    </div>
                  </div> -->
                </div>
                <div class="row mt-3">
                  <div class="col-md-6">
                    <div class="contact-item">
                      <h5><i class="fas fa-map-marker-alt me-2"></i>Location</h5>
                      <p>Orlando, Florida, United States</p>
                    </div>
                  </div>
                  <!-- <div class="col-md-6">
                    <div class="contact-item">
                      <h5><i class="fas fa-clock me-2"></i>Office Hours</h5>
                      <p>Monday - Friday: 9:00 AM - 5:00 PM</p>
                    </div>
                  </div> -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<Footer />

<style>
  .sitemap-content {
    color: #333;
  }

  .section-title {
    color: #7a1f1f;
    margin-bottom: 1.5rem;
    font-size: 1.8rem;
    font-weight: 600;
    border-bottom: 2px solid #7a1f1f;
    padding-bottom: 0.5rem;
  }

  .sitemap-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .sitemap-list li {
    margin-bottom: 0.8rem;
    padding-left: 1rem;
    position: relative;
  }

  .sitemap-list li::before {
    content: "→";
    color: #7a1f1f;
    font-weight: bold;
    position: absolute;
    left: 0;
  }

  .sitemap-link {
    color: #7a1f1f;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s ease;
  }

  .sitemap-link:hover {
    color: #5a1515;
    text-decoration: underline;
  }

  .contact-info {
    background-color: #f8f9fa;
    padding: 2rem;
    border-radius: 0.5rem;
    border-left: 4px solid #7a1f1f;
  }

  .contact-item h5 {
    color: #7a1f1f;
    margin-bottom: 0.5rem;
    font-size: 1.1rem;
  }

  .contact-item p {
    margin-bottom: 0;
    color: #666;
  }

  .card {
    border: none;
    border-radius: 0.5rem;
  }

  .card-title {
    color: #7a1f1f;
    font-size: 2.5rem;
    font-weight: 600;
  }

  .sitemap-section {
    border-bottom: 1px solid #eee;
    padding-bottom: 2rem;
  }

  .sitemap-section:last-child {
    border-bottom: none;
  }
</style>