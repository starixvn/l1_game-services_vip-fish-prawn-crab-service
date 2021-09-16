import { Core, Table } from "sc-game-base";

import appConfigs from "./app-configs";
import gameSettings from "./game-settings";
import VipFishPrawnCrabContainerRegistry from "./vip-fishprawncrab-container-registry";
import { generateResult, getSettlementResult } from "./helpers/result-helper";

const run = async () => {
    const gameData = new Table.TableGameData(gameSettings.durations.wholeRound);
    const definition = new Table.TableGameDefinition(gameSettings, generateResult, getSettlementResult);
    const container = new VipFishPrawnCrabContainerRegistry().register(appConfigs, definition, gameData);
    const app = new Core.BaseGameApp(container);

    await app.run();
};

run();
