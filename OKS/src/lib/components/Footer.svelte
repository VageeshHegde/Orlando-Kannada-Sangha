<script>
  let formData = {
    firstName: '',
    lastName: '',
    email: ''
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission here
    // Reset form
    formData = { firstName: '', lastName: '', email: '' };
  };

  const handleInput = (field, value) => {
    formData[field] = value;
  };
</script>

<footer class="footer" id="footer" style="margin-top: 3.5rem;">
  <div class="container">
    <div class="row">
      <!-- Organization Details -->
      <div class="col-lg-4 col-md-6">
        <div class="footer-section">
          <h5 class="footer-title">
            <i class="fas fa-info-circle" aria-hidden="true"></i>
            About OKS
          </h5>
          <div class="footer-description">
            Orlando Kannada Sangha is a vibrant non-profit organization dedicated to preserving and promoting Kannada culture in central Florida.
          </div>
          <div class="org-details mt-3">
            <!-- 
            <div class="detail-item">
              <i class="fas fa-map-marker-alt"></i>
              <span>Orlando, Florida, USA</span>
            </div> -->
            <div class="detail-item">
              <i class="fas fa-calendar-alt" aria-hidden="true"></i>
              <span>Established 2012</span>
            </div>
            <div class="detail-item">
              <i class="fas fa-shield-alt" aria-hidden="true"></i>
              <span>501(c)(3) Non-Profit Organization</span>
            </div>
            <div class="detail-item">
              <i class="fas fa-id-card" aria-hidden="true"></i>
              <span>Tax ID: 46-2253530</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Links -->
      <div class="col-lg-4 col-md-6">
        <div class="footer-section">
          <h5 class="footer-title">
            <i class="fas fa-link" aria-hidden="true"></i>
            Quick Links
          </h5>
          <ul class="footer-links">
            <li><a href="/"><i class="fas fa-home" aria-hidden="true"></i>Home</a></li>
            <li><a href="/about"><i class="fas fa-users" aria-hidden="true"></i>About Us</a></li>
            <!-- <li><a href="/events"><i class="fas fa-calendar-alt" aria-hidden="true"></i>Events</a></li> -->
            <li><a href="/membership"><i class="fas fa-id-card" aria-hidden="true"></i>Membership</a></li>
            <li><a href="/kannada-kali"><i class="fas fa-book" aria-hidden="true"></i>Kannada Kali</a></li>
            <li><a href="/gallery"><i class="fas fa-images" aria-hidden="true"></i>Gallery</a></li>
            <li><a href="/blog"><i class="fas fa-blog" aria-hidden="true"></i>OKS Blog</a></li>
            <li><a href="/constitution"><i class="fas fa-gavel" aria-hidden="true"></i>Constitution</a></li>
            <li><a href="/by-laws"><i class="fas fa-book-open" aria-hidden="true"></i>By-Laws</a></li>
            <li><a href="/login"><i class="fas fa-sign-in-alt" aria-hidden="true"></i>Login</a></li>
            <li><a href="https://www.zeffy.com/en-US/donation-form/e9e95cc9-b449-49eb-85c8-cf5efa4a712e" target="_blank" rel="noopener noreferrer" aria-label="Donate - opens in new window" title="Donate - opens in new window"><i class="fas fa-hand-holding-dollar" aria-hidden="true"></i>Donate</a></li>
          </ul>
        </div>
      </div>

      <!-- Contact & Connect -->
      <div class="col-lg-4 col-md-12">
        <div class="footer-section">
          <h5 class="footer-title">
            <i class="fas fa-paper-plane" aria-hidden="true"></i>
            Connect With Us
          </h5>
          <div class="contact-info">
            <div class="contact-item">
              <i class="fas fa-envelope" aria-hidden="true"></i>
              <a href="mailto:suddhi@orlandokannadasangha.org">suddhi@orlandokannadasangha.org</a>
            </div>
            <div class="contact-item">
              <i class="fas fa-envelope" aria-hidden="true"></i>
              <a href="mailto:board@orlandokannadasangha.org">board@orlandokannadasangha.org</a>
            </div>
            <div class="contact-item">
              <i class="fas fa-map-marker-alt" aria-hidden="true"></i>
              <span>Orlando, Florida, USA</span>
            </div>
          </div>
          
          <div class="social-section mt-4">
            <div class="small-line" aria-hidden="true"></div>
            <h6 class="social-title">Follow Us</h6>
            <div class="social-links">
              <a href="https://www.facebook.com/groups/240016079392735/?ref=share&mibextid=NSMWBT" class="social-icon" aria-label="Visit our Facebook page - opens in new window" title="Visit our Facebook page" target="_blank" rel="noopener noreferrer">
                <i class="fab fa-facebook-f" aria-hidden="true"></i>
              </a>
              <a href="https://www.instagram.com/orlando.kannada.sangha?igsh=MXNmdjI0d29yZGVqYg==" class="social-icon" aria-label="Visit our Instagram page - opens in new window" title="Visit our Instagram page" target="_blank" rel="noopener noreferrer">
                <i class="fab fa-instagram" aria-hidden="true"></i>
              </a>
              <a href="https://www.youtube.com/@orlandokannadasanghaoks7838" class="social-icon" aria-label="Visit our YouTube channel - opens in new window" title="Visit our YouTube channel" target="_blank" rel="noopener noreferrer">
                <i class="fab fa-youtube" aria-hidden="true"></i>
              </a>
              <!-- <a href="#" class="social-icon" title="WhatsApp">
                <i class="fab fa-whatsapp"></i>
              </a> -->
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- OKS Suddi Newsletter Section -->
    <div class="row mt-4">
      <div class="col-12">
        <div class="footer-section">
          <h5 class="footer-title">
            <i class="fas fa-newspaper" aria-hidden="true"></i>
            OKS Suddi
          </h5>
          <form class="footer-form" on:submit={handleSubmit} aria-label="Subscribe to OKS Suddi newsletter">
            <div class="row">
              <div class="col-md-4">
                <div class="mb-3">
                  <label for="firstName" class="form-label">First Name:</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="firstName" 
                    placeholder="First name" 
                    bind:value={formData.firstName}
                    required
                  />
                </div>
              </div>
              <div class="col-md-4">
                <div class="mb-3">
                  <label for="lastName" class="form-label">Last Name:</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="lastName" 
                    placeholder="Last name" 
                    bind:value={formData.lastName}
                    required
                  />
                </div>
              </div>
              <div class="col-md-4">
                <div class="mb-3">
                  <label for="email" class="form-label">Email address:</label>
                  <input 
                    type="email" 
                    class="form-control" 
                    id="email" 
                    placeholder="Your email address" 
                    bind:value={formData.email}
                    required
                  />
                </div>
              </div>
            </div>
            <div class="text-center">
              <button type="submit" class="btn btn-primary" aria-label="Subscribe to newsletter">Subscribe</button>
            </div>
          </form>
          <div class="mt-3 text-center">
            <small class="text-warning">
              After signing up above, you will start receiving communications from suddhi@orlandokannadasangha.org. All, especially Gmail users, Please make sure to add suddhi@orlandokannadasangha.org to your whitelisted addresses so, it doesn't go to your Spam folder.
            </small>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Bottom -->
    <div class="footer-bottom mt-2">
      <hr class="footer-divider">
      <div class="row align-items-center">
        <div class="col-md-6">
          <div class="copyright">
            <i class="fas fa-copyright" aria-hidden="true"></i> 2025 Orlando Kannada Sangha
          </div>
        </div>
        <div class="col-md-6">
          <div class="footer-bottom-links text-md-end">
            <a href="/privacy-policy">Privacy Policy</a>
            <span class="separator">|</span>
            <a href="/terms-of-use">Terms of Use</a>
            <span class="separator">|</span>
            <a href="/sitemap">Site Map</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</footer>

