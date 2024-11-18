const mongoose = require('mongoose');
const fs = require('fs');

mongoose.connect('mongodb://localhost:27017/firewall', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const RuleSchema = new mongoose.Schema({
    id: Number,
    source_ip: String,
    destination_ip: String,
    source_port: Number,
    destination_port: Number,
    protocol: String,
    action: String,
});

const Rule = mongoose.model('Rule', RuleSchema);

const migrateRules = async () => {
    try {
        const rules = JSON.parse(fs.readFileSync('rules.json', 'utf-8'));
        await Rule.insertMany(rules);
        console.log('Rules migrated successfully');
        process.exit(0);
    } catch (err) {
        console.error('Error migrating rules:', err);
        process.exit(1);
    }
};

migrateRules();
