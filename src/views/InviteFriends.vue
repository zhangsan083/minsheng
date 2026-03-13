<template>
  <div class="page">
    <div class="header-bg">
      <van-nav-bar
        title="邀请好友"
        left-arrow
        @click-left="$router.back()"
        :border="false"
        class="nav-bar"
      />
    </div>

    <div class="content">
      <div class="poster-card-container">
        <div class="poster-card" :style="{ backgroundImage: `url(${bgImage})` }">
          <div class="poster-content">
            <div class="top-section">
              <div class="logo-text">
                <img :src="iconAndroid" alt="Logo" class="logo-img" />
              </div>
              <div class="promo-text">
                <div>邀请纳新文案</div>
                <div>邀请纳新文案</div>
                <div>邀请纳新文案</div>
              </div>
            </div>
            <div class="qr-section">
              <div class="qr-code-box">
                <img v-if="qrCodeData" :src="qrCodeData" class="qr-code-img" alt="资产安卓下载二维码" />
                <div v-else class="qr-code-placeholder"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="action-buttons">
        <div class="action-btn copy-btn" @click="copyLink">复制邀请链接</div>
        <div class="action-btn poster-btn" @click="generatePoster">生成邀请海报</div>
      </div>

      <div class="stats-card">
        <div class="stat-item">
          <img :src="iconTeam" class="stat-icon" />
          <div class="stat-info">
            <div class="stat-label">团队总人数</div>
            <div class="stat-value">{{ inviteData.memberTotal }}</div>
          </div>
        </div>
        <div class="divider"></div>
        <div class="stat-item">
          <img :src="iconActivated" class="stat-icon" />
          <div class="stat-info">
            <div class="stat-label">已激活</div>
            <div class="stat-value">{{ inviteData.activateTotal }}</div>
          </div>
        </div>
      </div>

      <div class="team-section">
        <div class="level-tabs">
          <div 
            v-for="level in [1, 2, 3]" 
            :key="level"
            class="level-tab"
            :class="{ active: currentLevel === level }"
            @click="currentLevel = level"
          >
            {{ ['一级', '二级', '三级'][level-1] }}
          </div>
        </div>

        <div class="team-list-container">
          <div class="list-header-summary">
            {{ ['一级', '二级', '三级'][currentLevel-1] }}团队总人数： {{ totalMembers }}人
          </div>
          
          <div class="table-header">
            <div class="col name">姓名</div>
            <div class="col phone">手机号</div>
            <div class="col date">注册时间</div>
            <div class="col status">激活状态</div>
          </div>

          <div class="list-content">
            <div class="list-item" v-for="(item, index) in teamList" :key="item.id || index">
              <div class="col name">{{ item.realName || '未知' }}</div>
              <div class="col phone">{{ item.phonenumber || '未知' }}</div>
              <div class="col date">{{ item.createDt || '未知' }}</div>
              <div class="col status" :class="{ active: item.isActivate === 1 }">{{ item.isActivate === 1 ? '已激活' : '未激活' }}</div>
            </div>
            
            <!-- 空状态 -->
            <div v-if="teamList.length === 0 && !loading" class="empty-state">
              暂无团队成员
            </div>
            
            <!-- 加载中状态 -->
            <div v-if="loading" class="loading-state">
              加载中...
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { showToast } from 'vant'
import QRCode from 'qrcode'
import iconTeam from '@/assets/邀请好友/我的团队标.png'
import iconActivated from '@/assets/邀请好友/邀请激活人数.png'
import bgImage from '@/assets/邀请好友/邀请背景图.png'
import iconAndroid from '@/assets/邀请好友/android.png'
import posterImage from '@/assets/邀请好友/邀请海报.png'
import { inviteFriends } from '@/api/assets'
import { getMemberPage } from '@/api/team'

const currentLevel = ref(1)
const teamList = ref([])
const totalMembers = ref(0)
const loading = ref(false)
const pageNum = ref(1)
const pageSize = ref(10)

const inviteData = ref({
  activateTotal: 0,
  assetAndroid: '',
  assetIOS: '',
  invitationCode: '',
  memberTotal: 0
})

const qrCodeData = ref('')

// 计算当前等级对应的level参数
const levelParam = computed(() => {
  return currentLevel.value
})

const generateQRCode = async (url) => {
  if (!url) {
    qrCodeData.value = ''
    return
  }
  try {
    console.log('开始生成二维码:', url)
    const dataUrl = await QRCode.toDataURL(url, { margin: 1 })
    qrCodeData.value = dataUrl
    console.log('二维码生成成功')
  } catch (error) {
    console.error('Failed to generate QR code:', error)
    qrCodeData.value = ''
  }
}

