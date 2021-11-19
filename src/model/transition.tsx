import {Coordinates, PNNode} from "./petri-net.interfaces";
import {drawText, isSameCoordinates, isWithinRect, lengthOfLine} from "../utils/draw-utils";
import {ScaleService} from "../services/scale.service";

export class Transition implements PNNode<Transition> {

    text: string;
    readonly index: number;
    private readonly maxCoordinates: Coordinates;
    private readonly startCoordinates: Coordinates;
    private readonly touchPoints: Coordinates[] = [];
    private readonly edgeLength: number;

    constructor(start: Coordinates, max:Coordinates, index: number) {

        this.startCoordinates = start;
        this.edgeLength = max.x > max.y ? Math.abs(start.x - max.x) : Math.abs(start.y - max.y);
        const scale = ScaleService.scale(this.edgeLength / 2)* 2

        this.maxCoordinates = {x: start.x + Math.sign(max.x - start.x) * scale, y: start.y + Math.sign(max.y - start.y) * scale};
        this.touchPoints.push({x: this.startCoordinates.x + (this.maxCoordinates.x - this.startCoordinates.x) / 2, y: this.startCoordinates.y});
        this.touchPoints.push({x: this.startCoordinates.x + (this.maxCoordinates.x - this.startCoordinates.x) / 2, y: this.maxCoordinates.y});
        this.touchPoints.push({x: this.startCoordinates.x, y: this.startCoordinates.y  + (this.maxCoordinates.y - this.startCoordinates.y) / 2});
        this.touchPoints.push({x: this.maxCoordinates.x, y: this.startCoordinates.y  + (this.maxCoordinates.y - this.startCoordinates.y) / 2});
        this.touchPoints.push({x: this.startCoordinates.x, y: this.startCoordinates.y});
        this.touchPoints.push({x: this.startCoordinates.x, y: this.maxCoordinates.y});
        this.touchPoints.push({x: this.maxCoordinates.x, y: this.startCoordinates.y});
        this.touchPoints.push({x: this.maxCoordinates.x, y: this.maxCoordinates.y});
        this.index = index;
    }

    get exportName(): string {
        return this.text?.length > 0 ? this.text : 't' + this.index;
    }

    get centerCoordinates(): Coordinates {
        return {
            x: (this.startCoordinates.x + this.maxCoordinates.x) / 2,
            y: (this.startCoordinates.y + this.maxCoordinates.y) / 2
        };
    }

    draw(ctx: CanvasRenderingContext2D) {
        const x = this.startCoordinates.x;
        const y = this.startCoordinates.y;
        const w = this.maxCoordinates.x - x;
        const h = this.maxCoordinates.y - y;

        ctx.beginPath();
        ctx.rect(x,y,w,h);
        ctx.stroke();
        ctx.closePath();
        drawText(ctx, this.text, {x: this.centerCoordinates.x, y: this.centerCoordinates.y + this.edgeLength / 2 + 20 });
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