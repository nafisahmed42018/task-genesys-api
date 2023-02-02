const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/dbConnection');

const PORT = process.env.PORT || 3018;

const app = express();
dotenv.config();

//database connection
connectDB();

//routes
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');

// middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);

app.listen(PORT, () => console.log(`Server Running at ${PORT}`));
