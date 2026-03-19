<template>
  <div class="page">
    <div class="header-bg">
      <van-nav-bar
        title="资讯"
        left-arrow
        @click-left="$router.back()"
        :border="false"
        class="nav-bar"
      />
    </div>

    <div class="content">
      <div class="card">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <div class="list">
            <div class="item" v-for="item in list" :key="item.id" @click="goDetail(item)">
              <div class="thumb-wrap">
                <van-image :src="item.thumb" fit="cover" class="thumb" />
              </div>
              <div class="info">
                <div class="title">{{ item.title }}</div>
                <div class="time">{{ item.time }}</div>
              </div>
              <div class="arrow-wrap">
                <van-icon name="arrow" />
              </div>
            </div>
            <div v-if="!list.length && !loading" class="empty">
              <van-empty description="暂无资讯" />
            </div>
          </div>
        </van-list>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { getNewsPage } from '@/api/home'

const router = useRouter()

const list = ref([])
const pageNum = ref(1)
const pageSize = 5
const total = ref(0)
const loading = ref(false)
const finished = ref(false)

const normalizeUrl = url => {
  if (!url) return ''
  if (typeof url !== 'string') return ''
  return url.replace(/`/g, '').trim()
}

const onLoad = async () => {
  if (finished.value) return
  loading.value = true
  try {
    const params = {
      pageNum: pageNum.value,
      pageSize
    }
    const res = await getNewsPage(params)
    if (res.code === 200 && res.data) {
      const rows = res.data.records || []
      const mapped = rows.map(item => ({
        id: item.id,
        title: item.title,
        time: item.createDt || item.time,
        thumb: normalizeUrl(item.coverImg || item.thumb),
        content: item.content || ''
      }))
      list.value.push(...mapped)
      const totalVal = res.data.total || rows.length
      total.value = totalVal
      if (list.value.length >= totalVal) {
        finished.value = true
      } else {
        pageNum.value += 1
      }
    } else {
      finished.value = true
      showToast(res.msg || '获取资讯失败')
    }
  } catch (error) {
    console.error('Failed to load news:', error)
    finished.value = true
    showToast('获取资讯失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

const goDetail = item => {
  router.push({
    name: 'news-detail',
    query: {
      id: item.id
    }
  })
}

onMounted(() => {
  onLoad()
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f7f8fa;
}

.header-bg {
  height: 220px;
  background: var(--blue-gradient);
  position: relative;
}

.nav-bar {
  background: transparent;
  --van-nav-bar-title-text-color: #fff;
  --van-nav-bar-icon-color: #fff;
  --van-nav-bar-title-font-size: var(--font-size-large);
  --van-nav-bar-title-font-weight: bold;
}

.content {
  padding: 0 16px 80px;
  margin-top: -160px;
  position: relative;
  z-index: 1;
}

.card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  padding-top: 8px;
}

.list {
  padding-bottom: 8px;
}

.item {
  display: flex;
  padding: 12px 16px;
  border-bottom: 1px solid #f3f3f3;
  align-items: center;
}

.item:last-child {
  border-bottom: none;
}

.thumb-wrap {
  width: 88px;
  height: 60px;
  border-radius: 6px;
  overflow: hidden;
  background: #eee;
  margin-right: 12px;
}

.thumb {
  width: 100%;
  height: 100%;
}

.info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.title {
  font-size: var(--font-size-small);
  color: #333;
  line-height: 1.4;
  font-weight: 500;
}

.time {
  font-size: var(--font-size-xs);
  color: #999;
  margin-top: 6px;
}

.arrow-wrap {
  width: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pager {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px 0 16px;
  gap: 24px;
}

.pager-btn {
  font-size: 14px;
  cursor: pointer;
  padding: 4px 12px;
}

.pager-btn.disabled {
  color: #ccc;
  cursor: not-allowed;
}

.pageinfo {
  font-size: 14px;
  color: #333;
}

.empty {
  padding: 24px;
}
</style>
