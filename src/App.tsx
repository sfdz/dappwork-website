import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import BountyDetail from './components/BountyDetail';
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
          <Route path="/bounty/:id" element={<BountyDetail />} />
        </Routes>
      </header>
    </div>
  );
}

export default App;
