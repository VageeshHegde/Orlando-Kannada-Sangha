<script>
	import { page } from '$app/stores';
	import { user, session, authActions } from '$lib/stores/auth.js';
	import { onMount } from 'svelte';
	
	// Simple language toggle state
	let isKannada = false;
	let showLanguageDropdown = false;
	
	// Close dropdown when clicking outside
	function handleClickOutside(event) {
		if (showLanguageDropdown && !event.target.closest('.language-toggle')) {
			showLanguageDropdown = false;
		}
	}

	// User state management
	let showDropdown = false;
	let userProfile = {
		name: '',
		email: '',
		avatar: '/images/default-avatar.png',
		memberSince: null
	};
	
	// Reactive statements for auth state
	$: isLoggedIn = !!$user;
	$: if ($user) {
		updateUserProfile($user);
	}
	
	// Calculate membership duration
	function getMembershipDuration(createdAt) {
		if (!createdAt) return null;
		
		const createdDate = new Date(createdAt);
		const now = new Date();
		const diffTime = Math.abs(now - createdDate);
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		const diffYears = Math.floor(diffDays / 365);
		const diffMonths = Math.floor((diffDays % 365) / 30);
		const diffWeeks = Math.floor((diffDays % 30) / 7);
		
		if (diffYears > 0) {
			return diffYears === 1 ? '1 year' : `${diffYears} years`;
		} else if (diffMonths > 0) {
			return diffMonths === 1 ? '1 month' : `${diffMonths} months`;
		} else if (diffWeeks > 0) {
			return diffWeeks === 1 ? '1 week' : `${diffWeeks} weeks`;
		} else {
			return diffDays === 1 ? '1 day' : `${diffDays} days`;
		}
	}

	// Update user profile from Supabase user data
	function updateUserProfile(currentUser) {
		if (currentUser) {
			let fullName = '';
			
			// Priority 1: Check for 'name' field in metadata (most direct)
			if (currentUser.user_metadata?.name) {
				fullName = currentUser.user_metadata.name;
			} else {
				// Priority 2: Try to get full name from first_name and last_name
				const firstName = currentUser.user_metadata?.first_name || '';
				const lastName = currentUser.user_metadata?.last_name || '';
				fullName = `${firstName} ${lastName}`.trim();
				
				// Priority 3: If no name in metadata, try to extract from email
				if (!fullName && currentUser.email) {
					const emailUser = currentUser.email.split('@')[0];
					
					if (emailUser.includes('.')) {
						// Handle patterns like "john.doe"
						const parts = emailUser.split('.');
						const first = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
						const last = parts[1] ? parts[1].charAt(0).toUpperCase() + parts[1].slice(1) : '';
						fullName = last ? `${first} ${last}` : first;
					} else if (emailUser.includes('_')) {
						// Handle patterns like "john_doe"
						const parts = emailUser.split('_');
						const first = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
						const last = parts[1] ? parts[1].charAt(0).toUpperCase() + parts[1].slice(1) : '';
						fullName = last ? `${first} ${last}` : first;
					} else {
						// Simple capitalization
						fullName = emailUser.charAt(0).toUpperCase() + emailUser.slice(1);
					}
				}
			}
			
			userProfile = {
				name: fullName || 'User',
				email: currentUser.email || '',
				avatar: currentUser.user_metadata?.avatar_url || '/images/default-avatar.png',
				memberSince: getMembershipDuration(currentUser.created_at)
			};
		} else {
			userProfile = {
				name: '',
				email: '',
				avatar: '/images/default-avatar.png',
				memberSince: null
			};
		}
	}
	
	// Get first letter of user's name for circle display
	$: userInitial = userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'U';

	// Function to check if a navigation item is active
	function isActive(path) {
		if (path === '/') {
			return $page.url.pathname === '/';
		}
		return $page.url.pathname.startsWith(path);
	}

	// Toggle dropdown visibility
	function toggleDropdown() {
		showDropdown = !showDropdown;
	}

	// Close dropdown when clicking outside
	function closeDropdown() {
		showDropdown = false;
	}

	// Logout function - now uses real Supabase logout
	async function handleLogout() {
		try {
			showDropdown = false;
			const result = await authActions.signOut();
			
			// Check if there was an error but still clear local state
			if (result && result.error) {
				console.warn('Logout had issues but clearing local state:', result.error.message || result.error);
			} else {
				console.log('Logout successful');
			}
			
			// Force clear local state regardless of server response
			user.set(null);
			session.set(null);
			
		} catch (error) {
			console.error('Logout error:', error.message || error);
			// Even if logout fails, clear local state
			user.set(null);
			session.set(null);
		}
	}
	
	// Send password reset email
	async function resetPassword() {
		try {
			showDropdown = false;
			
			// Get user's email
			const userEmail = userProfile.email;
			if (!userEmail) {
				alert('Unable to get your email address. Please contact support.');
				return;
			}
			
			// Send password reset email using Supabase
			const { error } = await authActions.resetPassword(userEmail);
			
			if (error) {
				alert('Failed to send reset email: ' + error.message);
			} else {
				alert('Password reset email sent! Please check your inbox and click the link to reset your password.');
			}
		} catch (error) {
			console.error('Reset password error:', error);
			alert('Failed to send reset email. Please try again or contact support.');
		}
	}
	
	// Handle clicks outside dropdown
	onMount(() => {
		const handleClickOutside = (event) => {
			const dropdown = document.querySelector('.profile-dropdown');
			const profileButton = document.querySelector('.profile-button');
			const languageToggle = document.querySelector('.language-toggle');

			if (dropdown && !dropdown.contains(event.target) &&
				profileButton && !profileButton.contains(event.target)) {
				showDropdown = false;
			}
			
			if (languageToggle && !languageToggle.contains(event.target)) {
				showLanguageDropdown = false;
			}
		};

		window.addEventListener('click', handleClickOutside);

		return () => {
			window.removeEventListener('click', handleClickOutside);
		};
	});


