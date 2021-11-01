import {Coordinates} from "./petri-net.interfaces";

export class Place {

    endCoordinates: Coordinates;
    startCoordinates: Coordinates;

    constructor(start: Coordinates, end:Coordinates) {
        this.startCoordinates = start;
        this.endCoordinates = end;
    }

    draw(ctx: CanvasRenderingContext2D) {
        const x = this.startCoordinates.x - ctx.canvas.offsetLeft;
        const y = this.startCoordinates.y - ctx.canvas.offsetTop;
        const w = this.endCoordinates.x - ctx.canvas.offsetLeft - x;
        const h = this.endCoordinates.y - ctx.canvas.offsetTop - y
        console.log('Rect: ', x, y, w, h)
        ctx.strokeRect(x,y,w,h)
    }
}