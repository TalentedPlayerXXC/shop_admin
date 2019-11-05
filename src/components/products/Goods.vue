<template>
  <div>
    <el-button type="success" plain @click="$router.push('/goods-add')">添加商品</el-button>
    <!-- 商品列表 -->
    <el-table :data="goodList" style="100%">
      <el-table-column type="index" :index="indexMethod"></el-table-column>
      <el-table-column label="商品名称" prop="goods_name"></el-table-column>
      <el-table-column label="商品价格" prop="goods_price"></el-table-column>
      <el-table-column label="商品重量" prop="goods_weight"></el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="scope">
          {{ scope.row.add_time | dateFilter }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="small" plain></el-button>
          <el-button type="danger" icon="el-icon-delete" size="small" plain></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <!-- @size-change="handleSizeChange" @current-change="handleCurrentChange" -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="current" :page-sizes="[10, 20, 30, 50, 80]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
  </div>
</template>
<script>
export default {
  data() {
    return {
      query: '',
      current: 1,
      pagesize: 10,
      total: 0,
      goodList: [],
      currentPage4: 1
    }
  },
  methods: {
    // 获取商品列表
    async getGoodList() {
      let res = await this.axios.get(`goods`, {
        params: {
          query: this.query,
          pagenum: this.current,
          pagesize: this.pagesize
        }
      })

      let {
        meta: { status },
        data: { total, goods }
      } = res.data
      console.log(goods)

      if (status === 200) {
        this.total = total
        this.goodList = goods
      }
    },
    // 每页可显示数据
    handleSizeChange(val) {
      //   this.current = val
      this.pagesize = val
      this.current = 1
      this.getGoodList()
    },
    // 根据页码跳转
    handleCurrentChange(val) {
      this.current = val
      this.getGoodList()
    },
    //  商品下标
    indexMethod(index) {
      return (this.current - 1) * this.pagesize + index + 1
    }
  },
  created() {
    this.getGoodList()
  }
}
</script>
<style lang="" scoped></style>
