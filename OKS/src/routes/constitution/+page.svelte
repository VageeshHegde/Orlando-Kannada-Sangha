<script>
  import Hero from '$lib/components/Hero.svelte';
  import Navbar from '$lib/components/Navbar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { supabase } from '$lib/supabase.js';
  import { onMount, tick } from 'svelte';

  let pdfContainer;
  let canvas;
  let loading = true;
  let error = null;
  let pdfUrl = null;
  let pdfDoc = null;
  let currentPage = 1;
  let totalPages = 0;
  let scale = 1.0;

  onMount(async () => {
    try {
      // Get the constitution PDF from Supabase Storage
      const { data: signedUrlData, error: signedUrlError } = await supabase.storage
        .from('OKS')
        .createSignedUrl('documents/OKS_Constitution.pdf', 3600);

      if (signedUrlError) {
        throw new Error(`Failed to get PDF: ${signedUrlError.message}`);
      }

      pdfUrl = signedUrlData.signedUrl;

      // Import PDF.js dynamically
      const pdfjsLib = await import('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.4.149/pdf.min.mjs');
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.4.149/pdf.worker.min.mjs';

      // Load the PDF document
      pdfDoc = await pdfjsLib.getDocument(pdfUrl).promise;
      totalPages = pdfDoc.numPages;
      
      loading = false;
      
      // Wait for DOM to update, then render first page
      await tick();
      if (canvas) {
        renderPage(1);
      }
      
    } catch (err) {
      console.error('❌ Error loading constitution PDF:', err);
      error = err.message;
      loading = false;
    }
  });

  async function renderPage(pageNum) {
    if (!pdfDoc || !canvas) return;
    
    try {
      const page = await pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale });
      
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      const context = canvas.getContext('2d');
      if (!context) {
        console.error('Failed to get canvas context');
        return;
      }
      
      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };
      
      await page.render(renderContext).promise;
      currentPage = pageNum;
    } catch (err) {
      console.error('Error rendering page:', err);
    }
  }

  function nextPage() {
    if (currentPage < totalPages) {
      renderPage(currentPage + 1);
    }
  }

  function prevPage() {
    if (currentPage > 1) {
      renderPage(currentPage - 1);
    }
  }

  function zoomIn() {
    scale += 0.25;
    renderPage(currentPage);
  }

  function zoomOut() {
    if (scale > 0.5) {
      scale -= 0.25;
      renderPage(currentPage);
    }
  }

  function printPDF() {
    // Simple print function - opens PDF in new tab for printing
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    } else {
      alert('PDF not loaded yet. Please wait for the document to load.');
    }
  }

  // Enhanced download function
  async function downloadPDF() {
    if (!pdfDoc) {
      console.error('PDF document not loaded');
      return;
    }

    try {
      // Get the PDF data as array buffer
      const pdfData = await pdfDoc.getData();
      
      // Create blob and download
      const blob = new Blob([pdfData], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = 'OKS_Constitution.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      // Fallback to direct URL download
      if (pdfUrl) {
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = 'OKS_Constitution.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }
</script>

<svelte:head>
  <title>Constitution - Orlando Kannada Sangha</title>
  <meta name="description" content="Constitution of Orlando Kannada Sangha - A not-for-profit 501(c)(3) organization promoting Kannada culture in Orlando." />
</svelte:head>

<Navbar />
<Hero page="Constitution" />

<!-- Constitution Content -->
<main class="container my-5">
  <div class="row">
    <div class="col-12">
      <h1 class="text-center mb-4">Constitution</h1>
      <h2 class="kannada-title text-center mb-4">ಸಂವಿಧಾನ</h2>
      

      <!-- PDF Viewer Container -->
      <div class="container">
        <div class="pdf-viewer-wrapper">
          {#if loading}
            <div class="pdf-loading">
              <div class="text-center">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-3">Loading Constitution PDF...</p>
              </div>
            </div>
          {/if}

          {#if error}
            <div class="alert alert-danger">
              <i class="fas fa-exclamation-triangle me-2"></i>
              <strong>Error:</strong> {error}
              <br><small>Please make sure the OKS_Constitution.pdf file exists in the 'documents' folder of your Supabase Storage.</small>
            </div>
          {/if}

          <!-- PDF Controls and Viewer -->
          {#if !loading && !error}
            <!-- PDF Toolbar -->
            <div class="pdf-toolbar">
              <div class="toolbar-group">
                <button class="btn btn-sm btn-outline-secondary" on:click={prevPage} disabled={currentPage <= 1} aria-label="Previous page" title="Previous page">
                  <i class="fas fa-chevron-left"></i>
                </button>
                <span class="page-info">Page {currentPage} of {totalPages}</span>
                <button class="btn btn-sm btn-outline-secondary" on:click={nextPage} disabled={currentPage >= totalPages} aria-label="Next page" title="Next page">
                  <i class="fas fa-chevron-right"></i>
                </button>
              </div>
              
              <div class="toolbar-group">
                <button class="btn btn-sm btn-outline-secondary" on:click={zoomOut} aria-label="Zoom out" title="Zoom out">
                  <i class="fas fa-search-minus"></i>
                </button>
                <span class="zoom-info">{Math.round(scale * 100)}%</span>
                <button class="btn btn-sm btn-outline-secondary" on:click={zoomIn} aria-label="Zoom in" title="Zoom in">
                  <i class="fas fa-search-plus"></i>
                </button>
              </div>

              <div class="toolbar-group">
                <button class="btn btn-sm btn-outline-secondary" on:click={printPDF} aria-label="Print document" title="Print document">
                  <i class="fas fa-print"></i>
                </button>
                <button class="btn btn-sm btn-outline-secondary" on:click={downloadPDF} aria-label="Download document" title="Download PDF">
                  <i class="fas fa-download"></i>
                </button>
              </div>
            </div>

            <!-- PDF Canvas Container -->
            <div class="pdf-canvas-container">
              <canvas bind:this={canvas} class="pdf-canvas"></canvas>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
</main>

<style>
  .kannada-title {
    font-family: 'Noto Sans Kannada', sans-serif;
    color: #7a1f1f;
  }
  
  
  .pdf-viewer-wrapper {
    position: relative;
    width: 100%;
    min-height: 90vh;
    border: 1px solid #dee2e6;
    border-radius: 8px;
    background-color: #f8f9fa;
  }

  .pdf-loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
  }

  .pdf-loading p {
    color: #6c757d;
    margin-bottom: 0;
  }

  .spinner-border {
    width: 3rem;
    height: 3rem;
  }

  .alert {
    border-radius: 8px;
    border: none;
    margin: 2rem;
  }

  /* PDF.js Toolbar Styling */
  .pdf-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: linear-gradient(135deg, #7a1f1f 0%, #8a4b4b 100%);
    border-radius: 8px 8px 0 0;
    color: white;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .toolbar-group {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .pdf-toolbar .btn {
    color: white;
    border-color: rgba(255, 255, 255, 0.3);
    background-color: transparent;
  }

  .pdf-toolbar .btn:hover:not(:disabled) {
    background-color: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.5);
    color: white;
  }

  .pdf-toolbar .btn:disabled {
    color: rgba(255, 255, 255, 0.5);
    border-color: rgba(255, 255, 255, 0.2);
  }

  .page-info, .zoom-info {
    font-size: 0.9rem;
    font-weight: 500;
    padding: 0 0.5rem;
    white-space: nowrap;
  }

  /* PDF Canvas Styling */
  .pdf-canvas-container {
    padding: 1rem;
    text-align: center;
    max-height: 95vh;
    overflow: auto;
    background: white;
    border-radius: 0 0 8px 8px;
  }

  .pdf-canvas {
    max-width: 100%;
    height: auto;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border-radius: 4px;
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .pdf-toolbar {
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .toolbar-group {
      justify-content: center;
    }
    
    .pdf-canvas-container {
      max-height: 60vh;
    }
  }
</style>

<Footer /> 