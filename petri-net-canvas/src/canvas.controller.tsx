import React, {Component} from "react";
import {Coordinates, PetriNet} from "./model/petri-net.interfaces";
import {Place} from "./model/place";
import {Transition} from "./model/transition";

class CanvasController extends Component {
    private isDrawElement = false;
    private startCoordinates: Coordinates | undefined;
    private maxDistance: Coordinates = {x:0, y:0};
    private petriNet: PetriNet;
    private initialized = false;
    private detectedShape = Shape.UNDEFINED;
    private complete = false;
    private isStartPositionLeft = false;

    canvasRef: any;
    constructor(props: any) {
        super(props);
        this.canvasRef = React.createRef();
        this.petriNet = {
            arcs: [],
            places: [],
            transitions: []
        }
    }

    private get canvasCtx(): CanvasRenderingContext2D {
        const _ctx = this.canvasRef?.current?.getContext('2d');
        if (!this.initialized) {
            if(_ctx) {
                _ctx.canvas.width = _ctx.canvas.clientWidth;
                _ctx.canvas.height = 400;
                _ctx.strokeStyle = '#B6DC9E';
                _ctx.lineWidth = 1;
            }
            this.initialized = true;
        }
        return _ctx;
    }

    private paintNet() {
        this.petriNet.arcs.forEach(arc => arc.draw(this.canvasCtx));
        this.petriNet.places.forEach(place => place.draw(this.canvasCtx));
        this.petriNet.transitions.forEach(transitions => transitions.draw(this.canvasCtx));
    }

    private isStartPosition(x: number,y: number) {
        if (this.startCoordinates && this.isStartPositionLeft) {
            return Math.abs(x - this.startCoordinates?.x) <  10 && Math.abs(y -this.startCoordinates?.y) < 10;
        }
        return this.startCoordinates?.x === x && this.startCoordinates?.y === y;
    }

    private reset() {
        this.canvasCtx.clearRect(0, 0, this.canvasCtx.canvas.offsetWidth, this.canvasCtx.canvas.offsetHeight);
        this.startCoordinates = undefined;
        this.isDrawElement = false;
        this.isStartPositionLeft = false;
        this.detectedShape = Shape.UNDEFINED;
        this.complete = false;
        this.maxDistance = {x:0,y:0}
    }

    onMouseDown(event: React.MouseEvent<HTMLCanvasElement>) {
        this.isDrawElement = true;
        this.startCoordinates =  {
            x: event.clientX,
            y: event.clientY
        }
        this.canvasCtx.beginPath();
        this.canvasCtx.moveTo(event.clientX, event.clientY);

    }

    onMouseUp(event: React.MouseEvent<HTMLCanvasElement>) {
        this.canvasCtx.closePath();

        if (this.startCoordinates && this.complete) {

            switch (this.detectedShape) {
                case Shape.PLACE:
                    this.petriNet.places.push(new Place(this.startCoordinates, this.maxDistance));
                    break;
                case Shape.TRANSITION:
                    this.petriNet.transitions.push(new Transition(this.startCoordinates, this.maxDistance));
                    break;
            }
        }
        this.reset();
        this.paintNet();
    }

    onMouseMove(event: React.MouseEvent<HTMLCanvasElement>) {
        if(this.isDrawElement && this.startCoordinates) {
            //detect if start region is left
            if (Math.abs(this.startCoordinates.x - event.clientX) > 10 && Math.abs(this.startCoordinates.y - event.clientY)) {
                this.isStartPositionLeft = true;
            }

            // detect is place
            if(event.clientX - this.startCoordinates?.x < - 20) {
                this.detectedShape = Shape.PLACE
            }

            //detect place or transition complete
            if (this.isStartPosition(event.clientX, event.clientY)) {
                if (this.detectedShape === Shape.UNDEFINED) {
                    this.detectedShape = Shape.TRANSITION
                }
                this.complete = true;
            }

            //detect most far distance
            if (Math.abs( event.clientX - this.startCoordinates.x) > Math.abs(this.maxDistance.x)) {
                this.maxDistance.x =  event.clientX -this.startCoordinates.x;
            }
            if (Math.abs(event.clientY -this.startCoordinates.y) > Math.abs(this.maxDistance.y)) {
                this.maxDistance.y = event.clientY - this.startCoordinates.y;
            }

            this.canvasCtx.lineTo(event.clientX , event.clientY);
            this.canvasCtx.stroke();
        }
    }

    render() {
        return(<div>
            <canvas    ref={this.canvasRef}

                       onMouseDown={(e) => this.onMouseDown(e)}
                       onMouseUp={(e) => this.onMouseUp(e)}
                       onMouseMove={(e) => this.onMouseMove(e)}
                       className='canvas'
            />
        </div>);
    }
}

enum Shape {
    UNDEFINED,
    PLACE,
    TRANSITION,
    ARC
}

export default CanvasController;

