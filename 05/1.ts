import * as fs from "fs";

export interface Program {
    instr: number[];
    inputs: number[];
}

export interface Result {
    memory: number[];
    outputs: number[];
}

export interface Op {
    name: string;
    code: number;
    arity: number;
    exec: (cpu: CPU, modes: (0 | 1)[], args: number[]) => void;
}

export interface CPU {
    ops: Op[];
    memory: number[];
    inputs: number[];
    outputs: number[];
    ptr: number;
    halted: boolean;
}

export const ops: Op[] = [
    {
        name: "add",
        code: 1,
        arity: 3,
        exec: (cpu, modes, args) => {
            const [a, b] = args.map((v, i) => (modes[i] ? v : cpu.memory[v]));
            const c = args[2];
            cpu.memory[c] = a + b;
            cpu.ptr += 4;
        }
    },
    {
        name: "multiply",
        code: 2,
        arity: 3,
        exec: (cpu, modes, args) => {
            const [a, b] = args.map((v, i) => (modes[i] ? v : cpu.memory[v]));
            const c = args[2];
            cpu.memory[c] = a * b;
            cpu.ptr += 4;
        }
    },
    {
        name: "input",
        code: 3,
        arity: 1,
        exec: (cpu, modes, args) => {
            const [a] = args;
            const inp = cpu.inputs.shift();
            if (inp == null) {
                // day 07 uses subclass to identify that a CPU is awaiting results of another CPU
                throw new NotEnoughInputError("Not enough inputs.");
            }
            cpu.memory[a] = inp;
            cpu.ptr += 2;
        }
    },
    {
        name: "output",
        code: 4,
        arity: 1,
        exec: (cpu, modes, args) => {
            const [a] = args;
            cpu.outputs.push(cpu.memory[a]);
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
    }
];

// day 07 uses subclass to identify that a CPU is awaiting results of another CPU
export class NotEnoughInputError extends Error {}

export function execute(ops: Op[], prog: Program): Result {
    const cpu: CPU = {
        ops,
        memory: prog.instr.slice(),
        inputs: prog.inputs.slice(),
        outputs: [],
        ptr: 0,
        halted: false
    };
    while (!cpu.halted) {
        const next = decodeNextOp(cpu);
        next();
    }
    return {
        memory: cpu.memory.slice(),
        outputs: cpu.outputs.slice()
    };
}

export function decodeNextOp(cpu: CPU) {
    const [instr, ...params] = cpu.memory.slice(cpu.ptr, cpu.ptr + 4);
    const modes = [
        Math.floor(instr / 100) % 10, // hundreds digit
        Math.floor(instr / 1000) % 10, // thousands digit
        Math.floor(instr / 1000) % 10 // ten thousands digit
    ] as (0 | 1)[];

    const opcode = instr % 100;
    const op = cpu.ops.find(op => op.code === opcode);
    if (!op) {
        throw new Error(`Unknown opcode ${opcode}.`);
    }
    return () => op.exec(cpu, modes, params.slice(0, op.arity));
}

export function getInput(): [number[], number[]] {
    let infile = process.argv[2] || "";
    if (!infile.includes(",")) {
        infile = fs.readFileSync(infile, {
            encoding: "utf-8"
        });
    }
    const instr = infile
        .trim()
        .split(",")
        .map(s => parseInt(s, 10))
        .filter(n => !isNaN(n));
    const inputs = process.argv.slice(3).map(s => parseInt(s, 10) || 0);
    return [instr, inputs];
}

if (require.main === module) {
    const [instr, inputs] = getInput();
    const result = execute(ops, { instr, inputs });
    console.log(...result.outputs);
}
