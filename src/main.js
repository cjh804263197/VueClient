import Vue from 'vue'
import iView from 'iview';
import App from './App.vue'

Vue.use(iView)

new Vue({
  el: '#app',
  render: h => h(App)
})
