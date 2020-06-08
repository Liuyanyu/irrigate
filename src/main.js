import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import echarts from "echarts";
Vue.prototype.$echarts = echarts;
// 引入axios
import axios from "axios";
// 设置axios的常态地址
axios.defaults.baseURL = "http://192.168.1.114:9999";
// 导入 Element_ui
import ElementUI from "element-ui";
// 导入 Element-ui 样式
import "element-ui/lib/theme-chalk/index.css";

// 导入左侧列表样式
import "../src/assets/css/sidebarStyle.css";
// 插件 Element-ui
Vue.use(ElementUI);

import BaiduMap from "vue-baidu-map";
Vue.use(BaiduMap, {
  ak: "yhGtwOULKUiUF4BIvyH75zGzLN0PdSrr",
});
Vue.config.productionTip = false;

// 将axios共享给所有实例使用
Vue.prototype.$axios = axios;
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
