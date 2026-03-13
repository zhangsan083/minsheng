import request from '@/utils/http'

// 获取团队概览信息
export function getTeamInfo() {
  return request.get('/consumer/team')
}

// 获取团队数据统计
// dateRange: 0累计，1今日，2本周，3本月
export function getTeamData(params) {
  return request.get('/consumer/team/data', { params })
}

// 获取成员分页列表
// level: 0所有，1一级，2二级，3三级
export function getMemberPage(params) {
  return request.get('/consumer/team/memberPage', { params })
}
