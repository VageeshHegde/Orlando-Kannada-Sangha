<script>
  import { onMount } from 'svelte';
  import { user } from '$lib/stores/auth.js';
  
  export let page = 'Home'; // Default to 'Home' if no page is specified
  export let leftImage = '/images/disney-castle-sketch.png';
  export let rightImage = '/images/Yakshagana.png';
  export let topLeftImage = '/images/Karnataka.png';
  export let bottomRightImage = '/images/mysore-palace-vector.svg';

  // Real authentication state from Supabase
  $: isLoggedIn = !!$user;
  $: userName = $user ? getUserDisplayName($user) : '';
  
  // Get user display name from various sources
  function getUserDisplayName(user) {
    if (!user) return '';
    
    // Priority 1: Check for 'name' field in metadata (most direct)
    if (user.user_metadata?.name) {
      return user.user_metadata.name;
    }
    
    // Priority 2: Try to get full name from first_name and last_name
    const firstName = user.user_metadata?.first_name || '';
    const lastName = user.user_metadata?.last_name || '';
    
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    } else if (firstName) {
      return firstName;
    } else if (lastName) {
      return lastName;
    }
    
    // Priority 3: Enhanced email parsing for better name extraction
    if (user.email) {
      const emailUser = user.email.split('@')[0];
      
      // Handle common email patterns
      if (emailUser.includes('.')) {
        // Handle patterns like "john.doe" or "first.last"
        const parts = emailUser.split('.');
        const firstName = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
        const lastName = parts[1] ? parts[1].charAt(0).toUpperCase() + parts[1].slice(1) : '';
        return lastName ? `${firstName} ${lastName}` : firstName;
      } else if (emailUser.includes('_')) {
        // Handle patterns like "john_doe"
        const parts = emailUser.split('_');
        const firstName = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
        const lastName = parts[1] ? parts[1].charAt(0).toUpperCase() + parts[1].slice(1) : '';
        return lastName ? `${firstName} ${lastName}` : firstName;
      } else {
        // Simple capitalization for single words
        return emailUser.charAt(0).toUpperCase() + emailUser.slice(1);
      }
    }
    
    return 'Member';
  }

  let weatherInfo = 'Loading weather...';
  let currentDate = {
    month: '---',
    day: '--',
    year: '----',
    time: '--:--:--'
  };

  // Calendar update function from js/script.js
  function updateCalendar() {
    const now = new Date();
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
                    "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

    const month = months[now.getMonth()];
    const day = now.getDate();
    const year = now.getFullYear();

    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();

    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 becomes 12

    // Pad with 0s
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    const timeString = `${hours}:${minutes}:${seconds} ${ampm}`;

    // Update the DOM elements
    const monthEl = document.getElementById("month");
    const dayEl = document.getElementById("day");
    const yearEl = document.getElementById("year");
    const timeEl = document.getElementById("time");

    if (monthEl) monthEl.textContent = month;
    if (dayEl) dayEl.textContent = day;
    if (yearEl) yearEl.textContent = year;
    if (timeEl) timeEl.textContent = timeString;
  }

    // Weather function using our SvelteKit API
  async function getOrlandoWeather() {
    try {
      const response = await fetch('/api/weather');
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }
      
      const data = await response.json();
      
      // Extract relevant information
      const temperature = Math.round(data.temperature);
      const description = data.description;
      const iconCode = data.iconCode;
      const iconUrl = data.iconUrl;
      
      // Function to get Font Awesome icon based on weather condition
      function getWeatherIcon(description, iconCode) {
        const weatherDesc = description.toLowerCase();
        const code = iconCode;
        
        // Clear sky
        if (code === '01d' || code === '01n') {
          return 'fas fa-sun text-warning';
        }
        // Few clouds
        else if (code === '02d' || code === '02n') {
          return 'fas fa-cloud-sun text-warning';
        }
        // Scattered clouds
        else if (code === '03d' || code === '03n') {
          return 'fas fa-cloud text-muted';
        }
        // Broken clouds
        else if (code === '04d' || code === '04n') {
          return 'fas fa-cloud text-muted';
        }
        // Shower rain
        else if (code === '09d' || code === '09n') {
          return 'fas fa-cloud-rain text-info';
        }
        // Rain
        else if (code === '10d' || code === '10n') {
          return 'fas fa-cloud-rain text-info';
        }
        // Thunderstorm
        else if (code === '11d' || code === '11n') {
          return 'fas fa-bolt text-warning';
        }
        // Snow
        else if (code === '13d' || code === '13n') {
          return 'fas fa-snowflake text-info';
        }
        // Mist/Fog
        else if (code === '50d' || code === '50n') {
          return 'fas fa-smog text-muted';
        }
        // Default fallback
        else {
          return 'fas fa-cloud-sun text-warning';
        }
      }
      
      // Get the appropriate Font Awesome icon
      const weatherIconClass = getWeatherIcon(description, iconCode);
      
      // Update the weather header icon
      const weatherHeaderEl = document.querySelector('.weather-header-icon');
      if (weatherHeaderEl) {
        weatherHeaderEl.className = `${weatherIconClass} me-1`;
      }
      
       // Update the weather info element
       const weatherInfoEl = document.getElementById('weather-info');
       if (weatherInfoEl) {
         weatherInfoEl.innerHTML = `
           <p style="text-align: center; margin: 2px 0;">
             <img src="${iconUrl}" alt="${description}" style="width: 40px; height: 40px; display: block; margin: 0 auto;" />
           </p>
           <p style="color: #444; font-size: 1rem; font-weight: 600; margin-top: 5px;">${data.city}</p>
           <p style="color: #7a1f1f; font-size: 1.2rem; font-weight: bold; margin-top: 7px;">${Math.round((temperature * 9/5) + 32)}°F</p>
           <p style="color: #7a1f1f; font-size: 0.9rem; font-weight: 500; margin-top: 5px; text-transform: capitalize;">${description}</p>
         `;
       }
    } catch (error) {
      console.error('Weather error:', error);
      const weatherInfoEl = document.getElementById('weather-info');
      if (weatherInfoEl) {
        weatherInfoEl.textContent = 'Unable to load weather data.';
      }
    }
  }

  onMount(() => {
    // Initialize calendar
    updateCalendar();
    const calendarInterval = setInterval(updateCalendar, 1000);

    // Initialize weather
    getOrlandoWeather();
    // Update weather every 30 minutes
    const weatherInterval = setInterval(getOrlandoWeather, 30 * 60 * 1000);

    return () => {
      clearInterval(calendarInterval);
      clearInterval(weatherInterval);
    };
  });
