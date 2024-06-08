<template>
  <div id="app-base-window">
    <div class="one-block-1">
    </div>
    <div class="history-content">
      <h2></h2>
      <table class="history-table">
        <thead>
          <tr>
            <th>文件名</th>
            <th>下载时间</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(record, index) in downloadHistory" :key="index">
            <td>{{ record.fileName }}</td>
            <td>{{ record.downloadTime }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      downloadHistory: [], // 存储下载历史记录
    };
  },
  mounted() {
    this.loadDownloadHistory(); // 页面加载后加载下载历史记录
  },
  methods: {
    loadDownloadHistory() {
      const filePath = '../../log/download_records.json'; // 替换为你的下载历史 JSON 文件路径
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
          this.downloadHistory = data;
        })
        .catch(error => {
          console.error('There was a problem with the fetch operation:', error);
        });
    },
  },
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

.history-content {
    padding-top: 20px;
}

.history-content .history-table {
    width: 100%;
    border-collapse: collapse;
}

.history-content .history-table th,
.history-content .history-table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center; /* 修改这里 */
}

.history-content .history-table th {
    background-color: #f2f2f2;
}
</style>
