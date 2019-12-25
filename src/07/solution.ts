import { input } from "./input";
import { Tester } from "./../test/test";
import { Processor } from "./../intcode-processor/processor";


const tester = new Tester<number[], number>(getFirstSolution);
tester.test([
    {
        input: [3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0],
        expected: 43210,
    },
    {
        input: [3,23,3,24,1002,24,10,24,1002,23,-1,23,101,5,23,23,1,24,23,23,4,23,99,0,0],
        expected: 54321,
    },
    {
        input: [3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33,1002,33,7,33,1,33,31,31,1,32,31,31,4,31,99,0,0,0],
        expected: 65210,
    },
]);
console.log( "Day 7, part 1 solution: " + getFirstSolution(input));


function getFirstSolution(input: number[]): number {
    const ampControllers = [] as Processor[];
    for (let i = 0; i < 5; i++) {
        ampControllers.push(new Processor(input));
    }
    const phaseCombinations = generatePermutations<number>([0, 1, 2, 3, 4]);
    return phaseCombinations.reduce((maxOutput, phase) => {
        const output = calculateOutput(phase, ampControllers);
        return maxOutput > output ? maxOutput : output;
    }, 0);
}

function generatePermutations<T>(list: T[]) {
    const digits = [] as T[];
    const finished = [] as T[][];
    function permutate(list: T[]): void {
        if (list.length === 0) {
            finished.push([...digits]);
            return;
        }
        for (var i = 0; i < list.length; i++) {
            const x = list.splice(i, 1)[0];
            digits.push(x);
            permutate(list);
            digits.pop();
            list.splice(i, 0, x);
        }
    }
    permutate(list);
    return finished;
}

function calculateOutput(phases: number[], ampControllers: Processor[]): number {
    return ampControllers.reduce((signal, amp) => {
        return amp.startProgram([
            phases.shift(),
            signal,
        ]);
    }, 0);
}