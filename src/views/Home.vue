<template>
  <div class="page">
    <!-- 顶部 Header -->
    <div class="header">
      <div class="header__top">
        <div class="brand">
          <img src="@/assets/首页/logo图标.png" class="logo" alt="logo" />
          <div class="title">民 生 资 产</div>
        </div>
        <img class="slogan-img" src="@/assets/首页/资产为民，发展为民.png" alt="资产为民，发展为民" />
      </div>
    </div>

    <div class="page__body">
      <div class="header__banner">
        <div v-if="showNoticeDialog" class="banner-placeholder"></div>
        <template v-else>
          <video
            v-if="homeData.publicizeVod"
            class="banner-video"
            autoplay
            loop
            muted
            playsinline
            preload="auto"
            controls
          >
            <source :src="homeData.publicizeVod" type="video/mp4">
            您的浏览器不支持视频播放
          </video>
          <video
            v-else
            class="banner-video"
            
            controls
          >
            <source src="" type="video/mp4">
            您的浏览器不支持视频播放
          </video>
          <div class="video-corner-mask"></div>
        </template>
      </div>

      <!-- 通知栏 -->
      <div class="notice-wrap">
        <van-icon name="bell" color="var(--blue-deep)" size="18" />
        <div class="notice-text">
          <van-notice-bar
            v-if="homeData.bulletin"
            class="notice-bar"
            background="transparent"
            color="#333"
            :text="homeData.bulletin.contentFilter"
            :scrollable="true"
            @click="handleBulletinClick"
          />
          <van-notice-bar
            v-else
            class="notice-bar"
            background="transparent"
            color="#333"
            :scrollable="true"
            text=""
          />
        </div>
      </div>

      <!-- 金刚区 -->
      <section class="grid">
        <div class="grid__item" @click="goCheckin">
          <img src="@/assets/首页/今日签到.png" class="grid__icon-img" alt="今日签到" />
          <div class="grid__text">今日签到</div>
        </div>
        <div class="grid__item" @click="goDownload">
          <img src="@/assets/首页/立即下载.png" class="grid__icon-img" alt="立即下载" />
          <div class="grid__text">立即下载</div>
        </div>
        <div class="grid__item" @click="goGroupChat">
          <img src="@/assets/首页/官方群聊.png" class="grid__icon-img" alt="官方群聊" />
          <div class="grid__text">官方群聊</div>
        </div>
        <div class="grid__item" @click="goShop">
          <img src="@/assets/首页/积分商城.png" class="grid__icon-img" alt="积分商城" />
          <div class="grid__text">积分商城</div>
        </div>
        <div class="grid__item" @click="goMeeting">
          <img src="@/assets/首页/会议中心.png" class="grid__icon-img" alt="会议中心" />
          <div class="grid__text">会议中心</div>
        </div>
        <div class="grid__item" @click="goCert">
          <img src="@/assets/首页/确权证书.png" class="grid__icon-img" alt="确权证书" />
          <div class="grid__text">确权证书</div>
        </div>
        <div class="grid__item" @click="goRewards">
          <img src="@/assets/首页/贡献奖励.png" class="grid__icon-img" alt="贡献奖励" />
          <div class="grid__text">贡献奖励</div>
        </div>
        <div class="grid__item" @click="goService">
          <img src="@/assets/首页/联系客服.png" class="grid__icon-img" alt="联系客服" />
          <div class="grid__text">联系客服</div>
        </div>
      </section>

      <section class="quick-actions">
        <div class="quick-actions__btn quick-actions__btn--subsidy" @click="goSubsidy">
          <img src="@\assets\首页\惠民补贴金.png" class="quick-actions__icon" alt="惠民补贴金" />
          <span class="quick-actions__text">惠民补贴金</span>
        </div>
        <div class="quick-actions__btn quick-actions__btn--minsheng" @click="goMinshengTreasure">
          <img src="@\assets\首页\惠民宝.png" class="quick-actions__icon" alt="惠民宝" />
          <span class="quick-actions__text">惠民宝</span>
        </div>
      </section>

      <!-- 资讯中心 -->
      <section class="news">
        <div class="news__header">
          <div class="news__header-left">
            <img src="@/assets/首页/中华人民共和国国徽.png" class="news__icon-img" alt="icon" />
            <img src="@/assets/首页/资讯中心.png" class="news__title-img" alt="资讯中心" />
          </div>
          <div class="news__header-right">
            <div class="news__slogan-top">梦想从学习开始</div>
            <div class="news__slogan-bottom">视野从实践起步</div>
          </div>
        </div>

        <div class="news__list">
          <div
            class="news__item"
            v-for="item in visibleNews"
            :key="item.id"
            @click="goNewsDetail(item)"
          >
            <div class="news__info">
              <div class="news__text">{{ item.title }}</div>
              <div class="news__time">{{ item.time }}</div>
            </div>
            <van-image class="news__thumb" radius="4" fit="cover" :src="item.thumb" />
          </div>
        </div>
        <div class="news__footer" @click="goNews">
          <van-icon name="arrow-down" /> 查看更多
        </div>
      </section>

      <div class="record-info">
        <div class="record-info__content">
          <div class="record-info__left">
            <img src="@/assets/首页/DZ.png" class="record-info__logo" alt="党政机关" />
            <div class="record-info__accessibility-box">
              <img src="@/assets/首页/无障碍.png" class="record-info__accessibility-icon" alt="无障碍" />
              <div class="record-info__accessibility-text">
                <span>适老化</span>
                <span>无障碍服务</span>
              </div>
            </div>
          </div>
          <div class="record-info__divider"></div>
          <div class="record-info__right">
            <div class="record-info__item">主办单位：国务院办公厅</div>
            <div class="record-info__item">运行单位：国家发改和改革委员会</div>
            <div class="record-info__item">
              <img src="@/assets/首页/备案图标.png" class="record-info__badge" alt="京公网安备" />
              京公网安备:11010202000002号
            </div>
          </div>
        </div>
      </div>

      <!-- Notice Dialog -->
      <van-dialog
        v-model:show="showNoticeDialog"
        class="notice-dialog"
        :show-confirm-button="false"
        close-on-click-overlay
        teleport="body"
        :lock-scroll="false"
      >
        <div class="notice-dialog-content">
          <div class="notice-dialog-header">
            <span>公告</span>
          </div>
          <div class="notice-dialog-body">
            <div class="notice-content-container">
              <div class="notice-content" v-if="homeData.bulletinPopup && homeData.bulletinPopup.content" v-html="homeData.bulletinPopup.content"></div>
            </div>
          </div>
          <div class="notice-dialog-footer">
            <van-button 
              type="primary" 
              round 
              block 
              class="notice-btn"
              @click="showNoticeDialog = false"
            >
              知道了
            </van-button>
          </div>
        </div>
      </van-dialog>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast } from 'vant'
