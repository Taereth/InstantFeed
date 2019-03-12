let express = require('express');
let app = express();
let http = require('http').Server(app);
let path = require('path');
let fs = require('fs');

const mongodb = require('mongodb');
const nconf = require('nconf');

// Read in keys and secrets. Using nconf use can set secrets via
// environment variables, command-line arguments, or a keys.json file.
nconf.argv().env().file('keys.json');

// Connect to a MongoDB server provisioned over at
// MongoLab.  See the README for more info.

const user = nconf.get('mongoUser');
const pass = nconf.get('mongoPass');
const host = nconf.get('mongoHost');
const port = nconf.get('mongoPort');



var MongoClient = require('mongodb').MongoClient;

var uri = `mongodb://${user}:${pass}@instantcluster-shard-00-00-z05ud.gcp.mongodb.net:27017,instantcluster-shard-00-01-z05ud.gcp.mongodb.net:27017,instantcluster-shard-00-02-z05ud.gcp.mongodb.net:27017/test?ssl=true&replicaSet=InstantCluster-shard-0&authSource=admin&retryWrites=true`;

mongodb.MongoClient.connect(uri, { useNewUrlParser: false }, (err, client) => {
     if (err) {
       throw err;
     }

    const db = client.db(nconf.get("mongoDatabase"));
    const photoscollection = db.collection("Photos");

    let object = {
      name: "test",
      date: "1.1.1111",
      test: "test"
    }

    photoscollection.insertOne(object, (err, result) =>{
      if (err){
        throw err;
      }
      console.log(result);
    })

})


// serve the index.html as starting page
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, "dist", "index.html"))
});

// serve all files in dist
app.use(express.static('dist'));

http.listen(process.env.PORT || 8080, function(){
    console.log(`listening on *: ${http.address().port}`);
});
