// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import axios from 'axios'; //主要AJAX套件
import VueAxios from 'vue-axios'; //將他轉為Vue的套件
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import 'bootstrap';
import { ValidationObserver,ValidationProvider, extend } from 'vee-validate/dist/vee-validate.full';//表單驗證套件(VeeValidate)
import * as rules from 'vee-validate/dist/rules';//引入所有預設規則
import { localize } from 'vee-validate'
import TW from 'vee-validate/dist/locale/zh_TW.json'
import { messages } from 'vee-validate/dist/locale/zh_TW.json';
//上方為npm的套件內容

//下方為自訂義的套件內容
import App from './App';
import router from './router';
import './bus';
import currencyFilter from './filters/currency';
import dateFilter from './filters/date';

Vue.config.productionTip = false;
Vue.use(VueAxios, axios);
axios.defaults.withCredentials = true;
Vue.component('Loading',Loading);
Vue.component('ValidationProvider',ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);
localize('zh_TW', TW);
Vue.filter('currency',currencyFilter);
Vue.filter('date',dateFilter);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
  router,
});



Object.keys(rules).forEach(rule =>{
  extend(rule,{
    ...rules[rule],
    message: messages[rule]
    });
});

router.beforeEach((to, from, next) => {
  console.log(to, from, next);
  if(to.meta.requiresAuth){
    const api = `${process.env.APIPATH}/api/user/check`;
    axios.post(api).then(response => {
        console.log(response.data);
        if(response.data.success){
            next();
        }else{
          next({
            path:'/login',
          })
        }
      });
  }else{
    next();
  }
  
});

