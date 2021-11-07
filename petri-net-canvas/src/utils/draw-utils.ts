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
export function middleOfLine(a:Coordinates, b: Coordinates): Coordinates {
    console.log('###',a, b, {x: Math.abs(a.x -b.x), y: Math.abs(a.y -b.y) })
    return {x: a.x + (b.x -a.x) / 2, y:a.y + (b.y -a.y) / 2 }
}
export function isSameCoordinates(a: Coordinates, b:Coordinates): boolean {
    return a && b && a.x === b.x && a.y === b.y;
}
