import { Tester } from "./../test/test";

const input = [178416, 676461]

interface Pair {
    firstDigit: string;
    secondDigit: string;
}

const passwordChecks: {[key: string]: (password: string[]) => boolean} = {
    "sameDigits": password => {
        const conditionMet = checkPasswordCondition(
            password,
            (first, second) => first === second
        );
        return conditionMet.length > 0;
    },
    "decresing": password => {
        const conditionMet = checkPasswordCondition(
            password,
            (first, second) => first <= second
        );
        return conditionMet.length === 5;
    },
    "onlyPairs": password => {
        const pairs = checkPasswordCondition(
            password,
            (first, second) => first === second
        )
            .map(pair => pair.firstDigit);
        if (pairs.length === 1) return true;

        let sameDigits: string[] = [];
        let i = 0;
        for (i; i < pairs.length-1; i++) {
            if (pairs[i] == pairs[i+1]) {
                sameDigits.push(pairs[i]);
            }
            if (pairs[i] != pairs[i+1] && !sameDigits.includes(pairs[i])) {
                return true;
            }
        }
        return !sameDigits.includes(pairs[i]);
    }
}

function getFirstSolution([from, to]: number[]): number {
    return getSolution([from, to], ["sameDigits", "decresing"]);
}

function getSecondSolution([from, to]: number[]): number {
    return getSolution([from, to], ["sameDigits", "decresing", "onlyPairs"]);
}

function getSolution([from, to]: number[], checkNames: string[]) {
    let correctPasswords = [] as string[][];
    for (let password = from; password <= to; password++) {
        correctPasswords.push(password.toString().split(""));
    }
    correctPasswords = filterPasswords(correctPasswords, checkNames);
    return correctPasswords.length;
}

function filterPasswords(passwords: string[][], checkNames: string[]) {
    return checkNames.reduce((passwords, checkName) => {
        return passwords.filter(passwordChecks[checkName])
    }, passwords);
}

function checkPasswordCondition(
    password: string[],
    condition: (digit1: string, digit2: string) => boolean
): Pair[] {
    let conditionMetPairs = [] as Pair[];

    for (let digit = 0; digit < password.length-1; digit++) {
        const firstDigit = password[digit];
        const secondDigit = password[digit+1];
        if (condition(firstDigit, secondDigit)) {
            conditionMetPairs.push({firstDigit, secondDigit});
        }
    }
    return conditionMetPairs;
}

const tester1 = new Tester<number[], number>(getFirstSolution);
tester1.test([
    {input: [111111, 111111], expected: 1},
    {input: [223450, 223450], expected: 0},
    {input: [123789, 123789], expected: 0},
]);
console.log( "Day 4, part 1 solution: " + getFirstSolution(input));

const tester2 = new Tester<number[], number>(getSecondSolution);
tester2.test([
    {input: [112233, 112233], expected: 1},
    {input: [123444, 123444], expected: 0},
    {input: [111122, 111122], expected: 1},
    {input: [111222, 111222], expected: 0},
    {input: [111234, 111234], expected: 0},
    {input: [112333, 112333], expected: 1},
]);
console.log( "Day 4, part 2 solution: " + getSecondSolution(input));