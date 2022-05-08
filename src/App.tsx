import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import ClaimBounty from './components/ClaimBounty';
import NewBounty from './components/NewBounty';
import OpenBounties from './components/OpenBounties';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>DAppWork</h1>
        <Routes>
          <Route path="/" element={<OpenBounties />} />
          <Route path="/new-bounty" element={<NewBounty />} />
          <Route path="/bounty/:id" element={<ClaimBounty githubUsername='sfdz' />} />
        </Routes>
      </header>
    </div>
  );
}

export default App;
