<template>
  <div class="page">
    <div class="header-bg">
      <van-nav-bar
        title="我的团队"
        left-arrow
        @click-left="$router.back()"
        :border="false"
        class="nav-bar"
      />
      
      <!-- Team Total Card -->
      <div class="team-total-card">
        <div class="team-icon-circle-large">
          <van-icon name="friends" color="#0944fc" size="40" />
        </div>
        <div class="team-total-info-large">
          <div class="label">团队总人数</div>
          <div class="value">{{ teamInfo.memberTotal || 0 }}</div>
        </div>
      </div>
    </div>

    <div class="content">
      <!-- Stats Overview Card -->
      <div class="card stats-card">
        <div class="total-revenue">
          <div class="label">团队总收益</div>
          <div class="value red">¥ {{ teamInfo.revenueTotal || 0 }}</div>
        </div>
        <div class="divider-h"></div>
        <div class="stats-grid">
          <!-- <div class="stat-item">
            <div class="label">团队总充值</div>
            <div class="value red">¥ {{ teamInfo.rechargeTotal || 0 }}</div>
            <div class="underline"></div>
          </div>
          <div class="stat-divider-v"></div>
          <div class="stat-item">
            <div class="label">团队总提现</div>
            <div class="value red">¥ {{ teamInfo.withdrawTotal || 0 }}</div>
            <div class="underline"></div>
          </div>
          <div class="stat-item">
            <div class="label">团队总实名</div>
            <div class="value red">{{ teamInfo.verifiedTotal || 0 }}</div>
            <div class="underline"></div>
          </div>
          <div class="stat-divider-v"></div>
          <div class="stat-item">
            <div class="label">总激活人数</div>
            <div class="value red">{{ teamInfo.activateTotal || 0 }}</div>
            <div class="underline"></div>
          </div> -->
          
          <div class="stat-item">
            <div class="label">团队总提现</div>
            <div class="value red">¥ {{ teamInfo.withdrawTotal || 0 }}</div>
            <div class="underline"></div>
          </div>
          <div class="stat-divider-v"></div>
          <div class="stat-item">
            <div class="label">团队总实名</div>
            <div class="value red">{{ teamInfo.verifiedTotal || 0 }}</div>
            <div class="underline"></div>
          </div>
        </div>
      </div>

      <!-- Invitation Code Bar -->
      <div class="invite-bar">
        <div class="invite-left">
          <van-icon name="share-o" />
          <span>我的邀请码：{{ (userStore.userInfo?.invitationCode) || '00000000' }}</span>
        </div>
        <div class="copy-btn" @click="copyCode">点击复制</div>
      </div>

      <!-- Reward Rules -->
      <!-- <div class="card rules-card">
        <div class="card-header-center">
          <div class="rules-title">奖励规则</div>
        </div>
        <div class="rules-content">
          <div class="rules-list">
            <div class="rule-item">
              <span class="rule-text">一级推荐奖励：</span>
              <span class="rule-val">15%</span>
            </div>
            <div class="rule-item">
              <span class="rule-text">二级推荐奖励：</span>
              <span class="rule-val">3%</span>
            </div>
            <div class="rule-item">
              <span class="rule-text">三级推荐奖励：</span>
              <span class="rule-val">2%</span>
            </div>
          </div>
        </div>
        <img class="rules-corner-icon" src="@/assets/我的团队/我的团队$.png" alt="" />
      </div> -->

      <!-- Data Statistics -->
      <!-- <div class="section-title">
        <div class="blue-bar"></div>
        <span>数据统计</span>
      </div>
      <div class="card data-card">
        <div class="custom-tabs">
          <div 
            class="tab-item" 
            :class="{ active: activeDataTab === 1 }" 
            @click="changeDataTab(1)"
          >今日</div>
          <div 
            class="tab-item" 
            :class="{ active: activeDataTab === 2 }" 
            @click="changeDataTab(2)"
          >本周</div>
          <div 
            class="tab-item" 
            :class="{ active: activeDataTab === 3 }" 
            @click="changeDataTab(3)"
          >本月</div>
          <div 
            class="tab-item" 
            :class="{ active: activeDataTab === 0 }" 
            @click="changeDataTab(0)"
          >累计</div>
        </div>
        
        <div class="data-rows">
          <div class="data-row">
            <div class="data-col">
              <span class="label">一级总激活人数</span>
              <span class="val red">{{ teamData.level1ActivateTotal || 0 }}人</span>
            </div>
            <div class="data-col">
              <span class="label">一级总充值金额</span>
              <span class="val red">¥{{ teamData.level1RechargeTotal || 0 }}</span>
            </div>
          </div>
          <div class="data-row">
            <div class="data-col">
              <span class="label">二级总激活人数</span>
              <span class="val red">{{ teamData.level2ActivateTotal || 0 }}人</span>
            </div>
            <div class="data-col">
              <span class="label">二级总充值金额</span>
              <span class="val red">¥{{ teamData.level2RechargeTotal || 0 }}</span>
            </div>
          </div>
          <div class="data-row">
            <div class="data-col">
              <span class="label">三级总激活人数</span>
              <span class="val red">{{ teamData.level3ActivateTotal || 0 }}人</span>
            </div>
            <div class="data-col">
              <span class="label">三级总充值金额</span>
              <span class="val red">¥{{ teamData.level3RechargeTotal || 0 }}</span>
            </div>
          </div>
        </div>
      </div> -->

      <!-- Member List -->
      <div class="section-title">
        <div class="blue-bar"></div>
        <span>成员列表</span>
      </div>
      
      <div class="member-tabs">
        <div 
          class="m-tab" 
          :class="{ active: activeMemberTab === 0 }"
          @click="changeMemberTab(0)"
        >所有</div>
        <div 
          class="m-tab" 
          :class="{ active: activeMemberTab === 1 }"
          @click="changeMemberTab(1)"
        >一级</div>
        <div 
          class="m-tab" 
          :class="{ active: activeMemberTab === 2 }"
          @click="changeMemberTab(2)"
        >二级</div>
        <div 
          class="m-tab" 
          :class="{ active: activeMemberTab === 3 }"
          @click="changeMemberTab(3)"
        >三级</div>
      </div>

      <div class="card member-card">
        <div class="member-total-bar">
          {{ getLevelName(activeMemberTab) }}团队总人数：{{ memberTotal }}人
        </div>
        
        <div class="table-header">
          <div class="th">姓名</div>
          <div class="th">手机号</div>
          <div class="th">注册时间</div>
          <div class="th">激活状态</div>
        </div>
        
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoadMember"
        >
          <div class="table-row" v-for="item in memberList" :key="item.id">
            <div class="td">{{ item.realName || '未实名' }}</div>
            <div class="td">{{ item.phonenumber }}</div>
            <div class="td">{{ formatDate(item.createDt) }}</div>
            <div class="td" :class="item.isActivate === 1 ? 'status-active' : 'status-inactive'">
              {{ item.isActivate === 1 ? '已激活' : '未激活' }}
            </div>
          </div>
        </van-list>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { showToast } from 'vant'
