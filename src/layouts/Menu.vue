<template>
  <a-layout id="app-menu">
    <a-layout-header class="app-header">
      <div class="logo">
        <img src="src/assets/logo.png" alt="Logo" class="logo-img" />
        <h1 class="title">分布式安全存储系统 IPFSec</h1>
      </div>
      <img src="src/assets/user.jpg" alt="Image" class="image" />
      <router-link to="/login" class="login-link">登录</router-link>
    </a-layout-header>
    <a-layout>
      <a-layout-content>
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style lang="less" scoped>
#app-menu {
  height: 100%;
}

.app-header {
  position: relative; /* 设置相对定位 */
  height: 10vh; /* 设置头部高度为页面高度的 20% */
  border-bottom: 1px solid var(--color-neutral-3);
  background-color: #041029; /* 设置头部背景颜色 */
}

.logo {
  display: flex;
  align-items: center;
}

.logo-img {
  max-width: 20%; 
  max-height: 20%; 
  margin-right: 140px; 
}

.title {
  font-family: "Arial", sans-serif;
  position: absolute; 
  top: 50%; 
  left: 50%;
  transform: translate(-50%, -50%); 
  margin: 0; 
  font-size: 30px; 
  color: white; 
}
.image {
  position: absolute;
  top: 50%;
  right: 30px; 
  transform: translateY(-50%);
  max-width: 40px; 
  height: auto; 
}
.login-link {
  position: absolute;
  top: 50%;
  right: 75px; 
  transform: translateY(-50%);
  color: white;
  text-decoration: none;
}
</style>
