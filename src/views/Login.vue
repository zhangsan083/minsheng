<template>
  <div class="page">
    <div class="page__body">
      <div class="logo-area">
        <img src="/logo主图形.png" class="logo-img" alt="logo" />
        <div class="logo-text">民 生 资 产</div>
      </div>
      <div class="card">
        <div class="card__body">
          <van-field v-model="mobile" label="手机号码" label-width="5em" placeholder="请填写账号或者手机号" type="tel" maxlength="11" @input="handlePhoneInput">
            <template #left-icon>
              <img src="@/assets/登录/手机.png" class="field-icon" alt="手机" />
            </template>
          </van-field>
          <van-field v-model="password" label="账号密码" label-width="5em" type="password" placeholder="请输入密码">
            <template #left-icon>
              <img src="@/assets/登录/密码.png" class="field-icon" alt="密码" />
            </template>
          </van-field>
          <div class="row">
            <van-checkbox v-model="remember">记住密码</van-checkbox>
            <span class="link" @click="forgot">忘记密码</span>
          </div>
          <van-button class="btn-login" block :loading="loading" loading-text="登录中..." @click="login">登录</van-button>
          <div class="footer">
            没有账号？<span class="link" @click="goRegister">注册新账号</span>
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
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { login as loginApi, getUserInfo } from '@/api/auth'
import { showDialog } from 'vant'

const mobile = ref('')
const password = ref('')
const remember = ref(false)
const loading = ref(false)
const router = useRouter()
const route = useRoute()
const user = useUserStore()

onMounted(() => {
  const savedMobile = localStorage.getItem('remember_mobile')
  const savedPassword = localStorage.getItem('remember_password')
  if (savedMobile && savedPassword) {
    mobile.value = savedMobile
    password.value = savedPassword
    remember.value = true
  }
})

const login = () => {
  if (!mobile.value || !password.value) {
    showDialog({ message: '请输入账号与密码' })
    return
  }
  
  loading.value = true
  loginApi(mobile.value, password.value)
    .then((resp) => {
      if (resp?.code === 200 && resp?.data) {
        user.setToken(resp.data)
        
        if (remember.value) {
          localStorage.setItem('remember_mobile', mobile.value)
          localStorage.setItem('remember_password', password.value)
        } else {
          localStorage.removeItem('remember_mobile')
          localStorage.removeItem('remember_password')
        }

        getUserInfo().then(infoResp => {
          if (infoResp?.code === 200 && infoResp?.data) {
            user.setUserInfo(infoResp.data)
          }
        }).catch(e => {
          console.error('获取用户信息失败', e)
        }).finally(() => {
          const redirect = route.query.redirect
          if (redirect && redirect !== '/customer-service') {
            router.replace(redirect)
          } else {
            router.replace('/home')
          }
        })
      } else {
        showDialog({ message: resp?.msg || '登录失败' })
      }
    })
    .catch((err) => {
      console.error('Login error:', err)
      let msg = '网络异常或服务器错误'
      if (err.response?.data?.msg) {
        msg = err.response.data.msg
      } else if (err instanceof Error && !err.response) {
        msg = '应用执行错误: ' + err.message
      }
      showDialog({ message: msg })
    })
    .finally(() => {
      loading.value = false
    })
}
const forgot = () => window.alert('请联系客服找回密码')
const goRegister = () => router.push({ name: 'register' })
const goService = () => router.push({ name: 'customer-service' })

const handlePhoneInput = (e) => {
  e.target.value = e.target.value.replace(/[^0-9]/g, '')
  mobile.value = e.target.value
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: url('@/assets/登录/登录背景图.png') no-repeat center top;
  background-size: cover;
  display: flex;
  flex-direction: column;
}

.page__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 16px;
  padding-top: 15vh;
}

.logo-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
}

.logo-img {
  width: 110px;
  height: 110px;
  object-fit: contain;
}

.logo-text {
  margin-top: 12px;
  font-size: 24px;
  font-weight: bold;
  color: #0b3d91;
  letter-spacing: 6px;
}

.card {
  width: 100%;
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

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.link {
  color: var(--blue-deep);
}

.footer {
  text-align: center;
  font-size: var(--font-size-xs);
  color: #8c8c8c;
  margin-top: 8px;
}

.field-icon {
  width: 22px;
  height: 22px;
  object-fit: contain;
}

.btn-login {
  border: none;
  background: var(--blue-gradient);
  color: #ffffff;
  border-radius: 999px;
  margin-top: 16px;
}

.btn-login:active {
  opacity: 0.9;
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
