<template>
<v-app light>
<div style="padding: 1em 1em 0em 1em;">
  <v-layout row align-center>
  <div id="menu">
    <v-toolbar-side-icon @click="menu = !menu; drawer_set(false)">
    </v-toolbar-side-icon>
  </div>
    <v-layout wrap align-center>
      <v-flex style="padding-left: 12px; flex: 10;">
        <div style="padding-top: 6px;">
          <div id="qry_bar"></div>
        </div>
      </v-flex>
      <v-flex style="padding-left: 12px; flex: 1;">
        <v-btn block color="info" @click.stop="search()">
          <v-icon>search</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
  </v-layout>
</div>

<div style="position: relative; height: 100%">

  <div style="position: absolute; left: 50%; top: 50%; z-index: 1;">
    <div v-if="recognizing">
      <v-progress-circular indeterminate color="green">
      </v-progress-circular>
    </div>
  </div>

  <v-container id="editor-control-layer" fluid fill-height>
    <v-layout id="editor-control" justify-center align-end fill-height>
      <v-btn fab small color="primary" @click.stop="edit_clear" :disabled="!canClear">
        <v-icon dark>delete</v-icon>
      </v-btn>
      <v-btn fab small color="primary" @click.stop="edit_undo" :disabled="!canUndo">
        <v-icon dark>undo</v-icon>
      </v-btn>
      <v-btn fab small color="primary" @click.stop="edit_redo" :disabled="!canRedo">
        <v-icon dark>redo</v-icon>
      </v-btn>
      <v-btn fab small color="primary" @click.stop="edit_convert" :disabled="!canClear">
        <v-icon dark>spellcheck</v-icon>
      </v-btn>
    </v-layout>
  </v-container>

  <v-container fluid fill-height>
    <v-layout justify-center align-start fill-height>
      <div class="editor" ref="editor" touch-action="none"
       v-bind:style="{background: paper_color}">
      </div>
    </v-layout>
  </v-container>

  <v-navigation-drawer v-model="menu" temporary absolute>
    <div style="height: 100%; overflow: auto;">
    <v-divider></v-divider>
    <v-list>
      <v-list-tile>
      <v-list-tile-title class="title">Menu </v-list-tile-title>
      </v-list-tile>

      <v-list-tile @click="">
        <v-list-tile-action>
          <v-icon> help </v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>User Guide</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>

      <v-list-tile @click="">
        <v-list-tile-action>
          <v-icon> functions </v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title> LaTeX symbols </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>

    <v-divider></v-divider>
    <v-list>
      <v-list-tile>
      <v-list-tile-title class="title">Math Deck </v-list-tile-title>
      </v-list-tile>
    </v-list>

    <v-list dense class="pt-0">
      <v-list-tile v-for="d in deck" @click="">
        <v-list-tile-action>
          <v-icon> {{d.type}} </v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-chip close> {{d.tex}} </v-chip>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
    </div>
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
  <div style="height: 100%; overflow-y: auto; word-break: break-all;">
    <v-container>
    <ul style="list-style-type: none;">
      <li v-for="hit in hits">
      <p class="sni-title"> {{hit.title}}</p>
      <p class="sni-url">{{hit.url}}     </p>
      <p class="snippet">{{hit.snippet}} </p>
      </li>
    </ul>
    <v-layout justify-center>
      <v-pagination v-model="page" :length="23" :total-visible="7">
      </v-pagination>
    </v-layout>
    </v-container>
  </div>
  </v-navigation-drawer>

  <div id="speed-dial">
    <v-speed-dial right bottom
     v-model="dialer" direction="top" open-on-hover>
      <v-btn fab slot="activator" v-model="dialer">
        <v-icon color="primary">input</v-icon>
        <v-icon color="primary">close</v-icon>
      </v-btn>
      <v-btn fab small>
        <v-icon color="green">keyboard</v-icon>
      </v-btn>
      <v-btn fab small>
        <v-icon color="grey">edit</v-icon>
      </v-btn>
      <v-btn fab small>
        <v-icon color="red">add_a_photo</v-icon>
      </v-btn>
    </v-speed-dial>
  </div>

</div>

<v-footer>
  <v-layout justify-center>
    <v-flex primary py-2 text-xs-center white--text xs12>
      &copy; {{ new Date().getFullYear() }} — <strong>MathSeer</strong> (prototype)
    </v-flex>
  </v-layout>