import { useUserStore } from '@/stores/user'
import { getHomeIndex } from '@/api/home'

import noticeBg from '@/assets/首页/弹窗海报.png'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const showNoticeDialog = ref(false)
const homeData = ref({
  publicizeVod: '',
  bulletinPopup: null,
  bulletin: null,
  newsList: []
})

const loadHomeData = async () => {
  if (!userStore.isAuthenticated) return
  
  try {
    const res = await getHomeIndex()
    if (res.code === 200 && res.data) {
      // 处理公告内容，移除图片的内联 width 属性
      let processedBulletin = res.data.bulletinPopup
      if (processedBulletin && processedBulletin.content) {
        let processedContent = processedBulletin.content
        // 移除图片的内联 width 属性
        processedContent = processedContent.replace(/<img[^>]*width="[^"]*"[^>]*>/g, (match) => {
          return match.replace(/width="[^"]*"/g, '')
        })
        // 移除图片的内联 style 属性中的 width
        processedContent = processedContent.replace(/<img[^>]*style="[^"]*width:[^;]*;?[^"]*"[^>]*>/g, (match) => {
          return match.replace(/width:[^;]*;?/g, '')
        })
        processedBulletin.content = processedContent
      }
      
      homeData.value = {
        publicizeVod: res.data.publicizeVod,
        bulletinPopup: processedBulletin,
        bulletin: res.data.bulletin,
        newsList: res.data.newsList || []
      }
    }
  } catch (error) {
    console.error('Failed to load home data:', error)
  }
}

