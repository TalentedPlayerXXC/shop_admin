<template>
  <el-container class="home">
    <el-aside width="200px">
      <!-- el-menu导航组件 -->
      <!--  default-active： 当前激活菜单的index -->
      <!-- el-submenu： 子导航 -->
      <!-- el-menu-item-group： 分组 -->
      <!-- el-menu-item ：每一项的菜单  -->
      <el-menu
        :default-active="$route.path.slice(1).split('-')[0]"
        class="el-menu-vertical-demo"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        unique-opened
        router
      >
        <el-submenu v-for="menu in menuList" :key="menu.id" :index="menu.path">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>{{ menu.authName }}</span>
          </template>
          <el-menu-item
            v-for="item in menu.children"
            :key="item.id"
            :index="item.path"
          >
            <i class="el-icon-menu"></i>
            <span slot="title">{{ item.authName }}</span>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <div class="logo"></div>
        <div class="logout">
          <span>欢迎登入!</span>
          <el-button type="danger" @click="logout" plain size="small"
            >退出</el-button
          >
        </div>
        <div class="title">
          <h3>vue后台管理系统</h3>
        </div>
      </el-header>
      <el-main>
        <!-- 指定home组件中 子组件的出口 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      menuList: []
    }
  },
  methods: {
    // 退出
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
    }
  },
  async created() {
    // 获取菜单列表
    let res = await this.axios.get(`menus`)
    let {
      meta: { status },
      data
    } = res.data
    if (status === 200) {
      this.menuList = data
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
      background: url('../assets/logo2.png') no-repeat center center;
      background-size: cover;
    }
    .logout {
      width: 180px;
      height: 60px;
      float: right;
      font-weight: 700;
      line-height: 60px;
      text-align: left;
      .el-button {
        margin-left: 15px;
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
