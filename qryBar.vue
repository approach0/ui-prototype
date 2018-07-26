<template>
<v-app>
<div style="padding: 1em 1em 0em 1em;">
  <v-layout>
    <v-toolbar-side-icon @click="test('menu')"></v-toolbar-side-icon>
    <v-text-field placeholder="Search"
      solo
      autofocus
      append-icon="functions"
      @click:append="test('math pad')"
      clearable>
    </v-text-field>
    <v-btn color="info" @click.stop="drawer_set(true)"><v-icon>search</v-icon></v-btn>
  </v-layout>
</div>
<div style="position: relative; height: 100%">
  <img style="width: 100%; max-height: 700px" src="https://www.iwantwallpaper.co.uk/images/muriva-bluff-embossed-brick-effect-wallpaper-j30309-p711-1303_image.jpg"/>
  <v-container fluid>

    <v-navigation-drawer v-model="drawer" width="800"
     right stateless temporary absolute>
<div class="tab" @click="drawer_set(!drawer)" style="left: -25px">
<v-icon v-if="!drawer">navigate_before</v-icon>
<v-icon v-else>navigate_next</v-icon>
</div>
    <div style="height: 100%; overflow: auto;">
      <v-container>
      <ul>
        <li v-for="hit in hits">
        <p class="sni-title"> {{hit.title}}</p>
        <p class="sni-url">{{hit.url}}     </p>
        <p class="snippet">{{hit.snippet}} </p>
        </li>
      </ul>
      <v-layout justify-center>
        <v-pagination v-model="page" :length="20" :total-visible="7"></v-pagination>
      </v-layout>
      </v-container>
    </div>
    </v-navigation-drawer>

  </v-container>
</div>
</v-app>
</div>
</template>
<script>
const mockup_hits = require("./mockup-hits.json")
var $ = require('jquery')

export default {
  data: function () {
    return {
      'page': 2,
      'drawer': false,
      'hits': mockup_hits.hits
    }
  },
  created: function () {
    console.log('created!');
    $(document).ready(function() {
    });
  },
  methods: {
    test: function (str) {
      console.log('test' + str);
    },
    drawer_set(state) {
      this.drawer = state;
      var vm = this;
      setTimeout(function () {
        $('.v-overlay').unbind('click');
        $('.v-overlay').click(function () {
          vm.drawer = false;
        })
      }, 500);
    },
  }
}
/*
*/
</script>

<style>
.sni-title {
  font-size: 1.2em;
  color: blue;
}
.sni-url {
  color: green;
}

.v-navigation-drawer {
  overflow-x: visible !important;
  overflow-y: visible !important;
}
div.tab {
  position: absolute;
  top: 50px;
  width: 25px;
  height: 50px;
  background-color: white;
  padding-top: 12px;
  cursor: pointer;
}
</style>
