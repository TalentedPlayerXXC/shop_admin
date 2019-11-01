<template>
  <el-container class="home">
    <el-header>
      <div class="logo"></div>
      <div class="logout">
        <span>欢迎登入!</span>
        <a href="javascript:;" @click="logout">退出</a>
      </div>
      <div class="title">
        <h3>电商后台管理系统</h3>
      </div>
    </el-header>
    <el-container direction="horizontal">
      <el-aside width="200px">
        <!-- el-menu导航组件 -->
        <!--  default-active： 当前激活菜单的index -->
        <!-- el-submenu： 子导航 -->
        <!-- el-menu-item-group： 分组 -->
        <!-- el-menu-item ：每一项的菜单  -->
        <el-menu default-active="1-1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" unique-opened router>
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item index="/users">
              <i class="el-icon-menu"></i>
              <span slot="title">用户列表</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item index="2-1">
              <i class="el-icon-menu"></i>
              <span slot="title">用户列表</span>
            </el-menu-item>
            <el-menu-item index="2-2">
              <i class="el-icon-menu"></i>
              <span slot="title">权限列表</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <!-- 指定home组件中 子组件的出口 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  methods: {
    async logout() {
      try {
        // 弹出消息框
        // await只会等成功的结果
        await this.$confirm('你确定要退出吗?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        // 跳转到登陆页面
        // 清除本地token
        localStorage.removeItem('token')
        this.$router.push('/login')
        this.$message.success('退出成功!')
      } catch (e) {
        this.$message.info('已取消退出')
      }
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>

<style lang="less" scoped>
// 样式指挥在当前组件生效
.home {
  height: 100%;
  .el-header {
    background-color: #b3c1cd;
    .logo {
      width: 180px;
      height: 60px;
      float: left;
      background: url('../assets/logo2.png');
    }
    .logout {
      width: 180px;
      height: 60px;
      float: right;
      font-weight: 700;
      line-height: 60px;
      text-align: left;
      a {
        color: #f80;
        text-decoration: none;
      }
    }
    .title {
      overflow: hidden;
      height: 60px;
      line-height: 60px;
      font-size: 24px;
      text-align: center;
      color: #fff;
    }
  }

  .el-aside {
    background-color: rgb(84, 92, 100);
    .el-submenu {
      width: 200px;
    }
  }

  .el-main {
    background-color: #d4dfe4;
  }
}
</style>
