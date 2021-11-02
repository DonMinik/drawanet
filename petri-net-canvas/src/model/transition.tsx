import {Coordinates, PNNode} from "./petri-net.interfaces";
import {create} from "domain";

export class Transition implements PNNode {

    maxCoordinates: Coordinates;
    startCoordinates: Coordinates;
    touchpoints: Coordinates[] = [];

    constructor(start: Coordinates, max:Coordinates) {
        console.log('create', start, max)
        this.startCoordinates = start;
        this.maxCoordinates = max;
        this.touchpoints.push({x: this.startCoordinates.x + (this.maxCoordinates.x - this.startCoordinates.x) / 2, y: this.startCoordinates.y});
        this.touchpoints.push({x: this.startCoordinates.x + (this.maxCoordinates.x - this.startCoordinates.x) / 2, y: this.maxCoordinates.y});
        this.touchpoints.push({x: this.startCoordinates.x, y: this.startCoordinates.y  + (this.maxCoordinates.y - this.startCoordinates.y) / 2});
        this.touchpoints.push({x: this.maxCoordinates.x, y: this.startCoordinates.y  + (this.maxCoordinates.y - this.startCoordinates.y) / 2});
    }

    draw(ctx: CanvasRenderingContext2D) {
        const x = this.startCoordinates.x - ctx.canvas.offsetLeft;
        const y = this.startCoordinates.y - ctx.canvas.offsetTop;
        const w = this.maxCoordinates.x - x;
        const h = this.maxCoordinates.y - y;

        ctx.beginPath();
        ctx.rect(x,y,w,h);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }

    isWithin(coordinates: Coordinates): boolean {

        const smallestX = this.startCoordinates.x < this.maxCoordinates.x ? this.startCoordinates.x : this.maxCoordinates.x;
        const highestX = this.startCoordinates.x > this.maxCoordinates.x ? this.startCoordinates.x : this.maxCoordinates.x;

        const smallestY = this.startCoordinates.y < this.maxCoordinates.y ? this.startCoordinates.y : this.maxCoordinates.y;
        const highestY = this.startCoordinates.y > this.maxCoordinates.y ? this.startCoordinates.y : this.maxCoordinates.y;

        return coordinates.x > smallestX &&
            coordinates.x < highestX &&
            coordinates.y > smallestY &&
            coordinates.y < highestY;
    }

    closestTouchPoint(coordinates: Coordinates): Coordinates {
        return this.touchpoints.reduce((prev, current) => (Math.abs(prev.x - coordinates.x) + Math.abs(prev.x - coordinates.x) > Math.abs(current.x - coordinates.x) + Math.abs(current.x - coordinates.x)) ? current : prev);
    }

}