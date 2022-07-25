<template>
  <div>
    <!-- 表格 -->
    <el-table style="width: 100%" border :data="records">
      <el-table-column
        type="index"
        label="序号"
        width="80"
        align="center"
      ></el-table-column>
      <el-table-column prop="skuName" label="名称" width="width">
      </el-table-column>
      <el-table-column prop="skuDesc" label="描述" width="width">
      </el-table-column>
      <el-table-column label="默认图片" width="110">
        <template slot-scope="{ row }">
          <img :src="row.skuDefaultImg" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量" width="80"> </el-table-column>
      <el-table-column prop="price" label="价格" width="80"> </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row, $index }">
          <el-button
            icon="el-icon-sort-down"
            size="mini"
            v-if="row.isSale === 0"
            @click="sale(row)"
          ></el-button>
          <el-button
            type="info"
            icon="el-icon-sort-up"
            size="mini"
            v-else
            @click="cancel(row)"
          ></el-button>
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="edit"
          ></el-button>
          <el-button
            type="info"
            icon="el-icon-info"
            size="mini"
            @click="getSkuInfo(row)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      style="text-align: center"
      background
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      layout=" prev, pager, next, jumper,->,sizes,total"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    >
    </el-pagination>
    <!-- 抽屉效果 -->
    <el-drawer :visible.sync="drawer" :show-close="false" size="50%">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{ skuInfo.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ skuInfo.price }} 元</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <el-tag
            type="success"
            v-for="(attr, index) in skuInfo.skuAttrValueList"
            :key="attr.id"
            style="margin-right: 5px"
            >{{ attr.attrId }}-{{ attr.valueId }}</el-tag
          >
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel >
            <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
              <img :src="item.imgUrl" style="height:250px;margin:auto;display:block">
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "Sku",
  data() {
    return {
      page: 1,
      limit: 10,
      total: 0,
      records: [], //存储服务器返回sku列表数据
      skuInfo: {}, //存储服务器返回的sku详情信息
      drawer: false, //抽屉是否显示
    };
  },
  mounted() {
    // 获取sku列表
    this.getSkuList();
  },
  methods: {
    // 获取sku列表数据
    async getSkuList() {
      const { page, limit } = this;
      let result = await this.$API.sku.reqSkuList(page, limit);
      if (result.code === 200) {
        this.total = result.data.total;
        this.records = result.data.records;
      }
    },
    // 分页器当前页发生变化
    handleCurrentChange(page) {
      this.page = page;
      this.getSkuList();
    },
    // 分页器展示条数发生变化
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSkuList();
    },
    // 上架
    async sale(row) {
      let result = await this.$API.sku.reqSale(row.id);
      if (result.code === 200) {
        row.isSale = 1;
        this.$message({ type: "success", message: "上架成功！" });
      }
    },
    // 下架
    async cancel(row) {
      let result = await this.$API.sku.reqCancel(row.id);
      if (result.code === 200) {
        row.isSale = 0;
        this.$message({ type: "success", message: "下架成功！" });
      }
    },
    edit() {
      this.$message("正在开发中(っ °Д °;)っ");
    },
    // 获取sku详情
    async getSkuInfo(sku) {
      // 展示抽屉
      this.drawer = true;
      let result = await this.$API.sku.reqSkuById(sku.id);
      if (result.code === 200) {
        this.skuInfo = result.data;
      }
    },
  },
};
</script>

<style scoped>
.el-row .el-col-5 {
  font-size: 18px;
  text-align: right;
  font-weight: bold;
}
.el-col {
  margin: 10px 10px;
}
/* >>>  深度选择器 原生CSS
  /deep/  用于less
  ::v-deep  用于scss
*/
>>>.el-carousel__button{
  width:10px;
  height:10px;
  background: rgba(255, 0, 0, 0.5);
  border-radius: 50%;
}
</style>
