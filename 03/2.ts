import { getInput } from "./1";

/**
 * Node is a position in the grid that
 * maps a wire that has reached the node to the signal delay of that wire.
 */
interface Node {
    x: number;
    y: number;
    wires: Map<string, number>;
}

class Grid {
    protected static key = (x: number, y: number) => `${x}.${y}`;
    public readonly nodes: Map<string, Node> = new Map();

    constructor() {}

    addWire(label: string, wire: string[]) {
        let x = 0;
        let y = 0;
        let delay = 0;
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
                    // no-op if the wire already touched the node
                    // as it must have been with a shorter delay
                    if (!n.wires.get(label)) {
                        n.wires.set(label, delay);
                    }
                } else {
                    this.nodes.set(key, {
                        x,
                        y,
                        wires: new Map([[label, delay]])
                    });
                }
                x += mx;
                y += my;
                delay++;
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

function signalDelay(node: Node) {
    let delay = 0;
    node.wires.forEach(val => {
        delay += val;
    });
    return delay;
}

if (require.main === module) {
    const inp = getInput();
    const grid = new Grid();
    grid.addWire("A", inp[0]);
    grid.addWire("B", inp[1]);
    const intersections = grid.intersections();
    console.log(intersections);
    const delays = intersections.map(signalDelay);
    const shortest = Math.min(...delays);
    console.log(shortest);
}
