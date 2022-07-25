<template>
  <div>
    <el-form ref="form" label-width="90px">
      <el-form-item label="SPU名称"> {{ spu.spuName }} </el-form-item>
      <el-form-item label="SKU名称">
        <el-input placeholder="SKU名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input
          placeholder="价格（元）"
          type="number"
          v-model="skuInfo.price"
        ></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input
          placeholder="重量（千克）"
          v-model="skuInfo.weight"
        ></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input type="textarea" rows="4" v-model="skuInfo.skuDesc"></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form ref="form" :inline="true" label-width="180px">
          <el-form-item
            :label="attr.attrName"
            v-for="(attr, index) in attrInfoList"
            :key="attr.id"
          >
            <el-select placeholder="请选择" v-model="attr.attrIdAndValueId">
              <el-option
                :label="attrValue.valueName"
                v-for="(attrValue, index) in attr.attrValueList"
                :key="attrValue.id"
                :value="`${attr.id}:${attrValue.id}`"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form ref="form" :inline="true" label-width="80px">
          <el-form-item
            :label="saleAttr.saleAttrName"
            v-for="(saleAttr, index) in spuSaleAttrList"
            :key="saleAttr.id"
          >
            <el-select placeholder="请选择" v-model="saleAttr.attrIdAndValueId">
              <el-option
                :label="saleAttrValue.saleAttrValueName"
                v-for="(saleAttrValue, index) in saleAttr.spuSaleAttrValueList"
                :key="saleAttrValue.id"
                :value="`${saleAttr.id}:${saleAttrValue.id}`"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table
          style="width: 100%"
          border
          :data="spuImageList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column prop="prop" width="80px" type="selection">
          </el-table-column>
          <el-table-column prop="imgUrl" label="图片" width="width">
            <template slot-scope="{ row, $index }">
              <img :src="row.imgUrl" style="width: 100px; height: 100px" />
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-button
                type="primary"
                v-if="row.isDefault === 0"
                @click="changeDefault(row)"
                >设置默认</el-button
              >
              <el-button v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SkuForm",
  data() {
    return {
      spuImageList: [], //存储图片信息
      spuSaleAttrList: [], //存储销售属性
      attrInfoList: [], //存储平台属性数据
      //收集sku数据字段(将来带给服务器)
      skuInfo: {
        //1.父组件给的数据
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        //2.通过数据双向绑定获取
        skuName: "",
        price: 0,
        weight: "",
        skuDesc: "",
        //3.需要自己书写逻辑代码收集
        skuDefalutImg: "",
        // 图片字段
        skuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   isDefault: "string",
          //   skuId: 0,
          //   spuImgId: 0,
          // },
        ],
        // 销售属性列表字段
        skuSaleAttrValueList: [
          // {
          //   id: 0,
          //   saleAttrId: 0,
          //   saleAttrName: "string",
          //   saleAttrValueId: 0,
          //   saleAttrValueName: "string",
          //   skuId: 0,
          //   spuId: 0,
          // },
        ],
        // 平台属性列表字段
        skuAttrValueList: [
          {
            attrId: 0,
            valueId: 0,
          },
        ],
        
      },
      // 来自父组件的row
      spu: {},
      // 收集用户勾选图片的数据
      imageList: [],
    };
  },
  methods: {
    // 获取skuForm数据
    async getData(category1Id, category2Id, spu) {
      // 收集父组件传来的数据
      this.skuInfo.category3Id = spu.category3Id;
      this.skuInfo.spuId = spu.id;
      this.skuInfo.tmId = spu.tmId;
      this.spu = spu;
      // 获取图片数据 并添加字段isDefault
      let result = await this.$API.spu.reqSpuImageList(spu.id);
      if (result.code === 200) {
        let list = result.data;
        list.forEach((item) => {
          item.isDefault = 0;
        });
        this.spuImageList = list;
      }
      // 获取销售属性的数据
      let result1 = await this.$API.spu.reqSpuSaleAttrList(spu.id);
      if (result1.code === 200) {
        this.spuSaleAttrList = result1.data;
      }
      // 获取平台属性数据
      let result2 = await this.$API.spu.reqAttrInfoList(
        category1Id,
        category2Id,
        spu.category3Id
      );
      if (result2.code === 200) {
        this.attrInfoList = result2.data;
      }
    },
    // 图片table表格复选框按钮回调
    handleSelectionChange(selection) {
      // selection可以获取用户选中的数据 数组
      this.imageList = selection;
    },
    // 设置默认 默认 按钮的切换操作 排他思想
    changeDefault(row) {
      this.spuImageList.forEach((item) => {
        item.isDefault = 0;
      });
      row.isDefault = 1;
      // 收集默认图片的地址
      this.skuInfo.skuDefalutImg = row.imgUrl;
    },
    // 取消按钮
    cancel() {
      this.$emit("changeScene1", 0);
      // 清除数据
      Object.assign(this._data, this.$options.data());
    },
    // 保存按钮
    async save() {
      // 整理参数（平台属性）
      const { attrInfoList, skuInfo, spuSaleAttrList,imageList } = this;
      // 方式一
      //#region 
      /* let arr = []
      attrInfoList.forEach(item=>{
        // 平台属性用户进行了选择
        if(item.attrIdAndValueId){
          const [attrId,valueId] = item.attrIdAndValueId.split(":")
          let obj = {attrId,valueId}
          arr.push(obj)
        }
      })
      skuInfo.skuAttrValueList = arr */
      //#endregion
      // 方式二
      skuInfo.skuAttrValueList = attrInfoList.reduce((pre, item) => {
        if (item.attrIdAndValueId) {
          const [attrId, valueId] = item.attrIdAndValueId.split(":");
          pre.push({ attrId, valueId });
        }
        return pre;
      }, []);
      // 整理参数（平台属性）
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((pre, item) => {
        if (item.attrIdAndValueId) {
          const [saleAttrId, saleAttrValueId] = item.attrIdAndValueId.split(":");
          pre.push({ saleAttrId, saleAttrValueId });
        }
        return pre;
      }, []);
      // 整理参数（图片）
      skuInfo.skuImageList = imageList.map(item=>{
        return{
          imgName:item.imgName,
          imgUrl:item.imgUrl,
          isDefault:item.isDefault,
          spuImgId:item.id
        }
      })
      // 发请求
      let result = await this.$API.spu.reqAddSku(skuInfo)
      if(result.code===200){
        this.$message({type:'success',message:'添加SKU成功'})
        this.$emit("changeScene1", 0);
      }
    },
  },
};
</script>

<style>
</style>