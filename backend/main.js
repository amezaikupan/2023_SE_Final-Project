var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("Conference_info");
  var query = { Title: "iJS Conference on December 11-14, 2023 in Singapore, Singapore" };
  dbo.collection("Conference").find(query).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    db.close();
  });
});