import Vue from 'vue'
import Vuetify from 'vuetify'
import srchApp from './srchApp.vue'
import qryBar from './qryBar.vue'

import 'material-icons/iconfont/material-icons.css'
import 'vuetify/dist/vuetify.min.css'
import 'myscript/dist/myscript.min.css'

Vue.use(Vuetify);

window.srch_app = new Vue({
  el: '#srch_app',
  render: h => h(srchApp)
})

window.qry_bar = new Vue({
  el: '#qry_bar',
  render: h => h(qryBar)
})
