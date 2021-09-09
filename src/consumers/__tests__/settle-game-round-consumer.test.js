import { stubMongooseModelStupidly } from "jest-micro-auto-stub";
import mongoose from "mongoose";
import SettleGameRoundConsumer from "../settle-game-round-consumer";
import { Core } from "sc-game-base";

jest.mock("../../constants");
jest.mock("sc-game-base/src/core/event-publishers/round-result-publisher");
jest.mock("sc-game-base/src/core/event-publishers/user-bet-result-publisher");

const endGame = jest.fn();
const roundsRepository = stubMongooseModelStupidly(mongoose.Model);
const betsRepository = stubMongooseModelStupidly(mongoose.Model);
const definition = new Core.GameDefinition({ id: 1, name: "game name" }, jest.fn(), jest.fn());
const gameData = new Core.GameData();
gameData.gameConfigs = {
    enabled: true,
    minbet: 10,
    maxbet: 5000,
    choices_maxbet: {
        fish: 5000,
        prawn: 5000,
        crab: 5000,
        stag: 5000,
        gourd: 5000,
        rooster: 5000,
        anyTriple: 500,
        mountain: 5000,
        ocean: 5000,
    },
    odds: {
        single: 2,
        double: 3.5,
        triple: 6,
        anyTriple: 30,
        mountain: 1.97,
        ocean: 1.97,
    },
    enableFreeBet: false,
};

const roundResultPublisher = new Core.BaseEventPublishers.RoundResultPublisher("BauCua", gameData);
const userBetResultPublisher = new Core.BaseEventPublishers.UserBetResultPublisher("BauCua", gameData);
const consumer = new SettleGameRoundConsumer({
    definition,
    gameData,
});

describe("SettleGameRoundConsumer test", () => {
    it("should inherit base SettleGameRoundConsumer", () => {
        expect(SettleGameRoundConsumer instanceof Core.BaseEventConsumers.SettleGameRoundConsumer);
    });
});

describe("calculateBetResult test", () => {
    const testCases = [
        {
            roundResult: { dice1: 4, dice2: 4, dice3: 3 },
            settlementResult: {
                stag: false,
                gourd: false,
                rooster: true,
                fish: true,
                crab: false,
                prawn: false,
                anyTriple: false,
                mountain: false,
                ocean: true,
            },
            bet: { stag: 50, gourd: 50, rooster: 0, fish: 0, crab: 0, prawn: 0, ocean: 100, anyTriple: 0, mountain: 0 },
            expectResult: {
                totalBetAmount: 200,
                totalWin: 197,
                netWin: 97,
                totalLost: 100,
                winningByChoices: { stag: 0, gourd: 0, rooster: 0, fish: 0, crab: 0, prawn: 0, anyTriple: 0, mountain: 0, ocean: 197 },
            },
        },
        {
            roundResult: { dice1: 2, dice2: 2, dice3: 3 },
            settlementResult: {
                stag: false,
                gourd: false,
                rooster: true,
                fish: true,
                crab: false,
                prawn: false,
                anyTriple: false,
                mountain: true,
                ocean: false,
            },
            bet: { stag: 0, gourd: 0, rooster: 50, fish: 0, crab: 0, prawn: 0, mountain: 100, ocean: 0, anyTriple: 0 },
            expectResult: {
                totalBetAmount: 150,
                totalWin: 372,
                netWin: 222,
                totalLost: 0,
                winningByChoices: { stag: 0, gourd: 0, rooster: 175, fish: 0, crab: 0, prawn: 0, mountain: 197, anyTriple: 0, ocean: 0 },
            },
        },
        {
            roundResult: { dice1: 2, dice2: 2, dice3: 1 },
            settlementResult: {
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
            bet: { stag: 0, gourd: 50, rooster: 100, fish: 0, crab: 0, prawn: 0, anyTriple: 0, mountain: 0, ocean: 0 },
            expectResult: {
                totalBetAmount: 150,
                totalWin: 450,
                netWin: 300,
                totalLost: 0,
                winningByChoices: { stag: 0, gourd: 100, rooster: 350, fish: 0, crab: 0, prawn: 0, anyTriple: 0, mountain: 0, ocean: 0 },
            },
        },
        {
            roundResult: { dice1: 5, dice2: 5, dice3: 5 },
            settlementResult: {
                stag: false,
                gourd: false,
                rooster: false,
                fish: false,
                crab: false,
                prawn: true,
                anyTriple: true,
                mountain: false,
                ocean: true,
            },
            bet: { stag: 0, gourd: 0, rooster: 100, fish: 0, crab: 0, prawn: 100, anyTriple: 10, ocean: 100, mountain: 0 },
            expectResult: {
                totalBetAmount: 310,
                totalWin: 1097,
                netWin: 887,
                totalLost: 100,
                winningByChoices: { stag: 0, gourd: 0, rooster: 0, fish: 0, crab: 0, prawn: 600, anyTriple: 300, mountain: 0, ocean: 197 },
            },
        },
        {
            roundResult: { dice1: 5, dice2: 5, dice3: 5 },
            settlementResult: {
                stag: false,
                gourd: false,
                rooster: false,
                fish: false,
                crab: false,
                prawn: true,
                anyTriple: true,
                mountain: false,
                ocean: true,
            },
            bet: { stag: 0, gourd: 0, rooster: 100, fish: 0, crab: 0, prawn: 0, anyTriple: 0, ocean: 0, mountain: 0 },
            expectResult: {
                totalBetAmount: 100,
                totalWin: 0,
                netWin: 0,
                totalLost: 100,
                winningByChoices: { stag: 0, gourd: 0, rooster: 0, fish: 0, crab: 0, prawn: 0, anyTriple: 0, mountain: 0, ocean: 0 },
            },
        },
    ];

    it.each(testCases)("should return correct result", ({ settlementResult, bet, roundResult, expectResult }) => {
        const actualResult = consumer.calculateBetResult(settlementResult, bet, gameData.gameConfigs.odds, roundResult);

        expect(actualResult).toEqual(expectResult);
    });
});

describe("settleBets test", () => {
    it("should settle all bets and publish to game client", async () => {
        const result = { dice1: 5, dice2: 5, dice3: 5 };
        const settlementResult = {
            stag: false,
            gourd: false,
            rooster: false,
            fish: false,
            crab: false,
            prawn: true,
            anyTriple: true,
            mountain: false,
            ocean: true,
        };

        definition.generateResult.mockReturnValueOnce(result);
        definition.settle.mockReturnValueOnce(settlementResult);
        roundsRepository.create.mockReturnValueOnce({ id: 1, result, settlementResult });

        const termConsumer = new SettleGameRoundConsumer({
            definition,
            gameData,
            roundResultPublisher,
            userBetResultPublisher,
            endGame,
            roundsRepository,
            betsRepository,
        });
        termConsumer.callEndGame = jest.fn();
        termConsumer.queryBets = jest.fn(() => [
            { prawn: 100, save: jest.fn() },
            { stag: 200, freeBet: true, save: jest.fn() },
        ]);

        await termConsumer.settleBets({ result, settlementResult, roundId: 1, time: new Date() });

        expect(termConsumer.callEndGame).toHaveBeenCalled();
        expect(userBetResultPublisher.publish).toHaveBeenCalled();
        expect(roundResultPublisher.publishRoundResult).toHaveBeenCalled();
    });
});

beforeEach(() => {
    jest.clearAllMocks();
});
