import Vue from 'vue'
import VueLodash from 'vue-lodash'
import lodash from 'lodash'
import axios from 'axios'
import VueAxios from 'vue-axios'
import App from './App.vue'
import router from './router'
import store from './store'
import EssHttp from './plugins/ess-http'
import vuetify from './plugins/vuetify'
import globalData from './plugins/globalData'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import VCalendar from 'v-calendar';
import './filter/global-filter'
import kakaoPlugin from './plugins/kakaoPlugin'
import VueClipboard from 'vue-clipboard2'
import Dayjs from 'dayjs'

// Use v-calendar & v-date-picker components
Vue.use(VCalendar, {
  componentPrefix: 'vc',  // Use <vc-calendar /> instead of <v-calendar />
});

// import style
import 'swiper/css/swiper.css'

import "vue-smooth-picker/dist/css/style.css";
import SmoothPicker from "vue-smooth-picker";
Vue.use(SmoothPicker);

Vue.mixin({
  methods: {
    layerCloseMix() {
      var target = event.currentTarget;
      target.closest('.layerBox').remove();
    },
    kbdUp() {
      var target = document.querySelector('.v-application');

      if (target.classList.contains("mobile"))
        target.classList.add('kbdUp');
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })
    },
    scrollTop() {
      window.scrollTo({ top: 0 })
    },
    // 레이어 팝업 + 전체 스크롤 막기
    mixScrollDisable() {
      document.querySelector('html').classList.toggle('noScroll');
    }
  }
});

Vue.use(VueAxios, axios)
Vue.use(EssHttp)
Vue.use(VueAwesomeSwiper, /* { default options with global component } */)
Vue.use(VueLodash, { name: 'custom', lodash: lodash })
Vue.use(globalData, lodash);
Vue.use(kakaoPlugin, { apiKey: "824c621b806b8e72ec6db0a2ed4cccaf" })
Vue.use(VueClipboard)
Vue.use(Dayjs)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  mounted() {
    var filter = "win16|win32|win64|mac";
    var target = document.querySelector('.v-application');

    if (navigator.platform) {
      if (0 > filter.indexOf(navigator.platform.toLowerCase())) {
        target.classList.add('mobile')
      } else {
        target.classList.add('pc')
      }
    }
  },
  render: h => h(App)
}).$mount('#app')
