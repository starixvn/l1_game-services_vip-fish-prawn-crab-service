import { getSettlementResult, generateResult } from "../src/helpers/result-helper";

function run(randomMode) {
    const totalRounds = 100_000;

    const streakNumber = 4;
    const longestStreak = 4;
    const stats = {
        streaks: { total: 0, stag: 0, gourd: 0, rooster: 0, fish: 0, crab: 0, prawn: 0, anyTriple: 0, mountain: 0, ocean: 0 },
    };

    const streakCounts = { stag: 0, gourd: 0, rooster: 0, fish: 0, crab: 0, prawn: 0, anyTriple: 0, mountain: 0, ocean: 0 };

    for (let index = 0; index < totalRounds; index++) {
        const result = generateResult(randomMode);
        const settlement = getSettlementResult(result);

        Object.keys(settlement).reduce((_, choice) => {
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
        }, {});
    }

    console.log(`======== Run ${totalRounds} rounds for mode ${randomMode} ========`);
    console.log(stats);
}

const randomModes = [1, 2, 3];
const runNo = 2;

for (let randomMode of randomModes) {
    for (let i = 0; i < runNo; i++) {
        run(randomMode);
    }
}
