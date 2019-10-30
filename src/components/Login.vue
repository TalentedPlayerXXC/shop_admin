<template>
  <div class="login">
    <!-- el-form表示表单  -->
    <!-- ：model 表单的数据 -->
    <!-- label-width label的宽度 -->
    <el-form ref="form" status-icon :model="form" :rules="rules" label-width="80px">
      <img src="../assets/logo.png" alt="" />
      <el-form-item label="用户名" prop="username">
        <el-input placeholder="请输入用户名" v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input placeholder="请输入密码" type="password" v-model="form.password" @keyup.enter.native="login"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login">登录</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }, { min: 3, max: 9, message: '长度在 3 到 9 个字符', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }, { min: 6, max: 16, message: '长度在 6 到 16 位字符', trigger: 'blur' }]
      }
    }
  },
  methods: {
    resetForm() {
      this.$refs.form.resetFields()
    },
    login() {
      // validate 调用了form组件的validate方法
      this.$refs.form.validate(async valid => {
        if (valid) {
          // 提交表单
          // 发送ajax请求
          let res = await this.axios({
            url: 'login',
            method: 'post',
            data: this.form
          })
          if (res.data.meta.status === 200) {
            // 登录成功，跳到首页组件
            // this.$message({
            //   message: '登录成功了',
            //   type: 'success',
            //   showClose: true,
            //   duration: 1000
            // })
            this.$message.success('登录成功了')
            // 把返回的token存储起来
            // 注意 要先存token在跳路由
            localStorage.setItem('token', res.data.data.token)
            this.$router.push('home')
          } else {
            // 登录失败
            this.$message.error('用户名或密码错误')
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login {
  background-color: #2d434c;
  height: 100%;
  overflow: hidden;
  .el-form {
    width: 400px;
    background-color: #fff;
    margin: 200px auto;
    padding: 75px 40px 15px 40px;
    border-radius: 20px;
    position: relative;
    img {
      width: 150px;
      height: 140px;
      position: absolute;
      top: 0px;
      left: 50%;
      transform: translate(-50%, -50%);
      border-radius: 50%;
    }
    // .el-button + .el-button 兄弟选择器选择后一个
    .el-button + .el-button {
      margin-left: 80px;
    }
  }
}
</style>
