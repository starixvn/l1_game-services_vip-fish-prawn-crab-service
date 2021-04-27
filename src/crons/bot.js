import { helpers } from "sc-common";
import { Table } from "sc-game-base";

import constants from "../constants";

export default class Bot extends Table.Crons.TableGameBot {
    constructor(definition, gameData, publisher, userInfosRepository, tempBetsRepository) {
        super(definition, gameData, publisher, userInfosRepository, tempBetsRepository);

        this.betChoiceRatio = { MainOpts: 98, SubOpts: 2 };

        this.mainOpts = ["stag", "gourd", "rooster", "fish", "crab", "prawn", "mountain", "ocean"];
        this.subOpts = ["anyTriple"];

        this.smallTicketRatio = 70;
        this.smallTickets = 0;
        this.resetAllBets();
    }

    async resetAllBotData() {
        await super.resetAllBotData();
        this.resetAllBets();
    }

    resetAllBets() {
        this.allBets = {
            stag: 0,
            gourd: 0,
            rooster: 0,
            fish: 0,
            crab: 0,
            prawn: 0,
            anyTriple: 0,
        };

        this.smallTickets = 0;
    }

    getBetChoice(bot) {
        const totalBotBet = this.getAllBetAmount();

        const betChoiceRatios = [
            {
                group: this.mainOpts,
                underBetRatio: (this.getTotalAmountOnChoiceGroup(this.mainOpts) * 100) / totalBotBet < this.betChoiceRatio.MainOpts,
            },
            {
                group: this.subOpts,
                underBetRatio: (this.getTotalAmountOnChoiceGroup(this.subOpts) * 100) / totalBotBet < this.betChoiceRatio.SubOpts,
            },
        ];

        const underRatioGroups = helpers.arrayHelper.shuffle(betChoiceRatios.filter((data) => data.underBetRatio));

        const choice =
            underRatioGroups.length > 0
                ? this.getRandomChoiceFromGroup(underRatioGroups[0].group)
                : this.getRandomChoiceFromGroup(this.mainOpts);

        const previousUniqueChoices = bot.choices.filter((betChoice) => this.mainOpts.includes(betChoice));

        return previousUniqueChoices.length > 0 ? previousUniqueChoices[0] : choice;
    }

    getMaxBet(bot, choice) {
        const gameConfigs = this.gameData.gameConfigs;
        const minBet = this.getMinBet();
        const maxBetPerChoice = gameConfigs.choices_maxbet[choice];
        const botMaxBet = gameConfigs.bot_maxbet;
        let maxBet = Math.min(maxBetPerChoice, botMaxBet);

        if (this.subOpts.includes(choice)) {
            maxBet = Math.min(botMaxBet * 0.1, maxBetPerChoice);
        }

        if (this.mainOpts.includes(choice)) {
            const isSmallTicket = this.totalTickets === 0 ? true : (this.smallTickets * 100) / this.totalTickets < this.smallTicketRatio;
            const maxBetOfSmallTicket = Math.min(minBet * 50, botMaxBet * 0.1, maxBetPerChoice);
            maxBet = isSmallTicket ? maxBetOfSmallTicket : maxBet;
        }

        return Math.max(maxBet, minBet);
    }

    getRandomChoiceFromGroup(group) {
        const randomIndex = (Math.random() * group.length) >> 0;
        return group[randomIndex];
    }

    getTotalAmountOnChoiceGroup(choices) {
        let total = 0;
        choices.forEach((choice) => (total += this.allBets[choice]));

        return total;
    }

    getTotalAmountOfBotOnChoiceGroup(bot, choices) {
        let total = 0;
        choices.forEach((choice) => (total += bot.betOnChoices[choice]));

        return total;
    }

    getAllBetAmount() {
        let total = 0;
        this.definition.choices.forEach((choice) => (total += this.allBets[choice]));

        return total;
    }

    isSmallTicket(amount) {
        return amount <= this.getMinBet() * 50;
    }

    updateBotInRoomData(bot, choice, amount, balance) {
        super.updateBotInRoomData(bot, choice, amount, balance);

        this.allBets[choice] = this.allBets[choice] ? this.allBets[choice] + amount : amount;
        this.smallTickets += this.isSmallTicket(amount) ? 1 : 0;
    }

    convertAmountToChip(amount) {
        const chipList = constants.chips.filter((chip) => amount % chip === 0);

        return chipList.length > 0 ? chipList[0] : this.getMinBet();
    }
}
