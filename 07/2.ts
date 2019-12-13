import { getInput, CPU, decodeNextOp, NotEnoughInputError } from "../05/1";
import { permutations, maxCombo } from "./1";
import { ops2 } from "../05/2";

export function feedbackLoop(instr: number[], combo: number[]) {
    const cpus = [] as CPU[];
    combo.forEach(c => {
        const phaseSetting = c;
        cpus.push({
            ops: ops2,
            memory: instr.slice(),
            inputs: [phaseSetting],
            outputs: [],
            ptr: 0,
            halted: false
        });
    });
    for (let i = 0; i < cpus.length - 1; i++) {
        cpus[i].outputs = cpus[i + 1].inputs;
    }
    const first = cpus[0];
    const last = cpus[cpus.length - 1];
    last.outputs = first.inputs;
    first.inputs.push(0);

    while (!cpus.every(cpu => cpu.halted)) {
        cpus.forEach(cpu => {
            // run each cpu up to the point that awaits input from another cpu
            while (!cpu.halted) {
                try {
                    const next = decodeNextOp(cpu);
                    next();
                } catch (exc) {
                    if (exc instanceof NotEnoughInputError) {
                        break;
                    }
                    throw exc;
                }
            }
        });
    }
    return last.outputs[last.outputs.length - 1];
}

if (require.main === module) {
    const [instr] = getInput();
    const combos = permutations([5, 6, 7, 8, 9]);
    const result = maxCombo(instr, combos, feedbackLoop);
    console.log(result.max, result.maxCombo);
}
