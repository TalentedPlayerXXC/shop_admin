<template>
  <div>
    <el-button type="success" plain="plain">添加分类</el-button>
    <el-table :data="categoriesList"  style="width: 100%" row-key="cat_id" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" v-loading="loading" element-loading-text="数据正在赶来的路上" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 1)">
      <el-table-column prop="cat_name" label="分类名称" width="180"> </el-table-column>
      <el-table-column prop="cat_deleted" label="是否删除" width="180">
        <template slot-scope="scope">
          {{ scope.row.cat_deleted ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column prop="cat_level" label="排序"> </el-table-column>
      <el-table-column label="操作" width="">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="small" plain></el-button>
          <el-button type="danger" icon="el-icon-delete" size="small" plain></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--  分页 -->
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="current" :page-sizes="[6, 9, 20]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
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
      total: '', // 总条数
      loading: true, // 加载状态
      categoriesList: [],
      hasChildren: true
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
        console.log(this.categoriesList)
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
    }
  },
  created() {
    // 获取列表的数据
    this.getCategoriesList()
  }
}
</script>
<style lang="less" scoped></style>
