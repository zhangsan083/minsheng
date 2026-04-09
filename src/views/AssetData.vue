<template>
  <div class="page">
    <div class="header-bg">
      <van-nav-bar title="资产数据中心" left-arrow :border="false" @click-left="$router.back()" class="nav-bar" />
    </div>
    <div class="content"></div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.page { min-height: 100vh; background-color: #f7f8fa; }
.header-bg { height: 220px; background: var(--blue-gradient); position: relative; }
.nav-bar { background: transparent; --van-nav-bar-title-text-color: #fff; --van-nav-bar-icon-color: #fff; border-bottom: none; }
:deep(.van-nav-bar__title) { color: #fff; font-size: var(--font-size-large); font-weight: bold; }
:deep(.van-icon) { color: #fff; }
.content { padding: 0 16px; margin-top: -160px; position: relative; z-index: 1; }
</style>
