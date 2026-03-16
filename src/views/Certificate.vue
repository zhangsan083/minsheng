<template>
  <div class="page">
    <div class="header-bg">
      <van-nav-bar
        title="确权证书"
        left-arrow
        :border="false"
        @click-left="onClickLeft"
        class="nav-bar"
      />
    </div>

    <div class="content">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div class="card" v-for="item in list" :key="item.id">
          <div class="card-header">
            <div class="card-title">{{ item.certTypeLabel }}</div>
            <div class="card-no">{{ item.certType === '1' ? '资产' : '证书' }}编号：{{ item.certNum }}</div>
          </div>
          <div class="card-body">
            <div class="info-row" v-if="Number(item.amount) > 0">
              <span class="label">资产金额：</span>
              <span class="value value-blue">{{ formatMoney(item.amount) }}</span>
            </div>
            <div class="info-row">
              <span class="label">颁发日期：</span>
              <span class="value">{{ item.issueDt }}</span>
            </div>
            <van-button
              type="primary"
              block
              color="var(--blue-gradient)"
              class="action-btn"
              @click="goDetail(item)"
            >
              查看证书
            </van-button>
          </div>
        </div>
      </van-list>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { getCertPage } from '@/api/assets'

const router = useRouter()
const list = ref([])
const loading = ref(false)
const finished = ref(false)
const pageNum = ref(1)
const pageSize = 5

const onClickLeft = () => {
  router.back()
}

const formatMoney = val => {
  if (!val) return '0.00'
  return Number(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const goDetail = item => {
  router.push({
    name: 'certificate-detail',
    query: {
      id: item.id,
      certType: item.certType
    }
  })
}

const onLoad = async () => {
  try {
    const params = {
      pageNum: pageNum.value,
      pageSize: pageSize
    }
    const res = await getCertPage(params)
    if (res.code === 200 && res.data) {
      const rows = res.data.records || []
      list.value.push(...rows)
      
      const total = res.data.total || 0
      if (list.value.length >= total) {
        finished.value = true
      } else {
        pageNum.value++
      }
    } else {
      showToast(res.msg || '获取证书失败')
      finished.value = true
    }
  } catch (error) {
    console.error(error)
    showToast('获取证书失败')
    finished.value = true
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background-color: #f7f8fa;
}

.header-bg {
  height: 220px;
  background: var(--blue-gradient);
  position: relative;
}

.nav-bar {
  background: transparent;
  --van-nav-bar-title-text-color: #ffffff;
  --van-nav-bar-icon-color: #ffffff;
  border-bottom: none;
}

/* Fix for Vant 4 nav bar title color if CSS variable doesn't work directly on component class in some versions, 
   but usually it works. Adding deep selector just in case or relying on style attribute in template if needed. 
   Here we use scoped style. */
:deep(.van-nav-bar__title) {
  color: #ffffff;
  font-size: var(--font-size-large);
  font-weight: bold;
}
:deep(.van-icon) {
  color: #ffffff;
}

.content {
  padding: 0 16px;
  margin-top: -160px;
  position: relative;
  z-index: 1;
}

.card {
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.card-header {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: var(--font-size-base);
  font-weight: bold;
  color: #333;
}

.card-no {
  font-size: var(--font-size-xs);
  color: #999;
}

.card-body {
  padding: 16px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: var(--font-size-small);
}

.label {
  color: #666;
  font-weight: 500;
}

.value {
  color: #333;
  font-weight: 500;
}

.value-blue {
  color: var(--blue-deep);
  font-weight: bold;
  font-size: 20px;
  text-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

.action-btn {
  margin-top: 16px;
  border-radius: 4px;
  font-size: var(--font-size-base);
  font-weight: bold;
  height: 48px;
  box-shadow: 0 4px 10px rgba(43, 122, 251, 0.3);
}
</style>
