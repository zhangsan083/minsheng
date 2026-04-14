<template>
  <div class="page">
    <!-- Header -->
    <div class="header-bg">
      <van-nav-bar title="我的" :border="false" class="nav-bar" />
    </div>

    <div class="page-content">
      <!-- User Info Card -->
      <div class="user-card">
        <div class="user-info">
          <div class="avatar-wrapper">
            <img :src="userStore.userInfo?.avatar || '/logo主图形.png'" class="avatar-img" />
          </div>
          <div class="info-details">
            <div class="user-row">
              <div class="user-info-text">
                <span v-if="userStore.userInfo?.realName" class="user-name">{{ userStore.userInfo.realName }}</span>
                <span class="user-phone">{{ userStore.userInfo?.phonenumber ? hidePhone(userStore.userInfo.phonenumber) : '0000****0000' }}</span>
              </div>
              <div class="status-badge" :class="{ 'verified': Number(userStore.userInfo?.isVerified) === 1, 'unverified': Number(userStore.userInfo?.isVerified) !== 1 }">
                <img :src="Number(userStore.userInfo?.isVerified) === 1 ? iconVerified : iconUnverified" class="badge-icon" />
                <span>{{ Number(userStore.userInfo?.isVerified) === 1 ? '已实名' : '未实名' }}</span>
              </div>
            </div>
            <div class="invite-row">
              <span>邀请码：{{ userStore.userInfo?.invitationCode || '' }}</span>
              <img :src="iconCopy" class="copy-icon-img" @click="copyCode" />
            </div>
          </div>
        </div>
      </div>

      <!-- Wallet Card -->
      <div class="section-card wallet-card">
        <div class="card-title">我的钱包</div>
        <div class="wallet-grid">
          <div class="wallet-item blue-box">
            <div class="wallet-icon"><img :src="iconWallet1" class="wallet-icon-img" /> 钱包余额</div>
            <div class="wallet-value">{{ formatAmount(userStore.userInfo?.depositBalance) }}</div>
          </div>
          <div class="wallet-item blue-box">
            <div class="wallet-icon"><img :src="iconWallet2" class="wallet-icon-img" /> 民生保障补助金</div>
            <div class="wallet-value">{{ formatAmount(userStore.userInfo?.welfareSubsidy) }}</div>
          </div>
          <div class="wallet-item blue-box">
            <div class="wallet-icon"><img :src="iconWallet3" class="wallet-icon-img" /> 推荐奖励</div>
            <div class="wallet-value">{{ formatAmount(userStore.userInfo?.referralBonus) }}</div>
          </div>
          <div class="wallet-item blue-box">
            <div class="wallet-icon"><img :src="iconWallet4" class="wallet-icon-img" /> 理财收益</div>
            <div class="wallet-value">{{ formatAmount(userStore.userInfo?.investmentIncome) }}</div>
          </div>
        </div>
        <!-- <div class="divider"></div>
        <div class="verify-gold-row">
          <div class="verify-label">民生资产账户验证金：</div>
          <div class="verify-value">¥ 000000</div>
          <div class="verify-link" @click="showToast('查看验证金')">去查看 <img :src="iconMore" class="more-icon" /></div>
        </div> -->
      </div>

      <!-- Maintenance Subsidy -->
      <!-- <div class="subsidy-bar">
        <div class="subsidy-left">
          <img :src="iconSubsidy" class="subsidy-icon" />
          <span>维护补偿金</span>
        </div>
        <div class="subsidy-value">00000</div>
      </div> -->

      <!-- Quick Actions -->
      <div class="action-grid">
        <!-- <div class="action-btn-item" @click="goRecharge">
          <div class="action-icon blue-light-bg"><img :src="iconAction1" class="action-img" /></div>
          <div class="action-text">立即充值</div>
        </div> -->
        <!-- <div class="action-btn-item" @click="goWithdraw">
          <div class="action-icon blue-light-bg"><img :src="iconAction2" class="action-img" /></div>
          <div class="action-text">立即提现</div>
        </div>
        <div class="action-btn-item" @click="goFundConversion">
          <div class="action-icon blue-light-bg"><img :src="iconAction3" class="action-img" /></div>
          <div class="action-text">资金转换</div>
        </div>
        <div class="action-btn-item" @click="goFundTransfer">
          <div class="action-icon blue-light-bg"><img :src="iconAction4" class="action-img" /></div>
          <div class="action-text">资金转出</div>
        </div> -->
      </div>

      <!-- Ad Placeholder -->
      <!-- <div class="ad-placeholder" @click="$router.push({ name: 'dream-mutual-aid' })">
        <img :src="posterBg" class="poster-bg-img" alt="海报" />
      </div> -->

      <!-- Functional Services -->
      <div class="section-group">
        <div class="section-header">
          <img :src="iconServiceHeader" class="header-icon" />
          <span class="section-name">功能服务</span>
        </div>
        <div class="service-grid">
                  <div class="service-item" @click="goWithdraw">
                    <div class="service-icon"><img :src="iconAction2" class="service-img" /></div>
                    <div class="service-label">立即提现</div>
                  </div>
                  <div class="service-item" @click="goFundDetails">
                    <div class="service-icon"><img :src="iconService1" class="service-img" /></div>
                    <div class="service-label">资金明细</div>
                  </div>
                  <div class="service-item" @click="goMyTeam">
                    <div class="service-icon"><img :src="iconService2" class="service-img" /></div>
                    <div class="service-label">我的团队</div>
                  </div>
                  <div class="service-item" @click="goCertificate">
                    <div class="service-icon"><img :src="iconService3" class="service-img" /></div>
                    <div class="service-label">确权证书</div>
                  </div>
                  <div class="service-item" @click="goGroupChat">
                    <div class="service-icon"><img :src="iconService4" class="service-img" /></div>
                    <div class="service-label">官方群聊</div>
                  </div>
                  <div class="service-item" @click="goService">
                    <div class="service-icon"><img :src="iconService5" class="service-img" /></div>
                    <div class="service-label">在线客服</div>
                  </div>
                  <div class="service-item" @click="goAddress">
                    <div class="service-icon"><img :src="iconService6" class="service-img" /></div>
                    <div class="service-label">我的地址</div>
                  </div>
                  <div class="service-item" @click="goShop">
                    <div class="service-icon"><img :src="iconService7" class="service-img" /></div>
                    <div class="service-label">兑换商城</div>
                  </div>
                  <div class="service-item" @click="goInviteFriends">
                    <div class="service-icon"><img :src="iconService8" class="service-img" /></div>
                    <div class="service-label">邀请好友</div>
                  </div>
                  <div class="service-item" @click="goPolicy">
                    <div class="service-icon"><img :src="iconService9" class="service-img" /></div>
                    <div class="service-label">政策文件</div>
                  </div>
                </div>
              </div>

              <!-- Security Center -->
              <div class="section-group">
                <div class="section-header">
                  <img :src="iconSecurityHeader" class="header-icon" />
                  <span class="section-name">安全中心</span>
                </div>
                <div class="service-grid">
                  <div class="service-item" @click="goPaymentAccount">
                    <div class="service-icon"><img :src="iconSecurity1" class="service-img" /></div>
                    <div class="service-label">收款账户</div>
                  </div>
                  <div class="service-item" @click="goRealNameAuth">
                    <div class="service-icon"><img :src="iconSecurity2" class="service-img" /></div>
                    <div class="service-label">实名认证</div>
                  </div>
                  <div class="service-item" @click="goChangePassword">
                    <div class="service-icon"><img :src="iconSecurity3" class="service-img" /></div>
                    <div class="service-label">修改密码</div>
                  </div>
                  <div class="service-item" @click="goDownload">
                    <div class="service-icon"><img :src="iconSecurity4" class="service-img" /></div>
                    <div class="service-label">APP下载</div>
                  </div>
                </div>
      </div>

      <!-- Logout Button -->
      <div class="logout-wrapper">
        <van-button class="btn-logout" type="primary" block round @click="logout">退出登陆</van-button>
      </div>
    </div>
  </div>

  <!-- 切换账号弹窗 -->
  <van-dialog v-model:show="showSwitchDialog" :show-confirm-button="false" close-on-click-overlay width="320px">
    <div class="switch-content">
      <div class="dialog-title">确认退出</div>
      <div class="dialog-msg">是否确认退出当前账号？</div>
      <div class="dialog-actions">
        <van-button block round type="default" @click="showSwitchDialog = false">取消</van-button>
        <van-button block round @click="confirmLogout">确认退出</van-button>
      </div>
    </div>
  </van-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { useUserStore } from '@/stores/user'

