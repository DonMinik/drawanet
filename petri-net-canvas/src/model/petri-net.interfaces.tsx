import {Place} from "./place";
import {Transition} from "./transition";
import {Arc} from "./arc";

export interface PetriNet {
    places: Place[],
    transitions: Transition[],
    arcs: Arc[]
}

export interface PNElement<T> {
    draw: (ctx: CanvasRenderingContext2D) => void;
    equals: (e: T) => boolean;
}

export interface PNNode<T> extends PNElement<T> {
    isWithin: (coordinates: Coordinates) => boolean,
    closestTouchPoint: (coordinates: Coordinates) => Coordinates
    centerCoordinates: Coordinates;
}


export interface Coordinates {
    x: number,
    y: number
}
