export default {
    id: 26,
    name: "VipFishPrawnCrab",
    durations: {
        wholeRound: 42,
        placingBets: 30,
        lockingBet: 5,
        shakeThePlateDuration: 3,
    },
    choices: ["stag", "gourd", "rooster", "fish", "crab", "prawn", "anyTriple", "mountain", "ocean"],
    choicesMapper: { stag: 1, gourd: 2, rooster: 3, fish: 4, crab: 5, prawn: 6, anyTriple: 7, mountain: 8, ocean: 9 },
    hedgeBetGroups: [["mountain", "ocean"]],
};
