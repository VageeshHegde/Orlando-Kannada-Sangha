<script>
  import Navbar from '$lib/components/Navbar.svelte';
  import Hero from '$lib/components/Hero.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import SimpleEventCard from '$lib/components/SimpleEventCard.svelte';
  import MemberSlider from '$lib/components/MemberSlider.svelte';
  import PageTitle from '$lib/components/PageTitle.svelte';
  import MasonryGallery from '$lib/components/MasonryGallery.svelte';
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import { getSliderImages } from '$lib/services/sliderService.js';
  import { getUpcomingEvents, formatEventDate } from '$lib/services/eventsService.js';
  import { user } from '$lib/stores/auth.js';
  import { supabase } from '$lib/supabase.js';
  import { getMemberInitial, getAvatarColor } from '$lib/utils/avatarUtils.js';
  let scrollContent;
  let googleChartsReady = false;
  let cleanupResize;
  let membershipYear = 2026;
  let yearsSinceFounded = new Date().getFullYear() - 2012;
  
  // Event images from Supabase Storage
  let eventImages = {};
  let eventImagesLoaded = false;
  
  // Events from database
  let events = [];
  let eventsLoaded = false;

  // Reactive statement to reinitialize lightbox when images are loaded
  $: if (eventImagesLoaded && window.lightbox) {
    setTimeout(() => {
      if (window.lightbox) {
        window.lightbox.init();
      }
    }, 100);
  }
  
  // Slider images from S3
  let sliderImages = [];
  let imagesLoaded = false;

  // Reactive statement to reinitialize lightbox when slider images are loaded
  $: if (imagesLoaded && window.lightbox) {
    setTimeout(() => {
      if (window.lightbox) {
        window.lightbox.init();
        // Add click handlers to ensure lightbox works
        document.querySelectorAll('a[data-lightbox="gallery"]').forEach(link => {
          link.addEventListener('click', (e) => {
            e.preventDefault();
            if (window.lightbox) {
              window.lightbox.start(link);
            }
          });
        });
      }
    }, 100);
  }
  
  // Membership QR code from S3
  let membershipQRImage = '';
  let membershipQRLoaded = false;

  // Lifetime members data
  let lifetimeMembers = [];
  let lifetimeMembersLoading = false;
  let lifetimeMembersError = '';
  let lifetimeMemberImages = {};
  let lifetimeMemberImagesLoaded = false;
  let lifetimeMembersCount = 0;
  let activeMembersCount = 0;

  // Sponsors data
  let sponsors = [];
  let sponsorsLoading = false;
  let sponsorsError = '';
  let sponsorImages = {};
  let sponsorImagesLoaded = false;
  
  // Transform sponsors data for MasonryGallery component
  $: sponsorGalleryItems = sponsors.map(sponsor => ({
    url: sponsorImages[sponsor.id] || (sponsor.logo_file ? `/images/sponsors/${sponsor.logo_file}` : null),
    alt: sponsor.company,
    subtitle: sponsor.name,
    link: sponsor.website || null,
    // Store original sponsor data for fallback
    _sponsor: sponsor
  }));

  // Auto-popup functionality
  let autoShowPopup = false;

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

  // Function to load event images from Supabase Storage
  async function loadEventImages() {
    try {
      // Define event image files (you can customize these names)
      const eventImageFiles = {
        'kannada-rajyotsava': 'Yashwant.png',
        'art-exhibition': 'art-exhibition.jpg',
        'music-concert': 'music-concert.jpg',
        'cultural-program': 'cultural-program.jpg'
      };
      
      // Load images from events folder in OKS bucket
      for (const [eventKey, fileName] of Object.entries(eventImageFiles)) {
        try {
          const { data: signedUrlData, error: signedUrlError } = await supabase.storage
            .from('OKS')
            .createSignedUrl(`events/${fileName}`, 3600); // 1 hour expiration
          
          if (signedUrlError) {
            // Fallback to placeholder
            eventImages[eventKey] = `https://picsum.photos/150/100?random=${Math.floor(Math.random() * 100)}`;
          } else {
            eventImages[eventKey] = signedUrlData.signedUrl;
          }
        } catch (error) {
          eventImages[eventKey] = `https://picsum.photos/150/100?random=${Math.floor(Math.random() * 100)}`;
        }
      }
      
      eventImagesLoaded = true;
      
    } catch (error) {
      eventImagesLoaded = true;
    }
  }

  // Function to load membership QR code from S3
  async function loadMembershipQRImage() {
    try {
      const { data: signedUrlData, error: signedUrlError } = await supabase.storage
        .from('OKS')
        .createSignedUrl('qr-codes/MembershipQR.png', 3600); // 1 hour expiration
      
      if (signedUrlError) {
        // Fallback to local image
        membershipQRImage = '/images/MembershipQR.png';
      } else {
        membershipQRImage = signedUrlData.signedUrl;
      }
    } catch (error) {
      // Fallback to local image
      membershipQRImage = '/images/MembershipQR.png';
    } finally {
      membershipQRLoaded = true;
    }
  }

  // Function to load lifetime members from database
  async function loadLifetimeMembers() {
    try {
      lifetimeMembersLoading = true;
      lifetimeMembersError = '';

      const response = await fetch('/api/lifetime-members');
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`Failed to fetch lifetime members: ${response.status}`);
      }

      const data = await response.json();
      lifetimeMembers = data.members || [];
      lifetimeMembersCount = (typeof data.total === 'number') ? data.total : lifetimeMembers.length;

      // Load images after getting members data
      if (lifetimeMembers.length > 0) {
        await loadLifetimeMemberImages();
      }

    } catch (error) {
      console.error('Error loading lifetime members:', error);
      lifetimeMembersError = `Failed to load lifetime members: ${error.message}`;
      // Fallback to empty array
      lifetimeMembers = [];
    } finally {
      lifetimeMembersLoading = false;
    }
  }

  // Function to load lifetime member images from S3
  async function loadLifetimeMemberImages() {
    try {
      // Only process members that have image files
      const membersWithImages = lifetimeMembers.filter(member => member.image_file);
      
      const imagePromises = membersWithImages.map(async (member) => {
        try {
          const { data: signedUrlData, error: signedUrlError } = await supabase.storage
            .from('OKS')
            .createSignedUrl(`lifetime_members/${member.image_file}`, 3600);
          
          if (signedUrlError) {
            return {
              id: member.id,
              url: null,
              success: false
            };
          }
          
          return {
            id: member.id,
            url: signedUrlData.signedUrl,
            success: true
          };
        } catch (error) {
          return {
            id: member.id,
            url: null,
            success: false
          };
        }
      });
      
      const imageResults = await Promise.all(imagePromises);
      
      lifetimeMemberImages = imageResults.reduce((acc, result) => {
        acc[result.id] = result.url;
        return acc;
      }, {});
      
      lifetimeMemberImagesLoaded = true;
      
    } catch (error) {
      lifetimeMemberImages = {};
      lifetimeMemberImagesLoaded = true;
    }
  }

  // Function to load sponsors from database
  async function loadSponsors() {
    try {
      sponsorsLoading = true;
      sponsorsError = '';

      const response = await fetch('/api/sponsors');
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`Failed to fetch sponsors: ${response.status}`);
      }

      const data = await response.json();
      sponsors = data.sponsors || [];

      // Load images after getting sponsors data
      if (sponsors.length > 0) {
        await loadSponsorImages();
      }

    } catch (error) {
      console.error('Error loading sponsors:', error);
      sponsorsError = `Failed to load sponsors: ${error.message}`;
      // Fallback to empty array
      sponsors = [];
    } finally {
      sponsorsLoading = false;
    }
  }

  // Function to load sponsor images from S3
  async function loadSponsorImages() {
    try {
      // Only process sponsors that have logo files
      const sponsorsWithLogos = sponsors.filter(sponsor => sponsor.logo_file);
      
      const imagePromises = sponsorsWithLogos.map(async (sponsor) => {
        try {
          const { data: signedUrlData, error: signedUrlError } = await supabase.storage
            .from('OKS')
            .createSignedUrl(`sponsors/${sponsor.logo_file}`, 3600);
          
          if (signedUrlError) {
            return {
              id: sponsor.id,
              url: null,
              success: false
            };
          }
          
          return {
            id: sponsor.id,
            url: signedUrlData.signedUrl,
            success: true
          };
        } catch (error) {
          return {
            id: sponsor.id,
            url: null,
            success: false
          };
        }
      });
      
      const imageResults = await Promise.all(imagePromises);
      
      sponsorImages = imageResults.reduce((acc, result) => {
        acc[result.id] = result.url;
        return acc;
      }, {});
      
      sponsorImagesLoaded = true;
      
    } catch (error) {
      console.error('Error loading sponsor images:', error);
      sponsorImages = {};
      sponsorImagesLoaded = true;
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

  // Load events from database
  async function loadEvents() {
    try {
      const result = await getUpcomingEvents();
      if (result.success) {
        events = result.events;
      } else {
        console.error('Failed to load events:', result.error);
        events = [];
      }
    } catch (error) {
      console.error('Exception loading events:', error);
      events = [];
    } finally {
      eventsLoaded = true;
    }
  }

  onMount(async () => {
    // Load events from database
    await loadEvents();
    
    // Load slider images from S3
    await loadSliderImages();
    
    // Load event images from S3
    await loadEventImages();
    
    // Load membership QR code from S3
    await loadMembershipQRImage();
    
    // Load lifetime members from database
    await loadLifetimeMembers();
    
    // Load sponsors from database
    await loadSponsors();

    // Load active members count
    await loadActiveMembersCount();
    
    // Image scroller setup
    scrollContent = document.querySelector('.scroll-content');

    // Initialize lightbox after images are loaded
    if (window.lightbox) {
      window.lightbox.option({
        'resizeDuration': 200,
        'wrapAround': true,
        'showImageNumberLabel': true,
        'albumLabel': 'Image %1 of %2'
      });
      
      // Reinitialize lightbox to bind to new images
      setTimeout(() => {
        if (window.lightbox) {
          window.lightbox.init();
        }
      }, 100);
    }

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
            title: 'Kannada Rajyotsava',
            start: '2025-11-01',
            // backgroundColor: '#7a1f1f',
            // borderColor: '#7a1f1f',
            // textColor: 'white'
          },
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

    // Auto-show event popup if any event has show_popup flag set (only once per browser tab)
    const popupShown = sessionStorage.getItem('oks-popup-shown');
    
    if (!popupShown && events.length > 0) {
      // Check if any event has show_popup flag
      const eventWithPopup = events.find(event => event.show_popup === true);
      
      if (eventWithPopup) {
        setTimeout(() => {
          autoShowPopup = true;
          // Mark popup as shown for this browser tab
          sessionStorage.setItem('oks-popup-shown', 'true');
        }, 500); // Show popup after 500 milliseconds
      }
    }
  });

  onDestroy(() => {
    if (cleanupResize) cleanupResize();
  });

  async function loadActiveMembersCount() {
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get_member_count' })
      });
      if (response.ok) {
        const data = await response.json();
        activeMembersCount = data.confirmedUsers || 0;
      } else {
        activeMembersCount = 0;
      }
    } catch (error) {
      activeMembersCount = 0;
    }
  }
