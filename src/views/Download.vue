<template>
  <div class="page">
    <div class="header-bg">
      <van-nav-bar
        title="立即下载"
        left-arrow
        @click-left="$router.back()"
        :border="false"
        class="nav-bar"
      />
    </div>

    <div class="content">
      <!-- 卡片1：亮色背景 - iOS -->
      <div class="download-card card-light">
        <div class="card-content-wrapper">
          <div class="qrcode-section">
            <div class="qrcode-box">
              <img v-if="iosQrCode" :src="iosQrCode" alt="苹果下载二维码" class="qrcode-img" />
              <div v-else class="qrcode-placeholder"></div>
            </div>
          </div>
          <div class="card-right">
            <div class="app-logo">
              <img :src="iconApple" alt="Logo" />
            </div>
            <div class="action-btns">
              <van-button 
                class="btn-primary" 
                block 
                color="linear-gradient(to right, #2b7afb, #0e5add)"
                @click="handleDownload('ios')"
              >
                立即下载
              </van-button>
              <van-button 
                class="btn-secondary" 
                block 
                color="linear-gradient(to right, #2b7afb, #0e5add)"
                @click="copyLink('ios')"
              >
                复制链接
              </van-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 卡片2：深色背景 - Android -->
      <div class="download-card card-dark">
        <div class="card-content-wrapper">
          <div class="qrcode-section">
            <div class="qrcode-box">
              <img v-if="androidQrCode" :src="androidQrCode" alt="安卓下载二维码" class="qrcode-img" />
              <div v-else class="qrcode-placeholder"></div>
            </div>
          </div>
          <div class="card-right">
            <div class="app-logo">
              <img :src="iconAndroid" alt="Logo" />
            </div>
            <div class="action-btns">
              <van-button 
                class="btn-primary" 
                block 
                color="linear-gradient(to right, #2b7afb, #0e5add)"
                @click="handleDownload('android')"
              >
                立即下载
              </van-button>
              <van-button 
                class="btn-secondary" 
                block 
                color="linear-gradient(to right, #2b7afb, #0e5add)"
                @click="copyLink('android')"
              >
                复制链接
              </van-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import QRCode from 'qrcode'
import { getDownloadLinks } from '@/api/home'

import iconAndroid from '@/assets/立即下载/android.png'
import iconApple from '@/assets/立即下载/apple appstore.png'

const router = useRouter()
const links = ref({
  assetAndroid: '',
  assetIOS: ''
})
const iosQrCode = ref('')
const androidQrCode = ref('')

const fetchLinks = async () => {
  try {
    console.log('开始获取下载链接')
    const res = await getDownloadLinks()
    console.log('获取下载链接成功:', res)
    // 兼容不同的返回格式，code 可能是 0 或 200
    if ((res.code === 0 || res.code === 200) && res.data) {
      links.value = {
        assetAndroid: res.data.assetAndroid,
        assetIOS: res.data.assetIOS
      }
      console.log('链接数据:', links.value)
      
      // 为 iOS 生成二维码
      if (res.data.assetIOS) {
        try {
          console.log('开始生成 iOS 二维码:', res.data.assetIOS)
          iosQrCode.value = await QRCode.toDataURL(res.data.assetIOS, { margin: 1 })
          console.log('iOS 二维码生成成功')
        } catch (err) {
          console.error('Failed to generate iOS QR code:', err)
        }
      }
      
      // 为 Android 生成二维码
      if (res.data.assetAndroid) {
        try {
          console.log('开始生成 Android 二维码:', res.data.assetAndroid)
          androidQrCode.value = await QRCode.toDataURL(res.data.assetAndroid, { margin: 1 })
          console.log('Android 二维码生成成功')
        } catch (err) {
          console.error('Failed to generate Android QR code:', err)
        }
      }
    } else {
      console.error('获取下载链接失败，返回格式不正确:', res)
      showToast('获取下载链接失败')
    }
  } catch (error) {
    console.error('Failed to fetch download links:', error)
    showToast('获取下载链接失败')
  }
}

onMounted(() => {
  fetchLinks()
})

const handleDownload = (platform) => {
  const url = platform === 'ios' ? links.value.assetIOS : links.value.assetAndroid
  if (!url) {
    return showToast(`${platform === 'ios' ? '苹果' : '安卓'}下载链接不可用`)
  }
  window.open(url, '_blank')
}

const copyLink = async (platform) => {
  const url = platform === 'ios' ? links.value.assetIOS : links.value.assetAndroid
  if (!url) {
    return showToast(`${platform === 'ios' ? '苹果' : '安卓'}链接为空`)
  }
  
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(url)
      showToast('链接已复制')
    } else {
      // 降级处理
      const input = document.createElement('input')
      input.value = url
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      showToast('链接已复制')
    }
  } catch (err) {
    showToast('复制失败')
  }
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f7f8fa;
  padding-bottom: 50px;
}

.header-bg {
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

.download-card {
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  position: relative;
  min-height: 200px;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  aspect-ratio: 350/220; /* Keep roughly the aspect ratio of a card */
}

.card-light {
  background-image: url('@/assets/立即下载/立即下载_上.png');
}

.card-dark {
  background-image: url('@/assets/立即下载/立即下载_下.png');
}

.card-content-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.qrcode-section {
  position: absolute;
  bottom: 30px; /* Position at bottom left */
  left: 30px;
}

.qrcode-box {
  width: 110px;
  height: 110px;
  background: #fff;
  padding: 4px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.card-right {
  position: absolute;
  right: 25px;
  bottom: 30px; /* Align to bottom corner */
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 150px;
}

.app-logo {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 20px; /* Increase space between Logo and Buttons */
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  background: #fff;
}

.app-logo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.action-btns {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.btn-primary, .btn-secondary {
  height: 34px !important;
  font-size: var(--font-size-small);
  font-weight: bold;
  border: 1px solid #fff !important;
  border-radius: 4px; /* Slight radius but not round */
}

.btn-primary::before, .btn-secondary::before {
  display: none !important;
}

.qrcode-img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: contain;
}

.qrcode-placeholder {
  width: 100%;
  height: 100%;
  background: #f0f0f0;
  border-radius: 4px;
}
</style>

