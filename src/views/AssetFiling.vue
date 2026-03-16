<template>
  <div class="asset-filing-page">
    <div class="header-bg">
      <van-nav-bar
        title="资产备案"
        left-arrow
        @click-left="onClickLeft"
        :border="false"
        class="nav-bar"
      />
    </div>

    <div class="content">
      <!-- Top White Card (Placeholder/Banner) -->
      <!-- <div class="card top-card">
      </div> -->

      <!-- Pending Payment Card -->
      <div class="card pending-card">
        <div class="card-header">
          <div class="info">
            <div class="label">民生资产待兑付专项资金</div>
            <div class="amount">{{ filingData.pendingAmount }}万</div>
          </div>
          <div class="logo">
            <img src="@/assets/资产/china-dream-logo.png" alt="China Dream" />
          </div>
        </div>
        <van-button 
          type="primary" 
          block 
          round 
          color="linear-gradient(to right, #2b7afb, #0056e0)" 
          class="action-btn"
          @click="handleRegister"
        >
          点击登记
        </van-button>
      </div>

      <!-- Approved Payment Card -->
      <div class="card approved-card">
        <div class="card-header">
          <div class="info">
            <div class="label">民生资产已审批专项资金</div>
            <div class="amount">{{ filingData.paidAmount }}万</div>
          </div>
          <div class="status-badge">
            已审批通过
          </div>
        </div>
        <!-- <van-button 
          type="primary" 
          block 
          round 
          color="linear-gradient(to right, #2b7afb, #0056e0)" 
          class="action-btn"
          to="/payment-progress"
        >
          兑付进度查询
        </van-button> -->
      </div>

      <!-- Project Details -->
      <div class="section">
        <div class="section-title">
          <van-icon name="orders-o" color="#1989fa" size="20" />
          <span class="text">项目详情</span>
        </div>
        <div class="project-table-container">
          <div class="project-table">
            <div class="table-header">
              <div class="col">登记项目名称</div>
              <div class="col">登记项目金额</div>
              <div class="col">审核状态</div>
            </div>
            <div class="table-body" :class="{ scrolling: projectList.length > 5 }">
              <div class="table-row" v-for="(item, index) in projectList" :key="index">
                <div class="col name">{{ item.name }}</div>
                <div class="col amount">¥ {{ item.amount }}万</div>
                <div class="col status">
                  <span :class="['status-tag', item.statusClass]">{{ item.statusText }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Approval Publicity -->
      <div class="section">
        <div class="section-title">
          <van-icon name="bullhorn-o" color="#1989fa" size="20" />
          <span class="text">审批公示栏</span>
        </div>
        <div class="publicity-board">
          <div class="board-header">首批专项资金审批结果公示</div>
          <div class="message-container">
            <div class="message-list" :class="{ scrolling: publicityList.length > 3 }">
              <div class="message-item" v-for="(msg, index) in publicityList" :key="index">
                恭喜 <span class="highlight">{{ msg.name }}</span> 成功获批专项资金<span class="highlight">{{ msg.amount }}万元</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { showToast, showDialog } from 'vant';
import { getAssetFiling } from '@/api/assets';
import { useUserStore } from '@/stores/user';

const router = useRouter();
const userStore = useUserStore();

const onClickLeft = () => {
  router.back();
};

// 处理登记按钮点击
const handleRegister = () => {
  // 从用户信息缓存中获取资产备案数
  const assetFilingQty = userStore.userInfo?.assetFilingQty || 0;
  
  if (assetFilingQty === 0) {
    showDialog({
      title: '提示',
      message: '您当前可用的登记次数为0，请通过连续签到以获取相应的登记次数',
      confirmButtonText: '去签到',
      cancelButtonText: '知道了',
      showCancelButton: true
    }).then(() => {
      // 确认按钮点击
      router.push('/checkin');
    }).catch(() => {
      // 取消按钮点击
    });
  } else {
    router.push('/filing-registration');
  }
};

const filingData = ref({
  assetFilingQty: 0,
  pendingAmount: 0,
  paidAmount: 0,
  assetFilingList: [],
  assetFilingPubList: []
});

const loadFilingData = async () => {
  try {
    const res = await getAssetFiling();
    if (res.code === 200 && res.data) {
      filingData.value = res.data;
    } else {
      showToast(res.msg || '获取资产备案信息失败');
    }
  } catch (error) {
    console.error('Failed to load filing data:', error);
    showToast('获取资产备案信息失败，请稍后重试');
  }
};

onMounted(() => {
  loadFilingData();
});

const projectList = computed(() => {
  return filingData.value.assetFilingList.map(item => ({
    id: item.id,
    name: item.projectName,
    amount: item.projectAmount,
    statusText: getStatusText(item.reviewStatus),
    statusClass: getStatusClass(item.reviewStatus)
  }));
});

// 隐藏姓名，只展示姓，名用*代替
const hideName = (name) => {
  if (!name) return ''
  if (name.length === 1) return name
  return name[0] + '*'.repeat(name.length - 1)
}

const publicityList = computed(() => {
  return filingData.value.assetFilingPubList.map(item => ({
    name: hideName(item.realName),
    amount: item.projectAmount
  }));
});

const getStatusText = (status) => {
  const statusMap = {
    '0': '待审核',
    '1': '已通过',
    '2': '审核驳回'
  };
  return statusMap[status] || '未知';
};

const getStatusClass = (status) => {
  const classMap = {
    '0': 'pending',
    '1': 'passed',
    '2': 'failed'
  };
  return classMap[status] || 'pending';
};
</script>

<style scoped>
.asset-filing-page {
  min-height: 100vh;
  background-color: #f5f6fa;
  padding-bottom: 80px; /* Increased padding for tabbar */
}

.header-bg {
  height: 240px; /* Adjust based on image aspect ratio */
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

:deep(.van-nav-bar__title) {
  color: #fff;
}

.content {
  padding: 0 16px;
  margin-top: -30px; /* Adjust to overlap header */
  position: relative;
  z-index: 1;
}

.card {
  background: white;
  border-radius: 12px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 16px;
  position: relative;
  border: 1px solid #2b7afb; /* Add blue border to all cards */
}

.top-card {
  height: 120px;
  border: 1px solid #2b7afb; /* Ensure top card also has the border */
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px; /* Increased margin */
}

.info .label {
  font-size: var(--font-size-small);
  color: #333; /* Darker text */
  margin-bottom: 12px;
  font-weight: 500;
}

.info .amount {
  font-size: 36px; /* Larger amount text */
  font-weight: bold;
  color: #2b70fa;
  text-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

.logo img {
  height: 50px; /* Larger logo */
  width: auto;
}

.status-badge {
  background: linear-gradient(to right, #2b7afb, #0056e0);
  color: white;
  font-size: var(--font-size-xs);
  padding: 8px 16px;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  box-shadow: 0 4px 8px rgba(43, 122, 251, 0.3);
  margin-right: -16px; /* Pull to edge */
  margin-top: 2px;
  font-weight: 500;
}

.action-btn {
  font-weight: bold;
  font-size: var(--font-size-base);
  border: none;
  box-shadow: 0 4px 10px rgba(43, 122, 251, 0.3); /* Add shadow to button */
  height: 48px; /* Taller button */
}

/* Section Styles */
.section {
  margin-top: 24px;
}

.section-title {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  font-weight: bold;
  font-size: var(--font-size-base);
  color: #333;
}

.section-title .text {
  margin-left: 8px;
}

/* Table Styles */
.project-table-container {
  height: 200px;
  overflow: hidden;
  position: relative;
}

.project-table {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.table-header {
  display: flex;
  background: #f5f7fa;
  padding: 12px 16px;
  font-size: var(--font-size-xs);
  font-weight: bold;
  color: #2b7afb;
  flex-shrink: 0;
}

.table-body {
  flex: 1;
  overflow-y: auto;
  padding: 0 16px;
}

.table-body.scrolling {
  animation: scroll-up 15s linear infinite;
}

.table-body.scrolling:hover {
  animation-play-state: paused;
}

@keyframes scroll-up {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-100%);
  }
}

.table-row {
  display: flex;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  font-size: var(--font-size-xs);
  align-items: center;
  line-height: 1.4;
}

.table-row:nth-child(even) {
  background-color: #f0f7ff;
}

.table-row:last-child {
  border-bottom: none;
}

.col {
  flex: 1;
  text-align: center;
}

.col:first-child {
  text-align: left;
  flex: 1.5;
}

.col:last-child {
  text-align: right;
}

.status-tag {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: var(--font-size-xs);
  display: inline-block;
  min-width: 60px;
  text-align: center;
  color: white;
  font-weight: 500;
}

.status-tag.passed {
  background: #2b7afb;
  border: none;
}

.status-tag.failed {
  background: #ff6b6b;
  border: none;
}

.status-tag.pending {
  background: #7ec2f3;
  color: white;
  border: none;
}

/* Publicity Board */
.publicity-board {
  background: #dbeeff;
  border-radius: 12px;
  padding: 16px;
}

.board-header {
  font-size: var(--font-size-small);
  color: #666;
  margin-bottom: 12px;
  text-align: center;
  font-weight: 500;
}

.message-container {
  height: 120px;
  overflow: hidden;
  position: relative;
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.message-list.scrolling {
  animation: scroll-up 10s linear infinite;
}

.message-item {
  background: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: var(--font-size-xs);
  color: #333;
  text-align: center;
  line-height: 1.4;
}

.highlight {
  color: #2b70fa;
  font-weight: bold;
  margin: 0 4px;
}
</style>
