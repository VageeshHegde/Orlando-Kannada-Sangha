<script>
  import Navbar from '$lib/components/Navbar.svelte';
  import Hero from '$lib/components/Hero.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { onMount } from 'svelte';
  import { user } from '$lib/stores/auth.js';
  
  // Real authentication state from Supabase
  $: isLoggedIn = !!$user;
  $: memberName = $user ? getUserDisplayName($user) : 'Guest';
  
  // Enhanced name extraction function
  function getUserDisplayName(user) {
    if (!user) return 'Guest';
    
    // Try to get full name from metadata first
    const firstName = user.user_metadata?.first_name || '';
    const lastName = user.user_metadata?.last_name || '';
    
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    } else if (firstName) {
      return firstName;
    } else if (lastName) {
      return lastName;
    }
    
    // Enhanced email parsing for better name extraction
    if (user.email) {
      const emailUser = user.email.split('@')[0];
      
      if (emailUser.includes('.')) {
        // Handle patterns like "john.doe"
        const parts = emailUser.split('.');
        const first = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
        const last = parts[1] ? parts[1].charAt(0).toUpperCase() + parts[1].slice(1) : '';
        return last ? `${first} ${last}` : first;
      } else if (emailUser.includes('_')) {
        // Handle patterns like "john_doe"
        const parts = emailUser.split('_');
        const first = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
        const last = parts[1] ? parts[1].charAt(0).toUpperCase() + parts[1].slice(1) : '';
        return last ? `${first} ${last}` : first;
      } else {
        // Simple capitalization
        return emailUser.charAt(0).toUpperCase() + emailUser.slice(1);
      }
    }
    
    return 'Member';
  }

  // Blog posts data
  let blogPosts = [
    {
      id: 1,
      title: "Celebrating Kannada Rajyotsava: A Journey Through Karnataka's Rich Heritage",
      excerpt: "Join us as we explore the significance of Kannada Rajyotsava and how our community celebrates this important day. From traditional music performances to cultural exhibitions, discover the vibrant traditions that make Karnataka unique.",
      author: "Dr. Rajesh Kumar",
      date: "November 1, 2024",
      category: "Culture",
      featured: true,
      readTime: "5 min read",
      thumbnail: "/images/Karnataka.png",
      tags: ["Kannada Rajyotsava", "Karnataka", "Culture", "Heritage"]
    },
    {
      id: 2,
      title: "The Art of Yakshagana: Preserving Traditional Theater",
      excerpt: "Explore the ancient art form of Yakshagana and its significance in Kannada culture. Learn about the intricate costumes, music, and storytelling that make this traditional theater so captivating.",
      author: "Priya Sharma",
      date: "October 28, 2024",
      category: "Heritage",
      featured: false,
      readTime: "4 min read",
      thumbnail: "/images/Yakshagana.png",
      tags: ["Yakshagana", "Traditional Theater", "Karnataka", "Art"]
    },
    {
      id: 3,
      title: "Kannada Language Learning: Tips for Beginners",
      excerpt: "Starting your journey with Kannada? Here are some practical tips and resources to help you learn this beautiful language effectively and connect with the community.",
      author: "Prof. Anil Rao",
      date: "October 25, 2024",
      category: "Language",
      featured: false,
      readTime: "6 min read",
      thumbnail: "/images/Kannada-Academy.png",
      tags: ["Kannada Language", "Learning", "Education", "Tips"]
    },
    {
      id: 4,
      title: "Community Spotlight: Meet Our Young Cultural Ambassadors",
      excerpt: "Discover the inspiring stories of young community members who are actively preserving and promoting Kannada culture in their schools and neighborhoods.",
      author: "Meera Patel",
      date: "October 22, 2024",
      category: "Community",
      featured: false,
      readTime: "3 min read",
      thumbnail: "/images/OKS2.jpg",
      tags: ["Community", "Youth", "Culture", "Ambassadors"]
    },
    {
      id: 5,
      title: "Festival of Lights: Deepavali Celebrations in Our Community",
      excerpt: "A beautiful recap of our community's Deepavali celebrations, featuring traditional decorations, cultural performances, and the spirit of togetherness.",
      author: "Ravi Kumar",
      date: "October 18, 2024",
      category: "Events",
      featured: false,
      readTime: "4 min read",
      thumbnail: "/images/OKS4.jpeg",
      tags: ["Deepavali", "Festival", "Community", "Celebrations"]
    },
    {
      id: 6,
      title: "Karnataka Cuisine: A Culinary Journey Through the State",
      excerpt: "From Bisi Bele Bath to Mysore Pak, explore the diverse and delicious cuisine of Karnataka and learn about the cultural significance of these traditional dishes.",
      author: "Chef Lakshmi",
      date: "October 15, 2024",
      category: "Culture",
      featured: false,
      readTime: "7 min read",
      thumbnail: "/images/OKS5.jpeg",
      tags: ["Cuisine", "Karnataka", "Food", "Culture"]
    },
    {
      id: 7,
      title: "Hampi: The Ancient City of Vijayanagara Empire",
      excerpt: "Explore the magnificent ruins of Hampi, a UNESCO World Heritage Site that showcases the grandeur of the Vijayanagara Empire and its architectural marvels.",
      author: "Dr. Suresh Rao",
      date: "October 12, 2024",
      category: "Heritage",
      featured: false,
      readTime: "8 min read",
      thumbnail: "/images/Hampi.png",
      tags: ["Hampi", "Vijayanagara", "Heritage", "Architecture"]
    },
    {
      id: 8,
      title: "Digital Preservation: Documenting Our Cultural Heritage",
      excerpt: "Learn about our ongoing efforts to digitize and preserve Kannada cultural artifacts, stories, and traditions for future generations.",
      author: "Tech Team",
      date: "October 10, 2024",
      category: "Technology",
      featured: false,
      readTime: "5 min read",
      thumbnail: "/images/OKS6.jpeg",
      tags: ["Digital", "Preservation", "Technology", "Heritage"]
    }
  ];

  // Pagination settings
  let currentPage = 1;
  const postsPerPage = 4;
  
  // Get all posts sorted by date (most recent first)
  $: allPosts = blogPosts.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB - dateA; // Most recent first
  });

  // Calculate pagination
  $: totalPages = Math.ceil(allPosts.length / postsPerPage);
  $: startIndex = (currentPage - 1) * postsPerPage;
  $: endIndex = startIndex + postsPerPage;
  $: currentPosts = allPosts.slice(startIndex, endIndex);

  // Pagination functions
  function goToPage(page) {
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
      // Scroll to top of blog content
      document.querySelector('main').scrollIntoView({ behavior: 'smooth' });
    }
  }

  function previousPage() {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  }

  function nextPage() {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  }