onMounted(() => {
  loadHomeData()
  showNoticeDialog.value = true
})

watch(
  () => route.path,
  (newPath) => {
    if (newPath === '/home') {
      showNoticeDialog.value = true
    }
  }
)


const newsList = computed(() => {
  return homeData.value.newsList.map(item => ({
    id: item.id,
    title: item.title,
    time: item.createDt || item.time,
    thumb: item.coverImg || item.thumb,
    content: item.content || ''
  }))
})

const visibleNews = computed(() => newsList.value.slice(0, 4))

const handleBulletinClick = () => {
  if (!homeData.value.bulletin) return
  
  if (checkLogin()) {
    router.push({
      name: 'bulletin',
      query: {
        id: homeData.value.bulletin.id
      }
    })
  }
}

const checkLogin = () => {
  if (!userStore.isAuthenticated) {
    router.push({ name: 'login', query: { redirect: route.fullPath } })
    return false
  }
  return true
}

const goCheckin = () => {
  if (checkLogin()) {
    console.log('Navigating to checkin')
    router.push({ name: 'checkin' })
  }
}
const goRewards = () => {
  if (checkLogin()) {
    router.push({ name: 'rewards-log' })
  }
}
const goGroupChat = () => {
  if (checkLogin()) {
    router.push({ name: 'group-chat' })
  }
}
const goDownload = () => {
  if (checkLogin()) {
    router.push({ name: 'download' })
  }
}
const goShop = () => {
  if (checkLogin()) {
    router.push({ name: 'shop' })
  }
}
const goMeeting = () => {
  if (checkLogin()) {
    router.push({ name: 'meeting-center' })
  }
}
const goCert = () => {
  if (checkLogin()) {
    router.push({ name: 'certificate' })
  }
}
const serviceUrl = './chatlink.html'

const goService = () => {
  window.location.href = serviceUrl
}

const goNews = () => {
  if (checkLogin()) {
    router.push({ name: 'news' })
  }
}

const goNewsDetail = item => {
  if (!checkLogin()) return
  router.push({
    name: 'news-detail',
    query: {
      id: item.id
    }
  })
}

const goSubsidy = () => {
  if (checkLogin()) {
    router.push({ name: 'benefit-subsidy' })
  }
}
const goMinshengTreasure = () => {
  if (checkLogin()) {
    router.push({ name: 'minsheng-treasure' })
  }
}

const recordCode = ref('')
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f7f8fa;
  padding-bottom: 60px;
}

/* Header */
.header {
  background: var(--blue-gradient);
  padding: 0 16px;
  position: relative;
  height: 220px;
  z-index: 1;
  overflow: hidden;
}
.header::after {
  content: '';
  position: absolute;
  top: 0;
  right: -65px;
  width: 200px;
  height: 200px;
  background-image: url('@/assets/首页/首页header背景图.png');
  background-repeat: no-repeat;
  background-position: right top;
  background-size: contain;
  pointer-events: none;
  opacity: 0.9;
}
.header__top {
  padding-top: 40px;
  color: #fff;
  margin-bottom: 0;
  display: flex;
  flex-direction: column;
}
.brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 8px;
}
.logo {
  width: 40px;
  height: 40px;
  object-fit: contain;
  border-radius: 4px;
}
.title {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: 4px;
}
.slogan-img {
  display: block;
  height: 30px;
  width: auto;
  margin: 0px 0 0 0px;
  align-self: flex-start;
  object-fit: contain;
}
.header__banner {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
  position: relative;
  cursor: pointer;
  /* 强制子层（包含 video 控件层）跟随圆角裁剪 */
  -webkit-mask-image: -webkit-radial-gradient(white, black);
  mask-image: radial-gradient(white, black);
  clip-path: inset(0 round 12px);
}
.banner-placeholder {
  width: 100%;
  height: 200px;
  background: #000;
  border-radius: 12px;
}
.video-corner-mask {
  pointer-events: none;
  position: absolute;
  inset: 0;
  border-radius: 12px;
  /* 用大范围内阴影覆盖角外区域，确保视觉圆角 */
  box-shadow: 0 0 0 1000px #f7f8fa;
}
.banner-video {
  width: 100%;
  object-fit: cover;
  display: block;
  height: 200px;
  border-radius: 12px;
  -webkit-border-radius: 12px;
  overflow: hidden;
  will-change: transform;
  transform: translateZ(0);
  /* 强制 iOS/部分 WebView 遵守圆角裁剪 */
  -webkit-mask-image: -webkit-radial-gradient(white, black);
  mask-image: radial-gradient(white, black);
  clip-path: inset(0 round 12px);
}
/* 全屏时按视频原始比例适配，避免拉伸或裁剪 */
.banner-video:fullscreen {
  width: 100vw !important;
  height: 100vh !important;
  object-fit: contain !important;
  background-color: #000;
}
.banner-video:-webkit-full-screen {
  width: 100vw !important;
  height: 100vh !important;
  object-fit: contain !important;
  background-color: #000;
}
/* 移除弹窗与遮罩相关样式，保留视频直出控件 */

