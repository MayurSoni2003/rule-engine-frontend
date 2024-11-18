// Import required modules
const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies

// Load rules from JSON
const loadRules = () => {
    const data = fs.readFileSync('rules.json', 'utf-8');
    return JSON.parse(data);
};

// Save rules to JSON
const saveRules = (rules) => {
    fs.writeFileSync('rules.json', JSON.stringify(rules, null, 4), 'utf-8');
};

// Load logs from JSON
const loadLogs = () => {
    const data = fs.readFileSync('logs.json', 'utf-8');
    return JSON.parse(data);
};

// Get all rules
app.get('/api/rules', (req, res) => {
    const rules = loadRules();
    res.json(rules);
});

// Add a new rule
app.post('/api/rules', (req, res) => {
    const rules = loadRules();
    const newRule = req.body;
    newRule.id = rules.length > 0 ? Math.max(...rules.map((r) => r.id)) + 1 : 1;
    rules.push(newRule);
    saveRules(rules);
    res.status(201).json(newRule);
});

// Update an existing rule
app.put('/api/rules/:ruleId', (req, res) => {
    const ruleId = parseInt(req.params.ruleId, 10);
    const rules = loadRules();
    const updatedRule = req.body;
    const ruleIndex = rules.findIndex((rule) => rule.id === ruleId);

    if (ruleIndex !== -1) {
        rules[ruleIndex] = { ...rules[ruleIndex], ...updatedRule };
        saveRules(rules);
        res.json(rules[ruleIndex]);
    } else {
        res.status(404).json({ error: 'Rule not found' });
    }
});

// Delete a rule
app.delete('/api/rules/:ruleId', (req, res) => {
    const ruleId = parseInt(req.params.ruleId, 10);
    let rules = loadRules();

    // Filter out the rule to delete
    rules = rules.filter((rule) => rule.id !== ruleId);

    // Renumber remaining rules
    rules = rules.map((rule, index) => ({ ...rule, id: index + 1 }));

    saveRules(rules);
    res.status(204).send();
});

// Get all logs
app.get('/api/logs', (req, res) => {
    const logs = loadLogs();
    res.json(logs);
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