</v-footer>

</v-app>
</template>

<script>
const mockup_hits = require("./mockup-hits.json")
const mockup_deck = require("./mockup-deck.json")
const colors = require('vuetify/es5/util/colors')
import eventBus from './event-bus';

var MyScript = require('myscript/dist/myscript.min.js')
var $ = require('jquery')

export default {
  data: function () {
    return {
      'page': 1,
      'drawer': false,
      'menu': false,
      'editor_latex': '',
      'recognizing': false,
      'paper_color': colors['default'].grey.lighten3,
      'canUndo': false,
      'canRedo': false,
      'canClear': false,
      'dialer': false,
      'deck': mockup_deck.deck,
      'hits': mockup_hits.hits
    }
  },
  watch: {
    'editor_latex': function (val) {
      eventBus.$emit('update_edit_latex', val);
    }
  },
  mounted: function () {
    var vm = this;
    var editorEle = vm.$refs['editor'];

    (function () {
      var start_draw = false;
      $(editorEle).on("pointerdown", function(event) {
        start_draw = true;
      });
      $(editorEle).on("pointerout", function(event) {
        if (start_draw) {
          // console.log('finish_draw (pointer-out)');
          start_draw = false;
          vm.recognizing = true;
        }
      });
      $(editorEle).on("pointerup", function(event) {
        if (start_draw) {
          // console.log('finish_draw (pointer-up)');
          start_draw = false;
          vm.recognizing = true;
        }
      });
    })();

    eventBus.$on('update_canvas_pos', () => {
      console.log('resize canvas...');
      editorEle.editor.resize();
    });

    eventBus.$on('do_search', () => {
      vm.drawer_set(true);
    });

    $(this.$refs['editor']).on("changed", function (evt) {
      vm.canUndo = evt.detail.canUndo;
      vm.canRedo = evt.detail.canRedo;
      vm.recognizing = false;
    });

    $(this.$refs['editor']).on("exported", function (evt) {
      const exports = evt.detail.exports;
      if (exports && exports['application/x-latex']) {
        vm.editor_latex = exports['application/x-latex'];
        vm.recognizing = false;
        vm.canClear = true;
      }
    });

    $(window).resize(function () {
      editorEle.editor.resize();
    });

    MyScript.register(this.$refs.editor, {
      triggers: {
        exportContent: 'QUIET_PERIOD'
      },
      recognitionParams: {
        type: 'MATH',
        protocol: 'WEBSOCKET',
        apiVersion: 'V4',
          server: {
            scheme: 'https',
            // ---  web demo keys ---
            // host: 'webdemoapi.myscript.com',
            // applicationKey: '515131ab-35fa-411c-bb4d-3917e00faf60',
            // hmacKey: '54b2ca8a-6752-469d-87dd-553bb450e9ad'
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
    search: function () {
      this.drawer = true;
      eventBus.$emit('do_search');
    },
    drawer_set: function (state) {
      this.drawer = state;
      var vm = this;
      setTimeout(function () {
        $('.v-overlay').unbind('click');
        $('.v-overlay').click(function () {
          vm.drawer = false;
        })
      }, 500);
    },
    edit_clear: function () {
      var editorEle = this.$refs['editor']
      editorEle.editor.clear();
      this.canClear = false;
    },
    edit_undo: function () {
      var editorEle = this.$refs['editor']
      editorEle.editor.undo();
    },
    edit_redo: function () {
      var editorEle = this.$refs['editor']
      editorEle.editor.redo();
    },
    edit_convert: function () {
      var editorEle = this.$refs['editor']
      editorEle.editor.convert();
    },
    test: function (str) {
      console.log('test');
      console.log(str)
    }
  }
}
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
}
.ms-editor {
  z-index: 0 !important;
}
#editor-control-layer {
  position: absolute;
  z-index: 1;
  pointer-events: none;
}
#editor-control * {
  pointer-events: auto;
}

.v-speed-dial {
  position: absolute !important;
}

@media only screen and (min-width: 768px) {
  #speed-dial {
    position: absolute;
    width: 100%;
    z-index: 1;
    right: 40px;
  }
}
@media only screen and (max-width: 768px) {
  #speed-dial {
    display: none;
  }
}

@media only screen and (max-width: 768px) {
  #menu {
    display: none;
  }
}
</style>
