import http from '@/utils/http'

// 获取解决方案首页信息（包含救助金申请状态）
export function getSolutionIndex() {
  return http.get('/solution/index')
}

// 提交共富普惠救助金申请
export function rescueApply(data) {
  return http.post('/solution/rescueApply/add', data)
}

// 上传文件
export function uploadFile(file) {
  const formData = new FormData()
  formData.append('file', file)
  return http.post('/common/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
