require("dotenv").config();

const express = require('express');
const app = express();
const axios = require('axios');

// Database setup
const path = require('path');
const dbPath = path.resolve(__dirname, 'greetings.db');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error('Database connection failed:', err.message);
    } else {
        console.log('Connected to SQLite database.');
    }
});

// Middleware
app.use(express.json());

const PORT = 3001;

// Create an axios instance with a timeout
const axiosInstance = axios.create({
    timeout: 30000 // 30 seconds timeout
});

// Root route for testing
app.get('/', (req, res) => {
    res.send('Hello, This is a serverless deployment!');
});

// GET/greet: Get a greeting message based on timeOfDay, language, and tone
app.get('/greet', (req, res) => {
    const { timeOfDay, language, tone } = req.query;

    // Validate request body
    if (!timeOfDay || !language || !tone) {
        return res.status(400).json({ error: "Missing required fields: timeOfDay, language, or tone." });
    }

    // Query the database (case-insensitive search)
    const query = `
        SELECT greetingMessage FROM Greetings
        WHERE LOWER(timeOfDay) = LOWER(?) AND LOWER(language) = LOWER(?) AND LOWER(tone) = LOWER(?)
    `;

    db.get(query, [timeOfDay, language, tone], (err, row) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database query failed." });
        }
        if (!row) {
            return res.status(404).json({ error: "Greeting not found." });
        }
        res.json({ greetingMessage: row.greetingMessage });
    });
});

// GET /timesOfDay: Get a list of all available times of day
app.get('/timesOfDay', (req, res) => {
    const query = `SELECT DISTINCT timeOfDay FROM Greetings`;

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database query failed." });
        }
        const timesOfDay = rows.map(row => row.timeOfDay);
        res.json(timesOfDay);
    });
});

// GET /languages: Get a list of all supported languages
app.get('/languages', (req, res) => {
    const query = `SELECT DISTINCT language FROM Greetings`;

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database query failed." });
        }
        const languages = rows.map(row => row.language);
        res.json(languages);
    });
});

const cors = require('cors');
app.use(cors());

// Error handling for unknown routes
app.use((req, res) => {
    res.status(404).json({ error: "Endpoint not found." });
});

module.exports = app;