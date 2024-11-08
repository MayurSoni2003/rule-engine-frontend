import React from 'react';
import RuleList from './components/RuleList';
import './App.css';

function App() {
    return (
        <div className="app-container">
            <header>
                <h1>Rule Engine CRUD Operations</h1>
            </header>
            <main>
                <RuleList />
            </main>
        </div>
    );
}

export default App;
