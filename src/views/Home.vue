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
  <div class="col-12">
    <img class="webimage" v-for="imgurl in imgurls" :key="imgurl" :src="imgurl">
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
      imgurls: []
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
    }
  },
  mounted: function(){
    setInterval(this.getImages.bind(this),3000);
  }
};

</script>
