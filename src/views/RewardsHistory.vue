<template>
  <div class="page">
    <div class="header-bg">
      <van-nav-bar
        title="领取记录"
        left-arrow
        @click-left="$router.back()"
        :border="false"
        class="nav-bar"
      />
    </div>

    <div class="content">
      <div class="list">
        <div class="card" v-for="(row, index) in claims" :key="row.id">
          <div class="card-header">
            <div class="header-title">{{ row.name }}</div>
          </div>
          <div class="card-body">
            <div class="info-row">
              <span class="label">达成条件：</span>
              <span class="value">{{ row.condit || '-' }}</span>
            </div>
            <div class="info-row">
              <span class="label">完成进度：</span>
              <span class="value completed">已完成</span>
            </div>
            <div class="info-row">
              <span class="label">任务奖励：</span>
              <span class="value">{{ row.reward }}</span>
            </div>
            <div class="btn-wrapper">
              <div class="claimed-btn">已领取</div>
            </div>
          </div>
        </div>
        <div v-if="!claims.length" class="empty">
          <van-empty description="暂无领取记录" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { showToast } from 'vant'
import { getClaimList } from '@/api/assets'

const claims = ref([])
const loading = ref(false)

const loadClaimList = async () => {
  loading.value = true
  try {
    const res = await getClaimList()
    if (res.code === 200 || res.code === 0) {
      claims.value = res.data || []
    } else {
      showToast(res.msg || '获取领取记录失败')
    }
  } catch (error) {
    console.error('Failed to load claim list:', error)
    showToast('获取领取记录失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

onMounted(() => loadClaimList())
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
}

.content {
  padding: 0 16px;
  margin-top: -160px;
  position: relative;
  z-index: 1;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
}

.card-header {
  background: var(--blue-gradient);
  padding: 12px 16px;
  text-align: center;
}

.header-title {
  color: #fff;
  font-size: 16px;
  font-weight: 600;
}

.card-body {
  padding: 16px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.info-row:last-of-type {
  margin-bottom: 16px;
}

.label {
  color: #666;
  font-size: 14px;
}

.value {
  color: #333;
  font-size: 14px;
}

.value.completed {
  color: #1989fa;
}

.btn-wrapper {
  display: flex;
  justify-content: center;
  padding-top: 8px;
  border-top: 1px solid #f0f0f0;
}

.claimed-btn {
  background: #e0e0e0;
  color: #999;
  padding: 10px 40px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

.empty {
  padding: 40px 0;
}
</style>
