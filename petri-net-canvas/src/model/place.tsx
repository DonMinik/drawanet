import {Coordinates, PNNode} from "./petri-net.interfaces";
import {Mark} from "./mark";
import {isSameCoordinates, lengthOfLine} from "../utils/draw-utils";

export class Place implements PNNode<Place>{

    centerCoordinates: Coordinates;
    radius: number;
    marks: Mark[] = [];
    touchpoints: Coordinates[] = [];

    constructor(center: Coordinates, radius: number) {
        this.centerCoordinates = center;
        this.radius = radius;
        this.touchpoints.push({x: center.x + radius, y: center.y});
        this.touchpoints.push({x: center.x - radius, y: center.y});
        this.touchpoints.push({x: center.x, y: center.y + radius});
        this.touchpoints.push({x: center.x, y: center.y - radius});

    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.centerCoordinates.x, this.centerCoordinates.y, this.radius, 0, 2 * Math.PI, false);
     //   ctx.fill();
        ctx.stroke();
        ctx.closePath();
        this.drawMarks(ctx);
    }

    isWithin(coordinates: Coordinates): boolean {
        if (!coordinates) {
            return false;
        }
        return Math.sqrt((coordinates.x-this.centerCoordinates.x)*(coordinates.x-this.centerCoordinates.x) + (coordinates.y-this.centerCoordinates.y)*(coordinates.y-this.centerCoordinates.y)) < this.radius;
    }

    closestTouchPoint(coordinates: Coordinates): Coordinates {
        return this.touchpoints.reduce((prev, current) =>
            (lengthOfLine(current,coordinates) < lengthOfLine(prev, coordinates)) ?
                current : prev);
    }

    equals(place: Place): boolean {
        return place.radius === this.radius && isSameCoordinates(place.centerCoordinates, this.centerCoordinates);
    }

    addMark (mark: Mark) {
        this.marks.push(mark);
    }

    private drawMarks(ctx: CanvasRenderingContext2D) {
        this.marks.forEach(mark => mark.draw(ctx));
    }
}