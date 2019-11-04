<template>
  <div>
    <el-button type="success" plain="plain" @click="showAddDialogVisible">添加分类</el-button>
    <el-table :data="categoriesList" style="width: 100%" row-key="cat_id" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" v-loading="loading" element-loading-text="数据正在赶来的路上" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 1)">
      <el-table-column prop="cat_name" label="分类名称" width="180"> </el-table-column>
      <el-table-column prop="cat_deleted" label="是否删除" width="180">
        <template slot-scope="scope">
          {{ scope.row.cat_deleted ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column prop="cat_level" label="排序"> </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="small" plain @click="showEditForm(scope.row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="small" plain @click="delCategories(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--  分页 -->
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="current" :page-sizes="[6, 9, 20]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    <!-- 显示添加分类模态框 -->
    <el-dialog title="添加商品分类" :visible.sync="addDialogVisible" width="40%">
      <el-form ref="addForm" :model="addForm" :rules="rules" label-width="80px" status-icon>
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级名称" prop="cat_pid">
          <el-cascader v-model="addForm.cat_pid" :props="props" :options="options" clearable change-on-select></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCategory">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 显示修改商品分类名称模态框 -->
    <el-dialog title="修改商品分类名称" :visible.sync="editDialogVisible" width="40%">
      <el-form ref="editForm" :model="editForm" :rules="rules" label-width="80px" status-icon>
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCategory">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 列表数据
      //   categoriesList: [],
      current: 1, // 页码
      pagesize: 6, // 每页条数
      total: null, // 总条数
      loading: true, // 加载状态
      categoriesList: [],
      hasChildren: true,
      addDialogVisible: false,
      // 添加商品分类
      addForm: {
        cat_name: '',
        cat_pid: []
      },
      editDialogVisible: false,
      // 修改商品分类
      editForm: {
        cat_name: '',
        cat_id: '',
        cat_pid: '',
        cat_level: ''
      },
      options: [],
      props: {
        value: 'cat_id',
        label: 'cat_name',
        childern: 'children'
      },
      rules: {
        cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 获取列表的数据
    async getCategoriesList() {
      let res = await this.axios.get(`categories`, {
        params: {
          type: 3,
          pagenum: this.current,
          pagesize: this.pagesize
        }
      })
      let {
        meta: { status },
        data: { result, total }
      } = res.data
      if (status === 200) {
        this.categoriesList = result
        this.total = total

        // 成功拿到数据之后停止加载状态
        setTimeout(() => {
          this.loading = false
        }, 500)
      }
    },
    // 修改了当前页的页码
    handleSizeChange(val) {
      this.loading = true
      this.pagesize = val
      this.current = 1
      this.getCategoriesList()
    },
    // 修改每页显示数目
    handleCurrentChange(val) {
      this.loading = true
      this.current = val
      this.getCategoriesList()
    },
    async showAddDialogVisible() {
      this.addDialogVisible = true
      // 发送请求 获取分类的数据
      let res = await this.axios.get(`categories?type=2`)
      // console.log(res)
      let {
        meta: { status },
        data
      } = res.data
      if (status === 200) {
        this.options = data
      }
    },
    // 添加商品分类
    addCategory() {
      this.$refs.addForm.validate(async valid => {
        if (!valid) {
          return false
        }
        // 发送请求
        let { cat_pid: catPid, cat_name: catName } = this.addForm
        let res = await this.axios.post(`categories`, {
          cat_pid: catPid[catPid.length - 1] || 0, // 但下拉框不选择的时候  传的pid为0也就是一级菜单
          // cat_name: cat_name,
          cat_name: catName,
          cat_level: catPid.length
        })
        let {
          meta: { status, msg }
        } = res.data
        if (status === 201) {
          this.addDialogVisible = false
          this.$refs.addForm.resetFields()
          this.getCategoriesList()
          this.$message.success('添加商品分类信息成功')
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 删除商品分类
    async delCategories(categories) {
      try {
        await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        // 发送请求
        let res = await this.axios.delete(`categories/${categories.cat_id}`)
        let {
          meta: { status, msg }
        } = res.data
        if (status === 200) {
          this.getCategoriesList()
          this.$message.success('删除分类成功')
        } else {
          this.$message.error(msg)
        }
      } catch (e) {
        this.$message.info('取消删除')
      }
    },
    // 显示修改商品分类模态框
    showEditForm(edit) {
      this.editDialogVisible = true
      // 将数据回显到输入框中
      this.editForm.cat_id = edit.cat_id
      this.editForm.cat_pid = edit.cat_pid
      this.editForm.cat_name = edit.cat_name
      this.editForm.cat_level = edit.cat_level
    },
    // 修改商品分类
    editCategory() {
      this.$refs.editForm.validate(async valid => {
        if (!valid) {
          return false
        }
        let { cat_id, cat_level, cat_pid, cat_name } = this.editForm
        let res = await this.axios.put(`categories/${this.editForm.cat_id}`, {
          cat_name,
          cat_pid,
          cat_id,
          cat_level
        })
        let {
          meta: { status }
        } = res.data
        console.log(res.data)

        if (status === 200) {
          this.editDialogVisible = false
          this.$message.success('修改商品分类成功')
          this.getCategoriesList()
        } else {
          this.$message.error('修改商品分类失败')
        }
      })
    }
  },
  created() {
    // 获取列表的数据
    this.getCategoriesList()
  }
}
</script>
<style lang="less" scoped></style>