</script>

<!-- Navbar -->
<nav class="navbar navbar-expand-lg sticky-top">
  <div class="container">
    <a href="/" class="navbar-brand-container">
      <div class="logo-circle">
        <img src="/images/OKSlogo.png" alt="OKS Logo" class="oks-logo"/>
      </div>
      <span class="navbar-brand">Orlando Kannada Sangha</span>
    </a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
      <span class="navbar-toggler-icon"></span>
    </button>
      <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
      <ul class="navbar-nav me-3">
        <li class="nav-item"><a class="nav-link {isActive('/') ? 'active' : ''}" href="/"><i class="fas fa-home me-2" aria-hidden="true"></i>Home</a></li>
        <li class="nav-item"><a class="nav-link {isActive('/about') ? 'active' : ''}" href="/about"><i class="fas fa-users me-2" aria-hidden="true"></i>About</a></li>
        <!-- <li class="nav-item"><a class="nav-link {isActive('/events') ? 'active' : ''}" href="/events"><i class="fas fa-calendar-alt me-2" aria-hidden="true"></i>Events</a></li> -->
        <li class="nav-item"><a class="nav-link {isActive('/kannada-kali') ? 'active' : ''}" href="/kannada-kali"><i class="fas fa-book me-2" aria-hidden="true"></i>Kannada Kali</a></li>
        <li class="nav-item"><a class="nav-link {isActive('/gallery') ? 'active' : ''}" href="/gallery"><i class="fas fa-image me-2" aria-hidden="true"></i>Gallery</a></li>
        <li class="nav-item"><a class="nav-link {isActive('/blog') ? 'active' : ''}" href="/blog"><i class="fas fa-blog me-2" aria-hidden="true"></i>Blog</a></li>
        <li class="nav-item"><a class="nav-link" href="#footer"><i class="fas fa-envelope me-2" aria-hidden="true"></i>Contact</a></li>
      </ul>
      
       <!-- Language Toggle -->
       <div class="language-toggle me-3">
         <button 
           class="btn btn-outline-secondary btn-sm language-btn-small" 
           on:click={() => showLanguageDropdown = !showLanguageDropdown}
           aria-expanded={showLanguageDropdown}
           aria-label="Select language"
         >
           <i class="fas fa-globe"></i>
           <!-- <i class="fas fa-chevron-down ms-1 dropdown-arrow" class:rotated={showLanguageDropdown}></i> -->
           <i class="fa-solid fa-caret-down ms-1 dropdown-arrow" class:rotated={showLanguageDropdown}></i>
         </button>
         
         {#if showLanguageDropdown}
           <div class="language-dropdown">
             <button 
               class="language-option" 
               class:active={!isKannada}
               on:click={() => { isKannada = false; showLanguageDropdown = false; }}
             >
               <span class="flag-icon">🇺🇸</span>
               English
             </button>
             <button 
               class="language-option" 
               class:active={isKannada}
               on:click={() => { isKannada = true; showLanguageDropdown = false; }}
             >
               <span class="flag-icon">🇮🇳</span>
               ಕನ್ನಡ
             </button>
           </div>
         {/if}
       </div>
       
       <!-- Profile Section -->
       <div class="profile-section">
        <div class="profile-container">
          <button class="profile-button" on:click={toggleDropdown}>
            <div class="profile-image">
              {#if isLoggedIn}
                <span class="user-initial">{userInitial}</span>
              {:else}
                <i class="fas fa-user"></i>
              {/if}
            </div>
          </button>
          
          <!-- Dropdown Menu -->
          {#if showDropdown}
            <div class="profile-dropdown">
              {#if isLoggedIn}
                <div class="dropdown-header">
                  <div class="user-info">
                    <div class="user-avatar">
                      <span class="user-initial-large">{userInitial}</span>
                    </div>
                    <div class="user-details">
                      <p class="user-name">{userProfile.name}</p>
                      <p class="user-email">{userProfile.email}</p>
                      {#if userProfile.memberSince}
                        <p class="member-duration">
                          <i class="fas fa-calendar-alt me-1"></i>
                          Joined {userProfile.memberSince} ago
                        </p>
                      {/if}
                    </div>
                  </div>
                </div>
                <!-- <div class="dropdown-divider"></div>
							<button class="dropdown-item" on:click={resetPassword}>
								<i class="fas fa-key me-2"></i>Reset Password
							</button> -->
                <div class="dropdown-divider"></div>
                <button class="dropdown-item logout-btn" on:click={handleLogout}>
                  <i class="fas fa-sign-out-alt me-2"></i>Logout
                </button>
              {:else}
                <div class="dropdown-header">
                  <h6>Welcome OKS Member</h6>
                  <p>Please login to access your account</p>
                </div>
                <div class="dropdown-divider"></div>
                <a href="/login" class="dropdown-item login-btn">
				          <i class="fas fa-sign-in-alt me-2"></i>Login
				        </a>
                <a href="/membership" class="dropdown-item">
                  <i class="fas fa-users me-2"></i>Membership
                </a>
              {/if}
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
</nav>



<style>
  /* Navbar Styles */
  .navbar {
    background-color: #ede1cf;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .navbar-brand-container {
    display: flex;
    align-items: center;
    gap: 12px;
    text-decoration: none;
  }

  .logo-circle {
    width: 40px;
    height: 40px;
    border: 2px solid #f26c4f;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #fff2e2 0%, #f0d9b5 100%);
    flex-shrink: 0;
  }

  .oks-logo {
    width: 28px;
    height: 28px;
    object-fit: contain;
    border-radius: 50%;
  }

  .navbar-brand, .nav-link {
    color: #7a1f1f;
    font-weight: bold;
    transition: background-color 0.3s ease, color 0.4s ease;
    border-radius: 8px;
  }

  .navbar-nav .nav-link.active {
    color: #7a1f1f;
    text-decoration: underline;
    text-decoration-color: rgb(255, 162, 0);
    text-decoration-thickness: 3px;
    text-underline-offset: 4px;
  }

  .navbar-nav .nav-link:hover {
    background-color: #7a1f1f;
    color: white;
  }

  .navbar-brand-container:hover {
    transform: scale(1.02);
    transition: transform 0.3s ease;
  }

  .icon {
    margin-right: 0.5rem;
  }

  /* Language Toggle Styles */
  .language-toggle {
    position: relative;
    display: flex;
    align-items: center;
  }

  .language-toggle .btn {
    background: #7a1f1f;
    color: white;
    border: 1px solid #7a1f1f;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
  }

  .language-toggle .btn:hover {
    background: #5a1717;
    border-color: #5a1717;
    transform: translateY(-1px);
  }

  .language-dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    background: white;
    border: 1px solid #dee2e6;
    border-radius: 0.25rem;
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
    z-index: 1000;
    min-width: 120px;
    margin-top: 0.25rem;
  }

  .language-option {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0.375rem 0.5rem;
    border: none;
    background: none;
    text-align: left;
    cursor: pointer;
    transition: background-color 0.15s ease-in-out;
    font-size: 0.875rem;
  }

  .language-option:hover {
    background-color: #f8f9fa;
  }

  .language-option.active {
    background-color: #e9ecef;
    color: #7a1f1f;
    font-weight: 500;
  }

  .flag-icon {
    margin-right: 0.375rem;
    font-size: 0.9em;
  }

  .language-btn-small {
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
  }

  .dropdown-arrow {
    transition: transform 0.3s ease;
  }

  .dropdown-arrow.rotated {
    transform: rotate(180deg);
  }

  /* Mobile responsive */
  @media (max-width: 768px) {
    .language-dropdown {
      right: auto;
      left: 0;
    }
  }

  /* Profile Section Styles */
  .profile-section {
    position: relative;
    margin-left: 0;
  }

  .profile-container {
    position: relative;
    margin-left: 0;
  }

  .profile-button {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    transition: transform 0.2s ease;
  }

  .profile-button:hover {
    transform: scale(1.05);
  }

  .profile-image {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, #7a1f1f 0%, #8a4b4b 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.2rem;
    border: 2px solid #7a1f1f;
    overflow: hidden;
  }

  .profile-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .profile-image i {
    color: white;
  }
  
  .user-initial {
    color: white;
    font-weight: bold;
    font-size: 1.2rem;
    text-align: center;
    line-height: 1;
  }

  /* Dropdown Styles */
  .profile-dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    min-width: 250px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    border: 1px solid #e0e0e0;
    z-index: 1000;
    margin-top: 8px;
    animation: dropdownFadeIn 0.3s ease;
  }

  @keyframes dropdownFadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .dropdown-header {
    padding: 1rem;
    border-bottom: 1px solid #f0f0f0;
  }

  .dropdown-header h6 {
    margin: 0;
    color: #7a1f1f;
    font-weight: 600;
  }

  .dropdown-header p {
    margin: 0.25rem 0 0 0;
    font-size: 0.9rem;
    color: #666;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .user-avatar {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid #7a1f1f;
  }

  .user-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .user-initial-large {
    color: white;
    font-weight: bold;
    font-size: 1.5rem;
    text-align: center;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #7a1f1f 0%, #8a4b4b 100%);
  }

  .user-details {
    flex: 1;
  }

  .user-name {
    margin: 0;
    font-weight: 600;
    color: #7a1f1f;
    font-size: 1rem;
  }

  .user-email {
    margin: 0;
    font-size: 0.85rem;
    color: #666;
  }

  .member-duration {
    margin: 0.25rem 0 0 0;
    font-size: 0.8rem;
    color: #7a1f1f;
    font-weight: 500;
    display: flex;
    align-items: center;
  }

  .member-duration i {
    font-size: 0.75rem;
    margin-right: 0.25rem;
  }

  .dropdown-divider {
    height: 1px;
    background: #f0f0f0;
    margin: 0.5rem 0;
  }

  .dropdown-item {
    display: flex;
    align-items: center;
    padding: 0.75rem 1rem;
    color: #333;
    text-decoration: none;
    transition: background-color 0.2s ease;
    border: none;
    background: none;
    width: 100%;
    text-align: left;
    font-size: 0.95rem;
  }

  .dropdown-item:hover {
    background-color: #f8f9fa;
    color: #7a1f1f;
    text-decoration: none;
  }
  
  .dropdown-item:last-child:hover {
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
  }

  .dropdown-item i {
    width: 16px;
    text-align: center;
  }

  .login-btn, .logout-btn {
    cursor: pointer;
    font-weight: 500;
  }

  .login-btn {
    color: #28a745;
  }


  .login-btn:hover {
    background-color: #d4edda;
    color: #155724;
  }

  .logout-btn {
    color: #dc3545;
  }

  .logout-btn:hover {
    background-color: #f8d7da;
    color: #721c24;
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .navbar-brand {
      font-size: 1rem;
    }
    
    .logo-circle {
      width: 35px;
      height: 35px;
    }
    
    .oks-logo {
      width: 24px;
      height: 24px;
    }
    
    .profile-dropdown {
      right: 50%;
      transform: translateX(50%);
      min-width: 280px;
      max-width: 90vw;
    }
    
    .profile-dropdown.show {
      animation: dropdownFadeInCenter 0.3s ease;
    }
  }
  
  @media (max-width: 480px) {
    .profile-dropdown {
      right: 50%;
      transform: translateX(50%);
      min-width: 260px;
      max-width: 95vw;
      margin-top: 12px;
    }
  }
  
  @keyframes dropdownFadeInCenter {
    from {
      opacity: 0;
      transform: translateX(50%) translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateX(50%) translateY(0);
    }
  }
</style> 