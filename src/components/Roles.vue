<template>
  <div class="roles">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加用户 -->
    <el-button type="success" plain @click="showAddDialog">添加角色</el-button>
    <!-- 表格组件 -->
    <el-table :data="roleList" style="width:100%;">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <!-- 一级权限 -->
          <el-row v-if="scope.row.children.length === 0">
            <span>暂无权限</span>
          </el-row>
          <el-row class="level1" v-for="level1 in scope.row.children" :key="level1.id">
            <el-col :span="4">
              <el-tag closable @close="delRight(scope.row, level1.id)">{{ level1.authName }}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <!-- 二级权限 -->
              <el-row class="level2" v-for="level2 in level1.children" :key="level2.id">
                <el-col :span="4">
                  <el-tag type="success" closable @close="delRight(scope.row, level2.id)">{{ level2.authName }}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <!-- 三级权限 -->
                  <el-tag class="level3" type="warning" closable @close="delRight(scope.row, level3.id)" v-for="level3 in level2.children" :key="level3.id">{{ level3.authName }}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="roleName" label="角色名称"></el-table-column>
      <el-table-column prop="roleDesc" label="描述"></el-table-column>
      <el-table-column prop="" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="small" plain @click="showEditDialog(scope.row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="small" plain @click="delRole(scope.row)"></el-button>
          <el-button type="success" icon="el-icon-check" size="small" plain @click="showAssignDialog(scope.row)">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--添加角色的Dialog 对话框 -->
    <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="40%">
      <el-form ref="addForm" :model="addForm" :rules="rules" label-width="80px" status-icon>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
    <!--分配角色Dialog 对话框 -->
    <el-dialog title="分配角色" :visible.sync="editDialogVisible" width="40%">
      <el-form ref="editForm" :model="editForm" :rules="rules" label-width="80px" status-icon>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>
    <!--分配权限的Dialog 对话框 -->
    <el-dialog title="分配角色" :visible.sync="assignDialogVisible" width="40%" @closed="clearRight">
      <!-- 树形菜单 -->
      <el-tree :data="rightList" show-checkbox default-expand-all node-key="id" ref="tree" highlight-current :props="defaultProps"> </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="assignRight">分 配</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      roleList: [],
      // 添加角色
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      addDialogVisible: false,
      rules: {
        roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }]
      },
      // 修改角色
      editDialogVisible: false,
      editForm: {
        roleName: '',
        roleDesc: ''
      },
      // 分配权限模态框
      assignDialogVisible: false,
      // 默认的属性
      defaultProps: {
        // 指定如何查找子节点的内容
        children: 'children',
        // 指定标签显示哪个属性
        label: 'authName'
      },
      // 存放所有权限列表
      rightList: [],
      // 用来保存角色的id
      roleId: ''
    }
  },
  methods: {
    // 获取所有角色列表
    async getRoleList() {
      let res = await this.axios.get('roles')
      let {
        meta: { status },
        data
      } = res.data
      if (status === 200) {
        this.roleList = data
      }
    },
    // 删除角色
    async delRole(row) {
      try {
        await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        let res = await this.axios.delete(`/roles/${row.id}`)
        let {
          meta: { status }
        } = res.data
        if (status === 200) {
          this.$message.success('删除成功!')
          // 重新渲染所有角色列表
          this.getRoleList()
        } else {
          this.$message.error('删除失败!')
        }
      } catch (e) {
        this.$message.info('已取消删除')
      }
    },
    // 显示添加用户模态框
    showAddDialog() {
      this.addDialogVisible = true
    },
    // 添加角色
    async addRole() {
      let res = await this.axios.post(`roles`, this.addForm)
      let {
        meta: { status }
      } = res.data
      if (status === 201) {
        // 关闭对话框
        this.addDialogVisible = false
        // 清空表单里面的内容
        this.$refs.addForm.resetFields()
        this.$message.success('角色添加成功')
        // 重新渲染用户列表
        this.getRoleList()
      } else {
        this.$message.error('角色添加失败')
      }
    },
    // 显示修改用户模态框
    showEditDialog(row) {
      this.editDialogVisible = true
      // 这里不能用  this.editForm = row  this.editForm直接指向了row
      // this.editForm改变 row也跟着改变了
      this.editForm.roleName = row.roleName
      this.editForm.roleDesc = row.roleDesc
      this.editForm.id = row.id
    },
    // 修改角色
    async editRole() {
      let res = await this.axios.put(`roles/${this.editForm.id}`, this.editForm)
      let {
        meta: { status }
      } = res.data
      if (status === 200) {
        // 关闭模态框
        this.editDialogVisible = false
        // 清空表单
        this.$refs.editForm.resetFields()
        // 重新渲染角色列表
        this.getRoleList()
        this.$message.success('角色修改成功')
      } else {
        this.$message.error('角色修改失败')
      }
    },
    // 删除角色指定的权限
    async delRight(row, rightId) {
      // 直接发送ajax请求
      let res = await this.axios.delete(`roles/${row.id}/rights/${rightId}`)
      // console.log(row, rightId)
      let {
        meta: { status },
        data
      } = res.data
      if (status === 200) {
        this.$message.success('删除成功')
        // 重新渲染当前角色权限
        row.children = data
      } else {
        this.$message.error('删除失败')
      }
    },
    // 显示分配权限模态框
    async showAssignDialog(row) {
      this.assignDialogVisible = true
      this.roleId = row.id
      // 发送请求 获取所有权限 树形结构
      let res = await this.axios.get(`rights/tree`)
      let {
        meta: { status },
        data
      } = res.data
      if (status === 200) {
        this.rightList = data
      }
      // 设置默认选中
      // 先获取当前角色三级权限的id
      let temp = []
      row.children.forEach(level1 => {
        level1.children.forEach(level2 => {
          // 使用一个空数组存储所有三级权限id
          level2.children.forEach(level3 => {
            temp.push(level3.id)
          })
        })
      })
      // temp.push
      this.$refs.tree.setCheckedKeys(temp)
    },
    // 清空权限
    clearRight() {
      this.$refs.tree.setCheckedKeys([])
    },
    // 分配权限
    async assignRight() {
      // 获取角色 ，权限列表
      console.log(this.roleId)
      let keys = this.$refs.tree.getCheckedKeys()
      let halfKeys = this.$refs.tree.getHalfCheckedKeys()
      let rids = keys.concat(halfKeys).join() // join默认以 , 分割
      // 发送请求
      let res = await this.axios.post(`roles/${this.roleId}/rights`, {
        rids
      })
      let {
        meta: { status }
      } = res.data
      if (status === 200) {
        // 关闭模态框
        this.assignDialogVisible = false
        this.$message.success('添加成功')
        // 重新渲染
        this.getRoleList()
      } else {
        this.$message.error('添加失败')
      }
    }
  },
  created() {
    this.getRoleList()
  }
}
</script>
<style lang="less" scpoed>
.level2 {
  margin-bottom: 10px;
}
.level3 {
  margin-bottom: 5px;
  margin-right: 10px;
}
</style>
