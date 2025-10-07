import { supabase } from '$lib/supabase.js';

class EventsService {
  constructor() {
    this.tableName = 'events';
  }

  /**
   * Fetch all events from the database
   * @returns {Promise<{success: boolean, events: Array, error: any}>}
   */
  async getAllEvents() {
    try {
      console.log('Fetching events from database...');
      
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching events:', error);
        return { success: false, events: [], error };
      }

      console.log('Events fetched successfully:', data?.length || 0, 'events');
      
      // Load images from S3 for events that have image_file
      const eventsWithImages = await this.loadEventImages(data || []);

      return { success: true, events: eventsWithImages, error: null };
    } catch (error) {
      console.error('Exception fetching events:', error);
      return { success: false, events: [], error };
    }
  }

  /**
   * Fetch upcoming events (future dates only)
   * @returns {Promise<{success: boolean, events: Array, error: any}>}
   */
  async getUpcomingEvents() {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .gte('date', today)
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching upcoming events:', error);
        return { success: false, events: [], error };
      }

      // Load images from S3 for events that have image_file
      const eventsWithImages = await this.loadEventImages(data || []);

      return { success: true, events: eventsWithImages, error: null };
    } catch (error) {
      console.error('Exception fetching upcoming events:', error);
      return { success: false, events: [], error };
    }
  }

  /**
   * Load event images from S3
   * @param {Array} events - Array of event objects
   * @returns {Promise<Array>} - Events with image_url populated from S3 signed URLs
   */
  async loadEventImages(events) {
    try {
      const eventsWithImages = await Promise.all(
        events.map(async (event) => {
          // Use image_file field (stores filename like "kannada-rajyotsava.jpg")
          if (event.image_file) {
            try {
              const { data: signedUrlData, error: signedUrlError } = await supabase.storage
                .from('OKS')
                .createSignedUrl(`events/${event.image_file}`, 3600); // 1 hour expiration
              
              if (signedUrlError) {
                console.error(`S3 error for event ${event.id}:`, signedUrlError);
                // Fallback to static file
                return {
                  ...event,
                  image_url: `/images/events/${event.image_file}`
                };
              }
              
              return {
                ...event,
                image_url: signedUrlData.signedUrl
              };
            } catch (error) {
              console.error(`Error loading image for event ${event.id}:`, error);
              return {
                ...event,
                image_url: 'https://picsum.photos/150/100?random=1'
              };
            }
          }
          
          // No image file, use placeholder
          return {
            ...event,
            image_url: 'https://picsum.photos/150/100?random=1'
          };
        })
      );

      return eventsWithImages;
    } catch (error) {
      console.error('Error loading event images:', error);
      return events; // Return events without modified images
    }
  }

  /**
   * Fetch a single event by ID
   * @param {string} eventId - The event ID
   * @returns {Promise<{success: boolean, event: Object, error: any}>}
   */
  async getEventById(eventId) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('id', eventId)
        .single();

      if (error) {
        console.error('Error fetching event:', error);
        return { success: false, event: null, error };
      }

      return { success: true, event: data, error: null };
    } catch (error) {
      console.error('Exception fetching event:', error);
      return { success: false, event: null, error };
    }
  }

  /**
   * Format date for display
   * @param {string} dateString - ISO date string (YYYY-MM-DD)
   * @returns {Object} - Formatted date components
   */
  formatEventDate(dateString) {
    // Parse date as local date to avoid timezone conversion issues
    // Split the date string and create date with local timezone
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day); // month is 0-indexed
    
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    
    return {
      month: months[date.getMonth()],
      day: date.getDate(),
      year: date.getFullYear(),
      fullDate: date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    };
  }
}

// Create and export a singleton instance
const eventsService = new EventsService();

// Export methods that preserve the class context
export const getAllEvents = () => eventsService.getAllEvents();
export const getUpcomingEvents = () => eventsService.getUpcomingEvents();
export const getEventById = (eventId) => eventsService.getEventById(eventId);
export const formatEventDate = (dateString) => eventsService.formatEventDate(dateString);