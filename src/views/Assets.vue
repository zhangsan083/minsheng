<template>
  <div class="assets-page">
    <div class="header-bg">
      <van-nav-bar title="资产" :border="false" class="nav-bar" />
    </div>

    <div class="content">

      <!-- 资产中心 -->
      <div class="card center-card">
        <div class="center-list">
          <router-link class="center-item" to="/asset-filing">
            <div class="center-icon building-icon"></div>
            <span class="center-text">资产登记中心</span>
            <div class="center-arrow"></div>
          </router-link>
          <!-- <router-link class="center-item" to="/asset-query">
            <div class="center-icon query-icon"></div>
            <span class="center-text">资产查询中心</span>
            <div class="center-arrow"></div>
          </router-link>
          <router-link class="center-item" to="/asset-confirm">
            <div class="center-icon confirm-icon"></div>
            <span class="center-text">资产确权中心</span>
            <div class="center-arrow"></div>
          </router-link>
          <router-link class="center-item" to="/asset-issue">
            <div class="center-icon issue-icon"></div>
            <span class="center-text">资产下发中心</span>
            <div class="center-arrow"></div>
          </router-link>
          <router-link class="center-item" to="/asset-data">
            <div class="center-icon data-icon"></div>
            <span class="center-text">资产数据中心</span>
            <div class="center-arrow"></div>
          </router-link> -->
        </div>
      </div>

      <!-- 须知卡片 -->
      <div class="card notice-card">
        <div class="ribbon-wrapper">
          <div class="ribbon">资产登记须知</div>
        </div>
        <div class="card-body">
          <!-- 01 -->
          <div class="step-item">
            <div class="step-label">
              <span class="num">01</span>
              <span class="text">资格查询</span>
            </div>
            <div class="count-box">
              当前可用登记次数：<span class="count">{{ assetFilingQty }}</span> 次
            </div>
          </div>

          <!-- 02 -->
          <div class="step-item">
            <div class="step-label">
              <span class="num">02</span>
              <span class="text">资格获取方式</span>
            </div>
            <div class="step-desc">
              完成账户实名认证后，系统将自动为您分配2次资产登记资格。连续签到满7天，可额外获得1次资产登记资格。
            </div>
          </div>

          <!-- 03 -->
          <div class="step-item">
            <div class="step-label">
              <span class="num">03</span>
              <span class="text">重要注意事项</span>
            </div>
            <div class="step-desc">
              登记的资产信息必须与实名认证信息完全一致。若发现虚假登记，将依法追究责任，并可能永久取消登记资格。
            </div>
          </div>

          <!-- 04 (Duplicate number in image) -->
          <div class="step-item">
            <div class="step-label">
              <span class="num">04</span>
              <span class="text">重要注意事项</span>
            </div>
            <div class="step-desc highlight">
              如有疑问，请联系客服人员协助处理，我们将竭诚为您服务！
            </div>
          </div>
        </div>
        
        <!-- 底部背景 -->
      </div>
      
      <!-- 倡议卡片 -->
      <div class="card initiative-card">
        <div class="ribbon-wrapper">
          <div class="ribbon">资产登记行动倡议</div>
        </div>
        <div class="card-body">
          <div class="text-content">
            在这个数字化浪潮奔涌的时代，我们深知您用十余年光阴积累的不仅仅是资产，更是无法衡量的心血与坚持。那些因历史原因未能确权的资产、因政策调整暂时搁置的项目、因手续繁琐而“沉睡”多年的权益，现在终于迎来了重焕生机的契机。响应国家“完善产权保护制度、促进共同富裕”的号召，我们特别推出“追梦人资产登记计划”。旨在帮助市场主体和人民群众解决历史遗留资产问题，实现权益的清晰归属与高效流通。通过安全、合规的数字钱包，您的资产将完成数字化登记，明确产权归属，打破资金流动壁垒，让“沉睡资产”转化为可流通、可增值的资本。这一计划不仅助力个人重拾多年未明确的权益，更能推动社会财富的公平分配，缩小差距，让更多人共享数字经济发展成果。我们相信，每一份资产都承载着奋斗的价值。透明的流程、高效的解决方案，将帮助您轻松参与，真正实现“权益有保障、财富可流动”。现在参与，让属于您的资产回归，共同迈向更美好的未来！
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const assetFilingQty = ref(0)

