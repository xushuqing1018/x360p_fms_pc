export default {
	components_SelectOrgModal:() => import('v%/components/SelectOrgModal.vue'),
	components_SelectFranchiseeModal:() => import('v%/components/SelectFranchiseeModal.vue'),
	components_SelectEmployeeModal:() => import('v%/components/SelectEmployeeModal.vue'),
	components_SelectFile:() => import('v%/components/SelectFile.vue'),
	components_PreviewFile:() => import('v%/components/PreviewFile.vue'),
	components_PreviewOrder:() => import('v%/components/PreviewOrder.vue'),
	sale_client_info$modal:() => import('v%/sale/client/info-modal.vue'),
	sale_client_assign:() => import('v%/sale/client/assign.vue'),
	sale_client_multi$assign:() => import('v%/sale/client/multi-assign.vue'),
	sale_contract_info$modal:() => import('v%/sale/contract/info-modal.vue'),
	sale_contract_quit$modal:() => import('v%/sale/contract/quit-modal.vue'),
	sale_contract_renew$modal:() => import('v%/sale/contract/renew-modal.vue'),
	sale_followup_info$modal:() => import('v%/sale/followup/info-modal.vue'),
	aftersale_franchisees_assign:() => import('v%/aftersale/franchisees/assign.vue'),
	aftersale_franchisees_info$modal:() => import('v%/aftersale/franchisees/info-modal.vue'),
	aftersale_franchisees_info$and$contact$modal:() => import('v%/aftersale/franchisees/info-and-contact-modal.vue'),
	aftersale_franchisees_contact$info$modal:() => import('v%/aftersale/franchisees/contact-info-modal.vue'),
	aftersale_franchisees_contact$list$modal:() => import('v%/aftersale/franchisees/contact-list-modal.vue'),
	aftersale_services_info$modal:() => import('v%/aftersale/services/info-modal.vue'),
	aftersale_x360s_info$modal:() => import('v%/aftersale/x360s/info-modal.vue'),
	aftersale_x360s_config:() => import('v%/aftersale/x360s/config.vue'),
	aftersale_x360s_to$formal$modal:() => import('v%/aftersale/x360s/to-formal-modal.vue'),
    aftersale_x360s_to$trial$modal:() => import('v%/aftersale/x360s/to-trial-modal.vue'),
    aftersale_x360s_frozen$org$modal:() => import('v%/aftersale/x360s/frozen-org-modal.vue'),
	aftersale_x360s_check$modal:() => import('v%/aftersale/x360s/check-modal.vue'),
	aftersale_x360s_renew:() => import('v%/aftersale/x360s/renew.vue'),
	aftersale_x360s_org$users$modal:() => import('v%/aftersale/x360s/org-users-modal.vue'),
	aftersale_x360s_user$token$modal:() => import('v%/aftersale/x360s/user-token-modal.vue'),
	aftersale_x360s_account$modal:() => import('v%/aftersale/x360s/account-modal.vue'),
	aftersale_trains_modal_manage$fc:() => import('v%/aftersale/trains/modal/manage-fc.vue'),
	aftersale_trains_modal_manage$tally:() => import('v%/aftersale/trains/modal/manage-tally.vue'),
	aftersale_trains_modal_manage$fee$type:() => import('v%/aftersale/trains/modal/manage-fee-type.vue'),
	aftersale_trains_modal_trains$info:() => import('v%/aftersale/trains/modal/trains-info.vue'),
	aftersale_trains_modal_tally$info:() => import('v%/aftersale/trains/modal/tally-info.vue'),
	aftersale_trains_modal_qr$modal:() => import('v%/aftersale/trains/modal/qr-modal.vue'),
	aftersale_trains_modal_add$ft$address:() => import('v%/aftersale/trains/modal/add-ft-address.vue'),
	aftersale_trains_modal_trains$person$info:() => import('v%/aftersale/trains/modal/trains-person-info.vue'),

    aftersale_course_modal_course$info:() => import('v%/aftersale/course/modal/course-info.vue'),
    aftersale_course_modal_title$modal:() => import('v%/aftersale/course/modal/title-modal.vue'),
    aftersale_course_modal_info$modal:() => import('v%/aftersale/course/modal/info-modal.vue'),
    
    aftersale_vod_modal_type$modal:() => import('v%/aftersale/vod/modal/type-modal.vue'),
    aftersale_vod_modal_info$modal:() => import('v%/aftersale/vod/modal/info-modal.vue'),
	aftersale_vod_modal_vod$info:() => import('v%/aftersale/vod/modal/vod-info.vue'),
	aftersale_vod_modal_play$modal:() => import('v%/aftersale/vod/modal/play-modal.vue'),

  cloudclass_user_info$modal:() => import('v%/cloudclass/user/info-modal.vue'),
  cloudclass_user_assign$modal:() => import('v%/cloudclass/user/assign-modal.vue'),

	system_configs_modal_modify$config:() => import('v%/system/configs/modal/modify-config.vue'),
	system_employees_modal_employee$info:() => import('v%/system/employees/modal/employee-info.vue'),
	system_roles_modal_role$info:() => import('v%/system/roles/modal/role-info.vue'),
	system_roles_modal_select$pers:() => import('v%/system/roles/modal/select-pers.vue'),
}
