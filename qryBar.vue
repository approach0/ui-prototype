<template>
<div class="v-input v-text-field v-text-field--solo v-autocomplete v-select"
     style="flex: 1; width: 100%; margin: 0; min-height: 48px;">
  <div class="v-input__slot" style="padding: 0 12px;">
    <div class="v-select__selections">
      <v-chip v-for="(chip, idx) in chips"
       :class="{'v-chip--selected': cur_chip == idx}"
       @click="sel_chip(idx)" @input="del_chip(idx)" close>
      {{chip.str}}
      </v-chip>
      <input id="draft_chip" v-model="draft_chip" type="text" role="combobox"
       @click="sel_chip(-1)" @keyup.delete="on_del" @keyup.enter="on_enter" />
    </div>
    <div class="v-input__append-inner" @click="clear_chips()">
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

export default {
  data: function () {
    return {
      'chips': [
        /*{'sel': false, 'str': 'prove'},
        {'sel': false, 'str': '$f(x) = ax+b$'},
        {'sel': false, 'str': '$x = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}$'},
        {'sel': false, 'str': 'ax^2 + bx + c = 0'},
        {'sel': false, 'str': '$f(x) = ax+b$'},
        {'sel': false, 'str': '$\\frac a b$'}*/
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
    eventBus.$on('update_edit_latex', tex => {
      vm.write_chip(vm.cur_chip, '$' + tex + '$');

      /* If the written chip is new, update cur_chip pointer.
       * Otherwise, every stroke creates a new chip. */
      if (vm.cur_chip == -1)
        vm.cur_chip = this.chips.length - 1;
    });

    eventBus.$on('do_search', () => {
      this.split_chip(true);
      this.unsel_chip();
    });

    $("#draft_chip").bind("keydown click focus", function() {
      const pos = $('#draft_chip').prop('selectionStart');
      vm.cursor_pos = pos;
    });
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
      eventBus.$emit('do_search');
    },
    clear_chips: function (idx) {
      this.chips = [];
      this.cur_chip = -1;
      eventBus.$emit('update_canvas_pos');
    },
    del_chip: function (idx) {
      this.unsel_chip();
      this.cur_chip = -1;
      this.chips.splice(idx, 1);
      eventBus.$emit('update_canvas_pos');
    },
    sel_chip: function (idx) {
      this.unsel_chip();
      this.cur_chip = idx;
      if (idx > 0)
        this.$set(this.chips[this.cur_chip], 'sel', true);
    },
    unsel_chip: function () {
      this.chips = this.chips.map(x => {x.sel = false; return x});
    },
    write_chip: function (idx, val) {
      if (idx < 0) {
        this.chips.push({'sel': false, 'str': ''});
        idx = this.chips.length - 1;
      }

      this.$set(this.chips[idx], 'str', val);
      eventBus.$emit('update_canvas_pos');
    },
    add_chip: function (s) {
      this.cur_chip = -1;
      this.write_chip(-1, s);
    },
    test: function (str) {
      console.log(str)
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
</style>
