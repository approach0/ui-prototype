<template>
<div class="v-input v-text-field v-text-field--solo v-autocomplete v-select"
     style="flex: 1; width: 100%; margin: 0; min-height: 48px;">
  <div class="v-input__slot" style="padding: 0 12px;">
    <div class="v-select__selections">
      <v-chip v-for="chip in chips" close>
      {{chip}}
      </v-chip>
      <input type="text" role="combobox"/>
    </div>
    <div class="v-input__append-inner">
      <v-icon>close</v-icon>
    </div>
    <div class="v-input__append-inner">
      <v-icon>star_border</v-icon>
    </div>
    <div class="v-input__append-inner">
      <v-icon>photo_camera</v-icon>
    </div>
  </div>
</div>
</template>
<script>
var $ = require('jquery')

export default {
  data: function () {
    return {
      'chips': [
        '$f(x) = ax+b$',
       /* '$f(x) = ax+b$',
        '$f(x) = ax+b$',
        '$f(x) = ax+b$',
        '$f(x) = ax+b$',*/
        '$\\frac a b$'
      ]
    }
  },
  mounted: function () {
    console.log("mounted!");
  },
  methods: {
    test: function (str) {
      console.log('test');
      console.log(str)
      var editorEle = this.$refs['editor']
      console.log(editorEle.editor);
    }
  }
}
</script>

<style>
</style>
