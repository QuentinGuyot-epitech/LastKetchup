const mongoose = require("mongoose")
const Schema = mongoose.Schema


const MovieSchema = new Schema({

    backdrop_path:{
        type:String,
        required:true
    },
    api_id:{
        type:String,
        required:true
    },
    original_language:{
        type:String,
        required:true
    },
    overview:{
        type:String,
        required:true
    },
    poster_path:{
        type:String,
        required:true
    },
    release_date:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    vote_average:{
        type:Number,
        required:true
    },

    vote_count:{
        type:Number,
        required:true
    },

    genre_ids:[
        {
           id:{type:Number,required:true},
           name:{type:String,required:true}

        }
    ]
},{
    timestamps: true
})

export default (mongoose.models && mongoose.models.Movie
    ? mongoose.models.Movie
    : mongoose.model('Movie', MovieSchema));

