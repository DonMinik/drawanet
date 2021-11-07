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

    private isWithin(coordinates: Coordinates, nodes: PNNode<any>[]): PNNode<any> | undefined {
        return nodes.find(node => node.isWithin(coordinates));
    }

    private detectArc(): { start: PNNode<any>, end?: PNNode<any> } | null{
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
            // @ts-ignore
            return {start: placeToTransition ? startWithinPlace : startWithinTransition, end: placeToTransition ? endsWithinTransition: endsWithinPlace};
        } // MARK
        else if (startWithinPlace && endsWithinPlace && (startWithinPlace as Place).equals(endsWithinPlace as Place)){
            this.detectedShape = Shape.MARK;
            this.complete = true;
            return {start: startWithinPlace};
        }
        return null;
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
    private addArc(arcParameters: { start: PNNode<any>; end?: PNNode<any> } | null) {
        if (arcParameters && arcParameters.end) {
            const filteredMovements =
                this.mouseMovement.filter(move => {
                    return !(arcParameters.start.isWithin(move) || arcParameters.end?.isWithin(move));
                });
            const newArc = new Arc(arcParameters.start, arcParameters.end, filteredMovements)
            const sameArc = this.petriNet.arcs.find(arc => arc.equals(newArc));
            if (!sameArc) {
                this.petriNet.arcs.push(newArc);
            } else {
                sameArc.weight++;
            }
        }
    }

    private determinePotentialNodesToDelete(nodes :PNNode<any>[]) {
        const start = this.mouseMovement[0];
        const end = this.mouseMovement[this.mouseMovement.length -1];

        return nodes.filter(node => {
            const startsAndEndsOutside =  !node.isWithin(start) && !node.isWithin(end);
            const crossesPlace = this.mouseMovement.filter(move => node.isWithin(move)).length > 0;
            return startsAndEndsOutside && crossesPlace;
        });
    }

    private checkForDeleteMovement() {


        //places
        const potentialPlacesToDelete = this.determinePotentialNodesToDelete(this.petriNet.places);

        //transitions
        const potentialTransitionsToDelete = this.determinePotentialNodesToDelete(this.petriNet.transitions);

        //arcs
        const potentialArcsToDelete = this.petriNet.arcs.filter(arc => {
            return arc.isCrossing(this.mouseMovement);
        })


        if (potentialPlacesToDelete.length + potentialTransitionsToDelete.length === 1) {
            if (potentialPlacesToDelete[0]) {
                this.petriNet.places = this.petriNet.places.filter(place => place !== potentialPlacesToDelete[0]);
            } else if (potentialTransitionsToDelete[0]){
                this.petriNet.transitions = this.petriNet.transitions.filter(transition => transition !== potentialTransitionsToDelete[0]);
            }
        } else if (potentialArcsToDelete.length === 1) {
            this.petriNet.arcs = this.petriNet.arcs.filter(arc => arc !== potentialArcsToDelete[0]);
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
        this.isDrawElement = false;
        this.canvasCtx.closePath();
        const arcParameters = this.detectArc();
        if(!this.complete) {
            this.detectPlaceOrTransition();
        }

        switch (this.detectedShape) {
            case Shape.PLACE:
                const circleProps = this.circleProperties;
                this.petriNet.places.push(new Place(circleProps.centerCoordinates, circleProps.radius));
                break;
            case Shape.TRANSITION:
                this.petriNet.transitions.push(new Transition(this.mouseMovement[0], this.maxDistance));
                break;
            case Shape.ARC:
                this.addArc(arcParameters);
                break;
            case Shape.MARK:
                const mark = new Mark(this.mouseMovement[0] ? this.mouseMovement[0] : {x:event.clientX, y:event.clientY});
                (arcParameters?.start as Place).addMark(mark);
                break;
            case Shape.UNDEFINED:
                this.checkForDeleteMovement();
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

