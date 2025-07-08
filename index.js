import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug: Confirm Mongo URI is loaded (optional, remove in production)
console.log("✅ MONGO_URI Loaded:", process.env.MONGO_URI);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1); // Exit the app if DB connection fails
  });

// Define Schema and Model
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true }
});

const Student = mongoose.model('Student', studentSchema);

// Routes
app.post('/register', async (req, res) => {
  const { name, email } = req.body;

  // Basic validation
  if (!name || !email) {
    return res.status(400).send('❌ Name and email are required.');
  }

  try {
    const newStudent = new Student({ name, email });
    await newStudent.save();
    res.status(200).send('✅ Registration successful!');
  } catch (error) {
    console.error('❌ Error saving to MongoDB:', error.message);
    res.status(500).send('❌ Internal Server Error');
  }
});

// Test Route
app.get('/', (req, res) => {
  res.send('🎉 Student Registration API is live!');
});

// Start the Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
