<template>
  <div>
    <el-button type="success" plain="plain">添加分类</el-button>
    <el-table :data="categoriesList" style="width: 100%" v-loading="loading" element-loading-text="数据正在赶来的路上" element-loading-spinner="el-icon-loading">
      <!-- tree-key指定每一个节点的key值只有指定了才能嵌套解析 -->
      <!-- level-key指定层级 -->
      <!-- indent-size 指定缩进 -->
      <!-- children-key 通过哪个属性去查找children的值 -->
      <el-table-tree-column label="分类名称" prop="cat_name" width="280" folderIcon tree-key="cat_id" level-key="cat_level" parent-key="cat_pid" child-key="children" indent-size="30"> </el-table-tree-column>
      <el-table-column label="是否删除" prop="cat_deleted" width="180">
        <template slot-scope="scope">
          {{ scope.row.cat_deleted ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column label="排序" width="180" prop="cat_level"> </el-table-column>
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
// 导入element-tree-grid包
import ElTreeGrid from 'element-tree-grid'
// 注册组件名
export default {
  data() {
    return {
      // 列表数据
      categoriesList: [],
      current: 1, // 页码
      pagesize: 6, // 每页条数
      total: '', // 总条数
      loading: true // 加载状态
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
  },
  components: {
    // 把ElTreeGrid注册为一个局部组件
    'el-table-tree-column': ElTreeGrid
  }
}
</script>
<style lang="less" scoped></style>
