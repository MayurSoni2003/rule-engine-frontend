# backend/app.py

from flask import Flask, jsonify, request
from flask_cors import CORS  # Import CORS
import json

app = Flask(__name__)
CORS(app)

# Load rules from JSON
def load_rules():
    with open('rules.json', 'r') as f:
        return json.load(f)

# Save rules to JSON
def save_rules(rules):
    with open('rules.json', 'w') as f:
        json.dump(rules, f, indent=4)

# Load logs from JSON
# def load_logs():
#     with open('logs.json', 'r') as f:
#         return json.load(f)

@app.route('/api/rules', methods=['GET'])
def get_rules():
    rules = load_rules()
    return jsonify(rules)

@app.route('/api/rules', methods=['POST'])
def add_rule():
    rules = load_rules()
    new_rule = request.json
    new_rule['id'] = max(rule['id'] for rule in rules) + 1 if rules else 1
    rules.append(new_rule)
    save_rules(rules)
    return jsonify(new_rule), 201

@app.route('/api/rules/<int:rule_id>', methods=['PUT'])
def update_rule(rule_id):
    rules = load_rules()
    updated_rule = request.json
    for rule in rules:
        if rule['id'] == rule_id:
            rule.update(updated_rule)
            save_rules(rules)
            return jsonify(rule)
    return jsonify({'error': 'Rule not found'}), 404

@app.route('/api/rules/<int:rule_id>', methods=['DELETE'])
def delete_rule(rule_id):
    rules = load_rules()
    
    # Filter out the rule to delete
    rules = [rule for rule in rules if rule['id'] != rule_id]
    
    # Renumber remaining rules
    for i, rule in enumerate(rules, start=1):
        rule['id'] = i
    
    save_rules(rules)
    return '', 204


@app.route('/api/logs', methods=['GET'])
def get_logs():
    # Replace 'logs.json' with the actual file or method where logs are stored
    with open('logs.json', 'r') as f:
        logs = json.load(f)
    return jsonify(logs)

if __name__ == '__main__':
    app.run(debug=True)
