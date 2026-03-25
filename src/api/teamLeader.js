import request from '@/utils/http'

// 获取团队长信息
export function getTeamLeader() {
  return request.get('/teamLeader/index')
}
