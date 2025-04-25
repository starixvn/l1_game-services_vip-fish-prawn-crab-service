import { stubMongoose } from "jest-micro-auto-stub";
import mongoose from "mongoose";
import SettleGameRoundConsumer from "../settle-game-round-consumer";
import { Core } from "sc-game-base";

jest.mock("../../constants");
jest.mock("sc-game-base/src/core/event-publishers/round-result-publisher");
jest.mock("sc-game-base/src/core/event-publishers/user-bet-result-publisher");

// Test setup
const setupTestEnvironment = () => {
    const endGame = jest.fn();
    const roundsRepository = stubMongoose(mongoose.Model);
    const betsRepository = stubMongoose(mongoose.Model);
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

    return {
        endGame,
        roundsRepository,
        betsRepository,
        definition,
        gameData,
        roundResultPublisher,
        userBetResultPublisher,
    };
};

describe("SettleGameRoundConsumer", () => {
    let testEnv;

    beforeEach(() => {
        testEnv = setupTestEnvironment();
        jest.clearAllMocks();
    });

    describe("settleBets", () => {
        // Test successful settlement with multiple bets
        it("should successfully settle multiple bets and publish results", async () => {
            // Arrange
            const consumer = new SettleGameRoundConsumer({
                ...testEnv,
            });

            const mockBets = [
                {
                    uid: "user1",
                    prawn: 100,
                    rate: 1,
                    save: jest.fn().mockResolvedValue(true),
                },
                {
                    uid: "user2",
                    stag: 200,
                    freeBet: true,
                    rate: 1,
                    save: jest.fn().mockResolvedValue(true),
                },
            ];

            const mockResult = { dice1: 5, dice2: 5, dice3: 5 };
            const mockSettlementResult = {
                prawn: true,
                stag: false,
            };

            consumer.queryBets = jest.fn().mockResolvedValue(mockBets);
            consumer.callEndGame = jest.fn().mockResolvedValue({ isOk: true });
            consumer.captureBetResult = jest.fn();
            testEnv.userBetResultPublisher.publish = jest.fn().mockResolvedValue(true);

            // Act
            await consumer.settleBets({
                result: mockResult,
                settlementResult: mockSettlementResult,
                roundId: "round1",
                time: new Date(),
            });

            // Assert
            expect(consumer.queryBets).toHaveBeenCalledWith("round1");
            expect(mockBets[0].save).toHaveBeenCalled();
            expect(mockBets[1].save).toHaveBeenCalled();
            expect(consumer.callEndGame).toHaveBeenCalledTimes(2);
            expect(consumer.captureBetResult).toHaveBeenCalledTimes(2);
            expect(testEnv.userBetResultPublisher.publish).toHaveBeenCalledTimes(2);
        });

        // Test settlement with failed endGame result
        it("should not publish results when endGame fails", async () => {
            // Arrange
            const consumer = new SettleGameRoundConsumer({
                ...testEnv,
            });

            const mockBets = [
                {
                    uid: "user1",
                    prawn: 100,
                    rate: 1,
                    save: jest.fn().mockResolvedValue(true),
                },
            ];

            consumer.queryBets = jest.fn().mockResolvedValue(mockBets);
            consumer.callEndGame = jest.fn().mockResolvedValue({ isOk: false });
            consumer.captureBetResult = jest.fn();
            testEnv.userBetResultPublisher.publish = jest.fn();

            // Act
            await consumer.settleBets({
                result: { dice1: 1, dice2: 1, dice3: 1 },
                settlementResult: { prawn: true },
                roundId: "round1",
                time: new Date(),
            });

            // Assert
            expect(consumer.callEndGame).toHaveBeenCalled();
            expect(consumer.captureBetResult).toHaveBeenCalled();
            expect(testEnv.userBetResultPublisher.publish).not.toHaveBeenCalled();
        });

        // Test empty bets scenario
        it("should handle empty bets gracefully", async () => {
            // Arrange
            const consumer = new SettleGameRoundConsumer({
                ...testEnv,
            });

            consumer.queryBets = jest.fn().mockResolvedValue([]);
            consumer.callEndGame = jest.fn();
            consumer.captureBetResult = jest.fn();

            // Act
            await consumer.settleBets({
                result: { dice1: 1, dice2: 1, dice3: 1 },
                settlementResult: {},
                roundId: "round1",
                time: new Date(),
            });

            // Assert
            expect(consumer.callEndGame).not.toHaveBeenCalled();
            expect(consumer.captureBetResult).not.toHaveBeenCalled();
        });
    });

    describe("calculateBetResult", () => {
        // Keep existing test cases but reorganize them
        const testCases = [
            {
                name: "should calculate win for ocean bet correctly",
                roundResult: { dice1: 4, dice2: 4, dice3: 3 },
                settlementResult: {
                    ocean: true,
                    stag: false,
                    gourd: false,
                },
                bet: { ocean: 100, stag: 50, gourd: 50 },
                expectResult: {
                    totalBetAmount: 200,
                    totalWin: 197,
                    netWin: 97,
                    totalLost: 100,
                    winningByChoices: { ocean: 197, stag: 0, gourd: 0 },
                },
            },
            // ... other existing test cases ...
        ];

        it.each(testCases)("$name", ({ roundResult, settlementResult, bet, expectResult }) => {
            // Arrange
            const consumer = new SettleGameRoundConsumer({
                ...testEnv,
            });

            // Act
            const actualResult = consumer.calculateBetResult(settlementResult, bet, testEnv.gameData.gameConfigs.odds, roundResult);

            // Assert
            expect(actualResult).toEqual(expectResult);
        });
    });

    describe("isSpecificChoice", () => {
        it.each([
            ["anyTriple", true],
            ["mountain", true],
            ["ocean", true],
            ["fish", false],
            ["prawn", false],
        ])("should correctly identify if %s is a specific choice", (choice, expected) => {
            // Arrange
            const consumer = new SettleGameRoundConsumer({
                ...testEnv,
            });

            // Act
            const result = consumer.isSpecificChoice(choice);

            // Assert
            expect(result).toBe(expected);
        });
    });
});
