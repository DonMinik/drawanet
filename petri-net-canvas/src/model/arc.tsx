import {Coordinates, PNElement, PNNode} from "./petri-net.interfaces";
import { lengthOfLine} from "../utils/draw-utils";

export class Arc implements PNElement {
    path: Coordinates[];
    weight = 1;


    constructor(private start:PNNode, private end: PNNode, path: Coordinates[]) {
        this.path = Arc.reducePath(path);
    }

    private static reducePath(path: Coordinates[]): Coordinates[] {
        const reducedPath: Coordinates[] = [];

        for(let i = 0; i < path.length; i++ ) {
            if (i < 2) {
                continue;
            }
            if(Arc.isCurve(path[i-2], path[i-1], path[i])){
                reducedPath.push(path[i-1]);
            }
        }
        return reducedPath;
    }

    private static isCurve(start: Coordinates, middle: Coordinates, end: Coordinates): boolean {
        const startToEnd = lengthOfLine(start, end);
        const relativeDistance = (lengthOfLine(start, middle) + lengthOfLine(end, middle)) / startToEnd;
        const deviationFactor = 1 + startToEnd / 100;
        return relativeDistance > deviationFactor;
    }

    draw(ctx: CanvasRenderingContext2D) {
        const last = this.path[this.path.length -1] ? this.path[this.path.length -1]: this.start.centerCoordinates ;
        const startCoordinates = this.start.closestTouchPoint(this.path[0] ? this.path[0] : this.end.centerCoordinates);
        const endCoordinates = this.end.closestTouchPoint(last);

        ctx.beginPath();

        ctx.moveTo(startCoordinates.x, startCoordinates.y);
        this.path.forEach(point =>  ctx.lineTo(point.x, point.y));

        ctx.lineTo(endCoordinates.x, endCoordinates.y)

        const angle = Math.atan2( endCoordinates.y - last.y, endCoordinates.x - last.x);
        ctx.lineTo(endCoordinates.x - 10 * Math.cos(angle - Math.PI / 6), endCoordinates.y - 10 * Math.sin(angle - Math.PI / 6));
        ctx.moveTo(endCoordinates.x, endCoordinates.y);
        ctx.lineTo(endCoordinates.x - 10 * Math.cos(angle + Math.PI / 6), endCoordinates.y - 10 * Math.sin(angle + Math.PI / 6));
        ctx.stroke();
        ctx.closePath();
    }
}