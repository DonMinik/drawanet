import {Coordinates} from "../model/petri-net.interfaces";

export function isWithinRect(coordinatesToCheck: Coordinates, rectCornerA: Coordinates, rectCornerB: Coordinates): boolean {
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
    let xs = 0;
    let ys = 0;

    xs = b.x - a.x;
    xs = xs * xs;

    ys = b.y - a.y;
    ys = ys * ys;

    return Math.sqrt( xs + ys );
}