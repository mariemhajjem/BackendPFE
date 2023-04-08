require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const PORT = process.env.PORT || 3500;

// Connect to MongoDB
connectDB();

// custom middleware logger
app.use(logger);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json 
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

//serve static files
app.use('/', express.static(path.join(__dirname, '/public')));

// routes
app.use('/api/auth', require('./routes/auth')); 
app.use('/api/produits', require('./routes/produits'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/commandes', require('./routes/commandes'));
app.use('/api/demandes', require('./routes/demandes'));
app.use('/api/reclamations', require('./routes/reclamations'));
// app.use(verifyJWT);
app.use('/api/users', require('./routes/users'));

app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});

app.use(errorHandler);
app.use((req, res, next) => {
    const error = new Error("could not found this route.");
    error.code = 404;
    throw error;
});

app.use((error, req, res, next) => {
    if (req.headerSent) return next(error);
    res.status(error?.code || 500);
    res.json({ message: error?.message || "An unknow error occured!", code: error?.code});
});

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});