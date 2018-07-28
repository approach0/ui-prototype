<template>
<v-app light>

<div style="padding: 1em 1em 0em 1em;">
  <v-layout>
    <v-toolbar-side-icon @click="menu = !menu; drawer_set(false)"></v-toolbar-side-icon>
    <v-text-field placeholder="Search"
      solo
      autofocus
      append-icon="functions"
      v-model="editor_latex"
      @click:append="test('math pad')"
      clearable>
    </v-text-field>
    <v-btn color="info" @click.stop="drawer_set(true)"><v-icon>search</v-icon></v-btn>
  </v-layout>
</div>

<div style="position: relative; height: 100%">
    <div style="position: absolute; left: 50%; top: 50%; z-index: 99;">
    <div v-if="recognizing">
      <v-progress-circular indeterminate color="green">
      </v-progress-circular>
    </div>
    </div>

    <v-container fluid fill-height>
      <v-layout justify-center align-start fill-height>
        <div class="editor" ref="editor"
		 v-bind:style="{background: paper_color}"
         v-touch:tap="on_stroke"
         v-touch:swipe="on_stroke">
        </div>
      </v-layout>
    </v-container>

    <v-navigation-drawer v-model="menu" temporary absolute>
      <v-toolbar flat>
        <v-list><v-list-tile>
        <v-list-title class="title"> Settings </v-list-title>
        </v-list-tile></v-list>
      </v-toolbar>

      <v-divider></v-divider>

      <v-list dense class="pt-0">

        <v-list-tile @click="">
          <v-list-tile-action>
            <v-icon> star </v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-title> Star deck </v-list-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile @click="">
          <v-list-tile-action>
            <v-icon> help </v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-title> Guide </v-list-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile @click="">
          <v-list-tile-action>
            <v-icon> gavel </v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-title> Raw query </v-list-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile @click="">
          <v-list-tile-action>
            <v-icon> apps </v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-title> Common LaTeX symbols </v-list-title>
          </v-list-tile-content>
        </v-list-tile>

      </v-list>
    </v-navigation-drawer>

    <v-navigation-drawer v-model="drawer" width="800"
     right stateless temporary absolute>
     <!-- tab BEGIN -->
     <div class="tab" v-bind:class="{'tab-out':!drawer, 'tab-in':drawer}"
         @click="drawer_set(!drawer)">
       <v-icon v-if="!drawer">navigate_before</v-icon>
       <v-icon v-else>navigate_next</v-icon>
     </div>
     <!-- tab END -->
    <div style="height: 100%; overflow-y: auto;">
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

  </div>
</div>

<v-footer>
  <v-layout justify-center>
    <v-flex primary py-2 text-xs-center white--text xs12>
      &copy; {{ new Date().getFullYear() }} — <strong>Approach0</strong>
    </v-flex>
  </v-layout>
</v-footer>

</v-app>
</template>
<script>
const mockup_hits = require("./mockup-hits.json")
const colors = require('vuetify/es5/util/colors')
var MyScript = require('myscript/dist/myscript.min.js')
var $ = require('jquery')

export default {
  data: function () {
    return {
      'page': 2,
      'drawer': false,
      'menu': false,
      'editor_latex': '',
      'recognizing': false,
	  'paper_color': colors['default'].grey.lighten3,
      'hits': mockup_hits.hits
    }
  },
  created: function () {
    console.log('created!');
  },
  mounted: function () {
    console.log("mounted!");

    var vm = this;
    $(this.$refs['editor']).on("exported", function (evt) {
      console.log(evt.detail.exports)
      vm.editor_latex = evt.detail.exports['application/x-latex'];
      vm.recognizing = false;
    });

    $(window).resize(function () {
      var editorEle = vm.$refs['editor'];
      editorEle.editor.resize();
    });

    MyScript.register(this.$refs.editor, {
      recognitionParams: {
        type: 'MATH',
        protocol: 'WEBSOCKET',
        apiVersion: 'V4',
          server: {
            scheme: 'https',
            // ---  web demo keys ---
            //host: 'webdemoapi.myscript.com',
            //applicationKey: '515131ab-35fa-411c-bb4d-3917e00faf60',
            //hmacKey: '54b2ca8a-6752-469d-87dd-553bb450e9ad'
            // ---  cloud account keys ---
            host: 'cloud.myscript.com',
            applicationKey: '37596f3c-760b-4f58-92c8-c59826f4144b',
            hmacKey: '765e7703-1f29-4dfa-82af-201f8522abba'
          },
          v4: {
            math: {
              mimeTypes: ['application/x-latex']
            }
          }
        }
    });

  },
  methods: {
    test: function (str) {
      console.log('test');
      console.log(str)
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
    on_stroke() {
      console.log('on stroke');
      this.recognizing = true;
    }
  }
}
/*
  <v-jumbotron :gradient="'to top right, rgba(63,81,181, .7), rgba(25,32,72, .7)'" dark
    src="./background.jpg" height="100%">
    <v-container fill-height>
      <v-layout align-center>
        <v-flex text-xs-center>
          <h3 class="display-3">Hello World!</h3>
          <v-progress-circular indeterminate color="green">
          </v-progress-circular>
        </v-flex>
      </v-layout>
    </v-container>
  </v-jumbotron>
  border: 2px solid #333;
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
  padding-top: 12px;
  background-color: white;
  -webkit-box-shadow: 0px 2px 1px 2px rgba(0,0,0,0.2);  /* Safari 3-4, iOS 4.0.2 - 4.2, Android 2.3+ */
  -moz-box-shadow:    0px 2px 1px 2px rgba(0,0,0,0.2);  /* Firefox 3.5 - 3.6 */
  box-shadow:         0px 2px 1px 2px rgba(0,0,0,0.2);  /* Opera 10.5, IE 9, Firefox 4+, Chrome 6+, iOS 5 */
}
div.tab-out {
  left: -25px;
}
div.tab-in {
  left: 0px;
}

div.editor {
  height: 100%;
  width: 100%;
  margin-left: 30px;
  margin-right: 30px;
  touch-action: none;
}
.ms-editor {
  z-index: 0 !important;
}

</style>
