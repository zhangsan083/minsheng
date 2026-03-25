<template>
  <div class="page">
    <div class="header">
      <van-nav-bar
        title="团队长申请"
        left-arrow
        @click-left="goBack"
        :border="false"
        class="nav-bar"
      />
    </div>

    <div class="content">

      <!-- 说明文字 -->
      <div class="description">
        <!-- 页面标题 -->
        <div class="page-title">团队长合作计划</div>
        <div class="office-info">国家发展和改革委员会一国家数据局民生资产专项办公室</div>
        <div class="document-number">民办资（2026）01号</div>
        <p>关于实施《团队长合作计划》的通知</p>
        <br />
        <p>各相关工作章、团队负责人及参与人员：</p>
        <br />
        <p>为进一步推进民生资产下相关工作的组织建设、提升团队管理能力，建立更加规范、稳定、高效的发展体系，经研究决定，正式启动《团队长合作计划》。</p>
        <br />
        <p>通过完善团队长培养与晋升机制，建立清晰的等级体系与发展路径，增强团队长的荣誉感、归属感与责任感，推动团队组织规范化发展。</p>
        <br />
        <p>现将有关事项通知如下：</p>
        <br />
        <p>一、建立团队长等级体系</p>
        <p>为规范团队管理与发展路径，团队长岗位实行分级管理制度。</p>
        <p>团队长根据个人能力、团队规模及综合贡献，分为以下三个等级：</p>
        <br />
        <p>（一）初级团队长</p>
        <p>（编外在职人员）</p>
        <p>初级团队长为官方初期合作人员，主要参与团队组织与基础推广工作。</p>
        <p>主要职责</p>
        <p>1.负责团队基础组织与管理工作</p>
        <p>2.推动团队成员参与相关工作</p>
        <p>3.协助工作开展与宣传</p>
        <p>4.维护团队稳定与秩序</p>
        <br />
        <p>相关待遇</p>
        <p>国家发展和改革委员会</p>
        <p>国家数据局</p>
        <p>民生资产专项办公室</p>
        <p>2026年 1月2日</p>
        <p>（此件公开发布）</p>
      </div>

      <!-- 合同签署 -->
      <div class="contract-section">
        <div class="contract-title">合同签署</div>

        <!-- 表单 -->
        <div class="form">
          <div class="form-item">
            <label class="form-label">姓名：</label>
            <input type="text" class="form-input" placeholder="请输入真实姓名" v-model="form.name" />
          </div>

          <div class="form-item">
            <label class="form-label">联系电话：</label>
            <input type="tel" class="form-input" placeholder="请输入联系电话" v-model="form.phone" />
          </div>

          <div class="form-item">
            <label class="form-label">身份证号码：</label>
            <input type="text" class="form-input" placeholder="请输入身份证号码" v-model="form.idCard" />
          </div>

          <div class="form-item">
            <label class="form-label">地址：</label>
            <input type="text" class="form-input" placeholder="请输入地址" v-model="form.address" />
          </div>

          <!-- 身份证上传 -->
          <div class="id-card-upload">
            <div class="id-card-item">
              <div class="upload-label">身份证正面</div>
              <van-uploader
                v-model="idCardFrontFileList"
                :max-count="1"
                :after-read="afterReadIdCardFront"
              >
                <div class="upload-box">
                  <div class="upload-icon">+</div>
                  <div class="upload-text">点击上传正面</div>
                </div>
              </van-uploader>
            </div>
            <div class="id-card-item">
              <div class="upload-label">身份证反面</div>
              <van-uploader
                v-model="idCardBackFileList"
                :max-count="1"
                :after-read="afterReadIdCardBack"
              >
                <div class="upload-box">
                  <div class="upload-icon">+</div>
                  <div class="upload-text">点击上传反面</div>
                </div>
              </van-uploader>
            </div>
          </div>

          <!-- 个人签名和公章 -->
          <div class="signature-seal-section">
            <!-- 个人签名 -->
            <div class="signature-box" @click="openSignaturePopup">
              <div class="signature-label">(个人签名)</div>
              <div class="signature-display">
                <img v-if="signatureImageUrl" :src="signatureImageUrl" class="signature-img" alt="签名" />
                <span v-else class="signature-placeholder">点击签名</span>
              </div>
            </div>

            <!-- 公章 -->
            <div class="seal-box">
              <div class="seal">
                <img src="@/assets/团队长合作计划/印章.PNG" alt="公章" class="seal-img" />
              </div>
              <div class="seal-label">机构(盖章)</div>
            </div>
          </div>
        </div>

        <!-- 提交按钮 -->
        <button class="submit-btn" @click="handleSubmit">提交申请</button>
      </div>

      <!-- 签名弹窗 -->
      <van-popup v-model:show="signaturePopup" position="bottom" round style="height: 65%;">
        <div class="signature-popup-content">
          <div class="signature-popup-title">我的签名</div>
          <div class="signature-canvas-container">
            <canvas
              ref="canvasRef"
              class="signature-canvas"
              @mousedown="startDrawing"
              @mousemove="draw"
              @mouseup="stopDrawing"
              @mouseleave="stopDrawing"
              @touchstart="startDrawing"
              @touchmove="draw"
              @touchend="stopDrawing"
            ></canvas>
            <div v-if="!hasSignature" class="signature-hint">手写签名</div>
          </div>
          <div class="signature-actions">
            <button class="clear-btn" @click="clearSignature">清除</button>
            <button class="complete-btn" @click="completeSignature">完成签署</button>
          </div>
        </div>
      </van-popup>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { NavBar, Popup, showToast } from 'vant'
