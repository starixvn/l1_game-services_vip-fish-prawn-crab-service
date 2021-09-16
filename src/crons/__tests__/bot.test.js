import { stub, stubMongooseModelStupidly } from "jest-micro-auto-stub";
import mongoose from "mongoose";
import { Table } from "sc-game-base";
import FishPrawnCrabBot from "../bot";
import gameSettings from "../../game-settings";
import constants from "../../constants";

const definition = new Table.TableGameDefinition(gameSettings);
const gameData = new Table.TableGameData(0);
const publisher = stub(Table.EventPublishers);
/** @type {mongoose.Model}*/
/** @type {mongoose.Model}*/
const tempBetsRepository = stubMongooseModelStupidly(mongoose.Model);
const userInfosRepository = stubMongooseModelStupidly(mongoose.Model);
const fishPrawnCrabBot = new FishPrawnCrabBot(definition, gameData, publisher, userInfosRepository, tempBetsRepository);
const resetTotalBets = { stag: 0, gourd: 0, rooster: 0, fish: 0, crab: 0, prawn: 0, anyTriple: 0, mountain: 0, ocean: 0 };
const bot = {
    id: 1,
    name: "bot1",
    red: 1000,
    type: true,
    choices: [],
    remainTickets: 3,
    totalBet: 0,
    betOnChoices: { ...resetTotalBets },
};
const totalBetTemplate = { stag: 10, gourd: 20, rooster: 30, fish: 40, crab: 50, prawn: 60, anyTriple: 10, mountain: 10, ocean: 20 };

const gameConfigs = {
    choices_maxbet: {
        stag: 5000,
        gourd: 5000,
        rooster: 5000,
        fish: 5000,
        crab: 5000,
        prawn: 5000,
        anyTriple: 500,
        mountain: 5000,
        ocean: 5000,
    },
    minbet: 10,
    bot_maxbet: 500,
};

gameData.gameConfigs = gameConfigs;

describe("FishPrawnCrabBot inherit test", () => {
    it("should inherit BaseBot", () => {
        expect(FishPrawnCrabBot instanceof Table.Crons.TableGameBot);
    });
});

describe("resetAllBotData test", () => {
    it("should call resetAllBets and resetAllBotData", async () => {
        spyOn(Table.Crons.TableGameBot.prototype, "resetAllBotData");
        spyOn(FishPrawnCrabBot.prototype, "resetAllBets");

        await fishPrawnCrabBot.resetAllBotData();

        expect(Table.Crons.TableGameBot.prototype.resetAllBotData).toHaveBeenCalled();
        expect(FishPrawnCrabBot.prototype.resetAllBets).toHaveBeenCalled();
    });
});

describe("resetAllBets test", () => {
    it("should allBets and smallTickets reset to zero", () => {
        fishPrawnCrabBot.smallTickets = 4;
        fishPrawnCrabBot.allBets = { ...totalBetTemplate };

        fishPrawnCrabBot.resetAllBets();

        expect(fishPrawnCrabBot.smallTickets).toBe(0);
        expect(fishPrawnCrabBot.allBets).toEqual({
            stag: 0,
            gourd: 0,
            rooster: 0,
            fish: 0,
            crab: 0,
            prawn: 0,
            anyTriple: 0,
        });
    });
});

describe("getBetChoice test", () => {
    it("should return main options", () => {
        const choice = fishPrawnCrabBot.getBetChoice(bot);

        expect(fishPrawnCrabBot.mainOpts).toContain(choice);
    });
});

describe("getMaxBet test", () => {
    it("should return value between min and max bet config", () => {
        const choice = "gourd";
        const { bot_maxbet, minbet, choices_maxbet } = gameData.gameConfigs;
        const maxBet = Math.min(bot_maxbet, choices_maxbet[choice]);

        const actualResult = fishPrawnCrabBot.getMaxBet({ ...bot, betOnChoices: { ...totalBetTemplate } }, choice);

        expect(actualResult).toBeWithin(minbet, maxBet);
    });
});

