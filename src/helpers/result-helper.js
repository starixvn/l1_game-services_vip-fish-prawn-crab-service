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

export const generateResult = () => {
    let resultArray = [];
    for (let index = 0; index < 100; index++) {
        resultArray.push(DiceRandom.random() - 1);
    }

    const chance = new Chance();
    const dice1 = resultArray[chance.natural({ min: 0, max: resultArray.length - 1 })];
    const dice2 = resultArray[chance.natural({ min: 0, max: resultArray.length - 1 })];
    const dice3 = resultArray[chance.natural({ min: 0, max: resultArray.length - 1 })];

    return { dice1, dice2, dice3 };
};

export const getSettlementResult = (roundResult) => {
    const resultArray = Object.values(roundResult);

    return settlementRuleEntries.reduce((result, [choice, rule]) => {
        result[choice] = rule(resultArray);

        return result;
    }, {});
};
