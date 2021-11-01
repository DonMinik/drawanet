import {Coordinates} from "./petri-net.interfaces";

export class Place {

    endCoordinates: Coordinates;
    startCoordinates: Coordinates;

    constructor(start: Coordinates, end:Coordinates) {
        this.startCoordinates = start;
        this.endCoordinates = end;
    }

    draw(ctx: CanvasRenderingContext2D) {

    }
}