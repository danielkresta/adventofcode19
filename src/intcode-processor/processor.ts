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

enum ProcessorState {
    NONE,
    RUNNING,
    WAITING,
    HALT,
    ERROR,
}

export class Processor {

    private _memory: number[];
    private _program: number[];
    private _input: number[];
    private _output: number[] = [];
    private _instructionPointer = 0;
    private _state = ProcessorState.NONE;

    constructor(
        program: number[],
    ) {
        this._program = program;
        this._memory = [...this._program];
    }

    startProgram(input: number[]): number {
        this._input = [...input];
        this._runProgram();
        return this._output.slice(-1)[0];
    }

    reset(): void {
        this._memory = [...this._program];
        this._instructionPointer = 0;
    }


    private readonly instructions: {[key: number]: Instruction} = {
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
            execute: parameters => {
                this._memory[parameters[1].value] = this._input.shift();
            },
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

    private _runProgram(): void {
        let halt: boolean;
        this._state = ProcessorState.RUNNING;
        while (
            !halt &&
            this._instructionPointer < this._memory.length &&
            this._state === ProcessorState.RUNNING
        ) {
            this._process();
        }
    }

    private _process() {
        const currentInstructionType = this._parseIntruction( this._memory[this._instructionPointer] );
        if (currentInstructionType == null || currentInstructionType.opcode === 99) {
            this._state = ProcessorState.HALT;
            this.reset();
            return;
        }

        const currentInstruction = this.instructions[currentInstructionType.opcode];
        if (currentInstruction == null) {
            console.error("Unknown instruction " + currentInstructionType.opcode);
            this._state = ProcessorState.ERROR;
            return;
        }

        if (currentInstruction.name === "input" && this._input.length === 0) {
            this._state = ProcessorState.WAITING;
            console.log("Waiting...");
            return;
        }

        const parameters = this._getParameters(
            currentInstruction.parametersCount,
            currentInstructionType.modeIsImmediate
        );

        currentInstruction.execute(parameters);
        if (!currentInstruction.doNotMovePointer) {
            this._instructionPointer += currentInstruction.parametersCount + 1;
        }
    }

    private _parseIntruction(instruction: number): InstructionType {
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

    private _getParameters(parametersCount: number, modeIsImmediate: boolean[]): Parameter[] {
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