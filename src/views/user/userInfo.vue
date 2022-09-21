<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>基本资料</span>
    </div>

    <!-- 表单开始 -->
    <el-form
      :model="userInfo"
      status-icon
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="登录名称">
        <el-input
          autocomplete="off"
          v-model="userInfo.username"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="用户昵称" prop="nickname">
        <el-input autocomplete="off" v-model="userInfo.nickname"></el-input>
      </el-form-item>
      <el-form-item label="用户邮箱" prop="email">
        <el-input v-model="userInfo.email"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>






<script>
import { updateUserInfo } from "@/api";
export default {
  name: "userInfo",
  data() {
    return {
      userInfo: {
        id: this.$store.state.userInfo.id,
        nickname: "",
        email: "",
        username: this.$store.state.userInfo.username,
      },

      rules: {
        nickname: [
          { required: true, message: "请输入用户昵称", trigger: "blur" },
          {
            pattern: /^\S{1,10}$/,
            message: "昵称必须是1-10位的非空字符串",
            trigger: "blur",
          },
        ],

        email: [
          { required: true, message: "请输入用户邮箱", trigger: "blur" },
          { type: "email", message: "请输入正确的邮箱格式", trigger: "blur" },
        ],
      },
    };
  },

  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    onSubmit() {
      //成功验证
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          const res = await updateUserInfo(this.userInfo);
          if (res.data.code === 0) {
            this.$message.success(res.data.message);
            this.$store.dispatch("getUser");
          } else {
            this.$message.error(res.data.message);
          }
        } else {
          return false;
        }
      });
    },
  },
  mounted() {},
};
</script>

<style scoped>
.el-input {
  width: 500px;
}
</style>