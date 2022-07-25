<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="showDialog"
      >添加</el-button
    >
    <!-- 表格 -->
    <el-table style="width: 100%" border :data="list">
      <el-table-column type="index" label="序号" width="80px" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width">
      </el-table-column>
      <el-table-column prop="logoUrl" label="品牌LOGO" width="width">
        <!-- element已经封装好的作用域插槽 数据来源于el-table-->
        <template slot-scope="{ row }">
          <img :src="row.logoUrl" width="80px" height="80px" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="updateTradeMark(row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteTradeMark(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      :pager-count="7"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      layout=" prev, pager, next, jumper,->,sizes,total"
      style="margin-top: 20px; text-align: center"
    >
    </el-pagination>
    <!-- 对话框   
          :visible.sync 控制对话框显示与隐藏
    -->
    <el-dialog
      :title="tmForm.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
    >
      <!-- 表单 
            :model 收集表单数据需要用到的数据  表单验证也需要这个属性
            :rules rules 属性传入约定的验证规则，并将 Form-Item 的 prop 属性设置为需校验的字段名即可
      -->
      <el-form style="width: 80%" :model="tmForm" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <!-- el-upload上传文件组件  action:设置上传文件的地址 要加上 dev-api 请求是element发的-->
          <el-upload
            class="avatar-uploader"
            action="dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "TradeMark",
  data() {
    let validateTmName = (rule, value, callback) => {
      if (value.length < 2 || value.length > 10) {
        callback(new Error("品牌名称为2-10位"));
      } else {
        callback();
      }
    };
    return {
      // 分页器第几页
      page: 1,
      //每一页展示条数
      limit: 5,
      //总数居体条数
      total: 0,
      //表格展示的数据
      list: [],
      // 对话框显示与隐藏
      dialogFormVisible: false,
      // 上传图片使用的属性
      imageUrl: "",
      // 收集品牌信息 对象身上的属性要和后台接口key一致
      tmForm: {
        tmName: "",
        logoUrl: "",
      },
      // 表单验证规则 (品牌名称和品牌logo)
      rules: {
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          { validator: validateTmName, trigger: "change" },
        ],
        logoUrl: [{ required: true, message: "请选择品牌Logo" }],
      },
    };
  },
  mounted() {
    this.getPageList();
  },
  methods: {
    // 获取品牌列表
    async getPageList() {
      const { page, limit } = this;
      let result = await this.$API.trademark.reqTradeMarkList(page, limit);
      if (result.code === 200) {
        this.total = result.data.total;
        this.list = result.data.records;
      }
    },
    // 当前页改变时会触发
    handleCurrentChange(page) {
      this.page = page;
      this.getPageList();
    },
    // 每一页展示数据条数发生变化出发
    handleSizeChange(limit) {
      this.limit = limit;
      this.getPageList();
    },
    // 点击添加品牌
    showDialog() {
      this.dialogFormVisible = true;
      // 每次添加时清空上一次添加的品牌信息
      this.tmForm = { tmName: "", logoUrl: "" };
    },
    // 修改某一个品牌(点击修改按钮时触发)
    updateTradeMark(row) {
      // row是当前用户选中品牌的信息 饿了么ui对slot进行二次封装 可以接收到table传给的数据
      // console.log(row);
      this.dialogFormVisible = true;
      // 保存该品牌的信息
      // 不能直接赋值row  当tmForm变化时页面上的row数据也会发生变化 引用类型简单赋值是存在引用关系的 使用扩展运算符可以解决(浅拷贝)
      this.tmForm = { ...row };
    },
    // 图片上传相关（成功和之前）
    handleAvatarSuccess(res, file) {
      // res 服务器返回的数据   file 含有文件名 上传时间等信息 也包括res
      this.tmForm.logoUrl = res.data;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    // 添加品牌|修改品牌  (两个按钮公用一个对话框 点击确定时触发)
    addOrUpdateTradeMark() {
      this.$refs.ruleForm.validate(async (success) => {
        if (success) {
          this.dialogFormVisible = false;
          let result = await this.$API.trademark.reqAddOrUpdateTradeMark(
            this.tmForm
          );
          if (result.code === 200) {
            // 弹出成功信息
            this.$message({
              message: this.tmForm.id ? "修改品牌成功" : "添加品牌成功",
              type: "success",
            });
            this.getPageList();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 删除品牌
    deleteTradeMark(row) {
      this.$confirm(`确定删除${row.tmName}?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          // 点击确定按钮发请求
          let result = await this.$API.trademark.reqDeleteTradeMark(row.id);
          if (result.code === 200) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getPageList();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>