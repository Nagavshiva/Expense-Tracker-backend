const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');



// Connect to the database
connectDB();

const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());
app.use(cors());

// Route handling
app.use('/api/auth', authRoutes);        
app.use('/api/expenses', expenseRoutes); 

// Error handling middleware 
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
