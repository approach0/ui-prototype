import Vue from 'vue'
import Vuetify from 'vuetify'
import qryBar from './qryBar.vue'

import 'material-icons/iconfont/material-icons.css'
import 'vuetify/dist/vuetify.min.css'
import 'myscript/dist/myscript.min.css'

Vue.use(Vuetify)

new Vue({
  el: '#qry_bar',
  render: h => h(qryBar)
})
