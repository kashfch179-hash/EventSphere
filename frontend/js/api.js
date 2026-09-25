// Base API URL
const BASE_URL = 'http://localhost:5000/api';

// Global API Service Object
window.EventAPI = {
  // 1. Fetch all events
  async getEvents(search = '', category = '') {
    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.append('search', search);
      if (category && category !== 'all') queryParams.append('category', category);

      const response = await fetch(`${BASE_URL}/events?${queryParams.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch events');
      return await response.json();
    } catch (error) {
      console.error('API Error (getEvents):', error.message);
      return [];
    }
  },

  // 2. Fetch single event by ID
  async getEventById(id) {
    try {
      const response = await fetch(`${BASE_URL}/events/${id}`);
      if (!response.ok) throw new Error('Event not found');
      return await response.json();
    } catch (error) {
      console.error('API Error (getEventById):', error.message);
      return null;
    }
  },

  // 3. Create a new event
  async createEvent(eventData) {
    try {
      const response = await fetch(`${BASE_URL}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
      });
      if (!response.ok) throw new Error('Failed to create event');
      return await response.json();
    } catch (error) {
      console.error('API Error (createEvent):', error.message);
      throw error;
    }
  }
};