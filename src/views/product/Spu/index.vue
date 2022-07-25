<template>
  <div>
    <el-card style="margin-bottom: 20px">
      <CategorySelect @getCategoryId="getCategoryId" :show="scene !== 0" />
    </el-card>
    <el-card>
      <!-- 展示SPU列表 状态0 -->
      <div v-show="scene === 0">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addSpu"
          >添加SPU</el-button
        >
        <el-table style="width: 100%" border :data="records">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="spuName" label="SPU名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="SPU描述" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <!-- 4个操作按钮 -->
            <template slot-scope="{ row, $index }">
              <!-- 注意：直接使用elbutton的title属性也是可以显示提示信息的 这里主要介绍这种封装方法 -->
              <hint-button
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加SKU"
                @click="addSku(row)"
              ></hint-button>
              <hint-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改SKU"
                @click="updateSpu(row)"
              ></hint-button>
              <hint-button
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看当前SPU的SKU列表"
                @click="handler(row)"
              ></hint-button>
              <el-popconfirm
                title="这是一段内容确定删除吗？"
                @onConfirm="deleteSpu(row)"
              >
                <hint-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除SKU"
                  slot="reference"
                ></hint-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          layout=" prev, pager, next, jumper,->, sizes,total"
          :total="total"
          style="text-align: center; margin-top: 10px"
        >
        </el-pagination>
      </div>
      <!-- 添加SPU|修改SPU 状态1 -->
      <SpuForm v-show="scene === 1" @changeScene="changeScene" ref="spu" />
      <!-- 添加SKU 状态2 -->
      <SkuForm v-show="scene === 2" ref="sku" @changeScene1="changeScene1" />
    </el-card>
    <!-- 对话框 展示SPU列表数据 -->
    <el-dialog
      :title="`${spu.spuName}的SKU列表`"
      :visible.sync="dialogTableVisible"
      :before-close="close"
    >
      <el-table :data="skuList" style="width: 100%" border v-loading="loading">
        <el-table-column prop="skuName" label="名称" width="width">
        </el-table-column>
        <el-table-column prop="price" label="价格" width="width">
        </el-table-column>
        <el-table-column prop="weight" label="重量" width="width">
        </el-table-column>
        <el-table-column label="默认图片" width="width">
          <template slot-scope="{ row }">
            <img :src="row.skuDefalutImg" alt="" />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SpuForm from "./SpuForm";
import SkuForm from "./SkuForm";
export default {
  name: "Spu",
  components: { SpuForm, SkuForm },
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      // 控制三级联动可操作性
      show: true,
      page: 1,
      limit: 3,
      // SPU列表数据
      records: [],
      total: 0,
      // 代表展示的是哪个状态 0 展示SPU列表 1 添加SPU|修改SPU 2 添加SKU
      scene: 0,
      dialogTableVisible: false,
      spu: {},
      skuList: [],
      loading:true,
    };
  },
  methods: {
    // 获取三级联动子组件id level
    getCategoryId({ categoryId, level }) {
      if (level === 1) {
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
      } else if (level === 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      } else {
        this.category3Id = categoryId;
        this.getSpuList();
      }
    },
    // 获取SPU列表数据
    async getSpuList() {
      const { page, limit, category3Id } = this;
      let result = await this.$API.spu.reqSpuList(page, limit, category3Id);
      if (result.code === 200) {
        this.records = result.data.records;
        this.total = result.data.total;
      }
    },
    // 点击分页器第几页的回调
    handleCurrentChange(page) {
      // elementui已经封装好的事件回调 可以点击获取页数
      this.page = page;
      this.getSpuList();
    },
    // 分页器展示每页条数发生变化回调
    handleSizeChange(limit) {
      // elementui已经封装好的事件回调 可以点击获取 limit 每页最大条数
      this.limit = limit;
      this.getSpuList();
    },
    // 点击添加SPU按钮的回调
    addSpu() {
      this.scene = 1;
      // 通知子组件spuForm发请求
      this.$refs.spu.addSpuData(this.category3Id);
    },
    // 修改某一个SPU
    updateSpu(row) {
      this.scene = 1;
      // 获取子组件spuForm并执行其方法
      this.$refs.spu.initSpuData(row);
    },
    // 自定义事件 spuForm
    changeScene(scene) {
      this.scene = scene;
      this.getSpuList();
    },
    // 删除Spu按钮的回调
    async deleteSpu(row) {
      let result = await this.$API.spu.reqDeteleSpu(row.id);
      if (result.code === 200) {
        this.$message({ type: "success", message: "删除成功！" });
        this.getSpuList();
      }
    },
    // 添加Sku按钮回调
    addSku(row) {
      this.scene = 2;
      // 通知子组件发请求
      this.$refs.sku.getData(this.category1Id, this.category2Id, row);
    },
    //自定义事件 skuForm
    changeScene1(scene) {
      this.scene = scene;
    },
    // 查看SKU按钮的回调
    async handler(spu) {
      this.dialogTableVisible = true;
      this.spu = spu;
      // 获取sku列表数据进行展示
      let result = await this.$API.spu.reqSkuList(spu.id);
      if (result.code === 200) {
        this.skuList = result.data;
        // 数据回来loading加载效果隐藏
        this.loading = false
      }
    },
    // 关闭对话框的回调
    close(done){
      this.loading = true
      // 清除sku列表数据
      this.skuList = []
      // 关闭对话框
      done()
    }
  },
};
</script>

<style>
</style>