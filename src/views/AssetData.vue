
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
      <div class="publicity-board">
        <div class="board-header">首批专项资金审批结果公示</div>
        <div class="board-scroll">
          <van-list
            v-model:loading="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="loadData"
          >
            <div class="board-list">
              <div class="board-item" v-for="(item, index) in publicityList" :key="index">
                恭喜 <span class="highlight">{{ item.name }}</span> 成功获批专项资金<span class="highlight">{{ item.amount }}万元</span>
              </div>
              <div v-if="publicityList.length === 0 && !loading" class="board-empty">
                暂无公示数据
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
import { getAssetFilingPubPage } from '@/api/assets'

const loading = ref(false)
const finished = ref(false)
const publicityList = ref([])
const pageNum = ref(1)
const pageSize = 20

const hideName = (name) => {
  if (!name) return ''
  if (name.length === 1) return name
  return name[0] + '*'.repeat(name.length - 1)
}

const loadData = async () => {
  try {
    const res = await getAssetFilingPubPage({ pageNum: pageNum.value, pageSize })
    if (res.code === 200 && res.data) {
      const rows = (res.data.records || []).map(item => ({
        name: hideName(item.realName),
        amount: item.projectAmount
      }))
      publicityList.value.push(...rows)
      if (publicityList.value.length >= res.data.total) {
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

.publicity-board {
  background: #dbeeff;
  border-radius: 12px;
  padding: 20px 16px;
}

.board-header {
  font-size: var(--font-size-base);
  color: #333;
  font-weight: 500;
  text-align: center;
  margin-bottom: 16px;
}

.board-scroll {
  height: calc(100vh - 420px);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.board-list {
  background: #fff;
  border-radius: 8px;
  border: 1px solid #c8ddf5;
}

.board-item {
  padding: 12px 16px;
  font-size: var(--font-size-small);
  color: #333;
  text-align: center;
  border-bottom: 1px solid #e8eef5;
  line-height: 1.6;
}

.board-item:last-child {
  border-bottom: none;
}

.highlight {
  color: #2b70fa;
  font-weight: bold;
}

.board-empty {
  text-align: center;
  padding: 40px 0;
  color: #999;
  font-size: var(--font-size-small);
}
</style>
