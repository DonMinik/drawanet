import React, {Component} from "react";
import {PetriNet} from "../model/petri-net.interfaces";
import {FileSaveService} from "../services/file-save.service";

class DownloadComponent extends Component<{ petriNet: PetriNet }, any> {

    constructor(props: { petriNet: PetriNet }) {
        super(props);
    }

    onClick() {
        const net = this.props.petriNet;
        FileSaveService.saveFile(net);
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