import { getTeamInfo, getTeamData, getMemberPage } from '@/api/team'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const teamInfo = ref({})
const teamData = ref({})
const activeDataTab = ref(1) // Default Today

const activeMemberTab = ref(1)
const memberList = ref([])
const loading = ref(false)
const finished = ref(false)
const pageNum = ref(1)
const pageSize = 10
const memberTotal = ref(0)

const fetchTeamInfo = async () => {
  try {
    const res = await getTeamInfo()
    if (res.code === 200) {
      teamInfo.value = res.data || {}
    }
  } catch (error) {
    console.error(error)
  }
}

const fetchTeamData = async () => {
  try {
    const res = await getTeamData({ dateRange: activeDataTab.value })
    if (res.code === 200) {
      teamData.value = res.data || {}
    }
  } catch (error) {
    console.error(error)
  }
}

const changeDataTab = (tab) => {
  activeDataTab.value = tab
  fetchTeamData()
}

const changeMemberTab = (tab) => {
  activeMemberTab.value = tab
  pageNum.value = 1
  memberList.value = []
  finished.value = false
  loading.value = true // Set loading true to trigger onLoad or prevent double load if handled by List
  onLoadMember()
}

const onLoadMember = async () => {
  if (finished.value) return
  
  try {
    const res = await getMemberPage({
      level: activeMemberTab.value,
      pageNum: pageNum.value,
      pageSize: pageSize
    })
    
    if (res.code === 200) {
      const records = res.data.records || []
      memberTotal.value = res.data.total || 0
      
      if (pageNum.value === 1) {
        memberList.value = records
      } else {
        memberList.value.push(...records)
      }
      
      if (memberList.value.length >= res.data.total || records.length < pageSize) {
        finished.value = true
      } else {
        pageNum.value++
      }
    } else {
      finished.value = true
    }
  } catch (error) {
    finished.value = true
    console.error(error)
  } finally {
    loading.value = false
  }
}

