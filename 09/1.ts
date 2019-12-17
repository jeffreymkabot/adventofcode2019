import { getInput, NotEnoughInputError } from "../05/1";

export interface Op {
    name: string;
    code: number;
    arity: number;
    exec: (cpu: CPU, modes: Mode[], args: number[]) => void;
}

export class CPU {
    inputs: number[];
    outputs: number[] = [];

    memory: number[];
    ptr = 0;
    halted = false;
    relativeBase = 0;

    ops: Op[] = [
        {
            name: "add",
            code: 1,
            arity: 3,
            exec: (cpu, modes, args) => {
                const a = cpu.read(modes[0], args[0]);
				const b = cpu.read(modes[1], args[1]);
				const result = a + b;
                cpu.write(modes[2], args[2], result);
                cpu.ptr += 4;
            }
        },
        {
            name: "multiply",
            code: 2,
            arity: 3,
            exec: (cpu, modes, args) => {
                const a = cpu.read(modes[0], args[0]);
				const b = cpu.read(modes[1], args[1]);
				const result = a * b;
                cpu.write(modes[2], args[2], result);
                cpu.ptr += 4;
            }
        },
        {
            name: "input",
            code: 3,
            arity: 1,
            exec: (cpu, modes, args) => {
                const input = cpu.inputs.shift();
                if (input == null) {
                    throw new NotEnoughInputError("Not enough inputs.");
                }
                cpu.write(modes[0], args[0], input);
                cpu.ptr += 2;
            }
        },
        {
            name: "output",
            code: 4,
            arity: 1,
            exec: (cpu, modes, args) => {
                const output = cpu.read(modes[0], args[0]);
                cpu.outputs.push(output);
                cpu.ptr += 2;
            }
        },
        {
            name: "halt",
            code: 99,
            arity: 0,
            exec: cpu => {
                cpu.halted = true;
            }
        },
        {
            name: "jump-if-true",
            code: 5,
            arity: 2,
            exec: (cpu, modes, args) => {
                const a = cpu.read(modes[0], args[0]);
                const b = cpu.read(modes[1], args[1]);
                cpu.ptr = a !== 0 ? b : cpu.ptr + 3;
            }
        },
        {
            name: "jump-if-false",
            code: 6,
            arity: 2,
            exec: (cpu, modes, args) => {
                const a = cpu.read(modes[0], args[0]);
                const b = cpu.read(modes[1], args[1]);
                cpu.ptr = a === 0 ? b : cpu.ptr + 3;
            }
        },
        {
            name: "less-than",
            code: 7,
            arity: 3,
            exec: (cpu, modes, args) => {
                const a = cpu.read(modes[0], args[0]);
				const b = cpu.read(modes[1], args[1]);
				const result = a < b ? 1 : 0;
                cpu.write(modes[2], args[2], result);
                cpu.ptr += 4;
            }
        },
        {
            name: "equals",
            code: 8,
            arity: 3,
            exec: (cpu, modes, args) => {
                const a = cpu.read(modes[0], args[0]);
				const b = cpu.read(modes[1], args[1]);
				const result = a === b ? 1 : 0;
                cpu.write(modes[2], args[2], result);
                cpu.ptr += 4;
            }
		},
		{
			name: "relative-base-offset",
			code: 9,
			arity: 1,
			exec: (cpu, modes, args) => {
				const offset = cpu.read(modes[0], args[0]);
				cpu.relativeBase += offset;
				cpu.ptr += 2;
			}
		}
    ];

    constructor(instr: number[], inputs: number[]) {
        this.memory = instr.slice();
        this.inputs = inputs.slice();
        this.outputs = [];
    }

    read(mode: Mode, addr: number) {
        switch (mode) {
            case Mode.Position:
                return this.memory[addr] || 0;
            case Mode.Immediate:
                return addr;
            case Mode.Relative:
                return this.memory[addr + this.relativeBase] || 0;
            default:
                throw new Error(`Unkown mode ${mode}.`);
        }
    }
    write(mode: Mode, addr: number, value: number) {
        switch (mode) {
            case Mode.Position:
                this.memory[addr] = value;
                return;
            case Mode.Immediate:
                return;
            case Mode.Relative:
                this.memory[addr + this.relativeBase] = value;
                return;
            default:
                throw new Error(`Unkown mode ${mode}.`);
        }
    }

    execute() {
        while (!this.halted) {
            const { op, modes, params } = this.decodeNextInstruction();
            op.exec(this, modes, params);
        }
        return {
            memory: this.memory.slice(),
            outputs: this.outputs.slice()
        };
    }

    decodeNextInstruction() {
        const [instr, ...params] = this.memory.slice(this.ptr, this.ptr + 4);
        const modes = [
            Math.floor(instr / 100) % 10, // hundreds digit
            Math.floor(instr / 1000) % 10, // thousands digit
            Math.floor(instr / 10000) % 10 // ten thousands digit
        ] as Mode[];

        const opcode = instr % 100;
        const op = this.ops.find(op => op.code === opcode);
        if (!op) {
            throw new Error(`Unknown opcode ${opcode}.`);
        }
        return { op, modes, params };
    }
}

export enum Mode {
    Position = 0,
    Immediate = 1,
    Relative = 2
}

if (require.main === module) {
	const [instr, inputs] = getInput();
	const cpu = new CPU(instr, inputs);
	const result = cpu.execute();
	console.log(...result.outputs);
}
