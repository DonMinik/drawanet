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
        // todo: draw arrow head
        ctx.beginPath();
        ctx.moveTo(this.startCoordinates.x, this.startCoordinates.y);
        ctx.lineTo(this.endCoordinates.x, this.endCoordinates.y);
        ctx.stroke();
        ctx.closePath();
    }
}