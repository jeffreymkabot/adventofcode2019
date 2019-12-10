import { getInput } from "./1";
import * as _ from "lodash";

const me = "YOU";
const santa = "SAN";

/**
 * Compute the length of the shortest path from start to each other vertex.
 *
 * @param edgeList
 * @param start
 */
function shortestPaths(
    edgeList: string[][],
    start: string
): Record<string, number> {
    const visited = [start];
    const queue = [start];
    const distances = { [start]: 0 };
    while (queue.length > 0) {
        const v = queue.shift() as string;
        const neighbors = _.flatten(edgeList.filter(e => e.includes(v))).filter(
            n => n !== v
		);
        neighbors.forEach(n => {
            if (visited.includes(n)) {
                return;
            }
            visited.push(n);
            queue.push(n);
            distances[n] = distances[v] + 1;
        });
    }
    return distances;
}

if (require.main === module) {
    const edgeList = getInput();
    const startOrbit = edgeList.find(e => e[1] === me);
    const santaOrbit = edgeList.find(e => e[1] === santa);
    if (!startOrbit || !santaOrbit) {
        throw new Error("Missing orbit for santa or me.");
    }
    // start = body that I am already orbiting
    // end = body that santa is orbiting
    const start = startOrbit[0];
    const end = santaOrbit[0];
    const paths = shortestPaths(edgeList, start);
    console.log(paths[end]);
}
