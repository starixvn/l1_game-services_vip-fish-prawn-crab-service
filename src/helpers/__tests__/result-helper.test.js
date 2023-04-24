import { generateResult, getSettlementResult } from "../result-helper";

const chanceMock = { pickoneIndex: 0 };

describe("generateResult test", () => {
    const testCases = [
        { randomMode: 1, pickoneIndex: 0 },
        { randomMode: 1, pickoneIndex: 1 },
        { randomMode: 1, pickoneIndex: 2 },
        { randomMode: 1, pickoneIndex: 3 },
        { randomMode: 1, pickoneIndex: 4 },
        { randomMode: 2, pickoneIndex: 0 },
        { randomMode: 3, pickoneIndex: 0 },
        { randomMode: 3, pickoneIndex: 1 },
        { randomMode: 4, pickoneIndex: 0 },
    ];
    it.each(testCases)("should return 3 dices having value between 0 and 5", (testCase) => {
        chanceMock.pickoneIndex = testCase.pickoneIndex;
        const actualResult = generateResult(testCase.randomMode);

        expect(actualResult).toContainAllKeys(["dice1", "dice2", "dice3"]);
        expect(Object.values(actualResult)).toSatisfyAll((dice) => dice >= 0 && dice <= 5);
    });
});

describe("getSettlementResult test", () => {
    const testCases = [
        {
            result: { dice1: 0, dice2: 1, dice3: 2 },
            expectSettlementResult: {
                stag: true,
                gourd: true,
                rooster: true,
                fish: false,
                crab: false,
                prawn: false,
                anyTriple: false,
                mountain: true,
                ocean: false,
            },
        },
        {
            result: { dice1: 3, dice2: 2, dice3: 1 },
            expectSettlementResult: {
                stag: false,
                gourd: true,
                rooster: true,
                fish: true,
                crab: false,
                prawn: false,
                anyTriple: false,
                mountain: true,
                ocean: false,
            },
        },
        {
            result: { dice1: 2, dice2: 2, dice3: 1 },
            expectSettlementResult: {
                stag: false,
                gourd: true,
                rooster: true,
                fish: false,
                crab: false,
                prawn: false,
                anyTriple: false,
                mountain: true,
                ocean: false,
            },
        },
        {
            result: { dice1: 0, dice2: 0, dice3: 0 },
            expectSettlementResult: {
                stag: true,
                gourd: false,
                rooster: false,
                fish: false,
                crab: false,
                prawn: false,
                anyTriple: true,
                mountain: true,
                ocean: false,
            },
        },
    ];

    it.each(testCases)("should return correct settlement result", ({ result, expectSettlementResult }) => {
        const actualResult = getSettlementResult(result);

        expect(actualResult).toEqual(expectSettlementResult);
    });
});
