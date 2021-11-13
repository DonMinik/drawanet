import {Coordinates, PNNode} from "./petri-net.interfaces";
import {isSameCoordinates, isWithinRect, lengthOfLine} from "../utils/draw-utils";

export class Transition implements PNNode<Transition> {

    text: string;
    maxCoordinates: Coordinates;
    startCoordinates: Coordinates;
    touchpoints: Coordinates[] = [];

    constructor(start: Coordinates, max:Coordinates) {
        this.startCoordinates = start;
        this.maxCoordinates = max;
        this.touchpoints.push({x: this.startCoordinates.x + (this.maxCoordinates.x - this.startCoordinates.x) / 2, y: this.startCoordinates.y});
        this.touchpoints.push({x: this.startCoordinates.x + (this.maxCoordinates.x - this.startCoordinates.x) / 2, y: this.maxCoordinates.y});
        this.touchpoints.push({x: this.startCoordinates.x, y: this.startCoordinates.y  + (this.maxCoordinates.y - this.startCoordinates.y) / 2});
        this.touchpoints.push({x: this.maxCoordinates.x, y: this.startCoordinates.y  + (this.maxCoordinates.y - this.startCoordinates.y) / 2});
    }

    get centerCoordinates(): Coordinates {
        return {
            x: (this.startCoordinates.x + this.maxCoordinates.x) / 2,
            y: (this.startCoordinates.y + this.maxCoordinates.y) / 2
        };
    }

    draw(ctx: CanvasRenderingContext2D) {
        const x = this.startCoordinates.x - ctx.canvas.offsetLeft;
        const y = this.startCoordinates.y - ctx.canvas.offsetTop;
        const w = this.maxCoordinates.x - x;
        const h = this.maxCoordinates.y - y;

        ctx.beginPath();
        ctx.rect(x,y,w,h);
        ctx.stroke();
        ctx.closePath();
    }

    isWithin(coordinates: Coordinates): boolean {
        return isWithinRect(coordinates, this.startCoordinates, this.maxCoordinates);
    }

    closestTouchPoint(coordinates: Coordinates): Coordinates {
        return this.touchpoints.reduce((prev, current) =>
            (lengthOfLine(current,coordinates) < lengthOfLine(prev, coordinates)) ?
                current : prev);
    }

    equals(transition: Transition): boolean {
        return isSameCoordinates(transition.startCoordinates, this.startCoordinates) && isSameCoordinates(transition.maxCoordinates, this.maxCoordinates);
    }
}