<template>
  <el-container class="container">
    <!-- 头部开始 -->
    <el-header>
      <img src="../../assets/images/logo.png" alt="" />

      <i class="welcome"
        >欢迎 <i class="color">{{ nickname || username }}</i></i
      >

      <el-menu
        class="el-menu-demo"
        mode="horizontal"
        background-color="#23262E"
        text-color="#fff"
        active-text-color="#ffd04b"
        router
      >
        <img :src="user_pic" v-if="user_pic" alt="" class="touxiang" />
        <img
          src="../../assets/images/logo.png"
          v-else
          alt=""
          class="touxiang"
        />

        <el-submenu>
          <template slot="title">个人中心</template>
          <el-menu-item index="/user-info"
            ><i class="el-icon-user-solid"></i>基本资料</el-menu-item
          >
          <el-menu-item index="/user-avatar"
            ><i class="el-icon-camera-solid"></i>更换头像</el-menu-item
          >
          <el-menu-item index="/user-pwd"
            ><i class="el-icon-key"></i>重置密码</el-menu-item
          >
        </el-submenu>
        <el-menu-item @click="logOut"
          ><i class="el-icon-switch-button"></i>退出</el-menu-item
        >
      </el-menu>
    </el-header>
    <!-- 头部结束 -->

    <el-container>
      <el-aside width="200px">
        <!-- 侧边栏,导航菜单 -->

        <!-- $route当前路由的单独情况 -->
        <el-menu
          :default-active="$route.path"
          class="el-menu-vertical-demo tab"
          @open="handleOpen"
          @close="handleClose"
          background-color="#23262e"
          text-color="#fff"
          active-text-color="#ffd04b"
          :unique-opened="true"
          router
        >
          <!-- router  以index里为跳转地址，同时也是默认高亮的选择项-->
          <template v-for="item in Menus">
            <el-menu-item
              v-if="!item.children"
              :index="item.indexPath"
              :key="item.indexPath"
            >
              <i :class="item.icon"></i>
              <span slot="title">{{ item.title }}</span>
            </el-menu-item>

            <el-submenu v-else :index="item.indexPath" :key="item.title">
              <template slot="title">
                <i :class="item.icon"></i>
                <span>{{ item.title }}</span>
              </template>

              <el-menu-item
                v-for="child in item.children"
                :index="child.indexPath"
                :key="child.indexPath"
                ><i :class="child.icon"></i>{{ child.title }}</el-menu-item
              >
            </el-submenu>
          </template>
        </el-menu>
      </el-aside>

      <el-container>
        <el-main>
          <router-view></router-view>
          <!-- 见鬼了，明明删除了<div>123</div> ,chrome上还是有，缓存的原因吗？感觉不像  -->
        </el-main>
        <el-footer>Footer</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>
        
        
      
      
    

<script>
import { getMenus } from "@/api";
import { mapMutations, mapGetters } from "vuex";
export default {
  name: "MyLayout",

  data() {
    return {
      Menus: [],
    };
  },
  computed: {
    ...mapGetters(["nickname", "user_pic", "username"]),
  },
  async created() {
    const result = await getMenus();
    this.Menus = result.data.data;
    //console.log(this.Menus);
  },

  mounted() {
    console.log(this.$route);
  },

  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    ...mapMutations(["updateToken"]),
    logOut() {
      this.$confirm("确定退出吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.updateToken(""); //清除token
        this.$store.commit("updateUser", ""); //清除用户信息，两种写法
        //localStorage.clear(); vuex-persistedstate会更新
        this.$router.push("/log");
      });
    },

    /* beforeRouteEnter(to, from, next) {     
      //组件内路由守卫，获取用户信息,无效，不知道原因
      
    }, */
  },
};
</script>








<style scoped>
.tab {
  margin-top: 50px;
}

.color {
  color: skyblue;
  background-color: #333;
}
.container {
  width: 100vw;
  height: 100vh;
}

.el-header {
  display: flex; /* 此处的flex布局精髓 */
  justify-content: space-between;
  background: #23262e;
  color: #fff;
  line-height: 60px;
}
.el-footer {
  background-color: #23262e;
  color: #fff;
}

.el-aside {
  background-color: #23262e;
  color: #fff;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}

.touxiang {
  float: left;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-top: 10px;
}
</style>