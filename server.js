let express = require('express');
let app = express();
let http = require('http').Server(app);
let path = require('path');
let fs = require('fs');


const mongodb = require('mongodb');
const nconf = require('nconf');
const Multer = require('multer');
const bodyParser = require('body-parser');
const { Storage } = require('@google-cloud/storage');
const format = require('util').format;

require("dotenv").config();

// Read in keys and secrets. Using nconf use can set secrets via
// environment variables, command-line arguments, or a keys.json file.
nconf.argv().env().file('keys.json');

// Connect to a MongoDB server provisioned over at
// MongoLab.  See the README for more info.

const user = nconf.get('mongoUser');
const pass = nconf.get('mongoPass');
const host = nconf.get('mongoHost');
const port = nconf.get('mongoPort');

//Initiate Storage client
const storage = new Storage();
//bucket
const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);



var MongoClient = require('mongodb').MongoClient;

// serve the index.html as starting page
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, "dist", "index.html"))
});

// serve all files in dist
app.use(express.static('dist'));

//Image Upload Handling

//Makes Requests readable for server
app.use(bodyParser.json());
const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // no larger than 10mb
  },
});

//Server Listener

app.post("/uploads", multer.single("file"),(req,res,next)=>{
  console.log("uploading");
  if(!req.file) {
    console.log("No File Detected");
    res.status(400).send("No File Uploaded");
    return;
  }

  const blob = bucket.file(req.file.originalname);
  const blobStream = blob.createWriteStream({
    resumable: false,
  })

  blobStream.on("error", err=>{
    console.log(err),
    next(err)
  });

  blobStream.on("finish", () =>{
    const publicURL = format(`https://storage.googleapis.com/${bucket.name}/${blob.name}`);
    res.status(200).send(publicURL);
    var objectToBeStored = {
      name: blob.name,
      date: new Date(),
      url: publicURL
    }
    storeIntoMongoDB(objectToBeStored,"photos");
  })

  blobStream.end(req.file.buffer);

})



http.listen(process.env.PORT || 8080, function(){
  console.log(`listening on *: ${http.address().port}`);
});



function storeIntoMongoDB(object, collectionName) {

  var uri = `mongodb://${user}:${pass}@instantcluster-shard-00-00-z05ud.gcp.mongodb.net:27017,instantcluster-shard-00-01-z05ud.gcp.mongodb.net:27017,instantcluster-shard-00-02-z05ud.gcp.mongodb.net:27017/test?ssl=true&replicaSet=InstantCluster-shard-0&authSource=admin&retryWrites=true`;

  mongodb.MongoClient.connect(uri, { useNewUrlParser: false }, (err, client) => {
    if (err) {
      throw err;
    }

    const db = client.db(nconf.get("mongoDatabase"));
    const collection = db.collection(collectionName);

    collection.insertOne(object, (err, result) =>{
      if (err){
        throw err;
      }
      client.close();

    })

  })

}
