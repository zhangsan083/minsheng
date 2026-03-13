<template>
  <div class="reserve-page">
    <div class="header">
      <van-nav-bar title="预订额度" left-arrow @click-left="$router.back()" :border="false" class="nav-bar" />
    </div>
    
    <div class="content">
      <!-- Chart Card -->
      <div class="chart-card">
        <div class="chart-tag">总仓3.5万亿兑付额度分配</div>
        <div class="chart-content">
          <div class="pie-chart-container">
            <div class="pie-chart">
              <div class="pie-segment segment-1"></div>
              <div class="pie-segment segment-2"></div>
              <div class="pie-overlay">
                <div class="pie-text">约50%</div>
                <div class="pie-text-bottom">约50%</div>
              </div>
            </div>
          </div>
          <div class="chart-legend">
            <div class="legend-title">数据显示</div>
            <div class="legend-item">
              <span class="dot blue"></span>
              <span class="text">已订购额度</span>
              <span class="value">约50%</span>
            </div>
            <div class="legend-item">
              <span class="dot gray"></span>
              <span class="text">剩余可预定额度</span>
              <span class="value">约50%</span>
            </div>
            <div class="update-time">数据更新于：2026-01-01 00:00:00</div>
          </div>
        </div>
      </div>

      <!-- Gray Placeholder/Banner -->
      <div class="gray-banner"></div>

      <!-- Personal Info Card -->
      <div class="info-card">
        <div class="section">
          <div class="section-header">
            <span class="label">个人诚信定金</span>
          </div>
          <div class="amount-row">
            <div class="amount">
              <span class="symbol">¥</span>
              <span class="num">0000</span>
            </div>
            <van-button size="small" type="primary" class="action-btn" @click="$router.push('/deposit-withdrawal')">定金取款</van-button>
          </div>
        </div>

        <div class="divider"></div>

        <div class="section">
          <div class="section-header">
            <span class="label">个人已预订兑付额度</span>
          </div>
          <div class="amount-row">
            <div class="amount">
              <span class="symbol">¥</span>
              <span class="num">0000</span>
            </div>
            <div class="btn-group">
              <van-button size="small" type="primary" class="action-btn" @click="$router.push('/reservation-details')">预订明细</van-button>
              <van-button size="small" type="primary" class="action-btn">多订多享</van-button>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Action Button -->
      <div class="submit-area">
        <van-button 
          block 
          color="var(--blue-gradient)" 
          round 
          class="submit-btn"
          @click="handleReserve"
        >
          我要预订
        </van-button>
      </div>

      <!-- Confirm Quota Dialog Removed -->

      <!-- Payment Password Dialog Removed -->

      <!-- Rules Card -->
      <div class="rules-card">
        <div class="rules-title">预订规则：</div>
        <div class="rules-content">
          <p>首次预订：首次存入诚信定金500元预订100万兑付额度，后续存入100元诚信定金即可预订100万兑付额度。</p>
          <p>继续预订：100元诚信定金预订100万元兑付额度。</p>
          <p>示例：</p>
          <p>首次存入500元诚信定金，个人已预订兑付额度持有100万元；</p>
          <p>后续每存入100元诚信定金，个人已预订兑付额度增加100万元；</p>
          <p>（除首次存入外，后续每100元诚信定金即可预订100万兑付额度，多订多享赠送的兑付额度自行领取，详情可查看预订明细）</p>
          <p>根据自身情况，选择希望预订的兑付额度。</p>
          <p>预订使用的诚信定金待首轮额度分配完后单独优先提取，此预订过程不收取任何手续费，平台承诺该定金将原路退还。</p>
          <p>本轮兑付总额度有限，将严格依据预订成功的先后顺序进行分配，直至额度耗尽。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

const router = useRouter()

const handleReserve = () => {
  showToast('功能暂未开放')
}
</script>

<style scoped>
.reserve-page {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding-bottom: 80px;
}

