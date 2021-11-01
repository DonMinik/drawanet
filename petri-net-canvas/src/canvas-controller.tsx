import React, {Component} from "react";

class CanvasController extends Component {
    constructor(props: any) {
        super(props);
    }

    private isDrawElement = false;

    onMouseDown() {
        this.isDrawElement = true
     alert('mouse Down');
    }

    onMouseUp() {
        this.isDrawElement = false;

    }

    onMouseMove() {

    }

    render() {
        return<div> <canvas onMouseDown={() => this.onMouseDown()} onMouseUp={() => this.onMouseUp()} onMouseMove={() => this.onMouseMove()}/></div>;
    }
}

export default CanvasController;

