const mongoose = require('mongoose');
const fs = require('fs');

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/firewall', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const LogSchema = new mongoose.Schema({
    message: { type: String, required: true }
});

const Log = mongoose.model('Log', LogSchema);

// Migrate logs
const migrateLogs = async () => {
    try {
        const logs = JSON.parse(fs.readFileSync('logs.json', 'utf-8'));
        const logEntries = logs.map(log => ({
            message: log.message,
        }));

        // Insert all logs into MongoDB
        await Log.insertMany(logEntries);
        console.log('Logs migrated successfully');
        process.exit(0);  // Exit the process after successful migration
    } catch (err) {
        console.error('Error migrating logs:', err);
        process.exit(1);  // Exit the process with an error code
    }
};

// Run migration
migrateLogs();
