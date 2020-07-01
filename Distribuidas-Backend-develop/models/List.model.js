var mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-paginate')


var ListSchema = new mongoose.Schema({
    owner: String,
    name: String,
    public: String,
    contentList: [String]
})

ListSchema.plugin(mongoosePaginate)
const List = mongoose.model('List', ListSchema)

console.log("se creo modelo List");

module.exports = List;