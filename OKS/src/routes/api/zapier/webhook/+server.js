import { json } from '@sveltejs/kit';
import { userImportService } from '$lib/services/userImport.js';
import { supabaseEmailService } from '$lib/services/supabaseEmail.js';

export async function POST({ request }) {
  try {
    // Parse the incoming Zapier data
    const zapierData = await request.json();
    
    console.log('📥 Received Zapier data:', zapierData);
    
    // Validate required fields
    if (!zapierData.email) {
      return json({
        success: false,
        error: 'Email is required'
      }, { status: 400 });
    }
    
    // Create user from Zapier data
    const result = await userImportService.createUserFromZapier(zapierData);
    
    if (result.success) {
      console.log('✅ User invited successfully:', result.user.email);
      
      // Send welcome email notification
      try {
        await supabaseEmailService.notifyUserWithReset(result.user.email);
        console.log('📧 Welcome email sent to:', result.user.email);
      } catch (emailError) {
        console.warn('⚠️ Failed to send welcome email:', emailError.message);
        // Don't fail the whole process if email fails
      }
      
      return json({
        success: true,
        message: 'User invited successfully',
        user: {
          email: result.user.email,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          invited: true
        }
      });
    } else {
      console.log('❌ Failed to invite user:', result.error);
      
      return json({
        success: false,
        error: result.error,
        email: result.email
      }, { status: 400 });
    }
    
  } catch (error) {
    console.error('💥 Webhook error:', error);
    
    return json({
      success: false,
      error: 'Internal server error',
      details: error.message
    }, { status: 500 });
  }
}

// Handle other HTTP methods
export async function GET() {
  return json({
    message: 'Zapier webhook endpoint is active',
    method: 'POST',
    description: 'Send user data to create invitations'
  });
}