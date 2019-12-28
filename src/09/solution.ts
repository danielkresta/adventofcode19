import { input } from "./input";
import { Processor, ProcessorState } from "../intcode-processor/processor";

// const copyProgram = new Processor([109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99]);
// copyProgram.startProgram([]);
// console.log(copyProgram.output);

// const outputBig = new Processor([1102,34915192,34915192,7,4,7,99,0]);
// outputBig.startProgram([]);
// console.log(outputBig.output);

// const outputBig2 = new Processor([104,1125899906842624,99]);
// outputBig2.startProgram([]);
// console.log(outputBig2.output);

const boost = new Processor(input);
boost.startProgram([1]);
console.log(boost.output);

boost.startProgram([2]);
console.log(boost.output);
