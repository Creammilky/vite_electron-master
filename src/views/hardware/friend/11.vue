
<template>
    <div class="friend-list-container">
      <div class="friend-list">
      </div>
    </div>
</template>
  
<style scoped>
  .friend-list-container {
    display: flex;
    width: 100%;  /* 确保容器填满整个页面宽度 */
  }
  
  .friend-list {
    flex: 1;  /* 好友列表占据1/3的空间 */
}

.chat-dialogue {
    flex: 2;  /* 对话框占据2/3的空间 */
}
  .friend-list {
    margin-right: 20px;
  }
  
  ul {
    padding: 0;
  }

  li {
    list-style: none;  /* 移除列表项目的默认样式 */
  }

  button {
    display: block;
    width: 100%;
    margin-bottom: 5px;  /* 设置垂直距离 */
    background-color: #3c62eb;;
    color: white;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  button:hover {
    background-color: darkblue;  /* 悬停时颜色变深 */
  }


  .chat-dialogue ul {
    background-color: lightgreen;
    border-radius: 10px;
    padding: 10px;
    margin: 10px 0;
  }

  h3 {
    margin-top: 20px;
  }

  textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-top: 10px;
  }

  .chat-dialogue button {
    margin-top: 10px;
    width: auto;  /* 让发送按钮宽度根据内容调整 */
  }
</style>
