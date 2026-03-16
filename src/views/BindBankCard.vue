<template>
  <div class="page">
    <div class="header-bg">
      <van-nav-bar
        title="绑定银行卡"
        left-arrow
        @click-left="$router.back()"
        :border="false"
        class="nav-bar"
      />
    </div>

    <div class="content">
      <div class="bind-card">
        <div class="card-title">绑定银行卡</div>
        
        <div class="form-item">
          <div class="icon-wrapper">
            <img :src="iconBindMy" class="form-icon-img" alt="my" />
          </div>
          <div class="form-content">
            <div class="form-label">真实姓名：</div>
            <input
              v-model="realName"
              class="input-plain"
              placeholder="请输入真实姓名"
            />
          </div>
        </div>

        <div class="form-item">
          <div class="icon-wrapper">
            <img :src="iconBindCard" class="form-icon-img" alt="card" />
          </div>
          <div class="form-content">
            <div class="form-label">银行卡号：</div>
            <input
              v-model="bankCardNumber"
              class="input-plain"
              placeholder="请输入银行卡号"
              type="tel"
            />
          </div>
        </div>

        <div class="form-item">
          <div class="icon-wrapper">
            <img :src="iconBindBank" class="form-icon-img" alt="bank" />
          </div>
          <div class="form-content">
            <div class="form-label">开户银行：</div>
            <input
              v-model="bankName"
              class="input-plain"
              placeholder="请输入开户银行"
            />
          </div>
        </div>

        <div class="submit-btn-wrapper">
          <van-button 
            block 
            round 
            type="primary" 
            class="submit-btn"
            @click="handleSubmit"
          >
            确认绑定
          </van-button>
        </div>

        <div class="tips">
          温馨提示：为了确保提现顺利到账，请务必填写真实有效的信息。每个账户仅可绑定一张银行卡。
          <!-- ，如需更换绑定信息，请及时联系在线客服 -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { showToast, showLoadingToast } from 'vant'
import { useRouter, useRoute } from 'vue-router'
import { getAccountDetail, saveAccount } from '@/api/auth'

import iconBindMy from '@/assets/收款账户/绑定我的.png'
import iconBindCard from '@/assets/收款账户/绑定银联.png'
import iconBindBank from '@/assets/收款账户/绑定开户行.png'

const router = useRouter()
const route = useRoute()
const realName = ref('')
const bankCardNumber = ref('')
const bankName = ref('')

onMounted(async () => {
  const id = route.query?.id
  if (!id) return
  const toast = showLoadingToast({ message: '加载中...', forbidClick: true, duration: 0 })
  try {
    const res = await getAccountDetail(id)
    toast.close()
    if (res && res.code === 200 && res.data) {
      realName.value = res.data.realName || ''
      bankCardNumber.value = res.data.accountNum || ''
      bankName.value = res.data.openName || ''
    }
  } catch (e) {
    toast.close()
  }
})

const handleSubmit = () => {
  if (!realName.value) return showToast('请输入真实姓名')
  if (!bankCardNumber.value) return showToast('请输入银行卡号')
  if (!bankName.value) return showToast('请输入开户银行')
  const toast = showLoadingToast({ message: '保存中...', forbidClick: true, duration: 0 })
  const idParam = route.query?.id
  const payload = {
    accountNum: bankCardNumber.value,
    openName: bankName.value
  }
  if (idParam) {
    payload.id = Number(idParam)
  }
  saveAccount(payload).then(res => {
    toast.close()
    if (res && res.code === 200) {
      showToast('保存成功')
      setTimeout(() => {
        router.back()
      }, 1200)
    } else {
      showToast(res?.msg || '保存失败')
    }
  }).catch(() => {
    toast.close()
    showToast('保存失败')
  })
}

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
  padding-bottom: 20px;
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
}

.bind-card {
  background: #fff;
  border-radius: 12px;
  padding: 30px 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card-title {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: #333;
  margin-bottom: 30px;
}

.form-item {
  width: 100%;
  background: #f5f7fa;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.icon-wrapper {
  width: 24px;
  height: 24px;
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-icon {
  font-size: 20px;
  color: #4da9ff; /* Light blue icon color */
}

.form-icon-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.form-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.form-label {
  font-size: var(--font-size-small);
  color: #666;
}

.form-value {
  font-size: var(--font-size-small);
  color: #333;
  font-weight: 500;
}

.input-plain {
  flex: 1;
  text-align: right;
  border: none;
  background: transparent;
  font-size: var(--font-size-small);
  color: #333;
}
.input-plain::placeholder {
  color: #999;
}
.input-plain:focus {
  outline: none;
}

.submit-btn-wrapper {
  width: 100%;
  margin-top: 20px;
  margin-bottom: 20px;
}

.submit-btn {
  background: var(--blue-gradient);
  border: none;
  font-size: var(--font-size-base);
  height: var(--button-normal-height);
}

.tips {
  font-size: var(--font-size-xs);
  color: #999;
  line-height: 1.6;
  text-align: justify;
}
</style>