</script>

<svelte:head>
  <title>Home - Orlando Kannada Sangha</title>
  <meta name="description" content="Orlando Kannada Sangha - A vibrant non-profit organization dedicated to preserving and promoting Kannada culture in central Florida." />
  <meta name="keywords" content="Orlando Kannada Sangha, OKS, Kannada culture, Karnataka, Indian community Orlando, Kannadiga, cultural events, non-profit organization, Florida Kannada, Kannada association" />
</svelte:head>

<Navbar />
<Hero 
  page="Home" 
  leftImage="/images/Hampi.png"
  rightImage="/images/Florida.png"
  topLeftImage="/images/OKSlogo.png"
  bottomRightImage="/images/mysore-palace-vector.svg"
/>

<!-- Content Section -->
<main class="container my-5">
  <div class="row">
    <div class="col-12">
      <PageTitle englishTitle="Welcome to Orlando Kannada Sangha" kannadaTitle="ಒರ್ಲಾಂಡೊ ಕನ್ನಡ ಸಂಘಕ್ಕೆ ಸುಸ್ವಾಗತ" />
      
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
              <!-- <a href="/images/Yakshagana1.png" data-lightbox="gallery" data-title="Yakshagana Performance 1">
                <img src="/images/Yakshagana1.png" alt="Yakshagana Performance 1" class="scroll-image" loading="lazy">
              </a>
              <a href="/images/Yakshagana2.png" data-lightbox="gallery" data-title="Yakshagana Performance 2">
                <img src="/images/Yakshagana2.png" alt="Yakshagana Performance 2" class="scroll-image" loading="lazy">
              </a> -->
            {:else}
              <!-- Loading state -->
              <div class="loading-state">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Loading images...</p>
              </div>
            {/if}
          </div>
        </div>
		<!-- <button class="scroll-button left" on:click={() => scrollImages('left')}><i class="fas fa-chevron-left"></i></button>
		<button class="scroll-button right" on:click={() => scrollImages('right')}><i class="fas fa-chevron-right"></i></button> -->
      </div>
      
      <section class="row text-center g-4">
        <article class="col-md-4">
          <article class="card-custom">
            <h3><i class="fas fa-house-user icon"></i>Home</h3>
            <p>Welcome to Kannada Sangha, a vibrant community celebrating Karnataka's rich cultural heritage.</p>
            
            <!-- Community Stats -->
            <div class="community-stats">
              <span class="stat-simple"><strong>450+</strong> Community Members</span> 
              <div class="stat-inline">
                <span class="stat-simple"><strong>4+</strong> Events per year</span>
                <span class="stat-simple"><strong>{lifetimeMembers.length}</strong> Lifetime Members</span>
                <span class="stat-simple"><strong>{sponsors.length}</strong> Sponsors</span>
              </div>
              <span class="stat-simple"><strong>58</strong> Kannada Kali Students</span>
              <div class="stat-inline">
                <span class="stat-simple"><strong>{activeMembersCount}</strong> Registered Members</span>
              </div>
              <span class="stat-simple"><strong>380+</strong> Social Media Followers</span>
            </div>
            
            <div class="bottom-content">
              <div class="sponsorship-note mt-2">
                <p>Contact us today about sponsorship opportunities!<br>
                  <a href="mailto:suddhi@orlandokannadasangha.org" class="sponsor-email">
                    <i class="fas fa-envelope me-2"></i>suddhi@orlandokannadasangha.org
                  </a>
                </p>
              </div>
              <div id="regions_div" class="mt-4 map-container"></div>
            </div>
          </article>
        </article>
        <article class="col-md-4">
          <article class="card-custom">
            <h3><i class="fas fa-address-card icon"></i>About Us</h3>
            <p>Orlando Kannada Sangha or <abbr title="Orlando Kannada Sangha">OKS</abbr> was formally registered as an organization in the year <time datetime="2012">2012</time>. Although we have had a Kannada group and have been organizing activities since more than 20 years, we had not formally registered as an organization until 2012.</p>
            <p>Orlando Kannada Sangha is an association for people that hail from the Karnataka state of India, and those who can speak the Kannada language. Its primary goal is to provide a platform for Kannada speaking people to meet, socialize and promote their cultural and social heritage to the next generation of Kannadiga's living in <abbr title="United States">US</abbr>.</p>
            <p class="years-old-text">We are <strong>{yearsSinceFounded} years old</strong> and growing stronger every year!</p>
            <div class="bottom-content">
              <div class="mt-2">
                <a href="/about" class="btn btn-sm btn-outline-primary">Read more <i class="fas fa-arrow-right ms-1"></i></a>
              </div>
            </div>
          </article>
        </article>
        <article class="col-md-4" id="donate">
          <article class="card-custom">
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
                  <figure class="qr-placeholder">
                    <img src="/images/DonateQR.png" alt="Donate QR Code" style="width: 100%; max-width: 250px; height: auto;">
                  </figure>
                </div>
              </div>
              <div class="mt-3 text-center">
                <p class="small text-muted mb-2">Or you can download the Donation Form below and email it to:</p>
                  <address>
                    <a href="mailto:board@orlandokannadasangha.org" class="sponsor-email">
                      <i class="fas fa-envelope me-2"></i>board@orlandokannadasangha.org
                    </a>
                  </address>
              </div>
              <div class="bottom-content">
              <div class="mt-3 text-center">
                <a href="/documents/DonationForm.pdf" target="_blank" class="btn btn-outline-primary btn-sm">
                  <i class="fas fa-download me-2"></i>Download Donation Form
                </a>
              </div>
            </div>
            </div>
          </article>
        </article>
      </section>
    </div>
  </div>
