import BaseAdminSocketRouter from "sc-game-base/src/core/routers/base-admin-socket-router";

export default class AdminSocketRouter extends BaseAdminSocketRouter {
    async handleMessage(payload) {
        try {
            await super.handleMessage(payload);

            if (payload[this.definition.name] && payload[this.definition.name].set_result && this.verify()) {
                const { set_result } = payload[this.definition.name];
                this.gameData.settlementResultFromAdmin = {
                    roundId: set_result.roundId,
                    result: { ...this.gameData.settlementResultFromAdmin?.result, ...set_result.result },
                };
            }
        } catch (err) {
            logger.logError(err);
        }
    }
}
