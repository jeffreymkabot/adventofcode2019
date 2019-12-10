import { getInput, Program, Op } from "./1";

class Program2 extends Program {
    protected static ops: Op[] = [
        ...Program.ops,
        {
            name: "jump-if-true",
            code: 5,
            arity: 2,
            exec: (prog, modes, args) => {
                const [a, b] = args.map((v, i) =>
                    modes[i] ? v : prog.memory[v]
                );
                prog.ptr = a !== 0 ? b : prog.ptr + 3;
            }
        },
        {
            name: "jump-if-false",
            code: 6,
            arity: 2,
            exec: (prog, modes, args) => {
                const [a, b] = args.map((v, i) =>
                    modes[i] ? v : prog.memory[v]
                );
                prog.ptr = a === 0 ? b : prog.ptr + 3;
            }
        },
        {
            name: "less-than",
            code: 7,
            arity: 3,
            exec: (prog, modes, args) => {
                const [a, b] = args.map((v, i) =>
                    modes[i] ? v : prog.memory[v]
                );
                const c = args[2];
                prog.memory[c] = a < b ? 1 : 0;
                prog.ptr += 4;
            }
        },
        {
            name: "equals",
            code: 8,
            arity: 3,
            exec: (prog, modes, args) => {
                const [a, b] = args.map((v, i) =>
                    modes[i] ? v : prog.memory[v]
                );
                const c = args[2];
                prog.memory[c] = a === b ? 1 : 0;
                prog.ptr += 4;
            }
        }
    ];
}

if (require.main === module) {
    const [instr, input] = getInput();
    const prog = new Program2(instr, input);
    prog.exec();
}
