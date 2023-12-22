var MongoClient = require('mongodb').MongoClient;

async function main(){

  var url = "mongodb://localhost:27017/";
  const client = MongoClient.connect(url);

  try{
    (await client).connect();
    console.log("hihi")
    await list(client)

  }catch(e){
    console.error(e);
  }finally{
    (await client).close();
  }
}

main().catch(console.error);

async function list (client){
  const list = await client.db().admin().listDatabases();

  list.databases.forEach(db =>{
    console.log ('-${db.name}');
  })

}


// MongoClient.connect(url, function (err, db) 
// {
//   if (err) throw err;

//   var dbo = db.db("Conference_info");
//   var query = {};

//   dbo.collection("Conference").find(query).toArray(function (err, result) 
//   {
//     if (err) throw err;
//     console.log(result);
//     db.close();
//   });
// });
