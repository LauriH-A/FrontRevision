const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const ScoreAndCommentDB = require('./ScoreAndComment.model');

const { Schema } = mongoose;

var ContentSchema = new Schema({
    id: String,
    media_type: String,
    title: String,
    original_title: String,
    release_date: String,
    poster_path: String,
    backdrop_path: String,
    overview: String,
    genre_ids: [Number],
    original_language: String,
    popularity: Number,
    vote_average: String,
    origin_country: String,
    score_average: Number,
    ScoreAndComment: [ScoreAndCommentDB.schema]
});


ContentSchema.plugin(mongoosePaginate);
const Content = mongoose.model('Content', ContentSchema);

console.log("se creo modelo Content");

module.exports = Content;