import { uploadFile } from '@/api/assets'
import { applyTeamLeader, getTeamLeaderApply } from '@/api/teamLeader'

const router = useRouter()

// 表单数据
const form = ref({
  name: '',
  phone: '',
  idCard: '',
  address: ''
})

// 签名弹窗
const signaturePopup = ref(false)
const canvasRef = ref(null)
const isDrawing = ref(false)
const hasSignature = ref(false)

// 打开签名弹窗
const openSignaturePopup = () => {
  signaturePopup.value = true
}

// 初始化Canvas
const initCanvas = () => {
  if (!canvasRef.value) return
  
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  
  // 设置画布大小
  const rect = canvas.parentElement.getBoundingClientRect()
  canvas.width = rect.width
  canvas.height = rect.height
  
  // 设置画笔样式
  ctx.strokeStyle = '#000'
  ctx.lineWidth = 2
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
}

// 开始签名
const startDrawing = (e) => {
  isDrawing.value = true
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  const rect = canvas.getBoundingClientRect()
  
  const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left
  const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top
  
  ctx.beginPath()
  ctx.moveTo(x, y)
}

// 签名中
const draw = (e) => {
  if (!isDrawing.value) return
  e.preventDefault()
  
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  const rect = canvas.getBoundingClientRect()
  
  const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left
  const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top
  
  ctx.lineTo(x, y)
  ctx.stroke()
  hasSignature.value = true
}

// 结束签名
const stopDrawing = () => {
  isDrawing.value = false
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  ctx.closePath()
}

// 清除签名
const clearSignature = () => {
  if (!canvasRef.value) return
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  hasSignature.value = false
}

// 签名图片URL（用于显示）
const signatureImageUrl = ref('')

// 签名文件名（用于提交）
const signatureFilename = ref('')

// 身份证文件列表
const idCardFrontFileList = ref([])
const idCardBackFileList = ref([])

// 身份证正面图片URL（用于显示）
const idCardFrontUrl = ref('')

// 身份证正面文件名（用于提交）
const idCardFrontFilename = ref('')

// 身份证反面图片URL（用于显示）
const idCardBackUrl = ref('')

// 身份证反面文件名（用于提交）
const idCardBackFilename = ref('')

// 身份证正面上传处理
const afterReadIdCardFront = async (file) => {
  if (!file || !file.file) return

  file.status = 'uploading'
  file.message = '上传中...'

  try {
    const res = await uploadFile(file.file, 'front')
    if (res && res.code === 200) {
      file.status = 'done'
      file.message = '上传成功'
      idCardFrontUrl.value = res.url
      idCardFrontFilename.value = res.fileName
      showToast('身份证正面上传成功')
    } else {
      file.status = 'failed'
      file.message = '上传失败'
      showToast(res?.msg || '上传失败')
    }
  } catch (error) {
    console.error(error)
    file.status = 'failed'
    file.message = '上传失败'
    showToast('上传出错')
  }
}

