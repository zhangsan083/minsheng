<template>
  <div class="page">
    <div class="header">
      <van-nav-bar
        title="在线客服"
        left-arrow
        @click-left="goBack"
        :border="false"
        class="nav-bar"
      />
    </div>

    <div class="service-iframe">
      <iframe :src="serviceUrl" class="iframe" frameborder="0"></iframe>
    </div>
  </div>
</template>

<script setup>
const serviceUrl = 'https://emde.mdkchat.cn/web/preview?cptid=874607ad31eec61370&token=0e2e2f5dba'

const goBack = () => {
  window.history.back()
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #fff;
}

.header {
  height: 56px;
  background: var(--blue-gradient);
  position: relative;
}

.nav-bar {
  background: transparent;
  --van-nav-bar-title-text-color: #fff;
  --van-nav-bar-icon-color: #fff;
  --van-nav-bar-title-font-weight: bold;
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
