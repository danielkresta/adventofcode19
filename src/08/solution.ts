import { input } from "./input";

const {first, second} = loopLayers(input, 25, 6);
console.log( "Day 8, part 1 solution: " + first);
console.log( "Day 8, part 2 solution: ");
second();

function loopLayers(input: string[], width: number, height: number): {first: number, second: () => void} {
    const image: string[][] = new Array(height);
    let minZerosDigits = [Infinity];
    const drawImage = () => {
        console.log("------------------------")
        for (let y = 0; y < height; y++) {
            const row = [];
            for (let x = 0; x < width; x++) {
                row[x] = image[y][x] === "1" ? "#" : " ";
            }
            console.log(row.join(""));
        }
        console.log("------------------------")
    }

    while(input.length > 0) {
        const layerData = input.splice(0, width*height);

        // Part 1
        const currentDigits = countDigits(layerData);
        if (currentDigits[0] < minZerosDigits[0]) {
            minZerosDigits = currentDigits;
        }

        // Part 2
        addLayer(
            image,
            layerData,
            width,
            height,
        );
    }
    return {
        first: minZerosDigits[1]*minZerosDigits[2],
        second: drawImage,
    };
}

function countDigits(input: string[]): number[] {
    return input.reduce((digitsCount, current: string) => {
        digitsCount[+current]++
        return digitsCount;
    }, new Array(10).fill(0) as number[]);
}

function addLayer(image: string[][], input: string[], width: number, height: number): void {
    for (let y = 0; y < height; y++) {
        if (image[y] == null) {
            image[y] = [];
        }
        const horizontalLine = input.splice(0, width);
        for (let x = 0; x < width; x++) {
            if (image[y][x] === "2" || image[y][x] == null) {
                image[y][x] = horizontalLine[x];
            }
        }
    }
}