.page__body {
  padding: 0 12px;
  margin-top: -100px;
  position: relative;
  z-index: 2;
}

/* Notice */
.notice-wrap {
  background: #fff;
  border-radius: 30px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}
.notice-text {
  flex: 1;
  overflow: hidden;
}
.notice-bar {
  padding: 0;
  height: 28px;
  line-height: 28px;
  font-size: var(--font-size-base);
}

/* Grid */
.grid {
  background: #fff;
  border-radius: 12px;
  padding: var(--spacing-base) 8px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-base) 8px;
  margin-bottom: var(--spacing-base);
}
.grid__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.grid__icon-img {
  width: var(--icon-size-base);
  height: var(--icon-size-base);
  object-fit: contain;
}
.grid__text {
  font-size: var(--font-size-base);
  color: #333;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-small);
  margin-bottom: var(--spacing-base);
}
.quick-actions__btn {
  height: var(--button-normal-height);
  border-radius: 10px;
  background: var(--blue-gradient);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 6px 16px rgba(25, 137, 250, 0.25);
}
.quick-actions__btn--subsidy {
  background: url('@/assets/首页/惠民补贴金背景图.png') no-repeat center;
  background-size: 100% 100%;
}
.quick-actions__btn--minsheng {
  background: url('@/assets/首页/惠民宝背景图.png') no-repeat center;
  background-size: 100% 100%;
}
.quick-actions__icon {
  width: var(--icon-size-small);
  height: var(--icon-size-small);
  object-fit: contain;
}
.quick-actions__text {
  font-size: var(--font-size-base);
  font-weight: 600;
}

