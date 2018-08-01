<template>
<div class="v-input v-text-field v-text-field--solo v-autocomplete v-select"
     style="flex: 1; width: 100%; margin: 0; min-height: 48px;">
  <div class="v-input__slot" style="padding: 0 12px;">
    <div class="v-select__selections">
      <v-chip v-for="(chip, idx) in chips"
       v-bind:selected = "chips[idx].sel"
       @click="sel_chip(idx)" @input="del_chip(idx)" close>
      {{chip.str}}
      </v-chip>
      <input type="text" role="combobox" @click="sel_chip(-1)"
       v-model="editing_latex"/>
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
        {'sel': false, 'str': 'prove'},
        {'sel': false, 'str': '$f(x) = ax+b$'},
        {'sel': false, 'str': '$x = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}$'},
        {'sel': false, 'str': 'ax^2 + bx + c = 0'},
        {'sel': false, 'str': '$f(x) = ax+b$'},
        {'sel': false, 'str': '$\\frac a b$'}
      ],
      'cur_chip': -1,
      'editing_latex': ''
    }
  },
  mounted: function () {
    var vm = this;
    eventBus.$on('update_edit_latex', tex => {
      vm.write_chip(tex);
    });
  },
  methods: {
    clear_chips: function (idx) {
      this.chips = [];
      this.cur_chip = -1;
      this.update_canvas_pos();
    },
    del_chip: function (idx) {
      this.chips = this.chips.map(x => {x.sel = false; return x});
      this.cur_chip = -1;
      this.chips.splice(idx, 1);
      this.update_canvas_pos();
    },
    sel_chip: function (idx) {
      this.chips = this.chips.map(x => {x.sel = false; return x});
      this.cur_chip = idx;
      if (idx > 0)
        this.$set(this.chips[this.cur_chip], 'sel', true);
    },
    write_chip: function (val) {
      if (this.cur_chip < 0) {
        this.chips.push({'sel': true, 'str': '$$'});
        this.cur_chip = this.chips.length - 1;
      }

      this.$set(this.chips[this.cur_chip], 'str', '$' + val + '$');
      this.update_canvas_pos();
    },
    update_canvas_pos() {
      eventBus.$emit('update_canvas_pos');
    },
    test: function (str) {
      console.log(str)
    }
  }
}
</script>

<style>
</style>
