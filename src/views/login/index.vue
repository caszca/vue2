<template>
  <div>
    <div class="reg-container">
      <div class="reg-form">
        <div class="reg-title"></div>

        <el-form ref="form" :model="form" :rules="rule">
          <el-form-item prop="username">
            <el-input
              placeholder="请输入用户名"
              v-model="form.username"
            ></el-input>
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              placeholder="请输入密码"
              v-model="form.password"
              type="password"
            ></el-input>
          </el-form-item>

          <el-form-item>
            <el-button class="btn" type="primary" @click="onSubmit"
              >登录</el-button
            >
          </el-form-item>
          <el-link type="info" @click="$router.push('/reg')">去注册</el-link>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { login } from "@/api/index";
import { mapMutations } from "vuex";
import {} from "vuex";
export default {
  name: "MyLogin",
  data() {
    return {
      form: {
        username: "",
        password: "",
      },
      rule: {
        //校验规则
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            pattern: /^[a-zA-Z0-9]{1,10}$/,
            message: "1-10位大小写字母和数字",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            pattern: /^\S{6,15}$/,
            message: "6-15位的非空字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted() {
    //console.log(localStorage);
  },
  methods: {
    ...mapMutations(["updateToken"]),
    onSubmit() {
      this.$refs.form.validate(async (valid) => {
        //提交时，表单验证
        if (valid) {
          const { data } = await login(this.form);
          if (data.code !== 0) {
            return this.$message.error(data.message);
          }
          //成功验证
          this.$message.success(data.message);
          this.updateToken(data.token);
          this.$router.push("/");
        } else {
          return false;
        }
      });
    },
  },
};
</script>




<style lang="less" scoped>
.reg-container {
  display: flex;
  width: 100vw;
  height: 100vh;
  background: url("../../assets/images/login_bg.jpg") center no-repeat;
  background-size: cover;
  justify-content: center;
  align-items: center;

  .reg-form {
    width: 300px;
    height: 310px;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 20px;
    overflow: hidden;
    padding: 0 30px;

    .reg-title {
      height: 80px;
      background: url("../../assets/images/login_title.png") center no-repeat;
    }

    .btn {
      width: 100%;
      //transform: translate(20%, 0);
    }
  }
}
</style>