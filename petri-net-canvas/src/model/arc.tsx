import {Coordinates, PNElement} from "./petri-net.interfaces";

export class Arc implements PNElement {
    endCoordinates: Coordinates;
    startCoordinates: Coordinates;
    curveCoordinates: Coordinates | null;
    weight = 1;
    orientation: number;

    constructor(start: Coordinates, end:Coordinates, curve?:Coordinates | null) {
        this.startCoordinates = start;
        this.endCoordinates = end;
        this.curveCoordinates = curve ? curve : null;
        if ((end.x - start.x) != 0) {
            this.orientation = (end.y - start.y) / (end.x - start.x)
        } else {
            this.orientation = 0;
        }
    }

    draw(ctx: CanvasRenderingContext2D) {

        ctx.beginPath();
        const angle = Math.atan2( this.endCoordinates.y - this.startCoordinates.y, this.endCoordinates.x - this.startCoordinates.x);
        ctx.moveTo(this.startCoordinates.x, this.startCoordinates.y);
        if(this.curveCoordinates) {
            ctx.quadraticCurveTo(this.curveCoordinates.x, this.curveCoordinates.y, this.endCoordinates.x, this.endCoordinates.y);
        } else {
            ctx.lineTo(this.endCoordinates.x, this.endCoordinates.y);
        }
        ctx.lineTo(this.endCoordinates.x - 10 * Math.cos(angle - Math.PI / 6), this.endCoordinates.y - 10 * Math.sin(angle - Math.PI / 6));
        ctx.moveTo(this.endCoordinates.x, this.endCoordinates.y);
        ctx.lineTo(this.endCoordinates.x - 10 * Math.cos(angle + Math.PI / 6), this.endCoordinates.y - 10 * Math.sin(angle + Math.PI / 6));
        ctx.stroke();
        ctx.closePath();
    }
}