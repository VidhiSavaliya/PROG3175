const db = require('./database');

// Seed data
const seedData = [
    // English Greetings
    { timeOfDay: 'Morning', language: 'English', greetingMessage: 'Good morning', tone: 'Formal' },
    { timeOfDay: 'Morning', language: 'English', greetingMessage: 'Morning!', tone: 'Casual' },
    { timeOfDay: 'Afternoon', language: 'English', greetingMessage: 'Good afternoon', tone: 'Formal' },
    { timeOfDay: 'Afternoon', language: 'English', greetingMessage: 'Hey there!', tone: 'Casual' },
    { timeOfDay: 'Evening', language: 'English', greetingMessage: 'Good evening', tone: 'Formal' },
    { timeOfDay: 'Evening', language: 'English', greetingMessage: 'Evening!', tone: 'Casual' },
  
    // French Greetings
    { timeOfDay: 'Morning', language: 'French', greetingMessage: 'Bonjour', tone: 'Formal' },
    { timeOfDay: 'Morning', language: 'French', greetingMessage: 'Salut!', tone: 'Casual' },
    { timeOfDay: 'Afternoon', language: 'French', greetingMessage: 'Bon après-midi', tone: 'Formal' },
    { timeOfDay: 'Afternoon', language: 'French', greetingMessage: 'Coucou!', tone: 'Casual' },
    { timeOfDay: 'Evening', language: 'French', greetingMessage: 'Bonsoir', tone: 'Formal' },
    { timeOfDay: 'Evening', language: 'French', greetingMessage: 'Salut!', tone: 'Casual' },
  
    // Spanish Greetings
    { timeOfDay: 'Morning', language: 'Spanish', greetingMessage: 'Buenos días', tone: 'Formal' },
    { timeOfDay: 'Morning', language: 'Spanish', greetingMessage: '¡Hola!', tone: 'Casual' },
    { timeOfDay: 'Afternoon', language: 'Spanish', greetingMessage: 'Buenas tardes', tone: 'Formal' },
    { timeOfDay: 'Afternoon', language: 'Spanish', greetingMessage: '¡Qué tal!', tone: 'Casual' },
    { timeOfDay: 'Evening', language: 'Spanish', greetingMessage: 'Buenas noches', tone: 'Formal' },
    { timeOfDay: 'Evening', language: 'Spanish', greetingMessage: '¡Hola!', tone: 'Casual' },
  ];
  

db.serialize(() => {
    seedData.forEach(({ timeOfDay, language, greetingMessage, tone }) => {
        db.run(
            `INSERT INTO Greetings (timeOfDay, language, greetingMessage, tone) VALUES (?, ?, ?, ?)`,
            [timeOfDay, language, greetingMessage, tone]
        );
    });
    console.log('Database seeded successfully.');
});
