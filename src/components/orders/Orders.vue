<template>
  <div class="order">
    <!-- 订单列表 -->
    <el-table :data="orderList" stripe style="width: 100%">
      <el-table-column prop="order_fapiao_title" label="发货人类型"> </el-table-column>
      <!-- <el-table-column prop="consignee_addr" label="发货地址"> </el-table-column> -->
      <el-table-column label="创建时间">
        <template slot-scope="scope">
          {{ scope.row.create_time | dateFilter }}
        </template>
      </el-table-column>
      <el-table-column label="更新时间">
        <template slot-scope="scope">
          {{ scope.row.update_time | dateFilter }}
        </template>
      </el-table-column>
      <el-table-column label="是否付款">
        <template slot-scope="scope">
          {{ scope.row.order_pay == 0 ? '未付款' : '已付款' }}
        </template>
      </el-table-column>
      <el-table-column label="是否发货" prop="is_send"> </el-table-column>
    </el-table>
    <!-- 页码 -->
    <!-- 分页 -->
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="current" :page-sizes="[5, 10, 20]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
  </div>
</template>
<script>
export default {
  data() {
    return {
      current: 1,
      pagesize: 5,
      total: 0,
      orderList: [
        // user_id: '',
        // pay_status: '',
        // is_send: '',
        // order_fapiao_title: '',
        // order_fapiao_company: '',
        // order_fapiao_content: '',
        // consignee_addr: ''
      ]
    }
  },
  methods: {
    // 获取订单列表
    async getOrderList() {
      let res = await this.axios.get(`orders`, {
        params: {
          query: this.query,
          pagenum: this.current,
          pagesize: this.pagesize
        }
      })
      let {
        meta: { status },
        data: { goods, total }
      } = res.data
      if (status === 200) {
        this.orderList = goods
        this.total = total
      }
    },
    // 当前页显示几条数据
    handleSizeChange(val) {
      this.current = 1
      this.pagesize = val
    },
    // 跳页
    handleCurrentChange(val) {
      this.current = val
    }
  },
  created() {
    this.getOrderList()
  }
}
</script>
<style lang="less" scoped>
.order {
  .el-button {
    margin-bottom: 5px;
  }
}
</style>
