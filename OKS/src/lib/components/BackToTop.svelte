<script>
  import { onMount, onDestroy } from 'svelte';

  let showButton = false;
  let scrollHandler;

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  function handleScroll() {
    // Show button when user scrolls down more than 300px or reaches bottom
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const isNearBottom = scrollTop + windowHeight >= documentHeight - 100; // 100px from bottom
    
    showButton = scrollTop > 300 || isNearBottom;
  }

  onMount(() => {
    scrollHandler = handleScroll;
    window.addEventListener('scroll', scrollHandler);
  });

  onDestroy(() => {
    if (scrollHandler) {
      window.removeEventListener('scroll', scrollHandler);
    }
  });
</script>

{#if showButton}
  <button 
    class="back-to-top-btn"
    on:click={scrollToTop}
    aria-label="Back to top"
    title="Back to top"
    type="button"
  >
    <i class="fas fa-chevron-up" aria-hidden="true"></i>
  </button>
{/if}

<style>
  .back-to-top-btn {
    position: fixed;
    bottom: 20px;
    right: 90px;
    width: 50px;
    height: 50px;
    background-color: #f26c4f;
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    box-shadow: 0 4px 12px rgba(242, 108, 79, 0.4);
    transition: all 0.3s ease;
    z-index: 1000;
    opacity: 0;
    animation: fadeIn 0.3s ease forwards;
  }

  .back-to-top-btn:hover {
    background-color: #e55a3d;
    transform: translateY(-3px);
    box-shadow: 0 6px 16px rgba(242, 108, 79, 0.5);
  }

  .back-to-top-btn:active {
    transform: translateY(-1px);
  }

  .back-to-top-btn:focus {
    outline: 3px solid #f26c4f;
    outline-offset: 2px;
  }

  .back-to-top-btn:focus-visible {
    outline: 3px solid #f26c4f;
    outline-offset: 2px;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Mobile responsive adjustments */
  @media (max-width: 768px) {
    .back-to-top-btn {
      bottom: 15px;
      right: 85px;
      width: 45px;
      height: 45px;
      font-size: 1rem;
    }
  }

  @media (max-width: 480px) {
    .back-to-top-btn {
      bottom: 15px;
      right: 80px;
      width: 40px;
      height: 40px;
      font-size: 0.9rem;
    }
  }
</style> 