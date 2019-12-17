import * as fs from "fs";

if (require.main === module) {
    const input = getInput();
    const grid = toGrid(input);
    const result = findBestBase(grid);
    console.log(result.base, result.score);
}

export const ASTEROID = "#";

export function findBestBase(g: Grid): Result {
    const best: Result = {
        score: -Infinity,
        base: { x: 0, y: 0 },
        trace: {
            blocked: [],
            unblocked: []
        }
    };

    for (let x = 0; x < g.X; x++) {
        for (let y = 0; y < g.Y; y++) {
            if (g.at(x, y) === ASTEROID) {
                const pos = { x, y };
                const _trace = trace(g, pos);
                if (_trace.unblocked.length > best.score) {
                    best.score = _trace.unblocked.length;
                    best.base = pos;
                    best.trace = _trace;
                }
            }
        }
    }

    return best;
}

export interface Result {
    score: number;
    base: Point;
    trace: Trace;
}

export interface Point {
    x: number;
    y: number;
}

export interface Trace {
    unblocked: Point[];
    blocked: Point[];
}

export function trace(g: Grid, start: Point) {
    const results = {
        blocked: [] as Point[],
        unblocked: [] as Point[]
    };

    for (let x = 0; x < g.X; x++) {
        for (let y = 0; y < g.Y; y++) {
            const pos = { x, y };
            if (
                g.at(x, y) === ASTEROID &&
                !(pos.x === start.x && pos.y === start.y)
            ) {
                const arr = isPathBlocked(g, start, pos)
                    ? results.blocked
                    : results.unblocked;
                arr.push(pos);
            }
        }
    }

    return results;
}

export function isPathBlocked(g: Grid, start: Point, end: Point): boolean {
    // divide the path from start to end into smallest quantizable units
    // check grid position at each segment between start and end
    const distance = { x: end.x - start.x, y: end.y - start.y };
    const _gcd = Math.abs(gcd(distance.x, distance.y));
    const unit = { x: distance.x / _gcd, y: distance.y / _gcd };

    const p = { x: start.x + unit.x, y: start.y + unit.y };
    while (!(p.x === end.x && p.y === end.y)) {
        if (g.at(p.x, p.y) === ASTEROID) {
            return true;
        }
        p.x += unit.x;
        p.y += unit.y;
    }
    return false;
}

export function gcd(a: number, b: number) {
    while (b !== 0) {
        let t = b;
        b = a % b;
        a = t;
    }
    return a;
}

export function getInput(): string[][] {
    let input = process.argv[2] || "";
    if (input.includes("txt")) {
        input = fs.readFileSync(input, {
            encoding: "utf-8"
        });
    }
    return input
        .trim()
        .split("\n")
        .map(line => line.split(""));
}

export type Grid = ReturnType<typeof toGrid>;

export function toGrid(map: string[][]) {
    return {
        X: map[0].length,
        Y: map.length,
        at: (x: number, y: number) => {
            return map[y][x];
        }
    };
}
