<template>
  <div class="page">
    <div class="header-bg">
      <van-nav-bar
        title="官方群聊"
        left-arrow
        @click-left="$router.back()"
        :border="false"
        class="custom-nav-bar"
      />
    </div>
    
    <div class="content">
      <!-- Card 1 - iOS -->
      <div class="download-card card-1">
        <div class="qrcode-section">
          <div class="qrcode-box">
            <img v-if="iosQrCode" :src="iosQrCode" alt="苹果群聊二维码" class="qrcode-img" />
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
              @click="handleCopy('ios')"
            >
              复制链接
            </van-button>
          </div>
        </div>
      </div>

      <!-- Card 2 - Android -->
      <div class="download-card card-2">
        <div class="qrcode-section">
          <div class="qrcode-box">
            <img v-if="androidQrCode" :src="androidQrCode" alt="安卓群聊二维码" class="qrcode-img" />
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
              @click="handleCopy('android')"
            >
              复制链接
            </van-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { showToast } from 'vant'
import QRCode from 'qrcode'
import { getDownloadLinks } from '@/api/home'

import iconAndroid from '@/assets/官方群聊/android.png'
import iconApple from '@/assets/官方群聊/apple appstore.png'

const links = ref({
  chatAndroid: '',
  chatIOS: ''
})
const iosQrCode = ref('')
const androidQrCode = ref('')

const fetchLinks = async () => {
  try {
    console.log('开始获取群聊链接')
    const res = await getDownloadLinks()
    console.log('获取群聊链接成功:', res)
    if ((res.code === 0 || res.code === 200) && res.data) {
      links.value = {
        chatAndroid: res.data.chatAndroid,
        chatIOS: res.data.chatIOS
      }
      console.log('群聊链接数据:', links.value)
      
      if (res.data.chatIOS) {
        try {
          console.log('开始生成 iOS 群聊二维码:', res.data.chatIOS)
          iosQrCode.value = await QRCode.toDataURL(res.data.chatIOS, { margin: 1 })
          console.log('iOS 群聊二维码生成成功')
        } catch (err) {
          console.error('Failed to generate iOS QR code:', err)
        }
      }
      
      if (res.data.chatAndroid) {
        try {
          console.log('开始生成 Android 群聊二维码:', res.data.chatAndroid)
          androidQrCode.value = await QRCode.toDataURL(res.data.chatAndroid, { margin: 1 })
          console.log('Android 群聊二维码生成成功')
        } catch (err) {
          console.error('Failed to generate Android QR code:', err)
        }
      }
    } else {
      console.error('获取群聊链接失败，返回格式不正确:', res)
      showToast('获取群聊链接失败')
    }
  } catch (error) {
    console.error('Failed to fetch chat links:', error)
    showToast('获取群聊链接失败')
  }
}

onMounted(() => {
  fetchLinks()
})

const handleDownload = (platform) => {
  const url = platform === 'ios' ? links.value.chatIOS : links.value.chatAndroid
  if (!url) {
    return showToast(`${platform === 'ios' ? '苹果' : '安卓'}群聊链接不可用`)
  }
  window.open(url, '_blank')
}

const handleCopy = async (platform) => {
  const url = platform === 'ios' ? links.value.chatIOS : links.value.chatAndroid
  if (!url) {
    return showToast(`${platform === 'ios' ? '苹果' : '安卓'}群聊链接为空`)
  }
  
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(url)
      showToast('链接已复制')
    } else {
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
  padding-bottom: 20px;
}

.header-bg {
  height: 220px;
  background: var(--blue-gradient);
  position: relative;
}

:deep(.van-nav-bar) {
  background-color: transparent;
}
:deep(.van-nav-bar__title) {
  color: #fff;
  font-weight: 600;
  font-size: var(--font-size-large);
}
:deep(.van-nav-bar__arrow) {
  color: #fff;
  font-size: 20px;
}

.content {
  padding: 0 16px;
  margin-top: -160px;
  position: relative;
  z-index: 1;
}

.download-card {
  border-radius: 12px;
  margin-bottom: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  aspect-ratio: 350/220;
}

.card-1 {
  background-image: url('../assets/官方群聊/会聊下载_上.png');
}

.card-2 {
  background-image: url('../assets/官方群聊/会聊下载_下.png');
}

.qrcode-section {
  position: absolute;
  bottom: 30px;
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

.qrcode-img {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  display: block;
  object-fit: contain;
}

.qrcode-placeholder {
  width: 100%;
  height: 100%;
  background: #eee;
  border-radius: 8px;
}

.card-right {
  position: absolute;
  right: 25px;
  bottom: 30px;
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
  margin-bottom: 25px;
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
  height: 34px;
  font-size: var(--font-size-small);
  font-weight: bold;
  border: 1px solid #fff !important;
  border-radius: 4px;
}

.btn-primary::before, .btn-secondary::before {
  display: none !important;
}
</style>