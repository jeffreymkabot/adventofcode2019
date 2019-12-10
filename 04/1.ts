function passwordOK(pwd: number): boolean {
    const digits = String(pwd)
        .trim()
        .split("")
        .map(s => parseInt(s, 10));
    return (
        digits.length === 6 && twoAdjacentEqual(digits) && nondecreasing(digits)
    );
}

export function twoAdjacentEqual(digits: number[]) {
    for (let i = 1; i < digits.length; i++) {
        if (digits[i] === digits[i - 1]) {
            return true;
        }
    }
    return false;
}

export function nondecreasing(digits: number[]) {
    for (let i = 1; i < digits.length; i++) {
        if (digits[i] < digits[i - 1]) {
            return false;
        }
    }
    return true;
}

export function getInput(): [number, number] {
    const [lo, hi] = process.argv.slice(2, 4).map(s => parseInt(s, 10));
    return [lo || 0, hi || 0];
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