describe("getRandomChoiceFromGroup test", () => {
    test.each`
        group                        | groupName
        ${fishPrawnCrabBot.mainOpts} | ${"main"}
        ${fishPrawnCrabBot.subOpts}  | ${"sub"}
    `("should return options of $groupName group", ({ group }) => {
        const choice = fishPrawnCrabBot.getRandomChoiceFromGroup(group);

        expect(group).toContain(choice);
    });
});

describe("getTotalAmountOnChoiceGroup test", () => {
    test.each`
        group                        | groupName | expectResult
        ${fishPrawnCrabBot.mainOpts} | ${"main"} | ${240}
        ${fishPrawnCrabBot.subOpts}  | ${"sub"}  | ${10}
    `("should return total amount of $groupName group", ({ group, expectResult }) => {
        fishPrawnCrabBot.allBets = { ...totalBetTemplate };

        const totalAmountOnGroup = fishPrawnCrabBot.getTotalAmountOnChoiceGroup(group);

        expect(totalAmountOnGroup).toEqual(expectResult);
    });
});

describe("getTotalAmountOfBotOnChoiceGroup test", () => {
    test.each`
        group                        | groupName | expectResult
        ${fishPrawnCrabBot.mainOpts} | ${"main"} | ${240}
        ${fishPrawnCrabBot.subOpts}  | ${"sub"}  | ${10}
    `("should return total amount of $groupName group", ({ group, expectResult }) => {
        const betOnChoices = { ...totalBetTemplate };

        const totalAmountOnGroup = fishPrawnCrabBot.getTotalAmountOfBotOnChoiceGroup({ betOnChoices }, group);

        expect(totalAmountOnGroup).toEqual(expectResult);
    });
});

describe("getAllBetAmount test", () => {
    it("should return total amount bot bets", () => {
        fishPrawnCrabBot.allBets = { ...totalBetTemplate };

        const actualResult = fishPrawnCrabBot.getAllBetAmount();

        expect(actualResult).toEqual(250);
    });
});

describe("isSmallTicket test", () => {
    it("should return true when amount below 50 times minbet", () => {
        const amount = 49;

        const actualResult = fishPrawnCrabBot.isSmallTicket(amount);

        expect(actualResult).toBe(true);
    });
});

describe("getTotalBetAmount test", () => {
    it("should zero when current bet is undefined", () => {
        const actualResult = fishPrawnCrabBot.getTotalBetAmount();

        expect(actualResult).toEqual(0);
    });

    it("should return total bet amount", () => {
        const currentBet = { ...totalBetTemplate };

        const actualResult = fishPrawnCrabBot.getTotalBetAmount(currentBet);

        expect(actualResult).toEqual(250);
    });
});

describe("updateBotInRoomData test", () => {
    it("should call super updateBotInRoomData", async () => {
        spyOn(Table.Crons.TableGameBot.prototype, "updateBotInRoomData");

        await fishPrawnCrabBot.updateBotInRoomData(bot, "gourd", 20, bot.red);

        expect(Table.Crons.TableGameBot.prototype.updateBotInRoomData).toHaveBeenCalled();
    });

    it("should update allBets", async () => {
        const gourdBet = fishPrawnCrabBot.allBets.gourd;
        const betAmount = 20;

        await fishPrawnCrabBot.updateBotInRoomData(bot, "gourd", betAmount, bot.red);

        expect(fishPrawnCrabBot.allBets.gourd).toEqual(gourdBet + betAmount);
    });

    it("should increase small ticket when bet amount is small", async () => {
        const betAmount = 10;
        const smallTickets = fishPrawnCrabBot.smallTickets;

        await fishPrawnCrabBot.updateBotInRoomData(bot, "gourd", betAmount, bot.red);

        expect(fishPrawnCrabBot.smallTickets).toEqual(smallTickets + 1);
    });
});

describe("convertAmountToChip test", () => {
    it("should return amount on chip value list", () => {
        const amount = 55;

        const actualResult = fishPrawnCrabBot.convertAmountToChip(amount);

        expect(constants.chips).toContain(actualResult);
    });
});
