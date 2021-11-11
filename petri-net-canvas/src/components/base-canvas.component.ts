import React, {Component} from "react";
import {Coordinates} from "../model/petri-net.interfaces";

export abstract class BaseCanvasComponent<P, S> extends Component<P, S> {
    private isDraw = false;
    mouseMovement: Coordinates[] = [];
    canvasRef: any;
    constructor(props: any) {
        super(props);
        this.canvasRef = React.createRef();
    }

    onMouseDown(event: React.MouseEvent<HTMLCanvasElement>) {
        this.isDraw = true;
        this.mouseMovement.push(  {
            x: event.clientX,
            y: event.clientY
        });
        this.canvasCtx.beginPath();
        this.canvasCtx.moveTo(event.clientX, event.clientY);
    }

    onMouseMove(event: React.MouseEvent<HTMLCanvasElement>) {
        if(this.isDraw) {
            this.mouseMovement.push({x: event.clientX, y:event.clientY});

            this.canvasCtx.lineTo(event.clientX , event.clientY);
            this.canvasCtx.stroke();
        }
    }

    onMouseUp(event: React.MouseEvent<HTMLCanvasElement>) {
        this.isDraw = false;
        this.canvasCtx.closePath();

    }

    abstract get canvasCtx();

    abstract render();
}