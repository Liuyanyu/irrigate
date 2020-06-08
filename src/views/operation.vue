<template>
  <div class="operation">
    <nav>
      <router-link to="/partition">
        <span @click="tag = '分组管理'" :class="{ hover: tag == '分组管理' }"
          >分组管理</span
        >
      </router-link>
      <router-link to="/model">
        <span @click="tag = '分区管理'" :class="{ hover: tag == '分区管理' }"
          >分区管理</span
        >
      </router-link>
      <router-link to="/tactics">
        <span @click="tag = '策略管理'" :class="{ hover: tag == '策略管理' }"
          >策略管理</span
        >
      </router-link>
      <div class="close" @click="close()">
        <img src="../assets/img/关闭.png" alt />
      </div>
    </nav>
    <div class="main">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 文本样式
      tag: "分组管理"
    };
  },
  methods: {
    close() {
      this.$parent.operation = !this.$parent.operation;
    }
  }
};
</script>

<style lang="less" scoped>
a{
  color: #ffffff;
  text-decoration: none;
}
.operation {
  width: 930px;
  height: 520px;
  background: url("../assets/img/bg.png") no-repeat;
  background-size: 100%;
  position: absolute;
  top: 110px;
  left: 28%;
  color: #ffffff;

  .hover {
    color: #15f6f3;
    background: url("../assets/img/文字光标.png") no-repeat bottom;
    background-size: 100%;
  }

  nav {
    margin-top: 20px;
    margin-left: 40px;
    span {
      width: 65px;
      margin-right: 15px;
      margin-left: 10px;
      text-align: center;
      padding-bottom: 9px;
      font-size: 16px;
    }

    .close {
      position: absolute;
      top: 15px;
      right: 30px;
      img {
        width: 30px;
        height: 30px;
      }
    }
  }

  .main {
    margin: 15px 35px;
  }
}
</style>