import iconVerified from '@/assets/我的/盾1.png'
import iconUnverified from '@/assets/我的/未实名.png'
import iconCopy from '@/assets/我的/复制.png'
import iconWallet1 from '@/assets/我的/充值余额.png'
import iconWallet2 from '@/assets/我的/惠民补贴.png'
import iconWallet3 from '@/assets/我的/推荐奖励.png'
import iconWallet4 from '@/assets/我的/理财收益.png'
import iconMore from '@/assets/我的/更多.png'
import iconSubsidy from '@/assets/我的/图标.png'
import iconAction1 from '@/assets/我的/立即充值.png'
import iconAction2 from '@/assets/我的/立即提现.png'
import iconAction3 from '@/assets/我的/资金转换.png'
import iconAction4 from '@/assets/我的/资金转出.png'
import iconServiceHeader from '@/assets/我的/功能服务图标.png'
import iconService1 from '@/assets/我的/资金明细.png'
import iconService2 from '@/assets/我的/我的 团队.png'
import iconService3 from '@/assets/我的/证书.png'
import iconService4 from '@/assets/我的/官方群聊.png'
import iconService5 from '@/assets/我的/客服.png'
import iconService6 from '@/assets/我的/我的地址.png'
import iconService7 from '@/assets/我的/兑换商城.png'
import iconService8 from '@/assets/我的/邀请好友.png'
import iconService9 from '@/assets/我的/政策文件.png'
import iconSecurityHeader from '@/assets/我的/盾.png'
import iconSecurity1 from '@/assets/我的/收款账户.png'
import iconSecurity2 from '@/assets/我的/实名认证.png'
import iconSecurity3 from '@/assets/我的/修改密码.png'
import iconSecurity4 from '@/assets/我的/app下载.png'
import posterBg from '@/assets/我的/追梦人海报.png'

