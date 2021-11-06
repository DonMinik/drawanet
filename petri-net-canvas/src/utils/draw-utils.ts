import {Coordinates} from "../model/petri-net.interfaces";

export function isWithinRect(coordinatesToCheck: Coordinates, rectCornerA: Coordinates, rectCornerB: Coordinates): boolean {
    if(!coordinatesToCheck || !rectCornerA || !rectCornerB) {
        return false;
    }
    const smallestX = rectCornerA.x < rectCornerB.x ? rectCornerA.x : rectCornerB.x;
    const highestX = rectCornerA.x > rectCornerB.x ? rectCornerA.x : rectCornerB.x;

    const smallestY = rectCornerA.y < rectCornerB.y ? rectCornerA.y : rectCornerB.y;
    const highestY = rectCornerA.y > rectCornerB.y ? rectCornerA.y : rectCornerB.y;

    return coordinatesToCheck.x > smallestX &&
        coordinatesToCheck.x < highestX &&
        coordinatesToCheck.y > smallestY &&
        coordinatesToCheck.y < highestY;
}

export function getAngle(a: Coordinates, b: Coordinates){
    return Math.atan2(b.y - a.y, b.x - a.x);
}
export function lengthOfLine(a:Coordinates, b: Coordinates){
    return Math.sqrt(  Math.pow(b.x - a.x, 2) + Math.pow( b.y - a.y, 2) );
}