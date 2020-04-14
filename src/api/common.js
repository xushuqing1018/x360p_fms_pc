import axios from '@/libs/api.request'

export const getGlobalVar = (name) => {
	return axios.request({
		url: 'fapi/global/'+name,
		method: 'get'
	})
}

export const getDataList = (url) => {
	return axios.request({
		url: url,
		method: 'get'
	})
}

export const getDataRowById = (id,res) => {
	return axios.request({
		url: 'api/datarow?id='+id+'&res='+res,
		method: 'get'
	})
}

export const getDataRows = (res,size) => {
	size = size || 3000
	let url = 'api/'+res+'?pagesize='+size
	return axios.request({
		url: url,
		method: 'get'
	})
}

export default {
	getGlobalVar,
	getDataList,
	getDataRowById,
	getDataRows
}