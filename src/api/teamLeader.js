import request from '@/utils/http'

// 获取团队长信息
export function getTeamLeader() {
  return request.get('/teamLeader/index')
}

// 获取团队长申请记录（可修改重投）
export function getTeamLeaderApply() {
  return request.get('/teamLeader/apply')
}

// 申请成为团队长
export function applyTeamLeader(data) {
  return request.post('/teamLeader/apply/add', data)
}

// 领取团队长工资
export function claimTeamLeaderSalary(data) {
  return request.post('/teamLeader/salary/claim', data)
}

// 获取团队长福利等级信息
export function getTeamLeaderWelfare() {
  return request.get('/teamLeader/welfare')
}

// 获取团队长详情信息
export function getTeamLeaderDetail() {
  return request.get('/teamLeader/detail')
}

// 获取团队长收益数据
export function getTeamLeaderRevenue(params) {
  return request.get('/teamLeader/revenue/page', { params })
}
