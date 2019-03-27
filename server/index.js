var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var db = require('../db/pricesDB');

var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.get('/',function(req,res){
  res.send('server created');
})

app.get('/price',function(req,res){

  db.getPriceFromDB(null, function(result){
    console.log('this is the result from the server',result)
    res.json(result);
  });
})

app.get('/price/:priceId',function(req,res){

  db.byIdgetPriceFromDB(null, req.params.priceId, function(result){
    console.log('this is the result from the server',result)
    res.json(result);
  });
})


app.listen(3000, console.log('server started on port 3000'));
