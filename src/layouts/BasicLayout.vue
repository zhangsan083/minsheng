<template>
  <div class="basic-layout">
    <router-view />
    
    <van-tabbar
      v-if="showTabbar"
      v-model="active"
      route
      fixed
      placeholder
      safe-area-inset-bottom
      class="app-tabbar"
      @change="onChange"
    >
      <van-tabbar-item name="home" to="/home">
        <span>首页</span>
        <template #icon="props">
          <img :src="props.active ? iconHomeSelect : iconHome" />
        </template>
      </van-tabbar-item>
      <!-- <van-tabbar-item name="strategy" to="/strategy">
        <span>战略</span>
        <template #icon="props">
          <img :src="props.active ? iconStrategySelect : iconStrategy" />
        </template>
      </van-tabbar-item> -->
      <van-tabbar-item name="assets" to="/assets">
        <span>资产</span>
        <template #icon="props">
          <img :src="props.active ? iconAssetsSelect : iconAssets" />
        </template>
      </van-tabbar-item>
      <!-- <van-tabbar-item name="service" to="/service">
        <span>服务</span>
        <template #icon="props">
          <img :src="props.active ? iconServiceSelect : iconService" />
        </template>
      </van-tabbar-item> -->
      <van-tabbar-item name="profile" to="/profile">
        <span>我的</span>
        <template #icon="props">
          <img :src="props.active ? iconProfileSelect : iconProfile" />
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

// 导入底部导航图标
import iconHome from '@/assets/底功能区/首页.png'
import iconHomeSelect from '@/assets/底功能区/首页-select.png'
import iconStrategy from '@/assets/底功能区/战略.png'
import iconStrategySelect from '@/assets/底功能区/战略-select.png'
import iconAssets from '@/assets/底功能区/资产.png'
import iconAssetsSelect from '@/assets/底功能区/资产-select.png'
import iconService from '@/assets/底功能区/服务.png'
import iconServiceSelect from '@/assets/底功能区/服务-select.png'
import iconProfile from '@/assets/底功能区/我的.png'
import iconProfileSelect from '@/assets/底功能区/我的-select.png'

const route = useRoute()
const active = ref('home')

const HOME_ROUTES = new Set([
  'home',
  'news',
  'news-detail',
  'bulletin',
  'checkin',
  'checkin-log',
  'rewards-log',
  'rewards-history',
  'meeting-center',
  'group-chat',
  'download',
  'shop',
  'product-detail',
  'redeem-log'
])
const ASSETS_ROUTES = new Set([
  'assets',
  'reserve-quota',
  'reservation-details',
  'deposit-withdrawal',
  'payment-success',
  'asset-filing',
  'filing-registration',
  'filing-record',
  'payment-progress',
  'payment-progress-detail',
  'policy',
  'policy-detail',
  'recharge',
  'fund-conversion',
  'withdraw',
  'fund-transfer',
  'minsheng-plan',
  'plan-detail',
  'subsidy',
  'benefit-subsidy',
  'minsheng-treasure',
  'minsheng-treasure-records'
])
const PROFILE_ROUTES = new Set([
  'profile',
  'address-manage',
  'payment-account',
  'bind-alipay',
  'bind-bank-card',
  'real-name-auth',
  'change-password',
  'certificate',
  'certificate-detail',
  'my-team',
  'invite-friends',
  'fund-details'
])
const showTabbar = computed(() => true)
watch(() => route.name, (name) => {
  if (HOME_ROUTES.has(String(name))) {
    active.value = 'home'
  } else if (ASSETS_ROUTES.has(String(name))) {
    active.value = 'assets'
  } else if (PROFILE_ROUTES.has(String(name))) {
    active.value = 'profile'
  }
}, { immediate: true })

const onChange = index => {
  console.log('Tabbar changed to:', index)
}
</script>

<style scoped>
.basic-layout {
  min-height: 100vh;
  background: #f7f8fa;
  box-sizing: border-box;
}

/* 提高层级，防止被页面内容遮挡 */
.app-tabbar {
  z-index: 100 !important;
  position: fixed !important;
  bottom: 0 !important;
  left: 0 !important;
  width: 100% !important;
}

:deep(.van-tabbar-item__icon img) {
  height: 24px;
  width: auto;
}
</style>
