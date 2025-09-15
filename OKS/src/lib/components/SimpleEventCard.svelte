<script>
  import { user } from '$lib/stores/auth.js';
  
  // Props for the simple event card
  export let month = "MAR";
  export let day = "3";
  export let title = "Music Concert";
  export let date = "March 3, 2024";
  export let location = "123 Main St, Anytown, CA";
  export let imageSrc = "https://picsum.photos/150/100";
  export let imageAlt = "Map";
  export let mapLink = "";
  export let memberFormUrl = "https://www.zeffy.com/embed/ticketing/kannada-rajyotsava-2025draft";
  export let nonMemberFormUrl = "https://www.zeffy.com/embed/ticketing/kannada-rajyotsava-2025nonmemberdraft";

  // Bootstrap modal functionality
  let modalId = `eventModal${Math.random().toString(36).substr(2, 9)}`;

  function openLightbox() {
    // Use Bootstrap's modal API
    const modal = new bootstrap.Modal(document.getElementById(modalId));
    modal.show();
  }
</script>


<!-- Simple Event Card -->
<div class="event-card">
  <div class="calendar-box">
    <div class="calendar-month-E">{month}</div>
    <div class="calendar-day-E">{day}</div>
  </div>
  <div class="event-info">
    <h5>{title}</h5>
    <p>{date}<br>{location}</p>
    {#if mapLink}
      <a href={mapLink} target="_blank" rel="noopener noreferrer" class="card-map-link">
        <i class="fas fa-map-marker-alt"></i> Location on Google Map
      </a>
    {/if}
  </div>
  <img src={imageSrc} alt={imageAlt} class="event-img" on:click={openLightbox} />
</div>

<!-- Bootstrap Modal with Lightbox Content -->
<div class="modal fade" id={modalId} tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" style="max-width: 1000px;">
    <div class="modal-content" style="border-radius: 12px; overflow: hidden;">
      <!-- Keep all the existing lightbox content structure -->
      <button type="button" class="lightbox-close" data-bs-dismiss="modal" aria-label="Close">×</button>
      <img src={imageSrc} alt={imageAlt} class="lightbox-image" />
      <div class="lightbox-caption">
        <h4>{title}</h4>
        <p>{date} • {location}</p>
        {#if mapLink}
          <a href={mapLink} target="_blank" rel="noopener noreferrer" class="map-link">
            <i class="fas fa-map-marker-alt"></i> View Location on Google Maps
          </a>
        {/if}
      </div>
      
      <!-- Zeffy Donation Form -->
      <div class="donation-form-container">
        <h5 class="text-center mb-3">Register for this Event</h5>
        
        {#if $user}
          <!-- Member Form - Show when user is logged in -->
          <div class="member-badge mb-3">
            <i class="fas fa-user-check"></i> Welcome back, {$user?.user_metadata?.name || $user?.email || 'member'}!
          </div>     
          <div style="position:relative;overflow:hidden;height:450px;width:100%;padding-top:450px;">
            <iframe 
              title='Donation form powered by Zeffy - Member' 
              style='position: absolute; border: 0; top:0;left:0;bottom:0;right:0;width:100%;height:100%' 
              src={memberFormUrl} 
              allowpaymentrequest 
              allowTransparency="true">
            </iframe>
          </div>
        {:else}
          <!-- Non-Member Form - Show when user is not logged in -->
          <div class="non-member-info mb-3">
            <i class="fas fa-info-circle"></i> Non-member registration
          </div>
          <div style="position:relative;overflow:hidden;height:450px;width:100%;padding-top:450px;">
            <iframe 
              title='Donation form powered by Zeffy - Non-Member' 
              style='position: absolute; border: 0; top:0;left:0;bottom:0;right:0;width:100%;height:100%' 
              src={nonMemberFormUrl} 
              allowpaymentrequest 
              allowTransparency="true">
            </iframe>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  /* Calendar Box */
  .calendar-box {
    background: #fff2e2;
    border: 2px solid #d4b07c;
    border-radius: 12px;
    text-align: center;
    padding: 1rem;
    font-weight: bold;
    font-size: 1.2rem;
    color: #7a1f1f;
    width: 80px;
  }

  .calendar-month-E {
    background-color: #f26c4f;
    color: white;
    padding: 0.2rem 0;
    border-radius: 4px 4px 0 0;
    font-size: 0.9rem;
  }

  .calendar-day-E {
    background-color: white;
    font-size: 1.5rem;
    padding: 0.3rem 0;
    border-radius: 0 0 4px 4px;
  }

  /* Event Card */
  .event-card {
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    margin-bottom: 1rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .event-info {
    flex: 1;
    margin-left: 1rem;
  }

  .event-info h5 {
    margin: 0 0 0.5rem 0;
    color: #333;
    font-size: 1.1rem;
  }

  .event-info p {
    margin: 0;
    color: #666;
    font-size: 0.9rem;
    line-height: 1.4;
  }

  .card-map-link {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    margin-top: 8px;
    padding: 4px 8px;
    background: #7a1f1f;
    color: white;
    text-decoration: none;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: 500;
    transition: all 0.3s ease;
  }

  .card-map-link:hover {
    background: #8a4b4b;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(122, 31, 31, 0.3);
  }

  .card-map-link i {
    font-size: 0.8rem;
  }

  .event-img {
    width: 150px;
    height: 100px;
    border-radius: 8px;
    background-color: #ddd;
    object-fit: cover;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .event-img:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  /* Lightbox Styles */
  .lightbox-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.9);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    backdrop-filter: blur(5px);
  }

  .lightbox-content {
    position: relative;
    width: 1000px;
    height: auto;
    max-width: 95%;
    max-height: 95%;
    background: white;
    border-radius: 12px;
    overflow-y: auto;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  }

  .lightbox-close {
    position: absolute;
    top: 15px;
    right: 15px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    font-size: 24px;
    cursor: pointer;
    z-index: 10;
    transition: background-color 0.2s ease;
  }

  .lightbox-close:hover {
    background: rgba(0, 0, 0, 0.9);
  }

  .lightbox-image {
    width: 100%;
    height: 450px;
    object-fit: cover;
    display: block;
  }

  .lightbox-caption {
    padding: 20px;
    background: white;
    height: 130px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .lightbox-caption h4 {
    margin: 0 0 10px 0;
    color: #333;
    font-size: 1.4rem;
  }

  .lightbox-caption p {
    margin: 0;
    color: #666;
    font-size: 1rem;
  }

  .map-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-top: 12px;
    padding: 8px 16px;
    background: #7a1f1f;
    color: white;
    text-decoration: none;
    border-radius: 6px;
    font-size: 0.9rem;
    font-weight: 500;
    transition: all 0.3s ease;
  }

  .map-link:hover {
    background: #8a4b4b;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(122, 31, 31, 0.3);
  }

  .map-link i {
    font-size: 1rem;
  }

  /* Donation Form Container */
  .donation-form-container {
    padding: 20px;
    background: #f8f9fa;
    border-top: 1px solid #e9ecef;
  }

  .donation-form-container h5 {
    color: #7a1f1f;
    font-weight: 600;
    margin-bottom: 20px;
  }

  /* Member and Non-Member Badges */
  .member-badge {
    background: linear-gradient(135deg, #28a745, #20c997);
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    text-align: center;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(40, 167, 69, 0.3);
  }

  .member-badge i {
    margin-right: 8px;
    font-size: 1.1rem;
  }

  .non-member-info {
    background: linear-gradient(135deg, #17a2b8, #138496);
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    text-align: center;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(23, 162, 184, 0.3);
  }

  .non-member-info i {
    margin-right: 8px;
    font-size: 1.1rem;
  }

  /* Responsive Lightbox */
  @media (max-width: 768px) {
    .lightbox-content {
      width: 95%;
      height: 500px;
      max-width: 98%;
      max-height: 98%;
    }

    .lightbox-image {
      height: 350px;
    }

    .lightbox-caption {
      height: 100px;
      padding: 15px;
    }

    .lightbox-caption {
      padding: 15px;
    }

    .lightbox-caption h4 {
      font-size: 1.2rem;
    }

    .lightbox-caption p {
      font-size: 0.9rem;
    }
  }
</style> 