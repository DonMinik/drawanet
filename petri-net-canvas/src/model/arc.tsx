import {Coordinates, PNElement, PNNode} from "./petri-net.interfaces";
import { lengthOfLine} from "../utils/draw-utils";

export class Arc implements PNElement {
    weight = 1;
    wayPoint: {
        coordinates: Coordinates | null,
        multiplier: number
    } = {
        coordinates: null,
        multiplier: 0
    };

    constructor(private start:PNNode, private end: PNNode, private path: Coordinates[]) {
        this.findWayPoint()
    }

    private findWayPoint() {

        const start = this.path[0];
        const end = this.path[this.path.length -1];

        const startToEndLength = lengthOfLine(start, end);

      //  const gradient = (end.x - start.x) !== 0 ? (end.y - start.y) / (end.x - start.x): 0;
        this.path.forEach(current => {
          //  const currentGradient = (end.x - start.x) !== 0 ? (end.y - start.y) / (end.x - start.x): 0;
            // check for max X
          const startToCurrent = lengthOfLine(start, current);
          const endToCurrent = lengthOfLine(end, current);
          const relativeDistance = (startToCurrent + endToCurrent) / startToEndLength;
          console.log('relative Distance', relativeDistance , ' based on  ', startToEndLength, startToCurrent, endToCurrent)
          if(relativeDistance > 1.10 && relativeDistance > this.wayPoint.multiplier) {
            this.wayPoint = {
                coordinates: current,
                multiplier: relativeDistance
            };
          }
        })






/*

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
        return reducedPath; */
    }

    draw(ctx: CanvasRenderingContext2D) {

        const startCoordinates = this.start.closestTouchPoint(this.path[this.path.length -1]);
        const endCoordinates = this.end.closestTouchPoint(startCoordinates);

        ctx.beginPath();
        const angle = Math.atan2( endCoordinates.y - startCoordinates.y, endCoordinates.x - startCoordinates.x);
        ctx.moveTo(startCoordinates.x, startCoordinates.y);
       // this.path.forEach(point =>  ctx.lineTo(point.x, point.y));
        if(this.wayPoint.coordinates) {
            ctx.quadraticCurveTo(this.wayPoint.coordinates.x * this.wayPoint.multiplier, this.wayPoint.coordinates.y * this.wayPoint.multiplier, endCoordinates.x, endCoordinates.y)
        } else {
            ctx.lineTo(endCoordinates.x, endCoordinates.y)
        }
        ctx.lineTo(endCoordinates.x - 10 * Math.cos(angle - Math.PI / 6), endCoordinates.y - 10 * Math.sin(angle - Math.PI / 6));
        ctx.moveTo(endCoordinates.x, endCoordinates.y);
        ctx.lineTo(endCoordinates.x - 10 * Math.cos(angle + Math.PI / 6), endCoordinates.y - 10 * Math.sin(angle + Math.PI / 6));
        ctx.stroke();
        ctx.closePath();
    }
}