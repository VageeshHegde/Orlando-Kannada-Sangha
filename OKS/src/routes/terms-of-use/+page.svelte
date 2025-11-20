<script>
  import Hero from '$lib/components/Hero.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import Navbar from '$lib/components/Navbar.svelte';
  import PageTitle from '$lib/components/PageTitle.svelte';
</script>

<svelte:head>
  <title>Terms of Use - Orlando Kannada Sangha</title>
  <meta name="description" content="Terms of Use for Orlando Kannada Sangha - Learn about the terms and conditions for using our website and services.">
  <meta name="keywords" content="Orlando Kannada Sangha terms of use, OKS terms, terms and conditions, website terms, user agreement" />
</svelte:head>

<Navbar />
<Hero page="Terms of Use" />

<!-- Navigation Breadcrumb -->
<!-- <div class="container mt-3">
  <nav aria-label="breadcrumb">
    <ol class="breadcrumb">
      <li class="breadcrumb-item"><a href="/" class="text-decoration-none">Home</a></li>
      <li class="breadcrumb-item active" aria-current="page">Terms of Use</li>
    </ol>
  </nav>
</div> -->

<div class="container my-5">
  <PageTitle englishTitle="Terms of Use" kannadaTitle="ಬಳಕೆಯ ನಿಯಮಗಳು" />
  <div class="row justify-content-center">
    <div class="col-lg-8">
      <div class="card shadow-sm">
        <div class="card-body p-4">
          <p class="text-muted text-center mb-4">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div class="content">
            <h2>1. Acceptance of Terms</h2>
            <p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.</p>

            <h2>2. Use License</h2>
            <p>Permission is granted to temporarily download one copy of the materials on Orlando Kannada Sangha's website for personal, non-commercial transitory viewing only.</p>

            <h2>3. Disclaimer</h2>
            <p>The materials on Orlando Kannada Sangha's website are provided on an 'as is' basis. Orlando Kannada Sangha makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>

            <h2>4. Limitations</h2>
            <p>In no event shall Orlando Kannada Sangha or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Orlando Kannada Sangha's website, even if Orlando Kannada Sangha or an authorized representative has been notified orally or in writing of the possibility of such damage.</p>

            <h2>5. Accuracy of Materials</h2>
            <p>The materials appearing on Orlando Kannada Sangha's website could include technical, typographical, or photographic errors. Orlando Kannada Sangha does not warrant that any of the materials on its website are accurate, complete, or current.</p>

            <h2>6. Links</h2>
            <p>Orlando Kannada Sangha has not reviewed all of the sites linked to our website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Orlando Kannada Sangha of the site.</p>

            <h2>7. Modifications</h2>
            <p>Orlando Kannada Sangha may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.</p>

            <h2>8. Governing Law</h2>
            <p>These terms and conditions are governed by and construed in accordance with the laws of Florida, United States, and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.</p>

            <h2>9. User Conduct</h2>
            <p>You agree to use our website and services only for lawful purposes and in accordance with these Terms of Use. You agree not to:</p>
            <ul>
              <li>Use the website in any way that violates any applicable federal, state, local, or international law or regulation</li>
              <li>Transmit any material that is defamatory, obscene, indecent, abusive, offensive, harassing, violent, hateful, inflammatory, or otherwise objectionable</li>
              <li>Impersonate any person or entity or misrepresent your identity or affiliation with any person or entity</li>
              <li>Engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the website</li>
            </ul>

            <h2>10. Membership Terms</h2>
            <p>Membership in Orlando Kannada Sangha is subject to approval and compliance with our constitution and by-laws. Members are expected to:</p>
            <ul>
              <li>Maintain current contact information</li>
              <li>Participate in organizational activities</li>
              <li>Adhere to the organization's values and mission</li>
              <li>Pay membership dues as required</li>
            </ul>

            <h2>11. Contact Information</h2>
            <p>If you have any questions about these Terms of Use, please contact us at:</p>
            <ul>
              <li>Email: info@orlandokannadasangha.org</li>
              <li>Address: Orlando, Florida, United States</li>
            </ul>
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