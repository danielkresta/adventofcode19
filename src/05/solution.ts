import { input } from "./input";
import { Processor } from "./../intcode-processor/processor";

const day5program = new Processor(input);
const output = day5program.startProgram([1]);
day5program.reset();
console.log("Day 5, part 1 solution: " + output);
const output2 = day5program.startProgram([5]);
console.log("Day 5, part 2 solution: " + output2);

// const isEqualToEight = new Processor([3,9,8,9,10,9,4,9,99,-1,8]);
// console.log(`Input ${1} is equal to 8: ${isEqualToEight.startProgram([1])}`)
// console.log(`Input ${8} is equal to 8: ${isEqualToEight.startProgram([8])}`)
// console.log(`Input ${10} is equal to 8: ${isEqualToEight.startProgram([10])}`)

// const isLessThanEight = new Processor([3,9,7,9,10,9,4,9,99,-1,8]);
// console.log(`Input ${1} is less than 8: ${isLessThanEight.startProgram([1])}`)
// console.log(`Input ${8} is less than 8: ${isLessThanEight.startProgram([8])}`)
// console.log(`Input ${10} is less than 8: ${isLessThanEight.startProgram([10])}`)

// const isEqualToEight2 = new Processor([3,3,1108,-1,8,3,4,3,99]);
// console.log(`Input ${1} is equal to 8: ${isEqualToEight2.startProgram([1])}`)
// console.log(`Input ${8} is equal to 8: ${isEqualToEight2.startProgram([8])}`)
// console.log(`Input ${10} is equal to 8: ${isEqualToEight2.startProgram([10])}`)

// const isLessThanEight2 = new Processor([3,3,1107,-1,8,3,4,3,99]);
// console.log(`Input ${1} is less than 8: ${isLessThanEight2.startProgram([1])}`)
// console.log(`Input ${8} is less than 8: ${isLessThanEight2.startProgram([8])}`)
// console.log(`Input ${10} is less than 8: ${isLessThanEight2.startProgram([10])}`)

// const isInputZero = new Processor([3,12,6,12,15,1,13,14,13,4,13,99,-1,0,1,9]);
// console.log(`Input ${0} is: ${isInputZero.startProgram([0])}`);
// console.log(`Input ${1} is: ${isInputZero.startProgram([1])}`);
// console.log(`Input ${10} is: ${isInputZero.startProgram([10])}`);

// const isInputZero2 = new Processor([3,3,1105,-1,9,1101,0,0,12,4,12,99,1]);
// console.log(`Input ${1} is: ${isInputZero2.startProgram([0])}`)
// console.log(`Input ${8} is: ${isInputZero2.startProgram([1])}`)
// console.log(`Input ${10} is: ${isInputZero2.startProgram([10])}`)
