<template>
  <div class="page">
    <div class="header-bg">
      <van-nav-bar
        title="签到记录"
        left-arrow
        @click-left="$router.back()"
        :border="false"
        class="nav-bar"
      />
    </div>

    <div class="content">
      <div class="table">
        <div class="thead">
          <div class="th">签到时间</div>
          <div class="th align-right">奖励积分</div>
        </div>
        <div class="tbody">
          <div class="tr" v-for="item in list">
            <div class="td">{{ item.createDt }}</div>
            <div class="td align-right">
              <span class="score-val">{{ item.amount }}</span><span class="score-unit">积分</span>
            </div>
          </div>
          <div v-if="!list.length" class="empty">
            <van-empty description="暂无签到记录" />
          </div>
        </div>
        <div class="pager">
          <div class="pager-btn" :class="{ disabled: pageNum === 1 }" @click="changePage(-1)">上一页</div>
          <span class="pageinfo">{{ pageNum }}/{{ totalPages }}</span>
          <div class="pager-btn" :class="{ disabled: pageNum >= totalPages }" @click="changePage(1)">下一页</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { showToast } from 'vant'
import { getFundDetailsRecords } from '@/api/checkin'

const list = ref([])
const pageNum = ref(1)
const pageSize = 10
const total = ref(0)

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize)))

const loadData = async () => {
  try {
    const params = {
      pageNum: pageNum.value,
      pageSize: pageSize,
      walletLogFromType: 5,
      walletType:0
    }
    
    const res = await getFundDetailsRecords(params)
    
    if (res.code === 200 && res.data) {
      list.value = res.data.records || []
      total.value = res.data.total || 0
    } else {
      showToast(res.msg || '获取签到记录失败')
    }
  } catch (error) {
    console.error('Failed to load records:', error)
    showToast('获取签到记录失败，请稍后重试')
  }
}

const changePage = (delta) => {
  const newPage = pageNum.value + delta
  if (newPage >= 1 && newPage <= totalPages.value) {
    pageNum.value = newPage
    loadData()
  }
}

onMounted(() => {
  loadData()
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
  padding: 0 16px;
  margin-top: -160px;
  position: relative;
  z-index: 1;
}

.table {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 90px);
}

.tbody {
  flex: 1;
}

.thead, .tbody .tr {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 8px;
  align-items: center;
}

.thead {
  padding: 12px 16px;
  font-weight: 600;
  background: var(--blue-gradient);
  color: #fff;
}

.tbody .tr {
  padding: 12px 16px;
  color: #666;
  font-size: var(--font-size-small);
}

.tbody .tr:nth-child(odd) {
  background: #f9f9f9;
}

.align-right {
  text-align: right;
}

.score-val {
  color: var(--blue-deep);
  font-weight: 600;
  font-size: var(--font-size-base);
}

.score-unit {
  color: #666;
  font-size: var(--font-size-xs);
  margin-left: 2px;
}

.pager {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
  padding: 20px 0;
  color: #333;
}

.pager-btn {
  font-size: var(--font-size-small);
  cursor: pointer;
  padding: 4px 12px;
}

.pager-btn.disabled {
  color: #ccc;
  cursor: not-allowed;
}

.pageinfo {
  font-size: var(--font-size-small);
  color: #333;
}

.empty {
  padding: 24px;
}
</style>
