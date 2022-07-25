<template>
  <div>
    <el-form ref="form" label-width="80px" :model="spu">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option
            :label="tm.tmName"
            :value="tm.id"
            v-for="(tm, index) in tradeMarkList"
            :key="tm.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input
          type="textarea"
          v-model="spu.description"
          rows="4"
          placeholder="SPU描述"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :file-list="spuImageList"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select
          :placeholder="`还有${unSelectSaleAttr.length}未选择`"
          v-model="attrIdAndAttrName"
        >
          <el-option
            :label="unselect.name"
            :value="`${unselect.id}:${unselect.name}`"
            v-for="(unselect, index) in unSelectSaleAttr"
            :key="unselect.id"
          >
          </el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!attrIdAndAttrName"
          @click="addSaleAttr"
          >添加销售属性</el-button
        >
        <!-- 表格 展示的是当前spu的销售属性 在spu里 -->
        <el-table style="width: 100%" border :data="spu.spuSaleAttrList">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称列表" width="width">
            <template slot-scope="{ row, $index }">
              <el-tag
                :key="tag.id"
                v-for="(tag, index) in row.spuSaleAttrValueList"
                closable
                :disable-transitions="false"
                @close="row.spuSaleAttrValueList.splice(index, 1)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <!-- span与input来回切换 -->
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="saveTagInput"
                size="small"
                @blur="handleInputConfirm(row)"
                @keyup.enter.native="handleInputConfirm(row)"
              >
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="addSaleAttrValue(row)"
                >添加</el-button
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="spu.spuSaleAttrList.splice($index, 1)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SpuForm",
  data() {
    return {
      // 照片墙对话框
      dialogImageUrl: "",
      dialogVisible: false,
      // 修改某一属性时 会发请求返回spu进行替换
      // 添加某一属性时 因为初始化了spu内的信息 会以这个收集的spu发请求
      spu: {
        category3Id: 0,
        spuName: "",
        description: "",
        tmId: "", //品牌Id
        spuImageList: [],
        spuSaleAttrList: [], //spu自己的销售属性
      },
      tradeMarkList: [], //spu品牌信息
      spuImageList: [], // spu图片信息
      saleAttrList: [], //平台全部销售属性列表
      attrIdAndAttrName: "", //收集未选择销售属性的id和属性名称
    };
  },
  methods: {
    // 照片墙删除图片回调
    handleRemove(file, fileList) {
      // file 代表删除的当前图片 fileList 删除后剩下的其他图片
      this.spuImageList = fileList;
    },
    // 照片墙上传成功回调
    handleSuccess(respose, file, fileList) {
      this.spuImageList = fileList;
    },
    // 照片墙图片预览回调
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 初始化spuForm数据
    async initSpuData(spu) {
      // 获取spu信息
      let spuResult = await this.$API.spu.reqSpu(spu.id);
      if (spuResult.code === 200) {
        this.spu = spuResult.data;
      }
      // 获取spu品牌信息
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkResult.code === 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
      // 获取spu图片信息
      let spuImageResult = await this.$API.spu.reqSpuImageList(spu.id);
      if (spuImageResult.code === 200) {
        // this.spuImageList = spuImageResult.data;
        // 饿了么照片墙功能需要数组里对象的key包含name和url 我们的数据有一imgName和imgUrl 需要进行修改
        let listArr = spuImageResult.data;
        listArr.forEach((element) => {
          element.name = element.imgName;
          element.url = element.imgUrl;
        });
        this.spuImageList = listArr;
      }
      // 获取Spu全部销售属性(三个)
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();
      if (saleResult.code === 200) {
        this.saleAttrList = saleResult.data;
      }
    },
    // 添加新的销售属性
    addSaleAttr() {
      const [baseSaleAttrId, saleAttrName] = this.attrIdAndAttrName.split(":");
      // 向spu的spuSaleAttrList添加新的属性(是一个对象)
      let newSaleAttr = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: [],
      };
      this.spu.spuSaleAttrList.push(newSaleAttr);
      this.attrIdAndAttrName = "";
    },
    // 添加按钮的回调 添加新的销售属性值
    addSaleAttrValue(row) {
      this.$set(row, "inputVisible", true);
      this.$set(row, "inputValue", "");
    },
    // el-input失去焦点事件
    handleInputConfirm(row) {
      const { baseSaleAttrId, inputValue } = row;
      if (inputValue.trim() === "") {
        this.$message("属性值不能为空");
        return;
      }
      let isRepeat = row.spuSaleAttrValueList.some((item) => {
        return item.saleAttrValueName === inputValue;
      });
      if (isRepeat) {
        this.$message("属性值不能重复");
        return;
      }
      let newSaleAttrValue = {
        baseSaleAttrId,
        saleAttrValueName: inputValue,
      };
      row.spuSaleAttrValueList.push(newSaleAttrValue);
      row.inputVisible = false;
    },
    // 保存按钮的回调
    async addOrUpdateSpu() {
      // 整理参数 重新赋值
      this.spu.spuImageList = this.spuImageList.map((item) => {
        return {
          imgName: item.name,
          imgUrl: item.respose ? item.respose.data : item.url,
        };
      });
      let result = await this.$API.spu.reqAddOrUpdateSpu(this.spu)
      if(result.code===200){
        this.$message({type:'success',message:'保存成功'})
        // 通知父组件回到场景0
        this.$emit('changeScene',0)
      }
      // 清除数据
      // _data是当前的响应式数据 $options获取组件的配置项(data methods...) 
      // this.$options.data()执行返回的是与_data结构一致(只有键没有值)的对象
      // console.log(this.$options.data());
      Object.assign(this._data,this.$options.data())
    },
    // 点击添加SPU按钮发请求
    async addSpuData(category3Id){
      this.spu.category3Id = category3Id
      // 获取spu品牌信息
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkResult.code === 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
      // 获取Spu全部销售属性(三个)
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();
      if (saleResult.code === 200) {
        this.saleAttrList = saleResult.data;
      }
    },
    // 取消按钮
    cancel(){
      // 通知父组件切换状态0
      this.$emit('changeScene', 0)
      // 点击取消清楚本次写入的数据 防止下次进入时数据残留
      Object.assign(this._data,this.$options.data())
    }
  },
  computed: {
    //计算出还未选择的销售属性 两个数组(整个平台的全部销售属性 spu自己的销售属性)
    unSelectSaleAttr() {
      return this.saleAttrList.filter((item) => {
        return this.spu.spuSaleAttrList.every((item1) => {
          return item.name !== item1.saleAttrName;
        });
      });
    },
  },
};
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>