</script>

<svelte:head>
  <title>Blog - Orlando Kannada Sangha</title>
  <meta name="description" content="Discover stories, insights, and updates from the Kannada community. Stay connected with our cultural heritage and community events." />
</svelte:head>

<Navbar />

<!-- Hero Section -->
<Hero 
  page="Blog" 
  leftImage="/images/Disney-castle.png"
  rightImage="/images/Yakshagana.png"
  topLeftImage="/images/Karnataka.png"
  bottomRightImage="/images/mysore-palace-vector.svg"
/>

<!-- Blog Content -->
<main class="container my-5">
  <div class="row">
    <div class="col-12">
      <h1 class="text-center mb-4">Our Blog</h1>
      <h2 class="text-center mb-4" style="font-family: 'Noto Sans Kannada', sans-serif; color: #7a1f1f;">ನಮ್ಮ ಬ್ಲಾಗ್</h2>
    </div>
  </div>
  
  <!-- Login Required Notice -->
  {#if !isLoggedIn}
    <div class="login-notice mb-4">
      <div class="alert alert-warning" role="alert">
        <div class="d-flex align-items-center">
          <i class="fas fa-lock me-3"></i>
          <div class="flex-grow-1">
            <h5 class="alert-heading mb-2">Member Access Required</h5>
            <p class="mb-3">To view our blog posts, you must be a registered member of Orlando Kannada Sangha.</p>
            <p class="mb-3">If you are a member, please login to access the blog.</p>
            <div class="d-flex gap-2">
              <a href="https://www.zeffy.com/en-US/ticketing/oks-membership--2026" target="_blank" class="btn btn-primary">
                <i class="fas fa-user-plus me-2"></i>Become a Member
              </a>
              <a href="/login" class="btn btn-outline-primary">
                <i class="fas fa-sign-in-alt me-2"></i>Login
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  {:else}
  
  <!-- Blog Posts List -->
  <div class="row">
    <div class="col-12">
      {#each currentPosts as post}
        <article class="blog-post-card">
          <div class="blog-post-image">
            <img src="/images/OKSlogo.png" alt="OKS Logo" class="post-thumbnail" />
          </div>
          <div class="blog-post-content">
            <h3 class="post-title">{post.title}</h3>
            <div class="post-meta">
              <span class="post-date">{post.date}</span>
              <span class="post-separator">|</span>
              <span class="post-category">{post.category}</span>
              <span class="post-separator">|</span>
              <span class="post-author">By {post.author}</span>
            </div>
            <p class="post-excerpt">{post.excerpt}</p>
            <a href="/blog/{post.id}" class="read-more-link">Read more...</a>
          </div>
        </article>
      {/each}
    </div>
  </div>
  {/if}
</main>

<!-- Pagination -->
{#if isLoggedIn}
<section class="pagination-section">
  <div class="container">
    <div class="row">
      <div class="col-12 d-flex justify-content-center">
        <nav aria-label="Page navigation example">
          <ul class="pagination">
            <li class="page-item {currentPage === 1 ? 'disabled' : ''}">
              <button class="page-link" on:click={previousPage} aria-label="Previous" disabled={currentPage === 1}>
                <span aria-hidden="true">&laquo;</span>
              </button>
            </li>
            {#each Array(totalPages) as _, i}
              <li class="page-item {currentPage === i + 1 ? 'active' : ''}">
                <button class="page-link" on:click={() => goToPage(i + 1)}>{i + 1}</button>
              </li>
            {/each}
            <li class="page-item {currentPage === totalPages ? 'disabled' : ''}">
              <button class="page-link" on:click={nextPage} aria-label="Next" disabled={currentPage === totalPages}>
                <span aria-hidden="true">&raquo;</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</section>
{/if}

<Footer />

<style>

  /* Blog Post Card */
  .blog-post-card {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    margin-bottom: 2rem;
    overflow: hidden;
    display: flex;
    transition: box-shadow 0.3s ease;
    min-height: 150px;
  }

  .blog-post-card:hover {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  }

  /* Blog Post Image */
  .blog-post-image {
    flex: 0 0 200px;
    height: 100%;
    overflow: hidden;
    position: relative;
  }

  .post-thumbnail {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 8px 0 0 8px;
    background-color: #f0d9b5;
    padding: 20px;
  }

  /* Blog Post Content */
  .blog-post-content {
    flex: 1;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
  }

  .post-title {
    font-size: 1.2rem;
    font-weight: bold;
    color: #7a1f1f;
    margin-bottom: 0.5rem;
    line-height: 1.4;
  }

  .post-meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
    font-size: 0.9rem;
    color: #666;
  }

  .post-date {
    color: #986c2f;
    font-weight: 500;
  }

  .post-separator {
    color: #ccc;
  }

  .post-category {
    text-transform: uppercase;
    font-weight: 600;
    color: #7a1f1f;
  }

  .post-author {
    font-style: italic;
    color: #666;
  }

  .post-excerpt {
    color: #555;
    line-height: 1.6;
    margin-bottom: 1rem;
    flex-grow: 1;
  }

  .read-more-link {
    color: #007bff;
    text-decoration: none;
    font-weight: 500;
    align-self: flex-start;
    transition: color 0.3s ease;
  }

  .read-more-link:hover {
    color: #0056b3;
    text-decoration: underline;
  }

  /* Pagination Styles */
  .pagination-section {
    padding: 0;
  }

  .pagination .page-link {
    color: #7a1f1f;
    border-color: #d4b07c;
    padding: 0.75rem 1rem;
    font-weight: 600;
    transition: all 0.3s ease;
  }

  .pagination .page-item.active .page-link {
    background-color: #7a1f1f;
    border-color: #7a1f1f;
    color: white;
  }

  .pagination .page-link:hover {
    background-color: #f0d9b5;
    border-color: #7a1f1f;
    color: #7a1f1f;
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .blog-post-card {
      flex-direction: column;
    }

    .blog-post-image {
      flex: none;
      height: 200px;
    }

    .post-thumbnail {
      border-radius: 8px 8px 0 0;
    }

  }

  @media (max-width: 576px) {
    .blog-post-content {
      padding: 1rem;
    }

    .post-title {
      font-size: 1.1rem;
    }

    .post-meta {
      font-size: 0.8rem;
    }
  }

  /* Login Notice Styles */
  .login-notice .alert {
    border: 2px solid #ffc107;
    border-radius: 12px;
    background: linear-gradient(135deg, #fff3cd, #ffeaa7);
    box-shadow: 0 4px 15px rgba(255, 193, 7, 0.2);
  }

  .login-notice .alert-heading {
    color: #856404;
    font-weight: 600;
    font-size: 1.2rem;
  }

  .login-notice .alert p {
    color: #856404;
    font-size: 1rem;
    margin-bottom: 0;
  }

  .login-notice .btn-primary {
    background-color: #7a1f1f;
    border-color: #7a1f1f;
    font-weight: 600;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    transition: all 0.3s ease;
  }

  .login-notice .btn-primary:hover {
    background-color: #5a1515;
    border-color: #5a1515;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(122, 31, 31, 0.3);
  }

  .login-notice .btn-outline-primary {
    color: #7a1f1f;
    border-color: #7a1f1f;
    font-weight: 600;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    transition: all 0.3s ease;
    text-align: center;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .login-notice .btn-outline-primary:hover {
    background-color: #7a1f1f;
    border-color: #7a1f1f;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(122, 31, 31, 0.3);
  }

  .login-notice i.fa-lock {
    font-size: 2rem;
    color: #856404;
  }

  /* Add extra margin-bottom to blog page alert */
  .login-notice {
    margin-bottom: 5rem !important;
  }
</style>