<template>
  <div class="page">
    <div class="header-bg">
      <van-nav-bar
        title="会议中心"
        left-arrow
        @click-left="$router.back()"
        :border="false"
        class="nav-bar"
      />
    </div>

    <div class="content">
        <!-- Tonight's Meeting Card -->
        <div v-if="todayMeeting" class="meeting-card highlight-card">
          <div class="badge-container">
            <div class="badge">今晚会议</div>
          </div>
          
          <div class="card-main">
            <div class="card-content-row">
              <div class="meeting-cover">
                <img v-if="todayMeeting.coverImg" :src="normalizeUrl(todayMeeting.coverImg)" alt="cover" class="cover-img" />
              </div>
              <div class="meeting-text-col">
                <div class="meeting-desc">
                  {{ todayMeeting.content }}
                </div>
              </div>
            </div>
            <div class="meeting-time-row">
              <span>会议开始时间:</span>
              <span>{{ todayMeeting.conferenceDt }}</span>
            </div>
          </div>

          <div class="action-buttons">
            <van-button 
              type="primary" 
              block 
              class="action-btn"
              color="var(--blue-gradient)"
              @click="goToUrl(todayMeeting.conferenceUrl, todayMeeting.content)"
            >
              前往观看
            </van-button>
            <van-button 
              type="primary" 
              block 
              class="action-btn"
              color="var(--blue-gradient)"
              @click="copyLink(todayMeeting.conferenceUrl)"
            >
              复制链接
            </van-button>
          </div>
        </div>

        <!-- Meeting List -->
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <div class="meeting-list">
            <div v-for="item in list" :key="item.id" class="list-item" @click="goToUrl(item.conferenceUrl, item.title)">
              <div class="item-header">
                {{ item.title }}
              </div>
              <div class="item-video-area">
                <div class="play-icon">
                  <van-icon name="play" color="#fff" size="32" />
                </div>
                <img v-if="item.coverImg" :src="normalizeUrl(item.coverImg)" alt="cover" class="video-cover" />
              </div>
              <div class="item-footer">
                <div class="item-time">会议时间: {{ item.conferenceDt }}</div>
                <div class="item-count">{{ item.browse}}人次观看</div>
              </div>
            </div>
          </div>
        </van-list>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getConferencePage } from '@/api/assets'
import { showToast } from 'vant'

const router = useRouter()
const todayMeeting = ref(null)
const list = ref([])
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)
const pageNum = ref(1)
const pageSize = 5

const normalizeUrl = (url) => {
  if (!url) return ''
  return String(url).replace(/`/g, '').trim()
}

const isToday = (dateStr) => {
  if (!dateStr) return false
  // 兼容不同的日期格式，如 "2026-01-30 19:46:12"
  // 注意：Safari 等浏览器可能不支持 '-' 连接的日期字符串，建议替换为 '/'
  const safeDateStr = String(dateStr).replace(/-/g, '/')
  const date = new Date(safeDateStr)
  const today = new Date()
  
  return date.getFullYear() === today.getFullYear() &&
         date.getMonth() === today.getMonth() &&
         date.getDate() === today.getDate()
}

const goToUrl = (url, title = '会议详情') => {
  if (url) {
    const targetUrl = normalizeUrl(url)
    router.push({
      name: 'internal-browser',
      query: {
        url: encodeURIComponent(targetUrl),
        title: encodeURIComponent(title)
      }
    })
  }
}

const copyLink = (url) => {
  const link = normalizeUrl(url)
  if (!link) return
  navigator.clipboard.writeText(link).then(() => {
    showToast('链接已复制')
  }).catch(() => {
    showToast('复制失败')
  })
}

const loadData = async (isRefresh = false) => {
  if (isRefresh) {
    pageNum.value = 1
    finished.value = false
  }

  try {
    const res = await getConferencePage({
      pageNum: pageNum.value,
      pageSize: pageSize
    })

    if (res.code === 200 && res.data) {
      const { records, total } = res.data
      
      // 处理第一条数据：仅在第一页且刷新时检查是否为今日会议
      let processList = [...records]
      
      if (pageNum.value === 1) {
        if (records.length > 0) {
          const first = records[0]
          if (isToday(first.conferenceDt)) {
            todayMeeting.value = first
            // 如果第一条是今日会议，从列表中移除它，避免重复显示
            processList = records.slice(1)
          } else {
            todayMeeting.value = null
          }
        } else {
          todayMeeting.value = null
        }
        
        if (isRefresh) {
          list.value = processList
        } else {
          list.value = [...list.value, ...processList]
        }
      } else {
        list.value = [...list.value, ...processList]
      }

      pageNum.value++
      
      if (list.value.length >= total - (todayMeeting.value ? 1 : 0)) {
        finished.value = true
      }
    } else {
      finished.value = true
    }
  } catch (error) {
    console.error(error)
    finished.value = true
  } finally {
    loading.value = false
    refreshing.value = false
  }
}

const onLoad = () => {
  loadData()
}

const onRefresh = () => {
  finished.value = false
  loading.value = true
  loadData(true)
}

onMounted(() => {
  // Initial load handled by van-list
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f7f8fa;
  padding-bottom: 80px; /* Space for tabbar */
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
  padding: 0 16px;
  margin-top: -160px;
  position: relative;
  z-index: 1;
}

/* Highlight Card (Tonight's Meeting) */
.meeting-card {
  background: #fff;
  border-radius: 12px;
  padding: 32px 16px 16px; /* Increased top padding to avoid badge overlap */
  margin-bottom: 20px;
  margin-top: 20px; /* Added top margin to give space for badge */
  position: relative;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.badge-container {
  position: absolute;
  top: -14px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  z-index: 2; /* Ensure badge is on top */
}

.badge {
  background: url('@/assets/资产/section-title.png') no-repeat center;
  background-size: 100% auto;
  color: #fff;
  padding: 6px 32px;
  border-radius: 20px 20px 0 0;
  width: 140px;
  text-align: center;
  font-weight: bold;
  font-size: var(--font-size-base);
}

/* Inner layout for the top card */
.card-main {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--blue-deep);
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
  background: #fff;
  gap: 0;
}

.card-content-row {
  display: flex;
  gap: 12px;
  margin-bottom: 8px;
}

.meeting-cover {
  width: 110px;
  height: 110px;
  background: #d9d9d9;
  border-radius: 4px;
  flex-shrink: 0;
}

.meeting-text-col {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.meeting-desc {
  font-size: var(--font-size-small);
  color: #666;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
}

.meeting-time-row {
  display: flex;
  justify-content: space-between;
  font-size: var(--font-size-xs);
  color: #666;
  border-top: 1px solid #eee;
  padding-top: 8px;
}

.action-buttons {
  display: flex;
  gap: 16px;
}

.action-btn {
  border-radius: 8px;
  font-size: var(--font-size-base);
  height: var(--button-normal-height);
}

/* List Items */
.list-item {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.item-header {
  background: var(--blue-gradient);
  color: #fff;
  padding: 10px 12px;
  font-size: var(--font-size-base);
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

.video-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
}

.play-icon {
  width: 50px;
  height: 50px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 1;
}

.item-video-area {
  height: 180px;
  background: #d9d9d9;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.item-footer {
  padding: 12px;
  display: flex;
  justify-content: space-between;
  font-size: var(--font-size-small);
  color: #999;
}
</style>