const loadTeamMembers = async (reset = true) => {
  if (loading.value) return
  
  if (reset) {
    pageNum.value = 1
    teamList.value = []
  }
  
  loading.value = true
  try {
    const params = {
      level: levelParam.value,
      pageNum: pageNum.value,
      pageSize: pageSize.value
    }
    console.log('开始获取团队成员列表:', params)
    const res = await getMemberPage(params)
    console.log('获取团队成员列表成功:', res)
    
    if ((res.code === 200 || res.code === 0) && res.data) {
      if (reset) {
        teamList.value = res.data.records
      } else {
        teamList.value = [...teamList.value, ...res.data.records]
      }
      totalMembers.value = res.data.total
      pageNum.value++
    } else {
      console.error('获取团队成员列表失败，返回格式不正确:', res)
      showToast(res.msg || '获取团队成员失败')
    }
  } catch (error) {
    console.error('Failed to load team members:', error)
    showToast('获取团队成员失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

const loadInviteData = async () => {
  try {
    console.log('开始获取邀请数据')
    const res = await inviteFriends()
    console.log('获取邀请数据成功:', res)
    if ((res.code === 200 || res.code === 0) && res.data) {
      inviteData.value = res.data
      console.log('邀请数据:', inviteData.value)
      
      // 生成二维码 - 使用app下载链接
      if (res.data.assetAndroid) {
        await generateQRCode(res.data.assetAndroid)
      }
    } else {
      console.error('获取邀请数据失败，返回格式不正确:', res)
      showToast(res.msg || '获取数据失败')
    }
  } catch (error) {
    console.error('Failed to load invite data:', error)
    showToast('获取数据失败，请稍后重试')
  }
}

// 监听等级变化，重新加载团队成员
watch(currentLevel, () => {
  loadTeamMembers()
})

onMounted(() => {
  loadInviteData()
  loadTeamMembers()
})

const copyLink = () => {
  const code = inviteData.value.invitationCode
  if (!code) {
    showToast('邀请码为空')
    return
  }
  
  // 获取当前页面的origin，包含协议、域名和端口
  const currentOrigin = window.location.origin
  const registerUrl = `${currentOrigin}/register?invitationCode=${encodeURIComponent(code)}`
  
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(registerUrl)
      .then(() => {
        showToast('复制成功')
      })
      .catch((err) => {
        console.error('Copy failed', err)
        showToast('复制失败')
      })
  } else {
    // Fallback for older browsers or insecure contexts
    const textArea = document.createElement("textarea")
    textArea.value = registerUrl
    textArea.style.position = "fixed" // Avoid scrolling to bottom
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    try {
      const successful = document.execCommand('copy')
      const msg = successful ? '复制成功' : '复制失败'
      showToast(msg)
    } catch (err) {
      console.error('Fallback copy failed', err)
      showToast('复制失败')
    }
    document.body.removeChild(textArea)
  }
}

const generatePoster = () => {
  const code = inviteData.value.invitationCode
  if (!code) return showToast('邀请码为空')
  // 获取当前页面的origin，包含协议、域名和端口
  const currentOrigin = window.location.origin
  const registerUrl = `${currentOrigin}/register?invitationCode=${encodeURIComponent(code)}`

  const loadImage = (src) => new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })

  const downloadBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const canvasToBlob = (canvas) => new Promise((resolve) => {
    if (canvas.toBlob) {
      canvas.toBlob((b) => resolve(b), 'image/png', 1)
    } else {
      const dataUrl = canvas.toDataURL('image/png')
      const arr = dataUrl.split(',')
      const mime = arr[0].match(/:(.*?);/)[1]
      const bstr = atob(arr[1])
      let n = bstr.length
      const u8arr = new Uint8Array(n)
      while (n--) u8arr[n] = bstr.charCodeAt(n)
      resolve(new Blob([u8arr], { type: mime }))
    }
  })

  const composePoster = async () => {
    const bg = await loadImage(posterImage)
    const qrDataUrl = await QRCode.toDataURL(registerUrl, { margin: 0, width: 512 })
    const qrImg = await loadImage(qrDataUrl)

    const canvas = document.createElement('canvas')
    canvas.width = bg.naturalWidth || bg.width
    canvas.height = bg.naturalHeight || bg.height
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('no-canvas')

    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height)

    const w = canvas.width
    const h = canvas.height
    const qrW = w * 0.26
    const qrX = w * 0.08
    const qrY = h * (1 - 0.06) - qrW + 2 // 向下移动2px
    const pad = Math.max(2, qrW * 0.04)

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(qrX, qrY, qrW, qrW)
    ctx.drawImage(qrImg, qrX + pad, qrY + pad, qrW - pad * 2, qrW - pad * 2)
    
    // 绘制福利文字
    ctx.fillStyle = '#1890ff' // 蓝色字体
    ctx.font = 'bold 24px Arial' // 字体大小和样式
    ctx.textAlign = 'center' // 文字居中对齐
    
    // 福利1 - 顶部中间位置，在"资产为民"和"发展为民"之间
    ctx.fillText('福利1', w * 0.1, h * 0.425)
    
    // 福利2 - 中间偏右位置
    ctx.fillText('福利2', w * 0.57, h * 0.63)
    
    // 福利3 - 左下角位置
    ctx.fillText('福利3', w * 0.15, h * 0.7)

    const blob = await canvasToBlob(canvas)
    if (!blob) throw new Error('no-blob')

    const file = new File([blob], `邀请海报_${code}.png`, { type: 'image/png' })
    const canShare = typeof navigator !== 'undefined' && navigator.share && navigator.canShare && navigator.canShare({ files: [file] })
    if (canShare) {
      try {
        await navigator.share({ files: [file], title: '邀请海报' })
        return
      } catch {
      }
    }

    downloadBlob(blob, `邀请海报_${code}.png`)
    showToast('已生成海报，请保存到相册')
  }

  composePoster().catch(() => {
    showToast('海报生成失败')
  })
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f5f7fa;
  padding-bottom: 100px;
}

