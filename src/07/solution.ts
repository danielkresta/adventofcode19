import { input } from "./input";
import { Tester } from "./../test/test";
import { Processor, ProcessorState } from "./../intcode-processor/processor";


const tester1 = new Tester<number[], number>(getFirstSolution);
tester1.test([
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

const tester2 = new Tester<number[], number>(getSecondSolution);
tester2.test([
    {
        input: [3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5],
        expected: 139629729,
    },
    {
        input: [
            3,52,1001,52,-5,52,3,53,1,52,56,54,1007,54,5,55,1005,55,26,1001,54,
            -5,54,1105,1,12,1,53,54,53,1008,54,0,55,1001,55,1,55,2,53,55,53,4,
            53,1001,56,-1,56,1005,56,6,99,0,0,0,0,10
        ],
        expected: 18216,
    },
]);
console.log( "Day 7, part 2 solution: " + getSecondSolution(input));


function getFirstSolution(input: number[]): number {
    const ampControllers = [] as Processor[];
    for (let i = 0; i < 5; i++) {
        ampControllers.push(new Processor(input));
    }
    const phaseCombinations = generatePermutations<number>([0, 1, 2, 3, 4]);
    return phaseCombinations.reduce((maxOutput, phase) => {
        const output = calculateOutput(phase, ampControllers, 0, true);
        return maxOutput > output ? maxOutput : output;
    }, 0);
}

function getSecondSolution(input: number[]) {
    const ampControllers = [] as Processor[];
    for (let i = 0; i < 5; i++) {
        ampControllers.push(new Processor(input));
    }
    const phaseCombinations = generatePermutations<number>([5, 6, 7, 8, 9]);
    return phaseCombinations.reduce((maxOutput, phase) => {
        const output = calculateFeedbackOutput(phase, ampControllers);
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

function calculateOutput(
    phases: number[],
    ampControllers: Processor[],
    startSignal: number,
    setPhases?: boolean
): number {
    return ampControllers
        .reduce(
            (signal, amp) => amp.startProgram([
                ...(setPhases ? [phases.shift()] : []),
                signal,
            ]),
            startSignal,
        );
}

function calculateFeedbackOutput(phases: number[], ampControllers: Processor[]): number {
    let output = calculateOutput(phases, ampControllers, 0, true);

    while (ampControllers[4].state !== ProcessorState.HALT) {
        output = calculateOutput(phases, ampControllers, output);
    }
    return output;
}