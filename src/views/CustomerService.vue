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
            <div class="faq-q">1.关于民生资产</div>
            <div class="faq-a">
              中国数据经济时代已经来临，数据已经成为了第五大生产要素，根据中华人民共和国宪法第二条明确指出：中华人民共和国的一切权利属于人民。所以毫无疑问数据资产所有权也属于全体人民，属于每一个老百姓，而要让数据发挥真正的价值，离不开数据确权工具的支撑，2024年8月10日，由国家数据局发起国务院联合五部门推出我国唯一一个个人数据确权平台APP，人民数据资产确权服务平台（简称人民数据）。于2024年9月15日，批准人民数据APP更名为人民资产APP，人民数据资产属于人民资产的一部分，未来人民资产确权工作将是重中之重，人民数据APP更名为人民资产APP能更好的完成人民资产确权工作。人民数据资产确权平台的建立，不仅能保障个人数据的合法权益，更能推动数字经济的蓬勃发展，人民数据资产确权服务平台的核心作用在于确定个人数据资产的贡献权、使用权、拥有权、价值变现权，摆脱"老百姓"只有贡献数据的权利而没有享受数据资产价值变现权的窘境，从而获得了数据资产价值分配的权利。
            </div>
          </div>

          <div class="faq-item">
            <div class="faq-q">2.办公地点</div>
            <div class="faq-a">
              北京市朝阳区人民北街79号人民数据大楼。
            </div>
          </div>

          <div class="faq-item">
            <div class="faq-q">3.是否可以申请参观总部</div>
            <div class="faq-a">
              可以联系在线客服提交申请。
            </div>
          </div>

          <div class="faq-item">
            <div class="faq-q">4.签到奖励规则</div>
            <div class="faq-a">
              1、每日签到送100股数据原始股；<br>
              2、连续签到5天赠送500股数据原始股；
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
