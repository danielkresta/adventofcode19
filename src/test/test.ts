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
    }

    public test(tests: TestInput<T, R>[]): boolean {
        console.log("-----------------------------------");
        const allPassed = tests.reduce((passed, test) => {
            passed = passed && this.testSolution( test.input, test.expected );
            return passed;
        }, true as boolean);
        console.log(`Passed ${this._testCount} tests, result: ${allPassed ? "Success" : "Fail"}`);
        return allPassed;
    }

    private testSolution(input: T, expectedResult: R): boolean {
        console.log("Running test #" + ++this._testCount);
        let result: R | string = this._solutionCallback(input);
        let expected: R | string;
        if (Array.isArray(expectedResult)) {
            expected = JSON.stringify(expectedResult);
            result = JSON.stringify(result);
        } else if (typeof expectedResult === "object") {
            expected = JSON.stringify(expectedResult);
            result = JSON.stringify(result);
        } else {
            expected = expectedResult;
        }

        if (result !== expected) {
            console.log( `Fail! Result ${result} is not matching the expected ${expected}` );
        }
        return result === expected;
    }
}