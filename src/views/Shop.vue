<template>
  <div class="page">
    <div class="header-bg">
      <van-nav-bar
        title="积分商城"
        left-arrow
        @click-left="$router.back()"
        :border="false"
        class="custom-nav-bar"
      />
    </div>

    <div class="content">
      <div class="points-card">
        <div class="points-left">
          <div class="points-label">我的积分</div>
          <div class="points-value">{{ userStore.userInfo?.score || 0 }}<span class="points-unit">积分</span></div>
        </div>
        <div class="points-right">
          <van-button size="small" type="primary" class="action-btn" @click="goRedeemLog">兑换记录</van-button>
          <van-button size="small" type="primary" class="action-btn" @click="goAddressManage">地址管理</van-button>
        </div>
      </div>

      <div class="product-grid">
        <div 
          v-for="item in products" 
          :key="item.id" 
          class="product-item"
          @click="goDetail(item.id)"
        >
          <div class="product-img">
            <van-image :src="item.coverImg" fit="cover" width="100%" height="100%" />
          </div>
          <div class="product-info">
            <div class="product-name-row">
              <div class="product-name">{{ item.goodsName }}</div>
              <div class="product-score">{{ item.score }}积分</div>
            </div>
            <div class="product-tags" v-if="item.tags">
              <span v-for="(tag, index) in item.tags.split(',')" :key="index" class="product-tag">{{ tag }}</span>
            </div>
            <div class="product-stock">商品数量 {{ item.stock }} 件</div>
          </div>
        </div>
      </div>
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
      </van-list>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { useUserStore } from '@/stores/user'
import { getGoodsPage } from '@/api/assets'

const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)
const finished = ref(false)
const products = ref([])
const page = ref(1)
const pageSize = 10

const normalizeUrl = (url) => {
  if (!url) return ''
  return String(url).replace(/`/g, '').trim()
}

const onLoad = async () => {
  if (finished.value) return
  loading.value = true

  try {
    const res = await getGoodsPage({
      pageNum: page.value,
      pageSize: pageSize
    })

    if (res.code === 200 && res.data) {
      const list = res.data.records || []
      const total = res.data.total || 0
      
      // 直接使用接口返回的数据结构
      products.value.push(...list)

      if (products.value.length >= total) {
        finished.value = true
      } else {
        page.value++
      }
    } else {
      showToast(res.msg || '获取商品失败')
      finished.value = true
    }
  } catch (error) {
    console.error(error)
    showToast('获取商品失败')
    finished.value = true
  } finally {
    loading.value = false
  }
}

const goDetail = (id) => {
  router.push({ name: 'product-detail', params: { id } })
}

const goRedeemLog = () => {
  router.push({ name: 'redeem-log' })
}

const goAddressManage = () => {
  router.push({ name: 'address-manage' })
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f7f8fa;
  padding-bottom: 50px; /* Space for tabbar */
}

.header-bg {
  height: 220px;
  background: var(--blue-gradient);
  position: relative;
}

/* Custom Nav Bar */
:deep(.van-nav-bar) {
  background-color: transparent;
}
:deep(.van-nav-bar__title) {
  color: #fff;
  font-weight: 600;
}
:deep(.van-nav-bar__arrow) {
  color: #fff;
  font-size: 20px;
}

.content {
  padding: 0 16px;
  margin-top: -160px;
  position: relative;
  z-index: 1;
}

.points-card {
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  background-image: url('@/assets/积分商城/积分背景图.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  color: #fff;
}

.points-left {
  display: flex;
  flex-direction: column;
}

.points-label {
  font-size: var(--font-size-xs);
  color: #6c6969;
  margin-bottom: 4px;
}

.points-value {
  font-size: 28px;
  font-weight: bold;
  color: #1890ff;
}

.points-unit {
  font-size: var(--font-size-xs);
  margin-left: 2px;
  color: #1890ff;
}

.points-right {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 0 12px;
  height: var(--button-mini-height);
  line-height: var(--button-mini-height);
  border-radius: 6px;
  background: var(--blue-gradient);
  border: none;
  font-size: var(--font-size-small);
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.product-item {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.product-img {
  width: 100%;
  aspect-ratio: 1; /* Square image */
  background: #d9d9d9;
}

.product-info {
  padding: 10px;
}

.product-name-row {
  display: block;
  margin-bottom: 8px;
  width: 100%;
}

.product-name {
  font-size: var(--font-size-small);
  color: #333;
  font-weight: 500;
  margin-bottom: 4px;
  word-wrap: break-word;
  white-space: normal;
  line-height: 1.4;
}

.product-score {
  font-size: var(--font-size-small);
  color: #ff4d4f;
  font-weight: 500;
  text-align: right;
}

.product-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 8px;
}

.product-tag {
  display: inline-block;
  background: #e6f7ff;
  color: #1890ff;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid #91d5ff;
  white-space: nowrap;
}

.product-stock {
  font-size: var(--font-size-xs);
  color: #666;
}
</style>