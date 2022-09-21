<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>文章列表</span>
      </div>
      <!-- 选择表单 -->
      <el-form :inline="true" class="demo-form-inline" ref="artForm">
        <el-form-item label="文章分类">
          <el-select placeholder="请选择分类" v-model="page.cate_id">
            <el-option
              v-for="item in allArticleCate"
              :label="item.cate_name"
              :value="item.id"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发布状态" label-width="150px">
          <el-select placeholder="请选择状态" v-model="page.state">
            <el-option label="已发布" value="已发布"></el-option>
            <el-option label="草稿" value="草稿"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="filterArticle">筛选</el-button>
          <el-button type="info" @click="resetArticle">重置</el-button>
        </el-form-item>
        <el-button type="primary" style="float: right" @click="showDialog"
          >发表文章</el-button
        >
      </el-form>

      <!-- 表格开始 -->
      <el-table
        :data="allArticle"
        style="width: 100%"
        :stripe="true"
        :border="true"
      >
        <el-table-column label="文章标题" prop="title"> </el-table-column>
        <el-table-column prop="cate_name" label="分类"> </el-table-column>
        <el-table-column prop="pub_date" label="发表时间">
          <template slot-scope="scope">
            {{ $formatDate(scope.row.pub_date) }}
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="state"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="dialogArticle(scope.row)"
              >查看</el-button
            >
            <el-button size="mini" type="danger" @click="deleteArtFn(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.pagenum"
        :page-sizes="[2, 3, 5, 10]"
        :page-size="page.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <el-dialog title="文章预览" :visible.sync="dialogVisible1" width="80%">
      <div class="title">{{ artContent.title }}</div>
      <div class="describe">
        <span>作者: {{ artContent.nickname || artContent.username }}</span>
        <span>发布时间: {{ $formatDate(artContent.pub_date) }}</span>
        <span>所属分类: {{ artContent.cate_name }}</span>
        <span>状态: {{ artContent.state }}</span>
      </div>

      <el-divider></el-divider>

      <img
        v-if="artContent.cover_img"
        :src="baseURL + artContent.cover_img"
        alt=""
      />
      <div v-html="artContent.content"></div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible1 = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 全局对话框，用于写文章 -->
    <el-dialog
      fullscreen
      center
      title="发表文章"
      :visible.sync="dialogFormVisible"
      :before-close="handleClose"
      @close="dialogClose"
    >
      <el-form :model="tableData" :rules="rules" ref="form">
        <el-form-item
          label="文章标题"
          :label-width="formLabelWidth"
          prop="title"
        >
          <el-input
            autocomplete="off"
            placeholder="请输入标题"
            v-model="tableData.title"
          ></el-input>
        </el-form-item>

        <el-form-item
          label="文章分类"
          :label-width="formLabelWidth"
          prop="cate_id"
        >
          <el-select
            placeholder="请选择分类"
            style="width: 100%"
            v-model="tableData.cate_id"
          >
            <el-option
              v-for="item in allArticleCate"
              :label="item.cate_name"
              :value="item.id"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <!-- 富文本编辑器，因为都需要校验，放在一个表单里面 -->
        <el-form-item label="文章内容" prop="content" style="display: flex">
          <quill-editor
            v-model="tableData.content"
            @blur="editorChange"
          ></quill-editor>
        </el-form-item>

        <!-- 选择封面 -->
        <el-form-item label="文章封面" prop="cover_img" style="display: flex">
          <img v-if="tableData.cover_img" :src="cover_img" alt="" />
          <img v-else src="../../assets/images/cover.jpg" alt="" />
          <input
            type="file"
            style="display: none"
            accept="image/*"
            ref="Img"
            @change="fileChange"
          />
          <el-button
            style="display: block"
            type="primary"
            icon="el-icon-search"
            size="small"
            @click="chooseImg"
            >选择图片</el-button
          >
        </el-form-item>
      </el-form>
      <div slot="footer" style="display: flex">
        <!-- 多打了个分号，导致报错且无法显示页面 -->
        <el-button
          type="primary"
          @click="ArtloadFn('已发布')"
          style="margin-left: 80px"
          >发布</el-button
        >
        <el-button type="info" @click="ArtloadFn('草稿')">存为草稿</el-button>
      </div>
    </el-dialog>
  </div>
</template>




