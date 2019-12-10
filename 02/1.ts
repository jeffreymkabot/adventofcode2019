import * as fs from "fs";

export class Program {
    private instptr = 0;
    public readonly memory: number[];
    constructor(inp: number[]) {
        this.memory = inp.slice();
    }
    private checkBounds(...addresses: number[]) {
        addresses.forEach(a => {
            if (a < 0 || a >= this.memory.length) {
                throw new Error(`Address ${a} out of range.`);
            }
        });
    }
    add(p0: number, p1: number, target: number) {
        this.checkBounds(p0, p1, target);
        this.memory[target] = this.memory[p0] + this.memory[p1];
    }
    mul(p0: number, p1: number, target: number) {
        this.checkBounds(p0, p1, target);
        this.memory[target] = this.memory[p0] * this.memory[p1];
    }
    exec() {
        while (true) {
            const [op, p0, p1, target] = this.memory.slice(
                this.instptr,
                this.instptr + 4
            );
            const step = 4;
            switch (op) {
                case 1:
                    this.add(p0, p1, target);
                    break;
                case 2:
                    this.mul(p0, p1, target);
                    break;
                case 99:
                    return;
                default:
                    throw new Error(`Unknown opcode ${op}`);
            }
            this.instptr = this.instptr + step;
        }
    }
}

export function getInput(): number[] {
    let inp = process.argv[2] || "";
    if (!inp.includes(",")) {
        inp = fs.readFileSync(__dirname + "/" + inp, { encoding: "utf-8" });
    }
    return inp
        .trim()
        .split(",")
        .map(s => parseInt(s, 10))
        .filter(n => !isNaN(n));
}

if (require.main === module) {
    const inp = getInput();
    inp[1] = 12;
    inp[2] = 2;
    const prog = new Program(inp);
    prog.exec();
    console.log(prog.memory[0]);
}
