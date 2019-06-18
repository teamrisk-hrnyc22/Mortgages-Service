var mongoose = require('mongoose');
var url = 'mongodb://localhost:27017/mortgages';

var mortgagesSchema = new mongoose.Schema({
    id: {type: Number, index: true},
    price: {type: Number}
});

mongoose.connect(url, {useNewUrlParser: false});

module.exports.Mortgages = mongoose.model('Mortgage', mortgagesSchema);


