// DOM Rendering & Event Logic
document.addEventListener('DOMContentLoaded', () => {
  const eventsContainer = document.getElementById('events-grid');
  const filterForm = document.getElementById('filter-form');

  // Function to Render Event Cards in HTML
  function renderEvents(events) {
    if (!eventsContainer) return;

    if (events.length === 0) {
      eventsContainer.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: var(--text-muted);">
          <p>No events found matching your search criteria.</p>
        </div>
      `;
      return;
    }

    eventsContainer.innerHTML = events.map(event => `
      <div class="event-card">
        <div class="card-img-wrapper">
          <img src="${event.image}" alt="${event.title}">
          <span class="badge">${event.category}</span>
        </div>
        <div class="card-content">
          <h3>${event.title}</h3>
          <div class="event-meta">
            <span>📅 ${event.date}</span>
            <span>⏰ ${event.time}</span>
            <span>📍 ${event.venue}</span>
          </div>
          <div class="card-footer">
            <span class="price">PKR ${event.price.toLocaleString()}</span>
            <a href="event-details.html?id=${event._id}" class="btn-secondary">View Details</a>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Load Initial Events from Backend
  async function loadEvents() {
    if (!eventsContainer) return;
    eventsContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Loading events...</p>';
    const events = await EventAPI.getEvents();
    renderEvents(events);
  }

  // Filter Form Submit Listener
  if (filterForm) {
    filterForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const searchInput = filterForm.querySelector('input[type="text"]')?.value || '';
      const categorySelect = filterForm.querySelector('select')?.value || '';

      eventsContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Searching events...</p>';
      
      const filteredEvents = await EventAPI.getEvents(searchInput, categorySelect);
      renderEvents(filteredEvents);
    });
  }

  // Initial Execution
  loadEvents();
});

// Login button interaction
const loginBtn = document.getElementById('login-btn');
if (loginBtn) {
  loginBtn.addEventListener('click', () => {
    alert('Login & Authentication feature is coming soon!');
  });
}