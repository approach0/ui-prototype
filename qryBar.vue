<template>
<div class="v-input v-text-field v-text-field--solo v-autocomplete v-select"
     style="flex: 1; width: 100%; margin: 0; min-height: 48px;">
  <div class="v-input__slot" style="padding: 0 12px;">
    <div id="chips_parent" class="v-select__selections">
      <v-chip v-for="(chip, idx) in chips" :key="idx"
       :class="{'v-chip--selected': cur_chip == idx}"
       @click="sel_chip(idx)" @input="del_chip(idx)" close>
        <span v-html="chip.str"></span>
      </v-chip>
      <input id="draft_chip" v-model="draft_chip" type="text" role="combobox"
       @click="unsel_chip()" @keyup.delete="on_del" @keyup.enter="on_enter" />
    </div>
    <div class="v-input__append-inner" style="cursor: pointer"
      @click="clear_chips" v-if="chips.length">
      <v-icon>close</v-icon>
    </div>
<!--
    <div class="v-input__append-inner">
      <v-icon>star_border</v-icon>
    </div>
    <div class="v-input__append-inner">
      <v-icon>photo_camera</v-icon>
    </div>
-->
  </div>
</div>
</template>
<script>
var $ = require('jquery')
import eventBus from './event-bus';
import {mathjax_init, mathjax_tex_render} from './tex-render'

export default {
  data: function () {
    return {
      'chips': [
        {'str': 'prove'},
        {'str': '[imath]x^2 + y^2 = z^2[/imath]'}
      ],
      'cursor_pos': 0,
      'cur_chip': -1,
      'draft_chip': ''
    }
  },
  watch: {
    'draft_chip': function (val) {
      var vm = this;
      /* prohibit TeX in text mode */
      const tex_charset = ".'+-*/\\!^_%()[]:;{}=<>$";
      val = val.split("").filter(c => {
        return tex_charset.indexOf(c) == -1;
      }).join('');
      vm.draft_chip = val;
      /* split on spaces */
      vm.split_chip(false);
    }
  },
  mounted: function () {
    var vm = this;
    eventBus.$on('handwrite_tex', (tex, strokes) => {
      vm.write_chip('[imath]' + tex + '[/imath]', strokes);
    });

    eventBus.$on('split_chip', () => {
      this.split_chip(true);
    });

    $("#draft_chip").bind("keydown click focus", function() {
      const pos = $('#draft_chip').prop('selectionStart');
      vm.cursor_pos = pos;
    });

    mathjax_init();
  },
  methods: {
    split_chip: function(force) {
      let vm = this;
      let val = vm.draft_chip;
      if (val.indexOf(' ') > -1 || force) {
        val.split(' ').forEach(function (s) {
          if (s != "") vm.add_chip(s);
        });
        vm.draft_chip = '';
        this.unsel_chip();
      }
    },
    on_del: function () {
      if (this.cursor_pos == 0) {
        this.del_chip(this.chips.length - 1);
      }
    },
    on_enter: function () {
      this.unsel_chip();
      eventBus.$emit('split_chip');
      eventBus.$emit('do_search');
    },
    clear_chips: function (idx) {
      this.chips = [];
      this.unsel_chip();
      eventBus.$emit('update_canvas_pos');
    },
    del_chip: function (idx) {
      this.unsel_chip();
      this.chips.splice(idx, 1);
      eventBus.$emit('update_canvas_pos');
      this.render_chip(-1);
    },
    sel_chip: function (idx) {
      if (idx >= 0) {
        this.cur_chip = idx;
        const chip = this.chips[this.cur_chip];
        const strokes = chip['strokes'] || [];
        eventBus.$emit('update_canvas_strokes', strokes);
      }
    },
    unsel_chip: function () {
      this.cur_chip = -1;
      eventBus.$emit('update_canvas_strokes', []);
    },
    write_chip: function (val, strokes) {
      var idx = this.cur_chip;
      if (idx < 0) {
        /* allocate */
        this.chips.push({'str': val, 'strokes': strokes});
        idx = this.chips.length - 1; /* get the final son after push */
        this.sel_chip(idx);
      } else {
        this.$set(this.chips[idx], 'str', val);
        this.$set(this.chips[idx], 'strokes', strokes);
      }
      eventBus.$emit('update_canvas_pos');
      this.render_chip(idx);
    },
    render_chip: function (idx) {
      var scope = `#chips_parent span:nth-child(${idx + 1})`; /* only one */
      if (idx < 0) scope = '#chips_parent span.v-chip'; /* render all */
      this.$nextTick(function () {
        mathjax_tex_render(scope);
      });
    },
    add_chip: function (s) {
      this.unsel_chip();
      this.write_chip(s);
    },
    test: function (str) {
      //console.log(str)
      this.chips.forEach((chip, chip_idx) => {
        console.log(`chip[${chip_idx}] = ${chip.str}`);
        if (chip.strokes === undefined)
          return;
        chip.strokes.forEach((s, s_idx) => {
          console.log(`stroke[${s_idx}].x[0] = ${s.x[0]}`)
        });
      });
      console.log('----')
    }
  }
}
</script>

<style>
.v-chip--selected:after {
  background-color: white !important;
  opacity: 1 !important;
  border: 1px solid white;
}
.v-chip__content {
  height: auto !important;
  padding: 4px 4px 4px 12px !important;
}

.MathJax:focus, .mjx-chtml:focus, .MathJax_SVG:focus {
  outline: none;
}
</style>
