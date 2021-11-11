import './App.css';
import React from 'react';
import CanvasComponent from "./components/canvas.component";
import TextCanvasComponent from "./components/text-canvas.component";

function App() {
  return (
    <div className="App">
        <main className="App-main">
            <CanvasComponent/>
            <TextCanvasComponent/>
        </main>
    </div>
  );
}

export default App;
