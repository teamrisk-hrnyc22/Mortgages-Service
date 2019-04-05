var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var db = require('./db/queryDB.js');
var path = require('path');
var cors = require('cors');

var app = express();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, './dist')));


app.use(cors())

app.get('/price', function(req, res) {
    db.getPriceFromDB(null, function(result) {
        console.log('this is the result from the server', result);
        res.send(result);
    });
});

app.get('/price/:priceId', function(req, res) {
    db.byIdgetPriceFromDB(null, req.params.priceId, function(result){ 
        console.log('this is the result from the server', result);
        res.send(result);
    });
});


var port = process.env.PORT || 3008;

app.listen(port, function() {
    console.log(`Server is listening on port: ${port}`);
});
