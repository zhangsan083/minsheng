import http from '@/utils/http'

export function login(username, password) {
  return http.post('/auth/login', { username, password })
}

export function register(data) {
  return http.post('/auth/register', data)
}

export function getCaptchaImage() {
  return http.get('/auth/captchaImage')
}

export function logout() {
  return http.post('/auth/logout')
}

export function getUserInfo() {
  return http.get('/consumer/info')
}

export function updatePassword(data) {
  return http.post('/consumer/password/edit', data)
}

// 实名认证
// 请求头需自动注入 Authorization（由 http 拦截器处理）
// 请求体: { idNumber: string, realName: string }
export function verifyRealName(data) {
  return http.post('/consumer/verified', data)
}

// 获取收款账户列表
export function getAccountList() {
  return http.get('/consumer/account/list')
}

export function getAccountDetail(id) {
  return http.get('/consumer/account/detail', { params: { id } })
}

export function saveAccount(data) {
  return http.post('/consumer/account/save', data)
}

export function removeAccount(ids) {
  return http.post('/consumer/account/remove', null, { params: { ids } })
}

export function setAccountDefault(id) {
  return http.post('/consumer/account/default', null, { params: { id } })
}

// 提现
export function withdraw(data) {
  return http.post('/consumer/withdraw', data)
}

// 获取提现记录
export function getWithdrawPage(params) {
  return http.get('/consumer/withdraw/page', { params })
}
