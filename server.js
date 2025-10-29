// server.js
const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = process.env.PORT || 3000;

// Initialize database
const db = new sqlite3.Database('./crop_predictions.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
        db.run(`CREATE TABLE IF NOT EXISTS predictions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nitrogen REAL,
            phosphorus REAL,
            potassium REAL,
            temperature REAL,
            humidity REAL,
            ph REAL,
            rainfall REAL,
            crop TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
    }
});

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve main dashboard
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Crop Prediction Logic using Rule-Based
app.post('/predict-crop', (req, res) => {
    const { nitrogen, phosphorus, potassium, temperature, humidity, ph, rainfall } = req.body;

    // Convert to numbers
    const N = parseFloat(nitrogen);
    const P = parseFloat(phosphorus);
    const K = parseFloat(potassium);
    const temp = parseFloat(temperature);
    const hum = parseFloat(humidity);
    const pH = parseFloat(ph);
    const rain = parseFloat(rainfall);

    let crop = "Unknown";

    // Enhanced Rule-Based Crop Recommendation
    if (N > 120 && K > 150 && rain > 200) crop = "Rice";
    else if (P > 60 && temp > 25 && rain > 150) crop = "Maize";
    else if (K > 100 && temp < 20) crop = "Chickpea";
    else if (N > 80 && pH > 6.5 && rain < 100) crop = "Kidney Beans";
    else if (temp > 30 && hum > 70) crop = "Moth Beans";
    else if (rain > 200 && temp > 25) crop = "Coconut";
    else if (pH < 6 && N > 100) crop = "Coffee";
    else if (temp > 20 && temp < 30 && hum > 50 && rain > 100) crop = "Sugarcane";
    else if (N > 50 && P > 30 && K > 30 && temp > 15 && temp < 25) crop = "Wheat";
    else if (rain > 150 && temp > 20 && hum > 60) crop = "Banana";
    else if (pH > 5.5 && pH < 7 && temp > 20 && rain > 100) crop = "Orange";

    // Additional crops
    else if (temp > 18 && temp < 28 && hum > 60 && pH > 5.5 && pH < 6.5) crop = "Tomato";
    else if (temp > 15 && temp < 25 && rain < 100 && pH > 5.5 && pH < 6.8) crop = "Potato";
    else if (temp > 10 && temp < 20 && N > 40 && P > 20) crop = "Barley";
    else if (temp > 20 && temp < 30 && hum > 60 && N > 50) crop = "Soybean";
    else if (temp > 15 && temp < 25 && hum < 60 && rain < 100 && pH > 6) crop = "Onion";
    else if (temp > 20 && temp < 30 && hum < 50 && pH > 6 && rain > 50) crop = "Grapes";
    else if (temp > 10 && temp < 20 && hum > 50 && rain < 80) crop = "Sugar Beet";

    else crop = "Cotton"; // fallback crop

    // Save to database
    db.run(
        `INSERT INTO predictions (nitrogen, phosphorus, potassium, temperature, humidity, ph, rainfall, crop) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [N, P, K, temp, hum, pH, rain, crop],
        (err) => {
            if (err) {
                console.error('Error saving to database:', err.message);
            }
        }
    );

    res.json({ crop });
});

// Get prediction history
app.get('/history', (req, res) => {
    db.all(`SELECT * FROM predictions ORDER BY timestamp DESC LIMIT 10`, [], (err, rows) => {
        if (err) {
            console.error('Error retrieving history:', err.message);
            return res.status(500).json({ error: 'Failed to retrieve history' });
        }
        res.json(rows);
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
