import {Coordinates, Mark} from "./petri-net.interfaces";

export class Place {

    centerCoordinates: Coordinates;
    radius: number;
    marks: Mark[] = [];

    constructor(center: Coordinates, radius: number) {
        this.centerCoordinates = center;
        this.radius = radius;
    }

    draw(ctx: CanvasRenderingContext2D) {


        ctx.beginPath();
        ctx.arc(this.centerCoordinates.x, this.centerCoordinates.y, this.radius, 0, 2 * Math.PI, false);
        ctx.stroke();
        ctx.closePath();
    }
}