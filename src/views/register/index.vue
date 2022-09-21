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

          <el-form-item prop="repassword">
            <el-input
              placeholder="请再次确认密码"
              v-model="form.repassword"
              type="password"
            ></el-input>
          </el-form-item>

          <el-form-item>
            <el-button class="btn" type="primary" @click="onSubmit"
              >注册</el-button
            >
          </el-form-item>
          <el-link type="info" @click="login">去登陆</el-link>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { register } from "@/api/index";

export default {
  name: "MyRegister",
  data() {
    const samePWD = (rule, value, callback) => {
      if (value === this.form.password) {
        callback();
      } else {
        callback(new Error("两次密码输入不一致"));
      }
    };
    return {
      form: {
        username: "",
        password: "",
        repassword: "",
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
        repassword: [
          { required: true, message: "请再次输入密码", trigger: "blur" },
          {
            validator: samePWD,
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted() {
    //console.log(this.$message.error("s"));
    console.log(this);
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          const { data } = await register(this.form);
          if (data.code !== 0) return this.$message.error(data.message);
          this.$message.success(data.message);
          this.$router.push("/log");
        } else {
          return false; //阻止默认提交行为
        }
      });
    },

    login() {
      this.$router.push("/log");
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
    height: 370px;
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