const copyCode = () => {
  // 从userStore中获取邀请码，如果没有则使用teamInfo中的
  const invitationCode = userStore.userInfo?.invitationCode
  
  if (invitationCode) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(invitationCode)
        .then(() => {
          showToast('复制成功')
        })
        .catch((err) => {
          console.error('Copy failed', err)
          showToast('复制失败')
        })
    } else {
      // Fallback for older browsers or insecure contexts
      const textArea = document.createElement("textarea")
      textArea.value = invitationCode
      textArea.style.position = "fixed" // Avoid scrolling to bottom
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      try {
        const successful = document.execCommand('copy')
        const msg = successful ? '复制成功' : '复制失败'
        showToast(msg)
      } catch (err) {
        console.error('Fallback copy failed', err)
        showToast('复制失败')
      }
      document.body.removeChild(textArea)
    }
  }
}

const getLevelName = (level) => {
          const map = { 0: '所有', 1: '一级', 2: '二级', 3: '三级' }
          return map[level] || ''
        }

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return dateStr.split(' ')[0] // Keep date part only if it has time
}

onMounted(() => {
  fetchTeamInfo()
  fetchTeamData()
  // Member list will be loaded by van-list automatically on mount
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f7f8fa;
  padding-bottom: 20px;
}

.header-bg {
  background: var(--blue-gradient);
  height: 220px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.nav-bar {
  background: transparent;
  width: 100%;
  --van-nav-bar-title-text-color: #fff;
  --van-nav-bar-icon-color: #fff;
  --van-nav-bar-title-font-size: var(--font-size-large);
  --van-nav-bar-title-font-weight: bold;
}
:deep(.van-nav-bar__title) { color: #fff; }
:deep(.van-icon) { color: #fff; }

.team-total-card {
  background: #fff;
  width: calc(100% - 32px);
  border-radius: 12px;
  padding: 24px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px;
  margin-top: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  box-sizing: border-box;
}

.team-icon-circle-large {
  width: 70px;
  height: 70px;
  background: #e6f7ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.team-total-info-large {
  text-align: center;
}

.team-total-info-large .label {
  font-size: var(--font-size-small);
  color: #666;
  margin-bottom: 8px;
}

.team-total-info-large .value {
  font-size: 32px;
  font-weight: bold;
  color: var(--blue-deep);
}

.content {
  padding: 0 16px;
  margin-top: -40px;
  position: relative;
  z-index: 1;
}

.card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
}

/* Stats Card */
.stats-card {
  text-align: center;
  padding-top: 20px;
  padding-bottom: 20px;
}

.total-revenue {
  margin-bottom: 20px;
}

.total-revenue .label {
  font-size: var(--font-size-small);
  color: #333;
  margin-bottom: 8px;
}

.total-revenue .value {
  font-size: 28px;
  font-weight: bold;
}

.divider-h {
  height: 1px;
  background: #eee;
  width: 80%;
  margin: 0 auto 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  row-gap: 24px;
  align-items: center;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-divider-v {
  width: 1px;
  height: 40px;
  background-color: var(--blue-deep);
}

.stat-item .label {
  font-size: var(--font-size-xs);
  color: #666;
  margin-bottom: 6px;
}

.stat-item .value {
  font-size: var(--font-size-base);
  font-weight: bold;
  margin-bottom: 4px;
}

.underline {
  width: 60px;
  height: 2px;
  background-color: #4096ff;
  opacity: 0.5;
}

.red {
  color: #ff4d4f;
}

/* Invite Bar */
.invite-bar {
  background: var(--blue-gradient);
  border-radius: 24px;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  margin-bottom: 16px;
  box-shadow: 0 4px 12px rgba(22, 119, 255, 0.3);
}

.invite-left {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: var(--font-size-small);
}

.copy-btn {
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 12px;
  border-radius: 12px;
  font-size: var(--font-size-xs);
  cursor: pointer;
}

/* Rules Card */
.rules-card {
  position: relative;
  border: 2px solid #2b7afb;
  background: #fff;
  padding-top: 22px;
  overflow: visible;
  border-radius: 14px;
}

.card-header-center {
  display: flex;
  justify-content: center;
  margin-top: -36px;
  margin-bottom: 12px;
  position: relative;
  z-index: 2;
}

.rules-title {
  width: 180px;
  height: 46px;
  background: url('@/assets/资产/section-title.png') no-repeat center;
  background-size: 100% 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: var(--font-size-base);
  font-weight: 800;
  filter: drop-shadow(0 6px 12px rgba(25, 137, 250, 0.25));
}

.rules-content {
  padding: 0 16px 12px;
}

.rules-list {
  padding-right: 90px;
}

.rule-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 42px;
  width: 230px;
  background: #cfe0ff;
  border-radius: 999px;
  padding: 0 18px;
  margin-bottom: 12px;
  font-size: var(--font-size-base);
  font-weight: 700;
  position: relative;
}

.rule-item::before,
.rule-item::after {
  content: '';
  width: 8px;
  height: 8px;
  background: #1a66ff;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
.rule-item::before {
  left: 14px;
}
.rule-item::after {
  right: 14px;
}

.rule-text {
  color: #5a5a5a;
}

.rule-val {
  color: #1a66ff;
  margin-left: 14px;
}

.rules-corner-icon {
  position: absolute;
  right: -10px;
  bottom: -14px;
  width: 96px;
  height: auto;
  pointer-events: none;
  z-index: 1;
}

/* Section Title */
.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-weight: bold;
  font-size: var(--font-size-base);
  color: var(--blue-deep);
}

.blue-bar {
  width: 4px;
  height: 16px;
  background: var(--blue-deep);
}

/* Data Tabs */
.custom-tabs {
  display: flex;
  background: var(--blue-deep);
  border-radius: 20px;
  padding: 4px;
  margin-bottom: 16px;
}

.tab-item {
  flex: 1;
  text-align: center;
  color: #fff;
  padding: 6px 0;
  border-radius: 16px;
  font-size: var(--font-size-small);
  cursor: pointer;
}

.tab-item.active {
  background: #fff;
  color: var(--blue-deep);
  font-weight: bold;
}

.data-rows {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.data-row {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
  padding-bottom: 12px;
}

.data-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.data-col {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
}

.data-col .label {
  font-size: var(--font-size-xs);
  color: #666;
}

.data-col .val {
  font-size: var(--font-size-small);
  font-weight: bold;
}

/* Member Tabs */
.member-tabs {
  display: flex;
  margin-bottom: 0;
}

.m-tab {
  flex: 1;
  text-align: center;
  padding: 12px 0;
  background: #fff;
  border: 1px solid var(--blue-deep);
  color: var(--blue-deep);
  font-weight: bold;
  font-size: var(--font-size-small);
  cursor: pointer;
}

.m-tab:first-child {
  border-radius: 8px 0 0 8px;
}
.m-tab:last-child {
  border-radius: 0 8px 8px 0;
}
.m-tab.active {
  background: var(--blue-deep);
  color: #fff;
}

.member-card {
  border-radius: 0 0 12px 12px; /* Connect with tabs? No, maybe separate */
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  margin-top: 10px; /* Space or connected? Image shows connected tabs usually or close */
  /* Re-adjust: Tabs are standalone buttons group. Then a blue bar below. */
}

/* Re-style member tabs to match image */
.member-tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 0;
}
.m-tab {
  border: 1px solid var(--blue-deep);
  background: #fff;
  color: var(--blue-deep);
  border-radius: 4px 4px 0 0; /* ? */
  /* Image: Solid blue buttons group? No, looks like segmented control. */
  /* Let's try simpler segmented look */
  border: 1px solid var(--blue-deep);
}
.m-tab.active {
  background: var(--blue-deep);
  color: #fff;
}

.member-card {
  margin-top: 0;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  padding: 0;
  overflow: hidden;
}

.member-total-bar {
  background: var(--blue-deep);
  color: #fff;
  padding: 10px;
  text-align: center;
  font-weight: bold;
  font-size: var(--font-size-small);
}

.table-header {
  display: flex;
  background: #fff;
  padding: 12px 8px;
  border-bottom: 1px solid #eee;
  font-size: var(--font-size-xs);
  font-weight: bold;
  color: #333;
}

.th {
  flex: 1;
  text-align: center;
}

.table-row {
  display: flex;
  padding: 12px 8px;
  border-bottom: 1px solid #eee;
  font-size: var(--font-size-xs);
  color: #666;
  align-items: center;
}

.td {
  flex: 1;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.status-active {
  color: var(--blue-deep);
}
.status-inactive {
  color: #999;
}
</style>