.header {
  height: 220px;
  background: url('@/assets/战略/strategy-bg.png') no-repeat center top;
  background-size: 100% 100%;
  position: relative;
}

.nav-bar {
  background: transparent;
  --van-nav-bar-title-text-color: #fff;
  --van-nav-bar-title-font-size: 18px;
  --van-nav-bar-title-font-weight: bold;
}

:deep(.van-nav-bar .van-icon) {
  color: #fff;
}

.content {
  padding: 0 16px;
  margin-top: -60px;
  position: relative;
  z-index: 1;
}

/* Chart Card */
.chart-card {
  background: #fff;
  border-radius: 12px;
  padding: 44px 16px 16px;
  margin-bottom: 16px;
  position: relative;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #1989fa;
}

.chart-tag {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  background: url('@/assets/战略/标题.png') no-repeat center;
  background-size: 100% 100%;
  color: #fff;
  font-size: 12px;
  height: 34px;
  min-width: 220px;
  padding: 0 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  font-weight: bold;
}

.chart-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.pie-chart-container {
  width: 120px;
  height: 120px;
  position: relative;
}

.pie-chart {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: conic-gradient(#1989fa 0% 50%, #cccccc 50% 100%);
  position: relative;
}

.pie-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 25px 0;
  box-sizing: border-box;
  align-items: center;
  pointer-events: none;
}

.pie-text {
  color: #0044aa;
  font-size: 12px;
  font-weight: bold;
}

.pie-text-bottom {
  color: #fff;
  font-size: 12px;
  font-weight: bold;
}

.chart-legend {
  flex: 1;
  margin-left: 20px;
}

.legend-title {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin-bottom: 12px;
  text-align: center;
}

.legend-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 12px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  margin-right: 8px;
}

.dot.blue { background: #1989fa; }
.dot.gray { background: #cccccc; }

.text {
  color: #666;
  flex: 1;
}

.value {
  color: #666;
}

.update-time {
  font-size: 10px;
  color: #999;
  margin-top: 12px;
  text-align: right;
}

/* Gray Banner */
.gray-banner {
  height: 100px;
  background: #ccc;
  border-radius: 12px;
  margin-bottom: 16px;
}

/* Info Card */
.info-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
  border: 1px solid #1989fa;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.section {
  margin-bottom: 12px;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.label {
  font-size: 14px;
  color: #666;
}

.amount-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.amount {
  color: #1989fa;
  font-weight: bold;
  font-size: 24px;
}

.payment-input-container {
  padding: 20px 16px;
}

.payment-input {
  border: 1px solid #ebedf0;
  border-radius: 4px;
  padding: 10px;
}

.confirm-content {
  padding: 20px 16px;
}

.confirm-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 15px;
}

.confirm-row .label {
  color: #666;
}

.confirm-row .value {
  color: #333;
  font-weight: 500;
}

.confirm-row .value.amount {
  color: #1989fa;
  font-weight: bold;
}

.confirm-tip {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  color: #999;
  font-size: 12px;
  
  .van-icon {
    margin-right: 4px;
  }
}

.symbol {
  font-size: 14px;
  margin-right: 4px;
  color: #333;
}

.action-btn {
  background: #1989fa;
  border: none;
  border-radius: 6px;
  height: 28px;
  line-height: 26px;
  padding: 0 12px;
  font-size: 12px;
}

.btn-group {
  display: flex;
  gap: 8px;
}

.divider {
  height: 1px;
  background: #ebedf0;
  margin: 16px 0;
}

/* Submit Button */
.submit-area {
  margin-bottom: 24px;
}

.submit-btn {
  font-weight: bold;
  font-size: 16px;
  box-shadow: 0 4px 10px rgba(25, 137, 250, 0.3);
}

/* Rules Card */
.rules-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #1989fa;
}

.rules-title {
  font-weight: bold;
  color: #1989fa;
  margin-bottom: 8px;
  font-size: 14px;
}

.rules-content p {
  font-size: 12px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 4px;
  text-align: justify;
}
</style>
