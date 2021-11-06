import React, {Component} from "react";
import {Coordinates, PetriNet, PNNode} from "./model/petri-net.interfaces";
import {Place} from "./model/place";
import {Transition} from "./model/transition";
import {Arc} from "./model/arc";
import {Mark} from "./model/mark";

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

    private reset() {
        this.canvasCtx.clearRect(0, 0, this.canvasCtx.canvas.offsetWidth, this.canvasCtx.canvas.offsetHeight);
        this.isDrawElement = false;
        this.detectedShape = Shape.UNDEFINED;
        this.complete = false;
        this.mouseMovement = [];
    }

    private paintNet() {
        this.petriNet.arcs.forEach(arc => arc.draw(this.canvasCtx));
        this.petriNet.places.forEach(place => place.draw(this.canvasCtx));
        this.petriNet.transitions.forEach(transitions => transitions.draw(this.canvasCtx));
    }

    private isStartPosition(x: number,y: number) {
        return Math.abs(x - this.mouseMovement[0]?.x) <  10 && Math.abs(y -this.mouseMovement[0]?.y) < 10;
    }

    private isWithin(coordinates: Coordinates, nodes: PNNode[]): PNNode | undefined {
        console.log(coordinates, 'iswithin', nodes.find(node => node.isWithin(coordinates)))
        return nodes.find(node => node.isWithin(coordinates));
    }

    private detectArc(): { start: PNNode, end?: PNNode, curveCoordinates?: Coordinates | null  } | null{
        const startWithinPlace = this.isWithin(this.mouseMovement[0], this.petriNet.places);
        const startWithinTransition = this.isWithin(this.mouseMovement[0], this.petriNet.transitions);
        const endsWithinPlace = this.isWithin(this.mouseMovement[this.mouseMovement.length -1], this.petriNet.places);
        const endsWithinTransition = this.isWithin(this.mouseMovement[this.mouseMovement.length -1], this.petriNet.transitions);
        const placeToTransition =  startWithinPlace  && endsWithinTransition ;
        const transitionToPlace = startWithinTransition && endsWithinPlace;
        //ARC
        if (placeToTransition  || transitionToPlace) {
            this.complete = true;
            this.detectedShape = Shape.ARC;
            // detect curve
            const curveCoordinates = this.detectArcCurveCoordinates();
            // @ts-ignore
            return {start: placeToTransition ? startWithinPlace : startWithinTransition, end: placeToTransition ? endsWithinTransition: endsWithinPlace, curveCoordinates: curveCoordinates};
        } // MARK
        else if (startWithinPlace && endsWithinPlace && (startWithinPlace as Place).equals(endsWithinPlace as Place)){
            this.detectedShape = Shape.MARK;
            this.complete = true;
            return {start: startWithinPlace};
        }
        return null;
    }

    private detectArcCurveCoordinates(): Coordinates | null {
        const start = this.mouseMovement[0];
        const end = this.mouseMovement[this.mouseMovement.length -1];
        const gradient = (end.x - start.x) !== 0? (end.y - start.y) / (end.x - start.x) : 0;
        const curve: {coordinate: Coordinates | null, gradientDelta: number} = {
            coordinate: null,
            gradientDelta: 0
        };
        this.mouseMovement.forEach(current => {
            const currentGradient = (current.x - start.x) !== 0 ? (current.y - start.y) / (current.x - start.x): 0;
            const gradientDelta = Math.abs(gradient - currentGradient);
            if (Math.abs(gradient - currentGradient) > curve.gradientDelta) {
                curve.coordinate = {x: current.x  + current.x * gradientDelta / 10, y: current.y + current.y * gradientDelta / 10};
                curve.gradientDelta = gradientDelta;
            }
        })

        return curve.coordinate;
    }

    private detectPlaceOrTransition() {
        this.detectReturnToStartPosition();

        if (this.complete) {
            this.detectedShape = this.mouseMovement.filter(c => c.x - this.mouseMovement[0]?.x < -10).length > 0 &&
            this.mouseMovement.filter(c => this.mouseMovement[0]?.x - c.x < -10).length > 0
                ? Shape.PLACE : Shape.TRANSITION;
        }
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
            radius: (highestX - lowestX > (highestY - lowestY) ? highestX - lowestX  : (highestY - lowestY) ) / 2,
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
        const arcParameters = this.detectArc();
        if(!this.complete) {
            this.detectPlaceOrTransition();
        }

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
                    if (arcParameters && arcParameters.end) {
                        this.petriNet.arcs.push(new Arc(
                            arcParameters.start.closestTouchPoint({x:event.clientX, y:event.clientY}),
                            arcParameters.end.closestTouchPoint(this.mouseMovement[0]),
                            arcParameters.curveCoordinates
                        ));
                    }
                    break;
                case Shape.MARK:
                    const mark = new Mark(this.mouseMovement[0] ? this.mouseMovement[0] : {x:event.clientX, y:event.clientY});
                    (arcParameters?.start as Place).addMark(mark);
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
    ARC,
    MARK
}

interface CircleProperties {
    centerCoordinates: Coordinates,
    radius: number
}

export default CanvasController;