</main>

<!-- Membership Section -->
<section class="section container py-4 membership-section my-3">
  <h3 class="text-center mb-4"><i class="fas fa-address-card icon"></i>Membership</h3>
  <div class="row g-4">
    <!-- Benefits Column -->
    <article class="col-md-4">
      <article class="membership-card">
        <h4><i class="fas fa-gift icon"></i>Membership Benefits</h4>
        <ul class="benefits-list">
          <li><i class="fas fa-check"></i> Discounts on All Events</li>
          <li><i class="fas fa-check"></i> Ugadi Picnic, Youth Conference, and some competitions</li>
          <li><i class="fas fa-check"></i> Voting Rights for Board</li>
          <li><i class="fas fa-check"></i> Discounted Fees for Programs including Kannada Kali</li>
          <li><i class="fas fa-check"></i> Youth Conference Admission</li>
          <li><i class="fas fa-check"></i> Discounted Cultural Classes</li>
          <li><i class="fas fa-check"></i> Online Event Participations</li>
        </ul>
      </article>
    </article>

    <!-- Pricing Column -->
    <article class="col-md-4">
      <article class="membership-card">
        <h4><i class="fas fa-tags icon"></i>Annual Membership <time>{membershipYear}</time></h4>
        <div class="pricing-options">
          <div class="price-card">
            <div class="price-header">Family</div>
            <div class="price-amount">$50</div>
            <div class="price-period">per Family</div>
          </div>
          <div class="price-card mt-3">
            <div class="price-header">Individual</div>
            <div class="price-amount">$25</div>
            <div class="price-period">per Individual</div>
          </div>
        </div>
        <hr class="my-3" style="border-color: rgba(122, 31, 31, 0.2);">
        <h4 class="mt-3"><i class="fas fa-infinity icon"></i>Life Time Membership</h4>
        <div class="price-card">
          <div class="price-header">Family</div>
          <div class="price-amount">$500</div>
          <div class="price-period">per Family (Husband-Wife and their Kids)</div>
        </div>
      </article>
    </article>

    <!-- Payment Column -->
    <article class="col-md-4">
      <article class="membership-card">
        <h4><i class="fas fa-credit-card icon"></i>Payment Options</h4>
        <div class="payment-options">
          <a href="https://www.zeffy.com/en-US/ticketing/oks-membership--2026" target="_blank" class="btn btn-primary membership-btn mb-4">
            <i class="fas fa-shopping-cart me-2"></i>Membership Payment
          </a>
          <div class="qr-section">
            <p class="text-center mb-3">Or scan QR code</p>
            <figure class="qr-placeholder">
              {#if membershipQRLoaded && membershipQRImage}
                <img src={membershipQRImage} alt="Membership QR Code" style="width: 100%; max-width: 120px; height: auto;">
              {:else}
                <div class="qr-loading">
                  <i class="fas fa-spinner fa-spin"></i>
                  <p>Loading QR Code...</p>
                </div>
              {/if}
            </figure>
          </div>
        </div>
      </article>
    </article>
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
          Our Article of Incorporation was recently amended by <abbr title="Orlando Kannada Sangha">OKS</abbr> Board of Directors to include Dissolution clause necessary for <abbr title="Tax-exempt nonprofit organization under section 501(c)(3) of the Internal Revenue Code">501(c)(3)</abbr> non-profit organizations.
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
    <div class="col-md-6 order-2 order-md-1">
      <div id='calendar'></div>
    </div>

    <div class="col-md-6 order-1 order-md-2">
      <div class="events-container">
        {#if eventsLoaded && events.length > 0}
          {#each events as event}
            {@const dateFormatted = formatEventDate(event.date)}
            <SimpleEventCard 
              month={dateFormatted.month}
              day={String(dateFormatted.day)}
              title={event.title || 'Event'}
              date={dateFormatted.fullDate}
              time={event.time || 'TBA'}
              location={event.location || 'TBA'}
              imageSrc={event.image_url || 'https://picsum.photos/150/100?random=1'}
              imageAlt={event.title || 'Event'}
              mapLink={event.map_link || ''}
              memberFormUrl={event.member_form_url || ''}
              nonMemberFormUrl={event.non_member_form_url || ''}
              autoShow={autoShowPopup && event.show_popup === true}
            />
          {/each}
        {:else}
          <!-- Fallback event while loading or if no events -->
          <SimpleEventCard 
            month="MON"
            day="DD"
            title="To Be Announced"
            date="TBA"
            time="TBA"
            location="TBA"
            imageSrc="https://picsum.photos/150/100?random=1"
            imageAlt="Event"
            mapLink=""
            memberFormUrl=""
            nonMemberFormUrl=""
          />
        {/if}
      </div>
    </div>
  </div>
</section>

<!-- Lifetime Members Section -->
<section class="section container py-4 my-3">
  {#if lifetimeMembersLoading}
    <div class="loading-state">
      <i class="fas fa-spinner fa-spin"></i>
      <p>Loading lifetime members...</p>
    </div>
  {:else if lifetimeMembersError}
    <div class="alert alert-warning text-center">
      <i class="fas fa-exclamation-triangle me-2"></i>
      {lifetimeMembersError}
    </div>
  {:else if lifetimeMembers.length === 0}
    <div class="text-center py-4">
      <i class="fas fa-crown fa-3x text-muted mb-3"></i>
      <p class="text-muted">No lifetime members found</p>
    </div>
  {:else}
    <MemberSlider 
      members={lifetimeMembers}
      title="Our Lifetime Members"
      icon="fas fa-crown"
      showYear={true}
      showPosition={true}
      images={lifetimeMemberImages}
      imagesLoaded={lifetimeMemberImagesLoaded}
    />
  {/if}
  
  <div class="text-center mt-4">
    <p class="text-muted">
      <i class="fas fa-crown me-2"></i>
      We honor and appreciate the contributions of our lifetime members who have been dedicated supporters of our community.
    </p>
  </div>
</section>

<!-- Sponsors Section -->
<section class="section container py-2 mt-3">
  <h3 class="text-center mb-4"><i class="fas fa-handshake icon"></i>Our Sponsors</h3>
  
  <MasonryGallery 
    items={sponsorGalleryItems}
    loading={sponsorsLoading}
    error={sponsorsError}
    emptyMessage="No sponsors yet"
    emptySubtitle="Become our first sponsor!"
    showOverlay={false}
    enableLightbox={false}
    showDownloadButton={false}
  />
  
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
          <h4 class="mb-0">
            <i class="fas fa-heart me-2" style="color: #7a1f1f;"></i>
            Thanks to All Our Amazing Sponsors
          </h4>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  /* Compact the membership section heights slightly */
  .membership-section .membership-card h4 {
    color: #7a1f1f;
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
  .membership-section .price-period {
    font-size: 0.88rem;
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
    animation: scroll 100s linear infinite;
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
  
  .thank-you-sponsors-content h4 {
    color: #7a1f1f;
    font-weight: 600;
    font-size: 1.3rem;
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

  /* QR Code Loading State */
  .qr-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    color: #7a1f1f;
    text-align: center;
  }

  .qr-loading i {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    animation: spin 1s linear infinite;
  }

  .qr-loading p {
    margin: 0;
    font-size: 0.875rem;
    font-weight: 500;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  /* Community Stats - keep specific stats inline */
  .community-stats {
    font-size: 0.860rem;
  }

  /* Bottom content padding */
  .bottom-content {
    padding-top: 0.1rem;
  }

  .stat-inline {
    display: inline;
  }

  .stat-inline .stat-simple {
    margin-right: 0.1rem;
  }

  /* Map container styles */
  .map-container {
    width: 100%;
    height: 100px;
  }

  /* Map height for mobile */
  @media (max-width: 768px) {
    .map-container {
      height: 350px;
    }
  }

  @media (max-width: 480px) {
    .map-container {
      height: 200px;
    }
  }

</style>

<Footer />

