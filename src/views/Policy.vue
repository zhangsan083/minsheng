<template>
  <div class="page">
    <div class="header-bg">
      <van-nav-bar
        title="政策文件"
        left-arrow
        @click-left="onClickLeft"
        :border="false"
        class="nav-bar"
      />
    </div>

    <div class="content">
      <div class="policy-card">
        <div class="card-header">
          <div class="blue-bar"></div>
          <span class="card-title">政策文件</span>
        </div>

        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <div
            v-for="item in list"
            :key="item.id"
            class="policy-item"
            @click="goDetail(item)"
          >
            <div class="item-img-wrapper">
              <van-image
                width="80"
                height="80"
                radius="4"
                fit="cover"
                :src="cleanUrl(item.coverImg)"
              >
                <template v-slot:error>
                  <div class="img-placeholder"></div>
                </template>
                <template v-slot:loading>
                  <div class="img-placeholder"></div>
                </template>
              </van-image>
            </div>
            <div class="item-info">
              <div class="item-title">{{ item.title }}</div>
              <div class="item-desc">{{ item.content }}</div>
            </div>
          </div>
        </van-list>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getPolicyPage } from '@/api/assets'

const router = useRouter()
const list = ref([])
const loading = ref(false)
const finished = ref(false)
const pageNum = ref(1)
const pageSize = 5

const onClickLeft = () => {
  router.back()
}

const cleanUrl = (url) => {
  if (!url) return ''
  // Remove backticks and extra spaces if present in the data as per user input example
  return url.replace(/`/g, '').trim()
}

const onLoad = async () => {
  try {
    const res = await getPolicyPage({
      pageNum: pageNum.value,
      pageSize: pageSize
    })
    
    if (res.code === 200) {
      const records = res.data.records || []
      list.value.push(...records)
      
      // Check if we loaded all data
      if (list.value.length >= res.data.total || records.length < pageSize) {
        finished.value = true
      } else {
        pageNum.value++
      }
    } else {
      finished.value = true
    }
  } catch (error) {
    finished.value = true
    console.error(error)
  } finally {
    loading.value = false
  }
}

const goDetail = (item) => {
  router.push({ name: 'policy-detail', query: { id: item.id } })
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f7f8fa;
}

.header-bg {
  height: 220px;
  background: var(--blue-gradient);
}

.nav-bar {
  background: transparent;
  --van-nav-bar-title-text-color: #fff;
  --van-nav-bar-icon-color: #fff;
}

/* Deep selector to ensure title color is correct if variable doesn't work */
:deep(.van-nav-bar__title) {
  color: #fff;
}
:deep(.van-icon) {
  color: #fff;
}

.content {
  padding: 0 16px;
  margin-top: -150px;
  position: relative;
  z-index: 1;
}

.policy-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  min-height: 400px;
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.blue-bar {
  width: 4px;
  height: 16px;
  background: var(--blue-deep);
  border-radius: 2px;
  margin-right: 8px;
}

.card-title {
  font-size: 16px;
  font-weight: bold;
  color: var(--blue-deep);
}

.policy-item {
  display: flex;
  gap: 12px;
  padding-bottom: 16px;
  margin-bottom: 16px;
  border-bottom: 1px solid #eee;
}

.policy-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.item-img-wrapper {
  flex-shrink: 0;
}

.img-placeholder {
  width: 80px;
  height: 80px;
  background: #999;
  border-radius: 4px;
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  overflow: hidden;
}

.item-title {
  font-size: 15px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-desc {
  font-size: 13px;
  color: #666;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
}
</style>