// 身份证反面上传处理
const afterReadIdCardBack = async (file) => {
  if (!file || !file.file) return

  file.status = 'uploading'
  file.message = '上传中...'

  try {
    const res = await uploadFile(file.file, 'back')
    if (res && res.code === 200) {
      file.status = 'done'
      file.message = '上传成功'
      idCardBackUrl.value = res.url
      idCardBackFilename.value = res.fileName
      showToast('身份证反面上传成功')
    } else {
      file.status = 'failed'
      file.message = '上传失败'
      showToast(res?.msg || '上传失败')
    }
  } catch (error) {
    console.error(error)
    file.status = 'failed'
    file.message = '上传失败'
    showToast('上传出错')
  }
}

// 完成签名
const completeSignature = async () => {
  if (!hasSignature.value) {
    showToast('请先进行签名')
    return
  }
  
  // 获取签名图片数据
  const canvas = canvasRef.value
  
  // 将Canvas转换为Blob
  canvas.toBlob(async (blob) => {
    if (!blob) {
      showToast('签名转换失败')
      return
    }
    
    // 创建File对象
    const file = new File([blob], 'signature.png', { type: 'image/png' })
    
    try {
      showToast('上传中...')
      const res = await uploadFile(file)
      if (res && res.code === 200) {
        signatureImageUrl.value = res.url
        signatureFilename.value = res.fileName
        showToast('签名上传成功')
        signaturePopup.value = false
      } else {
        showToast(res?.msg || '上传失败')
      }
    } catch (error) {
      console.error('上传失败:', error)
      showToast('上传失败')
    }
  }, 'image/png')
}

// 监听弹窗打开，初始化Canvas
watch(signaturePopup, (newVal) => {
  if (newVal) {
    setTimeout(() => {
      initCanvas()
    }, 100)
  }
})

// 返回上一页
const goBack = () => {
  router.back()
}

// 提交申请
const handleSubmit = async () => {
  // 表单验证
  if (!form.value.name.trim()) {
    showToast('请输入真实姓名')
    return
  }
  if (!form.value.phone.trim()) {
    showToast('请输入联系电话')
    return
  }
  if (!form.value.idCard.trim()) {
    showToast('请输入身份证号码')
    return
  }
  if (!form.value.address.trim()) {
    showToast('请输入地址')
    return
  }
  if (!signatureImageUrl.value) {
    showToast('请先进行签名')
    return
  }
  if (!idCardFrontFilename.value || !idCardBackFilename.value) {
    showToast('请上传身份证正面和反面照片')
    return
  }

  try {
    showToast('提交中...')
    
    const submitData = {
      realName: form.value.name,
      phonenumber: form.value.phone,
      idNumber: form.value.idCard,
      address: form.value.address,
      signature: signatureFilename.value,
      idCardFront: idCardFrontFilename.value,
      idCardBack: idCardBackFilename.value
    }
    
    const res = await applyTeamLeader(submitData)
    
    if (res && res.code === 200) {
      showToast('申请提交成功')
      // 提交成功后返回上一页
      setTimeout(() => {
        router.back()
      }, 1500)
    } else {
      showToast(res?.msg || '申请提交失败')
    }
  } catch (error) {
    console.error('提交申请失败:', error)
    showToast('申请提交失败，请稍后重试')
  }
}

// 查询是否存在已提交申请（重新编辑）
const loadTeamLeaderApply = async () => {
  try {
    const res = await getTeamLeaderApply()
    if (res && res.code === 200 && res.data) {
      const data = res.data
      form.value.name = data.realName || ''
      form.value.phone = data.phonenumber || ''
      form.value.idCard = data.idNumber || ''
      form.value.address = data.address || ''

      // 需要重新上传身份证正反面与签名，清空已有图片状态
      signatureImageUrl.value = ''
      signatureFilename.value = ''
      idCardFrontUrl.value = ''
      idCardFrontFilename.value = ''
      idCardBackUrl.value = ''
      idCardBackFilename.value = ''
      idCardFrontFileList.value = []
      idCardBackFileList.value = []
    }
  } catch (error) {
    console.error('获取团队长申请数据失败:', error)
  }
}

