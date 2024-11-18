import React from 'react';
import RuleList from './components/RuleList';
import Analytics from './components/Analytics';
import Logs from './components/Logs';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import './App.css';

function App() {
    return (
        <Router>
            <div className="app-container">
                <header>
                    <h1>Rule Engine Dashboard</h1>
                    <nav>
                        <Link to="/">Home</Link>
                        <Link to="/analytics">Analytics</Link>
                        <Link to="/logs">Logs</Link>
                    </nav>
                </header>
                <main>
                    <Routes>
                        <Route path="/" element={<RuleList />} />
                        <Route path="/analytics" element={<Analytics />} />
                        <Route path="/logs" element={<Logs />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
