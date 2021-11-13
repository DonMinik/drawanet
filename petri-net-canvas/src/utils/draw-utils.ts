import {Coordinates, Line} from "../model/petri-net.interfaces";

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
export function isWithinCircle(coordinatesToCheck: Coordinates, center: Coordinates, radius: number){
    if (!coordinatesToCheck || !center || !radius) {
        return false;
    }
    return Math.sqrt((coordinatesToCheck.x-center.x)*(coordinatesToCheck.x-center.x) + (coordinatesToCheck.y-center.y)*(coordinatesToCheck.y-center.y)) < radius;

}

export function getAngle(a: Coordinates, b: Coordinates){
    return Math.atan2(b.y - a.y, b.x - a.x);
}
export function lengthOfLine(a:Coordinates, b: Coordinates){
    return Math.sqrt(  Math.pow(b.x - a.x, 2) + Math.pow( b.y - a.y, 2) );
}
export function middleOfLine(a:Coordinates, b: Coordinates): Coordinates {
    return {x: a.x + (b.x -a.x) / 2, y:a.y + (b.y -a.y) / 2 }
}
export function isSameCoordinates(a: Coordinates, b:Coordinates): boolean {
    return a && b && a.x === b.x && a.y === b.y;
}

/**
 * inspired by https://riptutorial.com/html5-canvas/example/17708/are-2-line-segments-intercepting-
 * @param a
 * @param b
 */
export function isLinesCrossing(a: Line, b: Line) {
    let cross: number;

    const vectorA = {x : a.end.x - a.start.x, y:   a.end.y - a.start.y }; // line p0, p1 as vector
    const vectorB = {x: b.end.x - b.start.x, y: b.end.y - b.start.y };
    if((cross = vectorA.x * vectorB.y - vectorA.y * vectorB.x) === 0){  // cross prod 0 if lines parallel
        return false; // no intercept
    }
    const vectorAStartToBEnd = {x : a.start.x - b.end.x, y : a.start.y - b.end.y};  // the line from p0 to p2 as vector
    const distanceToAEndToBStart = (vectorA.x * vectorAStartToBEnd.y - vectorA.y * vectorAStartToBEnd.x) / cross; // get unit distance along line p2 p3
    // code point B
    if (distanceToAEndToBStart >= 0 && distanceToAEndToBStart <= 1){                   // is intercept on line p2, p3
        const distanceToA = (vectorB.x * vectorAStartToBEnd.y - vectorB.y * vectorAStartToBEnd.x) / cross; // get unit distance on line p0, p1;
        // code point A
        return (distanceToA >= 0 && distanceToA <= 1);           // return true if on line else false.
        // code point A end
    }
    return false; // no intercept;
    // code point B end
}