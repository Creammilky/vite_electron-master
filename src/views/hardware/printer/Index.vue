<template>
    <div class="container">
      <div class="grid">
        <div class="item" v-for="(item, index) in items" :key="index">
          <img :src="item.image" :alt="'Image ' + index" />
          <h3>{{ item.title }}</h3>
        </div>
      </div>
    </div>
</template>
  
  <script>
  export default {
    data() {
      return {
        items: [
          { title: '标题 1', image: '1.png' },
          { title: '标题 2', image: '2.png' },
          { title: '标题 3', image: '3.png' },
          { title: '标题 4', image: '4.png' }
        ]
      };
    }
  };
  </script>
  
  <style>
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  
  .grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    width: 80%;
    margin: auto;
  }
  
  .item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  
  .item img {
    width: 100%;
    height: auto;
    border: 1px solid #ccc;
  }
  
  .item h3 {
    text-align: center;
    margin-top: 10px;
  }
  </style>
  