<script>
import {
  getArtCate,
  loadArticle,
  getAllArticle,
  getOneArticle,
  deleteArt,
} from "@/api";
import { baseURL } from "@/utils/request";
export default {
  name: "MyArtList",
  data() {
    return {
      baseURL,
      artContent: {},
      dialogVisible1: false, //文章详情对话框
      isFilter: false,
      page: {
        pagenum: 1, //当前页
        pagesize: 5, //每页显示条目个数,number型
        cate_id: "",
        state: "",
      },
      total: null, //文章总数
      allArticle: [], //单页全部文章,表格用到的对象数组
      cover_img: "",
      dialogFormVisible: false,
      formLabelWidth: "80px",
      tableData: {
        title: "",
        cate_id: "",
        content: "",
        cover_img: null,
        state: "",
      },
      allArticleCate: [], //select用到的文章分类数组

      rules: {
        title: [
          { required: true, message: "请输入文章标题", trigger: "blur" },
          { min: 1, max: 30, message: "请输入1~30个字符", trigger: "blur" },
        ],
        cate_id: [
          { required: true, message: "请选择文章分类", trigger: "change" },
        ],
        content: [
          { required: true, message: "请选择文章分类", trigger: "blur" },
        ],
        cover_img: [
          { required: true, message: "请选择文章分类", trigger: "change" },
        ],
        state: [
          { required: true, message: "请选择文章分类", trigger: "change" },
        ],
      },
    };
  },
  methods: {
    showDialog() {
      this.dialogFormVisible = true;
    },
    handleClose(done) {
      this.$confirm("此操作将导致文章信息丢失, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          done();
        })
        .catch();
    },

    //获取所有分类，并渲染到选择标签上
    async getAllArtCate() {
      const { data } = await getArtCate();
      data.code === 0
        ? (this.allArticleCate = data.data)
        : this.$message.error(data.message);
      console.log(data);
    },
    chooseImg() {
      this.$refs.Img.click();
    },

    fileChange(e) {
      const files = e.target.files;
      if (files.length === 0) return;
      else {
        this.tableData.cover_img = files[0];
        // 1. 创建 FileReader 对象
        const fr = new FileReader();
        // 2. 调用 readAsDataURL 函数，读取文件内容
        fr.readAsDataURL(files[0]);
        // 3. 监听 fr 的 onload 事件
        fr.onload = (e) => {
          // 4. 通过 e.target.result 获取到读取的结果，值是字符串（base64 格式的字符串）
          this.cover_img = e.target.result;
        };
      }
      this.$refs.form.validateField("cover_img");
    },
    //富文本编辑器内容改变事件执行函数
    editorChange() {
      this.$refs.form.validateField("content");
    },

    //调用上传文章接口
    async loadArticleFn(fd) {
      const { data } = await loadArticle(fd);
      //console.log(res);
      if (data.code === 0) {
        this.getAllArticleFn(); //获取文章数据应该等上传成功后再请求才行
        this.$message.success(data.message);
      } else this.$message.error(data.message);
    },

    //表单整体校验
    ArtloadFn(str) {
      this.tableData.state = str;
      this.$refs.form.validate((valid) => {
        if (valid) {
          console.log(this.tableData);
          const fd = new FormData(); //表单数据对象的容器，html5新出专门为了装文件内容

          fd.append("cate_id", this.tableData.cate_id);
          fd.append("title", this.tableData.title);
          fd.append("content", this.tableData.content);
          fd.append("cover_img", this.tableData.cover_img);
          fd.append("state", this.tableData.state);

          this.loadArticleFn(fd);
          /* this.getAllArticleFn();将获取文章方法调用放在这里，会有bug，得到的数据未改变 */
          this.dialogFormVisible = false;
        } else {
          return false;
        }
      });
    },

    //对话框关闭之前的回调,清空表单所有值
    dialogClose() {
      this.$refs.form.resetFields();
    },

    //下面函数写成这么是为了解决bug——select标签选择后，切换页面等需要请求的时候会将select的数据一起发送给后台
    //我们只能让其在点击筛选按钮后，才能将select中的数据发送给接口
    async getAllArticleFn() {
      let pages = JSON.parse(JSON.stringify(this.page));
      pages.cate_id = "";
      pages.state = "";
      const { data } = this.isFilter
        ? await getAllArticle(this.page)
        : await getAllArticle(pages);
      this.isFilter = false;

      if (data.code === 0) {
        this.allArticle = data.data;
        this.total = data.total;
      } else this.$message.error(data.message);

      //console.log(data);
    },

    handleCurrentChange(nowPage) {
      this.page.pagenum = nowPage;
      this.getAllArticleFn();
    },

    handleSizeChange(pageSize) {
      this.page.pagenum = 1;
      this.page.pagesize = pageSize;
      this.getAllArticleFn();
    },

    //筛选功能，筛选文章
    filterArticle() {
      this.isFilter = true;
      this.page.pagenum = 1;
      this.getAllArticleFn();
    },

    async getOneArticleFn({ id }) {
      const { data } = await getOneArticle(id);
      this.artContent = data.data;
      if (data.code !== 0) this.$message.error(data.message);
    },

    //显示文章详情
    dialogArticle(article) {
      this.getOneArticleFn(article);

      this.dialogVisible1 = true;
    },

    //重置
    resetArticle() {
      (this.page.cate_id = ""), (this.page.state = ""), (this.page.pagenum = 1);
      this.getAllArticleFn();
    },

    //删除文章
    deleteArtFn(article) {
      this.$confirm("确定删除该文章吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data } = await deleteArt(article.id);
          if (data.code === 0) {
            if (this.allArticle.length === 1)
              if (this.page.pagenum !== 1) this.page.pagenum--;
            this.getAllArticleFn();
          } else this.$message.error(data.message);
        })
        .catch();
    },
  },

  //铺设数据
  created() {
    this.getAllArtCate();
    this.getAllArticleFn();
  },
};
</script>






<style scoped>
.el-table {
  margin-top: 50px;
}

/* 注意此处的用法 */
::v-deep .ql-editor {
  min-height: 500px;
}
.title {
  text-align: center;
  font-size: 20px;
  font-weight: 700;
}

.describe span:nth-child(n + 2) {
  margin-left: 15px;
}
</style>