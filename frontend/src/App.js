import React from 'react';
import RuleList from './components/RuleList';
import Analytics from './components/Analytics'; // Import Analytics component
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
                    </nav>
                </header>
                <main>
                    <Routes>
                        <Route path="/" element={<RuleList />} />
                        <Route path="/analytics" element={<Analytics />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
