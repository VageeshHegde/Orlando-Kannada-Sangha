<script>
  import Navbar from '$lib/components/Navbar.svelte';
  import Hero from '$lib/components/Hero.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import SimpleEventCard from '$lib/components/SimpleEventCard.svelte';
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import { getSliderImages } from '$lib/services/sliderService.js';
  import { user } from '$lib/stores/auth.js';
  let scrollContent;
  let googleChartsReady = false;
  let cleanupResize;
  let membershipYear = new Date().getFullYear();
  let yearsSinceFounded = new Date().getFullYear() - 2012;
  
  // Slider images from S3
  let sliderImages = [];
  let imagesLoaded = false;

  // Function to load slider images from S3
  async function loadSliderImages() {
    try {
      const result = await getSliderImages();
      
      if (result.success && result.images.length > 0) {
        sliderImages = result.images;
      } else {
        sliderImages = [];
      }
    } catch (error) {
      sliderImages = [];
    } finally {
      imagesLoaded = true;
      // Setup slider after images are loaded
      setTimeout(setupSlider, 100);
    }
  }

  // Setup slider animation and cloning
  function setupSlider() {
    if (!scrollContent) return;
    
    // Wait for images to be rendered
    const images = scrollContent.querySelectorAll('.scroll-image');
    if (images.length === 0) {
      // Retry after a short delay if no images found
      setTimeout(setupSlider, 200);
      return;
    }

    const imageCount = images.length;
    
    // Clone the entire set multiple times for seamless infinite scroll
    for (let i = 0; i < 3; i++) {
      images.forEach(img => {
        const clone = img.cloneNode(true);
        scrollContent.appendChild(clone);
      });
    }

    // Pause animation on hover
    scrollContent.addEventListener('mouseenter', () => {
      scrollContent.style.animationPlayState = 'paused';
    });
    
    scrollContent.addEventListener('mouseleave', () => {
      scrollContent.style.animationPlayState = 'running';
    });
  }


  function scrollImages(direction) {
    if (scrollContent) {
      if (direction === 'left') {
        scrollContent.style.animationDirection = 'reverse';
      } else {
        scrollContent.style.animationDirection = 'normal';
      }
    }
  }

  function loadGoogleCharts() {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') return;
      // Already loaded
      if (window.google && window.google.charts) {
        return resolve();
      }
      const existing = document.querySelector('script[data-google-charts]');
      if (existing) {
        existing.addEventListener('load', () => resolve());
        existing.addEventListener('error', reject);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://www.gstatic.com/charts/loader.js';
      script.async = true;
      script.defer = true;
      script.setAttribute('data-google-charts', 'true');
      script.onload = () => resolve();
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  function initAndDrawGeoChart() {
    if (!document.getElementById('regions_div')) return;
    if (!window.google || !window.google.charts) return;
    window.google.charts.load('current', { packages: ['geochart'] });
    window.google.charts.setOnLoadCallback(() => {
      googleChartsReady = true;
      drawGeoChart();
    });
  }

  function drawGeoChart() {
    const container = document.getElementById('regions_div');
    if (!container || !googleChartsReady) return;

    const rawData = window.google.visualization.arrayToDataTable([
      ['Latitude', 'Longitude', 'City', 'Intensity'],
      [28.5383, -81.3792, '📌 We are here (Orlando Kannada Sangha)', 100]
    ]);

    // Hide the intensity from tooltip
    const view = new window.google.visualization.DataView(rawData);
    view.setColumns([0, 1, 2]);

    const options = {
      region: 'US',
      resolution: 'provinces',
      displayMode: 'markers',
      backgroundColor: '#f5ede1',
      datalessRegionColor: '#ede1cf',
      colorAxis: { colors: ['#ffcccc', '#ff0000'] },
      legend: 'none',
      tooltip: { 
        trigger: 'focus',
        textStyle: { fontSize: 12 },
        showColorCode: false,
        isHtml: true
      }
    };

    const chart = new window.google.visualization.GeoChart(container);
    chart.draw(view, options);

    // Redraw on resize
    const handleResize = () => chart.draw(view, options);
    window.addEventListener('resize', handleResize);
    cleanupResize = () => window.removeEventListener('resize', handleResize);
  }

  onMount(async () => {
    // Load slider images from S3
    await loadSliderImages();
    
    
    // Image scroller setup
    scrollContent = document.querySelector('.scroll-content');

    // Google Charts GeoChart setup
    loadGoogleCharts()
      .then(() => initAndDrawGeoChart())
      .catch(() => {
        // fail silently
      });

    // FullCalendar setup
    const calendarEl = document.getElementById('calendar');
    if (calendarEl && window.FullCalendar) {
      const calendar = new window.FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        height: 550,
        events: [
          {
            title: 'Music Concert',
            start: '2024-03-03'
          },
          {
            title: 'Art Exhibition',
            start: '2024-04-10'
          },
          {
            title: 'Tech Conference',
            start: '2024-05-20'
          }
        ]
      });
      calendar.render();
    }
  });

  onDestroy(() => {
    if (cleanupResize) cleanupResize();
  });
