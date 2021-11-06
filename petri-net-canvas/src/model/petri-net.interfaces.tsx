import {Place} from "./place";
import {Transition} from "./transition";
import {Arc} from "./arc";

export interface PetriNet {
    places: Place[],
    transitions: Transition[],
    arcs: Arc[]
}

export interface PNElement {
    draw: (ctx: CanvasRenderingContext2D) => void;
}

export interface PNNode extends PNElement {
    isWithin: (coordinates: Coordinates) => boolean,
    closestTouchPoint: (coordinates: Coordinates) => Coordinates
    centerCoordinates: Coordinates;
}


export interface Coordinates {
    x: number,
    y: number
}
