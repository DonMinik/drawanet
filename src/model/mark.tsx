import {Coordinates, PNElement} from "./petri-net.interfaces";
import {isSameCoordinates, isWithinCircle} from "../utils/draw-utils";

export class Mark implements PNElement<Mark> {
    position: Coordinates;
    private readonly RADIUS = 5;
    constructor(position:Coordinates) {
        this.position = position;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.RADIUS, 0, 2 * Math.PI, false);
        ctx.fillStyle = '#111';
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        ctx.fillStyle = '#FFF'
    }

    equals(mark: Mark): boolean {
        return isSameCoordinates(mark.position, this.position);
    }

    isWithin(coordinates: Coordinates): boolean {
      return isWithinCircle(coordinates, this.position, this.RADIUS);
    }
}