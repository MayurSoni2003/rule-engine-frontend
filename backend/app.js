const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Initialize Express app
const app = express();
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies

// MongoDB connection setup
const mongoURI = 'mongodb://localhost:27017/firewall'; // Replace with your MongoDB connection string
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Define the Rule schema and model
const ruleSchema = new mongoose.Schema({
    source_ip: String,
    destination_ip: String,
    source_port: Number,
    destination_port: Number,
    protocol: String,
    action: String,
    created_at: { type: Date, default: Date.now }
});

const logSchema = new mongoose.Schema({
    message: String,
    timestamp: { type: Date, default: Date.now }
});

// MongoDB models
const Rule = mongoose.model('Rule', ruleSchema);
const Log = mongoose.model('Log', logSchema);

// Get all rules from MongoDB
app.get('/api/rules', async (req, res) => {
    try {
        const rules = await Rule.find();
        res.json(rules);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch rules' });
    }
});

// Add a new rule to MongoDB
app.post('/api/rules', async (req, res) => {
    try {
        const newRule = new Rule(req.body); // Use request body directly
        await newRule.save();
        res.status(201).json(newRule);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add rule' });
    }
});


// Update an existing rule in MongoDB
app.put('/api/rules/:ruleId', async (req, res) => {
    const { ruleId } = req.params;
    try {
        const updatedRule = await Rule.findByIdAndUpdate(ruleId, req.body, { new: true });
        if (!updatedRule) {
            return res.status(404).json({ error: 'Rule not found' });
        }
        res.json(updatedRule);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update rule' });
    }
});

// Delete a rule from MongoDB
app.delete('/api/rules/:ruleId', async (req, res) => {
    const { ruleId } = req.params;
    try {
        const deletedRule = await Rule.findByIdAndDelete(ruleId);
        if (!deletedRule) {
            return res.status(404).json({ error: 'Rule not found' });
        }
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete rule' });
    }
});

// Get all logs from MongoDB
app.get('/api/logs', async (req, res) => {
    try {
        const logs = await Log.find();
        res.json(logs);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch logs' });
    }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