const router = useRouter()
const userStore = useUserStore()
const showSwitchDialog = ref(false)

const hidePhone = (phone) => {
  if (!phone) return ''
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

const formatAmount = (amount) => {
  if (amount === undefined || amount === null) return '0.00'
  return Number(amount).toFixed(2)
}

const copyCode = () => {
  if (userStore.userInfo?.invitationCode) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(userStore.userInfo.invitationCode)
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
      textArea.value = userStore.userInfo.invitationCode
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
}

const logout = () => {
  showSwitchDialog.value = true
}

const confirmLogout = () => {
          userStore.logout()
          router.replace({ name: 'login' })
        }

        // Navigation methods matching Home.vue
        const goCertificate = () => router.push({ name: 'certificate' })
        const goPaymentAccount = () => router.push({ name: 'payment-account' })
        const goGroupChat = () => router.push({ name: 'group-chat' })
        const goShop = () => router.push({ name: 'shop' })
        const goDownload = () => router.push({ name: 'download' })
        const goAddress = () => router.push({ name: 'address-manage' })
        const goRealNameAuth = () => router.push({ name: 'real-name-auth' })
        const goChangePassword = () => router.push({ name: 'change-password' })
        const goPolicy = () => router.push({ name: 'policy' })
        const goMyTeam = () => router.push({ name: 'my-team' })
        const goInviteFriends = () => router.push({ name: 'invite-friends' })
        // const goRecharge = () => router.push({ name: 'recharge' })
        const goRecharge = () => showToast('功能暂未开放')
        const goWithdraw = () => router.push({ name: 'withdraw' })
        const goFundConversion = () => router.push({ name: 'fund-conversion' })
        const goFundTransfer = () => router.push({ name: 'fund-transfer' })
        const goFundDetails = () => router.push({ name: 'fund-details' })
        const serviceUrl = './chatlink.html'
        const goService = () => window.location.href = serviceUrl

        onMounted(() => {
  // 每次进入个人中心时刷新用户信息，确保资产和积分数据最新
  userStore.refreshUserInfo()
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f7f8fa;
  padding-bottom: 80px;
}

.header-bg {
  height: 200px;
  background: var(--blue-gradient);
  position: relative;
}

.nav-bar {
  background: transparent;
  --van-nav-bar-title-text-color: #fff;
  --van-nav-bar-icon-color: #fff;
  --van-nav-bar-title-font-size: 18px;
  --van-nav-bar-title-font-weight: bold;
}

/* Deep selector to ensure title color is correct */
:deep(.van-nav-bar__title) {
  color: #fff;
}

.page-content {
  padding: 0 16px;
  margin-top: -160px;
  position: relative;
  z-index: 1;
}

/* User Card */
.user-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.avatar-wrapper {
  flex-shrink: 0;
}

.avatar-placeholder {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #ccc;
}

.avatar-img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}

.info-details {
  flex: 1;
  width: 0; /* Prevent overflow */
}

.user-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.user-info-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width:150px;
}

.user-name {
  font-size: var(--font-size-large);
  font-weight: bold;
  color: var(--blue-deep);
  word-break: break-all;
}

.user-phone {
  font-size: var(--font-size-large);
  font-weight: bold;
  color: var(--blue-deep);
}

.status-badge {
  background: var(--blue-gradient);
  color: white;
  font-size: var(--font-size-xs);
  padding: 4px 12px;
  border-top-left-radius: 16px;
  border-bottom-left-radius: 16px;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-right: -20px; /* Pull to edge */
}

