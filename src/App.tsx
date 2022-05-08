import React from 'react';
import './App.css';
import ClaimBounty from './components/ClaimBounty';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>DAppWork</h1>
        <ClaimBounty githubUsername='sfdz'/>
      </header>
    </div>
  );
}

export default App;
