import Vue from 'vue'
import Vuesax from 'vuesax'
import qryBar from './qryBar.vue'

import 'vuesax/dist/vuesax.css'
import 'material-icons/iconfont/material-icons.css'

Vue.use(Vuesax)

new Vue({
  el: '#qry_bar',
  render: h => h(qryBar)
})
