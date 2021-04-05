import awilix from "awilix";
import { Table } from "sc-game-base";

import { PlaceBetConsumer, SettleGameRoundConsumer } from "./consumers";
import { Bot, GameCron } from "./crons";
import {  bets, tmpBets } from "./models/vip-fish-prawn-crab-bets";
import rounds from "./models/vip-fish-prawn-crab-rounds";

const { asClass, asValue } = awilix;

export default class VipFishPrawnCrabContainerRegistry extends Table.TableContainerRegistry {
    registerModels() {
        super.registerModels();

        this.container.register({
            roundsRepository: asValue(rounds),
            betsRepository: asValue(bets),
            tempBetsRepository: asValue(tmpBets),
        });
    }

    registerConsumers() {
        super.registerConsumers();

        this.container.register({
            placeBetConsumer: asClass(PlaceBetConsumer).singleton(),
            settleGameRoundConsumer: asClass(SettleGameRoundConsumer).singleton().proxy(),
        });
    }

    registerCrons() {
        super.registerCrons();

        this.container.register({
            bot: asClass(Bot).singleton(),
            gameCron: asClass(GameCron).singleton().proxy(),
        });
    }
}
