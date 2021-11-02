import React, {Component} from "react";
import {Coordinates, PetriNet, PNNode} from "./model/petri-net.interfaces";
import {Place} from "./model/place";
import {Transition} from "./model/transition";
import {Arc} from "./model/arc";

class CanvasController extends Component {
    private isDrawElement = false;
    private petriNet: PetriNet;
    private initialized = false;
    private detectedShape = Shape.UNDEFINED;
    private complete = false;

    private mouseMovement: Coordinates[] = [];

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
                _ctx.fillStyle = '#FFFFFF';
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
        return Math.abs(x - this.mouseMovement[0]?.x) <  10 && Math.abs(y -this.mouseMovement[0]?.y) < 10;
    }

    private reset() {
        this.canvasCtx.clearRect(0, 0, this.canvasCtx.canvas.offsetWidth, this.canvasCtx.canvas.offsetHeight);
        this.isDrawElement = false;
        this.detectedShape = Shape.UNDEFINED;
        this.complete = false;
        this.mouseMovement = [];
    }

    private isWithin(coordinates: Coordinates, nodes: PNNode[]): PNNode | undefined {
        console.log(coordinates, 'iswithin', nodes.find(node => node.isWithin(coordinates)))
        return nodes.find(node => node.isWithin(coordinates));
    }

    private detectArc(): {start: PNNode, end: PNNode} | null{
        const startWithinPlace = this.isWithin(this.mouseMovement[0], this.petriNet.places);
        const startWithinTransition = this.isWithin(this.mouseMovement[0], this.petriNet.transitions);
        const endsWithinPlace = this.isWithin(this.mouseMovement[this.mouseMovement.length -1], this.petriNet.places);
        const endsWithinTransition = this.isWithin(this.mouseMovement[this.mouseMovement.length -1], this.petriNet.transitions);
        const start =  startWithinPlace ? startWithinPlace : startWithinTransition ? startWithinTransition : null;
        const end = endsWithinPlace ? endsWithinPlace : endsWithinTransition ? endsWithinTransition : null;
        if (start  && end ) {
            this.complete = true;
            this.detectedShape = Shape.ARC;
            console.log('arc from', start, 'to', end);
            return {start: start, end: end};
        }
        return null;
    }


    /**
     * todo: refactor
     * @private
     */
    private detectShape(): {start: PNNode, end: PNNode} | null {


        const arcNodes = this.detectArc();

        if(arcNodes) {
            return arcNodes;
        }

        //detect places and transitions
        this.detectReturnToStartPosition();

        if(this.complete) {
            this.detectedShape = this.mouseMovement.filter(c => c.x - this.mouseMovement[0]?.x < -10).length > 0 &&
                this.mouseMovement.filter(c => this.mouseMovement[0]?.x - c.x < -10).length > 0
                ? Shape.PLACE : Shape.TRANSITION;
        }
        return null;
    }

    private detectReturnToStartPosition() {
        let isStartPositionLeft = false;
        this.mouseMovement.forEach(c => {
            const isStartPosition = this.isStartPosition(c.x, c.y);
            if (!isStartPosition) {
                isStartPositionLeft = true;
            }
            if (isStartPositionLeft && isStartPosition) {
                this.complete = true;
            }
        });
    }

    private get maxDistance(): Coordinates {
       return {
           x: this.mouseMovement.reduce((prev, current) => (Math.abs(this.mouseMovement[0].x - prev.x) > Math.abs(this.mouseMovement[0].x - current.x)) ? prev : current).x,
           y: this.mouseMovement.reduce((prev, current) => (Math.abs(this.mouseMovement[0].y -prev.y) > Math.abs(this.mouseMovement[0].y - current.y)) ? prev : current).y
       }
    }

    private get circleProperties(): CircleProperties {
        const highestX = this.mouseMovement.reduce((prev, current) => (prev.x > current.x) ? prev : current).x;
        const lowestX = this.mouseMovement.reduce((prev, current) => (prev.x < current.x) ? prev : current).x;
        const highestY = this.mouseMovement.reduce((prev, current) => (prev.y > current.y) ? prev : current).y;
        const lowestY = this.mouseMovement.reduce((prev, current) => (prev.y < current.y) ? prev : current).y;
        return {
            radius: (Math.abs(highestX - lowestX) > Math.abs((highestY - lowestY)) ? Math.abs(highestX - lowestX)  : Math.abs((highestY - lowestY)) ) / 2,
                centerCoordinates: {
                x: (highestX - lowestX) / 2 + lowestX,
                y: (highestY - lowestY) / 2 + lowestY
            }
        }
    }

    onMouseDown(event: React.MouseEvent<HTMLCanvasElement>) {
        this.isDrawElement = true;
        this.mouseMovement.push(  {
            x: event.clientX,
            y: event.clientY
        });
        this.canvasCtx.beginPath();
        this.canvasCtx.moveTo(event.clientX, event.clientY);

    }

    onMouseUp(event: React.MouseEvent<HTMLCanvasElement>) {
        this.canvasCtx.closePath();
        const nodesForArc = this.detectShape();
        if (this.complete) {

            switch (this.detectedShape) {
                case Shape.PLACE:
                    const circleProps = this.circleProperties;
                    this.petriNet.places.push(new Place(circleProps.centerCoordinates, circleProps.radius));
                    break;
                case Shape.TRANSITION:
                    this.petriNet.transitions.push(new Transition(this.mouseMovement[0], this.maxDistance));
                    break;
                case Shape.ARC:
                    if (nodesForArc) {
                        this.petriNet.arcs.push(new Arc(
                            nodesForArc.start.closestTouchPoint(this.mouseMovement[0]),
                            nodesForArc.end.closestTouchPoint({x: event.clientX, y: event.clientY})
                        ));
                    }
                    break;
            }
        }
        this.reset();
        this.paintNet();
    }

    onMouseMove(event: React.MouseEvent<HTMLCanvasElement>) {
        if(this.isDrawElement) {
            this.mouseMovement.push({x: event.clientX, y:event.clientY});

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

interface CircleProperties {
    centerCoordinates: Coordinates,
    radius: number
}

export default CanvasController;

