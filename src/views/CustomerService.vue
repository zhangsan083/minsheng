<template>
  <div class="page">
    <div class="header">
      <van-nav-bar
        title="客服中心"
        left-arrow
        @click-left="$router.back()"
        :border="false"
        class="nav-bar"
      />
    </div>

    <div class="content">
      <div class="service-card">
        <div class="service-header">
          <div class="service-avatar">
            <img src="@/assets/客服中心/客服头像.png" alt="客服" class="avatar-img" />
          </div>
          <div class="service-info">
            <div class="info-title">了解我们</div>
            <div class="info-subtitle">民生资产的更多信息</div>
            <div class="info-desc">
              如果您想了解更多数字信息，参与并且获得更多奖励，请联系我们！
            </div>
            <div class="info-time">
              客服在线时间：
              <div class="time">8:00–21:00</div>
            </div>
            <van-button
              type="primary"
              round
              block
              color="#0066ff"
              class="contact-btn"
              @click="handleContact"
            >
              联系客服
            </van-button>
          </div>
        </div>

        <div class="faq-section">
          <div class="section-title">
            <div class="indicator"></div>
            <span>常见问题</span>
          </div>

          <div class="faq-item">
            <div class="faq-q">一、民生资产到底是做什么的？</div>
            <div class="faq-a">
              民生资产专项工作，是对已有政策依据、已有数据记录，但尚未完成最终兑现的民生权益，进行统一核查、梳理与推进落实的一项工作。<br><br>
              核心只有一句话：<strong>把本该落实到群众名下的权益，真正落实到位。</strong>
            </div>
          </div>

          <div class="faq-item">
            <div class="faq-q">二、为什么要成立民生资产专项组？</div>
            <div class="faq-a">
              在长期执行过程中，受历史遗留、数据分散、系统迁移等因素影响，客观上存在一部分群众：<strong>有记录，有依据，但未完成最终兑现。</strong><br><br>
              因此需要统一机制，专门解决"最后一公里"的落实问题，让权益从"账面存在"走向"实际兑现"。
            </div>
          </div>

          <div class="faq-item">
            <div class="faq-q">三、这项工作最终会给大家带来什么？</div>
            <div class="faq-a">
              民生资产专项工作推动的：不是新增发放，而是依法依规，将本应属于群众的权益完成兑现。<br><br>
              坚持：<strong>一人一账，精准落实，依法推进</strong><br><br>
              最终实现：<strong>看得见、查得到、落得下、拿得到</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const serviceUrl = './chatlink.html'

const handleContact = () => {
  window.location.href = serviceUrl
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f7f8fa;
  padding-bottom: 40px;
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
  --van-nav-bar-title-font-size: var(--font-size-large);
  --van-nav-bar-title-font-weight: bold;
}

.content {
  padding: 0 16px;
  margin-top: -160px;
  position: relative;
  z-index: 1;
}

.service-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding-bottom: 20px;
}

.service-header {
  padding: 24px 16px;
  display: flex;
  gap: 16px;
  border-bottom: 1px solid #f5f5f5;
}

.service-avatar {
  width: 120px;
  flex-shrink: 0;
  display: flex;
  align-items: flex-start;
}

.avatar-img {
  width: 100%;
  height: auto;
  object-fit: contain;
}

.service-info {
  flex: 1;
}

.info-title {
  color: #0066ff;
  font-size: var(--font-size-base);
  font-weight: bold;
  margin-bottom: 4px;
}

.info-subtitle {
  color: #0066ff;
  font-size: var(--font-size-base);
  font-weight: bold;
  margin-bottom: 12px;
}

.info-desc {
  font-size: var(--font-size-small);
  color: #666;
  line-height: 1.5;
  margin-bottom: 12px;
}

.info-time {
  font-size: var(--font-size-small);
  color: #666;
  margin-bottom: 16px;
}

.info-time .time {
  color: #0066ff;
  font-size: var(--font-size-large);
  font-weight: bold;
  margin-top: 4px;
}

.contact-btn {
  height: var(--button-normal-height);
  font-size: var(--font-size-base);
}

.faq-section {
  padding: 20px 16px;
}

.section-title {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  font-size: var(--font-size-base);
  font-weight: bold;
  color: #0066ff;
}

.indicator {
  width: 4px;
  height: 16px;
  background: #0066ff;
  margin-right: 8px;
  border-radius: 2px;
}

.faq-item {
  margin-bottom: 20px;
}

.faq-item:last-child {
  margin-bottom: 0;
}

.faq-q {
  color: #0066ff;
  font-size: var(--font-size-base);
  font-weight: bold;
  margin-bottom: 8px;
}

.faq-a {
  color: #333;
  font-size: var(--font-size-small);
  line-height: 1.6;
  text-align: justify;
}

.service-iframe {
  width: 100%;
  height: calc(100vh - 56px);
  overflow: hidden;
}

.iframe {
  width: 100%;
  height: 100%;
  border: none;
}
</style>
