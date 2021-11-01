import {Coordinates, PNElement} from "./petri-net.interfaces";

export class Transition implements PNElement {

    maxCoordinates: Coordinates;
    startCoordinates: Coordinates;

    constructor(start: Coordinates, end:Coordinates) {
        this.startCoordinates = start;
        this.maxCoordinates = end;
    }

    draw(ctx: CanvasRenderingContext2D) {
        const x = this.startCoordinates.x - ctx.canvas.offsetLeft;
        const y = this.startCoordinates.y - ctx.canvas.offsetTop;
        const w = this.maxCoordinates.x - x;
        const h = this.maxCoordinates.y - y;
        console.log('Rect: ', x, y, w, h)
        console.log('from ', this.startCoordinates);
        ctx.beginPath();
        ctx.strokeRect(x,y,w,h);
        ctx.closePath();
    }


}