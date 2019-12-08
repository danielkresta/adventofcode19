import { wire1, wire2 } from "./input";
import { Tester } from "./../test/test";

interface PathPoint {
    coordinate: CoordinatesXY;
    distance: number;
    wireLength: number;
}

interface CoordinatesXY{
    x: number;
    y: number;
}

interface DirectionDetail {
    axis: "x" | "y";
    operation: (start: number, distance: number) => number;
}

const directions: {[key: string]: DirectionDetail} = {
    "R": {
        axis: "x",
        operation: (start, distance) => start + distance,
    },
    "U": {
        axis: "y",
        operation: (start, distance) => start + distance,
    },
    "L": {
        axis: "x",
        operation: (start, distance) => start - distance,
    },
    "D": {
        axis: "y",
        operation: (start, distance) => start - distance,
    },
}

function getFirstSolution([wire1, wire2]: string[][]): number {
    let wire1Coords = getWireCoords(wire1);
    let wire2Coords = getWireCoords(wire2);

    const compareDistances = (a, b) => a.distance - b.distance;
    wire1Coords = wire1Coords.sort(compareDistances);
    wire2Coords = wire2Coords.sort(compareDistances);

    return findFirstIntersection(wire1Coords, wire2Coords)[0].distance;
}

function getSecondSolution([wire1, wire2]: string[][]): number {
    let wire1Coords = getWireCoords(wire1);
    let wire2Coords = getWireCoords(wire2);

    const compareLengths = (a, b) => a.wireLength - b.wireLength;
    wire1Coords = wire1Coords.sort(compareLengths);
    wire2Coords = wire2Coords.sort(compareLengths);
    
    const [intersectionWire1, intersectionWire2] = findFirstIntersection(wire1Coords, wire2Coords);
    return intersectionWire1.wireLength + intersectionWire2.wireLength;
}

function getWireCoords(wire: string[]): PathPoint[] {
    let wireCoords = [{coordinate: {x: 0, y: 0}, distance: 0, wireLength: 0}] as PathPoint[];
    wire.forEach(direction => {
        const path = getCoords(wireCoords[wireCoords.length-1], direction);
        wireCoords = [...wireCoords, ...path];
    });
    return wireCoords;
}

function getCoords(start: PathPoint, code: string): PathPoint[] {
    const [orig, direction, count] = parseDirectionCode(code);
    const path = [] as PathPoint[];
    const {axis: coordinate, operation} = directions[direction];
    for (let i = 0; i < +count; i++) {
        path[i] = {} as PathPoint;
        path[i].coordinate = coordinate === "x"
            ? {
                x: operation(start.coordinate.x, i+1),
                y: start.coordinate.y,
            }
            : {
                x: start.coordinate.x,
                y: operation(start.coordinate.y, i+1),
            };
        getManhDistanceFromStart(path[i]);
        path[i].wireLength = start.wireLength + i+1;
    }
    return path;
}

function parseDirectionCode(code: string) {
    const parser = new RegExp(/([A-Z])(\d+)/);
    return parser.exec(code);
}

function getManhDistanceFromStart(point: PathPoint): void {
    point.distance = getManhDistance({x: 0, y: 0}, {x: point.coordinate.x, y: point.coordinate.y});
}

function getManhDistance(a: CoordinatesXY, b: CoordinatesXY): number {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y); 
}

function findFirstIntersection(wire1Coords: PathPoint[], wire2Coords: PathPoint[]): PathPoint[] {
    for (let i = 1; i < wire1Coords.length; i++) {
        for (let j = 1; j < wire2Coords.length; j++) {
            const wire1 = wire1Coords[i];
            const wire2 = wire2Coords[j];
            if (
                wire1.distance === wire2.distance
                && wire1.coordinate.x === wire2.coordinate.x
                && wire1.coordinate.y === wire2.coordinate.y
            ) {
                return [wire1, wire2];
            }
        }
    }
    return [{},{}] as PathPoint[];
}


const tester1 = new Tester<string[][], number>(getFirstSolution)
tester1.test([
    {input: [
        ["R8", "U5", "L5", "D3"],
        ["U7", "R6", "D4", "L4"],
    ], expected: 6},
    {input: [
        ["R75", "D30", "R83", "U83", "L12", "D49", "R71", "U7", "L72"],
        ["U62", "R66", "U55", "R34", "D71", "R55", "D58", "R83"],
    ], expected: 159},
    {input: [
        ["R98", "U47", "R26", "D63", "R33", "U87", "L62", "D20", "R33", "U53", "R51"],
        ["U98", "R91", "D20", "R16", "D67", "R40", "U7", "R15", "U6", "R7"],
    ], expected: 135},
]);

console.time('getFirstSolution');
console.log( "Day 3, part 1 solution: " + getFirstSolution([wire1, wire2]));
console.timeEnd('getFirstSolution');

const tester2 = new Tester<string[][], number>(getSecondSolution)
tester2.test([
    {input: [
        ["R8", "U5", "L5", "D3"],
        ["U7", "R6", "D4", "L4"],
    ], expected: 30},
    {input: [
        ["R75", "D30", "R83", "U83", "L12", "D49", "R71", "U7", "L72"],
        ["U62", "R66", "U55", "R34", "D71", "R55", "D58", "R83"],
    ], expected: 610},
    {input: [
        ["R98", "U47", "R26", "D63", "R33", "U87", "L62", "D20", "R33", "U53", "R51"],
        ["U98", "R91", "D20", "R16", "D67", "R40", "U7", "R15", "U6", "R7"],
    ], expected: 410},
]);

console.time('getSecondSolution');
console.log( "Day 3, part 2 solution: " + getSecondSolution([wire1, wire2]));
console.timeEnd('getSecondSolution');
