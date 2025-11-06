// Service to get slider images from Supabase Storage
import { supabase } from '$lib/supabase.js';

export class SliderService {
  constructor() {
    this.bucketName = 'OKS';
    this.baseUrl = 'https://tutdsmwllniixotomqdt.supabase.co/storage/v1/object/public/OKS';
  }

  // Get slider images from S3
  async getSliderImages() {
    try {
      // Try slider folder first
      const { data: sliderFiles, error: sliderError } = await supabase.storage
        .from(this.bucketName)
        .list('slider', {
          limit: 100,
          offset: 0,
          sortBy: { column: 'name', order: 'asc' }
        });

      let files = sliderFiles;
      let folderPath = 'slider';

      // If slider folder fails or is empty, try root
      if (sliderError || !files || files.length === 0) {
        const { data: rootFiles, error: rootError } = await supabase.storage
          .from(this.bucketName)
          .list('', {
            limit: 100,
            offset: 0,
            sortBy: { column: 'name', order: 'asc' }
          });

        if (rootError) {
          return { success: false, error: rootError.message, images: [] };
        }

        files = rootFiles;
        folderPath = '';
      }

      if (!files || files.length === 0) {
        return { success: false, error: 'No files found', images: [] };
      }

      // Filter for image files
      const imageExtensions = [
        'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'tiff', 'tif',
        'ico', 'avif', 'heic', 'heif', 'jfif', 'pjpeg', 'pjp'
      ];
      
      const imageFiles = files.filter(file => {
        if (!file.name) return false;
        
        // Skip folders
        if (file.metadata && file.metadata.mimetype === 'folder') return false;
        
        // Get file extension
        const extension = file.name.toLowerCase().split('.').pop();
        return imageExtensions.includes(extension);
      });

      // Generate signed URLs for authenticated access
      const images = await Promise.all(
        imageFiles.map(async (file, index) => {
          try {
            // Get signed URL with 1 hour expiration
            const { data: signedUrlData, error: signedUrlError } = await supabase.storage
              .from(this.bucketName)
              .createSignedUrl(`${folderPath}/${file.name}`, 3600); // 1 hour expiration

            if (signedUrlError) {
              // Fallback to public URL if signed URL fails
              const publicUrl = `${this.baseUrl}/${folderPath}/${file.name}`.replace('//', '/');
              return {
                name: file.name,
                url: publicUrl,
                alt: `OKS Event ${index + 1}`,
                title: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' '),
                size: file.metadata?.size || 0,
                lastModified: file.updated_at,
                extension: file.name.toLowerCase().split('.').pop(),
                signed: false
              };
            }

            return {
              name: file.name,
              url: signedUrlData.signedUrl,
              alt: `OKS Event ${index + 1}`,
              title: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' '),
              size: file.metadata?.size || 0,
              lastModified: file.updated_at,
              extension: file.name.toLowerCase().split('.').pop(),
              signed: true
            };
          } catch (error) {
            // Fallback to public URL
            const publicUrl = `${this.baseUrl}/${folderPath}/${file.name}`.replace('//', '/');
            return {
              name: file.name,
              url: publicUrl,
              alt: `OKS Event ${index + 1}`,
              title: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' '),
              size: file.metadata?.size || 0,
              lastModified: file.updated_at,
              extension: file.name.toLowerCase().split('.').pop(),
              signed: false
            };
          }
        })
      );

      return { success: true, images };
      
    } catch (error) {
      return { success: false, error: error.message, images: [] };
    }
  }
}

// Export singleton instance
export const sliderService = new SliderService();

// Export convenience function
export const getSliderImages = () => sliderService.getSliderImages();