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
const uri = `mongodb://${user}:${pass}@instantcluster-shard-00-00-z05ud.gcp.mongodb.net:27017,instantcluster-shard-00-01-z05ud.gcp.mongodb.net:27017,instantcluster-shard-00-02-z05ud.gcp.mongodb.net:27017/test?ssl=true&replicaSet=InstantCluster-shard-0&authSource=admin&retryWrites=true`;

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

  var filename = new Date().getTime();
  var fileending = req.file.originalname.split('.').pop();
  filename = filename + "." + fileending;

  const blob = bucket.file(filename);
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

app.post("/deletesAll", (req,res,next)=>{


  console.log("deleting");
  deleteFromMongoDB("photos")
  .then(urls=>{
    for(var i=0;i<urls.length;i++){
      console.log(urls[i]);
      bucket.file(urls[i]).delete().then(()=>{
        console.log(urls[i] + " deleted.");
      })
      .catch(err=>{
        console.error("ERROR: " + err);
      })
    }
    console.log(urls);
  })
  .catch(error=>{
    console.log(error);
  })
})

app.get("/getImages", (req,res,next)=>{
  console.log("Called getImages");
  getImages("photos")
  .then(urls=>{
    res.json(urls);
  })
})

//TODO: Sinnvolles Löschsystem
//cleanup();


http.listen(process.env.PORT || 8080, function(){
  console.log(`listening on *: ${http.address().port}`);
});


//Store Object into Mongo DB
function storeIntoMongoDB(object, collectionName) {


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

//Deletes all Objects from mongoDatabase - Can be changed to only delete certain files.

function deleteFromMongoDB(collectionName) {

  var promise1 = new Promise((resolve,reject)=>{

    var photo_urls = [];

    mongodb.MongoClient.connect(uri, { useNewUrlParser: false }, (err, client) => {
      if (err) {
        throw err;
      }

      const db = client.db(nconf.get("mongoDatabase"));
      const collection = db.collection(collectionName);

      //Change Value in find to change files to be deleted

      var cursor = collection.find({});

      function iterateFunc(doc) {
        var jobject = JSON.parse(JSON.stringify(doc, null, 4));
        photo_urls.push(jobject.name);
      }

      function thenFunc() {

        collection.deleteMany({}, (err, result) =>{
          if (err){
            throw err;
          }

          console.log(photo_urls);

          resolve(photo_urls);
          client.close();


        })

      }

      cursor.forEach(iterateFunc, thenFunc);



    })

  })

  return promise1;


}

//Returns an Array with all active Images from the mongoDB

function getImages(collectionName) {

    var promise2 = new Promise((resolve,reject)=>{

      var photo_urls = [];

      mongodb.MongoClient.connect(uri, { useNewUrlParser: false }, (err, client) => {
        if (err) {
          throw err;
        }

        const db = client.db(nconf.get("mongoDatabase"));
        const collection = db.collection(collectionName);


        var cursor = collection.find({});

        function iterateFunc(doc) {
          var jobject = JSON.parse(JSON.stringify(doc, null, 4));
          photo_urls.push(jobject.url);
        }
        function thenFunc() {
          resolve(photo_urls);
          client.close();
        }

        cursor.forEach(iterateFunc, thenFunc);






      })

    })

    return promise2;

}

//Delete all but the 20 newest entries in the mongoDB periodically

function cleanup(){

console.log("in cleanup");

  setInterval(function(){

    console.log("in cleanup interval");

      var promise1 = new Promise((resolve,reject)=>{

        var photo_urls = [];

        mongodb.MongoClient.connect(uri, { useNewUrlParser: false }, (err, client) => {
          if (err) {
            throw err;
          }

          const db = client.db(nconf.get("mongoDatabase"));
          const collection = db.collection("photos");

          var deletethreshold = new Date( Date.now() - 1000 * 60 );



          console.log(new Date());
          console.log(deletethreshold);

          collection.deleteMany({
            "date": { $lt : new Date(deletethreshold).toISOString()}
          })

          resolve();
          client.close();



        })

      })

      return promise1;


  },6000)

}