<style>
  /* Footer Styles */
  footer {
    background-color: #7a1f1f;
    color: white;
    text-align: center;
    padding: 1rem;
    width: 100%;
    padding-top: 2.3rem;
  }

  .footer {
    background-color: #7a1f1f;
    color: #fff;
  }

  .footer-section {
    height: 100%;
    padding: 1rem;
    border-radius: 8px;
    background-color: rgba(255, 255, 255, 0.05);
  }

  .footer-title {
    color: #f0d9b5;
    font-size: 1.25rem;
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 2px solid rgba(240, 217, 181, 0.3);
  }

  .footer-title i {
    margin-right: 0.75rem;
  }

  .footer-description {
    color: rgba(255, 255, 255, 0.9);
    line-height: 1.6;
    font-size: 0.95rem;
  }

  .org-details .detail-item {
    display: flex;
    align-items: center;
    margin-bottom: 0.75rem;
    color: rgba(255, 255, 255, 0.9);
    font-size: 0.9rem;
  }

  .detail-item i {
    width: 24px;
    margin-right: 0.75rem;
    color: #f0d9b5;
  }

  .footer-links {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem 1rem;
  }

  .footer-links li {
    margin-bottom: 0.75rem;
  }

  .footer-links a {
    color: rgba(255, 255, 255, 0.9);
    text-decoration: none;
    display: flex;
    align-items: center;
    transition: color 0.3s ease;
    font-size: 0.9rem;
  }

  .footer-links a i {
    width: 20px;
    margin-right: 0.75rem;
    color: #f0d9b5;
  }

  .footer-links a:hover {
    color: #f0d9b5;
  }

  .footer-links a:focus {
    outline: 2px solid #f0d9b5;
    outline-offset: 2px;
    border-radius: 4px;
  }

  .footer-links a:focus-visible {
    outline: 2px solid #f0d9b5;
    outline-offset: 2px;
    border-radius: 4px;
  }

  .contact-info .contact-item {
    display: flex;
    align-items: center;
    margin-bottom: 0.75rem;
    color: rgba(255, 255, 255, 0.9);
    font-size: 0.9rem;
  }

  .contact-item i {
    width: 24px;
    margin-right: 0.75rem;
    color: #f0d9b5;
  }

  .contact-item a {
    color: rgba(255, 255, 255, 0.9);
    text-decoration: none;
    transition: color 0.3s ease;
    font-size: 0.9rem;
  }

  .contact-item a:hover {
    color: #f0d9b5;
  }

  .contact-item a:focus {
    outline: 2px solid #f0d9b5;
    outline-offset: 2px;
    border-radius: 4px;
  }

  .contact-item a:focus-visible {
    outline: 2px solid #f0d9b5;
    outline-offset: 2px;
    border-radius: 4px;
  }

  .social-section {
    margin-top: 1.5rem;
  }

  .small-line {
    width: 100%;
    height: 1px;
    background-color: rgba(239, 215, 183, 0.3);
    margin: 0 auto 0.75rem auto;
    border-radius: 2px;
  }

  .social-title {
    color: #f0d9b5;
    font-size: 1rem;
    margin-bottom: 0.75rem;
  }

  .social-links {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }

  .social-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background-color: rgba(240, 217, 181, 0.2);
    color: #f0d9b5;
    border-radius: 50%;
    text-decoration: none;
    transition: all 0.3s ease;
  }

  .social-icon:hover {
    background-color: #f0d9b5;
    color: #7a1f1f;
    transform: translateY(-2px);
  }

  .social-icon:focus {
    outline: 3px solid #f0d9b5;
    outline-offset: 2px;
  }

  .social-icon:focus-visible {
    outline: 3px solid #f0d9b5;
    outline-offset: 2px;
  }

  .footer-divider {
    border-color: rgba(240, 217, 181, 0.3);
    margin: 2rem 0 1rem 0;
  }

  .footer-bottom {
    padding: 1rem 0;
  }

  .copyright {
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.9rem;
    text-align: left;
  }

  @media (max-width: 767px) {
    .col-lg-4,
    .col-md-6 {
      margin-bottom: 1.5rem;
    }
    
    .col-lg-4:last-child,
    .col-md-6:last-child {
      margin-bottom: 0.35rem;
    }
    
    .copyright {
      text-align: center;
      margin-bottom: 1rem;
    }

    .footer-bottom-links {
      text-align: center !important;
    }

    .footer-links {
      grid-template-columns: 2fr 2fr;
      gap: 0.5rem;
    }
  }

  .footer-bottom-links a {
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    font-size: 0.9rem;
    transition: color 0.3s ease;
  }

  .footer-bottom-links a:hover {
    color: #f0d9b5;
  }

  .footer-bottom-links a:focus {
    outline: 2px solid #f0d9b5;
    outline-offset: 2px;
    border-radius: 4px;
  }

  .footer-bottom-links a:focus-visible {
    outline: 2px solid #f0d9b5;
    outline-offset: 2px;
    border-radius: 4px;
  }

  .footer-bottom-links .separator {
    color: rgba(255, 255, 255, 0.5);
    margin: 0 0.5rem;
  }

  .footer-form {
    margin-top: 1rem;
  }

  .footer-form .form-label {
    color: rgba(255, 255, 255, 0.9);
    font-weight: 500;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
  }

  .footer-form .form-control {
    background-color: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
    border-radius: 8px;
    padding: 0.75rem;
    transition: all 0.3s ease;
    font-size: 0.9rem;
  }

  .footer-form .form-control::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }

  .footer-form .form-control:focus {
    background-color: rgba(255, 255, 255, 0.15);
    border-color: #f0d9b5;
    box-shadow: 0 0 0 0.2rem rgba(240, 217, 181, 0.25);
    color: white;
    outline: 2px solid #f0d9b5;
    outline-offset: 2px;
  }

  .footer-form .form-control:focus-visible {
    outline: 2px solid #f0d9b5;
    outline-offset: 2px;
  }

  .footer-form .btn-primary {
    background-color: #f0d9b5;
    border-color: #f0d9b5;
    color: #7a1f1f;
    font-weight: 600;
    padding: 0.75rem 2rem;
    border-radius: 8px;
    transition: all 0.3s ease;
    font-size: 0.95rem;
  }

  .footer-form .btn-primary:hover {
    background-color: #e6c99a;
    border-color: #e6c99a;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(240, 217, 181, 0.3);
  }

  .footer-form .btn-primary:focus {
    outline: 3px solid #f0d9b5;
    outline-offset: 2px;
  }

  .footer-form .btn-primary:focus-visible {
    outline: 3px solid #f0d9b5;
    outline-offset: 2px;
  }

  @media (max-width: 768px) {
    .footer-form .form-control {
      margin-bottom: 1rem;
    }

    .footer-form .btn-primary {
      width: 100%;
    }
  }
</style> 