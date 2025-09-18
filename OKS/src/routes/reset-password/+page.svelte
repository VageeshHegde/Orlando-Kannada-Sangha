<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { supabase } from '$lib/supabase.js';
  import { user, loading as authLoading } from '$lib/stores/auth.js';

  let newPassword = '';
  let confirmPassword = '';
  let loading = false;
  let errorMessage = '';
  let successMessage = '';
  let isFirstTimeUser = false;
  let isForgotPassword = false;
  let isCheckingAuth = true;
  
  // Wait for auth to finish loading before checking
  $: if (!$authLoading && typeof window !== 'undefined') {
    if (!$user) {
      // Auth finished loading but no user - redirect to login
      goto('/login');
    } else {
      // User is authenticated - stop checking
      isCheckingAuth = false;
    }
  }
  
  onMount(() => {
    // Check if this is a forgot password flow (from email link)
    // Supabase sends tokens in URL hash, not search params
    const urlHash = window.location.hash;
    const urlParams = new URLSearchParams(window.location.search);
    
    // Check for tokens in hash (Supabase standard)
    if (urlHash.includes('access_token=') && urlHash.includes('refresh_token=')) {
      // This is a forgot password flow from email link
      isForgotPassword = true;
      isCheckingAuth = false;
      return;
    }
    
    // Also check search params as fallback
    const accessToken = urlParams.get('access_token');
    const refreshToken = urlParams.get('refresh_token');
    
    if (accessToken && refreshToken) {
      // This is a forgot password flow from email link
      isForgotPassword = true;
      isCheckingAuth = false;
      return;
    }
    
    // Wait a bit for auth to initialize, then check
    setTimeout(() => {
      if (!$authLoading && !$user) {
        // Auth finished loading but no user - redirect to login
        goto('/login');
        return;
      }
      
      if ($user) {
        // User is logged in, they can set a new password
        isFirstTimeUser = false;
      }
    }, 100); // Small delay to let auth initialize
  });

    // Handle form submission
    async function handleSubmit() {
    
    if (!newPassword || !confirmPassword) {
      errorMessage = 'Please fill in all required fields';
      return;
    }

    if (newPassword !== confirmPassword) {
      errorMessage = 'New passwords do not match';
      return;
    }

    if (newPassword.length < 6) {
      errorMessage = 'Password must be at least 6 characters';
      return;
    }

    loading = true;
    errorMessage = '';

      try {

      // Update password using Supabase
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) {
        errorMessage = updateError.message || 'Failed to reset password';
      } else {
        successMessage = 'Password updated successfully!';
        setTimeout(() => {
          goto('/');
        }, 2000);
      }
    } catch (error) {
      errorMessage = error.message || 'Failed to reset password';
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>{isForgotPassword ? 'Reset Password' : (isFirstTimeUser ? 'Set Password' : 'Change Password')} - Orlando Kannada Sangha</title>
</svelte:head>

<div class="reset-password-container">
  <div class="reset-password-form-container">
    <div class="form-card">
      {#if isCheckingAuth}
        <div class="auth-checking">
          <div class="spinner-container">
            <i class="fas fa-spinner fa-spin"></i>
          </div>
          <p>Checking authentication...</p>
        </div>
      {:else}
      <div class="reset-password-header">
        <div class="logo-container">
          <img class="logo" src="/images/OKSlogo.png" alt="OKS Logo" />
        </div>
        <h1 class="page-title">
          {isForgotPassword ? 'Reset Your Password' : (isFirstTimeUser ? 'Set Your Password' : 'Change Your Password')}
        </h1>
        <p class="page-subtitle">
          {isForgotPassword 
            ? 'You\'ve been redirected here from your password reset email. Please enter a new password below.'
            : (isFirstTimeUser 
              ? 'Welcome! Please set your password below.'
              : 'To change your password, enter a new password below.'
            )
          }
        </p>
      </div>
      
      <!-- Back to Home Link -->
      <div class="back-to-home">
        <a href="/" class="back-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m12 19-7-7 7-7"/>
            <path d="M19 12H5"/>
          </svg>
          Back to Home
        </a>
      </div>
        <form class="password-form" on:submit|preventDefault={handleSubmit}>

        <div class="form-group">
          <label for="new-password" class="form-label">
            <i class="fas fa-key me-2"></i>
            {isFirstTimeUser ? 'Password' : 'New Password'}
          </label>
          <div class="input-container">
            <input
              id="new-password"
              name="new-password"
              type="password"
              required
              bind:value={newPassword}
              class="form-input"
              placeholder={isFirstTimeUser ? 'Enter your password' : 'Enter new password'}
            />
          </div>
        </div>

        <div class="form-group">
          <label for="confirm-password" class="form-label">
            <i class="fas fa-check-circle me-2"></i>
            {isFirstTimeUser ? 'Confirm Password' : 'Confirm New Password'}
          </label>
          <div class="input-container">
            <input
              id="confirm-password"
              name="confirm-password"
              type="password"
              required
              bind:value={confirmPassword}
              class="form-input"
              placeholder={isFirstTimeUser ? 'Confirm your password' : 'Confirm new password'}
            />
          </div>
        </div>

        {#if errorMessage}
          <div class="alert alert-error">
            <div class="alert-content">
              <div class="alert-icon">
                <i class="fas fa-exclamation-triangle"></i>
              </div>
              <div class="alert-text">
                <h3>Error</h3>
                <p>{errorMessage}</p>
              </div>
            </div>
          </div>
        {/if}

        {#if successMessage}
          <div class="alert alert-success">
            <div class="alert-content">
              <div class="alert-icon">
                <i class="fas fa-check-circle"></i>
              </div>
              <div class="alert-text">
                <h3>Success!</h3>
                <p>{successMessage}</p>
              </div>
            </div>
          </div>
        {/if}

        <div class="form-actions">
          <button
            type="submit"
            disabled={loading}
            class="submit-button"
          >
            {#if loading}
              <i class="fas fa-spinner fa-spin me-2"></i>
              {isForgotPassword ? 'Resetting Password...' : (isFirstTimeUser ? 'Setting Password...' : 'Changing Password...')}
            {:else}
              <i class="fas fa-save me-2"></i>
              {isForgotPassword ? 'Reset Password' : (isFirstTimeUser ? 'Set Password' : 'Change Password')}
            {/if}
          </button>
        </div>
      </form>
      {/if}
    </div>
  </div>
</div>

<style>
  .reset-password-container {
    min-height: calc(100vh - 120px);
    background: linear-gradient(to bottom, #ede1cf 0%, #f0e6d7 40%, #f5ede1 100%);
    padding: 60px 0;
    display: flex;
    align-items: center;
  }

  .reset-password-form-container {
    width: 100%;
    max-width: 450px;
    margin: 0 auto;
  }

  .form-card {
    background: white;
    border-radius: 20px;
    padding: 40px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(242, 108, 79, 0.1);
  }

  .reset-password-header {
    text-align: center;
    margin-bottom: 30px;
  }

  .logo-container {
    margin-bottom: 20px;
  }

  .logo {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    border: 4px solid #f26c4f;
    padding: 10px;
    background: linear-gradient(135deg, #fff2e2 0%, #f0d9b5 100%);
    display: block;
    margin: 0 auto;
    object-fit: contain;
    object-position: center;
  }

  .page-title {
    color: #7a1f1f;
    font-weight: bold;
    margin-bottom: 8px;
    font-size: 28px;
  }

  .page-subtitle {
    color: #666;
    margin-bottom: 0;
    font-size: 16px;
  }


  .password-form {
    margin-bottom: 30px;
  }

  .form-group {
    margin-bottom: 20px;
  }

  .form-label {
    color: #7a1f1f;
    font-weight: 600;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
  }

  .form-label i {
    color: #f26c4f;
    margin-right: 8px;
  }

  .input-container {
    position: relative;
  }

  .form-input {
    width: 100%;
    border-color: #ddd;
    padding: 12px 15px;
    font-size: 16px;
    transition: all 0.3s ease;
    border: 1px solid #ddd;
    border-radius: 8px;
  }

  .form-input:focus {
    outline: none;
    border-color: #f26c4f;
    box-shadow: 0 0 0 0.2rem rgba(242, 108, 79, 0.25);
  }

  .form-input::placeholder {
    color: #999;
  }

  .alert {
    border-radius: 12px;
    padding: 1.2rem;
    margin: 1rem 0;
  }

  .alert-content {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
  }

  .alert-icon {
    font-size: 1.2rem;
    margin-top: 0.1rem;
  }

  .alert-text h3 {
    font-weight: 600;
    margin-bottom: 0.3rem;
    font-size: 1rem;
  }

  .alert-text p {
    margin: 0;
    line-height: 1.4;
  }

  .alert-error {
    background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
    border: 1px solid #f44336;
    color: #c62828;
  }

  .alert-error .alert-icon {
    color: #d32f2f;
  }

  .alert-success {
    background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
    border: 1px solid #4caf50;
    color: #2e7d32;
  }

  .alert-success .alert-icon {
    color: #388e3c;
  }

  .form-actions {
    margin-top: 20px;
  }

  .submit-button {
    width: 100%;
    background: linear-gradient(135deg, #f26c4f 0%, #d4572f 100%);
    color: white;
    border: none;
    border-radius: 10px;
    padding: 15px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .submit-button:hover:not(:disabled) {
    background: linear-gradient(135deg, #d4572f 0%, #b8472a 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(242, 108, 79, 0.3);
  }

  .submit-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }


  .back-to-home {
    text-align: center;
    margin-bottom: 1.5rem;
  }
  
  .back-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: #f26c4f;
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 500;
    transition: all 0.3s ease;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    border: 1px solid transparent;
  }
  
  .back-link:hover {
    color: #e55a3f;
    background-color: rgba(242, 108, 79, 0.05);
    border-color: rgba(242, 108, 79, 0.2);
    text-decoration: none;
  }
  
  .back-link svg {
    transition: transform 0.3s ease;
  }
  
  .back-link:hover svg {
    transform: translateX(-2px);
  }


  .auth-checking {
    text-align: center;
    padding: 3rem 2rem;
  }

  .spinner-container {
    font-size: 2rem;
    color: #f26c4f;
    margin-bottom: 1rem;
  }

  .auth-checking p {
    color: #666;
    font-size: 1.1rem;
    margin: 0;
  }


  /* Responsive Design */
  @media (max-width: 768px) {
    .reset-password-container {
      padding: 1rem;
    }

    .form-card {
      padding: 2rem 1.5rem;
      border-radius: 16px;
    }

    .page-title {
      font-size: 2rem;
    }

    .page-subtitle {
      font-size: 1rem;
    }

    .logo {
      height: 60px;
    }
  }

  @media (max-width: 480px) {
    .form-card {
      padding: 1.5rem 1rem;
    }

    .page-title {
      font-size: 1.8rem;
    }

    .form-input {
      padding: 0.9rem 1rem;
    }

    .submit-button {
      padding: 1rem 1.5rem;
      font-size: 1rem;
    }
  }
</style>