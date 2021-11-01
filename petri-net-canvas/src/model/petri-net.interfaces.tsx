import {Place} from "./place";
import {Transition} from "./transition";
import {Arc} from "./arc";

export interface PetriNet {
    places: Place[],
    transitions: Transition[],
    arcs: Arc[]
}

export interface PNElement {
    startCoordinates: Coordinates;
    draw: (ctx: CanvasRenderingContext2D) => void;
}


export interface Coordinates {
    x: number,
    y: number
}

export interface Mark {

}