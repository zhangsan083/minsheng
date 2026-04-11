import request from '@/utils/http'

export function getCertPage(params) {
  return request.get('/asset/cert/page', { params })
}

export function getCertDetail(id) {
  return request.get('/asset/cert/detail', { params: { id } })
}

// 获取商品分页列表
export function getGoodsPage(params) {
  return request.get('/asset/goods/page', { params })
}

// 获取商品详情
export function getGoodsDetail(id) {
  return request.get('/asset/goods/detail', { params: { id } })
}

// 获取公告详情
export function getBulletinDetail(id) {
  return request.get('/asset/bulletin/detail', { params: { id } })
}

// 商品兑换
export function goodsPay(data) {
  return request.post('/asset/goods/pay', data)
}

// 获取兑换记录分页
export function getExchangeRecords(params) {
  return request.get('/consumer/goodsOrder/page', { params })
}

// 获取会议分页
export function getConferencePage(params) {
  return request.get('/asset/conference/page', { params })
}

// 获取政策文件分页
export function getPolicyPage(params) {
  return request.get('/asset/policy/page', { params })
}

// 获取政策文件详情
export function getPolicyDetail(id) {
  return request.get('/asset/policy/detail', { params: { id } })
}

// 获取资产备案信息
export function getAssetFiling() {
  return request.get('/asset/filing/rc')
}

// 获取资产备案公示分页
export function getAssetFilingPubPage(params) {
  return request.get('/asset/filing/pubapply/page', { params })
}

// 获取资产备案申请分页
export function getAssetFilingApplyPage(params) {
  return request.get('/asset/filing/apply/page', { params })
}

// 获取资产备案首页数据
export function getAssetFilingIndex() {
  return request.get('/asset/filing/index')
}

// 提交资产备案登记
export function addAssetFiling(data) {
  return request.post('/asset/filing/add', data)
}

// 获取贡献奖励任务列表
export function getTaskList() {
  return request.get('/asset/task/list')
}

// 领取贡献奖励
export function claimTaskReward(id) {
  return request.post('/asset/task/claim', null, {
    params: {
      id
    }
  })
}

// 获取民生保信息
export function getHmBao() {
  return request.get('/asset/hmBao')
}

// 民生保投资
export function investHmBao(data) {
  return request.post('/asset/hmBao/investment', data)
}

// 获取民生保投资记录
export function getHmBaoInvestmentPage(params) {
  return request.get('/asset/hmBao/investmentPage', { params })
}

// 获取民生保障补助金
export function getHmSubsidy() {
  return request.get('/asset/hmSubsidy')
}

// 上传文件（可选传 side: front/back）
export function uploadFile(file, side) {
  const formData = new FormData()
  formData.append('file', file)
  if (side) {
    formData.append('side', side)
  }
  return request.post('/common/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 提交互助申请
export function addAssistanceApply(data) {
  return request.post('/consumer/assistanceApply/add', data)
}

// 获取互助申请详情
export function getAssistanceApplyDetail() {
  return request.get('/consumer/assistanceApply/detail')
}

// 资金转换
export function fundConversion(data) {
  return request.post('/consumer/fundConversion', data)
}

// 资金转出
export function fundTransfer(data) {
  return request.post('/consumer/fundTransfer', data)
}

// 邀请好友
export function inviteFriends() {
  return request.get('/consumer/inviteFriends')
}

// 获取领取记录
export function getClaimList() {
  return request.get('/asset/task/claimList')
}

// 获取项目列表
export function getProjectPage(params) {
  return request.get('/asset/filing/project/page', { params })
}

// 获取福祉文章
export function getWellbeingArticle() {
  return request.get('/asset/wellbeing')
}

// 获取投稿列表
export function getWellbeingPage(params) {
  return request.get('/asset/wellbeing/page', { params })
}

// 提交投稿
export function addWellbeingApply(data) {
  return request.post('/asset/wellbeing/apply/add', data)
}

// 获取我的投稿列表
export function getMyWellbeingPage(params) {
  return request.get('/asset/wellbeing/my/page', { params })
}
