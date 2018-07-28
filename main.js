import Vue from 'vue'
import Vuetify from 'vuetify'
import Vue2TouchEvents from 'vue2-touch-events'
import qryBar from './qryBar.vue'

import 'material-icons/iconfont/material-icons.css'
import 'vuetify/dist/vuetify.min.css'
import 'myscript/dist/myscript.min.css'

Vue.use(Vuetify);

Vue.use(Vue2TouchEvents)

new Vue({
  el: '#qry_bar',
  render: h => h(qryBar)
})
