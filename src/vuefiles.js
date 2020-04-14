import page404 from 'v%/error/404.vue'
import pagelogin from 'v%/login.vue'
export default {
	page404,
	pagelogin,
	login:() => import('v%/login.vue'),
	home_index:()=>import('v%/home/index.vue'),
	message:()=>import('v%/message.vue'),
	sale_clients:()=>import('v%/sale/clients.vue'),
	sale_followups:()=>import('v%/sale/followups.vue'),
	sale_contracts:()=>import('v%/sale/contracts.vue'),
	aftersale_franchisees:()=>import('v%/aftersale/franchisees.vue'),
	aftersale_services:()=>import('v%/aftersale/services.vue'),
	aftersale_services_info:()=>import('v%/aftersale/services/info.vue'),
	aftersale_uniclues:()=>import('v%/aftersale/uniclues.vue'),
	aftersale_franchisees_info:()=>import('v%/aftersale/franchisees/info.vue'),
	aftersale_x360s:()=>import('v%/aftersale/x360s.vue'),

	aftersale_trains:()=>import('v%/aftersale/trains.vue'),
    aftersale_trains_info:()=>import('v%/aftersale/trains/info.vue'),

    aftersale_course:()=>import('v%/aftersale/course.vue'),
    aftersale_course_info:()=>import('v%/aftersale/course/info.vue'),

    aftersale_vod:()=>import('v%/aftersale/vod.vue'),

	aftersale_tickets:()=>import('v%/aftersale/tickets.vue'),
	aftersale_tickets_info:()=>import('v%/aftersale/tickets/info.vue'),
  
  cloudclass_users:()=>import('v%/cloudclass/users.vue'),
  cloudclass_setting:()=>import('v%/cloudclass/setting.vue'),
  cloudclass_reports:()=>import('v%/cloudclass/reports.vue'),
  cloudclass_login:()=>import('v%/cloudclass/login.vue'),
  
  reports_reportkeys:()=>import('v%/reports/reportkeys.vue'),
	reports_overview:()=>import('v%/reports/overview.vue'),
	reports_systemopen:()=>import('v%/reports/systemopen.vue'),
	reports_systemuse:()=>import('v%/reports/systemuse.vue'),
	reports_origins:()=>import('v%/reports/origins.vue'),
	system_configs:()=>import('v%/system/configs.vue'),
	system_employees:()=>import('v%/system/employees.vue'),
	system_departments:()=>import('v%/system/departments.vue'),
	system_roles:()=>import('v%/system/roles.vue'),
	system_dicts:()=>import('v%/system/dicts.vue'),
	system_logs:()=>import('v%/system/logs.vue'),
	error_401:()=>import('v%/error/401.vue'),
	error_404:()=>import('v%/error/404.vue'),
	error_500:()=>import('v%/error/500.vue')
}
