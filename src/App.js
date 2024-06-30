// src/App.js
import React from 'react';
import EditableTable from './EditableTable';
import { Analytics } from "@vercel/analytics/react"
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>Graveyard Bingo</h1>
      <EditableTable />
      <Analytics />
    </div>
  );
}

export default App;
