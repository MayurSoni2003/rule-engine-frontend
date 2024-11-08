// src/components/RuleForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function RuleForm({ editingRule, setEditingRule, setMessage }) {
    const [source_ip, setSourceIp] = useState('');
    const [destination_ip, setDestinationIp] = useState('');
    const [source_port, setSourcePort] = useState('');
    const [destination_port, setDestinationPort] = useState('');
    const [protocol, setProtocol] = useState('');
    const [action, setAction] = useState('DENY');

    // Reset form fields after adding/editing a rule
    const resetForm = () => {
        setSourceIp('');
        setDestinationIp('');
        setSourcePort('');
        setDestinationPort('');
        setProtocol('');
        setAction('DENY');
    };

    // If an existing rule is being edited, set the fields to its values
    useEffect(() => {
        if (editingRule) {
            setSourceIp(editingRule.source_ip);
            setDestinationIp(editingRule.destination_ip);
            setSourcePort(editingRule.source_port);
            setDestinationPort(editingRule.destination_port);
            setProtocol(editingRule.protocol);
            setAction(editingRule.action);

            // Scroll to the top of the page when editing a rule
            window.scrollTo(0, 0);
        }
    }, [editingRule]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const newRule = {
            source_ip,
            destination_ip,
            source_port,
            destination_port,
            protocol,
            action,
        };

        if (editingRule) {
            // Update existing rule if being edited
            axios
                .put(`http://localhost:5000/api/rules/${editingRule.id}`, newRule)
                .then(() => {
                    setMessage('Rule updated successfully');
                    setEditingRule(null);  // Clear editing state
                    resetForm();  // Reset the form after submission
                })
                .catch(() => {
                    setMessage('Error updating rule');
                });
        } else {
            // Add a new rule
            axios
                .post('http://localhost:5000/api/rules', newRule)
                .then(() => {
                    setMessage('Rule added successfully');
                    resetForm();  // Reset the form after submission
                })
                .catch(() => {
                    setMessage('Error adding rule');
                });
        }
    };

    const handleCancel = () => {
        // Reset the form and exit edit mode
        setEditingRule(null);
        resetForm();
    };

    return (
        <div className="rule-form">
            <h3>{editingRule ? 'Edit Rule' : 'Add New Rule'}</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Source IP:</label>
                    <input
                        type="text"
                        value={source_ip}
                        onChange={(e) => setSourceIp(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Destination IP:</label>
                    <input
                        type="text"
                        value={destination_ip}
                        onChange={(e) => setDestinationIp(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Source Port:</label>
                    <input
                        type="text"
                        value={source_port}
                        onChange={(e) => setSourcePort(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Destination Port:</label>
                    <input
                        type="text"
                        value={destination_port}
                        onChange={(e) => setDestinationPort(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Protocol:</label>
                    <select
                        value={protocol}
                        onChange={(e) => setProtocol(e.target.value)}
                    >
                        <option value="any">Any</option>
                        <option value="tcp">TCP</option>
                        <option value="udp">UDP</option>
                        <option value="icmp">ICMP</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Action:</label>
                    <select
                        value={action}
                        onChange={(e) => setAction(e.target.value)}
                    >
                        <option value="DENY">Deny</option>
                        <option value="ALLOW">Allow</option>
                    </select>
                </div>
                <div className="form-actions">
                    <button type="submit">{editingRule ? 'Update Rule' : 'Add Rule'}</button>
                    {editingRule && (
                        <button type="button" onClick={handleCancel} className="cancel-btn">
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}

export default RuleForm;
