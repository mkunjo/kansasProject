require('dotenv').config();

const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

// Configure your PostgreSQL connection here
const pool = new Pool({
    user: process.env.DB_USER || 'myuser',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'login_system',
    password: process.env.DB_PASSWORD || 'mypassword',
    port: process.env.DB_PORT || 5432,
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key', // Change this to a random secret string
    resave: false,
    saveUninitialized: true
}));

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

// Registration endpoint
app.post('/register', async (req, res) => {
    const { username, password, email } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        // Check if user already exists
        const userExists = await pool.query('SELECT * FROM users WHERE username = $1 OR email = $2', [username, email]);
        if (userExists.rows.length > 0) {
            return res.status(400).send('User already exists');
        }

        // Insert new user
        await pool.query('INSERT INTO users (username, email, hashed_password) VALUES ($1, $2, $3)', [username, email, hashedPassword]);
        res.status(201).send('User registered successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});


// Login endpoint
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if user exists
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        const user = result.rows[0];

        if (!user) {
            return res.status(400).send('User not found');
        }

        // Compare password
        const match = await bcrypt.compare(password, user.hashed_password);
        if (!match) {
            return res.status(401).send('Invalid credentials');
        }

        // User authenticated
        res.send('User logged in successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