onMounted(async () => {
  // 从本地存储加载用户信息
  userStore.loadFromStorage()
  
  // 刷新用户信息，确保获取最新的资产备案数
  await userStore.refreshUserInfo()
  
  // 更新资产备案数
  updateAssetFilingQty()
})

const updateAssetFilingQty = () => {
  assetFilingQty.value = userStore.userInfo?.assetFilingQty || 0
}
</script>

<style scoped>
.assets-page {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding-bottom: 80px;
}

/* Header style matching other pages */
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

/* Deep selector to ensure title color is correct */
:deep(.van-nav-bar__title) {
  color: #fff;
}

.content {
  padding: 0 16px;
  margin-top: -150px;
  position: relative;
  z-index: 1;
}

.card {
  background: white;
  border-radius: 12px;
  margin-bottom: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: visible;
  padding-top: 20px; /* Space for ribbon */
}

.ribbon-wrapper {
  position: absolute;
  top: -8px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  z-index: 5;
}

.ribbon {
  background: url('@/assets/资产/section-title.png') no-repeat center center;
  background-size: 100% 100%;
  color: white;
  padding: 8px 30px 12px; /* Adjusted padding for image */
  font-size: 20px;
  font-weight: bold;
  /* Removed border-radius and shadow as they are likely in the image */
  min-width: 200px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-body {
  padding: 24px 16px 16px;
}

.text-content {
  font-size: var(--font-size-base);
  line-height: 2.0;
  color: var(--blue-deep); /* Blue text as seen in image */
  text-align: justify;
  margin-bottom: 20px;
}

.action-btn {
  font-weight: bold;
  font-size: var(--font-size-base);
  box-shadow: 0 4px 8px rgba(22, 119, 255, 0.3);
}

/* Step Styles */
.step-item {
  margin-bottom: 16px;
}

.step-label {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.step-label .num {
  background: var(--blue-deep);
  color: white;
  font-size: var(--font-size-xs);
  padding: 2px 6px;
  border-top-left-radius: 8px;
  border-bottom-right-radius: 8px;
  margin-right: 8px;
  font-weight: bold;
}

.step-label .text {
  font-weight: bold;
  color: var(--blue-deep);
  font-size: var(--font-size-base);
}

.count-box {
  background: #f0f7ff;
  border: 1px solid #adc6ff;
  border-radius: 8px;
  padding: 12px;
  text-align: center;
  font-size: var(--font-size-base);
  font-weight: bold;
  color: #333;
}

.count-box .count {
  color: var(--blue-deep);
  font-size: var(--font-size-large);
  margin: 0 4px;
}

.step-desc {
  font-size: var(--font-size-base);
  color: #666;
  line-height: 2.0;
  padding-left: 0;
}

.step-desc.highlight {
  color: var(--blue-deep);
}

/* 资产中心样式 */
.center-card {
  padding-top: 0;
  margin-bottom: 16px;
}

.center-list {
  padding: 16px;
}

.center-item {
  display: flex;
  align-items: center;
  background: var(--blue-gradient);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  color: white;
  font-size: var(--font-size-base);
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.center-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(22, 119, 255, 0.4);
}

.center-icon {
  width: 32px;
  height: 32px;
  margin-right: 12px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

/* 图标样式 */
.building-icon {
  background-image: url('@/assets/资产/资产登记中心.png');
}

.query-icon {
  background-image: url('@/assets/资产/资产查询中心.png');
}

.confirm-icon {
  background-image: url('@/assets/资产/资产确权中心.png');
}

.issue-icon {
  background-image: url('@/assets/资产/资产下发中心.png');
}

.data-icon {
  background-image: url('@/assets/资产/资产数据中心.png');
}

.center-text {
  flex: 1;
  font-size: var(--font-size-base);
  font-weight: bold;
}

.center-arrow {
  width: 20px;
  height: 20px;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

/* 底部背景 */
/* 底部背景 removed */

.notice-card {
  background: white url('@/assets/资产/assets-bottom-bg.png') no-repeat center bottom;
  background-size: 100% 100%;
  padding-bottom: 30px;
}
</style>
