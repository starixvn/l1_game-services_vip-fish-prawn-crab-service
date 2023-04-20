import { generateResult, getSettlementResult } from "../result-helper";
import { randomModes } from "../dice-random";
import constants from "../../constants";

describe("Result statistic: 10000 times", () => {
    it.each(Object.keys(randomModes))("statistic should have expected result with mode %d", (mode) => {
        // Arrange
        const totalRounds = 10000;
        const streakNumber = 4;
        const longestStreak = 4;
        const stats = {
            streaks: { total: 0, stag: 0, gourd: 0, rooster: 0, fish: 0, crab: 0, prawn: 0, anyTriple: 0, mountain: 0, ocean: 0 },
        };

        const streakCounts = { stag: 0, gourd: 0, rooster: 0, fish: 0, crab: 0, prawn: 0, anyTriple: 0, mountain: 0, ocean: 0 };

        for (let index = 0; index < totalRounds; index++) {
            const result = generateResult(mode);
            const settlement = getSettlementResult(result);

            Object.keys(settlement).forEach((choice) => {
                stats[choice] = stats[choice] ?? { count: 0, ratio: 0 };
                stats[choice].count += settlement[choice] ? 1 : 0;
                stats[choice].ratio = stats[choice].count / totalRounds;

                if (!settlement[choice]) {
                    streakCounts[choice] = 0;
                    return;
                }

                const count = streakCounts[choice] + 1;
                streakCounts[choice] = count + 1;
                if (count >= streakNumber) {
                    stats.streaks.total++;
                    stats.streaks[choice]++;
                    if (count >= longestStreak) {
                        streakCounts[choice] = 1;
                    }
                }
            });
        }

        //Assert
    console.log(`======== Run ${totalRounds} rounds for mode ${mode} ========`);
    console.log(stats);
        Object.keys(constants.resultMapper).forEach((choice) => {
            expect(stats[choice].ratio).toBeGreaterThanOrEqual(0.4);
        });
    });
});
