import {Coordinates, PNElement} from "./petri-net.interfaces";

export class Arc implements PNElement {
    endCoordinates: Coordinates;
    startCoordinates: Coordinates;
    weight = 1;

    constructor(start: Coordinates, end:Coordinates) {
        this.startCoordinates = start;
        this.endCoordinates = end;
    }

    draw(ctx: CanvasRenderingContext2D) {

    }
}