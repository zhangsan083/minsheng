<template>
  <div class="page">
    <!-- 头部 -->
    <div class="header">
      <van-nav-bar
        title="团队长排行榜"
        left-arrow
        @click-left="goBack"
        :border="false"
        class="nav-bar"
      />
    </div>

    <div class="content">
      <!-- 排行榜标题 -->
      <div class="ranking-title">
        <img src="@/assets/团队长排行榜/团队长排行榜-标题.png" alt="团队排行榜" />
      </div>

      <!-- 前三名展示区 -->
      <div class="top-three">
        <!-- 第二名 -->
        <div class="top-item top-2">
          <div class="avatar-container">
            <div class="avatar">
              <img src="@/assets/团队长合作计划/团队长合作计划-V.png" alt="头像" />
            </div>
            <div class="top-badge">
              <img src="@/assets/团队长排行榜/团队长排行榜-top2.png" alt="TOP 2" />
            </div>
          </div>
          <div class="user-info">
            <div class="name">姓*名</div>
            <div class="region">区域名称</div>
            <div class="light-effect-wrapper">
              <img src="@/assets/团队长排行榜/团队长排行榜-光效线条.png" alt="光效" class="light-effect" />
            </div>
            <div class="score">0000</div>
          </div>
        </div>

        <!-- 第一名 -->
        <div class="top-item top-1">
          <div class="avatar-container">
            <div class="avatar">
              <img src="@/assets/团队长合作计划/团队长合作计划-V.png" alt="头像" />
            </div>
            <div class="top-badge">
              <img src="@/assets/团队长排行榜/团队长排行榜-top1.png" alt="TOP 1" />
            </div>
          </div>
          <div class="user-info">
            <div class="name">姓*名</div>
            <div class="region">区域名称</div>
            <div class="light-effect-wrapper">
              <img src="@/assets/团队长排行榜/团队长排行榜-光效线条.png" alt="光效" class="light-effect" />
            </div>
            <div class="score">0000</div>
          </div>
        </div>

        <!-- 第三名 -->
        <div class="top-item top-3">
          <div class="avatar-container">
            <div class="avatar">
              <img src="@/assets/团队长合作计划/团队长合作计划-V.png" alt="头像" />
            </div>
            <div class="top-badge">
              <img src="@/assets/团队长排行榜/团队长排行榜-top3.png" alt="TOP 3" />
            </div>
          </div>
          <div class="user-info">
            <div class="name">姓*名</div>
            <div class="region">区域名称</div>
            <div class="light-effect-wrapper">
              <img src="@/assets/团队长排行榜/团队长排行榜-光效线条.png" alt="光效" class="light-effect" />
            </div>
            <div class="score">0000</div>
          </div>
        </div>
      </div>

      <!-- 颁奖台 -->
      <div class="podium">
        <img src="@/assets/团队长排行榜/团队长排行榜-颁奖台.png" alt="颁奖台" class="podium-image" />
      </div>

      <!-- 排行榜列表 -->
      <div class="ranking-list">
        <div class="list-header">
          <div class="header-item rank-col">排名</div>
          <div class="header-item user-col">用户</div>
          <div class="header-item region-col">区域</div>
          <div class="header-item team-col">团队人数</div>
        </div>
        <div class="list-body">
          <div class="list-item" v-for="(item, index) in rankingList" :key="index" :class="{ 'item-highlight': (index + 1) % 2 === 0 }">
            <div class="item-content">
              <div class="item-rank rank-col">{{ item.rank }}</div>
              <div class="item-user user-col">{{ item.userName }}</div>
              <div class="item-region region-col">{{ item.region }}</div>
              <div class="item-team team-col">{{ item.teamCount }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 当前排名 -->
      <div class="current-rank">
        <div class="rank-info">
          <span class="rank-label">100+</span>
          <span class="rank-desc">（我当前的排名）</span>
        </div>
        <div class="region-name">区域名称</div>
        <div class="team-count">00</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 排行榜数据
const rankingList = ref([
  { rank: 1, userName: '姓*', region: '区域名称', teamCount: '0000' },
  { rank: 2, userName: '姓*', region: '区域名称', teamCount: '0000' },
  { rank: 3, userName: '姓*', region: '区域名称', teamCount: '0000' },
  { rank: 4, userName: '姓*', region: '区域名称', teamCount: '0000' },
  { rank: 5, userName: '姓*', region: '区域名称', teamCount: '0000' },
  { rank: 6, userName: '姓*', region: '区域名称', teamCount: '0000' },
  { rank: 7, userName: '姓*', region: '区域名称', teamCount: '0000' }
])

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: linear-gradient(180deg, #0066ff 0%, #0052cc 100%);
}

.header {
  position: relative;
  z-index: 10;
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
  padding-bottom: 70px;
}

/* 排行榜标题 */
.ranking-title {
  text-align: center;
  margin: 20px 0 30px;
}

.ranking-title img {
  width: 280px;
  height: auto;
}

/* 前三名展示区 */
.top-three {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 20px;
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
}

.top-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.top-1 {
  order: 2;
  transform: translateY(-20px);
}

.top-2 {
  order: 1;
}

.top-3 {
  order: 3;
}

.avatar-container {
  position: relative;
  margin-bottom: 12px;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: white;
  padding: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.top-1 .avatar {
  width: 100px;
  height: 100px;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.top-badge {
  position: absolute;
  bottom: -22px;
  left: 50%;
  transform: translateX(-50%);
  width: 106px;
}

.top-1 .top-badge {
  width: 120px;
  bottom: -20px;
}

.top-badge img {
  width: 100%;
  height: auto;
}

.user-info {
  text-align: center;
  color: white;
}

.name {
  font-size: var(--font-size-base);
  font-weight: bold;
  margin-bottom: 4px;
}

.region {
  font-size: var(--font-size-small);
  opacity: 0.9;
  margin-bottom: 4px;
}

.light-effect-wrapper {
  margin: 8px 0;
  display: flex;
  justify-content: center;
}

.light-effect {
  width: 60px;
  height: auto;
  opacity: 0.8;
}

.top-1 .light-effect {
  width: 80px;
}

.score {
  font-size: var(--font-size-base);
  font-weight: bold;
}

/* 颁奖台 */
.podium {
  position: relative;
  margin: 20px 0;
  display: flex;
  justify-content: center;
}

.podium-image {
  width: 100%;
  max-width: 400px;
  height: auto;
}

.podium-lights {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 400px;
  pointer-events: none;
}

.light-effect {
  width: 100%;
  height: auto;
  opacity: 0.6;
}

/* 排行榜列表 */
.ranking-list {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.list-header {
  display: flex;
  padding: 12px 8px;
  background: #f7f8fa;
  border-radius: 8px;
  margin-bottom: 8px;
  font-size: var(--font-size-small);
  color: #333;
  font-weight: 500;
}

.header-item {
  text-align: center;
}

.rank-col {
  width: 60px;
  flex-shrink: 0;
}

.user-col {
  flex: 1;
}

.region-col {
  flex: 1.5;
}

.team-col {
  width: 80px;
  flex-shrink: 0;
  color: #0944fc;
}

.list-body {
  margin-top: 8px;
}

.list-item {
  margin-bottom: 8px;
}

.list-item:last-child {
  margin-bottom: 0;
}

.item-highlight {
  background: #e6f0ff;
  border-radius: 8px;
}

.item-content {
  display: flex;
  padding: 12px 8px;
  align-items: center;
  font-size: var(--font-size-small);
  color: #333;
}

.item-rank {
  text-align: center;
  font-weight: 500;
}

.item-user {
  text-align: center;
}

.item-region {
  text-align: center;
}

.item-team {
  text-align: center;
  color: #0944fc;
  font-weight: 500;
}

/* 当前排名 */
.current-rank {
  background: linear-gradient(90deg, #0066ff 0%, #0052cc 100%);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.rank-info {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.rank-label {
  font-size: var(--font-size-base);
  font-weight: bold;
}

.rank-desc {
  font-size: var(--font-size-small);
  opacity: 0.9;
  width:130px;
}

.region-name {
  flex: 1;
  text-align: center;
  font-size: var(--font-size-small);
}

.team-count {
  flex: 0 0 60px;
  text-align: right;
  font-size: var(--font-size-base);
  font-weight: bold;
}
</style>
