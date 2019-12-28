interface Instruction {
    name: string;
    parametersCount: number;
    doNotMovePointer?: boolean;
    execute?: (parameters: Parameter[]) => void;
}

enum ParameterMode {
    POSITION = "0",
    IMMEDIATE = "1",
    RELATIVE = "2",
}

interface Parameter {
    value: number;
    modeType: ParameterMode;
}

interface InstructionType {
    opcode: number;
    modeType: ParameterMode[];
}

export enum ProcessorState {
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
    private _relativeBase = 0;
    public state = ProcessorState.NONE;

    constructor(
        program: number[],
    ) {
        this._program = program;
        this._memory = [...this._program];
    }

    get output() {
        return this._output;
    }

    startProgram(input: number[]): number {
        this._input = [...input];
        this._runProgram();
        return this._output.slice(-1)[0];
    }

    reset(): void {
        this._memory = [...this._program];
        this._instructionPointer = 0;
        this._relativeBase = 0;
    }


    private readonly instructions: {[key: number]: Instruction} = {
        1: {
            name: "add",
            parametersCount: 3,
            execute: parameters => {
                const result = this._getParameter(parameters[1]) + this._getParameter(parameters[2]);
                this._setParameter(parameters[3], result);
            },
        },
        2: {
            name: "multiply",
            parametersCount: 3,
            execute: parameters => {
                const result = this._getParameter(parameters[1]) * this._getParameter(parameters[2]);
                this._setParameter(parameters[3], result);
            }
        },
        3: {
            name: "input",
            parametersCount: 1,
            execute: parameters => {
                console.log(parameters)
                this._setParameter(parameters[1], this._input.shift());
            },
        },
        4: {
            name: "output",
            parametersCount: 1,
            execute: parameters => {
                this._output.push(this._getParameter(parameters[1]));
            },
        },
        5: {
            name: "jump-if-true",
            parametersCount: 2,
            doNotMovePointer: true,
            execute: parameters => {
                if (this._getParameter(parameters[1]) !== 0) {
                    this._instructionPointer = this._getParameter(parameters[2]);
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
                if (this._getParameter(parameters[1]) === 0) {
                    this._instructionPointer = this._getParameter(parameters[2]);
                } else {
                    this._instructionPointer += 3;
                }
            },
        },
        7: {
            name: "less-than",
            parametersCount: 3,
            execute: parameters => {
                const result = this._getParameter(parameters[1]) < this._getParameter(parameters[2])
                    ? 1
                    : 0;
                this._setParameter(parameters[3], result);
            },
        },
        8: {
            name: "equals",
            parametersCount: 3,
            execute: parameters => {
                const result = this._getParameter(parameters[1]) === this._getParameter(parameters[2])
                    ? 1
                    : 0;
                this._setParameter(parameters[3], result);
            },
        },
        9: {
            name: "adjust-rel-base",
            parametersCount: 1,
            execute: parameters => this._relativeBase += this._getParameter(parameters[1])
        },
        99: {
            name: "halt",
            parametersCount: 0,
        },
    };

    private _runProgram(): void {
        let halt: boolean;
        this.state = ProcessorState.RUNNING;
        while (
            !halt &&
            this._instructionPointer < this._memory.length &&
            this.state === ProcessorState.RUNNING
        ) {
            this._process();
        }
    }

    private _process() {
        const currentInstructionType = this._parseIntruction( this._memory[this._instructionPointer] );
        // console.log(currentInstructionType)
        if (currentInstructionType == null || currentInstructionType.opcode === 99) {
            this.state = ProcessorState.HALT;
            this.reset();
            return;
        }

        const currentInstruction = this.instructions[currentInstructionType.opcode];
        if (currentInstruction == null) {
            console.error("Unknown instruction " + currentInstructionType.opcode);
            this.state = ProcessorState.ERROR;
            return;
        }

        if (currentInstruction.name === "input" && this._input.length === 0) {
            this.state = ProcessorState.WAITING;
            return;
        }

        const parameters = this._getParameters(
            currentInstruction.parametersCount,
            currentInstructionType.modeType
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
            modeType: [
                null,
                mode1 as ParameterMode,
                mode2 as ParameterMode,
                mode3 as ParameterMode,
            ],
        };
    }

    private _getParameters(parametersCount: number, modeType: ParameterMode[]): Parameter[] {
        const parameters: Parameter[] = [];
        for (let parameterIndex = 1; parameterIndex <= parametersCount; parameterIndex++) {
            const parameter = this._memory[this._instructionPointer + parameterIndex];
            parameters[parameterIndex] = {
                value: parameter,
                modeType: modeType[parameterIndex],
            };
        }
        return parameters;
    }

    private _getParameter(param: Parameter): number {
        let value;
        let pointer;
        switch (param.modeType) {
            case ParameterMode.POSITION:
                pointer = param.value;
                if (pointer < 0) return;
                value = this._memory[pointer];
                break;
            case ParameterMode.IMMEDIATE:
                value = param.value;
                break;
            case ParameterMode.RELATIVE:
                pointer = param.value+this._relativeBase;
                if (pointer < 0) return;
                value = this._memory[pointer];
                break;
        }
        return value != null ? value : 0;
    }

    private _setParameter(param: Parameter, value: number): void {
        let pointer;
        switch (param.modeType) {
            case ParameterMode.POSITION:
            case ParameterMode.IMMEDIATE:
                pointer = param.value;
                break;
            case ParameterMode.RELATIVE:
                pointer = param.value+this._relativeBase;
                break;
        }
        if (pointer < 0) return;
        this._memory[pointer] = value;
    }
}