const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// MongoDB Connection (Optional: Replace URI with your MongoDB connection string)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/sr_designers';
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch((err) => console.log('MongoDB connection error (running without DB persistence):', err.message));

// Inquiry Schema
const inquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  service: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Inquiry = mongoose.model('Inquiry', inquirySchema);

// API Routes
app.post('/api/inquiries', async (req, res) => {
  try {
    const { name, email, phone, service, message } = req.body;
    
    // Validate inputs
    if (!name || !email || !phone || !service || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const newInquiry = new Inquiry({ name, email, phone, service, message });
    await newInquiry.save();

    res.status(201).json({ 
      success: true, 
      message: 'Inquiry received successfully! Our team will contact you soon.' 
    });
  } catch (error) {
    console.error('Error saving inquiry:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error. Please try again later.' 
    });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});