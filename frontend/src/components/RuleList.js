import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RuleForm from './RuleForm';
import './css/RuleList.css';

function RuleList() {
    const [rules, setRules] = useState([]);
    const [message, setMessage] = useState('');
    const [editingRule, setEditingRule] = useState(null);

    // Fetch rules from the backend (only once when the component mounts)
    useEffect(() => {
        axios.get('http://localhost:5000/api/rules')
            .then(response => setRules(response.data))
            .catch(() => setMessage('Error fetching rules'));
    }, []); // Empty dependency array to fetch only on component mount

    // Delete a rule with confirmation and direct state update
    const deleteRule = (id) => {
        if (window.confirm("Are you sure you want to delete this rule?")) {
            axios.delete(`http://localhost:5000/api/rules/${id}`)
                .then(() => {
                    setMessage('Rule deleted successfully');
                    // Remove the deleted rule from the state directly
                    setRules(prevRules => prevRules.filter(rule => rule._id !== id));
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
                    <div key={rule._id} className="card">
                        <div className="card-header">{`Rule #${rule._id}`}</div>
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
                            <button onClick={() => deleteRule(rule._id)}>Delete</button> {/* Use _id here */}
                        </div>
                    </div>
                ))}
            </div>
            {message && <p className={message.includes('successfully') ? 'success-message' : 'error-message'}>{message}</p>}
        </div>
    );
}

export default RuleList;
