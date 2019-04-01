<template>
  <div  class="home">





    <img class="focusimg hide" :src="focusimg" @click="toggleBlurBackground('')"/>

        <div class="row">
      <div id="imagecontainer" class="col-12">
        <img v-bind:style="{top: imgstop[index], left: imgsleft[index], opacity: imgopacity[index]}" class="webimage2" :id="queueimg" v-for="(queueimg, index) in imgqueue" :key="queueimg" :src="queueimg" @click="toggleBlurBackground(queueimg)">
      </div>
    </div>


    <div class="bottomrow row">


      <div class="col-4">
        <router-link class="navbutton" to="/">Variation 1</router-link>
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
      imgopacity: [], //array of opacity of currently displayed Images
      imgflashed: [], //array that checks wether img has shown up before
      focusimg: null,
      alpha: null,
      beta: null,
      gamma: null
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
    moveAll: function(){

      this.$forceUpdate(); //Needed for continuous Moving of images
      var movingDivs = this.imgqueue;
      var arraydifference = this.imgqueue.length - this.imgstop.length;  //used to check wether there are images without style


//Setup for newly downloaded images
      if(arraydifference > 0){
        for(var j=0; j<arraydifference; j++){
          var imgleft = Math.floor(Math.random()*300)+ 1 + "px";
          var imgtop = Math.floor(Math.random()*300)+ 1 + "px";
          var randomnur = Math.random() + 1;
          var iopacity = 0.01;
          var iflashed = 0;
          this.imgsleft.push(imgleft);
          this.imgstop.push(imgtop);
          this.imgrandomnr.push(randomnur);
          this.imgflashed.push(iflashed);
          this.imgopacity.push(iopacity);


        }
      }
      else if(arraydifference < 0){ //If all images get deleted, also reset position arrays
        this.imgsleft = [];
        this.imgstop = [];
        this.imgrandomnr = [];
      }
      for (var i=0; i<movingDivs.length; i++){

        if(this.imgflashed[i] == 0){
          console.log(this.imgopacity[i]);

          this.imgopacity[i] = this.imgopacity[i] + 0.01;
          if(this.imgopacity[i] >= 1){
            this.imgflashed[i] = 1;
          }
          console.log(this.imgflashed[i]);
        }
        if(this.imgflashed[i] == 1){
          this.imgopacity[i] = this.imgopacity[i] - 0.01;
          if(this.imgopacity[i] <= 0){

            this.imgstop[i] = 0; //If below a certain threshold, resets the image positions
            this.imgstop.splice(i,1);
            this.imgsleft.splice(i,1);
            this.imgqueue.splice(i,1);
            this.imgurls.splice(i,1);
            this.imgrandomnr.splice(i,1);
            this.imgopacity.splice(i,1);
            this.imgflashed.splice(i,1);
          }
        }

      }

    },
    queueImages: function(){
      var arraydifference = this.imgurls.length - this.imgqueue.length;
      if(arraydifference > 0){
        for(var i=0; i<this.imgurls.length; i++){
          if(!this.imgqueue.includes(this.imgurls[i])){
            this.imgqueue.push(this.imgurls[i])
            break;
          }
        }
      }else if(arraydifference < 0){ //If all images get deleted, also reset position arrays
        this.imgqueue=[];
      }
    },
    toggleBlurBackground: function(queueimg){

      this.focusimg=queueimg;
      var blurredDivs = document.querySelectorAll(".row");
      var focusDiv = document.querySelector(".focusimg");
      focusDiv.classList.toggle("hide");
      for(var i=0;i<blurredDivs.length;i++){
        blurredDivs[i].classList.toggle("blur");
      }
    }

    },
    mounted: function(){
      setInterval(this.getImages.bind(this),3000);  //binds all images to be downloaded and sets them to be displayed in the viewport
      setInterval(this.queueImages, 1000);
      setInterval(this.moveAll, 20);  //moves all currently displayed images down every tick

      document.body.style.backgroundColor = "black";








    }
  };


  </script>
