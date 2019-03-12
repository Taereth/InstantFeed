<template>
  <div class="home">

<input
  type="file"
  id="imageupload"
  name="imageupload"
  accept="image/png, image/jpg"
  ref="fileinput"
  >
<button @click="upload">Upload</button>
<button @click="deleteAll">Delete All Files</button>
<img  :src="cloudimage">

  </div>
</template>

<script>
export default {
  name: "home",
  data: function() {
    return {
      files: null,
      cloudimage: ""
    }
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
      fetch("deletesAll", {
        method: "POST"
      })
      .then(response => {return response.text();})
    }
  }
};
</script>
