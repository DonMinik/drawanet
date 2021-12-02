import './App.css';
import React, {Component} from 'react';
import CanvasComponent from "./components/canvas.component";
import HeaderComponent from "./components/header.component";
import FooterComponent from "./components/footer.component";
import DownloadComponent from "./components/download.component";
import {PetriNet} from "./model/petri-net.interfaces";

class App extends Component<any, {petriNet: PetriNet}> {

    canvasRef: React.RefObject<CanvasComponent>;


    constructor(props: any) {
        super(props);
        this.state = {
            petriNet: {
                arcs: [],
                places: [],
                transitions: []
            }
        }
        this.canvasRef = React.createRef();
    }

    onMouseUp(e) {
        console.log('mouse Up');
        this.canvasRef.current.checkParentMouseUp(e);
    }

    render() {
        return (
            <div className="App" onMouseUp={(e) => this.onMouseUp(e)}>
                <main className="App-main">
                    <HeaderComponent/>
                    <CanvasComponent ref={this.canvasRef} petriNet={this.state.petriNet}/>
                    <DownloadComponent petriNet={this.state.petriNet}/>
                    <hr/>
                    <FooterComponent/>
                </main>
            </div>
        );
    }
}

export default App;
