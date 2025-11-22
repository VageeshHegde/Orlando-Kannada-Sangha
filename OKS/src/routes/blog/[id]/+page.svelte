<script>
  import Navbar from '$lib/components/Navbar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';

  // Blog posts data (in a real app, this would come from a database or API)
  const blogPosts = [
    {
      id: 1,
      title: "Celebrating Kannada Rajyotsava: A Journey Through Karnataka's Rich Heritage",
      content: `
        <p>Kannada Rajyotsava, celebrated on November 1st every year, marks the formation of the state of Karnataka in 1956. This significant day brings together millions of Kannadigas worldwide to celebrate their rich cultural heritage, language, and traditions.</p>
        
        <h3>The Historical Significance</h3>
        <p>The formation of Karnataka was a result of the States Reorganization Act of 1956, which reorganized states based on linguistic lines. This day commemorates the unification of Kannada-speaking regions, creating a strong cultural identity for the people of Karnataka.</p>
        
        <h3>Community Celebrations</h3>
        <p>Our Orlando Kannada Sangha community comes together every year to celebrate this auspicious day with great enthusiasm. The celebrations include:</p>
        
        <ul>
          <li>Traditional music and dance performances</li>
          <li>Cultural exhibitions showcasing Karnataka's heritage</li>
          <li>Kannada language competitions for children</li>
          <li>Traditional food stalls featuring authentic Karnataka cuisine</li>
          <li>Fashion shows displaying traditional attire</li>
        </ul>
        
        <h3>Preserving Our Heritage</h3>
        <p>As a community living abroad, it's crucial for us to maintain our connection to our roots. Kannada Rajyotsava serves as a reminder of our responsibility to preserve and pass on our cultural heritage to the next generation.</p>
        
        <p>Through various cultural programs and educational initiatives, we ensure that our children understand the significance of their heritage and develop pride in their Kannada identity.</p>
        
        <h3>Looking Forward</h3>
        <p>As we celebrate another year of Karnataka's formation, we look forward to continuing our mission of promoting Kannada culture, language, and traditions in the Orlando community. Together, we can ensure that our rich heritage continues to thrive for generations to come.</p>
      `,
      author: "Dr. Rajesh Kumar",
      date: "November 1, 2024",
      category: "Culture",
      readTime: "5 min read",
      tags: ["Kannada Rajyotsava", "Karnataka", "Culture", "Heritage"]
    },
    {
      id: 2,
      title: "The Art of Yakshagana: Preserving Traditional Theater",
      content: `
        <p>Yakshagana is a traditional theater form that originated in Karnataka over 500 years ago. This vibrant art form combines dance, music, dialogue, costume, make-up, and stage techniques to create a unique theatrical experience.</p>
        
        <h3>Origins and History</h3>
        <p>Yakshagana literally means "song of the celestial beings" and has its roots in the Bhakti movement. It evolved from various art forms and became a distinct theatrical tradition in the coastal regions of Karnataka.</p>
        
        <h3>Key Elements</h3>
        <p>The art form is characterized by several distinctive features:</p>
        
        <ul>
          <li><strong>Costumes:</strong> Elaborate and colorful costumes that reflect the character's nature</li>
          <li><strong>Make-up:</strong> Intricate facial make-up that transforms actors into divine or demonic characters</li>
          <li><strong>Music:</strong> Traditional instruments like maddale, chande, and harmonium</li>
          <li><strong>Dance:</strong> Stylized movements that convey emotions and actions</li>
          <li><strong>Stories:</strong> Primarily based on Hindu epics and Puranas</li>
        </ul>
        
        <h3>Modern Relevance</h3>
        <p>Despite being centuries old, Yakshagana continues to captivate audiences today. Modern adaptations have made it more accessible while preserving its traditional essence. Our community has been fortunate to host several Yakshagana performances, bringing this ancient art form to Orlando.</p>
        
        <h3>Learning and Preservation</h3>
        <p>Several organizations and individuals are working tirelessly to preserve and promote Yakshagana. Workshops and training programs help younger generations learn this art form, ensuring its survival for future generations.</p>
      `,
      author: "Priya Sharma",
      date: "October 28, 2024",
      category: "Heritage",
      readTime: "4 min read",
      tags: ["Yakshagana", "Traditional Theater", "Karnataka", "Art"]
    },
    {
      id: 3,
      title: "Kannada Language Learning: Tips for Beginners",
      content: `
        <p>Learning Kannada can be a rewarding experience, whether you're connecting with your heritage or exploring a new language. Here are some practical tips to help you get started on your Kannada learning journey.</p>
        
        <h3>Start with the Basics</h3>
        <p>Begin by learning the Kannada script (Kannada alphabet). Understanding the script is crucial as it will help you read and write in Kannada. Practice writing each letter and familiarize yourself with the sounds.</p>
        
        <h3>Essential Learning Resources</h3>
        <ul>
          <li><strong>Online Courses:</strong> Several platforms offer structured Kannada courses</li>
          <li><strong>Mobile Apps:</strong> Language learning apps with Kannada modules</li>
          <li><strong>Books:</strong> Traditional textbooks and workbooks</li>
          <li><strong>Videos:</strong> YouTube channels dedicated to Kannada learning</li>
          <li><strong>Community Classes:</strong> Local language classes in your area</li>
        </ul>
        
        <h3>Practice Strategies</h3>
        <p>Consistent practice is key to language learning success:</p>
        
        <ul>
          <li>Set aside 15-30 minutes daily for practice</li>
          <li>Use flashcards for vocabulary building</li>
          <li>Practice speaking with native speakers</li>
          <li>Watch Kannada movies with subtitles</li>
          <li>Listen to Kannada music and podcasts</li>
        </ul>
        
        <h3>Common Challenges and Solutions</h3>
        <p>Many learners face similar challenges when starting Kannada:</p>
        
        <ul>
          <li><strong>Script Difficulty:</strong> Start with printed materials before moving to handwritten text</li>
          <li><strong>Pronunciation:</strong> Practice with audio resources and native speakers</li>
          <li><strong>Grammar:</strong> Focus on practical usage rather than complex grammar rules initially</li>
        </ul>
        
        <h3>Community Support</h3>
        <p>Our Orlando Kannada Sangha offers language classes and cultural programs that can support your learning journey. Connecting with the community provides real-world practice opportunities and cultural context.</p>
      `,
      author: "Prof. Anil Rao",
      date: "October 25, 2024",
      category: "Language",
      readTime: "6 min read",
      tags: ["Kannada Language", "Learning", "Education", "Tips"]
    }
  ];

  let currentPost = null;
  let relatedPosts = [];

  // Get the current post based on the URL parameter
  $: {
    const postId = parseInt($page.params.id);
    currentPost = blogPosts.find(post => post.id === postId);
    
    if (currentPost) {
      // Get related posts (same category, excluding current post)
      relatedPosts = blogPosts
        .filter(post => post.category === currentPost.category && post.id !== currentPost.id)
        .slice(0, 3);
    }
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
</script>

<svelte:head>
  <title>{currentPost ? currentPost.title : 'Blog Post'} - Orlando Kannada Sangha</title>
  <meta name="description" content={currentPost ? currentPost.content.replace(/<[^>]*>/g, '').substring(0, 160) : 'Read our latest blog post'} />
  <meta name="keywords" content="Orlando Kannada Sangha blog post, OKS blog, Kannada community article, Kannada culture story, community news" />
</svelte:head>

<Navbar />

{#if currentPost}
  <!-- Blog Post Header -->
  <section class="post-header">
    <div class="container">
      <div class="row">
        <div class="col-lg-8 mx-auto">
          <div class="post-meta">
            <span class="post-category">{currentPost.category}</span>
            <time class="post-date" datetime={currentPost.date}>
              <i class="fas fa-calendar-alt me-2"></i>{formatDate(currentPost.date)}
            </time>
            <span class="post-read-time">
              <i class="fas fa-clock me-2"></i>{currentPost.readTime}
            </span>
          </div>
          <h1 class="post-title">{currentPost.title}</h1>
          <div class="post-author">
            <i class="fas fa-user me-2"></i>By {currentPost.author}
          </div>
          {#if currentPost.thumbnail}
            <div class="post-thumbnail">
              <img src={currentPost.thumbnail} alt={currentPost.title} class="post-header-image" />
            </div>
          {/if}
        </div>
      </div>
    </div>
  </section>

  <!-- Blog Post Content -->
  <section class="post-content">
    <div class="container">
      <div class="row">
        <div class="col-lg-8 mx-auto">
          <article class="post-article">
            {@html currentPost.content}
          </article>
          
          <!-- Tags -->
          {#if currentPost.tags && currentPost.tags.length > 0}
            <div class="post-tags">
              <h4>Tags:</h4>
              <div class="tags-list">
                {#each currentPost.tags as tag}
                  <span class="tag">{tag}</span>
                {/each}
              </div>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </section>

  <!-- Related Posts -->
  {#if relatedPosts.length > 0}
    <section class="related-posts">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <h3 class="related-title">
              <i class="fas fa-bookmark me-2"></i>Related Posts
            </h3>
          </div>
        </div>
        <div class="row">
          {#each relatedPosts as post}
            <div class="col-lg-4 col-md-6 mb-4">
              <div class="related-post-card">
                <div class="related-post-category">{post.category}</div>
                <h4 class="related-post-title">
                  <a href="/blog/{post.id}">{post.title}</a>
                </h4>
                <div class="related-post-meta">
                  <span class="meta-item">
                    <i class="fas fa-calendar-alt me-1"></i>{formatDate(post.date)}
                  </span>
                  <span class="meta-item">
                    <i class="fas fa-user me-1"></i>{post.author}
                  </span>
                </div>
                <a href="/blog/{post.id}" class="btn btn-outline-primary btn-sm">
                  Read More <i class="fas fa-arrow-right ms-1"></i>
                </a>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </section>
  {/if}

  <!-- Back to Blog -->
  <section class="back-to-blog">
    <div class="container">
      <div class="row">
        <div class="col-12 text-center">
          <a href="/blog" class="btn btn-primary">
            <i class="fas fa-arrow-left me-2"></i>Back to Blog
          </a>
        </div>
      </div>
    </div>
  </section>

{:else}
  <!-- Post Not Found -->
  <section class="post-not-found">
    <div class="container">
      <div class="row">
        <div class="col-12 text-center">
          <h1>Post Not Found</h1>
          <p>The blog post you're looking for doesn't exist.</p>
          <a href="/blog" class="btn btn-primary">
            <i class="fas fa-arrow-left me-2"></i>Back to Blog
          </a>
        </div>
      </div>
    </div>
  </section>
{/if}

<Footer />

<style>
  /* Post Header Styles */
  .post-header {
    background: linear-gradient(135deg, #f0d9b5 0%, #ede1cf 100%);
    padding: 4rem 0 3rem;
    border-bottom: 3px solid #7a1f1f;
  }

  .post-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
    align-items: center;
  }

  .post-category {
    background-color: #7a1f1f;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 600;
  }

  .post-date,
  .post-read-time {
    color: #8a4b4b;
    font-size: 0.95rem;
    display: flex;
    align-items: center;
  }

  .post-title {
    color: #7a1f1f;
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 1.5rem;
    line-height: 1.3;
  }

  .post-author {
    color: #8a4b4b;
    font-size: 1.1rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    margin-bottom: 2rem;
  }

  .post-thumbnail {
    margin-top: 2rem;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }

  .post-header-image {
    width: 100%;
    height: 300px;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .post-header-image:hover {
    transform: scale(1.02);
  }

  /* Post Content Styles */
  .post-content {
    padding: 3rem 0;
    background-color: #fefaf4;
  }

  .post-article {
    background-color: white;
    border: 2px solid #d4b07c;
    border-radius: 12px;
    padding: 3rem;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }

  .post-article :global(h3) {
    color: #7a1f1f;
    font-size: 1.8rem;
    font-weight: bold;
    margin: 2rem 0 1rem 0;
    border-bottom: 2px solid #f0d9b5;
    padding-bottom: 0.5rem;
  }

  .post-article :global(p) {
    color: #4c2e2e;
    font-size: 1.1rem;
    line-height: 1.7;
    margin-bottom: 1.5rem;
  }

  .post-article :global(ul) {
    color: #4c2e2e;
    font-size: 1.1rem;
    line-height: 1.7;
    margin-bottom: 1.5rem;
    padding-left: 2rem;
  }

  .post-article :global(li) {
    margin-bottom: 0.5rem;
  }

  .post-article :global(strong) {
    color: #7a1f1f;
    font-weight: 600;
  }

  /* Tags Styles */
  .post-tags {
    margin-top: 3rem;
    padding-top: 2rem;
    border-top: 2px solid #f0d9b5;
  }

  .post-tags h4 {
    color: #7a1f1f;
    font-size: 1.3rem;
    margin-bottom: 1rem;
  }

  .tags-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .tag {
    background-color: #f0d9b5;
    color: #7a1f1f;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 500;
  }

  /* Related Posts Styles */
  .related-posts {
    padding: 3rem 0;
    background-color: #fff2e2;
  }

  .related-title {
    color: #7a1f1f;
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 2rem;
    text-align: center;
  }

  .related-post-card {
    background-color: white;
    border: 2px solid #d4b07c;
    border-radius: 12px;
    padding: 1.5rem;
    height: 100%;
    transition: all 0.3s ease;
  }

  .related-post-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    border-color: #7a1f1f;
  }

  .related-post-category {
    background-color: #f0d9b5;
    color: #7a1f1f;
    padding: 0.25rem 0.75rem;
    border-radius: 15px;
    font-size: 0.8rem;
    font-weight: 600;
    display: inline-block;
    margin-bottom: 1rem;
  }

  .related-post-title {
    margin-bottom: 1rem;
  }

  .related-post-title a {
    color: #7a1f1f;
    text-decoration: none;
    font-size: 1.2rem;
    font-weight: 600;
    line-height: 1.4;
  }

  .related-post-title a:hover {
    color: #5a1515;
    text-decoration: underline;
  }

  .related-post-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .meta-item {
    color: #8a4b4b;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
  }

  /* Back to Blog Styles */
  .back-to-blog {
    padding: 2rem 0;
    background-color: #fefaf4;
  }

  .btn-primary {
    background-color: #7a1f1f;
    border-color: #7a1f1f;
    padding: 0.75rem 2rem;
    font-weight: 600;
    border-radius: 8px;
    transition: all 0.3s ease;
  }

  .btn-primary:hover {
    background-color: #5a1515;
    border-color: #5a1515;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(122, 31, 31, 0.3);
  }

  .btn-outline-primary {
    color: #7a1f1f;
    border-color: #7a1f1f;
    font-weight: 600;
    border-radius: 6px;
    transition: all 0.3s ease;
  }

  .btn-outline-primary:hover {
    background-color: #7a1f1f;
    border-color: #7a1f1f;
    color: white;
  }

  /* Post Not Found Styles */
  .post-not-found {
    padding: 4rem 0;
    background-color: #fefaf4;
    text-align: center;
  }

  .post-not-found h1 {
    color: #7a1f1f;
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }

  .post-not-found p {
    color: #8a4b4b;
    font-size: 1.2rem;
    margin-bottom: 2rem;
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .post-title {
      font-size: 2rem;
    }

    .post-meta {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.75rem;
    }

    .post-article {
      padding: 2rem;
    }

    .post-article :global(h3) {
      font-size: 1.5rem;
    }

    .related-title {
      font-size: 1.5rem;
    }
  }

  @media (max-width: 576px) {
    .post-header {
      padding: 3rem 0 2rem;
    }

    .post-title {
      font-size: 1.8rem;
    }

    .post-article {
      padding: 1.5rem;
    }

    .post-article :global(h3) {
      font-size: 1.3rem;
    }
  }
</style>