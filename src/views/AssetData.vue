<template>
  <div class="page">
    <div class="header-bg">
      <van-nav-bar
        title="资产数据中心"
        left-arrow
        :border="false"
        @click-left="$router.back()"
        class="nav-bar"
      />
    </div>

    <div class="content">
      <div class="project-table">
        <div class="table-header">
          <div class="col col-name">登记项目名称</div>
          <div class="col col-amount">登记项目金额</div>
          <div class="col col-status">审核状态</div>
        </div>
        <div class="table-scroll">
          <van-list
            v-model:loading="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="loadData"
          >
            <div class="table-body">
              <div class="table-row" v-for="(item, index) in projectList" :key="item.id || index" :class="{ 'row-even': index % 2 === 1 }">
                <div class="col col-name">{{ item.name }}</div>
                <div class="col col-amount">¥ {{ item.amount }}万</div>
                <div class="col col-status">
                  <span :class="['status-tag', item.statusClass]">{{ item.statusText }}</span>
                </div>
              </div>
              <div v-if="projectList.length === 0 && !loading" class="table-empty">
                暂无项目数据
              </div>
            </div>
          </van-list>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { showToast } from 'vant'
import { getAssetFilingApplyPage } from '@/api/assets'

const loading = ref(false)
const finished = ref(false)
const projectList = ref([])
const pageNum = ref(1)
const pageSize = 20

const getStatusText = (status) => {
  const map = { '0': '审核中', '1': '已通过', '2': '未通过' }
  return map[status] || '未知'
}

const getStatusClass = (status) => {
  const map = { '0': 'pending', '1': 'passed', '2': 'failed' }
  return map[status] || 'pending'
}

const loadData = async () => {
  try {
    const res = await getAssetFilingApplyPage({ pageNum: pageNum.value, pageSize })
    if (res.code === 200 && res.data) {
      const rows = (res.data.records || []).map(item => ({
        id: item.id,
        name: item.projectName,
        amount: item.projectAmount,
        statusText: getStatusText(item.reviewStatus),
        statusClass: getStatusClass(item.reviewStatus)
      }))
      projectList.value.push(...rows)
      if (projectList.value.length >= res.data.total) {
        finished.value = true
      } else {
        pageNum.value++
      }
    }
  } catch (error) {
    console.error('Failed to load data:', error)
    showToast('获取数据失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background-color: #f5f6fa;
  padding-bottom: 80px;
}

.header-bg {
  height: 240px;
  background: url('@/assets/资产/资产备案登记底图.png') no-repeat top center;
  background-size: 100% auto;
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
  margin-top: 20px;
  position: relative;
  z-index: 1;
}

.project-table {
  background: #dbeeff;
  border-radius: 12px;
  overflow: hidden;
  padding: 0 0 8px;
}

.table-header {
  display: flex;
  padding: 10px 10px;
  background: #fff;
  font-size: var(--font-size-small);
  font-weight: bold;
  color: #2b7afb;
  border-bottom: 1px solid #c8ddf5;
}

.table-scroll {
  height: calc(100vh - 380px);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.table-body {
  padding: 0;
}

.table-row {
  display: flex;
  padding: 14px 16px;
  font-size: var(--font-size-small);
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  color: #333;
}

.row-even {
  background: rgba(43, 122, 251, 0.15);
}

.table-row:last-child {
  border-bottom: none;
}

.col {
  text-align: center;
}

.col-name {
  flex: 1.5;
  text-align: left;
}

.col-amount {
  flex: 1;
}

.col-status {
  flex: 0.8;
  text-align: right;
}

.status-tag {
  padding: 5px 12px;
  border-radius: 20px;
  font-size: var(--font-size-xs);
  font-weight: bold;
  display: inline-block;
  color: #fff;
}

.status-tag.passed {
  background: linear-gradient(135deg, #2b7afb, #0056e0);
}

.status-tag.failed {
  background: linear-gradient(135deg, #ff8c00, #ff6b00);
}

.status-tag.pending {
  background: linear-gradient(135deg, #7eb8f0, #5a9de0);
}

.table-empty {
  text-align: center;
  padding: 40px 0;
  color: #999;
  font-size: var(--font-size-small);
}
</style>
