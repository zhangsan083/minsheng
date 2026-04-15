<template>
  <div class="page">
    <div class="header-bg">
      <van-nav-bar
        title="修改密码"
        left-arrow
        @click-left="onClickLeft"
        :border="false"
        class="nav-bar"
      />
      <div class="tab-container">
        <div 
          class="tab-item" 
          :class="{ active: activeTab === 'login' }"
          @click="activeTab = 'login'"
        >
          修改登陆密码
        </div>
        <div 
          class="tab-item" 
          :class="{ active: activeTab === 'payment' }"
          @click="activeTab = 'payment'"
        >
          修改支付密码
        </div>
      </div>
    </div>

    <div class="content">
      <div class="form-card">
        <!-- Login Password Form -->
        <div v-if="activeTab === 'login'" class="form-content">
          <div class="form-group">
            <div class="form-label">原登录密码</div>
            <van-field
              v-model="loginForm.oldPassword"
              placeholder="请输入原登录密码"
              :right-icon="loginForm.showOld ? 'eye-o' : 'closed-eye'"
              @click-right-icon="loginForm.showOld = !loginForm.showOld"
              :type="loginForm.showOld ? 'text' : 'password'"
              class="custom-field"
            />
          </div>
          
          <div class="form-group">
            <div class="form-label">新登录密码</div>
            <van-field
              v-model="loginForm.newPassword"
              placeholder="请输入新登录密码（最长16位）"
              maxlength="16"
              :right-icon="loginForm.showNew ? 'eye-o' : 'closed-eye'"
              @click-right-icon="loginForm.showNew = !loginForm.showNew"
              :type="loginForm.showNew ? 'text' : 'password'"
              class="custom-field"
            />
          </div>

          <div class="form-group">
            <div class="form-label">确认登录密码</div>
            <van-field
              v-model="loginForm.confirmPassword"
              placeholder="请输入确认登录密码（最长16位）"
              maxlength="16"
              :right-icon="loginForm.showConfirm ? 'eye-o' : 'closed-eye'"
              @click-right-icon="loginForm.showConfirm = !loginForm.showConfirm"
              :type="loginForm.showConfirm ? 'text' : 'password'"
              class="custom-field"
            />
          </div>
        </div>

        <!-- Payment Password Form -->
        <div v-else class="form-content">
          <div v-if="isPayPassword" class="form-group">
            <div class="form-label">账号密码</div>
            <van-field
              v-model="paymentForm.oldPassword"
              placeholder="请输入账号密码"
              :right-icon="paymentForm.showOld ? 'eye-o' : 'closed-eye'"
              @click-right-icon="paymentForm.showOld = !paymentForm.showOld"
              :type="paymentForm.showOld ? 'text' : 'password'"
              class="custom-field"
            />
          </div>
          
          <div class="form-group">
            <div class="form-label">新支付密码</div>
            <van-field
              v-model="paymentForm.newPassword"
              placeholder="请输入新支付密码（6位）"
              maxlength="6"
              :right-icon="paymentForm.showNew ? 'eye-o' : 'closed-eye'"
              @click-right-icon="paymentForm.showNew = !paymentForm.showNew"
              :type="paymentForm.showNew ? 'text' : 'password'"
              class="custom-field"
            />
          </div>

          <div class="form-group">
            <div class="form-label">确认支付密码</div>
            <van-field
              v-model="paymentForm.confirmPassword"
              placeholder="请输入确认支付密码（6位）"
              maxlength="6"
              :right-icon="paymentForm.showConfirm ? 'eye-o' : 'closed-eye'"
              @click-right-icon="paymentForm.showConfirm = !paymentForm.showConfirm"
              :type="paymentForm.showConfirm ? 'text' : 'password'"
              class="custom-field"
            />
          </div>
        </div>

        <div class="service-link" @click="goService">在线客服</div>

        <div class="submit-btn">
          <van-button 
            block 
            round 
            size="large"
            @click="handleSubmit"
          >
            确认修改
          </van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { updatePassword } from '@/api/auth'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
const activeTab = ref('login') // Default to login
const isPayPassword = ref(false) // 原支付密码是否存在

const loginForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
  showOld: false,
  showNew: false,
  showConfirm: false
})

const paymentForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
  showOld: false,
  showNew: false,
  showConfirm: false
})

onMounted(() => {
  // 从缓存中获取 isPayPassword 字段，1表示有支付密码，0表示没有
  const userInfo = userStore.userInfo
  isPayPassword.value = userInfo?.isPayPassword === 1
})

const onClickLeft = () => {
  router.back()
}

const goService = () => {
  window.location.href = '/chatlink.html'
}

const handleSubmit = async () => {
  if (activeTab.value === 'login') {
    if (!loginForm.oldPassword || !loginForm.newPassword || !loginForm.confirmPassword) {
      showToast('请填写完整信息')
      return
    }
    if (loginForm.newPassword !== loginForm.confirmPassword) {
      showToast('两次输入的密码不一致')
      return
    }
    
    try {
      const res = await updatePassword({
        oriPassword: loginForm.oldPassword,
        newPassword: loginForm.newPassword,
        type: '0' // 0登录密码
      })
      
      if (res.code === 0 || res.code === 200) {
        showToast('登录密码修改成功')
        router.back()
      } else {
        showToast(res.msg || '修改失败')
      }
    } catch (error) {
      showToast(error.msg || '修改失败，请重试')
    }
  } else {
    if (!paymentForm.newPassword || !paymentForm.confirmPassword) {
      showToast('请填写完整信息')
      return
    }
    if (paymentForm.newPassword !== paymentForm.confirmPassword) {
      showToast('两次输入的密码不一致')
      return
    }
    if (paymentForm.newPassword.length !== 6) {
      showToast('支付密码必须为6位')
      return
    }
    
    try {
      // 根据 isPayPassword 决定是否需要验证登录密码
      const payload = {
        newPassword: paymentForm.newPassword,
        type: '1' // 1支付密码
      }
      
      if (isPayPassword.value) {
        if (!paymentForm.oldPassword) {
          showToast('请填写账号密码')
          return
        }
        payload.oriPassword = paymentForm.oldPassword
      }
      
      const res = await updatePassword(payload)
      
      if (res.code === 0 || res.code === 200) {
        showToast('支付密码修改成功')
        router.back()
      } else {
        showToast(res.msg || '修改失败')
      }
    } catch (error) {
      showToast(error.msg || '修改失败，请重试')
    }
  }
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

:deep(.van-nav-bar__title) { color: #fff; font-weight: bold; font-size: var(--font-size-large); }
:deep(.van-icon) { color: #fff; }

.header-bg {
  background: var(--blue-gradient);
  height: 220px;
  padding: 0;
  position: relative;
}

.tab-container {
  display: flex;
  gap: 16px;
  background: transparent;
  padding: 10px 16px 0;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 12px 0;
  font-size: var(--font-size-small);
  color: #fff;
  background: transparent;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.3s;
  border: 1px solid #fff;
  font-weight: 500;
}

.tab-item.active {
  background: #fff;
  color: var(--blue-deep);
  font-weight: bold;
  border: 1px solid transparent;
}

.content {
  padding: 0 16px;
  margin-top: -110px;
  position: relative;
  z-index: 1;
}

.form-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  font-size: var(--font-size-small);
  color: #333;
  margin-bottom: 8px;
  font-weight: 500;
}

.custom-field {
  background: #f5f7fa;
  border-radius: 8px;
  padding: 12px 16px;
}

:deep(.van-field__control) {
  font-size: var(--font-size-small);
  font-weight: 500;
}

.service-link {
  text-align: right;
  color: var(--blue-deep);
  font-size: var(--font-size-small);
  margin-bottom: 30px;
  text-decoration: underline;
  cursor: pointer;
  font-weight: 500;
}

.submit-btn {
  margin-bottom: 10px;
}

:deep(.van-button) {
  font-size: var(--font-size-base);
  font-weight: bold;
  height: 48px;
  box-shadow: 0 4px 10px rgba(43, 122, 251, 0.3);
  background:var(--blue-gradient);
  color:white;
  
}
</style>
