import {Coordinates, PNNode} from "./petri-net.interfaces";
import {drawText, isSameCoordinates, isWithinRect, lengthOfLine} from "../utils/draw-utils";

export class Transition implements PNNode<Transition> {

    text: string;
    private readonly maxCoordinates: Coordinates;
    private readonly startCoordinates: Coordinates;
    private readonly touchPoints: Coordinates[] = [];

    constructor(start: Coordinates, max:Coordinates) {
        this.startCoordinates = start;
        this.maxCoordinates = max;
        this.touchPoints.push({x: this.startCoordinates.x + (this.maxCoordinates.x - this.startCoordinates.x) / 2, y: this.startCoordinates.y});
        this.touchPoints.push({x: this.startCoordinates.x + (this.maxCoordinates.x - this.startCoordinates.x) / 2, y: this.maxCoordinates.y});
        this.touchPoints.push({x: this.startCoordinates.x, y: this.startCoordinates.y  + (this.maxCoordinates.y - this.startCoordinates.y) / 2});
        this.touchPoints.push({x: this.maxCoordinates.x, y: this.startCoordinates.y  + (this.maxCoordinates.y - this.startCoordinates.y) / 2});
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
        drawText(ctx, this.text, this.centerCoordinates);
    }

    isWithin(coordinates: Coordinates): boolean {
        return isWithinRect(coordinates, this.startCoordinates, this.maxCoordinates);
    }

    closestTouchPoint(coordinates: Coordinates): Coordinates {
        return this.touchPoints.reduce((prev, current) =>
            (lengthOfLine(current,coordinates) < lengthOfLine(prev, coordinates)) ?
                current : prev);
    }

    equals(transition: Transition): boolean {
        return isSameCoordinates(transition.startCoordinates, this.startCoordinates) && isSameCoordinates(transition.maxCoordinates, this.maxCoordinates);
    }
}