const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// 1. Middleware
app.use(express.json());
app.use(cors());

// 2. MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/eventsphere';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

// 3. Mongoose Schema & Model for Events
const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  venue: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, default: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80' },
  description: { type: String, default: '' }
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);

// 4. API Routes

// GET: Fetch all events (with optional category search/filter)
app.get('/api/events', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category && category !== 'all') {
      query.category = category;
    }

    if (search) {
      query.title = { $regex: search,$options: 'i' };
    }

    const events = await Event.find(query);
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching events', error: error.message });
  }
});

// GET: Fetch single event by ID
app.get('/api/events/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching event details', error: error.message });
  }
});

// POST: Create a new event (Organizer Form)
app.post('/api/events', async (req, res) => {
  try {
    const { title, category, date, time, venue, price, image, description } = req.body;

    const newEvent = new Event({
      title,
      category,
      date,
      time,
      venue,
      price,
      image,
      description
    });

    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create event', error: error.message });
  }
});

// 5. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});