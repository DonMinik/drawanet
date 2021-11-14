import './App.css';
import React from 'react';
import CanvasComponent from "./components/canvas.component";
import HeaderComponent from "./components/header.component";
import FooterComponent from "./components/footer.component";
import DownloadComponent from "./components/download.component";

function App() {
  return (
    <div className="App">
        <main className="App-main">
            <HeaderComponent />
            <CanvasComponent/>
            <DownloadComponent />
            <hr/>
            <FooterComponent />
        </main>
    </div>
  );
}

export default App;
