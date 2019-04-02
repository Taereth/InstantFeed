<template>
  <div id="app">
    <div id="nav">
    </div>
    <router-view />
  </div>
</template>

<style lang="scss">
* {
  box-sizing: border-box;
}
.col-1 {width: 8.33%;}
.col-2 {width: 16.66%;}
.col-3 {width: 25%;}
.col-4 {width: 33.33%;}
.col-5 {width: 41.66%;}
.col-6 {width: 50%;}
.col-7 {width: 58.33%;}
.col-8 {width: 66.66%;}
.col-9 {width: 75%;}
.col-10 {width: 83.33%;}
.col-11 {width: 91.66%;}
.col-12 {width: 100%;}
[class*="col-"] {
  float: left;
}
.row::after {
  content: "";
  clear: both;
  display: table;
}
.webimage {
  width: 45%;
  height: auto;
  position: absolute;
  border-radius: 5% 50%;
  border-style: solid;
  border-width: 2%;
  border-color: #88D840;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);

}

.body{
  overflow: hidden;
  max-width: 100%;
  max-height: 100%;
}

.webimage2 {
  width: 15%;
  height: auto;
  position: absolute;
  border-radius: 50%;
  border-style: solid;
  border-width: 1%;
  border-color: #DBF3FA;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);

}

.blur {
  filter: blur(8px);
  -webkit-filter: blur(8px);

}

.focusimg {
  position: absolute;
  z-index: 99999;
  float: left;
  max-width:100%;
  max-height:100%;
  top:0; left:0; right:0; bottom:0;
  margin:auto;
  filter: none;
  -webkit-filter: none;
  border-radius: 15%;
  border-style: solid;
  border-width: 2px;
  border-color: black;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.focusimgRand {
  position: absolute;
  z-index: 99999;
  float: left;
  max-width:100%;
  max-height:100%;
  top:0; left:0; right:0; bottom:0;
  margin:auto;
  filter: none;
  -webkit-filter: none;
  border-radius: 15%;
}

.bottomrow {
  float: left;
  z-index: 100000;
  position: fixed;
  bottom: 0;
  left: 0;
  background-color: black;
}

.hide {
  display:none;
}

.input-wrapper {
  position: relative;
  overflow: hidden;
  display: inline-block;

}

.input-img {
  width: 100%;
  height: auto;
  background-color: #ed3330;
  border-radius: 15%;
  }

.input-wrapper input{
  position: absolute;
  font-size: 100px;
  height: 500px;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0 ;
  opacity: 0;
  width: 100%;

}

.navbutton {
color: black !important;
text-transform: uppercase;
background: #ed3330;
padding: 20px;
border-radius: 5px;
display: inline-block;
border: none;
text-decoration: none;
}

.background{
  background-image: url('../src/assets/starfield.jpg');
}


#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
