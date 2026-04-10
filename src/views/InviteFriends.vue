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
      <!-- 背景图 + 邀请信息 -->
      <div class="invite-card">
        <img src="@/assets/邀请好友/邀请背景图.png" class="invite-bg" alt="邀请好友" />
        <div class="invite-info">
          <!-- 邀请码 -->
          <div class="info-row">
            <div class="info-label">邀请码</div>
            <div class="info-value">{{ inviteData.invitationCode || '' }}</div>
            <div class="copy-btn" @click="copyCode">复制</div>
          </div>
          <!-- 邀请链接 -->
          <div class="info-row">
            <div class="info-label">邀请链接</div>
            <div class="info-value info-value--link">{{ inviteLink }}</div>
            <div class="copy-btn" @click="copyLink">复制</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { showToast } from 'vant'
import { inviteFriends } from '@/api/assets'

const inviteData = ref({
  invitationCode: '',
})

const inviteLink = computed(() => {
  const code = inviteData.value.invitationCode
  if (!code) return ''
  return `${window.location.origin}/register?invitationCode=${encodeURIComponent(code)}`
})

const loadInviteData = async () => {
  try {
    const res = await inviteFriends()
    if ((res.code === 200 || res.code === 0) && res.data) {
      inviteData.value = res.data
    }
  } catch (error) {
    console.error('Failed to load invite data:', error)
  }
}

onMounted(() => {
  loadInviteData()
})

const doCopy = (text, label) => {
  if (!text) return showToast(`${label}为空`)
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text)
      .then(() => showToast('复制成功'))
      .catch(() => fallbackCopy(text))
  } else {
    fallbackCopy(text)
  }
}

const fallbackCopy = (text) => {
  const ta = document.createElement('textarea')
  ta.value = text
  ta.style.position = 'fixed'
  document.body.appendChild(ta)
  ta.focus()
  ta.select()
  try {
    document.execCommand('copy')
    showToast('复制成功')
  } catch {
    showToast('复制失败')
  }
  document.body.removeChild(ta)
}

const copyCode = () => doCopy(inviteData.value.invitationCode, '邀请码')
const copyLink = () => doCopy(inviteLink.value, '邀请链接')
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f5f7fa;
  padding-bottom: 80px;
}

.header-bg {
  background: var(--blue-gradient);
  height: 200px;
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
  margin-top: -150px;
  position: relative;
  z-index: 1;
}

.invite-card {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.invite-bg {
  width: 100%;
  height: auto;
  display: block;
}

.invite-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 25px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 邀请码 / 邀请链接行 */
.info-row {
  background: #fff;
  border-radius: 8px;
  padding: 12px 14px;
  display: flex;
  align-items: center;
}

.info-label {
  font-size: var(--font-size-small);
  color: #666;
  white-space: nowrap;
  margin-right: 12px;
  flex-shrink: 0;
}

.info-value {
  flex: 1;
  font-size: var(--font-size-large);
  font-weight: bold;
  color: #1989fa;
  overflow: hidden;
  text-overflow: ellipsis;
}

.info-value--link {
  font-size: var(--font-size-xs);
  font-weight: normal;
  word-break: break-all;
  line-height: 1.4;
}

.copy-btn {
  flex-shrink: 0;
  margin-left: 12px;
  padding: 6px 16px;
  background: var(--blue-gradient);
  color: #fff;
  font-size: var(--font-size-small);
  font-weight: bold;
  border-radius: 6px;
  cursor: pointer;
}
</style>
