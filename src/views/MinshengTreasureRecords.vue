<template>
  <div class="page">
    <div class="header">
      <van-nav-bar
        title="民生保投资记录"
        left-arrow
        @click-left="$router.back()"
        :border="false"
        class="nav-bar"
      />
    </div>

    <div class="content">
      <div class="tabs">
        <div :class="['tab', activeTab === 'running' ? 'active' : '']" @click="activeTab = 'running'">收益中</div>
        <div :class="['tab', activeTab === 'settling' ? 'active' : '']" @click="activeTab = 'settling'">结算中</div>
        <div :class="['tab', activeTab === 'done' ? 'active' : '']" @click="activeTab = 'done'">已结算</div>
      </div>

      <div class="list">
        <div class="card" v-for="record in records" :key="record.id">
          <div class="card-header">
            <div class="title">民生保{{ record.period || 0 }}天理财产品 · 日利率{{ record.interestRate || 0 }}%</div>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="cell">
                <div class="label">转入金额</div>
                <div class="value">{{ record.amount || 0 }}元</div>
              </div>
              <div class="cell">
                <div class="label">到期收益（本金合计）</div>
                <div class="value">{{ (Number(record.amount || 0) + Number(record.revenue || 0)).toFixed(2) }}元</div>
              </div>
            </div>
            <div class="date">产品周期：{{ record.createDt || '--' }} 至 {{ record.endDt || '--' }}</div>
          </div>
        </div>
        <div v-if="records.length === 0 && !loading" class="empty">
          <div class="empty-text">暂无投资记录</div>
        </div>
        <div v-if="loadingMore" class="loading-more">
          <van-loading type="spinner" size="16" />
          <span class="loading-text">加载中...</span>
        </div>
        <div v-if="!hasMore && records.length > 0" class="no-more">
          <span class="no-more-text">没有更多数据了</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { showToast } from 'vant'
import { getHmBaoInvestmentPage } from '@/api/assets'

const activeTab = ref('running')
const records = ref([])
const loading = ref(false)
const loadingMore = ref(false)
const pageNum = ref(1)
const hasMore = ref(true)

const statusMap = {
  running: '0',
  settling: '1',
  done: '2'
}

const loadRecords = async (isLoadMore = false) => {
  if (loading.value || loadingMore.value) return
  
  if (isLoadMore) {
    loadingMore.value = true
  } else {
    loading.value = true
    pageNum.value = 1
    hasMore.value = true
  }
  
  try {
    const res = await getHmBaoInvestmentPage({
      investmentStatus: statusMap[activeTab.value],
      pageNum: isLoadMore ? pageNum.value + 1 : 1,
      pageSize: 10
    })
    if (res.code === 200 && res.data) {
      const newRecords = res.data.records || []
      if (isLoadMore) {
        records.value = [...records.value, ...newRecords]
        pageNum.value++
      } else {
        records.value = newRecords
      }
      hasMore.value = newRecords.length === 10
    } else {
      showToast(res.msg || '获取记录失败')
    }
  } catch (error) {
    console.error('Failed to load investment records:', error)
    showToast('获取记录失败，请稍后重试')
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

const handleScroll = (e) => {
  const { scrollTop, scrollHeight, clientHeight } = e.target
  if (scrollTop + clientHeight >= scrollHeight - 10 && hasMore.value && !loadingMore.value) {
    loadRecords(true)
  }
}

onMounted(() => {
  loadRecords()
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

watch(activeTab, () => {
  loadRecords()
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding-bottom: 80px;
}
.header {
  height: 220px;
  background: url('@/assets/民生保/民生保底图.png') no-repeat center top;
  background-size: 100% 100%;
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
  margin-top: -60px;
  position: relative;
  z-index: 1;
}
.tabs {
  display: flex;
  gap: 8px;
  justify-content: flex-start;
  margin-bottom: 10px;
}
.tab {
  min-width: 72px;
  height: 28px;
  border-radius: 999px;
  background: #fff;
  color: #666;
  font-size: var(--font-size-xs);
  display: flex;
  align-items: center;
  justify-content: center;
}

.tab.active {
  background: #fff;
  color: #2b7afb;
  box-shadow: 0 6px 14px rgba(9, 68, 252, 0.18);
  font-weight: 700;
}
.list {
  margin-top: 8px;
}
.card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 6px 16px rgba(9, 68, 252, 0.12);
  overflow: hidden;
  margin-bottom: 12px;
}
.card-header {
  background: #2b7afb;
  color: #fff;
  padding: 8px 12px;
  font-size: var(--font-size-small);
  font-weight: 700;
}
.card-body {
  padding: 10px 12px;
}
.row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 6px;
}
.cell {
  background: #f7fbff;
  border-radius: 8px;
  padding: 8px;
}
.label {
  font-size: var(--font-size-xs);
  color: #666;
}

.value {
  font-size: var(--font-size-base);
  font-weight: 900;
  color: #2b7afb;
  margin-top: 4px;
}

.date {
  font-size: var(--font-size-xs);
  color: #999;
}
.empty {
  text-align: center;
  padding: 40px 0;
  color: #999;
  font-size: var(--font-size-small);
}

.empty-text {
  margin-top: 10px;
}

.loading-more {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
  font-size: var(--font-size-small);
  color: #999;
}

.loading-text {
  margin-left: 8px;
}

.no-more {
  text-align: center;
  padding: 20px 0;
  font-size: var(--font-size-small);
  color: #999;
}
</style>