</script>

<Navbar />
<Hero 
  page="Home Page" 
  leftImage="/images/NASA.svg"
  rightImage="/images/Florida.png"
  topLeftImage="/images/OKSlogo.png"
  bottomRightImage="/images/mysore-palace-vector.svg"
/>

<!-- Content Section -->
<main class="container my-5">
  <div class="row">
    <div class="col-12">
      <h1 class="text-center mb-4">Welcome to Orlando Kannada Sangha</h1>
      <h2 class="text-center mb-4" style="font-family: 'Noto Sans Kannada', sans-serif; color: #7a1f1f;">ಒರ್ಲಾಂಡೊ ಕನ್ನಡ ಸಂಘಕ್ಕೆ ಸುಸ್ವಾಗತ</h2>
      
      <!-- Image Scroller Section -->
      <div class="image-scroller my-5">
        <div class="scroll-container">
          <div class="scroll-content" bind:this={scrollContent}>
            {#if imagesLoaded && sliderImages.length > 0}
              {#each sliderImages as image}
                <a 
                  href={image.url} 
                  data-lightbox="gallery" 
                  data-title={image.title}
                >
                  <img 
                    src={image.url} 
                    alt={image.alt} 
                    class="scroll-image"
                    loading="lazy"
                  >
                </a>
              {/each}
            {:else if imagesLoaded}
              <!-- Fallback to local images if S3 images not available -->
              <a href="/images/OKS2.jpg" data-lightbox="gallery" data-title="OKS Event 1">
                <img src="/images/OKS2.jpg" alt="OKS Event 1" class="scroll-image" loading="lazy">
              </a>
              <a href="/images/OKS4.jpeg" data-lightbox="gallery" data-title="OKS Event 2">
                <img src="/images/OKS4.jpeg" alt="OKS Event 2" class="scroll-image" loading="lazy">
              </a>
              <a href="/images/OKS5.jpeg" data-lightbox="gallery" data-title="OKS Event 3">
                <img src="/images/OKS5.jpeg" alt="OKS Event 3" class="scroll-image" loading="lazy">
              </a>
              <a href="/images/OKS6.jpeg" data-lightbox="gallery" data-title="OKS Event 4">
                <img src="/images/OKS6.jpeg" alt="OKS Event 4" class="scroll-image" loading="lazy">
              </a>
              <a href="/images/OKS7.jpeg" data-lightbox="gallery" data-title="OKS Event 5">
                <img src="/images/OKS7.jpeg" alt="OKS Event 5" class="scroll-image" loading="lazy">
              </a>
              <a href="/images/Yakshagana1.png" data-lightbox="gallery" data-title="Yakshagana Performance 1">
                <img src="/images/Yakshagana1.png" alt="Yakshagana Performance 1" class="scroll-image" loading="lazy">
              </a>
              <a href="/images/Yakshagana2.png" data-lightbox="gallery" data-title="Yakshagana Performance 2">
                <img src="/images/Yakshagana2.png" alt="Yakshagana Performance 2" class="scroll-image" loading="lazy">
              </a>
            {:else}
              <!-- Loading state -->
              <div class="loading-state">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Loading images...</p>
              </div>
            {/if}
          </div>
        </div>
        <button class="scroll-button left" on:click={() => scrollImages('left')}><i class="fas fa-chevron-left"></i></button>
        <button class="scroll-button right" on:click={() => scrollImages('right')}><i class="fas fa-chevron-right"></i></button>
      </div>
      
      <div class="row text-center g-4">
        <div class="col-md-4">
          <div class="card-custom">
            <h3><i class="fas fa-house-user icon"></i>Home</h3>
            <p>Welcome to Kannada Sangha, a vibrant community celebrating Karnataka's rich cultural heritage.</p>
            
            <!-- Community Stats -->
            <div class="community-stats">
              <span class="stat-simple"><strong>450+</strong> Community Members</span>
              <br />
              <span class="stat-simple"><strong>380+</strong> Social Media Followers</span>
              <br />
              <span class="stat-simple"><strong>4+</strong> Events per year</span>
              <br />
              <span class="stat-simple"><strong>58</strong> Kannada Kali Students</span>
            </div>
            
            <div class="bottom-content">
              <div class="sponsorship-note mt-2">
                <p>Contact us today about sponsorship opportunities!<br>
                  <a href="mailto:suddhi@orlandokannadasangha.org" class="sponsor-email">
                    <i class="fas fa-envelope me-2"></i>suddhi@orlandokannadasangha.org
                  </a>
                </p>
              </div>
              <div id="regions_div" class="mt-4" style="width: 100%; height: 210px;"></div>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card-custom">
            <h3><i class="fas fa-address-card icon"></i>About Us</h3>
            <p>Orlando Kannada Sangha or OKS was formally registered as an organization in the year 2012. Although we have had a Kannada group and have been organizing activities since more than 20 years, we had not formally registered as an organization until 2012.</p>
            <p>Orlando Kannada Sangha is an association for people that hail from the Karnataka state of India, and those who can speak the Kannada language. Its primary goal is to provide a platform for Kannada speaking people to meet, socialize and promote their cultural and social heritage to the next generation of Kannadiga's living in US.</p>
            <p class="years-old-text">We are <strong>{yearsSinceFounded} years old</strong> and growing stronger every year!</p>
            <div class="bottom-content">
              <div class="mt-2">
                <a href="/about" class="btn btn-sm btn-outline-primary">Read more <i class="fas fa-arrow-right ms-1"></i></a>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-4" id="donate">
          <div class="card-custom">
            <h3><i class="fas fa-hand-holding-heart icon"></i>Donate</h3>
            <p>Orlando Kannada Sangha is a 501 c(3) registered non-profit striving to conduct as many activities as possible for the Kannadigas in Orlando, especially for the kids and youth of our community giving them opportunities to excel. Your support in the form of donation or sponsorships, however, small will go a really long way. We look forward to your continuous support.</p>
            <div class="donate-options mt-3">
              <div class="row align-items-center justify-content-center">
                <div class="col-6">
                  <a href="https://www.zeffy.com/en-US/donation-form/e9e95cc9-b449-49eb-85c8-cf5efa4a712e" target="_blank" class="btn btn-primary donate-btn">
                    <i class="fas fa-heart me-2"></i>Donate Now
                  </a>
                </div>
                <div class="col-6">
                  <div class="qr-placeholder">
                    <img src="/images/DonateQR.png" alt="Donate QR Code" style="width: 100%; max-width: 250px; height: auto;">
                  </div>
                </div>
              </div>
              <div class="mt-3 text-center">
                <p class="small text-muted mb-2">Or you can download the Donation Form below and email it to:</p>
                <a href="mailto:boardmember@orlandokannadasangha.org" class="sponsor-email">
                  <i class="fas fa-envelope me-2"></i>boardmember@orlandokannadasangha.org
                </a>
              </div>
              <div class="bottom-content">
              <div class="mt-3 text-center">
                <a href="/documents/DonationForm.pdf" target="_blank" class="btn btn-outline-primary btn-sm">
                  <i class="fas fa-download me-2"></i>Download Donation Form
                </a>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</main>

<!-- Membership Section -->
<section class="section container py-4 membership-section my-3">
  <h3 class="text-center mb-4"><i class="fas fa-address-card icon"></i>Membership</h3>
  <div class="row g-4">
    <!-- Benefits Column -->
    <div class="col-md-4">
      <div class="membership-card">
        <h5><i class="fas fa-gift icon"></i>Membership Benefits</h5>
        <ul class="benefits-list">
          <li><i class="fas fa-check"></i> Discounts on All Events</li>
          <li><i class="fas fa-check"></i> Ugadi Picnic, Youth Conference, and some competitions</li>
          <li><i class="fas fa-check"></i> Voting Rights for Board</li>
          <li><i class="fas fa-check"></i> Discounted Fees for Programs including Kannada Kali</li>
          <li><i class="fas fa-check"></i> Youth Conference Admission</li>
          <li><i class="fas fa-check"></i> Discounted Cultural Classes</li>
          <li><i class="fas fa-check"></i> Online Event Participations</li>
        </ul>
      </div>
    </div>

    <!-- Pricing Column -->
    <div class="col-md-4">
      <div class="membership-card">
        <h5><i class="fas fa-tags icon"></i>Annual Membership <span>{membershipYear}</span></h5>
        <div class="pricing-options">
          <div class="price-card">
            <div class="price-header">Family</div>
            <div class="price-amount">$35</div>
            <div class="price-period">per Family</div>
          </div>
          <div class="price-card mt-3">
            <div class="price-header">Individual</div>
            <div class="price-amount">$20</div>
            <div class="price-period">per Individual</div>
          </div>
        </div>
        <h5 class="mt-3"><i class="fas fa-infinity icon"></i>Life Time Membership</h5>
        <div class="price-card">
          <div class="price-header">Family</div>
          <div class="price-amount">$500</div>
          <div class="price-period">per Family (Husband-Wife and their Kid)</div>
        </div>
      </div>
    </div>

    <!-- Payment Column -->
    <div class="col-md-4">
      <div class="membership-card">
        <h5><i class="fas fa-credit-card icon"></i>Payment Options</h5>
        <div class="payment-options">
          <a href="https://www.zeffy.com/en-US/ticketing/d0cea646-0ac3-449b-8687-153653b0dc10" target="_blank" class="btn btn-primary membership-btn mb-4">
            <i class="fas fa-shopping-cart me-2"></i>Membership Payment
          </a>
          <div class="qr-section">
            <p class="text-center mb-3">Or scan QR code</p>
            <div class="qr-placeholder">
              <img src="/images/MembershipQR.png" alt="Membership QR Code" style="width: 100%; max-width: 120px; height: auto;">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Constitution Section -->
<section class="section container py-4 my-3">
  <h3 class="text-center mb-4"><i class="fas fa-scroll icon"></i>Constitution and By-Laws</h3>
  <div class="row">
    <div class="col-md-8">
      <div class="bylaws-content">
        <div class="alert alert-info" role="alert">
          <i class="fas fa-info-circle me-2"></i>
          Our Article of Incorporation was recently amended by OKS Board of Directors to include Dissolution clause necessary for 501c non-profit organizations.
        </div>
        <p class="text-left mb-4">Please click below to view the Orlando Kannada Sangha Constitution and By-laws:</p>
        <div class="document-links">
          <a href="/constitution" class="btn btn-outline-primary me-3">
            <i class="fas fa-file-pdf me-2"></i>Constitution
          </a>
          <a href="/by-laws" class="btn btn-outline-primary">
            <i class="fas fa-file-pdf me-2"></i>By-Laws
          </a>
        </div>
      </div>
    </div>
    <div class="col-md-4">
      <div class="flag-container">
        <div class="flag-top"></div>
        <div class="flag-bottom"></div>
      </div>
    </div>
  </div>
</section>

<!-- Upcoming Events Section -->
<section class="section container py-4">
  <h3 class="text-center mb-4"><i class="fas fa-calendar-alt icon"></i>Upcoming Events</h3>
  <div class="row g-4">
    <!-- Full Calendar Section -->
    <div class="col-md-6">
      <div id='calendar'></div>
    </div>

    <div class="col-md-6">
      <div class="events-container">
        <SimpleEventCard 
          month="NOV"
          day="1"
          title="Music Concert"
          date="November 1, 2025"
          location="123 Main St, Anytown, CA"
          imageSrc="https://picsum.photos/150/100?random=1"
          imageAlt="Music Concert"
          mapLink="https://maps.google.com/?q=123+Main+St+Anytown+CA"
          memberFormUrl="https://www.zeffy.com/embed/ticketing/kannada-rajyotsava-2025draft"
          nonMemberFormUrl="https://www.zeffy.com/embed/ticketing/kannada-rajyotsava-2025nonmemberdraft"
        />

        <SimpleEventCard 
          month="APR"
          day="10"
          title="Art Exhibition"
          date="April 10, 2024"
          location="456 Elm St, Othertown, NY"
          imageSrc="https://picsum.photos/150/100?random=2"
          imageAlt="Art Exhibition"
          mapLink="https://maps.google.com/?q=456+Elm+St+Othertown+NY"
          memberFormUrl=""
          nonMemberFormUrl=""
        />

        <SimpleEventCard 
          month="NOV"
          day="15"
          title="Kannada Rajyotsava"
          date="November 15, 2024"
          location="Orlando Convention Center"
          imageSrc="https://picsum.photos/150/100?random=3"
          imageAlt="Kannada Rajyotsava"
          mapLink="https://maps.google.com/?q=Orlando+Convention+Center"
          memberFormUrl=""
          nonMemberFormUrl=""
        />

        <SimpleEventCard 
          month="DEC"
          day="31"
          title="New Year Celebration"
          date="December 31, 2024"
          location="Community Center Orlando"
          imageSrc="https://picsum.photos/150/100?random=4"
          imageAlt="New Year Celebration"
          mapLink="https://maps.google.com/?q=Community+Center+Orlando"
          memberFormUrl=""
          nonMemberFormUrl=""
        />
      </div>
    </div>
  </div>
</section>

<!-- Sponsors Section -->
<section class="section container py-4 mt-3">
  <h3 class="text-center mb-4"><i class="fas fa-handshake icon"></i>Our Sponsors</h3>
  <div class="row g-4 justify-content-center">
    <div class="col-lg-3 col-md-4 col-sm-6">
      <a href="#" class="sponsor-card-link">
        <div class="sponsor-card">
          <div class="sponsor-image">
            <img src="/images/OKSlogo.png" alt="Gold Sponsor" class="sponsor-img">
          </div>
          <div class="sponsor-info">
            <h5 class="sponsor-name">Gold Sponsor</h5>
            <p class="sponsor-category">Platinum Level</p>
          </div>
        </div>
      </a>
    </div>
    <div class="col-lg-3 col-md-4 col-sm-6">
      <a href="#" class="sponsor-card-link">
        <div class="sponsor-card">
          <div class="sponsor-image">
            <img src="/images/Kannada-Academy.png" alt="Silver Sponsor" class="sponsor-img">
          </div>
          <div class="sponsor-info">
            <h5 class="sponsor-name">Silver Sponsor</h5>
            <p class="sponsor-category">Gold Level</p>
          </div>
        </div>
      </a>
    </div>
    <div class="col-lg-3 col-md-4 col-sm-6">
      <a href="#" class="sponsor-card-link">
        <div class="sponsor-card">
          <div class="sponsor-image">
            <img src="/images/Florida.png" alt="Bronze Sponsor" class="sponsor-img">
          </div>
          <div class="sponsor-info">
            <h5 class="sponsor-name">Bronze Sponsor</h5>
            <p class="sponsor-category">Silver Level</p>
          </div>
        </div>
      </a>
    </div>
    <div class="col-lg-3 col-md-4 col-sm-6">
      <a href="#" class="sponsor-card-link">
        <div class="sponsor-card">
          <div class="sponsor-image">
            <img src="/images/Yakshagana2.png" alt="Community Sponsor" class="sponsor-img">
          </div>
          <div class="sponsor-info">
            <h5 class="sponsor-name">Community Sponsor</h5>
            <p class="sponsor-category">Bronze Level</p>
          </div>
        </div>
      </a>
    </div>
  </div>
  
  <!-- Become a Sponsor Section -->
  <div class="row mt-5">
    <div class="col-12 text-center">
      <div class="become-sponsor-section">
        <h4 class="mb-3">Become a Sponsor</h4>
        <p class="mb-4">Support our community and help us continue promoting Kannada culture in Orlando. Contact us to learn about sponsorship opportunities.</p>
        <p class="mb-3">Click the email below to contact us for sponsorship opportunities:</p>
        <a href="mailto:suddhi@orlandokannadasangha.org" class="sponsor-email-display">
          <i class="fas fa-envelope me-2"></i>
          <span class="email-text">suddhi@orlandokannadasangha.org</span>
        </a>
        
        <div class="sponsor-divider"></div>
        
        <div class="thank-you-sponsors-content">
          <h5 class="mb-0">
            <i class="fas fa-heart me-2" style="color: #7a1f1f;"></i>
            Thanks to All Our Amazing Sponsors
          </h5>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  /* Compact the membership section heights slightly */
  .membership-section .membership-card h5 {
    margin-bottom: 0.75rem;
    padding-bottom: 0.5rem;
    text-align: center;
  }
  .membership-section .pricing-options {
    gap: 0.75rem;
  }
  .membership-section .price-card {
    padding: 0.75rem;
  }
  .membership-section .price-amount {
    font-size: 1.75rem;
    margin-bottom: 0.25rem;
  }
  .membership-section .price-header {
    margin-bottom: 0.5rem;
  }

  /* Lightbox customizations */
  .scroll-image {
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .scroll-image:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  /* Ensure Lightbox works with our sliding container */
  .scroll-content a {
    text-decoration: none;
    display: inline-block;
  }

  /* Image Scroller Animation */
  .scroll-content {
    animation: scroll 70s linear infinite;
  }

  .scroll-content:hover {
    animation-play-state: paused;
  }

  @keyframes scroll {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-50%);
    }
  }

  /* Loading state for image slider */
  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 200px;
    width: 100%;
    color: #6c757d;
  }

  .loading-state i {
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  .loading-state p {
    margin: 0;
    font-size: 0.9rem;
  }

  /* Email wrapping (not used; kept for reference) */
  
  /* Flag styling - combined and optimized */
  .flag-container {
    height: 100%;
    min-height: 50px;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    margin-right: 1.5rem;
  }

  .flag-top {
    height: 50%;
    background-color: #FFFF00;
  }

  .flag-bottom {
    height: 50%;
    background-color: #FF0000;
  }
  
  @media (max-width: 768px) {
    .flag-container {
      margin-right: 0;
    }
  }

  /* Sponsors Section Styles */
  .sponsor-card-link {
    display: block;
    text-decoration: none;
    color: inherit;
    transition: all 0.3s ease;
  }

  .sponsor-card-link:hover {
    text-decoration: none;
    color: inherit;
  }

  .sponsor-card {
    background: #fff;
    border-radius: 15px;
    padding: 1.5rem;
    text-align: center;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    border: 2px solid transparent;
    height: 100%;
  }

  .sponsor-card-link:hover .sponsor-card {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(122, 31, 31, 0.2);
    border-color: #f26c4f;
  }

  .sponsor-image {
    width: 80px;
    height: 80px;
    margin: 0 auto 1rem;
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #fff2e2 0%, #f0d9b5 100%);
    border: 2px solid #f26c4f;
  }

  .sponsor-img {
    width: 60px;
    height: 60px;
    object-fit: contain;
    border-radius: 50%;
    transition: filter 0.3s ease;
  }

  .sponsor-card-link:hover .sponsor-img {
    filter: brightness(1.1);
  }

  .sponsor-name {
    font-size: 1.1rem;
    font-weight: 700;
    color: #7a1f1f;
    margin-bottom: 0.5rem;
  }

  .sponsor-category {
    font-size: 0.9rem;
    color: #f26c4f;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin: 0;
  }

  .become-sponsor-section {
    background: #fff;
    border-radius: 15px;
    padding: 2rem;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
    border: 2px solid #f26c4f;
  }

  .become-sponsor-section h4 {
    color: #7a1f1f;
    font-weight: 700;
  }

  .become-sponsor-section p {
    color: #666;
    font-size: 1.1rem;
    line-height: 1.6;
  }
  
  .sponsor-divider {
    height: 2px;
    background: linear-gradient(90deg, transparent, #7a1f1f, transparent);
    margin: 2rem 0;
    border-radius: 1px;
  }
  
  .thank-you-sponsors-content h5 {
    color: #7a1f1f;
    font-weight: 600;
    font-size: 1.3rem;
  }
  
  .thank-you-sponsors-content p {
    color: #555;
    font-size: 1rem;
    line-height: 1.6;
    margin-bottom: 1rem;
  }
  
  .thank-you-sponsors-content .fas.fa-heart {
    animation: heartbeat 2s ease-in-out infinite;
  }
  
  @keyframes heartbeat {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }

  .sponsor-email-display {
    display: inline-flex;
    align-items: center;
    font-size: 1.1rem;
    color: #7a1f1f;
    text-decoration: none;
    font-weight: 400;
    word-break: break-all;
    flex-wrap: wrap;
    justify-content: center;
  }

  .sponsor-email-display:hover {
    font-weight: bold;
    color: #5a1515;
  }
  
  .sponsor-email-display:hover .email-text {
    font-weight: 700;
    color: #3a0f0f;
  }

  .email-text {
    font-family: 'Courier New', monospace;
    letter-spacing: 0.5px;
    font-weight: 400;
    color: #5a1515;
    word-break: break-all;
    line-height: 1.4;
  }

  @media (max-width: 768px) {
    .sponsor-card {
      padding: 1rem;
    }
    
    .sponsor-image {
      width: 60px;
      height: 60px;
    }
    
    .sponsor-img {
      width: 45px;
      height: 45px;
    }
    
    .sponsor-name {
      font-size: 1rem;
    }
    
    .sponsor-category {
      font-size: 0.8rem;
    }
    
    .become-sponsor-section {
      padding: 1.5rem;
    }
    
    .sponsor-email-display {
      font-size: 1rem;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .email-text {
      font-size: 0.9rem;
      text-align: center;
      word-break: break-all;
      line-height: 1.3;
    }
  }
  
  @media (max-width: 480px) {
    .sponsor-email-display {
      font-size: 0.9rem;
    }
    
    .email-text {
      font-size: 0.8rem;
      word-break: break-all;
      overflow-wrap: break-word;
      hyphens: auto;
    }
    
    .become-sponsor-section {
      padding: 1rem;
    }
    
    .become-sponsor-section p {
      font-size: 1rem;
    }
  }

  /* Loading state for slider */
  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #666;
    font-size: 1.2rem;
  }

  .loading-state i {
    font-size: 2rem;
    margin-bottom: 1rem;
    color: #7a1f1f;
  }

  .loading-state p {
    margin: 0;
    font-weight: 500;
  }
</style>

<Footer />

