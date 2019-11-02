<template>
  <div class="rights">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表格组件 -->
    <el-table :data="rightList" stripe style="width: 100%" height="440">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="authName" label="权限名称" width="180"> </el-table-column>
      <el-table-column prop="path" label="路径" width="180"> </el-table-column>
      <el-table-column prop="level" label="层级">
        <!-- 自定义列模板 -->
        <template slot-scope="scope">
          <span v-if="scope.row.level == 0">一级</span>
          <span v-else-if="scope.row.level == 1">二级</span>
          <span v-else>三级</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rightList: []
    }
  },
  async created() {
    // 发送axios请求
    let res = await this.axios.get('rights/list')
    let {
      meta: { status },
      data
    } = res.data
    if (status === 200) {
      this.rightList = data
    } else {
    }
  }
}
</script>
<style lang="less" scoped></style>
