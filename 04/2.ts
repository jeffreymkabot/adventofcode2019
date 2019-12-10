import { getInput, nondecreasing } from "./1";

function passwordOK(pwd: number): boolean {
    const digits = String(pwd)
        .trim()
        .split("")
        .map(s => parseInt(s, 10));
    return (
        digits.length === 6 &&
        nondecreasing(digits) &&
        exactlyTwoAdjacentEqual(digits)
    );
}

function exactlyTwoAdjacentEqual(digits: number[]): boolean {
    const streaks = [] as number[][];
    let streak = [digits[0]];
    for (let i = 1; i < digits.length; i++) {
        if (digits[i] === streak[0]) {
            streak.push(digits[i]);
        } else {
            streaks.push(streak.slice());
            streak = [digits[i]];
        }
    }
    streaks.push(streak.slice());
    return streaks.some(s => s.length === 2);
}

if (require.main === module) {
    const [lo, hi] = getInput();
    let oks = 0;
    for (let i = lo; i <= hi; i++) {
        if (passwordOK(i)) {
            oks++;
        }
    }
    console.log(oks);
}
