<template>
  <div id="vueui-login-window">
    <div class="block-1">
      <a v-if="!loading" >
        <a-form
          ref="loginForm"
          :model="userInfo"
          class="login-form"
          layout="vertical"
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
          <a-button type="primary" @click="handleSubmit" >
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
import { host, logPath, pemPath } from '@/global';
import axios from 'axios';

const fs = require('fs'); // 引入文件系统模块
const path = require('path'); // 引入路径模块

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
  // methods: {
  //   handleSubmit({values, errors}) {
  //    if(!errors){
  //     this.loading = true;
  //     setTimeout(async() => {
  //       this.$router.push({ name: 'Framework', params: {}});
  //       var { MainWinWidth,MainWinHeight ,MainwindowTitle}=await readConfig();
  //       ipc.invoke(ipcApiRoute.restoreWindow, {width: MainWinWidth, height: MainWinHeight,windowTitle:MainwindowTitle}).then(r => {      
  //       })
  //     }, 1000);
  //    }
  //   }
  // }


  methods: {
  async handleSubmit() {
    this.loading = true;
    this.errorMessage = ''; // 确保每次提交前错误消息被清空
    this.fileContent = ''; 
    this.errorMessage1 = ''; 
    this.errorMessage2 = ''; 

    try {
      const url = host + '/sign-in-client';
      const json_data = {
        username: this.userInfo.username,
        password: this.userInfo.password,
      };

      const response = await axios({
        url: url,
        method: 'post',
        data: JSON.stringify(json_data),
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.status === 200) {
        // 从响应数据中获取 access token
        const data = response.data;
        localStorage.setItem('accessToken', data.access_token); // 保存令牌到LocalStorage
        saveUserData(json_data);
        this.$router.push({ name: 'Framework', params: {} });

        // 读取配置并恢复窗口
        var { MainWinWidth, MainWinHeight, MainwindowTitle } = await readConfig();
        ipc.invoke(ipcApiRoute.restoreWindow, { width: MainWinWidth, height: MainWinHeight, windowTitle: MainwindowTitle }).then(r => {});
      } else {
        // 服务器返回错误，将错误信息显示在 UI 上
        this.errorMessage = response.data.message || '登录失败';
        this.loading = false;
      }
    } catch (error) {
      // 网络请求或其他错误，将错误信息显示在 UI 上
      this.errorMessage = error.message || 'An error occurred during the request.';
      // this.errorMessage = '111';
      this.loading = false;
    }


  function saveUserData(data) {
    // 清空文件并写入一个空数组
      fs.writeFile(logPath + '\\user.json', '[]', (err) => {
        if (err) {
          console.error('Error clearing user data file:', err);
        } else {
          // 读取文件内容，将新的数据追加到数组中
          fs.readFile(logPath + '\\user.json', 'utf8', (err, fileData) => {
            if (err) {
              console.error('Error reading user data file:', err);
            } else {
              let jsonArray = JSON.parse(fileData);
              jsonArray.push(data);

              // 写入更新后的数组
              fs.writeFile(logPath + '\\user.json', JSON.stringify(jsonArray, null, 2), (err) => {
                if (err) {
                  console.error('Error writing user data to file:', err);
                } else {
                  console.log('User data saved successfully.');
                }
              });
            }
          });
        }
      });
    }
  },


  async handleRegister() {
  this.loading = true;
  this.errorMessage = '';
  this.errorMessage1 = '';
  this.errorMessage2 = ''; // 清空错误信息

  try {
    // 生成密钥对并保存
    const keyPair = await generateKeyPair();
    const publicKeyPem = await exportPublicKey(keyPair.publicKey);
    const privateKeyPem = await exportPrivateKey(keyPair.privateKey);

    // 保存公钥和私钥
    await saveKeyToFile('publicKey.pem', publicKeyPem);
    await saveKeyToFile('privateKey.pem', privateKeyPem);
    const content = await fs.promises.readFile(pemPath + '\\publicKey.pem', 'utf8');
    this.errorMessage1='111';

    const registerUrl = host + '/sign-up-client'; // 替换为实际的注册 API URL
    const json_data = {
      username: this.userInfo.username,
      password: this.userInfo.password,
      public_key: content,
    };
    this.errorMessage2 = '222';
    // 发送POST请求到后端
    const response = await axios({
      url: registerUrl,
      method: 'post',
      data: JSON.stringify(json_data),
      headers: { 'content-type': 'application/json' }
    });

    if (response.status === 200) {
      // 跳转到登录或其他页面
      this.$router.push({ name: 'Login' });
    } else {
      this.errorMessage = response.data.message;
    }
  } catch (error) {
    this.errorMessage = error.message || 'An error occurred during the registration.';
  } finally {
    this.loading = false;
  }

 // 定义生成密钥对的函数
  async function generateKeyPair() {
      try {
          const keyPair = await window.crypto.subtle.generateKey({
              name: "RSA-OAEP",
              modulusLength: 2048,  // 密钥长度
              publicExponent: new Uint8Array([1, 0, 1]),  // 通常为65537
              hash: "SHA-256",  // 使用的哈希算法
          }, 
          true,  // 密钥是否可导出
          ["encrypt", "decrypt"]);  // 密钥用途
          return keyPair;
      } catch (error) {
        this.errorMessage = "密钥生成错误：";
      }
    }

    // 导出公钥
    async function exportPublicKey(key) {
        const exported = await window.crypto.subtle.exportKey("spki", key);
        const exportedAsBase64 = btoa(String.fromCharCode(...new Uint8Array(exported)));
        return `-----BEGIN PUBLIC KEY-----\n${exportedAsBase64}\n-----END PUBLIC KEY-----`;
    }

    // 导出私钥
    async function exportPrivateKey(key) {
        const exported =await window.crypto.subtle.exportKey("pkcs8", key);
        const exportedAsBase64 = btoa(String.fromCharCode(...new Uint8Array(exported)));
        return `-----BEGIN PRIVATE KEY-----\n${exportedAsBase64}\n-----END PRIVATE KEY-----`;
    }

    // 保存文件到本地
    async function saveKeyToFile(filename, content) {
        const filePath = path.join(pemPath, filename);
        try {
          await fs.promises.writeFile(filePath, content);
          this.errorMessage='444';
          console.log(`${filename} 已保存至 ${filePath}`);
        } catch (err) {
          console.error('文件保存失败:', err);
        }
    }
  }
}
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
  