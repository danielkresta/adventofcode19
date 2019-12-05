export type SolCallback = (input: (string | number)[]) => (string | number);
export interface TestInput {
    input: (string | number)[],
    expected: (string | number),
}

export class Tester {
    private _solutionCallback: SolCallback;
    private _testCount = 0;

    constructor(
        solutionCallback: SolCallback,
    ) {
        this._solutionCallback = solutionCallback;
        console.log("-----------------------------------");
    }

    public test(tests: TestInput[]): boolean {
        const allPassed = tests.reduce((passed, test) => {
            passed = passed && this.testSolution( test.input, test.expected );
            return passed;
        }, true as boolean);
        console.log(`Passed ${this._testCount} tests, result: ${allPassed ? "Success" : "Fail"}`);
        return allPassed;
    }

    private testSolution( input: (string | number)[], expectedResult: (string | number)): boolean {
        console.log("Running test #" + this._testCount++);
        const result = this._solutionCallback(input)
        if (result === expectedResult) {
            return true;
        } else {
            console.log( `Fail! Result ${result} is not matching the expected ${expectedResult}` );
            return false;
        }
    }
}