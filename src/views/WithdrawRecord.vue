<template>
  <div class="page">
    <div class="header-bg">
      <van-nav-bar
        title="提现记录"
        left-arrow
        @click-left="$router.back()"
        :border="false"
        class="nav-bar"
      />
    </div>

    <div class="content">
      <div class="record-list">
        <div 
          v-for="(record, index) in records" 
          :key="index"
          class="record-item"
        >
          <div class="record-left">
            <img :src="getAccountIcon(record.accountType)" class="account-icon" />
            <div class="record-info">
              <div class="record-amount">提现到{{ getAccountTypeName(record.accountType) }}{{ record.amount }}元</div>
              <div class="record-time">
                {{ record.createDt }}
              </div>
            </div>
          </div>
          <div class="record-right">
            <div class="status-tag" :class="getStatusClass(record.withdrawStatus)">
              {{ getStatusText(record.withdrawStatus) }}
            </div>
            <span v-if="record.withdrawStatus === '4' && record.remark" class="reject-reason">
              {{ record.remark }}
            </span>
          </div>
        </div>
        
        <!-- 加载更多 -->
        <div v-if="hasMore && records.length > 0" class="load-more" @click="loadMore">
          {{ loading ? '加载中...' : '加载更多' }}
        </div>
        
        <!-- 没有更多 -->
        <div v-if="!hasMore && records.length > 0" class="no-more">
          没有更多了
        </div>
        
        <!-- 空状态 -->
        <div v-if="records.length === 0 && !loading" class="empty-state">
          <van-empty description="暂无提现记录" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showLoadingToast } from 'vant'
import { getWithdrawPage } from '@/api/auth'

import iconAlipay from '@/assets/立即提现/支付宝.png'
import iconBank from '@/assets/立即提现/银行卡.png'

const router = useRouter()
const records = ref([])
const loading = ref(false)
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)
const hasMore = ref(true)

const loadRecords = async (reset = true) => {
  if (loading.value) return
  
  if (reset) {
    pageNum.value = 1
    records.value = []
  }
  
  loading.value = true
  const toast = showLoadingToast({
    message: '加载中...',
    forbidClick: true,
    duration: 0
  })
  
  try {
    const res = await getWithdrawPage({
      pageNum: pageNum.value,
      pageSize: pageSize.value
    })
    toast.close()
    
    if (res.code === 200 || res.code === 0) {
      if (reset) {
        records.value = res.data?.records || []
      } else {
        records.value = [...records.value, ...(res.data?.records || [])]
      }
      total.value = res.data?.total || 0
      hasMore.value = records.value.length < total.value
      if (hasMore.value) {
        pageNum.value++
      }
    } else {
      showToast(res.msg || '获取提现记录失败')
    }
  } catch (error) {
    toast.close()
    console.error('Failed to load withdraw records:', error)
    showToast('获取提现记录失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

const loadMore = () => {
  if (!loading.value && hasMore.value) {
    loadRecords(false)
  }
}

const getAccountIcon = (type) => {
  return String(type) === '1' ? iconAlipay : iconBank
}

const getAccountTypeName = (type) => {
  return String(type) === '1' ? '支付宝' : '银行卡'
}

const getStatusText = (status) => {
  const statusMap = {
    '0': '待审核',
    '1': '已确认',
    '2': '出款中',
    '3': '已完成',
    '4': '已取消'
  }
  return statusMap[status] || '未知状态'
}

const getStatusClass = (status) => {
  const statusMap = {
    '0': 'status-pending',
    '1': 'status-processing',
    '2': 'status-processing',
    '3': 'status-approved',
    '4': 'status-rejected'
  }
  return statusMap[status] || ''
}

onMounted(() => {
  loadRecords()
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f7f8fa;
  padding-bottom: 80px;
}

.header-bg {
  background: var(--blue-gradient);
  height: 220px;
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

.record-list {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.record-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.record-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #f5f6f7;
  position: relative;
}

.record-item:last-child {
  border-bottom: none;
}

.record-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.account-icon {
  width: 32px;
  height: 32px;
  object-fit: contain;
  border-radius: 4px;
}

.record-info {
  flex: 1;
}

.record-amount {
  font-size: var(--font-size-base);
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
}

.record-time {
  font-size: var(--font-size-xs);
  color: #999;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.reject-reason {
  font-size: var(--font-size-xs);
  color: #ff4d4f;
  background: #fff2f0;
  padding: 2px 8px;
  border-radius: 4px;
}

.status-tag {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: var(--font-size-xs);
  font-weight: bold;
}

.status-pending {
  background: white;
  color: #1890ff;
  border: 1px solid #1890ff;
}

.status-processing {
  background: #f0f0f0;
  color: #999;
}

.status-approved {
  background: #1890ff;
  color: white;
}

.status-rejected {
  background: #f0f0f0;
  color: #ff4d4f;
}

.status-confirmed {
  background: #1890ff;
  color: white;
}

.load-more {
  padding: 16px;
  text-align: center;
  color: #1890ff;
  font-size: var(--font-size-small);
  cursor: pointer;
}

.no-more {
  padding: 16px;
  text-align: center;
  color: #999;
  font-size: var(--font-size-small);
}

.empty-state {
  padding: 40px 0;
}
</style>
