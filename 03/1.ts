import * as fs from "fs";

/**
 * Node is a position in the grid that
 * remembers which wires have reached it.
 */
interface Node {
    x: number;
    y: number;
    wires: Set<string>;
}

class Grid {
    private static key = (x: number, y: number) => `${x}.${y}`;
    public readonly nodes: Map<string, Node> = new Map();

    constructor() {}

    addWire(label: string, wire: string[]) {
        let x = 0;
        let y = 0;
        wire.forEach(seg => {
            const dist = parseInt(seg.slice(1), 10) || 0;
            // determine whether we are moving in x or y and in what direction
            const mx = seg[0] === "R" ? 1 : seg[0] === "L" ? -1 : 0;
            const my = seg[0] === "U" ? 1 : seg[0] === "D" ? -1 : 0;

            for (let i = 0; i < dist; i++) {
                const key = Grid.key(x, y);
                const n = this.nodes.get(key);
                // add this wire to a node already in the grid
                // (i.e. visited by a previous wire)
                // or create a new node on the fly
                if (n) {
                    n.wires.add(label);
                } else {
                    this.nodes.set(key, {
                        x,
                        y,
                        wires: new Set([label])
                    });
                }
                x += mx;
                y += my;
            }
        });
    }

    intersections(): Node[] {
        const nodes = [] as Node[];
        this.nodes.forEach(n => {
            if (n.wires.size > 1) {
                nodes.push(n);
            }
        });
        // filter out the center port
        return nodes.filter(n => !(n.x === 0 && n.y === 0));
    }
}

function manhattanDistance(node: Node) {
    return Math.abs(node.x) + Math.abs(node.y);
}

export function getInput(): string[][] {
    let inp = process.argv[2] || "";
    if (!inp.includes(",")) {
        inp = fs.readFileSync(__dirname + "/" + inp, { encoding: "utf-8" });
    }
    return inp
        .trim()
        .split("\n")
        .map(s => s.trim().split(","));
}

if (require.main === module) {
    const inp = getInput();
    const grid = new Grid();
    grid.addWire("A", inp[0]);
    grid.addWire("B", inp[1]);
    const intersections = grid.intersections();
    console.log(intersections);
    const distances = intersections.map(manhattanDistance);
    const closest = Math.min(...distances);
    console.log(closest);
}
