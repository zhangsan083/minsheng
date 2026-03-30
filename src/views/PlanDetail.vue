<template>
  <div class="page">
    <!-- Header with custom background -->
    <div class="custom-header">
      <div class="header-bg"></div>
      <van-nav-bar
        title="骏马关怀计划"
        left-arrow
        @click-left="$router.back()"
        :border="false"
        class="nav-bar"
      />
    </div>

    <div class="content">
      <!-- Top Info Card -->
      <div class="top-card">
        <div class="info-row">
          <div class="info-box">
            <div class="info-label">增加“见付现则”确认额度</div>
            <div class="info-value">0000000000.00</div>
          </div>
          <div class="info-box">
            <div class="info-label">转化民生消费额度</div>
            <div class="info-value">0000000000.00</div>
          </div>
        </div>
        <van-button block color="#2b7afb" round class="buy-btn">立即抢购</van-button>
      </div>

      <!-- Progress Bar -->
      <div class="progress-section">
        <div class="progress-header">
          <span>已订购份额</span>
          <span>00%</span>
        </div>
        <van-progress :percentage="0" stroke-width="8" track-color="#e5e5e5" color="#2b7afb" :show-pivot="false" />
      </div>

      <!-- Description Text -->
      <div class="desc-card">
        <div class="desc-text">
          因需在央行存档报备原因，民生资产在新年来临之际推出专项支付服务，可通过民生计划将确认额度，转换为可临时改善生活的民生消费金。
        </div>
        
        <div class="desc-item">
          <div class="desc-title text-blue">说明一：系统识别</div>
          <div class="desc-content">系统自动识别名下"见付现则"政策中的专项确认额度，并启动转换流程</div>
        </div>
        <div class="desc-item">
          <div class="desc-title text-blue">说明二：平台协同</div>
          <div class="desc-content">平台协同相关国家支付机构，完成临时额度转换，用于民生消费</div>
        </div>
        <div class="desc-item">
          <div class="desc-title text-blue">说明三：资金划转</div>
          <div class="desc-content">认购成功后，民生消费额度可等额、安全地划转成通用的"民生消费金"，并进入民生资产专属账户</div>
        </div>
        <div class="desc-item">
          <div class="desc-title text-blue">说明四：民生消费</div>
          <div class="desc-content">转化后的民生消费额度待支付系统完善后，可即刻用于"衣食住行、就医就学、缴费购物"等广泛的民生消费场景，直接惠及民生生活。</div>
        </div>
      </div>

      <div class="section-intro">
        为切实保障民生，民生资产将提供“转换无忧”服务。在民生消费额度支付开启等待空窗期，系统将根据民生计划不同的关怀产品，提供相对应的不等收益，保障用户应急需求。
      </div>

      <!-- Mechanism Section -->
      <div class="mechanism-section">
        <div class="section-title">
          <span class="dot"></span>
          民生计划表现与机制
        </div>
        <div class="blue-card">
          <div class="tab-header">
            <span class="tab-active">稳定增值型</span>
            <span class="tab-inactive">固定收益</span>
            <span class="tab-inactive">阶梯收益</span>
          </div>
          <div class="rate-display">
            <div class="rate-label">固定式利息（周息）</div>
            <div class="rate-value">00.00<span class="percent">%</span></div>
            <div class="rate-line"></div>
          </div>
          <ul class="feature-list">
            <li>按周固定生息</li>
            <li>广怀产品认购成功即刻生效，兑付规则确认额度与民生消费额度可追溯</li>
            <li>认购成功后可固定<span class="text-blue">每周生息10.00%</span>的收益</li>
            <li>民生关怀产品长期有效，周期为三年，一年后可提前赎回本金，收益不停歇</li>
          </ul>
        </div>
      </div>

      <!-- Comparison Section -->
      <div class="comparison-section">
        <div class="section-title">
          <span class="dot"></span>
          模式对比
        </div>
        <div class="blue-card light-blue-bg">
          <div class="sub-title text-blue">稳定增值型</div>
          <div class="compare-text">
            收益特点：固定不变，周息10.00%<br>
            收益确定性：稳定，可预期计算<br>
            资金灵活性：始终享有固定收益，与民生消费额度支付窗口开启不冲突<br>
            适合群体：稳健型、需要稳定现金流、短期意向者
          </div>
        </div>
        <div class="blue-card light-blue-bg mt-10">
          <div class="sub-title text-blue">阶梯增长型</div>
          <div class="compare-text">
            收益特点：递增封顶，5.00%起步，每季度（即12周）+5.00%，最高25.00%<br>
            收益确定性：前期较低，后期固定，周息周期明确收益潜力：收益更高，但需要时间达到峰值资金灵活性：前期回报率较低，长期持有更具筹适算体：耐心型，追求长期回报，资金可长期沉淀者
          </div>
        </div>
      </div>

      <!-- Background Section -->
      <div class="background-section">
        <div class="section-title">
          <span class="dot"></span>
          民生计划背景
        </div>
        <div class="bg-text">
          百姓富"是习近平总书记"以人民为中心"思想的具体体现。"增收"是为了"致富"，直接关系到人民群众生活水平的提高和生活质量的改善，是人民群众最直观感受发展成果的重要方面。全方位改善民生，让老百姓钱袋子鼓起来，2026年民生工作"主打"一个"增"字。
        </div>
        <div class="slogan text-blue">
          “增”加确认额度，促共同富裕<br>
          “增”加收益比率，抱民生福祉
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.page {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding-bottom: 80px;
}

