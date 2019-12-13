import * as fs from "fs";
import * as _ from "lodash";

function vertices(edgeList: string[][]): string[] {
    return _.uniq(_.flatten(edgeList));
}

/**
 * List bodies directly orbited and indirectly orbited by vertex.
 * @param edgeList
 * @param vertex
 */
function orbits(edgeList: string[][], vertex: string): string[] {
    const directOrbit = edgeList.find(e => e[1] === vertex);
    if (!directOrbit) {
        return [];
    }
    const directParent = directOrbit[0];
    return [directParent].concat(orbits(edgeList, directParent));
}

export function getInput(): string[][] {
    let inp = process.argv[2] || "";
    if (!inp.includes("\n")) {
        inp = fs.readFileSync(__dirname + "/" + inp, { encoding: "utf-8" });
    }
    return inp
        .trim()
        .split("\n")
        .map(s => s.trim().split(")"));
}

if (require.main === module) {
    const edgeList = getInput();
    const vs = vertices(edgeList);
    const os = vs.map(v => orbits(edgeList, v));
    const sum = os.reduce((p, v) => p + v.length, 0);
    console.log(sum);
}
