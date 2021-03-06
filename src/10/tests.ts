import { Asteroid } from "./solution";
import { TestInput } from "./../test/test";

export const testConfig: TestInput<string, Asteroid>[] = [
    {
        input: `
.#..#
.....
#####
....#
...##
        `,
        expected: {
            x: 3,
            y: 4,
            lineOfSight: 8,
        }
    },
    {
        input: `
......#.#.
#..#.#....
..#######.
.#.#.###..
.#..#.....
..#....#.#
#..#....#.
.##.#..###
##...#..#.
.#....####
        `,
        expected: {
            x: 5,
            y: 8,
            lineOfSight: 33,
        }
    },
    {
        input: `
#.#...#.#.
.###....#.
.#....#...
##.#.#.#.#
....#.#.#.
.##..###.#
..#...##..
..##....##
......#...
.####.###.
        `,
        expected: {
            x: 1,
            y: 2,
            lineOfSight: 35,
        }
    },
    {
        input: `
.#..#..###
####.###.#
....###.#.
..###.##.#
##.##.#.#.
....###..#
..#.#..#.#
#..#.#.###
.##...##.#
.....#.#..
        `,
        expected: {
            x: 6,
            y: 3,
            lineOfSight: 41,
        }
    },
    {
        input: `
.#..##.###...#######
##.############..##.
.#.######.########.#
.###.#######.####.#.
#####.##.#.##.###.##
..#####..#.#########
####################
#.####....###.#.#.##
##.#################
#####.##.###..####..
..######..##.#######
####.##.####...##..#
.#####..#.######.###
##...#.##########...
#.##########.#######
.####.#.###.###.#.##
....##.##.###..#####
.#.#.###########.###
#.#.#.#####.####.###
###.##.####.##.#..##
        `,
        expected: {
            x: 11,
            y: 13,
            lineOfSight: 210,
        }
    },
];
