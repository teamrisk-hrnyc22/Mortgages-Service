const faker = require('faker')
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('fakePrices');

db.serialize(function() {
  db.run("CREATE TABLE Prices (price INTEGER)");
  
  var stmt = db.prepare("INSERT INTO Prices VALUES (?)");
  for (var i = 0; i < 100; i++) {
      stmt.run(faker.random.number({
        'min': 634000,
        'max': 1700000
      }));
  }
  stmt.finalize();
 
  db.each("SELECT rowid AS id, price FROM Prices", function(err, row) {
      console.log(row.id + ": " + row.price);
  });
});
 
db.close();
