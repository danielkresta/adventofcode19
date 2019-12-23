import { input } from "./input";

interface Instruction {
    name: string;
    parametersCount: number;
    doNotMovePointer?: boolean;
    execute?: (parameters: Parameter[]) => void;
}

interface Parameter {
    value: number;
    modeIsImmediate: boolean;
}

interface InstructionType {
    opcode: number;
    modeIsImmediate: boolean[];
}

class Processor {

    private _memory: number[];
    private _program: number[];
    private _input: number;
    private _output: number[] = [];
    private _instructionPointer = 0;

    constructor(
        program: number[],
    ) {
        this._program = program;
    }

    private instructions: {[key: number]: Instruction} = {
        1: {
            name: "add",
            parametersCount: 3,
            execute: parameters => {
                this._memory[parameters[3].value] = this.getParameter(parameters[1]) + this.getParameter(parameters[2]);
            },
        },
        2: {
            name: "multiply",
            parametersCount: 3,
            execute: parameters => {
                this._memory[parameters[3].value] = this.getParameter(parameters[1]) * this.getParameter(parameters[2]);
            }
        },
        3: {
            name: "input",
            parametersCount: 1,
            execute: parameters => this._memory[parameters[1].value] = this._input,
        },
        4: {
            name: "output",
            parametersCount: 1,
            execute: parameters => this._output.push( this._memory[parameters[1].value] ),
        },
        5: {
            name: "jump-if-true",
            parametersCount: 2,
            doNotMovePointer: true,
            execute: parameters => {
                if (this.getParameter(parameters[1]) !== 0) {
                    this._instructionPointer = this.getParameter(parameters[2]);
                } else {
                    this._instructionPointer += 3;
                }
            },
        },
        6: {
            name: "jump-if-false",
            parametersCount: 2,
            doNotMovePointer: true,
            execute: parameters => {
                if (this.getParameter(parameters[1]) === 0) {
                    this._instructionPointer = this.getParameter(parameters[2]);
                } else {
                    this._instructionPointer += 3;
                }
            },
        },
        7: {
            name: "less-than",
            parametersCount: 3,
            execute: parameters => {
                this._memory[parameters[3].value] = 
                    this.getParameter(parameters[1]) < this.getParameter(parameters[2])
                    ? 1
                    : 0;
            },
        },
        8: {
            name: "equals",
            parametersCount: 3,
            execute: parameters => {
                this._memory[parameters[3].value] = 
                    this.getParameter(parameters[1]) === this.getParameter(parameters[2])
                    ? 1
                    : 0;
            },
        },
        99: {
            name: "halt",
            parametersCount: 0,
        },
    };

    get memory() {
        return this._memory;
    }

    runProgram(input: number): number {
        this.reset();
        this._input = input;
        let halt: boolean;
        while (!halt && this._instructionPointer < this._memory.length) {
            halt = this.process();
        }
        return this._output.slice(-1)[0];
    }

    private reset(): void {
        this._memory = [...this._program];
        this._instructionPointer = 0;
    }

    /**
     * Runs one instruction
     * Return value: halt?
     */
    process(): boolean {
        const currentInstructionType = this.parseIntruction( this._memory[this._instructionPointer] );
        if (currentInstructionType == null || currentInstructionType.opcode === 99) {
            this._instructionPointer++;
            return true;
        }

        const currentInstruction = this.instructions[currentInstructionType.opcode];
        if (currentInstruction == null) {
            console.error("Unknown instruction " + currentInstructionType.opcode);
            return true;
        }

        const parameters = this.getParameters(
            currentInstruction.parametersCount,
            currentInstructionType.modeIsImmediate
        );

        currentInstruction.execute(parameters);
        if (!currentInstruction.doNotMovePointer) {
            this._instructionPointer += currentInstruction.parametersCount + 1;
        }
    }

    private parseIntruction(instruction: number): InstructionType {
        if (instruction == null) return;
        const [mode3, mode2, mode1, ...opcode] = instruction.toString().padStart(5, "0").split("");
        return {
            opcode: Number(opcode.join("")),
            modeIsImmediate: [
                null,
                mode1 === "1",
                mode2 === "1",
                mode3 === "1",
            ],
        };
    }

    private getParameters(parametersCount: number, modeIsImmediate: boolean[]): Parameter[] {
        const parameters: Parameter[] = [];
        for (let parameterIndex = 1; parameterIndex <= parametersCount; parameterIndex++) {
            const parameter = this._memory[this._instructionPointer + parameterIndex];
            parameters[parameterIndex] = {
                value: parameter,
                modeIsImmediate: modeIsImmediate[parameterIndex],
            };
        }
        return parameters;
    }

    private getParameter(param: Parameter): number {
        return param.modeIsImmediate ? param.value : this._memory[param.value];
    }


}

const day5program = new Processor(input);
const output = day5program.runProgram(1);
console.log("Part 1: " + output);
const output2 = day5program.runProgram(5);
console.log("Part 2: " + output2);

// const isEqualToEight = new Processor([3,9,8,9,10,9,4,9,99,-1,8]);
// console.log(`Input ${1} is equal to 8: ${isEqualToEight.runProgram(1)}`)
// console.log(`Input ${8} is equal to 8: ${isEqualToEight.runProgram(8)}`)
// console.log(`Input ${10} is equal to 8: ${isEqualToEight.runProgram(10)}`)

// const isLessThanEight = new Processor([3,9,7,9,10,9,4,9,99,-1,8]);
// console.log(`Input ${1} is less than 8: ${isLessThanEight.runProgram(1)}`)
// console.log(`Input ${8} is less than 8: ${isLessThanEight.runProgram(8)}`)
// console.log(`Input ${10} is less than 8: ${isLessThanEight.runProgram(10)}`)

// const isEqualToEight2 = new Processor([3,3,1108,-1,8,3,4,3,99]);
// console.log(`Input ${1} is equal to 8: ${isEqualToEight2.runProgram(1)}`)
// console.log(`Input ${8} is equal to 8: ${isEqualToEight2.runProgram(8)}`)
// console.log(`Input ${10} is equal to 8: ${isEqualToEight2.runProgram(10)}`)

// const isLessThanEight2 = new Processor([3,3,1107,-1,8,3,4,3,99]);
// console.log(`Input ${1} is less than 8: ${isLessThanEight2.runProgram(1)}`)
// console.log(`Input ${8} is less than 8: ${isLessThanEight2.runProgram(8)}`)
// console.log(`Input ${10} is less than 8: ${isLessThanEight2.runProgram(10)}`)

// const isInputZero = new Processor([3,12,6,12,15,1,13,14,13,4,13,99,-1,0,1,9]);
// console.log(`Input ${0} is: ${isInputZero.runProgram(0)}`);
// console.log(`Input ${1} is: ${isInputZero.runProgram(1)}`);
// console.log(`Input ${10} is: ${isInputZero.runProgram(10)}`);

// const isInputZero2 = new Processor([3,3,1105,-1,9,1101,0,0,12,4,12,99,1]);
// console.log(`Input ${1} is: ${isInputZero2.runProgram(0)}`)
// console.log(`Input ${8} is: ${isInputZero2.runProgram(1)}`)
// console.log(`Input ${10} is: ${isInputZero2.runProgram(10)}`)
