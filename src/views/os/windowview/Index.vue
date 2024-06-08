<template>
  <div class="friend-list-container">
    <div class="friend-list">
      <h2></h2>
      <table class="history-table">
        <thead>
          <tr>
            <th>文件名</th>
            <th>上传时间</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(record, index) in uploadHistory" :key="index">
            <td>{{ record.fileName }}</td>
            <td>{{ record.uploadTime }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import fs from 'fs';
import path from 'path';

export default {
  data() {
    return {
      uploadHistory: [], // 存储上传历史记录
    };
  },
  mounted() {
    this.loadUploadHistory(); // 页面加载后加载上传历史记录
  },
  methods: {
    loadUploadHistory() {
      const filePath = '../../log/upload_records.json'; // 替换为你的 JSON 文件路径
      console.log('Reading file from path:', filePath);
      fetch(filePath)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          console.log('File data:', data);
          this.uploadHistory = data;
        })
        .catch(error => {
          console.error('There was a problem with the fetch operation:', error);
        });
    },
  },
};
</script>

<style scoped>
.friend-list-container {
   display: flex;
   width: 100%;
}

.friend-list {
   flex: 1;
}

.history-table {
   width: 100%;
   border-collapse: collapse;
}

.history-table th,
.history-table td {
   border: 1px solid #ddd;
   padding: 8px;
   text-align: center; /* 修改这里 */
}

.history-table th {
   background-color: #f2f2f2;
}
</style>