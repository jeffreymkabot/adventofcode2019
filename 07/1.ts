import { getInput, execute, Result } from "../05/1";
import { ops2 } from "../05/2";

export function permutations(seq: number[]): number[][] {
    if (seq.length === 0) {
        return [];
    }
    if (seq.length === 1) {
        return [seq];
    }

    // Get permutations of the previous sequence (without first element).
    // Insert first element at every position of each permutation of previous sequence
    const [first, ...rest] = seq;
    const perms = permutations(rest);

    const results = [] as number[][];
    for (let i = 0; i <= rest.length; i++) {
        const insertAtIthPosition = (seq: number[]) => {
            const copy = seq.slice();
            copy.splice(i, 0, first);
            return copy;
        };
        const x = perms.map(insertAtIthPosition);
        results.push(...x);
    }
    return results;
}

export function series(instr: number[], combo: number[]): number {
    let nextInput = 0;
    for (let i = 0; i < combo.length; i++) {
        let phaseSetting = combo[i];
        const result = execute(ops2, {
            instr,
            inputs: [phaseSetting, nextInput]
        });
        nextInput = result.outputs[0] || 0;
    }
    return nextInput;
}

export function maxCombo(
    instr: number[],
    combos: number[][],
    exec: (instr: number[], combo: number[]) => number
): { max: number; maxCombo: number[] } {
    let max = -Infinity;
    let maxCombo = combos[0];
    combos.forEach(c => {
        const output = exec(instr, c);
        if (output > max) {
            max = output;
            maxCombo = c;
        }
    });
    return { max, maxCombo };
}

if (require.main === module) {
    const [instr] = getInput();
    const combos = permutations([0, 1, 2, 3, 4]);
    const result = maxCombo(instr, combos, series);
    console.log(result.max, result.maxCombo);
}
