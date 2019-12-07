import { input } from "./input";
import { Tester } from "./../test/test";

interface Instruction {
    name: string;
    inputsCount: number;
    execute?: (inputs: Value[]) => number;
}

interface Value {
    address: number;
    value: number;
}

const instructions: {[key: number]: Instruction} = {
    1: {
        name: "add",
        inputsCount: 2,
        execute: inputs => inputs[0].value + inputs[1].value,
    },
    2: {
        name: "multiply",
        inputsCount: 2,
        execute: inputs => inputs[0].value * inputs[1].value,
    },
    99: {
        name: "halt",
        inputsCount: 0,
    },
}

function getFirstSolution(input: number[]): number[] {
    return runProgram(input, 12, 2);
}

function runProgram(input: number[], noun = input[1], verb = input[2]): number[] {
    const memory = [input[0], noun, verb, ...input.slice(3, input.length)];
    let instructionPointer = 0;
    while(instructionPointer < memory.length && instructionPointer !== -1) {
        instructionPointer = process(memory, instructionPointer);
    }
    return memory;
}

function getSecondSolution(input: number[], expectedOutput: number): number {
    const inputMin = 0;
    const inputMax = 99;
    for (let noun = inputMin; noun < inputMax+1; noun++) {
        for (let verb = inputMin; verb < inputMax; verb++){
            const programResult = runProgram(input, noun, verb);
            if (programResult[0] === expectedOutput) {
                return 100 * noun + verb;
            }
        }
    }
}

function process(array: number[], pointer: number): number {
    const getValue = (array: number[], memoryIndex: number): Value => {
        const address = array[memoryIndex];
        if (address == null) return;
        return {address, value: array[address]};
    };

    const opcode = array[pointer];
    const currentInstruction = opcode != null ? instructions[opcode] : null;
    if (currentInstruction == null) {
        console.log(`Unknown opcode: ${opcode}`);
        return pointer+1;
    }

    if (currentInstruction.execute == null) {
        return -1;
    }

    const inputs: Value[] = [];
    for (let i = 0; i < currentInstruction.inputsCount; i++) {
        inputs[i] = getValue(array, pointer + i + 1);
    }
    const output = getValue(array, pointer + currentInstruction.inputsCount + 1);

    if (inputs.filter(val => val == null).length > 0
        && output == null
    ) return;

    output.value = currentInstruction.execute(inputs);
    array[output.address] = output.value;

    return pointer+currentInstruction.inputsCount+2;
}

const tester1 = new Tester<number[], number[]>(runProgram);
tester1.test([
    {input: [1,9,10,3,2,3,11,0,99,30,40,50], expected: [3500,9,10,70,2,3,11,0,99,30,40,50]},
    {input: [1,0,0,0,99], expected: [2,0,0,0,99]},
    {input: [2,3,0,3,99], expected: [2,3,0,6,99]},
    {input: [2,4,4,5,99,0], expected: [2,4,4,5,99,9801]},
    {input: [1,1,1,4,99,5,6,0,99], expected: [30,1,1,4,2,5,6,0,99]},
]);
console.log( "Day 2, part 1 solution: " + getFirstSolution(input)[0]);
console.log( "Day 2, part 2 solution: " + getSecondSolution(input, 19690720));