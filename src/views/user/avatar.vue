<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>个人头像</span>
    </div>
    <img v-if="!avatar" src="../../assets/images/avatar.jpg" alt="" />
    <img v-else :src="avatar" alt="" />
    <input
      type="file"
      accept="image/*"
      style="display: none"
      ref="Img"
      @change="fileChange"
    />
    <!-- 文件选择，change事件，所有image格式 ,隐藏起来，因为不美观-->
    <el-button type="primary" icon="el-icon-search" @click="chooseImg"
      >选择图片</el-button
    >
    <el-button
      type="primary"
      icon="el-icon-upload "
      @click="uploadImg"
      :disabled="!avatar"
      >上传头像</el-button
    >
  </el-card>
</template>

<script>
import { updateAvatar } from "@/api";
export default {
  name: "MyAvatar",
  data() {
    return {
      avatar: "",
    };
  },
  methods: {
    chooseImg() {
      this.$refs.Img.click(); //原生DOM触发点击事件
    },
    fileChange(e) {
      const files = e.target.files;
      if (files.length === 0) return;
      else {
        // 1. 创建 FileReader 对象
        const fr = new FileReader();
        // 2. 调用 readAsDataURL 函数，读取文件内容
        fr.readAsDataURL(files[0]);
        // 3. 监听 fr 的 onload 事件
        fr.onload = (e) => {
          // 4. 通过 e.target.result 获取到读取的结果，值是字符串（base64 格式的字符串）
          this.avatar = e.target.result;
        };
      }
    },

    //上传图片
    async uploadImg() {
      console.log(this.avatar);
      const { data } = await updateAvatar(this.avatar);
      if (data.code !== 0) {
        this.$message.error(data.message);
      } else {
        this.$message.success(data.message);
        this.$store.dispatch("getUser");
      }
    },
  },
};
</script>

<style scoped>
img {
  display: block;
  margin-bottom: 30px;
}
</style>