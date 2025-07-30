require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/courtcase');

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['client', 'lawyer'], default: 'client' },
});
const User = mongoose.model('User', userSchema);

// Case Schema
const caseSchema = new mongoose.Schema({
  caseNumber: String,
  title: String,
  description: String,
  caseType: String,
  section: String,
  status: { type: String, enum: ['pending', 'reviewing', 'approved', 'rejected'], default: 'pending' },
  submittedAt: { type: Date, default: Date.now },
  nextDate: Date, // <-- new field
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});
const Case = mongoose.model('Case', caseSchema);

// Register
app.post('/api/signup', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ error: 'Email already registered' });
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hash });
  res.json({ id: user._id, name: user.name, email: user.email, role: user.role });
});

// Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: 'Invalid email or password' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ error: 'Invalid email or password' });
  // JWT for session (optional)
  const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
  res.json({ token, id: user._id, name: user.name, email: user.email, role: user.role });
});

// Submit Case
app.post('/api/cases', async (req, res) => {
  const { caseNumber, title, description, caseType, section, clientId, nextDate } = req.body;
  let parsedNextDate = undefined;
  if (nextDate && !isNaN(Date.parse(nextDate))) {
    parsedNextDate = new Date(nextDate);
  }
  const newCase = await Case.create({
    caseNumber,
    title,
    description,
    caseType,
    section,
    client: clientId,
    nextDate: parsedNextDate
  });
  res.json(newCase);
});

// Get all users with their cases
app.get('/api/users', async (req, res) => {
  const users = await User.find().lean();
  const usersWithCases = await Promise.all(users.map(async user => {
    const cases = await Case.find({ client: user._id }).lean();
    return { ...user, totalCases: cases.length, cases };
  }));
  res.json(usersWithCases);
});

// Get cases for a user
app.get('/api/cases/:userId', async (req, res) => {
  const cases = await Case.find({ client: req.params.userId });
  // Ensure nextDate is always an ISO string
  const casesWithIsoNextDate = cases.map(c => ({
    ...c.toObject(),
    nextDate: c.nextDate ? c.nextDate.toISOString() : '',
    submittedAt: c.submittedAt ? c.submittedAt.toISOString() : '',
  }));
  res.json(casesWithIsoNextDate);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('API server running on port', PORT));