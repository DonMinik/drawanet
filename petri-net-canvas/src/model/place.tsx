import {Coordinates, Mark, PNNode} from "./petri-net.interfaces";

export class Place implements PNNode{

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
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }

    isWithin(coordinates: Coordinates): boolean {
        if (!coordinates) {
            return false;
        }
        return Math.abs(coordinates.x - this.centerCoordinates.x) <= this.radius && Math.abs(coordinates.x - this.centerCoordinates.x) <= this.radius;
    }

    closestTouchPoint(coordinates: Coordinates): Coordinates {
        return this.touchpoints.reduce((prev, current) => (Math.abs(prev.x - coordinates.x) + Math.abs(prev.x - coordinates.x) > Math.abs(current.x - coordinates.x) + Math.abs(current.x - coordinates.x)) ? current : prev);
    }
}