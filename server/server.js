const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Config
const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'your_jwt_secret_key'; // Use env var in prod
const MONGO_URI = 'mongodb://localhost:27017/gowtham_hospital'; // Use env var in prod

// Middleware
app.use(cors());
app.use(express.json());

// --- Database Connection ---
mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('MongoDB Connected');
    await seedData();
  })
  .catch(err => console.log(err));

// --- Models ---
// Note: We include 'id' field explicitly to maintain compatibility with 
// the frontend's client-generated IDs.
const userSchema = new mongoose.Schema({
  id: { type: String, unique: true }, 
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'doctor', 'admin'], default: 'user' },
  phone: String,
  // Doctor Fields
  specialization: String,
  experience: Number,
  availableDays: [String],
  availableTimeStart: String,
  availableTimeEnd: String,
  createdAt: { type: Date, default: Date.now }
});

const appointmentSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  userId: String,
  userName: String,
  doctorId: String,
  doctorName: String,
  date: String,
  time: String,
  reason: String,
  status: { type: String, enum: ['pending', 'approved', 'completed', 'cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Appointment = mongoose.model('Appointment', appointmentSchema);

// --- Seeding ---
const seedData = async () => {
  const adminExists = await User.findOne({ role: 'admin' });
  if (!adminExists) {
    console.log('Seeding Admin User...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password', salt);
    
    await User.create({
      id: 'admin-1',
      name: 'System Admin',
      email: 'admin@gowthamhospital.com',
      password: hashedPassword,
      role: 'admin',
      phone: '000-000-0000'
    });
  }

  const doctorsExist = await User.findOne({ role: 'doctor' });
  if (!doctorsExist) {
     console.log('Seeding Doctors...');
     const salt = await bcrypt.genSalt(10);
     const hashedPassword = await bcrypt.hash('password', salt);
     
     const doctors = [
        { id: 'doc-1', name: 'Dr. Sarah Smith', specialization: 'Cardiologist', email: 'sarah@gowthamhospital.com' },
        { id: 'doc-2', name: 'Dr. James Wilson', specialization: 'Dermatologist', email: 'james@gowthamhospital.com' },
        { id: 'doc-3', name: 'Dr. Emily Chen', specialization: 'Pediatrician', email: 'emily@gowthamhospital.com' }
     ];

     for (const doc of doctors) {
        await User.create({
           ...doc,
           password: hashedPassword,
           role: 'doctor',
           experience: 10,
           availableDays: ['Mon', 'Wed', 'Fri'],
           availableTimeStart: '09:00',
           availableTimeEnd: '17:00',
           phone: '555-0100'
        });
     }
  }
};

// --- Auth Middleware ---
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    res.status(400).json({ msg: 'Token is not valid' });
  }
};

// --- Routes ---

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    user = new User(req.body);
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    
    await user.save();
    
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    
    // Return user without password
    const userObj = user.toObject();
    delete userObj.password;
    delete userObj._id;
    
    res.json({ token, user: userObj });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    
    const userObj = user.toObject();
    delete userObj.password;
    delete userObj._id;

    res.json({ token, user: userObj });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Doctor Routes
app.get('/api/doctors', async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' }).select('-password -_id');
    res.json(doctors);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

app.post('/api/doctors', auth, async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    const newDoc = new User({ ...req.body, role: 'doctor' });
    
    // Hash default password
    const salt = await bcrypt.genSalt(10);
    newDoc.password = await bcrypt.hash(password || 'password', salt);
    
    await newDoc.save();
    res.json(newDoc);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

app.put('/api/doctors/:id', auth, async (req, res) => {
  try {
    const updates = { ...req.body };
    // Handle password update if present
    if (updates.password && updates.password.length > 0) {
        const salt = await bcrypt.genSalt(10);
        updates.password = await bcrypt.hash(updates.password, salt);
    } else {
        delete updates.password;
    }

    const updated = await User.findOneAndUpdate({ id: req.params.id }, updates, { new: true }).select('-password -_id');
    res.json(updated);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

app.delete('/api/doctors/:id', auth, async (req, res) => {
  try {
    await User.findOneAndDelete({ id: req.params.id });
    res.json({ msg: 'Doctor deleted' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// User Routes
app.get('/api/users', auth, async (req, res) => {
  try {
    const users = await User.find().select('-password -_id');
    res.json(users);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

app.put('/api/users/:id', auth, async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.password && updates.password.length > 0) {
        const salt = await bcrypt.genSalt(10);
        updates.password = await bcrypt.hash(updates.password, salt);
    } else {
        delete updates.password;
    }

    const updated = await User.findOneAndUpdate({ id: req.params.id }, updates, { new: true }).select('-password -_id');
    res.json(updated);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

app.delete('/api/users/:id', auth, async (req, res) => {
  try {
    await User.findOneAndDelete({ id: req.params.id });
    res.json({ msg: 'User deleted' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Appointment Routes
app.get('/api/appointments', auth, async (req, res) => {
  try {
    const appointments = await Appointment.find().select('-_id');
    res.json(appointments);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

app.post('/api/appointments', auth, async (req, res) => {
  try {
    const newApt = new Appointment(req.body);
    await newApt.save();
    res.json(newApt);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

app.patch('/api/appointments/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const apt = await Appointment.findOneAndUpdate({ id: req.params.id }, { status }, { new: true }).select('-_id');
    res.json(apt);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