.status-badge.unverified {
  background: #999;
}

.invite-row {
  font-size: var(--font-size-base);
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
}

.copy-icon {
  color: var(--blue-deep);
  cursor: pointer;
}

/* Section Card */
.section-card {
  background: white;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.card-title {
  text-align: center;
  font-weight: bold;
  margin-bottom: var(--spacing-base);
  font-size: var(--font-size-base);
}

.wallet-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-small);
  margin-bottom: var(--spacing-base);
}

.wallet-item {
  background: var(--blue-gradient);
  border-radius: 8px;
  padding: 12px;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.wallet-icon {
  font-size: var(--font-size-small);
  display: flex;
  align-items: center;
  gap: 4px;
}

.wallet-value {
  font-size: var(--font-size-large);
  font-weight: bold;
}

.divider {
  height: 1px;
  background: #eee;
  margin: var(--spacing-small) 0;
}

.verify-gold-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--font-size-small);
}

.verify-label {
  color: var(--blue-deep);
}

.verify-value {
  color: #ff4d4f;
  font-weight: bold;
}

.verify-link {
  color: var(--blue-deep);
  display: flex;
  align-items: center;
  font-size: var(--font-size-xs);
  cursor: pointer;
}

.more-icon {
  width: var(--icon-size-small);
  height: var(--icon-size-small);
  object-fit: contain;
  margin-left: 2px;
}

/* Subsidy Bar */
.subsidy-bar {
  background: var(--blue-gradient);
  border-radius: 8px;
  padding: var(--spacing-small) var(--spacing-base);
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  margin-bottom: var(--spacing-base);
  box-shadow: 0 4px 12px rgba(9, 68, 252, 0.2);
}

.subsidy-left {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
}

.subsidy-value {
  font-weight: bold;
  font-size: var(--font-size-large);
}

/* Action Grid */
.action-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-small);
  margin-bottom: var(--spacing-base);
}

.action-btn-item {
  background: #dbeafe; /* Light blue matching image */
  border-radius: 12px;
  padding: var(--spacing-small) 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.action-icon {
  width: var(--icon-size-base);
  height: var(--icon-size-base);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-base);
  background: transparent;
}

.action-text {
  font-size: var(--font-size-small);
  color: var(--blue-deep);
  font-weight: bold;
}

/* Ad Placeholder */
.ad-placeholder {
  background: #999;
  border-radius: 12px;
  margin-bottom: var(--spacing-base);
  overflow: hidden;
  position: relative;
}

.poster-bg-img {
  width: 100%;
  object-fit: cover;
}

/* Functional Services */
.section-group {
  background: white;
  border-radius: 16px;
  padding: var(--spacing-base);
  margin-bottom: var(--spacing-base);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: var(--spacing-base);
  font-weight: bold;
  font-size: var(--font-size-base);
}

.service-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-base) 8px;
}

.service-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.service-icon {
  font-size: var(--icon-size-base);
}

.service-label {
  font-size: var(--font-size-small);
  color: #333;
}

/* Logout */
.logout-wrapper {
  margin-top: var(--spacing-large);
}

.btn-logout {
  background: var(--blue-gradient);
  border: none;
  font-weight: 600;
}

/* Dialog */
.switch-content {
  padding: var(--spacing-base);
  text-align: center;
}

.dialog-title {
  font-size: var(--font-size-large);
  font-weight: bold;
  margin-bottom: var(--spacing-small);
}

.dialog-msg {
  font-size: var(--font-size-small);
  color: #666;
  margin-bottom: var(--spacing-base);
}

.dialog-actions {
  display: flex;
  gap: var(--spacing-small);
}

.badge-icon {
  width: var(--icon-size-small);
  height: var(--icon-size-small);
  object-fit: contain;
}

.copy-icon-img {
  width: var(--icon-size-small);
  height: var(--icon-size-small);
  object-fit: contain;
  cursor: pointer;
}

.wallet-icon-img {
  width: var(--icon-size-small);
  height: var(--icon-size-small);
  object-fit: contain;
}

.subsidy-icon {
  width: var(--icon-size-base);
  height: var(--icon-size-base);
  object-fit: contain;
}

.action-img {
  width: var(--icon-size-base);
  height: var(--icon-size-base);
  object-fit: contain;
}

.header-icon {
  width: var(--icon-size-base);
  height: var(--icon-size-base);
  object-fit: contain;
}

.service-img {
  width: var(--icon-size-base);
  height: var(--icon-size-base);
  object-fit: contain;
}
</style>
