import React from 'react';
import './App.css';
import CommentsComponent from "./component/CommentsComponent";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>React Comment Demo App</h1>
      </header>
      <CommentsComponent/>
    </div>
  );
}

export default App;
