const mongoose = require("mongoose")
const Schema = mongoose.Schema

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        maxlength: [50, "this username cannot be more than 50 characters"],
        minlength: [3, "this username must be at least 3 characters length"],
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        min: 4,
        max: 255,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        min: 4,
        max: 1000,
        trim: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

// module.exports = mongoose.model("User", UserSchema)

export default (mongoose.models && mongoose.models.User
    ? mongoose.models.User
    : mongoose.model('User', UserSchema));