/* News */
.news {
  background: #fff;
  /* border-radius: 12px; */
  overflow: hidden;
}
.news__header {
  background: var(--blue-gradient);
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
}
.news__header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}
.news__icon-img {
  width: 40px;
  height: 40px;
  object-fit: contain;
}
.news__title-text {
  font-size: var(--font-size-large);
  font-family: 'STKaiti', 'Kaiti', serif;
  font-weight: 700;
  font-style: italic;
  letter-spacing: 2px;
}
.news__title-img {
  height: 24px;
  width: auto;
  object-fit: contain;
  display: block;
}
.news__header-right {
  font-size: 16px;
  text-align: right;
  line-height: 1.4;
  opacity: 1;
  font-family: 'STSong', 'SimSun', serif;
  font-weight: 600;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.news__slogan-top {
  margin-right: 32px;
  font-family: 'STKaiti', 'Kaiti', serif;
}
.news__slogan-bottom {
  margin-right: 0;
  font-family: 'STKaiti', 'Kaiti', serif;
}
.news__list {
  padding: 0 12px;
}
.news__item {
  padding: 12px 0;
  display: grid;
  grid-template-columns: 1fr 100px;
  gap: 12px;
  border-bottom: 1px solid #f0f0f0;
  align-items: center;
}
.news__item:last-child {
  border-bottom: none;
}
.news__text {
  font-size: var(--font-size-base);
  color: #333;
  font-weight: 600;
  margin-bottom: 8px;
  line-height: 1.4;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.news__time {
  font-size: var(--font-size-xs);
  color: #999;
}
.news__thumb {
  width: 100px;
  height: 64px;
  background: #eee;
}
.news__footer {
  text-align: center;
  padding: var(--spacing-small);
  color: #666;
  font-size: var(--font-size-xs);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  border-top: 1px solid #f5f5f5;
}

.record-info {
  /* margin: 12px 0 0; */
  /* background: #fff; */
  border-radius: 12px;
  padding: 16px;
  color: #333;
  font-size: 12px;
}
.record-info__content {
  display: flex;
  align-items: center;
  /* gap: 16px; */
}
.record-info__left {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* gap: 12px; */
}
.record-info__logo {
  width: 70px;
  height: 70px;
  object-fit: contain;
  display: block;
}
.record-info__accessibility-box {
  width: 80px;
  height: 40px;
  border: 1px solid #ccc;
  border-radius: 4px;
  display: flex;
  align-items: center;
  padding: 4px;
  background: #fff;
}
.record-info__accessibility-icon {
  width: 20px;
  height: 20px;
  object-fit: contain;
  display: block;
  margin-right: 4px;
}
.record-info__accessibility-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  text-align: center;
}
.record-info__accessibility-text span {
  font-size: 9px;
  color: #333;
  line-height: 1.1;
}
.record-info__divider {
  width: 1px;
  height: 100px;
  background: #e0e0e0;
  margin: 0 16px;
}
.record-info__right {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.record-info__item {
  line-height: 1.5;
  display: flex;
  align-items: center;
  gap: 8px;
}
.record-info__badge {
  width: 16px;
  height: 16px;
  object-fit: contain;
  display: block;
}
:deep(.van-dialog.notice-dialog) {
  background: transparent;
  width: 320px;
  max-width: 90%;
  overflow: visible;
}

.notice-dialog-content {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  padding-bottom: 20px;
}

.notice-dialog-header {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.notice-dialog {
  /* 提高弹框层级，确保遮挡底部导航 */
  z-index: 1000 !important;
}

.notice-dialog-content {
  padding: 0;
  /* 确保弹框内容容器能够正确处理滚动 */
  overflow: hidden;
}

.notice-dialog-header {
  background: var(--blue-gradient);
  color: white;
  padding: 16px;
  text-align: center;
  font-size: var(--font-size-base);
  font-weight: bold;
}

.notice-dialog-body {
  padding: 0 16px;
  margin-bottom: 20px;
  /* 确保弹框内容区域能够正确处理滚动 */
  overflow: hidden;
}

.notice-content-container {
  width: 100%;
  max-height: 60vh;
  overflow-y: scroll;
  background-color: #f9f9f9;
  border-radius: 5px;
  /* 确保内容可以滚动 */
  -webkit-overflow-scrolling: touch;
  /* 隐藏滚动条但保持滚动功能 */
  scrollbar-width: none;
  -ms-overflow-style: none;
}

/* 隐藏 Chrome, Safari 和 Opera 的滚动条 */
.notice-content-container::-webkit-scrollbar {
  display: none;
}

.notice-content {
  color: #333;
  font-size: var(--font-size-small);
  line-height: 1.6;
  position: relative;
  z-index: 1;
  /* 确保内容可以滚动 */
  overflow-x: hidden !important;
  word-wrap: break-word;
}

/* 增强图片样式的优先级，确保图片能够完整显示 */
:deep(.notice-content img) {
  max-width: 100% !important;
  width: 100% !important;
  height: auto !important;
  display: block !important;
  margin: 10px auto !important;
  box-sizing: border-box !important;
  object-fit: contain !important;
  position: relative !important;
  z-index: 1 !important;
}

/* 确保富文本中的所有图片都能正确显示 */
:deep(.ql-image) {
  max-width: 100% !important;
  width: 100% !important;
  height: auto !important;
  display: block !important;
  margin: 10px auto !important;
}

/* 确保富文本中的容器不会限制图片宽度 */
:deep(.ql-editor) {
  max-width: 100% !important;
  overflow-x: hidden !important;
}

.notice-dialog-footer {
  padding: 10px 40px 20px;
}

.notice-btn {
  height: 40px;
  background: #1989fa;
  font-size: 16px;
  box-shadow: 0 4px 8px rgba(25, 137, 250, 0.3);
}
</style>
