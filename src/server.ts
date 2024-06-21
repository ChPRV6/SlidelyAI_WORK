import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';

// Initialize Express app
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Path to the JSON database file
const dbPath = path.resolve(__dirname, 'db.json');

// Initialize in-memory database from JSON file or start with an empty array
let db: any[] = [];
if (fs.existsSync(dbPath)) {
    db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
} else {
    fs.writeFileSync(dbPath, JSON.stringify(db));
}

// Endpoint to check if server is running
app.get('/ping', (req: Request, res: Response) => {
    res.send(true);
});

// Endpoint to submit a new form
app.post('/submit', (req: Request, res: Response) => {
    const { name, email, phone, github_link, stopwatch_time } = req.body;

    // Add new submission to the database
    db.push({ name, email, phone, github_link, stopwatch_time });

    // Write updated database to JSON file
    fs.writeFileSync(dbPath, JSON.stringify(db));

    // Send response
    res.send({ success: true });
});

// Endpoint to read a submission by index
app.get('/read', (req: Request, res: Response) => {
    const index = parseInt(req.query.index as string, 10);
    if (index >= 0 && index < db.length) {
        res.send(db[index]);
    } else {
        res.status(404).send({ error: 'Index out of bounds' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
