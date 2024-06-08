<template>
    <div class="protected-view">
      <h1>Protected Page</h1>
      <p>This is a protected page. You should only be able to see this if you are logged in.</p>
    </div>
</template>
  
<script>
  export default {
    name: 'ProtectedView',
    // 可以在此处添加认证逻辑或者其他生命周期钩子
  }
</script>
  
<style scoped>
  .protected-view {
    padding: 20px;
    background-color: #f4f4f4;
    border-radius: 8px;
    margin-top: 20px;
    text-align: center;
  }
</style>
  