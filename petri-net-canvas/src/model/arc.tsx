import {Coordinates, PNElement, PNNode} from "./petri-net.interfaces";
import {isLinesCrossing, lengthOfLine, middleOfLine} from "../utils/draw-utils";
export class Arc implements PNElement<Arc> {
    path: Coordinates[];
    weight = 1;
    startCoordinates: Coordinates;
    endCoordinates: Coordinates;


    constructor(public start:PNNode<any>, public end: PNNode<any>, path: Coordinates[]) {
        this.path = Arc.reducePath(path);
        this.startCoordinates = this.start.closestTouchPoint(this.path[0] ? this.path[0] : this.end.centerCoordinates);
        this.endCoordinates = this.end.closestTouchPoint(this.path[this.path.length -1] ? this.path[this.path.length -1]: this.start.centerCoordinates);
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


        ctx.beginPath();

        ctx.moveTo(this.startCoordinates.x, this.startCoordinates.y);
        this.path.forEach(point =>  ctx.lineTo(point.x, point.y));
        if(this.weight > 1) {
            const middleOfPath = this.path[Math.floor(this.path.length / 2)];
            const weightTextPosition = middleOfPath ? middleOfPath : middleOfLine(this.startCoordinates, this.endCoordinates);
            ctx.strokeText(String(this.weight), weightTextPosition.x, weightTextPosition.y);
        }
        ctx.lineTo(this.endCoordinates.x, this.endCoordinates.y)
        const angle = Math.atan2( this.endCoordinates.y - last.y, this.endCoordinates.x - last.x);
        ctx.lineTo(this.endCoordinates.x - 10 * Math.cos(angle - Math.PI / 6), this.endCoordinates.y - 10 * Math.sin(angle - Math.PI / 6));
        ctx.moveTo(this.endCoordinates.x, this.endCoordinates.y);
        ctx.lineTo(this.endCoordinates.x - 10 * Math.cos(angle + Math.PI / 6), this.endCoordinates.y - 10 * Math.sin(angle + Math.PI / 6));
        ctx.stroke();
        ctx.closePath();
    }

    equals(arc: Arc): boolean {
        return arc.start.equals(this.start) && arc.end.equals(this.end);
    }

    isCrossing(crossingPath: Coordinates[]): boolean {
        const completeArc = [this.startCoordinates, ...this.path, this.endCoordinates];
        for (let i = 0; i < completeArc.length; i++) {
            if (i < 1) {
                continue;
            }
            for (let j = 0; j < crossingPath.length; j++) {
                if (j < 1) {
                    continue;
                }
                const isCrossing =  isLinesCrossing({start: completeArc[i], end: completeArc[i - 1]}, {start: crossingPath[j], end: crossingPath[j -1]});
                if (isCrossing) {
                    return true;
                }
            }
        }
        return false;
    }
}