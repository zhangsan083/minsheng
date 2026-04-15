<template>
  <div class="page">
    <div class="header-bg">
      <van-nav-bar
        title="绑定微信"
        left-arrow
        @click-left="$router.back()"
        :border="false"
        class="nav-bar"
      />
    </div>

    <div class="content">
      <div class="bind-card">
        <div class="card-title">绑定微信</div>
        
        <div class="form-item">
          <div class="icon-wrapper">
            <van-icon name="contact" size="24" color="#07c160" />
          </div>
          <div class="form-content">
            <div class="form-label">真实姓名：</div>
            <input
              v-model="realName"
              class="input-plain"
              placeholder="请输入真实姓名"
              type="text"
            />
          </div>
        </div>

        <div class="form-item">
          <div class="icon-wrapper">
            <van-icon name="chat-o" size="24" color="#07c160" />
          </div>
          <div class="form-content">
            <div class="form-label">微信号：</div>
            <input
              v-model="wechatAccount"
              class="input-plain"
              placeholder="请输入微信号"
              type="text"
            />
          </div>
        </div>

        <div class="upload-section">
          <div class="upload-label">上传收款码：</div>
          <van-uploader
            v-model="qrFileList"
            :max-count="1"
            :after-read="afterReadQr"
            accept="image/*"
            :deletable="true"
          >
            <div v-if="qrFileList.length === 0" class="upload-placeholder">
              <van-icon name="plus" size="28" color="#999" />
              <div class="upload-text">点击上传收款码</div>
            </div>
          </van-uploader>
        </div>

        <div class="default-switch">
          <span class="default-label">设为默认账户</span>
          <van-switch v-model="isDefault" size="24" active-color="var(--blue-deep)" />
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
          温馨提示：为了确保提现顺利到账，请务必填写真实有效的信息。每个账户仅可绑定一个微信账户。
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showLoadingToast, showToast } from 'vant'
import { getAccountDetail, saveAccount } from '@/api/auth'
import { uploadFile } from '@/api/assets'

const router = useRouter()
const route = useRoute()
const realName = ref('')
const wechatAccount = ref('')
const qrFileList = ref([])
const qrImgUrl = ref('')
const isDefault = ref(false)

onMounted(async () => {
  const id = route.query?.id
  if (!id) return
  const toast = showLoadingToast({ message: '加载中...', forbidClick: true, duration: 0 })
  try {
    const res = await getAccountDetail(id)
    toast.close()
    if (res && res.code === 200 && res.data) {
      realName.value = res.data.realName || ''
      wechatAccount.value = res.data.accountNum || ''
      isDefault.value = res.data.isDefault === 1
      if (res.data.qrImg) {
        qrImgUrl.value = res.data.qrImg
        qrFileList.value = [{ url: res.data.qrImg, status: 'done', message: '' }]
      }
    }
  } catch (e) {
    toast.close()
  }
})

const afterReadQr = async (file) => {
  file.status = 'uploading'
  file.message = '上传中...'
  try {
    const res = await uploadFile(file.file)
    if (res && res.code === 200) {
      file.status = 'done'
      file.message = ''
      qrImgUrl.value = res.fileName || res.url || ''
    } else {
      file.status = 'failed'
      file.message = '上传失败'
      showToast(res?.msg || '上传失败')
    }
  } catch (error) {
    file.status = 'failed'
    file.message = '上传失败'
    showToast('上传出错')
  }
}

const handleSubmit = () => {
  if (!realName.value) return showToast('请输入真实姓名')
  if (!wechatAccount.value) return showToast('请输入微信号')
  const toast = showLoadingToast({ message: '保存中...', forbidClick: true, duration: 0 })
  const idParam = route.query?.id
  const payload = {
    accountNum: wechatAccount.value,
    accountType: '3',
    openName: '微信',
    realName: realName.value,
    qrImg: qrImgUrl.value,
    isDefault: isDefault.value ? 1 : 0
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

.input-plain {
  flex: 1;
  text-align: right;
  border: none;
  background: transparent;
  font-size: var(--font-size-small);
  color: #333;
  width: 0;
  min-width: 0;
  box-sizing: border-box;
}
.input-plain::placeholder {
  color: #999;
}
.input-plain:focus {
  outline: none;
}

.upload-section {
  width: 100%;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.upload-label {
  font-size: var(--font-size-small);
  color: #666;
  margin-bottom: 10px;
}

.upload-placeholder {
  width: 120px;
  height: 120px;
  background: #f5f7fa;
  border: 1px dashed #ccc;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.upload-text {
  font-size: 12px;
  color: #999;
}

:deep(.van-uploader__preview) {
  width: 120px;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
}

:deep(.van-uploader__preview-image) {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.submit-btn-wrapper {
  width: 100%;
  margin-top: 20px;
  margin-bottom: 20px;
}

.default-switch {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
}

.default-label {
  font-size: var(--font-size-small);
  color: #333;
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
