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
        <div class="page-title">团队协同推进计划</div>
        <div class="office-info">关于实施《团队协同推进计划》的通知</div>
        <p>各相关工作组、团队负责人及全体参与人员：</p>
        <p>为进一步推进民生资产相关工作的组织建设，提升团队管理与执行效率，构建规范稳定、高效运转的团队体系，经研究决定，正式启动《团队协同推进计划》。</p>
        <p>本计划以分级管理与动态考核为核心，建立清晰的发展路径与责任体系，全面提升团队整体执行能力，推动各项工作有序推进。</p>
        <p>现将有关事项通知如下：</p>
        <p><strong>一、团队长分级管理体系</strong></p>
        <p>团队长实行分级管理，根据个人能力、团队规模及综合贡献划分为六级：</p>
        <p><strong>（一）一级团队长（基础成员）</strong></p>
        <p>👉 起步阶段</p>
        <p>直推≥50人｜团队≥300人</p>
        <p>职责：基础拉新、参与团队建设</p>
        <p><strong>（二）二级团队长（初级骨干）</strong></p>
        <p>👉 基础运营阶段</p>
        <p>直推≥100人｜团队≥1000人</p>
        <p>职责：维护团队、协助管理</p>
        <p><strong>（三）三级团队长（核心执行）</strong></p>
        <p>👉 稳定发展阶段</p>
        <p>直推≥200人｜团队≥3000人</p>
        <p>职责：日常管理、提升活跃</p>
        <p><strong>（四）四级团队长（重点培养）</strong></p>
        <p>👉 扩张阶段</p>
        <p>直推≥300人｜团队≥10000人</p>
        <p>职责：扩大规模、培养下级</p>
        <p><strong>（五）五级团队长（区域骨干）</strong></p>
        <p>👉 核心管理层</p>
        <p>直推≥1000人｜团队≥50000人</p>
        <p>职责：统筹发展、优化结构</p>
        <p><strong>（六）六级团队长（区域负责人）</strong></p>
        <p>👉 战略核心层</p>
        <p>按综合表现评定</p>
        <p>职责：区域发展、参与决策</p>
        <p><strong>二、晋升与考核机制</strong></p>
        <p>1️⃣ 达标即晋升</p>
        <p>符合标准自动晋升</p>
        <p>2️⃣ 动态复核</p>
        <p>每月核查，未达标动态调整</p>
        <p>3️⃣ 公开透明</p>
        <p>以系统数据为唯一依据</p>
        <p><strong>三、执行要求</strong></p>
        <p>严禁刷量、虚假注册</p>
        <p>数据统一以【会聊系统】为准</p>
        <p>异常数据将核查处理</p>
        <p>制度按发展阶段动态优化</p>
        <p><strong>四、工作导向</strong></p>
        <p>👉 以数据为依据</p>
        <p>👉 以结果为导向</p>
        <p>👉 以能力为核心</p>
        <p>持续提升团队执行力与整体效率。</p>
        <p><strong>五、特别说明</strong></p>
        <p>团队长等级代表能力与贡献：</p>
        <p>👉 等级越高，责任越大</p>
        <p>👉 能力越强，空间越大</p>
        <p>请各团队负责人积极推进团队建设，提升规模与活跃度，推动整体工作稳步发展。</p>
        <p>民生资产专项办公室</p>
        <p>2026年4月18日</p>
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
  width: 100px;
  height: 100px;
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