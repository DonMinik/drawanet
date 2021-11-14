import React, {Component} from "react";
import {PetriNet} from "../model/petri-net.interfaces";

class DownloadComponent extends Component<{petriNet: PetriNet}, any> {

    constructor(props: {petriNet: PetriNet}) {
        super(props);
    }

    onClick() {
        const net = this.props.petriNet;
        console.log('places')
        net.places.forEach(place => console.log(place));
        console.log('transitions')
        net.transitions.forEach(transition => console.log(transition));
        console.log('arcs')
        net.arcs.forEach(arc => console.log(arc))
    }

    render() {
       return (
           <div className='download-component'>
               <h2 >download your drawing</h2>
               <button onClick={() => this.onClick()} type="button" className="download-button" style={{width: '100px'}}/>
           </div>
       );
    }
}

export default DownloadComponent;