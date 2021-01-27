const mongoose = require("mongoose")
const Schema = mongoose.Schema

const CommentSchema = new Schema ({

    userId:{
        type:String,
        required: true 
    },
    movieId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Movie",
        required: true 

    },
    comment:{
        type:String,
        minlength:[10,"The comment must be at least 10 characters length"],
        maxlength:[1000,"The comment must be less than 1000 charaters length"]
    }

},{
    timestamps:true
})

export default (mongoose.models && mongoose.models.Comment
    ? mongoose.models.Comment
    : mongoose.model('Comment', CommentSchema));