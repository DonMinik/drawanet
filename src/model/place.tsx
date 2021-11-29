import {Coordinates, PNNode} from "./petri-net.interfaces";
import {Mark} from "./mark";
import {drawText, isSameCoordinates, isWithinCircle, lengthOfLine} from "../utils/draw-utils";
import {ScaleService} from "../services/scale.service";

export class Place implements PNNode<Place>{

    text: string;
    marks: Mark[] = [];
    readonly index: number;
    readonly centerCoordinates: Coordinates;
    private readonly radius: number;
    private readonly touchPoints: Coordinates[] = [];

    constructor(center: Coordinates, radius: number, index: number) {
        this.centerCoordinates = center;
        this.radius = ScaleService.scale(radius);
        this.touchPoints.push({x: center.x + this.radius, y: center.y}); // right
        this.touchPoints.push({x: center.x - this.radius, y: center.y}); // left
        this.touchPoints.push({x: center.x, y: center.y + this.radius}); // bottom
        this.touchPoints.push({x: center.x, y: center.y - this.radius}); // top
        this.touchPoints.push({x: center.x + this.radius * Math.sqrt(0.5), y: center.y + this.radius * Math.sqrt(0.5)}); //bottom right
        this.touchPoints.push({x: center.x - this.radius * Math.sqrt(0.5), y: center.y + this.radius * Math.sqrt(0.5)}); //bottom left
        this.touchPoints.push({x: center.x + this.radius * Math.sqrt(0.5), y: center.y - this.radius * Math.sqrt(0.5)}); //top right
        this.touchPoints.push({x: center.x - this.radius * Math.sqrt(0.5), y: center.y - this.radius * Math.sqrt(0.5)}); //bottom left
        this.index = index;
    }

    get exportName(): string {
        return this.text?.length > 0 ? this.text : 'p' + this.index;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.centerCoordinates.x, this.centerCoordinates.y, this.radius, 0, 2 * Math.PI, false);
        ctx.stroke();
        drawText(ctx, this.text, {x: this.centerCoordinates.x, y: this.centerCoordinates.y + this.radius + 20});
        ctx.closePath();
        this.drawMarks(ctx);
    }

    isWithin(coordinates: Coordinates): boolean {
        return isWithinCircle(coordinates, this.centerCoordinates, this.radius);
    }

    closestTouchPoint(outside: Coordinates, inside?:Coordinates ): Coordinates {
        return this.touchPoints.reduce((prev, current) =>
            (lengthOfLine(current, outside) + lengthOfLine(current, inside) < lengthOfLine(prev, outside) + lengthOfLine(prev, inside)) ?
                current : prev);
    }

    equals(place: Place): boolean {
        return place.radius === this.radius && isSameCoordinates(place.centerCoordinates, this.centerCoordinates);
    }

    addMark (mark: Mark) {
        const alreadyExistingMark = this.marks.find(m => m.isWithin(mark.position));
        if(alreadyExistingMark) {
            this.marks = this.marks.filter(m => m !== alreadyExistingMark);
        } else {
            this.marks.push(mark);
        }
    }

    private drawMarks(ctx: CanvasRenderingContext2D) {
        this.marks.forEach(mark => mark.draw(ctx));
    }
}