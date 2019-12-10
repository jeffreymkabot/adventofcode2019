import { getInput, Program } from "./1";

const target = 19690720;

function search(inp: number[], target: number): { noun: number; verb: number } {
    for (let noun = 0; noun <= 99; noun++) {
        for (let verb = 0; verb <= 99; verb++) {
            const v = inp.slice();
            v[1] = noun;
            v[2] = verb;
            const prog = new Program(v);
            prog.exec();
            const output = prog.memory[0];
            if (output === target) {
                return { noun, verb };
            }
        }
    }
    throw new Error(`Failed to find a noun and verb that output ${target}`);
}

if (require.main === module) {
    const inp = getInput();
    console.log(`target = ${target}`);
    const { noun, verb } = search(inp, target);
    console.log(`noun = ${noun}, verb = ${verb}`);
    console.log(100 * noun + verb);
}