onMounted(() => {
  loadTeamLeaderApply()
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  background-color: #f7f8fa;
}

.header {
  height: 220px;
  background: var(--blue-gradient);
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
  position: relative;
  z-index: 1;
  padding-bottom: 30px;
}

/* 页面标题 */
.page-title {
  font-size: 20px;
  font-weight: bold;
  color: #0066ff;
  text-align: center;
  margin-bottom: 10px;
}

.office-info {
  font-size: 14px;
  color: #0066ff;
  text-align: center;
  margin-bottom: 5px;
}

.document-number {
  font-size: 14px;
  text-align: right;
  margin-bottom: 15px;
}

/* 说明文字 */
.description {
  font-size: 14px;
  line-height: 1.8;
  color: #333;
  margin-bottom: 16px;
  padding: 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.description p {
  margin: 0 0 8px 0;
  text-align: justify;
}

/* 合同签署 */
.contract-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 40px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.contract-title {
  font-size: 16px;
  font-weight: bold;
  color: #0066ff;
  text-align: center;
  margin-bottom: 20px;
}

/* 表单 */
.form {
  margin-bottom: 30px;
}

.form-item {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  padding: 0 10px;
}

.form-label {
  width: 100px;
  font-size: 14px;
  color: #333;
}

.form-input {
  flex: 1;
  height: 30px;
  padding: 0 10px;
  border: none;
  border-bottom: 1px dashed #999;
  font-size: 14px;
  background: transparent;
}

/* 身份证上传 */
.id-card-upload {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin: 30px auto;
  width: 100%;
  max-width: 480px;
  flex-wrap: wrap;
  box-sizing: border-box;
}

.id-card-item {
  flex: 0 0 calc(50% - 6px);
  width: calc(50% - 6px);
  box-sizing: border-box;
  overflow: hidden;
}

.upload-box {
  width: 100%;
  height: 100px;
  border: 2px dashed #0066ff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  cursor: pointer;
  box-sizing: border-box;
}

.upload-label {
  width: 100%;
  text-align: center;
}

/* 强制覆盖 van-uploader 内部宽高 */
.id-card-upload :deep(.van-uploader),
.id-card-upload :deep(.van-uploader__wrapper),
.id-card-upload :deep(.van-uploader__preview),
.id-card-upload :deep(.van-uploader__input-wrapper),
.id-card-upload :deep(.van-uploader__upload),
.id-card-upload :deep(.van-uploader__preview-item) {
  width: 100% !important;
  min-width: 0 !important;
  max-width: 100% !important;
  height: 100px !important;
  box-sizing: border-box !important;
}

.id-card-upload :deep(.van-uploader__preview-image) {
  width: 100% !important;
  height: 100% !important;
  object-fit: contain !important;
  box-sizing: border-box !important;
}

.id-card-upload :deep(.van-uploader__upload) {
  margin: 0 !important;
}

.upload-icon {
  font-size: 40px;
  color: #0066ff;
  margin-bottom: 10px;
}

.upload-text {
  font-size: 14px;
  color: #0066ff;
}

/* 个人签名和公章 */
.signature-seal-section {
  display: flex;
  justify-content: space-between;
  margin: 30px 0;
  padding: 0 10px;
}

.signature-box {
  width: 45%;
  height: 100px;
  border: 2px dashed #0066ff;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.signature-label {
  font-size: 14px;
  color: #666;
  margin-top: 10px;
  font-weight: bold;
}

.signature-area {
  font-size: 14px;
  color: #999;
}

.signature-display {
  flex: 1;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.signature-img {
  max-width: 90%;
  max-height: 60px;
  object-fit: contain;
}

.signature-placeholder {
  font-size: 14px;
  color: #999;
}

/* 公章 */
.seal-box {
  width: 45%;
  height: 100px;
  border: 2px dashed #0066ff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.seal-label {
  font-size: 14px;
  color: #666;
  font-weight: bold;
  z-index: 2;
}

.seal {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
}

.seal-img {
  width: 120px;
  height: 120px;
}

/* 提交按钮 */
.submit-btn {
  width: 100%;
  height: 48px;
  background: #0066ff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 30px;
}

.submit-btn:active {
  background: #0052cc;
}

/* 签名弹窗 */
.signature-popup-content {
  height: 100%;
  padding: 20px;
  padding-bottom: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
}

.signature-popup-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.signature-area {
  flex: 1;
  width: 100%;
  background: white;
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}
.signature-canvas-container {
  flex: 1;
  width: 100%;
  background: #f9f9f9;
  border-radius: 8px;
  position: relative;
  margin-bottom: 20px;
  overflow: hidden;
}

.signature-canvas {
  width: 100%;
  height: 100%;
  cursor: crosshair;
}

.signature-hint {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 16px;
  color: #999;
  pointer-events: none;
}

.signature-actions {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.clear-btn {
  width: 120px;
  height: 44px;
  background: #fff;
  color: #666;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}

.complete-btn {
  width: 200px;
  height: 44px;
  background: #0066ff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}
</style>