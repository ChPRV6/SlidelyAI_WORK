"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Initialize Express app
const app = (0, express_1.default)();
const port = 3000;
// Middleware to parse JSON bodies
app.use(body_parser_1.default.json());
// Path to the JSON database file
const dbPath = path_1.default.resolve(__dirname, 'db.json');
// Initialize in-memory database from JSON file or start with an empty array
let db = [];
if (fs_1.default.existsSync(dbPath)) {
    db = JSON.parse(fs_1.default.readFileSync(dbPath, 'utf-8'));
}
else {
    fs_1.default.writeFileSync(dbPath, JSON.stringify(db));
}
// Endpoint to check if server is running
app.get('/ping', (req, res) => {
    res.send(true);
});
// Endpoint to submit a new form
app.post('/submit', (req, res) => {
    const { name, email, phone, github_link, stopwatch_time } = req.body;
    // Add new submission to the database
    db.push({ name, email, phone, github_link, stopwatch_time });
    // Write updated database to JSON file
    fs_1.default.writeFileSync(dbPath, JSON.stringify(db));
    // Send response
    res.send({ success: true });
});
// Endpoint to read a submission by index
app.get('/read', (req, res) => {
    const index = parseInt(req.query.index, 10);
    if (index >= 0 && index < db.length) {
        res.send(db[index]);
    }
    else {
        res.status(404).send({ error: 'Index out of bounds' });
    }
});
// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
