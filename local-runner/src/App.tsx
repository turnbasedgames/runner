import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <iframe
        title="gameFrame"
        sandbox="allow-scripts allow-forms allow-same-origin"
        id="gameFrame"
        style={{ height: 'calc(100vh - 50px)', width: '100%', border: 'none' }}
      />
    </div>
  );
}

export default App;
