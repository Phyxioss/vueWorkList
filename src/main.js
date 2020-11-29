import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App'
import routes from './routes'
import Master from './components/layouts/Master'
import { store } from './store/store'


window.eventBus = new Vue() 

Vue.config.productionTip = false
Vue.use(VueRouter)



const router = new VueRouter({
  routes,
  mode: 'history'
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router: router,
  store: store,
  components: { Master },
  template: '<Master/>'
})
