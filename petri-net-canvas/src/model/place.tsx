import {Coordinates, PNNode} from "./petri-net.interfaces";
import {Mark} from "./mark";
import {drawText, isSameCoordinates, isWithinCircle, lengthOfLine} from "../utils/draw-utils";

export class Place implements PNNode<Place>{

    text: string;
    marks: Mark[] = [];
    readonly index: number;
    readonly centerCoordinates: Coordinates;
    private readonly radius: number;
    private readonly touchPoints: Coordinates[] = [];

    constructor(center: Coordinates, radius: number, index: number) {
        this.centerCoordinates = center;
        this.radius = radius;
        this.touchPoints.push({x: center.x + radius, y: center.y}); // right
        this.touchPoints.push({x: center.x - radius, y: center.y}); // left
        this.touchPoints.push({x: center.x, y: center.y + radius}); // bottom
        this.touchPoints.push({x: center.x, y: center.y - radius}); // top
        this.index = index;
    }

    get exportName(): string {
        return this.text?.length > 0 ? this.text : 'p' + this.index;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.centerCoordinates.x, this.centerCoordinates.y, this.radius, 0, 2 * Math.PI, false);
        ctx.stroke();
        drawText(ctx, this.text, this.centerCoordinates);
        ctx.closePath();
        this.drawMarks(ctx);

    }



    isWithin(coordinates: Coordinates): boolean {
        return isWithinCircle(coordinates, this.centerCoordinates, this.radius);
    }

    closestTouchPoint(coordinates: Coordinates): Coordinates {
        return this.touchPoints.reduce((prev, current) =>
            (lengthOfLine(current,coordinates) < lengthOfLine(prev, coordinates)) ?
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