<template>
  <div>
    <el-card style="margin-bottom: 20px">
      <CategorySelect @getCategoryId="getCategoryId" :show="!isShowTable" />
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addAttr"
          >添加属性</el-button
        >
        <!-- 表格 展示平台属性 -->
        <el-table style="width: 100%" border :data="attrList">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150">
          </el-table-column>
          <el-table-column prop="prop" label="属性值列表" width="width">
            <template slot-scope="{ row }">
              <el-tag
                type="success"
                v-for="(attrValue, index) in row.attrValueList"
                :key="attrValue.id"
                style="margin: 0 10px"
                >{{ attrValue.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{ row }">
              <!-- 修改按钮 -->
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="updateAttr(row)"
              ></el-button>
              <!-- 删除按钮 -->
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加属性|修改属性 的结构 -->
      <div v-show="!isShowTable">
        <el-form :inline="true" ref="form" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input
              placeholder="请输入属性名"
              v-model="attrInfo.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addAttrValue"
          :disabled="!attrInfo.attrName"
          >添加属性值</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>
        <el-table
          style="width: 100%; margin: 20px 0"
          border
          :data="attrInfo.attrValueList"
        >
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称">
            <template slot-scope="{ row, $index }">
              <!-- input和span来回切换显示 -->
              <el-input
                v-model="row.valueName"
                placeholder="请输入属性值"
                size="mini"
                v-if="row.flag"
                @blur="toLook(row)"
                @keyup.native.enter="toLook(row)"
                :ref="$index"
              ></el-input>
              <span
                v-else
                @click="toEdit(row, $index)"
                style="display: block"
                >{{ row.valueName }}</span
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作">
            <template slot-scope="{ row, $index }">
              <!-- 删除按钮 气泡确认框-->
              <el-popconfirm
                :title="`确定删除${row.valueName}?`"
                @onConfirm="deleteAttrValue($index)"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          @click="addOrUpdateAttr"
          :disabled="attrInfo.attrValueList.length < 1"
          >保存</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
// 引入lodash中的深拷贝
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      // 接收平台属性的数据
      attrList: [],
      // 控制table显示与隐藏
      isShowTable: true,
      // 收集新增属性|修改属性
      attrInfo: {
        attrName: "",
        attrValueList: [], //属性值 可以有多个 数组形式 addAttrValue方法添加
        // categoryId: this.category3Id,  //三级分类id 不过这样写是获取不到的 因为对象(data)存储数据是无序的 addAttr方法里收集
        categoryId: 0,
        categoryLevel: 3,
      },
    };
  },
  methods: {
    // 获取子组件三级菜单传来的id
    getCategoryId({ categoryId, level }) {
      if (level === 1) {
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
      } else if (level === 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      } else {
        // 三级分类id有了发请求
        this.category3Id = categoryId;
        this.getAttrList();
      }
    },
    // 获取平台属性数据
    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this;
      let result = await this.$API.attr.reqAttrList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result.code === 200) {
        this.attrList = result.data;
      }
    },
    // 添加属性值按钮回调
    addAttrValue() {
      // 向attrValueList添加元素(id为undefined)|已有属性的添加属性值(attrId为已有属性id)
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id,
        valueName: "",
        // 给每一个属性添加一个标记 用于切换查看模式(false)与编辑模式 (span和input切换) push方法保证了flag属性是响应式的
        flag: true,
      });
      // 自动聚焦添加的属性(为最后一项)
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      });
    },
    // 添加属性按钮的回调（table展示界面）
    addAttr() {
      this.isShowTable = false;
      // 清除 收集新增属性|修改属性 数据
      this.attrInfo = {
        attrName: "",
        attrValueList: [],
        categoryId: this.category3Id,
        categoryLevel: 3,
      };
    },
    // 修改某一个属性
    updateAttr(row) {
      this.isShowTable = false;
      // 将选中的属性赋值给attrInfo 这里应该使用深拷贝(对象里有数组 多层) 不然会修改attrList(存在双向绑定)
      // 扩展运算符是浅拷贝 可以使用lodash插件实现深拷贝
      this.attrInfo = cloneDeep(row);
      // 添加flag标记
      this.attrInfo.attrValueList.forEach((element) => {
        // 下方书写发现视图不会变化 因为给对象追加属性不是响应式数据
        // element.flag = false;
        this.$set(element, "flag", false);
      });
    },
    // 失去焦点 切换为查看模式
    toLook(row) {
      if (row.valueName.trim() === "") {
        this.$message("属性值不能为空呀");
        return;
      }
      // 新增的属性值不能与已有的重复
      let isRepeate = this.attrInfo.attrValueList.some((item) => {
        //将row(当前新增的属性值)从attrValueList数组里排除进行与其他项对比
        if (row !== item) {
          return row.valueName === item.valueName;
        }
      });
      if (isRepeate) return;
      row.flag = false;
    },
    // 点击span 切换编辑模式
    toEdit(row, index) {
      row.flag = true;
      // 获取input节点 实现自动聚焦     refs[variable] variable为变量不能用.获取
      // 点击span页面会重绘 需要$nextTick获取节点
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
    },
    // 气泡确定按钮的回调 (删除相应属性值)
    deleteAttrValue(index) {
      this.attrInfo.attrValueList.splice(index, 1);
    },
    // 保存按钮 添加或修改属性
    async addOrUpdateAttr() {
      // 整理参数 (空数据不应该提交 flag字段也不需要提交) 发请求
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(
        (item) => {
          if (item.valueName !== "") {
            delete item.flag;
            return true;
          }
        }
      );
      try {
        await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo);
        this.isShowTable = true;
        this.$message({ type: "success", message: "保存成功" });
        // 保存成功再次获取平台属性进行展示
        this.getAttrList();
      } catch (error) {
        this.$message({ type: "warning", message: "保存成功" });
      }
    },
  },
};
</script>

<style>
</style>