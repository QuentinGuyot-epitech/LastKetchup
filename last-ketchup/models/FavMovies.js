const mongoose = require("mongoose")
const Schema = mongoose.Schema

const FavMoviesSchema = new Schema({
    userId: {
        type: String, //user_id from auth0 == sub
        required: true,
    },
    moviesId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie",
    }],
}, {
    timestamps: true
})

export default (mongoose.models && mongoose.models.FavMovies
    ? mongoose.models.FavMovies
    : mongoose.model('FavMovies', FavMoviesSchema));