.custom-header {
  height: 220px;
  position: relative;
  overflow: hidden;
}

.header-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('@/assets/服务/subsidy.png');
  background-size: cover;
  background-position: center;
  filter: blur(4px);
  transform: scale(1.1);
  z-index: 0;
}

.nav-bar {
  background: transparent;
  --van-nav-bar-title-text-color: #fff;
  --van-nav-bar-icon-color: #fff;
  --van-nav-bar-title-font-size: var(--font-size-large);
  --van-nav-bar-title-font-weight: bold;
  position: relative;
  z-index: 1;
}

.content {
  padding: 0 16px;
  margin-top: -160px;
  position: relative;
  z-index: 1;
}

.top-card {
  position: relative;
  z-index: 1;
  background: rgba(255, 255, 255, 0.9);
  margin-bottom: 16px;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.progress-section {
  position: relative;
  z-index: 1;
  background: rgba(255, 255, 255, 0.9);
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  font-size: var(--font-size-small);
  color: #2b7afb;
  margin-bottom: 8px;
  font-weight: bold;
}

.info-row {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
}

.info-box {
  flex: 1;
  border: 1px solid #2b7afb;
  border-radius: 4px;
  padding: 8px;
  text-align: center;
  background: #fff;
}

.info-label {
  font-size: var(--font-size-xs);
  color: #666;
  margin-bottom: 4px;
}

.info-value {
  font-size: var(--font-size-small);
  color: #2b7afb;
  font-weight: bold;
}

.buy-btn {
  font-weight: bold;
  font-size: var(--font-size-base);
  height: var(--button-normal-height);
}

.desc-card {
  background: #eef4ff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.desc-text {
  font-size: var(--font-size-small);
  line-height: 1.6;
  margin-bottom: 16px;
  color: #333;
  text-indent: 2em;
}

.desc-item {
  background: #fff;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 10px;
}

.desc-title {
  font-weight: bold;
  font-size: var(--font-size-small);
  margin-bottom: 4px;
}

.desc-content {
  font-size: var(--font-size-xs);
  color: #666;
  line-height: 1.5;
}

.section-intro {
  font-size: var(--font-size-small);
  line-height: 1.6;
  color: #333;
  margin-bottom: 20px;
  text-indent: 2em;
}

.section-title {
  font-size: var(--font-size-base);
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.dot {
  width: 6px;
  height: 6px;
  background: #2b7afb;
  border-radius: 50%;
}

.blue-card {
  background: #e6f0ff; /* Light blue */
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
}

.tab-header {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  align-items: center;
}

.tab-active {
  color: #fff;
  font-size: var(--font-size-base);
  font-weight: bold;
}

.tab-inactive {
  background: #fff;
  color: #2b7afb;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: var(--font-size-xs);
}

.rate-display {
  margin-bottom: 16px;
}

.rate-label {
  font-size: var(--font-size-xs);
  color: #666;
}

.rate-value {
  font-size: 32px;
  color: #2b7afb;
  font-weight: bold;
  line-height: 1.2;
}

.percent {
  font-size: 16px;
}

.rate-line {
  height: 2px;
  background: #2b7afb;
  margin-top: 8px;
  width: 100%;
}

.feature-list {
  padding-left: 16px;
  font-size: var(--font-size-xs);
  color: #666;
  line-height: 1.8;
}

.light-blue-bg {
  background: #e6f0ff;
}

.mt-10 {
  margin-top: 10px;
}

.sub-title {
  font-weight: bold;
  margin-bottom: 8px;
  font-size: var(--font-size-small);
}

.compare-text {
  font-size: var(--font-size-xs);
  color: #666;
  line-height: 1.6;
}

.bg-text {
  font-size: var(--font-size-small);
  line-height: 1.6;
  color: #666;
  margin-bottom: 16px;
  text-indent: 2em;
}

.slogan {
  text-align: center;
  font-weight: bold;
  font-size: var(--font-size-small);
  line-height: 1.6;
}

.text-blue {
  color: #2b7afb;
}
</style>
