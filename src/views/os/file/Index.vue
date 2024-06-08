<template>
  <div id="app-base-file">
    <div class="header"></div>
    <div class="content">
      <!-- 表单字段和按钮放在同一个表格中 -->
      <table class="form-table">
        <tbody>
          <tr>
            <td>文件名</td>
            <td>
              <a-input v-model="formData.fileName" placeholder="请输入文件名" class="input-width"></a-input>
            </td>
          </tr>
          <tr>
            <td>描述</td>
            <td>
              <a-textarea v-model="formData.description" placeholder="请输入文件描述" class="input-width"></a-textarea>
            </td>
          </tr>
          <tr>
            <td>分享权限</td>
            <td>
              <a-input v-model="formData.sharePermission" placeholder="请输入分享权限" class="input-width"></a-input>
            </td>
          </tr>
          <tr>
            <td>分享人</td>
            <td>
              <a-input v-model="formData.sharePerson" placeholder="请输入分享人" class="input-width"></a-input>
            </td>
          </tr>
          <tr>
            <td>操作</td>
            <td>
              <div class="action-buttons">
                <a-button @click="triggerFileInput" class="button-width">选择文件</a-button>
                <input type="file" ref="fileInput" style="display: none" @change="handleFileSelection" />
                <a-button type="primary" @click="handleSubmit" class="button-width">提交</a-button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ipc } from '@/utils/ipcRenderer';
import { host, logPath, pemPath, dataPath } from '@/global';
import { uploadToIPFS , getFileAbsPath} from '@/utils/sendJsonUploadFile';
const fs = require('fs');
const path = require('path');
 
export default {
  data() {
    return {
      formData: {
        fileName: '',
        access_ids: [], 
        access_type: '',
        description: '',
        encrypted_key:'',
      },
      cid:'',
      username: '' ,
      selectedFile: null,
      uploadHistory: [],
    };
  },
methods: {
  generateRandomKey(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(window.crypto.getRandomValues(new Uint8Array(1))[0] * charactersLength / 256);
        result += characters.charAt(randomIndex);
    }
    return result;
  },
  async loadUserData() {
      const filePath = logPath + '\\user.json'; 
      try {
        const response = await fetch(filePath);
        const data = await response.json();
        const userInfo = data[0];
        this.username = userInfo.username;
      } catch (error) {
        this.$message.error('Error reading username from JSON file:', error);
      }
    },

  async triggerFileInput() {
      getFileAbsPath(this.handleFileSelection, this.handleErrorUpload)
    },
    async handleFileSelection(data) {
        this.$message.info(data)
        this.selectedFile = data;
    },
    async handleErrorUpload(data){
      this.$message.error(data)
    },
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },
async handleSubmit() {
      if (this.formData.fileName && this.formData.description) {
        await this.loadUserData(); 
        const plaintext = window.crypto.getRandomValues(new Uint8Array(32));
        const encryptedKey = await this.rsaPublicKeyEncryption(plaintext);
        this.$message.info(plaintext.toString())
        uploadToIPFS(
          this.selectedFile,
          plaintext,
          encryptedKey,
          this.handleSuccessUpload,
          this.handleErrorUpload
        );
        
    }
    else {
      this.$message.error('请填写所有信息并选择文件');
    }
  },
  handleSuccessUpload(data, encrypted_key) {
      this.$message.success(data.toString());
      this.cid = data
      this.sendJsonUploadFileToServer(this.formData, encrypted_key);
  },
    handleErrorUpload(error) {
      this.$message.error("文件上传失败" + error);
  },

  sendJsonUploadFileToServer(formData, encryptedKey) {
    const url = host + `/upload-file`;
  try {
  const jsonData = {
     username: this.username,
     cid: this.cid,
     filename: formData.fileName,
     description: formData.description,
     access_type: formData.sharePermission,
     access_ids: formData.sharePerson,
     encrypted_key: encryptedKey,
   };
   this.recordUpload(formData.fileName);
   this.$message.info('Sending data: ' + JSON.stringify(jsonData));
   const accessToken = localStorage.getItem('accessToken');
   fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
     body: JSON.stringify(jsonData),
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('HTTP error ' + response.status);
      }
    })
    .then(data => {
        if (data.success) {
          this.$message.success();
          this.recordUpload(filePath);
        } else {
          this.$message.info(data.message);
        }
     })
    .catch(error => {
        this.$message.info( error.message);
     });
  } catch (error) {
   this.$message.info(error.message);
 }
},

async rsaPublicKeyEncryption(plaintext) {
  const publicKeyPath = pemPath + '\\ser_public_key.pem';
  try {
        const response = await fetch(publicKeyPath);
        const publicKeyPem = await response.text();
        const publicKey = await window.crypto.subtle.importKey(
          'spki',
          this.pemToArrayBuffer(publicKeyPem),
          {
            name: 'RSA-OAEP',
            hash: 'SHA-256',
          },
          false,
          ['encrypt']
        );
        const ciphertext = await window.crypto.subtle.encrypt(
          {
            name: 'RSA-OAEP',
          },
          publicKey,
          plaintext
        );  
        return btoa(String.fromCharCode.apply(null, new Uint8Array(ciphertext)));
      } catch (error) {
        this.$message.error('加密时出错: ' + error.message);
        throw error;
      }
    },
    
    pemToArrayBuffer(pem) {
      const b64Lines = pem.replace(/-----(BEGIN|END) PUBLIC KEY-----/g, "").trim();
      const b64 = b64Lines.replace(/\n/g, "");
      const binary = atob(b64);
      const len = binary.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      return bytes.buffer;
    },
    
uploadHistory() {
        const filePath = logPath + '\\upload_records.json'; 
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
    uploadTime: uploadTime, 
  };
  this.uploadHistory.push(uploadRecord); 
  this.saveUploadHistory(this.uploadHistory);
},

saveUploadHistory(records) {
  const filePath = logPath + '\\upload_records.json';

  let existingRecords;
  try {
    existingRecords = fs.readFileSync(filePath, 'utf8');
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
  },
};
</script>

<style scoped>
#app-base-file {
  padding: 0px 10px;
  text-align: left;
  width: 100%;
}

.header {
  font-size: 16px;
  padding-top: 10px;
}

.content {
  padding-top: 20px;
}

.form-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #cd4646;
}

.form-table th, .form-table td {
  padding: 8px;
  border: 1px solid #ddd;
  text-align: left;
}

.input-width {
  width: 90%; /* 调整宽度为父容器的80% */
  max-width: 700px; /* 可选：设置最大宽度 */
}

.button-width {
  width: 90%; /* 调整宽度为父容器的80% */
  max-width: 700px; /* 可选：设置最大宽度 */
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
