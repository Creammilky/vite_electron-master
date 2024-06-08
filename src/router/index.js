//导入模块
import { createRouter, createWebHashHistory } from 'vue-router'
//导入路由映射
import routerMap from './routerMap'

// const routes = [
//   {
//     path: '/vueui/login/index',
//     name: 'vueuiLoginIndex',
//     component: () => import('@/views/vueui/login/Index.vue'),
//   },
//   {
//     path: '/home',
//     name: 'Home',
//     component: Home,
//   },
// ];

//创建路由实例
const Router = createRouter({
  history: createWebHashHistory(),
  routes: routerMap,
  
})
// // 在 /router/index.js 或类似的文件中设置全局前置守卫
// router.beforeEach((to, from, next) => {
//   // 检查用户是否已登录
//   const isLoggedIn = !!localStorage.getItem('userToken'); // 示例：假设登录状态保存在 localStorage

//   if (!isLoggedIn && to.name !== 'Login') {
//     next({ name: 'Login' });  // 未登录且访问的不是登录页面，重定向到登录页面
//   } else {
//     next();  // 已登录或访问的是登录页面，继续
//   }
// });

//导出路由实例
export default Router
