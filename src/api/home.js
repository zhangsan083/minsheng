import request from '@/utils/http'

export function getHomeIndex() {
  return request.get('/asset/index')
}

export function getNewsPage(params) {
  return request.get('/asset/news/page', { params })
}

export function getNewsDetail(id) {
  return request.get('/asset/news/detail', { params: { id } })
}

export function getDownloadLinks() {
  return request.get('/asset/download')
}
