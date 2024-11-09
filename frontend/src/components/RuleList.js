import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RuleForm from './RuleForm';
import './RuleList.css';

function RuleList() {
    const [rules, setRules] = useState([]);
    const [message, setMessage] = useState('');
    const [editingRule, setEditingRule] = useState(null);

    // Fetch rules from the backend
    useEffect(() => {
        axios.get('http://localhost:5000/api/rules')
            .then(response => setRules(response.data))
            .catch(() => setMessage('Error fetching rules'));
    }, [rules]);

    // Delete a rule with confirmation and renumbering
    const deleteRule = (id) => {
        if (window.confirm("Are you sure you want to delete this rule?")) {
            axios.delete(`http://localhost:5000/api/rules/${id}`)
                .then(() => {
                    setMessage('Rule deleted successfully');
                })
                .catch(() => {
                    setMessage('Error deleting rule');
                });
        }
    };

    // Set the rule to be edited
    const editRule = (rule) => {
        setEditingRule(rule);
    };

    return (
        <div>
            <h2>Firewall Rules</h2>
            <RuleForm editingRule={editingRule} setEditingRule={setEditingRule} setMessage={setMessage} />

            <div className="rules-list">
                {rules.length === 0 && <p>No rules available</p>}
                {rules.map(rule => (
                    <div key={rule.id} className="card">
                        <div className="card-header">{`Rule #${rule.id}`}</div>
                        <div className="card-content">
                            <p><strong>Source IP:</strong> {rule.source_ip}</p>
                            <p><strong>Destination IP:</strong> {rule.destination_ip}</p>
                            <p><strong>Source Port:</strong> {rule.source_port}</p>
                            <p><strong>Destination Port:</strong> {rule.destination_port}</p>
                            <p><strong>Protocol:</strong> {rule.protocol}</p>
                            <p><strong>Action:</strong> {rule.action}</p>
                        </div>
                        <div className="card-actions">
                            <button onClick={() => editRule(rule)}>Edit</button>
                            <button onClick={() => deleteRule(rule.id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
            {message && <p className="error-message">{message}</p>}
        </div>
    );
}

export default RuleList;
