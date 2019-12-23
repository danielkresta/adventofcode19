import { input } from "./input";
import { Tester } from "./../test/test";

interface Orbit {
    code: string,
    orbits: string;
    distance: number;
    orbitingObjects: string[];
}


const tester01 = new Tester<string[], number>(getFirstSolution);
tester01.test([
    {
        input: ["COM)B", "B)C", "C)D", "D)E", "E)F", "B)G", "G)H", "D)I", "E)J", "J)K", "K)L"],
        expected: 42,
    }
]);
console.log( "Day 6, part 1 solution: " + getFirstSolution(input));

const tester02 = new Tester<string[], number>(getSecondSolution);
tester02.test([
    {
        input: ["COM)B", "B)C", "C)D", "D)E", "E)F", "B)G", "G)H", "D)I", "E)J", "J)K", "K)L", "K)YOU", "I)SAN"],
        expected: 4,
    }
]);
console.log( "Day 6, part 2 solution: " + getSecondSolution(input));



function getFirstSolution(input: string[]): number {
    const objectMap: {[key: string]: Orbit} = {
        "COM": {
            code: "COM",
            orbits: null,
            distance: 0,
            orbitingObjects: [],
        },
    };
    parseObjectMap(input, objectMap);
    moveUpTheTree(objectMap["COM"], null, objectMap);
    return Object
        .values(objectMap)
        .reduce((sum, obj) => sum += obj.distance, 0);
}

function getSecondSolution(input: string[]): number {
    const objectMap: {[key: string]: Orbit} = {
        "COM": {
            code: "COM",
            orbits: null,
            distance: 0,
            orbitingObjects: [],
        },
    };
    parseObjectMap(input, objectMap);

    let pathSanta: string[] = [];
    moveDownTheTree(objectMap["SAN"], objectMap, pathSanta);
    pathSanta = pathSanta.reverse();
    
    let pathYou: string[] = [];
    moveDownTheTree(objectMap["YOU"], objectMap, pathYou);
    pathYou = pathYou.reverse();

    for (let i = 0; i < pathYou.length; i++) {
        if (pathYou[i] !== pathSanta[i]) {
            pathYou.splice(0, i);
            pathSanta.splice(0, i);
            break;
        }
    }
    return (
        pathYou.length-1 +  // points between last common and You (excluding)
        pathSanta.length-1  // points between last common and Santa (excluding)
    );
}

function parseObjectMap(input: string[], objectMap: {[key: string]: Orbit}) {
    input.forEach(current => parseOrbit(current, objectMap));
}

function parseOrbit(code: string, objectMap: {[key: string]: Orbit}) {
    const [orbitedCode, objCode] = parseCode(code);

    const object = objectMap[objCode];
    if (object) {
        object.orbits = orbitedCode;
    } else {
        objectMap[objCode] = {
            code: objCode,
            orbits: orbitedCode,
            distance: null,
            orbitingObjects: [],
        };
    }

    const orbited = objectMap[orbitedCode]
    if (orbited) {
        orbited.orbitingObjects.push(objCode);
    } else {
        objectMap[orbitedCode] = {
            code: orbitedCode,
            orbits: null,
            distance: null,
            orbitingObjects: [objCode],
        };
    }
}

function parseCode(code: string): string[] {
    return code.split(")");
}

function moveUpTheTree(currObj: Orbit, prevObj: Orbit, objectMap: {[key: string]: Orbit}) {
    currObj.distance = prevObj ? prevObj.distance+1 : 0;
    currObj.orbitingObjects.forEach(obj => moveUpTheTree(objectMap[obj], currObj, objectMap));
}

function moveDownTheTree(currObj: Orbit, objectMap: {[key: string]: Orbit}, path: string[]) {
    path.push(currObj.code);
    if (currObj.orbits) {
        moveDownTheTree(objectMap[currObj.orbits], objectMap, path);
    }
}