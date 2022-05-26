import Vue from 'vue'
import App from '@common/view/App.vue'
import router from './router'
import store from './store'
import {Util} from "@common/util/util";

Vue.config.productionTip = false
Util.test();
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
