<template>
  <div class="page">
    <div class="header-bg">
      <van-nav-bar
        title="注册"
        left-arrow
        @click-left="goBack"
        :border="false"
        style="background: transparent; --van-nav-bar-title-text-color: #ffffff; --van-nav-bar-icon-color: #ffffff;"
      />
    </div>

    <div class="page__body">
      <div class="card">
        <div class="card__banner">
          <img
            class="card__banner-img"
            src="@/assets/注册/注册背景图.png"
            alt="人民资产"
          />
        </div>
        <div class="card__body">
          <van-field v-model="mobile" label="手机号码" placeholder="请输入手机号" type="tel" maxlength="11" @input="handlePhoneInput" />
          <van-field v-model="password" type="password" label="账号密码" placeholder="请输入密码" />
          <van-field v-model="confirm" type="password" label="确认密码" placeholder="请确认密码" />
          <van-field v-model="paymentPassword" type="password" label="支付密码" placeholder="请输入支付密码" />
          <van-field v-model="confirmPaymentPassword" type="password" label="确认支付密码" placeholder="请确认支付密码" />
          <van-field v-model="invite" label="邀请码" placeholder="请输入邀请码" />
          <van-field v-model="realname" label="真实姓名" placeholder="请输入真实姓名" />
          <van-field v-model="idcard" label="身份证号" placeholder="请如实填写身份证号" />
          <van-field
            v-model="captchaInput"
            label="验证码"
            placeholder="请输入验证码"
            :rules="[{ required: true, message: '请输入验证码' }]"
          >
            <template #button>
              <img 
                v-if="captchaImg" 
                :src="captchaImg" 
                class="captcha-img" 
                @click="getCaptcha" 
                alt="验证码"
              />
              <span v-else class="loading-text" @click="getCaptcha">加载中...</span>
            </template>
          </van-field>
          <van-button class="btn-register" block @click="submit">立即注册</van-button>
          <div class="footer">
            已有账号？<span class="link" @click="goLogin">登录您的账号</span>
          </div>
        </div>
      </div>
    </div>
    
    <van-floating-bubble axis="xy" magnetic="x" :gap="24" style="--van-floating-bubble-background: transparent; box-shadow: none; border: none; overflow: hidden">
      <div class="helper__icon" @click.stop.prevent="goService">
        <img
          class="helper__img"
          src="@/assets/我的/客服.png"
          alt="帮助"
        />
      </div>
    </van-floating-bubble>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { register as registerApi, login as loginApi, getCaptchaImage, getUserInfo } from '@/api/auth'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const user = useUserStore()
const mobile = ref('')
const password = ref('')
const confirm = ref('')
const paymentPassword = ref('')
const confirmPaymentPassword = ref('')
const invite = ref('')
const realname = ref('')
const idcard = ref('')
const captchaInput = ref('')
const captchaImg = ref('')
const uuid = ref('')
const loading = ref(false)

const getCaptcha = () => {
  getCaptchaImage().then(res => {
    // 兼容后端可能返回的两种数据结构：
    // 1. 标准结构: { code: 200, data: { img: '...', uuid: '...' } }
    // 2. 扁平结构: { code: 200, img: '...', uuid: '...' }
    const data = res.data || res
    
    if (res.code === 200) {
      if (data.img) {
        // 检查返回的 img 字段是否已经包含 data:image 前缀
        // 如果后端返回的是纯 base64 字符串（如 "/9j/4AAQ..."），需要拼接前缀
        const prefix = 'data:image/gif;base64,'
        captchaImg.value = data.img.startsWith('data:') ? data.img : prefix + data.img
        uuid.value = data.uuid
      }
    }
  }).catch(err => {
    console.error('获取验证码失败:', err)
    showToast('验证码获取失败，请重试')
  })
}

onMounted(() => {
  const code = route.query.invitationCode || route.query.invite || route.query.code
  if (code) {
    invite.value = String(code)
  }
  getCaptcha()
})

const submit = () => {
  if (!mobile.value || !password.value || !confirm.value || !captchaInput.value || !paymentPassword.value || !confirmPaymentPassword.value) {
    showToast('请完整填写信息')
    return
  }
  if (password.value !== confirm.value) {
    showToast('两次账号密码不一致')
    return
  }
  if (paymentPassword.value !== confirmPaymentPassword.value) {
    showToast('两次支付密码不一致')
    return
  }
  if (password.value.length < 6) {
    showToast('账号密码长度至少6位')
    return
  }
  if (paymentPassword.value.length < 6) {
    showToast('支付密码长度至少6位')
    return
  }
  
  loading.value = true
  const payload = {
    idNumber: idcard.value || '',
    invitationCode: invite.value || '',
    phonenumber: mobile.value,
    password: password.value,
    payPassword: paymentPassword.value,
    realName: realname.value,
    code: captchaInput.value,
    uuid: uuid.value
  }
  
  registerApi(payload)
    .then((resp) => {
      if (resp?.code === 200 && resp?.data) {
        showToast('注册成功')
        // 直接使用注册返回的token
        user.setToken(resp.data)
        
        localStorage.setItem('remember_mobile', mobile.value)
        localStorage.setItem('remember_password', password.value)

        getUserInfo().then(infoResp => {
          if (infoResp?.code === 200 && infoResp?.data) {
            user.setUserInfo(infoResp.data)
          }
        }).catch(e => {
          console.error('获取用户信息失败', e)
        }).finally(() => {
          router.replace('/home')
        })
      } else {
        showToast(resp?.msg || '注册失败')
        getCaptcha()
      }
    })
    .catch(() => {
      showToast('网络异常或服务器错误')
      getCaptcha()
    })
    .finally(() => {
      loading.value = false
    })
}



const goLogin = () => router.replace({ name: 'login' })
const goBack = () => router.back()
const goService = () => router.push({ name: 'customer-service' })

const handlePhoneInput = (e) => {
  // 只允许输入数字
  e.target.value = e.target.value.replace(/[^0-9]/g, '')
  mobile.value = e.target.value
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f7f8fa;
  padding-bottom: 40px;
}

.header-bg {
  height: 220px;
  background: var(--blue-gradient);
  position: relative;
  z-index: 1;
}

.card__banner {
  position: relative;
}
.card__banner-img {
  width: 100%;
  display: block;
}

.page__body {
  padding: 16px;
  margin-top: -160px;
  position: relative;
  z-index: 2;
}

.card {
  border-radius: 20px;
  background: #ffffff;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.card__body {
  padding: 24px 20px 30px;
  display: grid;
  grid-auto-rows: min-content;
  gap: 16px;
}

.captcha-img {
  width: 80px;
  height: 32px;
  cursor: pointer;
  vertical-align: middle;
}

.loading-text {
  font-size: var(--font-size-xs);
  color: #999;
  cursor: pointer;
}

.footer {
  text-align: center;
  font-size: var(--font-size-xs);
  color: #8c8c8c;
  margin-top: 8px;
}
.link {
  color: var(--blue-deep);
}
.btn-register {
  border: none;
  background: var(--blue-gradient);
  color: #ffffff;
  border-radius: 999px;
  margin-top: 16px;
}
.btn-register:active {
  opacity: 0.9;
}
.helper {
  display: flex;
  justify-content: flex-end;
  padding: 0 24px 24px;
}
.helper__icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.helper__img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
