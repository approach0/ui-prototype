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
    <v-btn color="info" @click.stop="drawer_toggle"><v-icon>search</v-icon></v-btn>
  </v-layout>
</div>
<div style="position: relative; height: 100%">
  <img style="width: 100%; max-height: 700px" src="https://www.iwantwallpaper.co.uk/images/muriva-bluff-embossed-brick-effect-wallpaper-j30309-p711-1303_image.jpg"/>
  <v-container fluid>
    <v-navigation-drawer v-model="drawer" width="800"
     right stateless temporary absolute>
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
    drawer_toggle () {
      this.drawer = !this.drawer;
      var vm = this;
      setTimeout(function () {
        $('.v-overlay').click(function () {
          vm.drawer = !vm.drawer;
        })
      }, 500);
    },
  }
}
/*
  <div id="sidebar-parent" style="position: relative;">
    <vs-sidebar :vs-active.sync="active" vs-parent="#sidebar-parent">
    </vs-sidebar>
  </div>
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
</style>
