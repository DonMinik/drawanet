import './App.css';
import React from 'react';
import CanvasComponent from "./components/canvas.component";
import TextCanvasComponent from "./components/text-canvas.component";

function App() {
  return (
    <div className="App">
        <main className="App-main">
            <CanvasComponent/>
          <TextCanvasComponent coordinates={{x: 300, y:200}} />
        </main>
    </div>
  );
}

export default App;
