const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // Step 2: Require the cors package
const dbConnect = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const companyRoutes = require('./routes/companyRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const incomeRoutes = require('./routes/incomeRoutes');
const userRoutes = require('./routes/userRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// Connect to DB
dbConnect();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/users', userRoutes);

app.use('/api/expenses', expenseRoutes);
app.use('/api/incomes', incomeRoutes);

// Error middleware
app.use(errorHandler);

app.get('/', (req, res) => {
    res.json({ message: 'The server is working' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));