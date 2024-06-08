import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ArcoVue from '@arco-design/web-vue';
import '@arco-design/web-vue/dist/arco.css';
import Router from './router/index';
import components from './components/icons';
const fs = require('fs');
const path = require('path');
import axios from 'axios';  // 引入Axios

// 在应用启动脚本中



// Axios Setup
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('accessToken');
      Router.push('/login');
    }
    return Promise.reject(error);
  }
);

// Router Guard
Router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!localStorage.getItem('accessToken')) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
    } else {
      next();
    }
  } else {
    next();
  }
}
);

// 在应用启动时清除本地存储中的 accessToken 
localStorage.removeItem('accessToken');

//引入
const app = createApp(App);


// components
for (const i in components) {
    app.component(i, components[i])
  }
app.use(ArcoVue).use(Router).mount('#app');




