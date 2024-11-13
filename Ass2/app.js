const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();

// Database setup
const db = new sqlite3.Database('./greetings.db');

// Middleware
app.use(express.json());

const PORT = 3001;

// Root route for testing
app.get('/', (req, res) => {
    res.send('Welcome to the Simple Web API with SQLite!');
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

// Error handling for unknown routes
app.use((req, res) => {
    res.status(404).json({ error: "Endpoint not found." });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
