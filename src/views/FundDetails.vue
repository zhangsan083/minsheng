<template>
  <div class="page">
    <div class="header-bg">
      <van-nav-bar
        title="资金明细"
        left-arrow
        @click-left="$router.back()"
        :border="false"
        class="nav-bar"
      />
    </div>

    <div class="content">
      <div class="chips">
        <div
          v-for="(c, i) in chips"
          :key="i"
          :class="['chip', activeChip === c.value ? 'active' : '']"
          @click="handleChipClick(c)"
        >
          {{ c.label }}
        </div>
      </div>

      <div class="month-summary">
        <div class="month selectable" @click="showMonthPicker = true">
          {{ monthTitle }} ▼
        </div>
        <div class="summary">
          <span>支出：{{ expenseAmount }} {{ activeWalletType === '0' ? '积分' : '元' }}</span>
          <span class="income">收入：{{ incomeAmount }} {{ activeWalletType === '0' ? '积分' : '元' }}</span>
        </div>
      </div>

      <div class="list" @scroll="handleScroll">
        <van-empty v-if="records.length === 0 && !loading" description="暂无数据" />
        <van-loading v-if="loading" type="spinner" color="#1989fa" />
        <div
          class="item"
          v-for="(item, idx) in records"
          :key="idx"
          :class="idx % 2 === 1 ? 'alt' : ''"
        >
          <div class="left">
            <div class="title">{{ getWalletTypeName(item.walletType) }}</div>
            <div class="desc">{{ item.remark }}</div>
          </div>
          <div class="right">
            <div class="amount" :class="item.amount >= 0 ? 'income' : 'expense'">
              {{ item.amount >= 0 ? '+' : '' }}{{ item.amount }} {{ item.walletType === '0' ? '积分' : '元' }}
            </div>
            <div class="time">{{ formatDate(item.createDt) }}</div>
          </div>
        </div>
        <van-loading v-if="loadingMore" type="spinner" color="#1989fa" class="loading-more" />
      </div>

      <van-popup v-model:show="showMonthPicker" position="bottom" :style="{ height: '70vh' }" :z-index="4000" safe-area-inset-bottom>
        <div class="month-picker">
          <div class="picker-header">
            <span class="nav" @click="shiftMonth(-1)">上一月</span>
            <span class="current">{{ selectedYear }}-{{ (selectedMonth+'').padStart(2,'0') }}</span>
            <span class="nav" :class="{ disabled: isMonthDisabled(tempYear, tempMonth + 1) }" @click="shiftMonth(1)">下一月</span>
          </div>
          <div class="picker-grid">
            <div
              v-for="m in 12"
              :key="m"
              :class="['mcell', tempMonth === m ? 'active' : '', isMonthDisabled(tempYear, m) ? 'disabled' : '']"
              @click="!isMonthDisabled(tempYear, m) && (tempMonth = m)"
            >
              {{ m }}月
            </div>
          </div>
          <div class="picker-selected">{{ tempYear }}-{{ (tempMonth+'').padStart(2,'0') }}</div>
          <div class="picker-footer">
            <van-button type="primary" round block class="confirm-btn" @click="confirmMonth">确定</van-button>
          </div>
        </div>
      </van-popup>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { showToast } from 'vant'
import { getFundDetailsRecords, getFundDetailsHeader } from '@/api/checkin'

const chips = [
  // { label: '充值余额', value: 'recharge', walletType: '1' },
  { label: '民生保障补助金', value: 'benefit', walletType: '5' },
  { label: '推荐奖励', value: 'reward', walletType: '2' },
  { label: '积分', value: 'points', walletType: '0' },
  { label: '理财收益', value: 'finance', walletType: '3' },
  // { label: '申报资产', value: 'asset', walletType: '4' }
]
const activeChip = ref('benefit')
const activeWalletType = ref('5')

const records = ref([])
const loading = ref(false)
const loadingMore = ref(false)
const hasMore = ref(true)
const pageNum = ref(1)
const pageSize = ref(10)

const now = new Date()
const selectedYear = ref(now.getFullYear())
const selectedMonth = ref(now.getMonth() + 1)
const currentYear = now.getFullYear()
const currentMonth = now.getMonth() + 1

// 检查月份是否可选
const isMonthDisabled = (year, month) => {
  if (year > currentYear) return true
  if (year === currentYear && month > currentMonth) return true
  return false
}
const monthTitle = computed(() => {
  if (selectedYear.value === currentYear) {
    return `${selectedMonth.value} 月`
  }
  return `${selectedYear.value} 年 ${selectedMonth.value} 月`
})

const expenseAmount = ref('0.00')
const incomeAmount = ref('0.00')

const showMonthPicker = ref(false)
const tempYear = ref(selectedYear.value)
const tempMonth = ref(selectedMonth.value)

const shiftMonth = (delta) => {
  let y = tempYear.value
  let m = tempMonth.value + delta
  if (m <= 0) { m = 12; y -= 1 }
  if (m > 12) { m = 1; y += 1 }
  
  // 检查是否超过当前月份
  if (isMonthDisabled(y, m)) {
    return
  }
  
  tempYear.value = y
  tempMonth.value = m
}

const confirmMonth = () => {
  selectedYear.value = tempYear.value
  selectedMonth.value = tempMonth.value
  showMonthPicker.value = false
  // 重新加载数据
  pageNum.value = 1
  hasMore.value = true
  records.value = []
  loadFundDetailsHeader()
  loadFundDetails()
}

