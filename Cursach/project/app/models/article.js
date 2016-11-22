
var mongoose = require('mongoose');

var articleSchema = mongoose.Schema({
        title   : String,
        text     : String
});

module.exports = mongoose.model('Article', articleSchema);
