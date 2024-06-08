<template>
  <div class="user-profile">
    <div class="profile-wrapper">
      <div class="avatar">
        <!-- 你的头像图片，这里使用了本地图片 -->
        <img src="public\log\user.jpg" alt="Avatar" />
      </div>
      <div class="user-info">
        <table class="account-info-table">
          <colgroup>
            <col style="width: 50%;" />
            <col style="width: 50%;" />
          </colgroup>
          <tr>
            <td><label for="username">账号：</label></td>
            <td><input id="username" v-model="user.username" disabled /></td>
          </tr>
          <tr>
            <td><label for="password">密码：</label></td>
            <td><input id="password" type="password" v-model="user.password" disabled /></td>
          </tr>
          <tr>
            <td><label for="newPassword">新密码：</label></td>
            <td><input id="newPassword" type="password" v-model="newPassword" /></td>
          </tr>
          <tr>
            <td colspan="2" style="text-align: right;">
              <button @click="updateProfile">修改密码</button>
            </td>
          </tr>
        </table>
      </div>
    </div>
    <h2>文件信息</h2>
    <table class="my-files-table">
      <colgroup>
        <col style="width: 50%;" />
        <col style="width: 50%;" />
      </colgroup>
      <thead>
        <tr>
          <th>文件名</th>
          <th>存储位置</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(file, index) in myFiles" :key="index">
          <td>{{ file.name }}</td>
          <td>{{ file.location }}</td>
        </tr>
      </tbody>
    </table>
    <p class="error-message">{{ errorMessage }}</p>
  </div>
</template>

<script>
import axios from 'axios';
const fs = require('fs');

export default {
  data() {
    return {
      user: {
        username: '',
        password: ''
      },
      newPassword: '',
      errorMessage: '',
      myFiles: [] // 用于存储我的文件数据
    };
  },

  mounted() {
    this.loadUserData(this.showUserInfo);
    this.loadMyFiles(); // 加载我的文件数据
  },

  methods: {
    loadUserData(callback) {
      fs.readFile('E:\\6\\vite_electron-master-final(1)\\vite_electron-master\\public\\log\\user.json', 'utf8', (err, data) => {
        if (err) {
          this.errorMessage = 'Failed to fetch user data: ' + err.message;
          return;
        }
        try {
          const users = JSON.parse(data);
          if (users.length > 0) {
            this.user = users[0]; // Assume the first user is the one we want
            callback(); // Call the callback function after loading user data
          } else {
            this.errorMessage = 'No user data available';
          }
        } catch (error) {
          this.errorMessage = 'Error parsing JSON data: ' + error.message;
        }
      });
    },

    showUserInfo() {
      // This function is called after loading user data
      // You can add any additional logic here if needed
    },

    updateProfile() {
      if (this.newPassword) {
        // 更新用户密码
        this.user.password = this.newPassword;

        // 将更新后的用户数据写入到user.json文件中
        const filePath = 'E:\\6\\vite_electron-master-final(1)\\vite_electron-master\\public\\log\\user.json';
        fs.readFile(filePath, 'utf8', (err, data) => {
          if (err) {
            console.error('Failed to update user data:', err);
            this.errorMessage = 'Failed to update user data: ' + err.message;
            return;
          }

          try {
            // 解析现有用户数据
            const users = JSON.parse(data);
            // 更新密码
            users[0].password = this.newPassword;

            // 将更新后的用户数据写回文件
            fs.writeFile(filePath, JSON.stringify(users), 'utf8', (err) => {
              if (err) {
                console.error('Failed to update user data:', err);
                this.errorMessage = 'Failed to update user data: ' + err.message;
                return;
              }
              // 更新成功后提示用户
              alert('密码已更新');
            });
          } catch (error) {
            console.error('Error parsing user data:', error);
            this.errorMessage = 'Error parsing user data: ' + error.message;
          }
        });
      } else {
        alert('请输入新密码');
      }
    },
    loadMyFiles() {
      fs.readFile('E:\\6\\vite_electron-master-final(1)\\vite_electron-master\\public\\log\\myfile.json', 'utf8', (err, data) => {
        if (err) {
          this.errorMessage = 'Failed to fetch file data: ' + err.message;
          return;
        }
        try {
          this.myFiles = JSON.parse(data); // 将文件数据存储在 myFiles 中
        } catch (error) {
          this.errorMessage = 'Error parsing JSON data: ' + error.message;
        }
      });
    }
  }
}
</script>

<style lang="less" scoped>
.user-profile {
  width: 100%;
  min-height: 100%;
  background: var(--color-menu-light-bg);
  display: flex;
  flex-direction: column;
  align-items: center;
}

h2 {
  margin-top: 60px;
}

.profile-wrapper {
  display: flex;
  align-items: center;
}

.avatar {
  margin-right: 30px;
}

.avatar img {
  width: 150px; /* 设置头像的宽度 */
  height: 150px; /* 设置头像的高度 */
  object-fit: cover; /* 保持图片的纵横比，并裁剪使其适合框 */
  border-radius: 50%;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.account-info-table {
  margin-top: 20px;
  border-collapse: collapse;
  width: 100%; /* 控制表格宽度 */
  margin-left: auto; /* 设置表格左边距为自动，使其水平居中 */
  margin-right: auto; /* 设置表格右边距为自动，使其水平居中 */
}

table th,
table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

table th {
  background-color: #f2f2f2;
}

button {
  margin-top: 10px;
}

.error-message {
  color: red;
}
</style>
