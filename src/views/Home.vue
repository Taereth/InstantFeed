<template>
  <div class="home">

    <div class="row">
      <input
        type="file"
        id="imageupload"
        name="imageupload"
        accept="image/png, image/jpg"
        ref="fileinput"
        capture = "user"
        class="col-4"
        >
      <button class="col-4" @click="upload">Upload</button>
      <button class="col-4" @click="deleteAll">Delete All Files</button>
    </div>

<div class="row">
  <div id="imagecontainer" class="col-12">
    <img v-bind:style="{top: imgstop[index], left: imgsleft[index]}" class="webimage" :id="imgurl" v-for="(imgurl, index) in imgurls" :key="imgurl" :src="imgurl">
  </div>
</div>




  </div>
</template>

<script>
export default {
  name: "home",
  data: function() {
    return {
      files: null,
      photo: null,
      imgurls: [],
      imgstop: [],
      imgsleft: []
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
      console.log("In function.");
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
        console.log(this.imgurls);
      });
    },
    moveAll: function(){
      this.$forceUpdate(); //Needed for continuous Moving of images
      var movingDivs = this.imgurls;
      var arraydifference = this.imgurls.length - this.imgstop.length;
      console.log(arraydifference + " ARRAYDIFFERENCE");
      console.log(this.imgstop + "IMGSTOP");
      if(arraydifference > 0){
        for(var j=0; j<arraydifference; j++){
          var imgleft = Math.floor(Math.random()*300)+ 1 + "px";
          var imgtop = 0+"px";
          this.imgsleft.push(imgleft);
          this.imgstop.push(imgtop);
        }
      }
      else if(arraydifference < 0){
        this.imgsleft = [];
        this.imgstop = [];
      }
      for (var i=0; i<movingDivs.length; i++){
        if(parseInt(this.imgstop[i], 10) < 1000){
          this.imgstop[i] = parseInt(this.imgstop[i], 10) + 1 + "px";
        }
        else{
          this.imgstop[i] = 0;
        }




      }

    }
  },
  mounted: function(){
    setInterval(this.getImages.bind(this),3000);
    setInterval(this.moveAll, 20);
  }
};


</script>
