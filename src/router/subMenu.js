/**
 * 子菜单
 */
export default {
	framework: {
		'menu_100' : {
			icon: 'profile',
			title: '我的文件',
			pageName: 'FrameworkSocketIpc',
			params: {}
		},
		'menu_101' : {
			icon: 'profile',
			title: '总览',
			pageName: 'FrameworkOverviewIndex',
			params: {}
		},
		    
		// 'menu_103' : {
		// 	icon: 'profile',
		// 	title: 'json数据库',
		// 	pageName: 'FrameworkJsonDBIndex',
		// 	params: {}
		// },
		// 'menu_104' : {
		// 	icon: 'profile',
		// 	title: 'sqlite数据库',
		// 	pageName: 'FrameworkSqliteDBIndex',
		// 	params: {}
		// },
		                                             
	},	
	os: {
		'menu_100' : {
			icon: 'profile',
			title: '上传文件',
			pageName: 'OsFileIndex',
			params: {}
		},
		'menu_101' : {
			icon: 'profile',
			title: '下载文件',
			pageName: 'OsNotificationIndex',
			params: {}
		},
		'menu_102' : {
			icon: 'profile',
			title: '上传历史',
			pageName: 'OsWindowViewIndex',
			params: {}
		},
		'menu_103' : {
			icon: 'profile',
			title: '下载历史',
			pageName: 'OsWindowIndex',
			params: {}
		},
	},
	hardware: {
		// 'menu_100' : {
		// 	icon: 'profile',
		// 	title: '会话',
		// 	pageName: 'HardwarePrinterIndex',
		// 	params: {}
		// },
		'menu_100' : {
			icon: 'profile',
			title: '共享群组',
			pageName: 'HardwareFriendIndex',
			params: {}
		},
		// 'menu_102' : {
		// 	icon: 'profile',
		// 	title: '搜索',
		// 	pageName: 'HardwareSearchIndex',
		// 	params: {}
		// },
		'menu_103' : {
			icon: 'profile',
			title: '管理群组',
			//创建和退出
			pageName: 'HardwareMapIndex',
			params: {}
		},
		// 'menu_104' : {
		// 	icon: 'profile',
		// 	title: '群组列表',
		// 	//存储一个本地文件，记录自己创建的群组，如果是自己创建的可以添加成员
		// 	pageName: 'HardwareListIndex',
		// 	params: {}
		// }                                                
  },
  vueui: {
    'menu_110' : {
      icon: 'profile',
      title: '介绍',
      pageName: 'vueuiVideoIndex',
      params: {}
    },
    // 'menu_110' : {
    //   icon: 'profile',
    //   title: '登录',
    //   pageName: 'vueuiLoginIndex',
    //   params: {}
    // } 
	'menu_100' : {
		icon: 'profile',
		title: '登录',
		pageName: 'vueuiLoginIndex',
		params: {}
	  },
	'menu_112' : {
		icon: 'profile',
		title: '个人信息',
		pageName: 'vueuiUserIndex',
		params: {}
	  }                                                
  	},
//   Login:{
// 	'menu_111' : {
// 		icon: 'profile',
// 		title: '登录',
// 		pageName: 'LoginIndex',
// 		params: {}
// 	  }  

//   } 	
}
