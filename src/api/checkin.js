import request from '@/utils/http'

// 获取签到信息
export function getCheckinInfo() {
  return request.get('/asset/checkin')
}

// 立即签到
export function addCheckin() {
  return request.post('/asset/checkin/add')
}

// 获取签到记录
export function getFundDetailsRecords(params) {
  return request.get('/asset/fundDetails/page', { params })
}

// 获取资金明细头部信息
export function getFundDetailsHeader(params) {
  return request.get('/asset/fundDetails', { params })
}
