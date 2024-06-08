<template>
  <div id="vueui-login-window">
    <div class="block-1">
      <a v-if="!loading" >
        <a-form
          ref="loginForm"
          :model="userInfo"
          class="login-form"
          layout="vertical"
          @submit="handleSubmit"
        >
            <a-form-item
            field="username"
            :rules="[{ required: true, message: '请输入账号' }]"
            :validate-trigger="['change', 'blur']"
            hide-label
          >
            <a-input
              v-model="userInfo.username"
              placeholder="账号"
            >
              <template #prefix>
                <icon-font type="icon-zhanghao" />
              </template>
            </a-input>
          </a-form-item>
          <a-form-item
            field="password"
            :rules="[{ required: true, message: '请输入密码' }]"
            :validate-trigger="['change', 'blur']"
            hide-label
          >
            <a-input-password
              v-model="userInfo.password"
              placeholder="密码"
              allow-clear
            >
              <template #prefix>
                <icon-font type="icon-lock" />
              </template>
            </a-input-password>
          </a-form-item>
          <a-button type="primary" html-type="submit" >
            登录
          </a-button>
          <br>
          <a-button type="primary" @click="handleRegister" >
            注册
          </a-button>
        </a-form>
      </a>
      <span v-else>{{ loginText }}</span>
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
    </div>  
  </div>
</template>
<script>
import { ipcApiRoute } from '@/utils/ipcMainApi';
import { ipc } from '@/utils/ipcRenderer';
import { readConfig } from "@/utils/getConfig";
import axios from 'axios';

export default {
  data() {
    return {
      loading: false, 
      loginText: '正在处理......',
      errorMessage: '',  // 添加一个用于存储错误信息的属性
      userInfo:{
        username: "",
         password:"",
      }
    };
  },
  methods: {
    handleSubmit({values, errors}) {
     if(!errors){
      this.loading = true;
      setTimeout(async() => {
        this.$router.push({ name: 'Framework', params: {}});
        var { MainWinWidth,MainWinHeight ,MainwindowTitle}=await readConfig();
        ipc.invoke(ipcApiRoute.restoreWindow, {width: MainWinWidth, height: MainWinHeight,windowTitle:MainwindowTitle}).then(r => {      
        })
      }, 1000);
     }
    }
  }


// methods: {
//   async handleSubmit({ values, errors }) {
//     if (!errors) {
//       this.loading = true;
//       this.errorMessage = ''; // 确保每次提交前错误消息被清空
//       setTimeout(async () => {
//         try {
//           const url = 'https://example.com/api/submit';
//           const response = await axios.post(url, values);

//           if (response.data.success) {
//             this.$router.push({ name: 'Framework', params: {} });
//             var { MainWinWidth, MainWinHeight, MainwindowTitle } = await readConfig();
//             await ipc.invoke(ipcApiRoute.restoreWindow, {
//               width: MainWinWidth,
//               height: MainWinHeight,
//               windowTitle: MainwindowTitle
//             });
//             this.loading = false;
//           } else {
//             // 服务器返回错误，将错误信息显示在 UI 上
//             this.errorMessage = response.data.message;
//             this.loading = false;
//           }
//         } catch (error) {
//           // 网络请求或其他错误，将错误信息显示在 UI 上
//           this.errorMessage = error.message || 'An error occurred during the request.';
//           this.loading = false;
//         }
//       }, 1000);
//     }
//   },

//   async handleRegister() {
//   this.loading = true;
//   this.errorMessage = ''; // 清空错误信息
//   try {
//     const registerUrl = 'https://example.com/api/register'; // 替换为实际的注册 API URL
//     const response = await axios.post(registerUrl, this.userInfo);

//     if (response.data.success) {
//       // 注册成功后跳转到登录或其他页面
//       this.$router.push({ name: 'Login' }); // 假设登录页面的路由名为 'Login'
//       this.loading = false;
//     } else {
//       // 服务器返回错误，将错误信息显示在 UI 上
//       this.errorMessage = response.data.message;
//       this.loading = false;
//     }
//   } catch (error) {
//     // 网络请求或其他错误，将错误信息显示在 UI 上
//     this.errorMessage = error.message || 'An error occurred during the registration.';
//     this.loading = false;
//   }
// }

// }

};
</script>

<style lang="less" scoped>
#vueui-login-window {
  width: 100%;
  min-height: 100%;
  background: var(--color-menu-light-bg);
  display: flex;
  .block-1 {
    font-size: 16px;
    align-items: center;
    margin: auto;
    display: inline-block;
  }
  .error-message {
  color: red;
  /* 更多样式 */
}
}
</style>
  