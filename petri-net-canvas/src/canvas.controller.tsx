import React, {Component} from "react";
import {Coordinates, PetriNet} from "./model/petri-net.interfaces";
import {Place} from "./model/place";

class CanvasController extends Component {
    private isDrawElement = false;
    private startCoordinates: Coordinates | undefined;
    private petriNet: PetriNet;
    private initialized = false;

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


    onMouseDown(event: React.MouseEvent<HTMLCanvasElement>) {
        this.isDrawElement = true;
        this.startCoordinates =  {
            x: event.clientX,
            y: event.clientY
        }
        this.canvasCtx.beginPath();

    }

    onMouseUp(event: React.MouseEvent<HTMLCanvasElement>) {
        this.isDrawElement = false;
        this.canvasCtx.closePath();

        const coordinates = {
            x: event.clientX,
            y: event.clientY
        }
        if (this.startCoordinates) {
            const place = new Place(this.startCoordinates, coordinates)
            place.draw(this.canvasCtx);
            this.startCoordinates = undefined;
        }
    }

    onMouseMove(event: React.MouseEvent<HTMLCanvasElement>) {
        if(this.isDrawElement) {

            if (this.startCoordinates) {
                const x = this.startCoordinates?.x - this.canvasCtx.canvas.offsetLeft;
                const y = this.startCoordinates?.y - this.canvasCtx.canvas.offsetTop;
                this.canvasCtx.lineTo(x, y);
                this.canvasCtx.stroke();
            }
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

export default CanvasController;

