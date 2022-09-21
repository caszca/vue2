<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix box">
        <span>文章分类</span>
        <el-button type="primary" size="mini" @click="showDialog"
          >添加分类</el-button
        >
      </div>
      <el-table :data="form" style="width: 100%" :stripe="true" :border="true">
        <el-table-column type="index" label="序号" width="60px">
        </el-table-column>
        <el-table-column prop="cate_name" label="分类名称"> </el-table-column>
        <el-table-column prop="cate_alias" label="分类别名"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="changeCate(scope.row)"
              >编辑</el-button
            >
            <el-button size="mini" type="danger" @click="open(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- @close表示对话框关闭事件 -->
    <el-dialog
      :title="isEdit ? '编辑文章分类' : '添加文章分类'"
      :visible.sync="dialogFormVisible"
      @close="dialogClose"
    >
      <el-form :model="tableData" :rules="rules" ref="form">
        <el-form-item
          label="分类名称"
          :label-width="formLabelWidth"
          prop="cate_name"
        >
          <el-input v-model="tableData.cate_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="分类别名"
          :label-width="formLabelWidth"
          prop="cate_alias"
        >
          <el-input
            v-model="tableData.cate_alias"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog">取 消</el-button>
        <el-button type="primary" @click="addCateFn">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getArtCate, addCate, getOneCate, updateCate, deleteCate } from "@/api";
export default {
  name: "MyArtCate",
  data() {
    return {
      //对话框数据
      tableData: { cate_name: "", cate_alias: "" },
      //接收后台返回文章分类
      form: [],
      dialogFormVisible: false,
      formLabelWidth: "80px",

      isEdit: false,
      rules: {
        cate_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          {
            pattern: /^\S{1,10}$/,
            message: "分类名必须是1-10位的非空字符",
            trigger: "blur",
          },
        ],
        cate_alias: [
          { required: true, message: "请输入分类别名", trigger: "blur" },
          {
            pattern: /^[a-zA-Z0-9]{1,15}$/,
            message: "分类别名必须是1-15位的字母数字",
            trigger: "blur",
          },
        ],
      },
    };
  },

  async created() {
    this.getCate();
  },

  methods: {
    //获取文章分类情况
    async getCate() {
      //提前获得数据，以便挂载前编译
      const { data } = await getArtCate();
      data.code === 0
        ? //console.log(res);
          (this.form = data.data)
        : this.$message.error(data.message);
    },

    showDialog() {
      this.dialogFormVisible = true;
      this.isEdit = false;
    },

    cancelDialog() {
      this.dialogFormVisible = false;
    },

    //添加文章分类功能
    addCateFn() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          const { data } = this.isEdit
            ? await updateCate(this.tableData)
            : await addCate(this.tableData);

          if (data.code === 0) {
            this.getCate();
            this.$message.success(data.message);

            this.dialogFormVisible = false;
          } else this.$message.error(data.message);
        } else return false;
      });
    },

    //对话框关闭时回调函数
    dialogClose() {
      this.$refs.form.resetFields();
    },

    //获取单个文章分类详情
    async getOneCateFn(id) {
      const { data } = await getOneCate(id);
      //console.log(data);
      data.code === 0
        ? (this.tableData = data.data)
        : this.$message.error(data.data.message);
    },
    changeCate({ id }) {
      this.isEdit = true;
      this.dialogFormVisible = true;
      this.getOneCateFn(id);
    },

    //删除功能
    open({ id }) {
      this.$confirm("此操作将永久删除该分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deleteCateFn(id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    //删除单个文章分类详情
    async deleteCateFn(id) {
      const { data } = await deleteCate(id);
      data.code === 0
        ? this.$message.success(data.message)
        : this.$message.error(data.message);
      this.getCate();
    },
  },
};
</script>




<style scoped>
.box {
  display: flex;
  justify-content: space-between;
}
</style>