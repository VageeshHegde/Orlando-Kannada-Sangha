<script>
  import Hero from '$lib/components/Hero.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import Navbar from '$lib/components/Navbar.svelte';
  import PageTitle from '$lib/components/PageTitle.svelte';
</script>

<svelte:head>
  <title>Privacy Policy - Orlando Kannada Sangha</title>
  <meta name="description" content="Privacy Policy for Orlando Kannada Sangha - Learn how we collect, use, and protect your personal information.">
</svelte:head>

<Navbar />
<Hero page="Privacy Policy" />

<!-- Navigation Breadcrumb -->
<!-- <div class="container mt-3">
  <nav aria-label="breadcrumb">
    <ol class="breadcrumb">
      <li class="breadcrumb-item"><a href="/" class="text-decoration-none">Home</a></li>
      <li class="breadcrumb-item active" aria-current="page">Privacy Policy</li>
    </ol>
  </nav>
</div> -->

<div class="container my-5">
  <PageTitle englishTitle="Privacy Policy" kannadaTitle="ಗೌಪ್ಯತೆ ನೀತಿ" />
  <div class="row justify-content-center">
    <div class="col-lg-8">
      <div class="card shadow-sm">
        <div class="card-body p-4">
          <p class="text-muted text-center mb-4">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div class="content">
            <h2>1. Information We Collect</h2>
            <p>We collect information you provide directly to us, such as when you:</p>
            <ul>
              <li>Create an account</li>
              <li>Register for membership</li>
              <li>Contact us</li>
              <li>Participate in our events</li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide and maintain our services</li>
              <li>Process membership applications</li>
              <li>Send you important updates about our organization</li>
              <li>Organize and manage events</li>
              <li>Improve our website and services</li>
            </ul>

            <h2>3. Information Sharing</h2>
            <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except:</p>
            <ul>
              <li>To comply with legal obligations</li>
              <li>To protect our rights and safety</li>
              <li>With your explicit consent</li>
            </ul>

            <h2>4. Data Security</h2>
            <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>

            <h2>5. Cookies</h2>
            <p>Our website may use cookies to enhance your browsing experience. You can choose to disable cookies through your browser settings.</p>

            <h2>6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Opt-out of communications</li>
            </ul>

            <h2>7. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at:</p>
            <ul>
              <li>Email: info@orlandokannadasangha.org</li>
            </ul>

            <h2>8. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<Footer />

<style>
  .content h2 {
    color: #7a1f1f;
    margin-top: 2rem;
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }

  .content p {
    margin-bottom: 1rem;
    line-height: 1.6;
  }

  .content ul {
    margin-bottom: 1rem;
    padding-left: 1.5rem;
  }

  .content li {
    margin-bottom: 0.5rem;
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
</style>