import React, {Component} from "react";
import {PetriNet} from "../model/petri-net.interfaces";
import FileSaver from "file-saver";

class DownloadComponent extends Component<{ petriNet: PetriNet }, any> {

    constructor(props: { petriNet: PetriNet }) {
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
        const file = this.buildFile(net);
        FileSaver.saveAs(file);
    }

    private buildFile(net: PetriNet) {
        const fileContent = ['.type pn \n']
        fileContent.push('.transitions \n');
        net.transitions.forEach(transition => {
            fileContent.push(transition.exportName);
            fileContent.push('\n');
        });
        fileContent.push('.places \n');
        net.places.forEach(place => {
            fileContent.push(place.exportName);
            fileContent.push(' ' + place.marks.length);
            fileContent.push('\n');
        });
        fileContent.push('.arcs \n');
        net.arcs.forEach(arc => {
            fileContent.push(arc.start.exportName + ' ' + arc.end.exportName);
            fileContent.push('\n');
        });
        return new File(fileContent, "pn.txt", {type: "text/plain;charset=utf-8"});
    }

    render() {
        return (
            <div className='download-component'>
                <h2>download your drawing</h2>
                <button onClick={() => this.onClick()} type="button" className="download-button"
                        style={{width: '100px'}}/>
            </div>
        );
    }
}

export default DownloadComponent;