const handleChipClick = (chip) => {
  activeChip.value = chip.value
  activeWalletType.value = chip.walletType
  // 重新加载数据
  pageNum.value = 1
  hasMore.value = true
  records.value = []
  loadFundDetailsHeader()
  loadFundDetails()
}

const loadFundDetailsHeader = async () => {
  try {
    const consumeDate = `${selectedYear.value}-${(selectedMonth.value+'').padStart(2, '0')}`
    const params = {
      consumeDate,
      walletType: activeWalletType.value
    }
    
    const res = await getFundDetailsHeader(params)
    if (res.code === 200 && res.data) {
      expenseAmount.value = res.data.expenditure
      incomeAmount.value = res.data.income
    } else {
      console.error('获取资金明细头部信息失败:', res)
    }
  } catch (error) {
    console.error('Failed to load fund details header:', error)
  }
}

const loadFundDetails = async (isLoadMore = false) => {
  if ((loading.value || loadingMore.value) && !hasMore.value) return
  
  if (isLoadMore) {
    loadingMore.value = true
  } else {
    loading.value = true
  }
  
  try {
    const consumeDate = `${selectedYear.value}-${(selectedMonth.value+'').padStart(2, '0')}`
    const params = {
      consumeDate,
      walletType: activeWalletType.value,
      pageNum: isLoadMore ? pageNum.value + 1 : 1,
      pageSize: pageSize.value,
    }
    
    const res = await getFundDetailsRecords(params)
    if (res.code === 200 && res.data) {
      const newRecords = res.data.records || []
      if (isLoadMore) {
        records.value = [...records.value, ...newRecords]
        pageNum.value++
      } else {
        records.value = newRecords
      }
      hasMore.value = newRecords.length === pageSize.value
      
    } else {
      showToast(res.msg || '获取资金明细失败')
    }
  } catch (error) {
    console.error('Failed to load fund details:', error)
    showToast('获取资金明细失败，请稍后重试')
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

const getWalletTypeName = (walletType) => {
  const typeMap = {
    '0': '积分',
    '1': '充值余额',
    '2': '推荐奖励',
    '3': '理财收益',
    '4': '申报资产',
    '5': '民生保障补助金'
  }
  return typeMap[walletType] || '其他'
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const handleScroll = (event) => {
  const list = event.target
  const { scrollTop, clientHeight, scrollHeight } = list
  if (scrollTop + clientHeight >= scrollHeight - 10 && hasMore.value && !loadingMore.value) {
    loadFundDetails(true)
  }
}

// 初始加载数据
onMounted(() => {
  loadFundDetailsHeader()
  loadFundDetails()
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f7f8fa;
  padding-bottom: 80px;
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

.chips {
  background: #fff;
  border-radius: 12px;
  padding: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px 8px;
  margin-bottom: 12px;
}
.chip {
  padding: 8px 16px;
  border-radius: 999px;
  font-size: var(--font-size-small);
  color: #1989fa;
  background: #eef5ff;
}
.chip.active {
  background: #1989fa;
  color: #fff;
}

.month-summary {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
}
.month {
  background: #eef5ff;
  color: var(--blue-deep);
  padding: 12px 16px;
  font-weight: 600;
  font-size: var(--font-size-base);
}

.summary {
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  font-size: var(--font-size-base);
  color: #666;
}

.summary .income {
  color: #1989fa;
}

.list {
  background: #fff;
  border-radius: 12px;
  margin-top: 12px;
  overflow: hidden;
  max-height: 500px;
  overflow-y: auto;
}
.list::-webkit-scrollbar {
  width: 4px;
}
.list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}
.list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}
.list::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
.loading-more {
  text-align: center;
  padding: 12px 0;
}
.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
}
.item:last-child {
  border-bottom: none;
}
.item.alt {
  background: #eef5ff;
}
.left .title {
  font-weight: 600;
  color: #333;
  margin-bottom: 6px;
  font-size: var(--font-size-base);
}

.left .desc {
  font-size: var(--font-size-small);
  color: #999;
}

.right {
  text-align: right;
}

.right .amount {
  font-weight: 600;
  font-size: var(--font-size-base);
}

.right .amount.income {
  color: #1989fa;
}

.right .amount.expense {
  color: #ff4d4f;
}

.right .time {
  font-size: var(--font-size-xs);
  color: #999;
}

.month-picker {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
}
.picker-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  font-size: var(--font-size-base);
}
.picker-header .nav {
  color: #1989fa;
}
.picker-header .nav.disabled {
  color: #ccc;
  cursor: not-allowed;
}
.picker-header .current {
  font-weight: 600;
}
.picker-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  padding: 12px 16px;
  overflow-y: auto;
}
.mcell {
  background: #f5f7ff;
  border-radius: 8px;
  color: #333;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 56px;
  aspect-ratio: 1 / 1;
  font-size: var(--font-size-base);
}
.mcell.active {
  background: var(--blue-deep);
  color: #fff;
}
.mcell.disabled {
  background: #f5f5f5;
  color: #ccc;
  cursor: not-allowed;
}
.picker-selected {
  text-align: center;
  color: #666;
  font-size: var(--font-size-base);
  margin: 4px 0 8px;
}
.picker-footer {
  position: sticky;
  bottom: 0;
  background: #fff;
  padding: 16px 16px calc(32px + env(safe-area-inset-bottom) + 60px); /* 额外叠加底部导航高度 */
  box-shadow: 0 -6px 12px rgba(0, 0, 0, 0.06);
}
.confirm-btn {
  background: var(--blue-gradient);
  border: none;
  height: var(--button-normal-height);
  font-size: var(--font-size-base);
  box-shadow: 0 6px 12px rgba(9, 68, 252, 0.2);
}
</style>
