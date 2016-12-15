
var mongoose = require('mongoose');

var ideaSchema = mongoose.Schema({
        title   : String,
        text     : String,

        picture : { data: Buffer, contentType: String },

        comments: [{
                comment: String
        }]
});

module.exports = mongoose.model('Idea', ideaSchema);
