const mongoose = require("mongoose")
const Schema = mongoose.Schema

const RateSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    movieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie",
        required: true
    },
    rate: {
        type: Number,
        min: [0.5, "Minimum rate is 0.5"],
        max: [10, "Maximum rate is 10"]
    }
}, {
    timestamps: true
})

export default (mongoose.models && mongoose.models.Rate
    ? mongoose.models.Rate
    : mongoose.model('Rate', RateSchema));