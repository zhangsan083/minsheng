<template>
  <div class="page">
    <!-- 头部 -->
    <div class="header">
      <van-nav-bar
        title="团队排行榜"
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
            <div class="top-badge">
              <img src="@/assets/团队长排行榜/团队长排行榜-top2.png" alt="TOP 2" />
            </div>
          </div>
          <div class="user-info">
            <div class="name">{{ (topThree.length >= 2 && topThree[1].realName) || '' }}</div>
            <div class="region">{{ (topThree.length >= 2 && topThree[1].province) || '' }}</div>
            <div class="light-effect-wrapper">
              <img src="@/assets/团队长排行榜/团队长排行榜-光效线条.png" alt="光效" class="light-effect" />
            </div>
            <div class="score">{{  (topThree.length >= 2 && topThree[1].memberCount) || '' }}</div>
          </div>
        </div>

        <!-- 第一名 -->
        <div class="top-item top-1">
          <div class="avatar-container">
            <div class="top-badge">
              <img src="@/assets/团队长排行榜/团队长排行榜-top1.png" alt="TOP 1" />
            </div>
          </div>
          <div class="user-info">
            <div class="name">{{ (topThree.length >= 1 && topThree[0].realName) || '' }}</div>
            <div class="region">{{ (topThree.length >= 1 && topThree[0].province) || '' }}</div>
            <div class="light-effect-wrapper">
              <img src="@/assets/团队长排行榜/团队长排行榜-光效线条.png" alt="光效" class="light-effect" />
            </div>
            <div class="score">{{  (topThree.length >= 1 && topThree[0].memberCount) || '' }}</div>
          </div>
        </div>

        <!-- 第三名 -->
        <div class="top-item top-3">
          <div class="avatar-container">
            <div class="top-badge">
              <img src="@/assets/团队长排行榜/团队长排行榜-top3.png" alt="TOP 3" />
            </div>
          </div>
          <div class="user-info">
            <div class="name">{{ (topThree.length >= 3 && topThree[2].realName) ||  ''}}</div>
            <div class="region">{{ (topThree.length >= 3 && topThree[2].province) || '' }}</div>
            <div class="light-effect-wrapper">
              <img src="@/assets/团队长排行榜/团队长排行榜-光效线条.png" alt="光效" class="light-effect" />
            </div>
            <div class="score">{{  (topThree.length >= 3 && topThree[2].memberCount) || '' }}</div>
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
          <div v-if="loading" class="loading-container">
            <van-loading type="spinner" size="24px" />
            <span class="loading-text">加载中...</span>
          </div>
          <div v-else-if="otherRanks.length === 0" class="empty-container">
            <span>暂无更多排名数据</span>
          </div>
          <div v-else class="list-item" v-for="(item, index) in otherRanks" :key="item.leaderId" :class="{ 'item-highlight': (index + 1) % 2 === 0 }">
            <div class="item-content">
              <div class="item-rank rank-col">{{ item.rank }}</div>
              <div class="item-user user-col">
                <span class="user-name">{{ item.realName || '' }}</span>
              </div>
              <div class="item-region region-col">{{ item.province || '' }}</div>
              <div class="item-team team-col">{{ item.memberCount || 0 }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 当前排名 -->
      <div class="current-rank" v-if="myRank">
        <div class="rank-info">
          <span class="rank-label">{{ myRank.rank > 100 ? '100+' : myRank.rank }}</span>
          <span class="rank-desc">{{ '（我当前的排名）'}}</span>
        </div>
        <div class="region-name">{{ myRank.province || '区域名称'}}</div>
        <div class="team-count">{{ myRank.memberCount || 0}}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, Loading } from 'vant'
import { getTeamLeaderRank } from '@/api/teamLeader'

const router = useRouter()

// 排行榜数据
const rankList = ref([])
const myRank = ref(null)
const loading = ref(false)

// 前三名数据
const topThree = ref([])
// 第四名及以后数据
const otherRanks = ref([])

const goBack = () => {
  router.back()
}

const fetchRankData = async () => {
  loading.value = true
  try {
    const response = await getTeamLeaderRank()
    if (response.code === 200) {
      rankList.value = response.data.rankList || []
      myRank.value = response.data.myRank || null
      
      // 分离前三名和其他排名
      topThree.value = rankList.value.slice(0, 3)
      otherRanks.value = rankList.value.slice(3)
    } else {
      showToast('获取排行榜数据失败')
    }
  } catch (error) {
    console.error('获取排行榜数据失败:', error)
    showToast('网络错误')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchRankData()
})
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
  margin-top: 135px;
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
  overflow: hidden;
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
  border-radius: 50%;
  object-fit: cover;
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
  height: 24px;
}

.region {
  font-size: var(--font-size-small);
  opacity: 0.9;
  margin-bottom: 4px;
  height: 24px;
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
  height: 24px;
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
  width: 40px;
  flex-shrink: 0;
  white-space: nowrap;
}

.user-col {
  flex: 2;
  min-width: 0;
  white-space: nowrap;
}

.user-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  max-width: 100%;
  vertical-align: middle;
}

.region-col {
  flex: 2.5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.team-col {
  width: 80px;
  flex-shrink: 0;
  color: #0944fc;
  white-space: nowrap;
}

.list-body {
  margin-top: 8px;
  max-height: 300px;
  overflow-y: auto;
}

/* 滚动条样式 */
.list-body::-webkit-scrollbar {
  width: 4px;
}

.list-body::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.list-body::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.list-body::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
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

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  gap: 12px;
}

.loading-text {
  font-size: var(--font-size-small);
  color: #666;
}

.empty-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  font-size: var(--font-size-small);
  color: #999;
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
