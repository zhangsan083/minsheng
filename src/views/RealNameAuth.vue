<template>
  <div class="page">
    <!-- Unauthenticated Layout -->
    <template v-if="!isVerified">
      <div class="header-simple">
        <van-nav-bar
          title="实名认证"
          left-arrow
          @click-left="onClickLeft"
          :border="false"
          class="nav-bar"
        />
      </div>
      
      <div class="content-unauth">
        <div class="white-card">
          <div class="form-group">
            <div class="form-label">真实姓名</div>
            <input 
              type="text" 
              class="custom-input" 
              placeholder="请填写真实姓名" 
              v-model="formData.realName"
            />
          </div>
          
          <div class="form-group">
            <div class="form-label">身份证号码</div>
            <input 
              type="text" 
              class="custom-input" 
              placeholder="请输入证件号码" 
              v-model="formData.idCard"
            />
          </div>

          <div class="notes-section">
            <div class="notes-title">
              <span class="blue-bar"></span>
              备注
            </div>
            <div class="notes-content">
              1、请确认本人身份信息，实名认证成功后，信息与该账号唯一绑定，不可与其他身份互换，您绑定的身份证姓名必须与银行卡姓名一致。<br>
              2、您绑定的身份证姓名必须与银行卡姓名一致。
            </div>
          </div>

          <div class="submit-btn-wrapper">
            <van-button 
              block 
              round 
              color="var(--blue-gradient)"
              class="submit-btn"
              @click="handleAuth"
            >
              立即认证
            </van-button>
          </div>
        </div>
      </div>
    </template>

    <!-- Authenticated Layout -->
    <template v-else>
      <div class="header-banner">
        <van-nav-bar
          title="实名认证"
          left-arrow
          @click-left="onClickLeft"
          :border="false"
          class="nav-bar"
        />
        <div class="banner-wrapper">
          <div class="banner-text">
            <div class="banner-title">个人实名认证</div>
            <div class="banner-desc">
              请您如实填写信息，多在使用过程中发现虚假信息，平台将有权终止您的使用权限。
            </div>
          </div>
          <div class="banner-icon-wrapper">
            <img :src="iconAuth" class="banner-icon" />
          </div>
        </div>
      </div>

      <div class="content-auth">
        <div class="info-card">
          <div class="info-icon-wrapper">
            <img :src="iconName" class="info-icon" />
          </div>
          <div class="info-text">
            <div class="info-label">真实姓名</div>
            <div class="info-value">{{ userStore.userInfo?.realName }}</div>
          </div>
        </div>

        <div class="info-card">
          <div class="info-icon-wrapper">
            <img :src="iconIdCard" class="info-icon" />
          </div>
          <div class="info-text">
            <div class="info-label">身份证号</div>
            <div class="info-value">{{ userStore.userInfo?.idNumber }}</div>
          </div>
        </div>

        <div class="auth-status-btn">
          <van-button 
            block 
            round 
            color="#4080ff"
            class="status-btn"
          >
            已实名
          </van-button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { showToast } from 'vant'

import iconAuth from '@/assets/实名认证/实名认证.png'
// Using generic user/card icons if specific ones aren't available, or reuse existing if appropriate
// Assuming existing imports are correct for the icons shown in screenshot 2
import iconName from '@/assets/实名认证/真实姓名.png' 
import iconIdCard from '@/assets/实名认证/身份证.png'
import { verifyRealName } from '@/api/auth'

const router = useRouter()
const userStore = useUserStore()

const formData = ref({
  realName: '',
  idCard: ''
})

const isVerified = computed(() => {
  return Number(userStore.userInfo?.isVerified) === 1
})

const onClickLeft = () => {
  router.back()
}

const handleAuth = () => {
  if (!formData.value.realName) return showToast('请输入真实姓名')
  if (!formData.value.idCard) return showToast('请输入身份证号')
  
  const payload = {
    realName: formData.value.realName,
    idNumber: formData.value.idCard
  }
  verifyRealName(payload)
    .then(async res => {
      if (res && res.code === 200) {
        showToast(res.msg || '操作成功')
        // 刷新用户信息以切换为“已认证”视图
        await userStore.refreshUserInfo()
      } else {
        showToast(res?.msg || '认证失败')
      }
    })
    .catch(() => {
      showToast('网络异常，请稍后重试')
    })
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f7f8fa;
}

.nav-bar {
  background: transparent;
  --van-nav-bar-title-text-color: #fff;
  --van-nav-bar-icon-color: #fff;
}

/* Unauthenticated Styles */
.header-simple {
  height: 220px;
  background: var(--blue-gradient);
}

.content-unauth {
  padding: 0 16px;
  margin-top: -160px;
  position: relative;
  z-index: 1;
}

.white-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  min-height: 400px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  font-size: 15px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.custom-input {
  width: 90%;
  background: #f5f7fa;
  border: none;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 14px;
  color: #333;
  outline: none;
}

.custom-input::placeholder {
  color: #999;
}

.notes-section {
  margin-top: 30px;
  margin-bottom: 40px;
}

.notes-title {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
  color: #1989fa; /* Or var(--blue-deep) if defined */
  margin-bottom: 12px;
}

.blue-bar {
  width: 4px;
  height: 18px;
  background: #1989fa;
  border-radius: 2px;
  margin-right: 8px;
}

.notes-content {
  font-size: 16px;
  color: #999;
  line-height: 1.6;
  text-align: justify;
}

.submit-btn-wrapper {
  margin-top: 20px;
}

.submit-btn {
  height: 44px;
  font-size: 16px;
  font-weight: bold;
}

/* Authenticated Styles */
.header-banner {
  background: var(--blue-gradient);
  padding-bottom: 60px;
  position: relative;
}

.banner-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 10px 30px 40px;
  color: #fff;
}

.banner-text {
  flex: 1;
  margin-right: 20px;
}

.banner-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.banner-desc {
  font-size: 12px;
  opacity: 0.9;
  line-height: 1.4;
}

.banner-icon-wrapper {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.banner-icon {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.content-auth {
  padding: 0 16px;
  margin-top: -30px;
  position: relative;
  z-index: 1;
}

.info-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
}

.info-icon-wrapper {
  width: 40px;
  height: 40px;
  margin-right: 16px;
}

.info-icon {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.info-text {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.info-label {
  font-size: 15px;
  color: #333;
  font-weight: 500;
}

.info-value {
  font-size: 15px;
  color: #666;
}

.auth-status-btn {
  margin-top: 40px;
  padding: 0 20px;
}

.status-btn {
  height: 48px;
  font-size: 18px;
  border-radius: 8px;
}
</style>
