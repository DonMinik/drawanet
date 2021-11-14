import './App.css';
import React, {Component} from 'react';
import CanvasComponent from "./components/canvas.component";
import HeaderComponent from "./components/header.component";
import FooterComponent from "./components/footer.component";
import DownloadComponent from "./components/download.component";
import {PetriNet} from "./model/petri-net.interfaces";

class App extends Component<any, {petriNet: PetriNet}> {

    constructor(props: any) {
        super(props);
        this.state = {
            petriNet: {
                arcs: [],
                places: [],
                transitions: []
            }
        }
    }

    render() {
        return (
            <div className="App">
                <main className="App-main">
                    <HeaderComponent/>
                    <CanvasComponent petriNet={this.state.petriNet}/>
                    <DownloadComponent petriNet={this.state.petriNet}/>
                    <hr/>
                    <FooterComponent/>
                </main>
            </div>
        );
    }
}

export default App;
