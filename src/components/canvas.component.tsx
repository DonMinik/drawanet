import React from "react";
import {Coordinates, PetriNet, PNNode} from "../model/petri-net.interfaces";
import {Place} from "../model/place";
import {Transition} from "../model/transition";
import {Arc} from "../model/arc";
import {Mark} from "../model/mark";
import {BaseCanvasComponent} from "./base-canvas.component";
import TextCanvasComponent from "./text-canvas.component";
import {ScaleService} from "../services/scale.service";

enum Shape {
    UNDEFINED,
    PLACE,
    TRANSITION,
    ARC,
    MARK
}

class CanvasComponent extends BaseCanvasComponent<{ petriNet: PetriNet }, {showTextCanvas: boolean, toggle: boolean}> {
    private readonly petriNet: PetriNet;
    private detectedShape = Shape.UNDEFINED;
    private complete = false;
    private textCanvas: any;

    constructor(props: { petriNet: PetriNet }) {
        super(props);
        this.canvasRef = React.createRef();
        this.petriNet = props.petriNet;
        this.state = {
            showTextCanvas: false,
            toggle: false
        }
    }
    componentDidMount() {
        super.componentDidMount();
        this.canvasCtx.canvas.width = this.canvasCtx.canvas.clientWidth;
        this.canvasCtx.canvas.height = 400;
        this.canvasCtx.strokeStyle = '#640064';
        this.canvasCtx.lineWidth = 1;
        this.canvasCtx.fillStyle = '#FFFFFF';
        this.canvasCtx.textAlign = 'center';
        this.canvasCtx.font = '18px Arial';
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

    private resetScale() {
        if (this.petriNet.places.length === 0 && this.petriNet.transitions.length === 0) {
           ScaleService.reset();
        }
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
            this.detectedShape = ( this.mouseMovement.filter(c => c.x - this.mouseMovement[0]?.x < - 12).length > 0 &&
            this.mouseMovement.filter(c => this.mouseMovement[0]?.x - c.x < - 12).length > 0) ||
            (this.mouseMovement.filter(c => c.y - this.mouseMovement[0]?.y < - 12).length > 0 &&
            this.mouseMovement.filter(c => this.mouseMovement[0]?.y - c.y < - 12).length > 0)
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
            this.petriNet.arcs = this.petriNet.arcs.filter(arc => {
                return potentialPlacesToDelete[0] !==  arc.start && potentialPlacesToDelete[0] !== arc.end && potentialTransitionsToDelete[0] !== arc.start && potentialTransitionsToDelete[0] !== arc.end;
            });
        } else if (potentialArcsToDelete.length === 1) {
            if (potentialArcsToDelete[0].weight > 1) {
                potentialArcsToDelete[0].weight --;
            } else {
                this.petriNet.arcs = this.petriNet.arcs.filter(arc => {
                    return arc !== potentialArcsToDelete[0]
                });
            }
        }
    }

    closeTextCanvas() {
        this.setState({showTextCanvas: false});
        this.reset();
        this.paintNet();
    }

    async onDoubleClick(event: React.MouseEvent<HTMLCanvasElement>) {
        const x = event.clientX - this.canvasPositionLeft;
        const y = event.clientY - this.canvasPositionTop;
        let nodeToName: PNNode<any>;
        nodeToName = this.petriNet.transitions.find(transition => transition.isWithin({x: x, y:y}));
        if(!nodeToName) {
            nodeToName = this.petriNet.places.find(place => place.isWithin({x: x, y:y}));
        }
        if(nodeToName) {
            this.textCanvas = <TextCanvasComponent coordinates={{x: x, y: y}} callBack={() => this.closeTextCanvas()} node={nodeToName}/>; //new TextCanvasComponent({coordinates: {x: x, y: y}, callback: this.closeTextCanvas });
            this.setState({showTextCanvas: true});
        }
    }

    onMouseUp(event: React.MouseEvent<HTMLCanvasElement>) {
        super.onMouseUp(event);
        const arcParameters = this.detectArc();
        if(!this.complete) {
            this.detectPlaceOrTransition();
        }

        switch (this.detectedShape) {
            case Shape.PLACE:
                const circleProps = this.circleProperties;
                this.petriNet.places.push(new Place(circleProps.centerCoordinates, circleProps.radius, this.petriNet.places.length));
                break;
            case Shape.TRANSITION:
                this.petriNet.transitions.push(new Transition(this.mouseMovement[0], this.maxDistance, this.petriNet.transitions.length));
                break;
            case Shape.ARC:
                this.addArc(arcParameters);
                break;
            case Shape.MARK:
                const mark = new Mark(this.mouseMovement[0] ? this.mouseMovement[0]
                    : {x:event.clientX - this.canvasPositionLeft, y:event.clientY - this.canvasPositionTop});
                (arcParameters?.start as Place).addMark(mark);
                break;
            case Shape.UNDEFINED:
                this.checkForDeleteMovement();
        }

        this.reset();
        this.paintNet();
        this.resetScale();
    }

    render() {
        return(<div>
            <canvas    ref={this.canvasRef}
               onMouseDown={(e) => this.onMouseDown(e)}
               onMouseUp={(e) => this.onMouseUp(e)}
               onMouseMove={(e) => this.onMouseMove(e)}
               onDoubleClick={e => this.onDoubleClick(e)}
               className='canvas'
            />
            { this.state.showTextCanvas ? this.textCanvas
                : null
            }
        </div>);
    }
}

export default CanvasComponent;

interface CircleProperties {
    centerCoordinates: Coordinates,
    radius: number
}