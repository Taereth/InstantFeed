<template>
  <div class="home">

<input
  type="file"
  id="imageupload"
  name="imageupload"
  accept="image/png, image/jpg"
  ref="fileinput"
  capture = "user"
  >
<button @click="upload">Upload</button>
<button @click="deleteAll">Delete All Files</button>
<button @click="getImages">Log All Image Names</button>
<img  :src="cloudimage">

  </div>
</template>

<script>
export default {
  name: "home",
  data: function() {
    return {
      files: null,
      cloudimage: "",
      photo: null
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
      .then(response => {return response.text();})
      .then(mytext => {
        this.cloudimage = mytext;
      })
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
      .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    console.log(JSON.stringify(myJson));
  });
    }
  }
};
/*
function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
}
*/
</script>
