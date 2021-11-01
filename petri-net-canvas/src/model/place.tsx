import {Coordinates, Mark} from "./petri-net.interfaces";

export class Place {

    endCoordinates: Coordinates;
    startCoordinates: Coordinates;
    marks: Mark[] = [];

    constructor(start: Coordinates, end:Coordinates) {
        this.startCoordinates = start;
        this.endCoordinates = end;
    }

    draw(ctx: CanvasRenderingContext2D) {
        const x = this.startCoordinates.x - ctx.canvas.offsetLeft;
        const y = this.startCoordinates.y - ctx.canvas.offsetTop;
        const w = this.endCoordinates.x - ctx.canvas.offsetLeft - x;
        const h = this.endCoordinates.y - ctx.canvas.offsetTop - y
        const centerX = x + (w - x) / 2;
        const centerY = y + (h -y) / 2;
        const radius = Math.abs((w-x > h-y ? w -x : h -y) / 2);
        console.log('Circle: ', centerX, centerY, radius, 0, 2 * Math.PI, )
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        ctx.stroke();
        ctx.closePath();
    }
}