import { input } from "./input";
import { testConfig } from "./tests";
import { Tester } from "../test/test";

export interface Asteroid extends Position {
    lineOfSight?: number;
    order?: number;
    angle?: number;
}

interface Position {
    x: number,
    y: number;
}

const tester = new Tester<string, Asteroid>(getFirstSolution);
tester.test(testConfig);
// const vaporized = getSecondSolution(testConfig[4].input);
// console.log("1st vaporized: " + JSON.stringify(vaporized[0]));
// console.log("2nd vaporized: " + JSON.stringify(vaporized[1]));
// console.log("3rd vaporized: " + JSON.stringify(vaporized[2]));
// console.log("10th vaporized: " + JSON.stringify(vaporized[9]));
// console.log("20th vaporized: " + JSON.stringify(vaporized[19]));
// console.log("50th vaporized: " + JSON.stringify(vaporized[49]));
// console.log("100th vaporized: " + JSON.stringify(vaporized[99]));
// console.log("199th vaporized: " + JSON.stringify(vaporized[198]));
// console.log("200th vaporized: " + JSON.stringify(vaporized[199]));
// console.log("201st vaporized: " + JSON.stringify(vaporized[200]));
// console.log("299th vaporized: " + JSON.stringify(vaporized[298]));

const station = getFirstSolution(input);
console.log( "Day 10, part 1 solution: " + JSON.stringify(station));
const vaporized = getSecondSolution(input);
console.log( "Day 10, part 2 solution: " + (vaporized[199].x*100 + vaporized[199].y));



export function getFirstSolution(input: string): Asteroid {
    const fieldMap = createFieldMap(input);
    const asteroids = findAsteroids(fieldMap);

    const max = asteroids.reduce((max, asteroid) => {
        const los = calculateLos(fieldMap, asteroids, {x: asteroid.x, y: asteroid.y});
        asteroid.lineOfSight = los;
        return max.lineOfSight > los ? max : asteroid;
    }, {} as Asteroid);
    return max;
}

function getSecondSolution(input: string): Asteroid[] {
    const fieldMap = createFieldMap(input);
    const asteroids = findAsteroids(fieldMap);

    const station = getFirstSolution(input);

    // Remove the station asteroid
    const stationIndex = asteroids.findIndex(a => a.x === station.x && a.y === station.y);
    asteroids.splice(stationIndex,1);

    asteroids.forEach(asteroid => checkForObstacles(station, asteroid, fieldMap, true));
    return asteroids.sort((a, b) => {
        const diff = a.order - b.order;
        return diff !== 0 ? diff : b.angle - a.angle;
    });
}

function findAsteroids(fieldMap: string[][]): Asteroid[] {
    const asteroids: Asteroid[] = [];
    for (let y = 0; y < fieldMap.length; y++) {
        for (let x = 0; x < fieldMap[0].length; x++) {
            if (fieldMap[y][x] === "#") {
                asteroids.push({x, y});
            }
        }
    }
    return asteroids;
}

function createFieldMap(input: string): string[][] {
    const rows = input.split("\n");
    return rows
        .filter(row => row.length > 0)
        .map(row => row.split(""));
}

function calculateLos(field: string[][], asteroids: Asteroid[], current: Position): number {
    let correctCount = 0;
    asteroids.forEach(asteroid => {
        if (JSON.stringify(asteroid) === JSON.stringify(current)) return;
        if (checkForObstacles(current, asteroid, field)) {
            correctCount++;
        }
    });
    return correctCount;
}

function checkForObstacles(
    start: Position,
    target: Asteroid,
    field: string[][],
    updateTarget?: boolean
): boolean {
    const difference: Position = {
        x: target.x - start.x,
        y: target.y - start.y,
    };
    const gcd = greatestCommonDivisor(
        Math.abs(difference.x), 
        Math.abs(difference.y)
    );
    let obstaclesCount = 0;
    if (gcd > 1) {
        for (let i = 1; i < gcd; i++) {
            const checkedPoint = field[start.y + difference.y*i/gcd][start.x + difference.x*i/gcd]
            if (checkedPoint !== ".") {
                obstaclesCount++;
            }
        }
    }
    if (updateTarget) {
        target.order = obstaclesCount;
        target.angle = Math.atan2(difference.x, difference.y);
    } else {
        return obstaclesCount === 0;
    }
}

function greatestCommonDivisor(a: number, b: number): number {
    if (!b) {
      return a;
    }
    return greatestCommonDivisor(b, a % b);
}