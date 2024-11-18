import React, { useState, useEffect } from 'react';
import axios from 'axios';

function RuleForm({ editingRule, setEditingRule, setMessage }) {
    const [source_ip, setSourceIp] = useState('');
    const [destination_ip, setDestinationIp] = useState('');
    const [source_port, setSourcePort] = useState('');
    const [destination_port, setDestinationPort] = useState('');
    const [protocol, setProtocol] = useState('');
    const [action, setAction] = useState('DENY');

    const [errors, setErrors] = useState({}); // Track field errors

    const resetForm = () => {
        setSourceIp('');
        setDestinationIp('');
        setSourcePort('');
        setDestinationPort('');
        setProtocol('');
        setAction('DENY');
        setErrors({});
    };

    useEffect(() => {
        if (editingRule) {
            setSourceIp(editingRule.source_ip);
            setDestinationIp(editingRule.destination_ip);
            setSourcePort(editingRule.source_port);
            setDestinationPort(editingRule.destination_port);
            setProtocol(editingRule.protocol);
            setAction(editingRule.action);
            window.scrollTo(0, 0);
        }
    }, [editingRule]);

    const validateIP = (ip) => {
        const ipRegex = /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$/;
        return ipRegex.test(ip);
    };

    const validatePort = (port) => {
        const portNumber = parseInt(port, 10);
        return Number.isInteger(portNumber) && portNumber >= 1 && portNumber <= 65535;
    };

    const validateForm = () => {
        const newErrors = {};

        if (!validateIP(source_ip)) newErrors.source_ip = 'Invalid Source IP address.';
        if (!validateIP(destination_ip)) newErrors.destination_ip = 'Invalid Destination IP address.';
        if (!validatePort(source_port)) newErrors.source_port = 'Invalid Source Port (1-65535).';
        if (!validatePort(destination_port)) newErrors.destination_port = 'Invalid Destination Port (1-65535).';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Return true if no errors
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) return; // Stop submission if validation fails

        const newRule = {
            source_ip,
            destination_ip,
            source_port,
            destination_port,
            protocol,
            action,
        };

        if (editingRule) {
            axios
                .put(`http://localhost:5000/api/rules/${editingRule.id}`, newRule)
                .then(() => {
                    setMessage('Rule updated successfully');
                    setEditingRule(null);
                    resetForm();
                })
                .catch(() => {
                    setMessage('Error updating rule');
                });
        } else {
            axios
                .post('http://localhost:5000/api/rules', newRule)
                .then(() => {
                    setMessage('Rule added successfully');
                    resetForm();
                })
                .catch(() => {
                    setMessage('Error adding rule');
                });
        }
    };

    const handleCancel = () => {
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
                    {errors.source_ip && <p className="error-message">{errors.source_ip}</p>}
                </div>
                <div className="form-group">
                    <label>Destination IP:</label>
                    <input
                        type="text"
                        value={destination_ip}
                        onChange={(e) => setDestinationIp(e.target.value)}
                    />
                    {errors.destination_ip && <p className="error-message">{errors.destination_ip}</p>}
                </div>
                <div className="form-group">
                    <label>Source Port:</label>
                    <input
                        type="text"
                        value={source_port}
                        onChange={(e) => setSourcePort(e.target.value)}
                    />
                    {errors.source_port && <p className="error-message">{errors.source_port}</p>}
                </div>
                <div className="form-group">
                    <label>Destination Port:</label>
                    <input
                        type="text"
                        value={destination_port}
                        onChange={(e) => setDestinationPort(e.target.value)}
                    />
                    {errors.destination_port && <p className="error-message">{errors.destination_port}</p>}
                </div>
                <div className="form-group">
                    <label>Protocol:</label>
                    <select
                        value={protocol}
                        onChange={(e) => setProtocol(e.target.value)}
                    >
                        <option value="Any">Any</option>
                        <option value="TCP">TCP</option>
                        <option value="UDP">UDP</option>
                        <option value="ICMP">ICMP</option>
                        <option value="ARP">ARP</option>
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
                        <option value="MAIL">Mail</option>
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
