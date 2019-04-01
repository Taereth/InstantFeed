<template>
  <div class="home">

    <p>{{shakeCounter}}</p>





    <img class="focusimg" :src="focusimg"/>



    <div class="bottomrow row">


      <div class="col-4">
        <router-link class="navbutton" to="/var1">Variation 2</router-link>
      </div>
      <div class="input-wrapper col-4">
        <img class="input-img" src="./camera.png" alt="nothing"/>
        <input
        type="file"
        id="imageupload"
        name="imageupload"
        accept="image/png, image/jpg"
        ref="fileinput"
        capture = "user"
        @change="upload"
        >
      </div>
      <div class="col-4">
        <router-link class="navbutton" to="/var2">Variation 3</router-link>
      </div>
    </div>




  </div>
</template>

<script>
export default {
  name: "home",
  data: function() {
    return {
      files: null,  //uploaded file
      photo: null,  //displayed photo
      imgurls: [], //array of urls of all images
      imgstop: [], //array of top position of currently displayed images
      imgsleft: [], //array of left position of currently displayed images
      imgqueue: [], //array of queued images on startup
      imgrandomnr: [],
      focusimg: null,
      alpha: null,
      beta: null,
      gamma: null,
      shakeCounter: 0
    }
  },
  components: {
  },
  methods: {
    upload: function(){

      let data = new FormData();
      data.append("file", this.$refs.fileinput.files[0]);
      fetch("/uploads", {
        method: "POST",
        body: data
      })
      this.$refs.fileinput.value ="";
    },
    deleteAll: function(){
      fetch("/deletesAll", {
        method: "POST"
      })
      .then(response => {return response.text();})
    },
    getImages: function(){

      fetch("/getImages", {
        method: "GET"
      })
      .then(response=>{
        return response.json();
      })
      .then(myJson=> {
        var tempURLArray = [];
        for(var i=0;i<myJson.length;i++){
          var tempurl = myJson[i];
          tempURLArray.push(tempurl);
        }
        this.imgurls = tempURLArray;

      });
    },
      handleShake: function () {

      this.shakeCounter++;

      var randPicture = this.imgurls[Math.floor(Math.random() * this.imgurls.length)];

      this.focusimg = randPicture;
    }
    },
    mounted: function(){

      var Shake = require('shake.js');


      setInterval(this.getImages.bind(this),1000);

      let myShakeEvent = new Shake({
      threshold: 8, // optional shake strength threshold
      timeout: 500 // optional, determines the frequency of event generation
    });

    myShakeEvent.start();

    window.addEventListener('shake', this.handleShake.bind(this), false);

    document.body.style.backgroundColor = "white";
    document.body.style.backgroundImage = "";





    }
  };


  </script>
