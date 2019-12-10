import { inputMasses, fuel, sum } from "./1";

function fuel2(mass: number): number {
    let totalFuel = fuel(mass);
    let prevFuel = totalFuel;
    let delta = 0;
    do {
        const nextFuel = fuel(prevFuel);
        prevFuel = nextFuel;

        delta = Math.max(nextFuel, 0);
        totalFuel += delta;
    } while (delta > 0);
    return totalFuel;
}

if (require.main === module) {
    const masses = inputMasses();
    const fuels = masses.map(fuel2);
    console.log(sum(fuels));
}
