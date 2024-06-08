<template>
  <a-layout id="app-layout-sider">
    <a-layout-sider
      v-model="collapsed"
      theme="light"
      class="layout-sider"
      width="100"
    >
      <!-- <div class="logo">
        <img class="pic-logo" src="~@/assets/logo.png">
      </div> -->
      <a-menu 
        class="menu-item" 
        theme="light" 
        mode="inline"
        :selectedKeys ="[current]"
        @menu-item-click="menuHandle"
      >
        <a-menu-item v-for="(menuInfo, index) in menu" :key="index" :style="menuInfo.style" :class="{'has-icon': menuInfo.key === '5'}">
          <!-- 在这里添加条件判断，只对非 'menu_5' 的项显示图标 -->
          <icon-font v-if="menuInfo.key !== '5'" :type="menuInfo.icon"  />
          {{ menuInfo.title }}
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-content class="layout-content">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>

export default {
  name: 'AppSider',
  data() {
    return {
      collapsed: true,
      current: 'menu_1',
      menu: {
        'menu_1' : {
          icon: 'icon-kuangjia',
          title: '总览',
          pageName: 'FrameworkOverviewIndex',
          params: {},
          style: { 'font-size': '16px', 'font-weight': 'bold' }
        },
        'menu_2' : {
          icon: 'icon-xitongguanli',
          title: '管理文件',
          pageName: 'HardwareFileIndex',
          params: {},
          style: { 'font-size': '16px', 'font-weight': 'bold' }
        },
        'menu_3' : {
          key:'5',
          title: '上传文件',
          pageName: 'OsFileIndex',
          params: {},
        },
        'menu_4' : {
          key:'5',
          title: '下载文件',
          pageName: 'OsNotificationIndex',
          params: {},
        },
        'menu_5' : {
          key:'5',
          title: '上传历史',
          pageName: 'OsWindowViewIndex',
          params: {},
        },
        'menu_6' : {
          key:'5',
          title: '下载历史',
          pageName: 'OsWindowIndex',
          params: {},
        },

        'menu_7' : {
          icon: 'icon-woshiyingjianchangjia',
          title: '用户组',
          pageName: 'Hardware',
          params: {},
          style: { 'font-size': '16px', 'font-weight': 'bold' }
        },
        'menu_8' : {
          key:'5',
          title: '共享群组',
          pageName: 'HardwareFriendIndex',
          params: {},
        },
        'menu_9' : {
          key:'5',
          title: '管理群组',
          pageName: 'HardwareMapIndex',
          params: {},
        },
        'menu_10' : {
          icon: 'icon-UI-xuanzhong',
          title: '介绍',
          pageName: 'vueui',
          params: {},
          style: { 'font-size': '16px', 'font-weight': 'bold' }
        }, 
        'menu_11' : {
          key:'5',
          title: '个人信息',
          pageName: 'vueuiUserIndex',
          params: {},
          
        },         
      }
    };
  },
  created () {
  },
  mounted () {
    this.menuHandle()
  },
  methods: {
    menuHandle (key) {
      console.log('sider menu key:', key);
      this.current = key ? key: this.current;

      const linkInfo = this.menu[this.current]
      this.$router.push({ name: linkInfo.pageName, params: linkInfo.params})
    },
    changeMenu(e) {
      console.log('sider menu e:', e);
      //this.current = e.key;
    }
  },
};
</script>
<style lang="less" scoped>
// 嵌套
#app-layout-sider {
  height: 100%;

  .logo {
    background-color: #041029; // 设置背景颜色与侧边栏一致
    border-bottom: 1 px solid var(--color-neutral-3); // 可选：保留边框
    padding: 10px; // 可选：调整内边距以适应你的布局
  }

  .pic-logo {
    height: 45px;
    display: block;
    margin: 0 auto; // 将 logo 图片居中
  }

  .layout-sider {
    width: 165px; // 增加宽度到250像素
    border-top: 0px solid var(--color-neutral-3);
    border-right: 0cm solid var(--color-neutral-3);
    background-color: #041029;


    .menu-item {
      margin-top: 50px;
      margin-left: 20px;
      .arco-menu-item {
        background-color: #041029;
        margin-top: 0px;
        margin-bottom: 0px;
        padding: 2px !important;
        display: flex;
        align-items: center;
        color: #ffffff; // 字体颜色为白色
        font-weight: normal; // 默认字体重量
        border-left: none; // 移除左侧边框
        box-shadow: none; // 移除阴影

        &:hover {
          color: #ffffff; // 鼠标悬停时字体颜色为白色
        }

        &.arco-menu-item-selected {
          font-weight: bold; // 选中状态字体加粗
          background-color: #041029; // 选中状态背景颜色不变
          color: #ffffff; // 选中状态字体颜色为白色
          border-left: none; // 移除左侧边框
          box-shadow: none; // 移除阴影
        }
      }
    }
  }

.has-icon::before {
  content: "";
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-left: 5px solid white;  // 根据你的需求可以更改颜色
  display: inline-block;
  vertical-align: middle;
  margin-right: 18px;  // 调整三角形与文本之间的距离
}
  .layout-content {
    background: var(--color-menu-light-bg);
  }
}

:deep(.arco-menu) {
  background-color: #041029;
}

:deep(.arco-menu .arco-menu-item) {
  background-color: #041029;
  color: #ffffff; // 字体颜色为白色
  
  &:hover {
    color: #ffffff; // 鼠标悬停时字体颜色为白色
  }

  &.arco-menu-item-selected {
    font-weight: bold; // 选中状态字体加粗
    background-color: #041029; // 选中状态背景颜色不变
    color: #ffffff; // 选中状态字体颜色为白色
    border-left: none; // 移除左侧边框
    box-shadow: none; // 移除阴影
  }
}

:deep(.arco-menu .arco-menu-item .arco-icon) {
  margin-right: 8px;
  display: inline-block;
}




</style>
