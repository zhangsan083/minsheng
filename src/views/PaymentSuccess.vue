<template>
  <div class="page">
    <div class="header">
      <van-nav-bar
        title="支付成功"
        left-arrow
        @click-left="$router.back()"
        :border="false"
        class="nav-bar"
      />
      <div class="success-icon-wrapper">
        <van-icon name="success" class="success-icon" />
      </div>
    </div>

    <div class="content">
      <div class="info-list">
        <div class="info-item">
          <span class="label">订单编号：</span>
          <span class="value">000000000000</span>
        </div>
        <div class="info-item">
          <span class="label">支付金额：</span>
          <span class="value">0000</span>
        </div>
        <div class="info-item">
          <span class="label">付款方式：</span>
          <span class="value">支付宝支付</span>
        </div>
        <div class="info-item">
          <span class="label">付款时间：</span>
          <span class="value">2026-01-01 00:00:00</span>
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
}

.header {
  height: 240px;
  background: var(--blue-gradient);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.nav-bar {
  width: 100%;
  background: transparent;
  --van-nav-bar-title-text-color: #fff;
  --van-nav-bar-icon-color: #fff;
  --van-nav-bar-title-font-size: 18px;
  --van-nav-bar-title-font-weight: bold;
}

:deep(.van-nav-bar__title) {
  color: #fff;
}

.success-icon-wrapper {
  margin-top: 40px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 4px solid #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.success-icon {
  font-size: 50px;
  color: #fff;
}

.content {
  background: white;
  margin-top: -20px; /* Slight overlap if needed, or just normal flow */
  /* For this design, it seems flat below header */
  margin-top: 0;
}

.info-list {
  padding: 30px 20px;
}

.info-item {
  display: flex;
  margin-bottom: 20px;
  font-size: 16px;
  color: #333;
}

.info-item:last-child {
  margin-bottom: 0;
}

.label {
  color: #666;
  width: 100px;
}

.value {
  color: #333;
  flex: 1;
}
</style>