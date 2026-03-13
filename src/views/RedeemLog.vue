<template>
  <div class="page">
    <div class="header">
      <van-nav-bar
        title="兑换记录"
        left-arrow
        @click-left="$router.back()"
        :border="false"
        class="nav-bar"
      />
    </div>

    <div class="content">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <div class="log-list">
            <div v-for="item in list" :key="item.id" class="log-card">
              <div class="card-header">
                <span class="label">兑换时间</span>
                <span class="time">{{ item.createDt }}</span>
              </div>
              <div class="card-body">
                <div class="product-img">
                  <img :src="normalizeUrl(item.coverImg)" alt="product" />
                </div>
                <div class="product-info">
                <div class="name van-multi-ellipsis--l2">{{ item.goodsName }}</div>
                <div class="price-row">
                  <div class="left-col">
                    <span class="tag">{{ item.goodsScore }}积分兑换</span>
                  </div>
                  <div class="status-box" :class="getStatusClass(item.orderStatus)">
                    {{ item.orderStatusLabel }}
                  </div>
                </div>
              </div>
              </div>
              <div class="card-footer">
                <div class="summary">
                  {{ item.qty }}份 合计<span class="total-points">{{ item.score}}积分</span>
                </div>
              </div>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { getExchangeRecords } from '@/api/assets'

const list = ref([])
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)
const pageNum = ref(1)
const pageSize = 10

const normalizeUrl = (url) => {
  if (!url) return ''
  return String(url).replace(/`/g, '').trim()
}

const getStatusClass = (status) => {
  // 假设状态码：0-待发货/处理中, 1-已发货/成功, 2-失败/已取消
  // 根据实际业务调整颜色
  switch (String(status)) {
    case '1': return 'status-success'
    case '2': return 'status-fail'
    default: return 'status-pending'
  }
}

const loadData = async (isRefresh = false) => {
  if (isRefresh) {
    pageNum.value = 1
    finished.value = false
  }

  try {
    const res = await getExchangeRecords({
      pageNum: pageNum.value,
      pageSize: pageSize
    })

    if (res.code === 200 && res.data) {
      const { records, total } = res.data
      
      if (isRefresh) {
        list.value = records
      } else {
        list.value = [...list.value, ...records]
      }

      pageNum.value++
      
      if (list.value.length >= total) {
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
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f7f8fa;
  padding-bottom: 20px;
}

.header {
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

.log-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.log-card {
  background: #fff;
  border-radius: 12px;
  padding: 0 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 44px;
  border-bottom: 1px solid #f5f5f5;
  font-size: 14px;
}

.card-header .label {
  color: #666;
}

.card-header .time {
  color: #999;
}

.card-body {
  padding: 16px 0;
  display: flex;
  gap: 12px;
  border-bottom: 1px solid #f5f5f5;
}

.product-img {
  width: 80px;
  height: 80px;
  background: #eee;
  border-radius: 4px;
  overflow: hidden;
}

.product-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.img-placeholder {
  width: 100%;
  height: 100%;
  background: #ddd;
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 4px 0;
}

.name {
  font-size: 15px;
  color: #333;
  font-weight: 500;
}

.price-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .left-col {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .status-box {
    border: 1px solid currentColor;
    font-size: 12px;
    padding: 2px 8px;
    border-radius: 4px;
    font-weight: 500;
  }

  .status-box.status-pending {
    color: #ff976a;
    background: transparent;
  }

  .status-box.status-success {
    color: #07c160;
    background: transparent;
  }

  .status-box.status-fail {
    color: #ee0a24;
    background: transparent;
  }

  .price {
  color: #ff4d4f;
  font-size: 16px;
  font-weight: bold;
}

.tag {
  border: 1px solid #ff4d4f;
  color: #ff4d4f;
  font-size: 12px;
  padding: 0 4px;
  border-radius: 2px;
}

.card-footer {
  height: 44px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 14px;
  color: #666;
}

.total-points {
  color: #333;
  font-weight: bold;
  margin-left: 4px;
  font-size: 16px;
}
</style>