.nav-bar {
  background: transparent;
  --van-nav-bar-title-text-color: #fff;
  --van-nav-bar-icon-color: #fff;
}

.header-bg {
  background: var(--blue-gradient);
  height: 200px;
  padding-bottom: 20px;
}

.content {
  padding: 0 16px;
  margin-top: -160px;
  position: relative;
  z-index: 1;
}

.poster-card-container {
  border-radius: 12px;
  padding: 4px;
  background: white; /* The white border effect */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.poster-card {
  border-radius: 8px; /* Slightly smaller radius for inner card */
  padding: 24px;
  position: relative;
  overflow: hidden;
  background-size: 100% 100%;
  background-position: center;
  height: 190px; /* Set fixed height based on card design */
}

.poster-content {
  position: relative;
  z-index: 1;
  height: 100%;
}

.top-section {
  position: absolute;
  top: 0px;
  right: 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo-text {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  background: #fff;
}

.logo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.promo-text {
  text-align: right;
  color: white;
  font-size: 20px;
  font-weight: bold;
  line-height: 1.6;
  text-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.qr-section {
  position: absolute;
  top: 60px; /* Below the top-left text in background */
  left: 10px;
}

.qr-code-box {
  width: 90px;
  height: 90px;
  background: white;
  border-radius: 8px;
  padding: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.qr-code-img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: contain;
}

.qr-code-placeholder {
  width: 100%;
  height: 100%;
  background: #f0f0f0;
  border-radius: 4px;
}

.action-buttons {
  display: flex;
  justify-content: space-between;
  padding: 0 16px;
  margin-top: 16px;
  gap: 16px;
}

.action-btn {
  flex: 1;
  height: 44px;
  border-radius: 8px;
  background: #2979ff; /* Fallback */
  background: var(--blue-gradient);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  box-shadow: 0 4px 8px rgba(41, 121, 255, 0.3);
  cursor: pointer;
}

.stats-card {
  margin: 16px;
  background: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.stat-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  object-fit: contain;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 20px;
  font-weight: bold;
  color: #2979ff;
}

.divider {
  width: 1px;
  height: 40px;
  background: #eee;
}

.team-section {
  margin: 16px;
}

.level-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.level-tab {
  flex: 1;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #2979ff;
  color: #2979ff;
  background: white;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
}

.level-tab.active {
  background: #2979ff;
  color: white;
}

.team-list-container {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.list-header-summary {
  background: #2979ff;
  color: white;
  padding: 12px 16px;
  font-size: 15px;
  font-weight: bold;
}

.table-header {
  display: flex;
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
  font-size: 13px;
  color: #333;
  font-weight: bold;
  text-align: center;
}

.list-item {
  display: flex;
  padding: 12px 16px;
  border-bottom: 1px solid #f5f5f5;
  font-size: 12px;
  color: #666;
  text-align: center;
  align-items: center;
}

.col {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.col.phone {
  flex: 1.2;
}

.col.status {
  flex: 0.8;
}

.col.status.active {
  color: #2979ff;
}

.empty-state,
.loading-state {
  padding: 40px 0;
  text-align: center;
  color: #999;
  font-size: 14px;
}
</style>
