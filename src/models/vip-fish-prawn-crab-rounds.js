import mongoose from "mongoose";

const modelName = "VipFishPrawnCrab_phien";

const resultSchema = new mongoose.Schema(
    {
        dice1: { type: Number },
        dice2: { type: Number },
        dice3: { type: Number },
    },
    { _id: false }
);

const settlementResultSchema = new mongoose.Schema(
    {
        stag: { type: Boolean, default: false },
        gourd: { type: Boolean, default: false },
        rooster: { type: Boolean, default: false },
        fish: { type: Boolean, default: false },
        crab: { type: Boolean, default: false },
        prawn: { type: Boolean, default: false },
        anyTriple: { type: Boolean, default: false },
        mountain: { type: Boolean, default: false },
        ocean: { type: Boolean, default: false },
    },
    { _id: false }
);

const Schema = new mongoose.Schema({
    id: { type: Number, required: true },
    result: resultSchema,
    settlementResult: settlementResultSchema,
    time: { type: Date, default: new Date() },
});

export default mongoose.model(modelName, Schema);
