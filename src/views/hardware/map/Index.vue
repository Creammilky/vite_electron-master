
<template>
  <div>
  <div class="container">
    <div class="sidebar">
      <button @click="showCreateGroup" class="blue-button">创建群组</button>
      <br>
      <button @click="showJoinGroup" class="blue-button">加入群组</button>
      <br>
      <button @click="showLeaveGroup" class="blue-button">退出群组</button>
    </div>
    <div class="main-content">
      <div v-if="creatingGroup">
        <input v-model="newGroupName" placeholder="输入群组名称" />
        <!-- <input v-model="username" placeholder="输入成员名称" /> -->
        <button @click="createGroup" class="blue-button">确定创建群组</button>
        <p v-if="message">{{ message }}</p>
      </div>
      <div v-if="joiningGroup">
        <input v-model="groupNameToJoin" placeholder="输入群组名称" />
        <button @click="joinGroup" class="blue-button">确定加入群组</button>
        <p v-if="message">{{ message }}</p>
      </div>
      <div v-if="leavingGroup">
        <input v-model="groupNameToLeave" placeholder="输入群组名称" />
        <button @click="leaveGroup" class="blue-button">确定退出群组</button>
        <p v-if="message">{{ message }}</p>
      </div>
    </div>
  </div>

    <div class="file-info">
      <h2>群组文件信息</h2>
      <table class="my-files-table">
        <colgroup>
          <col style="width: 50%;" />
          <col style="width: 50%;" />
        </colgroup>
        <thead>
          <tr>
            <th>文件名</th>
            <th>下载时间</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(file, index) in myFiles" :key="index">
            <td>{{ file.name }}</td>
            <td>{{ file.location }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
const fs = require('fs');
const path = require('path');
import { host, logPath, pemPath } from '@/global';

export default {
  data() {
    return {
      creatingGroup: false,
      leavingGroup: false,
      joiningGroup: false,
      newGroupName: '',
      groupNameToLeave: '',
      groupNameToJoin: '',
      username: '', // 用户名字段
      message: '',
      myFiles: [] // 存储下载历史记录
    };
  },
  mounted() {

    this.loadMyFiles(); // 加载我的文件数据
  },
  created() {
    this.loadUsername();
  },
  methods: {
    loadMyFiles() {
      //改绝对地址
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
    },
  loadUsername() {
    fs.readFile(logPath + '\\user.json', 'utf8', (err, data) => {
        if (err) {
          console.error('Error reading the file:', err);
          return;
        }
        try {
          const user = JSON.parse(data);
          this.username = user.username;
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      });
    },
    showCreateGroup() {
      this.creatingGroup = true;
      this.leavingGroup = false;
      this.joiningGroup = false;
      this.message = '';
    },
    showJoinGroup() {
      this.joiningGroup = true;
      this.creatingGroup = false;
      this.leavingGroup = false;
      this.message = '';
    },
    showLeaveGroup() {
      this.leavingGroup = true;
      this.creatingGroup = false;
      this.joiningGroup = false;
      this.message = '';
    },
    createGroup() {
      const url = host + '/create_group';
      const json_data = {
        groupname: this.newGroupName,
      };
      const accessToken = localStorage.getItem('accessToken');

      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(json_data)
      })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Unable to create group');
        }
      })
      .then(data => {
        this.message = data.message || '群组创建成功';
        // this.addGroupToLocalFile(this.newGroupName);
      })
      .catch(error => {
        this.message = error.message || '创建群组失败';
      });
    },
    joinGroup() {
      const url = host +  '/join_group';
      const json_data = {
        groupname: this.groupNameToJoin,
      };
      const accessToken = localStorage.getItem('accessToken');

      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(json_data)
      })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Something went wrong');
        }
      })
      .then(data => {
        this.message = data.message || '群组加入成功';
        // this.addMemberToLocalFile(this.groupNameToJoin, this.username);
      })
      .catch(error => {
        this.message = error.message || '创建群组失败';
      });
    },
    leaveGroup() {
      const url = host + '/leave_group';
      const json_data = {
        groupname: this.groupNameToLeave,
      };
      const accessToken = localStorage.getItem('accessToken');

      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(json_data)
      })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Unable to leave group');
        }
      })
      .then(data => {
        this.message = data.message || '成功退出群组';
        // this.removeMemberFromLocalFile(this.groupNameToLeave, this.username);
      })
      .catch(error => {
        this.message = error.message || '退出群组失败';
      });
    },
    addGroupToLocalFile(groupName) {
      fs.readFile(logPath + '\\group.json', 'utf8', (err, data) => {
        if (err) throw err;
        let groups = JSON.parse(data);
        groups.push({
          name: groupName,
          member: [{ memberName: this.username }]
        });
        fs.writeFile(logPath + '\\group.json', JSON.stringify(groups, null, 2), (err) => {
          if (err) throw err;
        });
      });
    },
    addMemberToLocalFile(groupName, memberName) {
      fs.readFile(logPath + '\\group.json', 'utf8', (err, data) => {
        if (err) throw err;
        let groups = JSON.parse(data);
        let group = groups.find(g => g.name === groupName);
        if (group) {
          group.member.push({ memberName });
          fs.writeFile(logPath + '\\group.json', JSON.stringify(groups, null, 2), (err) => {
            if (err) throw err;
          });
        }
      });
    },
    removeMemberFromLocalFile(groupName, memberName) {
      fs.readFile(logPath + '\\group.json', 'utf8', (err, data) => {
        if (err) throw err;
        let groups = JSON.parse(data);
        let group = groups.find(g => g.name === groupName);
        if (group) {
          group.member = group.member.filter(m => m.memberName !== memberName);
          fs.writeFile(logPath + '\\group.json', JSON.stringify(groups, null, 2), (err) => {
            if (err) throw err;
          });
        }
      });
    }
  }
};
</script>


<style scoped>
.container {
  display: flex;
  flex-direction: row; /* 确保主方向为行 */
  width: 100%;

}

@media (max-width: 800px) { /* 当屏幕宽度小于800px时，改变布局为垂直排列 */
  .container {
    flex-direction: column;
  }
  .sidebar, .main-content {
    width: 100%; /* 在垂直布局时，宽度调整为100% */
  }
}

.sidebar {
  flex: 1;
  width: 50%;
  background-color: white;
  padding: 20px;
}
.main-content {
    flex: 2;
  width: 50%;
  padding: 20px;
}
.blue-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  margin: 10px 0;
  cursor: pointer;
  border-radius: 5px;
}
input {
  margin: 10px 0;
  padding: 10px;
  width: calc(100% - 22px);
  box-sizing: border-box;
  border-radius: 5px;
}

button:hover {
    background-color: rgb(46, 83, 168);  /* 悬停时颜色变深 */
}

.account-info-table {
  margin-top: 0px;
  border-collapse: collapse;
  width: 100%; /* 控制表格宽度 */
  margin-left: 50px; /* 设置表格左边距为自动，使其水平居中 */
  margin-right: 50px; /* 设置表格右边距为自动，使其水平居中 */
}

table th,
table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
  left: 20px;
}

table th {
  background-color: #f2f2f2;
}

h2 {
  margin-top: 20px;
}

.my-files-table{
  margin-top: 10px;
  margin-left: 50px;
}

</style>