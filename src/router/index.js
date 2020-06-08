import Vue from "vue";
import VueRouter from "vue-router";
// 智慧照明子路由
import model from "../views/compont/model.vue";
import partition from "../views/compont/partition.vue";
import tactics from "../views/compont/tactics.vue";

Vue.use(VueRouter);

const routes = [
  // 默认显示路由
  {
    path: "",
    redirect: "/partition"
  },
  // 模式管理
  {
    path: "/model",
    component: model
  },
  // 分区管理
  {
    path: "/partition",
    component: partition
  },
  // 策略管理
  {
    path: "/tactics",
    component: tactics
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
