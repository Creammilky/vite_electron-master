<template>
  <div class="friend-list-container">
    <div class="friend-list">
      <h2>群组列表</h2>
      <ul>
        <li v-for="group in groups" :key="group" :class="{ active: selectedGroup === group }">
          <button @click="selectGroup(group)">{{ group }}</button>
        </li>
      </ul>
    </div>
    <div class="chat-dialogue" v-if="selectedGroup">
      <h3>群组成员</h3>
      <ul class="user-list">
        <li v-for="user in users" :key="user">
          {{ user }}
        </li>
      </ul>
      <hr>
      <h3>群组文件</h3>
      <table class="file-table">
        <thead>
          <tr>
            <th>文件名</th>
            <th>文件描述</th>
            <th>下载文件</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="file in files" :key="file.name">
            <td>{{ file.name }}</td>
            <td>{{ file.description }}</td>
            <td><button @click="decryptAndUseCID(file)">下载文件</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
const fs = require('fs');
const axios = require('axios');
import { host, logPath, pemPath } from '@/global';
import { DownloadFromIPFS } from '@/utils/downloadFile';
import path from 'path';

export default {
  data() {
    return {
      groups: [],
      selectedGroup: null,
      users: [],
      files: [],
      errorMessage: '',
    };
  },
  mounted() {
    this.getGroupsFromServer();
  },
  methods: {
    
    getGroupsFromServer() {
      const url = host + '/user_group';
      const accessToken = localStorage.getItem('accessToken');

      fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
      })
        .then(response => {
          if (response.ok) {
            return response.json(); // 将响应体转换为JSON
          } else {
            throw new Error('Unable to fetch groups');
          }
        })
        .then(data => {
          if (data.groups) {
            this.groups = data.groups; // 将获取到的群组列表存储到groups中
          } else {
            throw new Error('No groups found');
          }
        })
        .catch(error => {
          this.errorMessage = error.message; // 错误处理，显示错误消息
        });
    },
    selectGroup(group) {
      this.selectedGroup = group;
      const accessToken = localStorage.getItem('accessToken');
      const url = host + '/group_info';

      fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ groupName: group })
      })
        .then(response => {
          if (response.ok) {
            return response.json();  // 将响应体转换为JSON
          } else {
            throw new Error('Unable to fetch group details');
          }
        })
        .then(data => {
          if (data.group_users && data.group_files) {
            this.users = data.group_users;  // 从响应中分配群组用户列表
            this.files = data.group_files.map(file => ({
              name: file.filename,
              description: file.description,
              details: {
                cid: file.cid,
                key: file.data_key
              }
            }));
            const filePath = logPath + '\\groups.json';
            const content = JSON.stringify({ users: this.users, files: this.files }, null, 2);
            fs.writeFile(filePath, content, (err) => {
              if (err) {
                console.error('写入文件失败:', err);
              } else {
                console.log('群组信息已保存到:', filePath);
              }
            });
          } else {
            throw new Error('No data found for group');
          }
        })
        .catch(error => {
          console.error('获取群组详细信息失败', error);
          this.errorMessage = error.message || 'Error occurred during group info retrieval';
        });
    },
    // downloadFile(file) {
    //   // 实现下载文件的逻辑
    //   this.$message.success(file.name + ' | ' + file.description);
    //   decryptAndUseCID(file)
    //   console.log('下载文件:', file);
    // },
    //med
    decryptAndUseCID(result) {

      // const { filename } = result;
      this.$message.success(result.details.key);
      // this.recordUpload(filename);
      // const foundResult = this.searchResults.find(item => item.filename === filename);
      const foundResult = this.files.find(item => item.name === result.name);
      if (!foundResult) {
        this.$message.info('无法找到匹配的文件信息');
        return;
      }
      else{
        this.$message.success('||');
      };
      const { cid, key } = foundResult.details;
      const AESkey = this.decryptCID(key, cid)
        .then(decryptedCID => {
          this.$message.info('密钥解密成功');
        })
        .catch(error => {
          this.$message.info('解密密钥时发生错误:', error);
        });
      // this.saveDataKeyToFile(AESkey) ;  
      //在这里添加解密文件/下载文件代码 cid,AESkey
      // this.$message.info(AESkey.toString)
      // const uint8Array = new Uint8Array(AESkey);
    },
    handleSuccessUpload(data) {
      this.$message.success(data.toString());
    },
    handleErrorUpload(error) {
      this.$message.error("文件下载失败" + error);
    },

    saveDataKeyToFile(dataKey) {
      const blob = new Blob([dataKey], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'dataKey.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, //用于查看解密内容

    async decryptCID(dataKey, cid) {
      const privateKeyPath = pemPath + '\\privateKey.pem';
      try {
        const response = await fetch(privateKeyPath);
        const privateKeyPem = await response.text();
        const privateKey = await window.crypto.subtle.importKey(
          'pkcs8',
          this.pemToArrayBuffer(privateKeyPem),
          {
            name: 'RSA-OAEP',
            hash: { name: "SHA-256" },
          },
          false,
          ['decrypt']
        );
        // Base64解码dataKey
        this.$message.info(dataKey)

        const encryptedArrayBuffer = this.base64ToArrayBuffer(dataKey);
        this.$message.info("Hello")
        // 使用私钥解密
        const plaintextArrayBuffer = await window.crypto.subtle.decrypt(
          {
            name: 'RSA-OAEP',
          },
          privateKey,
          encryptedArrayBuffer,
        );
        // this.saveDataKeyToFile(plaintextArrayBuffer) ;   
        // this.$message.info(encryptedArrayBuffer);
        const uint8Array = new Uint8Array(plaintextArrayBuffer);
        // this.$message.info(uint8Array.toString());
        DownloadFromIPFS(
          cid,
          uint8Array,
          this.handleSuccessUpload,
          this.handleErrorUpload
        );
        return plaintextArrayBuffer;
      } catch (error) {
        this.$message.error('解密时出错: ' + error);
        console.error('解密时出错:', error);
        throw error;
      }
    },

    pemToArrayBuffer(pem) {
      const b64Lines = pem.replace(/-----(BEGIN|END) PRIVATE KEY-----/g, "").trim();
      const b64 = b64Lines.replace(/\n/g, "");
      const binary = window.atob(b64);
      const len = binary.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binary.charCodeAt(i);
      }

      return bytes.buffer;
    },

    base64ToArrayBuffer(base64) {
      const binaryString = window.atob(base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes.buffer;  // 确保返回的是ArrayBuffer
    },

    uploadHistory() {
      const filePath = logPath + '\\g-download_records.json'; // Replace with your actual record JSON file path
      try {
        const data = fs.readFileSync(filePath, 'utf8');
        this.uploadHistory = JSON.parse(data);
      } catch (error) {
        console.error('Error reading upload records:', error);
        this.uploadHistory = [];
      }
    },

    recordUpload(fileName) {

      const uploadTime = new Date().toLocaleDateString();
      const uploadRecord = {
        fileName: fileName,
        downloadTime: uploadTime,
      };
      this.$message.info("112")
      this.uploadHistory.push(uploadRecord); // 将上传记录添加到历史记录数组

      this.saveUploadHistory(this.uploadHistory); // 保存上传历史记录
    },

    saveUploadHistory(records) {
      const filePath = logPath + '\\g-download_records.json';

      // 读取现有文件内容
      let existingRecords;
      try {
        existingRecords = fs.readFileSync(filePath, 'utf8');
        // 如果文件为空或者不存在，则初始化为空数组
        if (!existingRecords) {
          existingRecords = '[]';
        }
      } catch (error) {
        console.error('Error reading existing upload records:', error);
        existingRecords = '[]';
      }

      let parsedRecords = JSON.parse(existingRecords);

      parsedRecords.push(...records);

      fs.writeFileSync(filePath, JSON.stringify(parsedRecords, null, 2), 'utf8');
    },

    handleSuccess(data) {
      this.searchResults = data;
    },
    handleError(error) {
      console.error('An error occurred:', error);
    }
  }
}
</script>

<style scoped>
.friend-list-container {
  display: flex;
  width: 100%;
}

.friend-list {
  flex: 1;
}

.chat-dialogue {
  flex: 2;
}

.friend-list ul {
  padding: 0;
}

.friend-list li {
  list-style: none;
}

.friend-list button {
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #f0f0f0;
  border: none;
  text-align: left;
  color: #333;
  cursor: pointer;
}

.friend-list button:hover {
  background-color: #e6e6e6;
}

.friend-list .active button {
  background-color: #3c62eb;
  /* Active item background color */
  color: white;
  /* Active item text color */
}

.chat-dialogue {
  background-color: #ffffff;
  padding: 20px;
}

.user-list {
  text-align: left;
  /* 用户名左对齐 */
}

.file-table {
  width: 100%;
  border-collapse: collapse;
}

.file-table th,
.file-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.file-table th {
  background-color: #f2f2f2;
}
</style>
