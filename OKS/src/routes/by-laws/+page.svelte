<script>
  import Hero from '$lib/components/Hero.svelte';
  import Navbar from '$lib/components/Navbar.svelte';
  import Footer from '$lib/components/Footer.svelte';
</script>

<svelte:head>
  <title>By-Laws - Orlando Kannada Sangha</title>
  <meta name="description" content="By-Laws of Orlando Kannada Sangha - A not-for-profit 501(c)(3) organization promoting Kannada culture in Orlando." />
</svelte:head>

<Navbar />
<Hero page="By-Laws" />

<!-- By-Laws Content -->
<main class="container my-5">
  <div class="row">
    <div class="col-12">
      <h1 class="text-center mb-4">By-Laws</h1>
      <h2 class="kannada-title text-center mb-4">ನಿಯಮಗಳು</h2>
      
      <div class="row">
        <div class="col-lg-8 mx-auto">
          <div class="card shadow-sm">
            <div class="card-body p-4">
              <h2 class="card-title text-center mb-4">
                <i class="fas fa-book-open me-2 text-warning"></i>
                By-Laws of Orlando Kannada Sangha
              </h2>
            
            <div class="bylaws-content">
              <div class="alert alert-info">
                <i class="fas fa-info-circle me-2"></i>
                <strong>Note:</strong> This is a placeholder for the official by-laws document. 
                The actual by-laws will be uploaded here once finalized.
              </div>
              
              <h3 class="mt-4 mb-3">Article I: Name and Purpose</h3>
              <p class="text-muted">
                [By-laws content will be added here]
              </p>
              
              <h3 class="mt-4 mb-3">Article II: Membership</h3>
              <p class="text-muted">
                [Membership details will be added here]
              </p>
              
              <h3 class="mt-4 mb-3">Article III: Board of Directors</h3>
              <p class="text-muted">
                [Board structure details will be added here]
              </p>
              
              <h3 class="mt-4 mb-3">Article IV: Meetings</h3>
              <p class="text-muted">
                [Meeting procedures will be added here]
              </p>
              
              <h3 class="mt-4 mb-3">Article V: Amendments</h3>
              <p class="text-muted">
                [Amendment procedures will be added here]
              </p>
            </div>
            
            <div class="text-center mt-4">
              <button class="btn btn-primary">
                <i class="fas fa-download me-2"></i>
                Download By-Laws (PDF)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</main>

<style>
  .kannada-title {
    font-family: 'Noto Sans Kannada', sans-serif;
    color: #7a1f1f;
  }
  
  .bylaws-content h3 {
    color: #7a1f1f;
    font-weight: 600;
    border-bottom: 2px solid #f26c4f;
    padding-bottom: 0.5rem;
  }
  
  .bylaws-content p {
    line-height: 1.6;
  }
  
  .card {
    border: none;
    border-radius: 12px;
  }
  
  .card-title {
    color: #7a1f1f;
    font-weight: 600;
  }
  
  .alert {
    border-radius: 8px;
    border: none;
  }
  
  .btn-primary {
    background-color: #7a1f1f;
    border-color: #7a1f1f;
    border-radius: 8px;
    padding: 0.75rem 1.5rem;
    font-weight: 500;
    transition: all 0.3s ease;
  }
  
  .btn-primary:hover {
    background-color: #8a4b4b;
    border-color: #8a4b4b;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(122, 31, 31, 0.3);
  }
</style>

<Footer />