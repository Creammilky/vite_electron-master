<template>
  <div id="app-base-notification">
    <div class="one-block-1"></div>
    <div class="one-block-2">
      <a-input v-model="searchQuery" class="search-input" placeholder="请输入搜索内容" />
      <br>
      <a-button type="primary" @click="search" class="button-width">搜索</a-button>
    </div>
    <div class="one-block-1"></div>
    <div class="one-block-2">
      <table class="result-table">
        <thead>
          <tr>
            <th>文件名</th>
            <th>描述</th>
            <th>  </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(result, index) in searchResults" :key="index">
            <td>{{ result.filename }}</td>
            <td>{{ result.description }}</td>
            <td>
      <a-button type="primary" @click="decryptAndUseCID(result)">下载</a-button>
           </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>



<script>
import { ipcApiRoute } from '@/utils/ipcMainApi';
import { ipc } from '@/utils/ipcRenderer';
import { host, logPath, pemPath } from '@/global';
import { DownloadFromIPFS } from '@/utils/downloadFile';
const fs = require('fs');
const path = require('path');


export default {
  data() {
    return {
      searchQuery: '',
      searchResults: [],
      username: '', // 初始化用户名为空字符串
      decryptedCIDs: {}, // 用于存储解密后的 CID
      cid: '',
      uploadHistory: [],
    };
  },
  mounted() {
    this.loadUserInfo();
    this.init();
  },
  methods: {
    loadUserInfo() {
      const filePath = logPath + '\\user.json';
      fetch(filePath)
        .then(response => response.json())
        .then(data => {
          const userInfo = data[0];
          this.username = userInfo.username;
        })
        .catch(error => {
          console.error('Error reading username from JSON file:', error);
        });
    },
    init() {
      ipc.removeAllListeners(ipcApiRoute.sendNotification);
      ipc.on(ipcApiRoute.sendNotification, (event, result) => {
        if (Array.isArray(result)) {
          this.searchResults = result;
        } else {
          this.$message.error('搜索结果格式错误');
        }
      });
    },
    search() {
      if (!this.searchQuery.trim()) {
        this.$message.error('请输入搜索内容');
        return;
      }
      this.sendJsonDownloadFileToServer(
        { filename: this.searchQuery.trim() },
        this.handleSuccess,
        this.handleError
      );
    },

    sendJsonDownloadFileToServer(searchData, successCallback, errorCallback) {
      const url = host + `/search-files`;
      const searchDataJson = {
        username: this.username,
        filename: searchData.filename
      };
      this.$message.info('Sending search data: ' + JSON.stringify(searchDataJson));
      const accessToken = localStorage.getItem('accessToken');

      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(searchDataJson)
      })
        .then(response => response.json())
        .then(data => {
          successCallback(data);
        })
        .catch(error => {
          errorCallback(error);
        });
    },
    decryptAndUseCID(result) {
      const { filename } = result;
      this.recordUpload( filename );
      const foundResult = this.searchResults.find(item => item.filename === filename);
      if (!foundResult) {
        this.$message.info('无法找到匹配的文件信息');
        return;
      }
      const { cid, data_key } = foundResult;
      const AESkey = this.decryptCID(data_key, cid)
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
        const encryptedArrayBuffer = this.base64ToArrayBuffer(dataKey);

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
      const filePath = logPath + '\\download_records.json'; // Replace with your actual record JSON file path
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
      this.uploadHistory.push(uploadRecord); // 将上传记录添加到历史记录数组
      this.saveUploadHistory(this.uploadHistory); // 保存上传历史记录
    },

    saveUploadHistory(records) {
      const filePath = logPath + '\\download_records.json';

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
};
</script>

<style scoped>
#app-base-window {
    padding: 0px 10px;
    text-align: left;
    width: 100%;
}

.one-block-1 {
    font-size: 16px;
    padding-top: 10px;
}

.result-table {
    width: 100%;
    border-collapse: collapse;
}

.result-table th,
.result-table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center; /* 修改这里 */
}

.result-table th {
    background-color: #f2f2f2;
}
.button-width {
  width: 90%; /* 调整宽度为父容器的80% */
  max-width: 900px; /* 可选：设置最大宽度 */
}
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
#app-base-notification {
  display: flex;
  flex-direction: column;
  align-items: center; /* 居中内容 */
}

.one-block-1,
.one-block-2 {
  width: 90%; /* 设置块的宽度为100% */
  max-width: 900px; /* 可选：设置最大宽度 */
}

.result-table {
  width: 90%;
  max-width: 900px; /* 设置表格的最大宽度 */
  margin: auto; /* 居中表格 */
}
.search-input {
  width: 90%; /* 设置搜索框的宽度为父容器的80% */
  max-width: 900px; /* 可选：设置最大宽度 */
}



</style>

