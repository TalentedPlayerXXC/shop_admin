<template>
<el-container class="welcome">
  {{msg}}
</el-container>
</template>
<script>
export default {
  data() {
    return {
      msg: '欢迎登陆'
    }
  }
}
</script>
<style lang="" socpe>
.welcome {
  width: 500px;
  margin: 0 auto;
  font-size: 40px;
  color: aliceblue;
  font-weight: bold;
}
</style>
