/**
 * 基础路由
 * @type { *[] }
 */

const constantRouterMap = [
  // 定义路由数组
  {
    //根路由和布局
    path: '/',
    component: () => import('@/layouts/AppSider.vue'),

    children: [

      {
        path: '/framework',
        name: 'Framework',
        component: () => import('@/layouts/Menu.vue'),
        props: { id: 'framework' },
        //props: true,
        redirect: { name: 'FrameworkSocketIpc' },
        children: [
          {
            path: '/framework/socket/ipc',
            name: 'FrameworkSocketIpc',
            component: () => import('@/views/framework/socket/Ipc.vue')
          },
          {
            path: '/framework/overview/index',
            name: 'FrameworkOverviewIndex',
            component: () => import('@/views/framework/over/Index.vue')
          },

          
        ]  
      },
      {
        path: '/os',
        name: 'Os',
        component: () => import('@/layouts/Menu.vue'),
        props: { id: 'os' },
        redirect: { name: 'OsFileIndex' },
        children: [
          {
            path: '/os/file/index',
            name: 'OsFileIndex',
            component: () => import('@/views/os/file/Index.vue')
          },
          {
            path: '/os/file/pic',
            name: 'OsFilePic',
            component: () => import('@/views/os/file/Pic.vue')
          },
          {
            path: '/os/windowview/index',
            name: 'OsWindowViewIndex',
            component: () => import('@/views/os/windowview/Index.vue')
          },
          {
            path: '/os/window/index',
            name: 'OsWindowIndex',
            component: () => import('@/views/os/window/Index.vue')
          },
          {
            path: '/os/notification/index',
            name: 'OsNotificationIndex',
            component: () => import('@/views/os/notification/Index.vue')
          },
          {
            path: '/os/powermonitor/index',
            name: 'OsPowerMonitorIndex',
            component: () => import('@/views/os/powermonitor/Index.vue')
          },
          {
            path: '/os/screen/index',
            name: 'OsScreenIndex',
            component: () => import('@/views/os/screen/Index.vue')
          },
          {
            path: '/os/theme/index',
            name: 'OsThemeIndex',
            component: () => import('@/views/os/theme/Index.vue')
          },   
          {
            path: '/os/system/index',
            name: 'OsSystemIndex',
            component: () => import('@/views/os/system/Index.vue')
          },
        ]  
      }, 
      {
        path: '/hardware',
        name: 'Hardware',
        component: () => import('@/layouts/Menu.vue'),
        props: { id: 'hardware' },
        redirect: { name: 'HardwarePrinterIndex' },
        children: [
          {
            path: '/hardware/printer/index',
            name: 'HardwarePrinterIndex',
            component: () => import('@/views/hardware/printer/Index.vue')
          },
          {
            path: '/hardware/friend/index',
            name: 'HardwareFriendIndex',
            component: () => import('@/views/hardware/friend/old.vue')
          },
          {
            path: '/hardware/search/index',
            name: 'HardwareMapIndex',
            component: () => import('@/views/hardware/map/Index.vue')
          },
          {
            path: '/hardware/file/index',
            name: 'HardwareFileIndex',
            component: () => import('@/views/hardware/printer/Index.vue')
          },
        ]  
      },
      {
        path: '/vueui',
        name: 'vueui',
        component: () => import('@/layouts/Menu.vue'),
        props: { id: 'vueui' },
        redirect: { name: 'vueuiVideoIndex' },
        children: [
          {
            path: '/vueui/video/index',
            name: 'vueuiVideoIndex',
            component: () => import('@/views/vueui/video/Index.vue')
          },
          {
            path: '/vueui/login/index',
            name: 'vueuiLoginIndex',
            component: () => import('@/views/vueui/login/Index.vue')
          },
          {
            path: '/vueui/user/index',
            name: 'vueuiUserIndex',
            component: () => import('@/views/vueui/user/Index.vue')
          }
        ]  
      },
    ]
  },
  {
    path: '/special',
    children: [
      {
        path: 'subwindow',
        name: 'SpecialSubwindowIpc',
        component: () => import('@/views/os/subwindow/Ipc.vue')
      },
      {
        path: '/login',
        name: 'SpecialLoginWindow',
        component: () => import('@/views/vueui/login/Window.vue')
      },
    ]
  },

  {
    path: '/protected',
    name: 'Protected',
    component:() => import('@/views/vueui/login/ProtectedView.vue'),
    meta: { requiresAuth: true }
  },


]

export default constantRouterMap