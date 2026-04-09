<template>
  <div class="page">
    <div class="header-bg">
      <van-nav-bar
        title="民生保障补助金"
        left-arrow
        @click-left="$router.back()"
        :border="false"
        class="nav-bar"
      />
    </div>

    <div class="content">
      <div class="balance-card">
        <div class="balance-header">
          <div class="balance-title">民生保障补助金余额</div>
          <div class="channel-badge" @click="goFundDetails">资金明细</div>
        </div>
        <div class="balance-value">{{ subsidyData.welfareSubsidy || 0 }} 元</div>
        <div class="balance-actions">
          <van-button round class="primary-btn" @click="goCheckin">前往签到 ></van-button>
          <van-button round class="primary-btn" @click="goMinshengTreasure">前往民生保 ></van-button>
        </div>
        <div class="balance-tip">签到得补贴，稳增长</div>
      </div>

      <div class="section-card">
        <div class="section-tag">获取途径</div>
        <div class="section-body">
          <div class="route-item">
            <div class="route-title"><span class="route-title-chip" data-index="1">新人专享</span></div>
            <div class="route-desc">
              新用户注册并完成实名认证即可获得 <span class="blue-text">{{ subsidyData.hmSubsidyVerified || 0 }}元</span> 民生保障补助金。
            </div>
          </div>
          <div class="route-item">
            <div class="route-title"><span class="route-title-chip" data-index="2">推荐有奖</span></div>
            <div class="route-desc">
              <span class="blue-text">首次推荐奖励:</span>首次推荐直属用户注册并实名，您与下级各获得 <span class="blue-text">{{ subsidyData.hmSubsidyFirstRecommend || 0 }}元</span> 民生保障补助金。<br>
              <span class="blue-text">持续推荐收益:</span>每新增一位直属用户注册并实名即获得 <span class="blue-text">{{ subsidyData.hmSubsidyRecommend || 0 }}元</span> 民生保障补助金。
            </div>
          </div>
          <div class="route-item">
            <div class="route-title"><span class="route-title-chip" data-index="3">每日签到</span></div>
            <div class="route-desc">
              <span class="blue-text">每日签到:</span>每天签到完成及获得 <span class="blue-text">{{ subsidyData.hmSubsidyCheckin || 0 }}元</span> 民生保障补助金；<br>
              <span class="blue-text">连续打卡:</span>坚持连续签到15天即获得 <span class="blue-text">{{ subsidyData.hmSubsidyCheckin15 || 0 }}元</span> 民生保障补助金。
            </div>
          </div>
        </div>
      </div>

      <div class="section-card">
        <div class="section-tag">规则说明</div>
        <div class="section-body">
          <div class="rule-desc">
            <span class="blue-text">“民生保障补助金”仅限用于“民生保”定期理财到期后，由系统自动释放至个人账户方可提现。</span>
          </div>
        </div>
      </div>

      <div class="section-card">
        <div class="section-tag">活动介绍</div>
        <div class="section-body">
          <div class="activity-desc">
            　　在新时代发展进程中，民生资产相关工作正处于关键推进阶段。<br>
            　　面对经济结构调整与发展环境变化，国家坚持以人民为中心的发展思想，围绕民生保障与权益落实，通过信息化手段与统一机制建设，将“稳发展、惠民生”的总体目标，转化为可执行、可跟进的具体实践路径。<br>
            　　通过构建规范化、数字化的管理体系，不断提升权益核查、流程推进与结果落实的效率与透明度，推动民生保障工作由分散推进向系统化运行转变，为实现发展成果更加公平惠及全体人民提供有力支撑。
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { getHmSubsidy } from '@/api/assets'

const router = useRouter()
const subsidyData = ref({})

const loadSubsidyData = async () => {
  try {
    const res = await getHmSubsidy()
    if (res.code === 200 && res.data) {
      subsidyData.value = res.data
    } else {
      showToast(res.msg || '获取数据失败')
    }
  } catch (error) {
    console.error('Failed to load subsidy data:', error)
    showToast('获取数据失败，请稍后重试')
  }
}

onMounted(() => {
  loadSubsidyData()
})

const goCheckin = () => {
  router.push({ name: 'checkin' })
}

const goMinshengTreasure = () => {
  router.push({ name: 'minsheng-treasure' })
}
const goFundDetails = () => {
  router.push({ name: 'fund-details' })
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f7f8fa;
  padding-bottom: 80px;
}
.header-bg {
  height: 200px;
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
  margin-top: -140px;
  position: relative;
  z-index: 1;
}

/* Balance Card */
.balance-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 6px 16px rgba(9, 68, 252, 0.12);
}
.balance-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.balance-title {
  font-weight: bold;
  color: var(--blue-deep);
  font-size: var(--font-size-base);
}
.channel-badge {
  border: 0;
  color: #fff;
  border-radius: 999px;
  font-size: var(--font-size-small);
  padding: 6px 12px;
  background: var(--blue-gradient);
}
.balance-value {
  font-size: 24px;
  font-weight: bold;
  margin: 12px 0 8px;
  color: var(--blue-deep);
}
.balance-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 8px;
}
.primary-btn {
  height: var(--button-small-height);
  background: var(--blue-gradient);
  color: #fff;
  border: none;
  padding: 0 16px;
  font-size: var(--font-size-small);
}
.balance-tip {
  font-size: var(--font-size-small);
  color: #999;
  text-align: center;
}

/* Section Card */
.section-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px 12px 12px;
  margin-bottom: 16px;
  position: relative;
  box-shadow: 0 6px 16px rgba(9, 68, 252, 0.12);
}
.section-tag {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  height: 32px;
  min-width: 80px;
  padding: 0 24px;
  color: #fff;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: url('@/assets/战略/标题.png') no-repeat center;
  background-size: 100% 100%;
}
.section-body {
  margin-top: 12px;
}
.route-item + .route-item {
  margin-top: 12px;
}
.route-title {
  font-weight: bold;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: var(--font-size-base);
}
.route-title-chip {
  display: inline-block;
  height: 30px;
  line-height: 24px;
  padding: 3px 35px 3px 35px;
  color: #fff;
  font-weight: 700;
  background: url('@/assets/惠民补助金/未标题-1.png') no-repeat center;
  background-size: 100% 100%;
  border-radius: 999px;
  position: relative;
}
.route-title-chip::before {
  content: attr(data-index);
  position: absolute;
  left: 11px;
  top: 50%;
  transform: translateY(-50%);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
}
.badge {
  background: var(--blue-deep);
  color: #fff;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}
.route-desc {
  font-size: var(--font-size-small);
  color: #333;
  line-height: 2.0;
  background: #f7fbff;
  border-radius: 8px;
  padding: 10px 12px;
}
.rule-desc, .activity-desc {
  font-size: var(--font-size-small);
  color: #333;
  line-height: 2.0;
}
.blue-text {
  color: var(--blue-deep);
  font-weight: bold;
}
</style>
