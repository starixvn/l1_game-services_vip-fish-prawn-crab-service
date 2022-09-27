import mongoose from "mongoose";

const bet = {
    uid: { type: String, required: true },
    name: { type: String, required: true },

    stag: { type: Number, default: 0 },
    gourd: { type: Number, default: 0 },
    rooster: { type: Number, default: 0 },
    fish: { type: Number, default: 0 },
    crab: { type: Number, default: 0 },
    prawn: { type: Number, default: 0 },
    anyTriple: { type: Number, default: 0 },
    mountain: { type: Number, default: 0 },
    ocean: { type: Number, default: 0 },

    betwin: { type: Number, default: 0 },
    time: { type: Date },
    odds: { type: Object },

    siteId: { type: String },
    freeBet: { type: Boolean, default: false },

    playerId: { type: Number },
    roundId: { type: Number, default: 0 },
    paid: { type: Boolean, default: false },
};

const bets = mongoose.model(
    "VipFishPrawnCrab_cuoc",
    new mongoose.Schema({
        ...bet,
        currency: { type: String, required: true },
        rate: { type: Number, required: true },
        operatorId: { type: String, required: false },
    })
);
const tmpBets = mongoose.model("VipFishPrawnCrab_tmpcuoc", new mongoose.Schema(bet));

export { bets, tmpBets };
