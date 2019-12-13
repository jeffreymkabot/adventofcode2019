import * as fs from "fs";
import * as _ from "lodash";

export type Layer = number[];

export function intoLayers(
    digits: number[],
    width: number,
    height: number
): Layer[] {
	if (width === 0 || height === 0) {
		throw new Error(`Invalid width ${width} and height ${height}.`);
	}
    const result = [] as Layer[];
    const layerSize = width * height;
    for (let i = 0; i < digits.length; i += layerSize) {
        result.push(digits.slice(i, i + layerSize));
    }
    return result;
}

export function getInput(): [number[], number, number] {
    let input = process.argv[2] || "";
    if (!input.trim().match(/^\d+$/)) {
        input = fs.readFileSync(input, {
            encoding: "utf-8"
        });
    }
    const digits = input
        .trim()
        .split("")
        .map(s => parseInt(s, 10))
        .filter(n => !isNaN(n));
    const width = parseInt(process.argv[3], 10) || 0;
    const height = parseInt(process.argv[4], 10) || 0;
    return [digits, width, height];
}

function countDigits(layer: Layer): Record<number, number> {
    const result = {} as Record<number, number>;
    layer.forEach(n => {
        result[n] = (result[n] || 0) + 1;
    });
    return result;
}

if (require.main === module) {
    const [digits, width, height] = getInput();
	const layers = intoLayers(digits, width, height);
    const layerCounts = layers.map(layer => ({
        layer,
        count: countDigits(layer)
    }));
	const fewestZeroes = layerCounts.sort((a, b) => a.count[0] - b.count[0])[0];
	const result = fewestZeroes.count[1] * fewestZeroes.count[2];
	console.log(result);
}
