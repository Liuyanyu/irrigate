<template>
  <div id="app">
    <div class="text"></div>
    <illumination></illumination>
  </div>
</template>

<script>
import illumination from "./views/illumination";
export default {
  components: {
    illumination
  }
};
</script>
<style lang="less">
// body {
//   margin: 0;
//   padding: 0;
//   background: url("./assets/img/bg1.png") no-repeat;
//   background-size: 100%;
//   width: 100%;
//   height: 100%;
//   padding-right: 0 !important;
//   .v-modal {
//     z-index: 0 !important;
//   }
//   a {
//     text-decoration: none;
//     font-size: 20px;
//     color: white;
//   }
//   .text {
//     background: url("./assets/img/top.png") no-repeat;
//     background-size: 100%;
//     height: 65px;
//     text-align: center;
//   }
//   .el-progress-bar__outer {
//     height: 4px !important;
//     width: 260px !important;
//     margin-right: 10px;
//     margin-top: 8px;
//   }
// }
</style>
