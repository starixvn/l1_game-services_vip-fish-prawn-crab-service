import Chance from "chance";
import constants from "../constants";
import * as DiceRandom from "./dice-random";

const settlementRuleEntries = Object.entries({
    stag: (diceArray) => diceArray.some((dice) => dice === constants.resultMapper.stag),
    gourd: (diceArray) => diceArray.some((dice) => dice === constants.resultMapper.gourd),
    rooster: (diceArray) => diceArray.some((dice) => dice === constants.resultMapper.rooster),
    fish: (diceArray) => diceArray.some((dice) => dice === constants.resultMapper.fish),
    crab: (diceArray) => diceArray.some((dice) => dice === constants.resultMapper.crab),
    prawn: (diceArray) => diceArray.some((dice) => dice === constants.resultMapper.prawn),
    anyTriple: (diceArray) => diceArray.every((dice) => dice === diceArray[0]),
    mountain: (diceArray) => diceArray.filter((dice) => dice < 3).length >= 2,
    ocean: (diceArray) => diceArray.filter((dice) => dice >= 3).length >= 2,
});

export const generateResult = (randomMode) => {
    const resultArray = [];

    for (let index = 0; index < 100; index++) {
        resultArray.push(DiceRandom.random(randomMode) - 1);
    }

    const chance = new Chance();
    const pickedRandoms = chance.pickset(resultArray, 3);

    return { dice1: pickedRandoms[0], dice2: pickedRandoms[1], dice3: pickedRandoms[2] };
};

export const getSettlementResult = (roundResult) => {
    const resultArray = Object.values(roundResult);

    return settlementRuleEntries.reduce((result, [choice, rule]) => {
        result[choice] = rule(resultArray);

        return result;
    }, {});
};
