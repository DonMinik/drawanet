import {Place} from "./place";
import {Transition} from "./transition";

export interface PetriNet {
    places: Place[],
    transitions: Transition[],
    arcs: Arc[]
}

export interface PNElement {
    startCoordinates: Coordinates;
    endCoordinates: Coordinates;
    draw: (ctx: CanvasRenderingContext2D) => void;
}


export interface Coordinates {
    x: number,
    y: number
}

export interface Mark {

}

export interface Arc extends Element{
    weight: number;
}