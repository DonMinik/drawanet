import React, {Component} from "react";
import {Coordinates} from "../model/petri-net.interfaces";

export abstract class BaseCanvasComponent<P, S> extends Component<P, S> {
    private isDraw = false;
    mouseMovement: Coordinates[] = [];
    canvasRef: React.RefObject<HTMLCanvasElement>;
    canvasCtx: CanvasRenderingContext2D;

    protected constructor(props: any) {
        super(props);
        this.canvasRef = React.createRef();
    }

    protected get canvasPositionLeft() {
        return this.canvasRef.current.getBoundingClientRect().left;
    }

    protected get canvasPositionRight() {
        return this.canvasRef.current.getBoundingClientRect().right;
    }

    protected get canvasPositionTop() {
        return this.canvasRef.current.getBoundingClientRect().top;
    }

    protected get canvasPositionBottom() {
        return this.canvasRef.current.getBoundingClientRect().bottom;
    }

    protected isWithinCanvas(coordinates: Coordinates) {
        return coordinates.x > this.canvasPositionLeft && coordinates.x < this.canvasPositionRight &&
            coordinates.y > this.canvasPositionTop && coordinates.y < this.canvasPositionBottom;
    }

    onMouseDown(event: React.MouseEvent<HTMLCanvasElement>) {
        const x = event.clientX -  this.canvasPositionLeft;
        const y = event.clientY - this.canvasPositionTop;
        this.isDraw = true;
        this.mouseMovement.push(  {
            x: x,
            y: y
        });
        this.canvasCtx?.beginPath();
        this.canvasCtx?.moveTo(x, y);
    }

    onMouseMove(event: React.MouseEvent<HTMLCanvasElement>) {
        if(this.isDraw) {
            const x = event.clientX - this.canvasPositionLeft ;
            const y = event.clientY - this.canvasPositionTop;
            this.mouseMovement.push({x: x, y:y});
            this.canvasCtx?.lineTo(x , y);
            this.canvasCtx?.stroke();
        }
    }

    onMouseUp(event: React.MouseEvent<HTMLElement>) {
        this.isDraw = false;
        this.canvasCtx?.closePath();

    }

    componentDidMount() {
        this.canvasCtx = this.canvasRef?.current?.getContext('2d');
    }

    abstract render();
}