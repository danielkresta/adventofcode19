export type SolCallback<T, R> = (input: T) => R;
export interface TestInput<T, R> {
    input: T,
    expected: R,
}

export class Tester<T, R> {
    private _solutionCallback: SolCallback<T, R>;
    private _testCount = 0;

    constructor(
        solutionCallback: SolCallback<T, R>,
    ) {
        this._solutionCallback = solutionCallback;
        console.log("-----------------------------------");
    }

    public test(tests: TestInput<T, R>[]): boolean {
        const allPassed = tests.reduce((passed, test) => {
            passed = passed && this.testSolution( test.input, test.expected );
            return passed;
        }, true as boolean);
        console.log(`Passed ${this._testCount} tests, result: ${allPassed ? "Success" : "Fail"}`);
        return allPassed;
    }

    private testSolution(input: T, expectedResult: R): boolean {
        console.log("Running test #" + this._testCount++);
        const result = this._solutionCallback(input);
        if (!Array.isArray(expectedResult) && result === expectedResult) {
            return true;
        } else if (Array.isArray(expectedResult) && JSON.stringify(result) === JSON.stringify(expectedResult)) {
            return true;
        } else {
            console.log( `Fail! Result ${result} is not matching the expected ${expectedResult}` );
            return false;
        }
    }
}