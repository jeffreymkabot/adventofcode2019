import * as fs from "fs";

export interface Op {
    name: string;
    code: number;
    arity: number;
    exec: (prog: Program, modes: (0 | 1)[], args: number[]) => void;
}

export class Program implements Iterable<null> {
    public readonly memory: number[];
    protected input: number;

    public ptr = 0;
    public done = false;
    protected static ops: Op[] = [
        {
            name: "add",
            code: 1,
            arity: 3,
            exec: (prog, modes, args) => {
                const [a, b] = args.map((v, i) =>
                    modes[i] ? v : prog.memory[v]
                );
                const c = args[2];
                prog.memory[c] = a + b;
                prog.ptr += 4;
            }
        },
        {
            name: "multiply",
            code: 2,
            arity: 3,
            exec: (prog, modes, args) => {
                const [a, b] = args.map((v, i) =>
                    modes[i] ? v : prog.memory[v]
                );
                const c = args[2];
                prog.memory[c] = a * b;
                prog.ptr += 4;
            }
        },
        {
            name: "input",
            code: 3,
            arity: 1,
            exec: (prog, modes, args) => {
                const [a] = args;
                prog.memory[a] = prog.input;
                prog.ptr += 2;
            }
        },
        {
            name: "output",
            code: 4,
            arity: 1,
            exec: (prog, modes, args) => {
                const [a] = args;
                console.log(prog.memory[a]);
                prog.ptr += 2;
            }
        },
        {
            name: "halt",
            code: 99,
            arity: 0,
            exec: prog => {
                prog.done = true;
            }
        }
    ];

    constructor(instr: number[], input: number) {
        this.memory = instr.slice();
        this.input = input;
    }

    decodeNextOp(): () => void {
        const [instr, ...parameters] = this.memory.slice(
            this.ptr,
            this.ptr + 4
        );
        const modes = [
            Math.floor(instr / 100) % 10, // hundreds digit
            Math.floor(instr / 1000) % 10, // thousands digit
            Math.floor(instr / 1000) % 10 // ten thousands digit
        ] as (0 | 1)[];

        const opcode = instr % 100;
        // https://github.com/Microsoft/TypeScript/issues/3841
        const op = (this.constructor as typeof Program).ops.find(
            op => op.code === opcode
        );
        if (!op) {
            throw new Error(`Unknown opcode ${opcode}.`);
        }

        return () => op.exec(this, modes, parameters.slice(0, op.arity));
    }
    /**
     * Execute program until a halt instruction is encountered.
     */
    exec() {
        for (const _ of this) {
        }
    }
    [Symbol.iterator]() {
        return {
            next: () => {
                if (this.done) {
                    return { done: this.done, value: null };
                }
                const opExec = this.decodeNextOp();
                opExec();
                return { done: this.done, value: null };
            }
        };
    }
}

export function getInput(): [number[], number] {
    let infile = process.argv[2] || "";
    if (!infile.includes(",")) {
        infile = fs.readFileSync(__dirname + "/" + infile, {
            encoding: "utf-8"
        });
    }
    const instr = infile
        .trim()
        .split(",")
        .map(s => parseInt(s, 10))
        .filter(n => !isNaN(n));
    const input = parseInt(process.argv[3], 10) || 0;
    return [instr, input];
}

if (require.main === module) {
    const [instr, input] = getInput();
    const prog = new Program(instr, input);
    prog.exec();
}
