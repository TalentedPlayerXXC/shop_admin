<template>
  <div class="users">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <el-input placeholder="请输入内容" v-model="query" class="input-with-select">
      <!-- 搜索框 -->
      <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
    </el-input>
    <!-- 用户添加 -->
    <el-button type="success" size="smail" plain @click="showAddDialog">用户添加</el-button>
    <!-- 需要表格组件 -->
    <el-table :data="userList" stripe style="width: 100%" height="225">
      <el-table-column prop="username" label="姓名" width="200"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"> </el-table-column>
      <el-table-column prop="mobile" label="电话" width="200"></el-table-column>
      <el-table-column prop="mg_state" label="状态" width="180">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949" @change="changeState(scope.row)"> </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="mobile" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="small" plain @click="showEditDialog(scope.row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="small" plain @click="delUser(scope.row)"></el-button>
          <el-button type="success" icon="el-icon-check" size="small" plain>分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="current" :page-sizes="[3, 4, 20]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    <!--添加用户的Dialog 对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="40%">
      <!-- 表单 -->
      <el-form ref="addForm" :model="addForm" :rules="rules" label-width="80px" status-icon>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户的Dialog对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="40%">
      <!-- 表单 -->
      <el-form ref="editForm" :model="editForm" :rules="rules" label-width="80px" status-icon>
        <el-form-item label="用户名">
          <el-tag type="info">{{ editForm.username }}</el-tag>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">修 改</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 引入aixos
// import axios from 'axios'
export default {
  data() {
    return {
      query: '', // 查询关键字
      current: 1, // 当前页
      pagesize: 3, // 每页显示条数
      total: 0, // 总条数
      userList: [], // 存储用户的列表
      addDialogVisible: false, // 控制添加对话框是否显示
      editDialogVisible: false, // 控制添加对话框是否显示
      // 用来收集添加用户的数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 用来修改用户数据
      editForm: {},
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }, { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }, { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }],
        email: [{ type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }],
        mobile: [
          {
            pattern: /^1[3-9]\d{9}$/,
            message: '请输入正确的手机号',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // 用于获取用户列表数据
    async getUserList() {
      let res = await this.axios({
        url: 'users',
        method: 'get',
        params: { query: this.query, pagenum: this.current, pagesize: this.pagesize }
      })
      let {
        meta: { status },
        data: { users, total }
      } = res.data
      if (status === 200) {
        this.userList = users
        this.total = total
      }
    },
    // 修改当前页
    handleSizeChange(val) {
      this.pagesize = val
      this.current = 1
      this.getUserList()
    },
    // 修改每页显示的的条数
    handleCurrentChange(val) {
      this.current = val
      this.getUserList()
    },
    // 搜索功能
    search() {
      this.getUserList()
    },
    // 改变状态
    async changeState(row) {
      let res = await this.axios({
        url: `users/${row.id}/state/${row.mg_state}`,
        method: 'put'
      })
      let {
        meta: { status }
      } = res.data
      if (status === 200) {
        this.$message.success('修改状态成功')
      } else {
        this.$message.error('修改状态失败')
      }
    },
    // 删除用户
    delUser(row) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 发送axios请求去删除用户
          this.axios.delete(`users/${row.id}`).then(res => {
            let {
              meta: { status }
            } = res.data
            if (status === 200) {
              this.$message.success('删除成功')
              if (this.userList.length === 1 && this.current > 1) {
                this.current--
              }
              // 删除成功后重新渲染
              this.getUserList()
            } else {
              this.$message.danger('删除失败')
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 显示添加用户模态框
    showAddDialog() {
      // 显示用户对话框
      this.addDialogVisible = true
    },
    // 校验表单(vaildate) 并添加
    addUser() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          // 成功发送axios请求
          this.axios.post(`users`, this.addForm).then(res => {
            let {
              meta: { status }
            } = res.data
            if (status === 201) {
              this.$message.success('添加成功')
              // 关闭模态框
              this.addDialogVisible = false
              // 清空表单数据
              this.$refs.addForm.resetFields()
              // 求最大页码
              this.total++
              this.current = Math.ceil(this.total / this.pagesize)
              // 重新渲染界面
              this.getUserList()
            } else {
              this.$message.error('添加失败')
            }
            console.log(res.data)
          })
        } else {
          console.log('验证失败')
          return false
        }
      })
    },
    // 显示修改用户模态框
    showEditDialog(row) {
      // 显示用户对话框
      this.editDialogVisible = true
      this.editForm = row
    },
    // 校验表单(vaildate)并  修改用户信息
    editUser() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.axios
            .put(`users/${this.editForm.id}`, {
              email: this.editForm.email,
              mobile: this.editForm.mobile
            })
            .then(res => {
              // console.log(res.data)
              let {
                meta: { status }
              } = res.data
              if (status === 200) {
                // 关闭界面
                this.editDialogVisible = false
                // 重新渲染
                this.getUserList()
                this.$message.success('修改成功')
              } else {
                this.$message.error('修改失败')
              }
            })
        } else {
          return false
        }
      })
    }
  },
  created() {
    this.getUserList()
  }
}
</script>

<style lang="less" scoped>
.el-breadcrumb {
  height: 30px;
  line-height: 30px;
}
.input-with-select {
  width: 300px;
  // margin-bottom: 2px;
}
</style>
