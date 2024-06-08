<template>
  <div id="app-base-socket-ipc">
    <div class="file-list">
      <h2>我的文件</h2>
      <ul>
        <li v-for="(file, index) in files" :key="index">
          <button class="file-button" @click="openFile(file)">{{ file }}</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
const fs = require('fs');
const path = require('path');
const { shell } = require('electron'); // 从 electron 模块中导入 shell

export default {
  data() {
    return {
      files: [] // 用于存储文件名的数组
    };
  },
  mounted() {
    this.loadFiles(); // 在组件挂载完成后加载文件
  },
  methods: {
    async selectPic() {
      const filePath = await ipc.invoke(ipcApiRoute.selectPic, {});
      this.picPath = filePath;
      this.recordUpload(filePath);
    },
    loadFiles() {
      const folderPath = 'E:\\vite_electron-master\\public\\log\\download'; // 替换为实际文件夹路径
      fs.readdir(folderPath, (err, files) => { // 读取文件夹
        if (err) {
          console.error('Error reading folder:', err);
          return;
        }
        this.files = files; // 将文件名存储到 files 数组中
      });
    },
    openFile(file) {
      const filePath = path.join('E:\\vite_electron-master\\public\\log\\download', file); // 构建文件完整路径
      shell.openPath(filePath).then((result) => { // 使用 Electron 的 shell 模块打开文件
        if (result) {
          console.error('Error opening file:', result);
        }
      });
    }
  }
};
</script>

<style scoped>
.file-button {
  width: 700px; /* 设置按钮宽度 */
  margin-bottom: 5px; /* 设置按钮之间的垂直间距 */
  background-color: #89D9FE; /* 设置按钮背景颜色 */
  color: #fff; /* 设置文字颜色为白色 */
  padding: 10px; /* 设置内边距 */
  border: none; /* 去除边框 */
  cursor: pointer; /* 鼠标悬停时显示手型 */
  border-radius: 5px; /* 设置按钮圆角 */
}

.file-button:hover {
  background-color: #67c0e9; /* 设置鼠标悬停时的背景颜色 */
}
</style>