</script>

<!-- Hero Section -->
<section class="hero">
  <div class="container py-5 position-relative">
    
    <!-- Left Weather Box - Positioned absolutely -->
    <div class="weather-box-left">
      <div class="calendar-wrapper">
        <div class="hook left"></div>
        <div class="hook right"></div>
        <div class="calendar-today" role="region" aria-label="Weather information">
          <div class="calendar-month"><i class="weather-header-icon fas fa-cloud-sun me-1 text-warning" aria-hidden="true"></i>Weather</div>
          <div>
            <div id="weather-info" class="pt-2" role="status" aria-live="polite">Loading weather...</div>
          </div>            
        </div>
      </div>        
    </div>
    
    <!-- Center Content -->
    <div class="text-center hero-content">
      <img src={leftImage} alt="" class="hero-palace1" aria-hidden="true"/>
      <img src={rightImage} alt="" class="hero-palace2" aria-hidden="true"/>
      <img src={topLeftImage} alt="" class="hero-palace3" aria-hidden="true"/>
      <img src={bottomRightImage} alt="" class="hero-palace" aria-hidden="true"/>
      
      <h1 class="mb-2">
        <i class="fas fa-globe-asia icon me-2" aria-hidden="true"></i>Orlando Kannada Sangha
      </h1>
      
      <!-- Dynamic Greeting - Shows user name when logged in, general message when not -->
      <div class="greeting-section mb-2">
        <p class="greeting-text">
          {#if isLoggedIn && userName}
            Hello <i class="fa-solid fa-hands" aria-hidden="true"></i> {userName}!
          {:else}
            Welcome <i class="fa-solid fa-hands" aria-hidden="true"></i> to our community
          {/if}
        </p>
      </div>
      <h4 class="page-indicator">
        <div class="logo-circle-small">
          <img src="/images/OKSlogo.png" alt="OKS Logo" class="oks-logo-small"/>
        </div>
        {page}
      </h4>
      <h2>ಒರ್ಲ್ಯಾಂಡೋ ಕನ್ನಡ ಸಂಘ</h2>
      <h6 class="text-muted">A not-for-profit <abbr title="Tax-exempt nonprofit organization under section 501(c)(3) of the Internal Revenue Code">501(c)(3)</abbr> organization. <abbr title="Tax Identification Number">Tax ID</abbr> 46-2253530</h6>
      <p class="mt-3">Kannada Cultural Association</p>
    </div>
    
    <!-- Right Calendar - Positioned absolutely -->
    <div class="calendar-box-right">
      <div class="calendar-wrapper">
        <div class="hook left"></div>
        <div class="hook right"></div>
        <div class="calendar-today" role="region" aria-label="Current date and time">
            <div class="calendar-month"><i class="fas fa-calendar-alt me-1 text-warning" aria-hidden="true"></i><span id="month" aria-label="Current month">JAN</span></div>
          <div class="calendar-day" id="day" aria-label="Current day">15</div>
          <div class="calendar-year" id="year" aria-label="Current year">2025</div>
          <div class="calendar-time" id="time" aria-label="Current time">12:00:00 PM</div>
        </div>
      </div>        
    </div>

  </div>
</section>

<style>
  .hero {
    background: linear-gradient(135deg, rgba(240, 217, 181, 0.8) 0%, rgba(232, 200, 160, 0.8) 100%);
    padding: 3.5rem 1rem;
    text-align: center;
    position: relative;
  }

  .hero::before {
    content: '';
    position: absolute;
    top: 0;
    left: 49.7%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 1200px; /* Match Bootstrap container max-width */
    height: 100%;
    background: url('/images/welcome.jpg') center 55%/cover no-repeat;
    z-index: -1;
  }

  .hero p {
    color: #8a4b4b;
    font-size: 1.2rem;
  }

  .greeting-section {
    margin-top: 0.5rem;
  }

  .greeting-text {
    color: #8a4b4b;
    font-size: 1.1rem;
    font-weight: 500;
    margin: 0;
  }

  .calendar-wrapper {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: flex-start;
  }

  .calendar-today {
    width: 180px;
    height: 200px;
    background-color: #fff;
    border: 2px solid #7a1f1f;
    border-radius: 12px;
    text-align: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
  }

  .calendar-month {
    background-color: #f26c4f;
    color: white;
    font-size: 1.5rem;
    padding: 5px;
    border-radius: 10px 10px 0 0;
  }

  .calendar-day {
    font-size: 2.5rem;
    font-weight: bold;
    margin-top: 10px;
    color: #7a1f1f;
  }

  .calendar-year {
    font-size: 1rem;
    color: #444;
  }

  .calendar-time {
    font-size: 1.2rem;
    color: #7a1f1f;
    margin-top: 5px;
    font-weight: 500;
  }

  .hook {
    width: 10px;
    height: 10px;
    background-color: #444;
    border-radius: 50%;
    position: absolute;
    top: -10px;
  }

  .hook.left {
    left: calc(50% - 45px);
  }

  .hook.right {
    left: calc(50% + 33px);
  }

  .hook::after {
    content: '';
    display: block;
    width: 2px;
    height: 10px;
    background-color: #444;
    margin: 0 auto;
  }

  .hero-palace {
    position: absolute;
    bottom: -80px;
    right: 15%;
    width: 280px;
    opacity: 0.6;
    z-index: 0;
  }

  .hero-palace1 {
    position: absolute;
    bottom: -80px;
    left: 18%;
    width: 120px;
    opacity: 0.8;
    z-index: 0;
  }

  .hero-palace2 {
    position: absolute;
    top: -50px;
    right: 16%;
    width: 120px;
    opacity: 0.9;
    z-index: 0;
  }

  .hero-palace3 {
    position: absolute;
    top: -50px;
    left: 18%;
    width: 100px;
    opacity: 0.8;
    z-index: 0;
  }

  .icon {
    margin-right: 0.5rem;
  }

  .hero-content {
    position: relative;
    z-index: 2;
  }

  .page-indicator {
    color: #8a4b4b;
    font-size: 1.4rem;
    font-weight: 500;
    margin: 0.5rem 0;
    text-transform: uppercase;
    letter-spacing: 1px;
    background: linear-gradient(135deg, #f0d9b5 0%, #e8c8a0 100%);
    padding: 0.5rem 1.5rem;
    border-radius: 25px;
    border: 2px solid #7a1f1f;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    box-shadow: 0 2px 8px rgba(122, 31, 31, 0.2);
  }

  .logo-circle-small {
    width: 40px;
    height: 40px;
    border: 1px solid #f26c4f;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #fff2e2 0%, #f0d9b5 100%);
    flex-shrink: 0;
  }

  .oks-logo-small {
    width: 28px;
    height: 28px;
    object-fit: contain;
    border-radius: 50%;
  }

  /* Absolutely positioned weather and calendar boxes */
  .weather-box-left {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 3;
  }

  .calendar-box-right {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 3;
  }

  @media (max-width: 768px) {
    /* Show background image only in top portion on mobile */
    .hero::before {
      height: 20%;
      top: -10px;
    }
    
    /* Hide all decorative images on mobile */
    .hero-palace, .hero-palace1, .hero-palace2, .hero-palace3 {
      display: none;
    }
    
    .page-indicator {
      font-size: 1.2rem;
      padding: 0.4rem 1.2rem;
    }

    .logo-circle-small {
      width: 35px;
      height: 35px;
    }

    .oks-logo-small {
      width: 24px;
      height: 24px;
    }

    .weather-box-left,
    .calendar-box-right {
      position: relative;
      left: auto;
      right: auto;
      top: auto;
      transform: none;
      margin: 1rem 0;
    }
  }
</style> 