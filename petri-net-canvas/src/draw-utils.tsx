import {Coordinates} from "./model/petri-net.interfaces";

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