<template>
  <div class="home">





    <img class="focusimg hide" :src="focusimg" @click="toggleBlurBackground('')"/>

        <div class="row">
      <div id="imagecontainer" class="col-12">
        <img v-bind:style="{top: imgstop[index], left: imgsleft[index]}" class="webimage" :id="queueimg" v-for="(queueimg, index) in imgqueue" :key="queueimg" :src="queueimg" @click="toggleBlurBackground(queueimg)">
      </div>
    </div>


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

      if(arraydifference > 0){
        for(var j=0; j<arraydifference; j++){
          var imgleft = Math.floor(Math.random()*300)+ 1 + "px";
          var imgtop = 0+"px";
          var randomnur = Math.random() + 1;
          this.imgsleft.push(imgleft);
          this.imgstop.push(imgtop);
          console.log(randomnur);
          this.imgrandomnr.push(randomnur);


        }
      }
      else if(arraydifference < 0){ //If all images get deleted, also reset position arrays
        this.imgsleft = [];
        this.imgstop = [];
        this.imgrandomnr = [];
      }
      for (var i=0; i<movingDivs.length; i++){
        if(parseInt(this.imgstop[i], 10) < 1000){
          this.imgstop[i] = parseInt(this.imgstop[i], 10) + ((0.5 + this.beta)*this.imgrandomnr[i]) + "px"; //Makes all images move down every tick
          this.imgsleft[i] = parseInt(this.imgsleft[i], 10) + (this.gamma*this.imgrandomnr[i]) + "px"; //Makes all images move left or right based on orientation
        }
        else{
          this.imgstop[i] = 0; //If below a certain threshold, resets the image positions

          this.imgstop.splice(i,1);
          this.imgsleft.splice(i,1);
          this.imgqueue.splice(i,1);
          this.imgurls.splice(i,1);
          this.imgrandomnr.splice(i,1);


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
      ,
      handleOrientation: function(event) {
        console.log("in handleOrientation");
        var x = event.alpha;
        var y = event.beta;  // In degree in the range [-180,180]
        var z = event.gamma; // In degree in the range [-90,90]
        this.alpha=x*3/100;
        this.beta=y*3/100;
        this.gamma=z*3/100;
      }
    },
    mounted: function(){
      setInterval(this.getImages.bind(this),3000);  //binds all images to be downloaded and sets them to be displayed in the viewport
      setInterval(this.queueImages, 1000);
      setInterval(this.moveAll, 20);  //moves all currently displayed images down every tick


      window.addEventListener('deviceorientation', this.handleOrientation.bind(this));

      document.body.style.backgroundColor = "white";





    }
  };


  </script>
