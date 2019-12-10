import * as fs from "fs";

export function fuel(mass: number): number {
    return Math.trunc(mass / 3) - 2;
}

export function sum(fuels: number[]): number {
    return fuels.reduce((prev, cur) => prev + cur, 0);
}

export function inputMasses(): number[] {
    const inp = process.argv[2] || "";
    const inpNum = parseInt(inp);
    if (!isNaN(inpNum)) {
        return [inpNum];
    }
    const infile = fs.readFileSync(__dirname + "/" + inp, {
        encoding: "utf-8"
    });
    return infile
        .trim()
        .split("\n")
        .map(s => parseInt(s, 10))
        .filter(n => !isNaN(n));
}

if (require.main === module) {
    const masses = inputMasses();
    const fuels = masses.map(fuel);
    console.log(sum(fuels));
}
