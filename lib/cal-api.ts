import axios from 'axios';

// Create a Cal.com API client using axios
export const calApiClient = {
  // Get event types
  getEventTypes: async () => {
    const apiKey = process.env.NEXT_PUBLIC_CAL_API_KEY;
    
    try {
      const response = await axios.get('https://api.cal.com/v1/event-types', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching event types:', error);
      throw error;
    }
  },
  
  // Get bookings
  getBookings: async () => {
    const apiKey = process.env.NEXT_PUBLIC_CAL_API_KEY;
    
    try {
      const response = await axios.get('https://api.cal.com/v1/bookings', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  }
};

// Test connection
async function testConnection() {
  try {
    const apiKey = process.env.NEXT_PUBLIC_CAL_API_KEY;
    if (!apiKey) {
      console.error('⛔️ No API key found. Set NEXT_PUBLIC_CAL_API_KEY in your .env.local');
      return;
    }
    
    console.log('🔑 Testing Cal.com API connection...');
    const eventTypes = await calApiClient.getEventTypes();
    console.log('✅ Connection successful!');
    console.log('📅 Event types:', eventTypes);
  } catch (error) {
    if (error instanceof Error) {
      console.error(' Error connecting to Cal.com API:', error.message);
    } else {
      console.error('Error connecting to Cal.com API:', error);
    }
  }
}

// Run test if executed directly
if (require.main === module) {
  testConnection();
}