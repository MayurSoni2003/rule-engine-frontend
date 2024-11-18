import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/Logs.css'; // Assuming you will create a separate CSS file for styling

const Logs = () => {
    const [logData, setLogData] = useState([]);

    useEffect(() => {
        // Fetch logs data
        axios.get('http://127.0.0.1:5000/api/logs') // Adjust API endpoint as per backend
            .then(response => {
                const logs = response.data;
                const parsedLogs = logs.map((log, index) => {
                    // Regex to extract the values from the message string
                    const regex = /\[([^\]]+)\]\sPacket\s\{'source_ip':\s'([\d.]+)',\s'destination_ip':\s'([\d.]+)',\s'source_port':\s(\d+),\s'destination_port':\s(\d+),\s'protocol':\s'(\w+)'\}\saction:\s(\w+)/;
                    const match = log.message.match(regex);

                    // Check if match is found, else assign null or default values
                    const dateTime = match ? match[1] : 'N/A';
                    const sourceIp = match ? match[2] : 'N/A';
                    const destinationIp = match ? match[3] : 'N/A';
                    const sourcePort = match ? match[4] : 'N/A';
                    const destinationPort = match ? match[5] : 'N/A';
                    const protocol = match ? match[6] : 'N/A';
                    const action = match ? match[7] : 'N/A';

                    return {
                        id: index + 1, // Assigning log ID as 1, 2, 3, etc.
                        dateTime: dateTime,
                        source_ip: sourceIp,
                        destination_ip: destinationIp,
                        source_port: sourcePort,
                        destination_port: destinationPort,
                        protocol: protocol,
                        action: action
                    };
                });
                setLogData(parsedLogs);
            })
            .catch(error => console.error("Error fetching logs: ", error));
    }, []);

    return (
        <div className="logs-container">
            <h2>Logs</h2>
            <table className="logs-table">
                <thead>
                    <tr>
                        <th>Log ID</th>
                        <th>Date Time</th>
                        <th>Source IP</th>
                        <th>Destination IP</th>
                        <th>Source Port</th>
                        <th>Destination Port</th>
                        <th>Protocol</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {logData.length === 0 ? (
                        <tr>
                            <td colSpan="8">No logs available.</td>
                        </tr>
                    ) : (
                        logData.map((log) => (
                            <tr key={log.id}>
                                <td>{log.id}</td>
                                <td>{log.dateTime}</td>
                                <td>{log.source_ip}</td>
                                <td>{log.destination_ip}</td>
                                <td>{log.source_port}</td>
                                <td>{log.destination_port}</td>
                                <td>{log.protocol}</td>
                                <td>{log.action}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Logs;
