import { input } from "./input";
import { Tester } from "./../test/test";

function calculateFuel(mass: number): number {
    return Math.floor( mass / 3 ) - 2;
}

function getFirstSolution(input: number[]): number {
    return input.reduce((fuelSum, mass) => {
        fuelSum += calculateFuel(mass);
        return fuelSum
    }, 0);
}

function getSecondSolution(input: number[]) {
    return input.reduce((fuelSum, elementMass) => {
        fuelSum += calculateFuelMass(elementMass);
        return fuelSum
    }, 0);
}

function calculateFuelMass(fuelElement: number): number {
    let fuel = calculateFuel(fuelElement);
    let fuelSum = fuel;
    while(fuel > 0) {
        fuel = calculateFuel(fuel);
        fuelSum += fuel > 0 ? fuel : 0;
    };
    return fuelSum;
}

const tester1 = new Tester<number[], number>(getFirstSolution);
tester1.test([
    {input: [12], expected: 2},
    {input: [14], expected: 2},
    {input: [1969], expected: 654},
    {input: [100756], expected: 33583},
]);
console.log( "Day 1, part 1 solution: " + getFirstSolution(input) );

const tester2 = new Tester(getSecondSolution);
tester2.test([
    {input: [14], expected: 2},
    {input: [1969], expected: 966},
    {input: [100756], expected: 50346},
]);
console.log( "Day 1, part 2 solution: " + getSecondSolution(input) );