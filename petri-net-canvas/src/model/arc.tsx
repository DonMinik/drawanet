import {Coordinates, PNElement, PNNode} from "./petri-net.interfaces";
import {getAngle} from "../utils/draw-utils";

export class Arc implements PNElement {
    path: Coordinates[];
    weight = 1;

    constructor(private start:PNNode, private end: PNNode, path: Coordinates[]) {
        this.path = this.reducePath(path);

    }

    private reducePath(path: Coordinates[]): Coordinates[] {
        const start = path[0];
        const end = path[path.length -1];
        let previous = {
            coordinates: start,
            angle : Math.cos(getAngle(start, end)),
        };
        const reducedPath = [start];
        path.forEach(current => {

            const angle = getAngle(current, previous.coordinates);
            const deltaAngle = angle - previous.angle
            console.log('angle', angle)
            console.log('sin' , Math.sin(angle));
            console.log('cos' , Math.cos(angle));
            console.log('sin / cos ' , Math.sin(angle) / Math.cos(angle));
            console.log('delta', deltaAngle)
            console.log('skalar gedöns, ', (current.x * previous.coordinates.x + current.y * previous.coordinates.y )/
                (Math.abs(Math.sqrt(Math.pow(current.x, 2) + Math.pow(current.y, 2))) * Math.abs(Math.sqrt(Math.pow(previous.coordinates.x, 2) + Math.pow(previous.coordinates.y, 2))) ))
             if (Math.abs(deltaAngle) > 1 ) {
                reducedPath.push(current);
                previous = {
                    coordinates: current,
                    angle: angle,
                }
            }
        });
        reducedPath[0] = this.start.closestTouchPoint(start);
        const last = reducedPath[reducedPath.length - 1];
        if  (reducedPath.length > 1 ) {
            reducedPath[reducedPath.length - 1] = this.end.closestTouchPoint(last);
        } else {
            reducedPath.push(this.end.closestTouchPoint(last));
        }
        console.log('reduced path: ', reducedPath)
        return reducedPath;
    }

    draw(ctx: CanvasRenderingContext2D) {
        const startCoordinates = this.path[0];
        const endCoordinates = this.path[this.path.length -1];

        ctx.beginPath();
        const angle = Math.atan2( endCoordinates.y - startCoordinates.y, endCoordinates.x - startCoordinates.x);
        ctx.moveTo(startCoordinates.x, startCoordinates.y);
        this.path.forEach(point =>  ctx.lineTo(point.x, point.y));

        ctx.lineTo(endCoordinates.x - 10 * Math.cos(angle - Math.PI / 6), endCoordinates.y - 10 * Math.sin(angle - Math.PI / 6));
        ctx.moveTo(endCoordinates.x, endCoordinates.y);
        ctx.lineTo(endCoordinates.x - 10 * Math.cos(angle + Math.PI / 6), endCoordinates.y - 10 * Math.sin(angle + Math.PI / 6));
        ctx.stroke();
        ctx.closePath();
    }
}