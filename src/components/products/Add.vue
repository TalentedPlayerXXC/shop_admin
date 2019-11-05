<template>
  <div>
    <!-- 步骤条 -->
    <el-steps :active="active" finish-status="success">
      <el-step title="步骤 1" description="基本信息"></el-step>
      <el-step title="步骤 2" description="商品信息"></el-step>
      <el-step title="步骤 3" description="商品内容"></el-step>
    </el-steps>
    <!-- tab栏 -->
    <el-tabs tab-position="left" @tab-click="change" v-model="activeName">
      <el-tab-pane name="basic" label="基本信息">
        <!-- 商品基本信息 -->
        <el-form :model="add" ref="add" label-width="80px">
          <el-form-item label="商品名称">
            <el-input v-model="add.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="add.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="add.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="add.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader v-model="add.goods_cat" :options="options" :props="props"></el-cascader>
          </el-form-item>
          <el-form-item label="是否促销">
            <el-radio v-model="add.is_promote" :label="true">是</el-radio>
            <el-radio v-model="add.is_promote" :label="false">否</el-radio>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="next(1, 'pic')">下一步</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane name="pic" label="商品图片">
        <!-- 上传图片 -->
        <!-- action 指定图片上传地址 -->
        <!-- headers 设置token -->
        <el-upload class="upload-demo" :on-remove="handlerRemove" :on-success="handlerSuccess" action="http://localhost:8888/api/private/v1/upload" list-type="picture" :headers="headers">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
        <!-- 下一步 -->
        <el-button type="primary" @click="next(2, 'content')">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane class="content" name="content" label="商品内容">
        <!-- 使用富文本编辑器 -->
        <quill-editor v-model="add.goods_introduce"></quill-editor>
        <el-button type="primary" @click="addGood">添加</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
export default {
  data() {
    return {
      active: 0,
      add: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat: [],
        is_promote: false,
        // 用于接收上传成功的图片信息
        pics: [],
        goods_inrtoduce: ''
      },
      fileList: [],
      options: [],
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      activeName: 'basic',
      headers: {
        Authorization: localStorage.getItem('token')
      }
    }
  },
  methods: {
    change(tab) {
      this.active = +tab.index
    },
    // 去下一页
    next(active, activeName) {
      this.active = active
      this.activeName = activeName
    },
    // 文件上传成功时的钩子
    handlerSuccess(response, file, fileList) {
      // 通过response获取到上传成功后的图片的地址
      this.add.pics.push({
        pic: response.data.tmp_path
      })
    },
    // 文件删除时的钩子
    handlerRemove(file, fileList) {
      //   this.add.pics.splice(this.add.pics.pic, 1)
      let tmpPath = file.response.data.tmp_path
      let idx = this.add.pics.findIndex(item => item.pic === tmpPath)
      this.add.pics.splice(idx, 1)
    },
    // 添加商品
    async addGood() {
      // 发送请求 把收集到的所有数据发送到服务端
      let res = await this.axios.post(`goods`, {
        ...this.add,
        goods_cat: this.add.goods_cat.join()
      })
      let {
        meta: { status }
      } = res.data
      if (status === 201) {
        this.$router.push('/goods')
        this.$message.success('商品添加成功')
      }
    }
  },
  async created() {
    // 发送请求
    let res = await this.axios.get(`categories?type=3`)
    let {
      meta: { status },
      data
    } = res.data
    console.log(data)

    if (status === 200) {
      this.options = data
    }
  }
}
</script>
<style lang="less" scoped>
.quill-editor {
  background-color: #fff;
  /deep/ .ql-editor {
    height: 300px;
  }
}
</style>
