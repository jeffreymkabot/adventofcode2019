import { getInput, intoLayers, Layer } from "./1";

function combineLayers(layers: Layer[]): Layer {
    const result = [] as Layer;
    for (let i = 0; i < layers[0].length; i++) {
        // first non-transparent pixel
        result[i] = layers.map(l => l[i]).find(p => p !== 2) || 0;
    }
    return result;
}

function renderLayer(layer: Layer, width: number, height: number) {
    for (let i = 0; i < height; i++) {
        const row = layer.slice(i * width, (i + 1) * width);
        console.log(row.map(p => (p === 1 ? "█" : " ")).join(""));
    }
}

if (require.main === module) {
    const [digits, width, height] = getInput();
    const layers = intoLayers(digits, width, height);
    const result = combineLayers(layers);
    renderLayer(result, width, height);
}
