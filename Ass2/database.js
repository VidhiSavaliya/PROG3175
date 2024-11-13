const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./greetings.db');

// Create the table
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS Greetings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timeOfDay TEXT,
            language TEXT,
            greetingMessage TEXT,
            tone TEXT
        );
    `);
});

module.exports = db;

