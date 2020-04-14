/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default {
	home:{
		path:'/',
		notCache:true,
		hideInMenu: true,
		redirect:'/home',
		sub:{
			index:{
				path:'/home',
				hideInMenu: true,
				title: '首页',
				notCache: true,
				icon: 'md-home'
			}
		}
	},
	login:{
		hideInMenu: true,
		layout:false,
		public:true,
		sync:true,
		title:'登录'
	},
	doc:{
		title:'文档',
		href: 'https://lison16.github.io/iview-admin-doc/#/',
		icon: 'ios-book'
	},
	join:{
		hideInBread:true,
		sub:{
			index:{
				file:'join-page',
				icon: '_qq',
				title: 'QQ群',
			}
		}
	},
	
	message:{
		hideInBread: true,
		hideInMenu: true,
		sub:{
			index:{
				file:'message',
				icon: 'md-notifications',
				title: '消息中心',
			}
		}
	},
	sale:{
		icon: '_sale',
		title: '销售',
		sub:{
			clients:{
				icon:'_customer'
			},
			followups:{
				icon:'_followup'
			},
			contracts:{
				icon: '_contract'
			}
		}
	},
	aftersale:{
		icon: '_aftersale',
		sub:{
			franchisees:{
				icon: '_franchisee',
				title: '盟商资料',
			},
			services:{
				icon: '_service',
				title: '督导服务'
			},
			x360s:{
				icon: '_x360',
			},
			trains:{
				icon: '_train',
			},
            course:{
                icon: '_train',
            },
            vod:{
				icon: '_x360',
			},
			tickets:{
				file:'aftersale/tickets',
				icon: '_ticket',
			},
			uniclues:{
				icon:'md-list-box'
			},
			franchisees_info: {
				title: '加盟商详情',
				path: 'franchisees/:id',
				file: 'aftersale/franchisees/info'
			},
			trains_info: {
				title: '培训详情',
				path: 'trains/:id',
				file: 'aftersale/trains/info'
			},
      course_info: {
      	title: '课案列表',
      	path: 'course/:id',
      	file: 'aftersale/course/info'
      },
			ticket_info: {
				title: '工单详情',
				path: 'tickets/:id',
				file: 'aftersale/tickets/info'
			},
			services_info: {
				title: '服务详情',
				path: 'services/:id',
				file: 'aftersale/services/info'
			}
		}
	},
  cloudclass:{
  	icon: '_report',
  	title: '云课堂',
  	sub:{
      users:{
        icon: '_performance',
      },
      login:{
        icon: '_performance',
      },
  		setting:{
  			icon: '_overview',
  		},
  		reports:{
  			icon: '_performance',
  		},
  	}
  },
	reports:{
		icon: '_report',
		title: '报表',
		sub:{
            reportkeys:{
                icon: '_performance',
            },
			overview:{
				icon: '_overview',
			},
			systemopen:{
				icon: '_performance',
			},
			systemuse:{
				icon: '_performance',
			},
			origins:{
				icon: '_overview'
			}
		}
	},
	system:{
		icon: '_system',
		title: '系统',
		sub:{
			configs:{
				icon: 'ios-cog-outline',
				
			},
			employees:{
				icon: 'ios-contacts-outline',
			},
			departments:{
				icon: 'ios-home-outline',
			},
			roles:{
				icon: 'ios-man-outline',
			},
			dicts:{
				icon: 'ios-paper-outline',	
			}
		}
	},
	/*
	multilevel:{
		icon: 'md-menu',
		title: '多级菜单',
		sub:{
			level_2_1:{
				icon: 'md-funnel',
				title: '二级-1'
			},
			level_2_2:{
				access: ['super_admin'],
				icon: 'md-funnel',
				showAlways: true,
				title: '二级-2',
				sub:{
					level_2_2_1:{
						icon: 'md-funnel',
						title: '三级'
					},
					level_2_2_2:{
						icon: 'md-funnel',
						title: '三级'
					}
				}
			}
		}
	},
	argu:{
		hideInMenu: true,
		sub:{
			params:{
				path: 'params/:id',
				name: 'params',
				icon: 'md-flower',
				title: route => `{{ params }}-${route.params.id}`,
				notCache: true,
				beforeCloseName: 'before_close_normal'
			},
			query:{
				path: 'query',
				name: 'query',
				icon: 'md-flower',
				title: route => `{{ query }}-${route.query.id}`,
				notCache: true
			}
		}
	},
	*/
	error_401:{
		path:'/401',
		hideInMenu: true,
		public:true,
		layout:false,
		file:'error/401'
	},
	error_500:{
		path:'/500',
		hideInMenu: true,
		public:true,
		layout:false,
		file:'error/500'
	},
	error_404:{
		path:'/404',
		hideInMenu:true,
		layout:false,
		public:true,
		file:'error/404'
	},
	any:{
		path:'*',
		redirect:'/404',
		hideInMenu:true,
		layout:false,
		public:true
	}
}
