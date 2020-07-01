const mongoose = require("mongoose");

const { Schema } = mongoose;

const scoreAndCommentSchema = new Schema({
  id: String,
  user: String,
  socre: Number,
  comment: String
});

const ScoreAndComment = mongoose.model(
  "ScoreAndComment",
  scoreAndCommentSchema
);

console.log("se creo modelo ScoreAndComment");
module.exports = ScoreAndComment;
