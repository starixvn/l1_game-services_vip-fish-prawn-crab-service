import { Core } from "sc-game-base";

export default class AdminSocketRouter extends Core.Routers.BaseAdminSocketRouter {
    async handleMessage(payload) {
        try {
            if (payload.authentication) {
                this.adminAuthenticationConsumer.consume(this.socketClient, payload.authentication.jwt);
            }

            if (payload[this.definition.name] && payload[this.definition.name].get_new && this.verify()) {
                await this.adminMonitorConsumer.consume(this.socketClient);
            }

            if (payload[this.definition.name] && payload[this.definition.name].set_result && this.verify()) {
                const { set_result } = payload[this.definition.name];

                this.gameData.settlementResultFromAdmin = {
                    roundId: set_result.roundId,
                    result: { ...this.gameData.settlementResultFromAdmin?.result, ...set_result.result },
                };
            }
        } catch (err) {
            this.logService.logError(err);
        }
    }
}
