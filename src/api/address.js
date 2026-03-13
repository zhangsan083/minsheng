import request from '@/utils/http'

// 获取地址列表
export function getAddressList() {
  return request.get('/consumer/address/list')
}

// 保存地址（新增或修改）
export function saveAddress(data) {
  return request.post('/consumer/address/save', data)
}

// 设置默认地址
export function setDefaultAddress(data) {
  return request.post('/consumer/address/default', null, {
    params: data
  })
}

// 删除地址
export function removeAddress(ids) {
  return request.post('/consumer/address/remove', null, {
    params: {
      ids
    }
  })
}
