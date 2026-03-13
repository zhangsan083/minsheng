<template>
  <div class="page">
    <div class="custom-header">
      <van-nav-bar
        title="共富普惠救助金"
        left-arrow
        @click-left="$router.back()"
        :border="false"
        class="nav-bar"
      />
    </div>

    <div class="content">
      <!-- 顶部介绍卡片 -->
      <div class="card intro-card">
        <div class="card-title">共富普惠救助金（追梦人专项保障计划）<br>普惠救助，精准托底（最高救助额度600万元）</div>
        <div class="card-content">
          作为“十五五”时期推进共同富裕的关键制度突破，共富普惠救助金是国家面向“中国梦”战略项目核心参与者及其家庭设立的定向保障机制。该机制以“奋斗者无忧、奉献者得尊崇”为价值导向，精准覆盖重大国家战略项目核心建设者及其家庭。重点解决重大国家战略建设者的后顾之忧，彰显“发展为了人民、成果由人民共享”的社会主义本质要求。
        </div>
      </div>

      <!-- 申请条件与细则 -->
      <div class="card info-card">
        <div class="card-title">共富普惠救助金申请条件与细则 <span class="subtitle">(2025年修订版)</span></div>
        <div class="rules-content">
          <div class="rule-section">
            <div class="rule-header">
              <span class="badge">1</span> 适用对象
            </div>
            <p>参与国家“中国梦”项目建设，并符合下列任一条件的个人或家庭，可申请救助金。核定金额根据实际困难程度动态调整，基础保障额度为50万元/户，特殊情形最高可提升至600万元。覆盖债务清偿、医疗救助、住房修缮、生活周转等用途。</p>
          </div>
          
          <div class="rule-section">
            <div class="rule-header">
              <span class="badge">2</span> 优先规则
            </div>
            <p class="rule-note">（按优先级排序，满足多项条件可叠加额度）</p>
            <ol>
              <li><strong>经济困难群体（优先审批）</strong><br>失业/低收入者、单亲家庭、赡养多子女或老人的家庭，收入低于基本生活标准</li>
              <li><strong>重大疾病或残疾（优先审批）</strong><br>家庭成员患重病或残疾需高额治疗费用，或因照护失能者导致家庭收入中断。</li>
              <li><strong>合规负债压力（优先审批）</strong><br>债务来源合法（需提供“中国梦”项目参与证明、正规金融机构贷款合同等），当前负债率（债务/资产）≥50%，且无恶意逃废行为。</li>
              <li><strong>突发灾难或意外</strong><br>因自然灾害、事故等突发事件造成财产损失或劳动力丧失，短期内无收入来源。</li>
              <li><strong>住房与基本生活条件缺失</strong><br>无住房或居住危房，或极端贫困无法负担水电、食物等基本生活需求。</li>
            </ol>
            <p class="rule-footer">注：本细则自2025年11月1日起施行，最终解释权归数字钱包平台所有。申请人需如实填写信息，虚假申报将承担法律责任。本政策为国家特别试点项目，审核流程严格，最终结果以官方核定为准。通过精准救助推动社会公平，助力共同富裕。</p>
          </div>

          <div class="rule-section">
            <div class="rule-header">
              <span class="badge">3</span> 额度规则
            </div>
            <p>基础额度50万元。每符合一项优先条件视情形增加20%-50%；<br>
            重大疾病、灾害类可额外申请专项补贴，最高可达600万元。<br>
            <strong>特殊情形通道</strong><br>
            对烈士家属、见义勇为者等群体开通快速审批绿色通道，额度上浮10%-20%</p>
          </div>
        </div>
      </div>

      <div class="card form-card">
        <div class="form-title">共富普惠救助金申请表</div>
        <div class="form-grid">
          <van-field v-model="form.realName" label="姓名：" placeholder="请输入真实姓名" input-align="right" />
          <van-field v-model="form.phonenumber" label="联系电话：" placeholder="请输入联系电话" input-align="right" />
          <van-field v-model="form.idNumber" label="身份证号码：" placeholder="请输入身份证号码" input-align="right" />
          <van-field v-model="form.address" label="现居住地址：" placeholder="请输入现居住地址" input-align="right" />
          <van-field v-model="form.population" type="number" label="家庭总人口：" placeholder="请输入家庭总人口" input-align="right" />
          <van-field v-model="form.monthIncome" type="number" label="月均总收入（元）：" placeholder="请输入月均总收入" input-align="right" />
          <van-field v-model="form.liability" type="number" label="负债总额（元）：" placeholder="请输入负债总额" input-align="right" />
          
          <div class="field-row">
            <div class="field-label">是否参与“中国梦”项目</div>
            <van-radio-group v-model="form.isParticipateChecked" direction="horizontal">
              <van-radio :name="true">是</van-radio>
              <van-radio :name="false">否</van-radio>
            </van-radio-group>
          </div>
          
          <div class="form-note">重大疾病或残疾、债务、失业需上传相关证明材料，可获得优先审批资格</div>
        </div>

        <div class="upload-title">附申请材料上传（可选填）</div>
        <div class="upload-grid">
          <div class="upload-item">
            <van-uploader v-model="files1" :max-count="1" :preview-image="true" :after-read="afterRead">
              <div class="upload-box">
                <van-icon name="plus" size="40" color="#999" />
                <div class="upload-text">点击上传证明材料</div>
              </div>
            </van-uploader>
          </div>
          <div class="upload-item">
            <van-uploader v-model="files2" :max-count="1" :preview-image="true" :after-read="afterRead">
              <div class="upload-box">
                <van-icon name="plus" size="40" color="#999" />
                <div class="upload-text">点击上传证明材料</div>
              </div>
            </van-uploader>
          </div>
          <div class="upload-item">
            <van-uploader v-model="files3" :max-count="1" :preview-image="true" :after-read="afterRead">
              <div class="upload-box">
                <van-icon name="plus" size="40" color="#999" />
                <div class="upload-text">点击上传证明材料</div>
              </div>
            </van-uploader>
          </div>
          <div class="upload-item">
            <van-uploader v-model="files4" :max-count="1" :preview-image="true" :after-read="afterRead">
              <div class="upload-box">
                <van-icon name="plus" size="40" color="#999" />
                <div class="upload-text">点击上传证明材料</div>
              </div>
            </van-uploader>
          </div>
        </div>

        <div class="submit-row">
          <van-button type="primary" block color="var(--blue-deep)" @click="handleSubmit">
            立即提交
          </van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { showToast, showLoadingToast, closeToast } from 'vant'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { rescueApply, uploadFile, getSolutionIndex } from '@/api/solution'

const router = useRouter()
const userStore = useUserStore()

// 页面加载时检查状态
onMounted(async () => {
  const toast = showLoadingToast({
    message: '加载中...',
    forbidClick: true,
    duration: 0
  })

  try {
    const res = await getSolutionIndex()
    toast.close()
    
    if (res && res.code === 200) {
      const status = res.data?.rescueApplyStatus
      // rescueApplyStatus: -1待提交 0待审核 1审核通过 2审核失败
      // 如果是0或1返回到服务界面
      if (status === 0 || status === 1) {
        showToast(status === 0 ? '已申请，等待审核' : '已申请，审核通过')
        // 使用 replace 防止用户点返回键再次进入
        router.replace({ name: 'service' })
      }
    } else {
      // 获取状态失败，可以选择提示或者不处理（默认允许填表）
      // showToast(res?.msg || '获取状态失败')
    }
  } catch (error) {
    // 必须手动关闭，因为 catch 会捕获包括 toast.close() 之前抛出的错误
    toast.close()
    console.error(error)
    showToast('网络请求失败')
  }
})

const files1 = ref([])
const files2 = ref([])
const files3 = ref([])
const files4 = ref([])

const form = ref({
  realName: '',
  idNumber: '',
  phonenumber: '',
  address: '',
  consumerId: userStore.userInfo?.id || 0,
  isParticipateChecked: true,
  liability: null,
  materialFile: '',
  monthIncome: null,
  population: null
})

const consumerId = computed(() => userStore.userInfo?.id || 0)

const afterRead = async (file, detail) => {
  // van-uploader default behavior: file.status = 'uploading'
  file.status = 'uploading'
  file.message = '上传中...'

  try {
    const res = await uploadFile(file.file)
    if (res && res.code === 200) {
      file.status = 'done'
      file.message = '上传成功'
      // Store the server file path/name needed for submission
      // Based on user input: "显示图片用fileName" (e.g. /upload/image/...)
      // And we might need to display it using the full URL for preview if not already handled by local blob
      // van-uploader uses file.content (base64) or file.url for preview.
      // We'll attach the server response fileName to the file object for later submission.
      file.serverFileName = res.fileName
      // Optionally update the preview url to the remote one if needed, but local preview is faster.
      // file.url = res.url 
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

const buildMaterialFile = () => {
  // Collect all successfully uploaded files' server paths
  const allFiles = [...files1.value, ...files2.value, ...files3.value, ...files4.value]
  const validFiles = allFiles
    .filter(f => f.status === 'done' && f.serverFileName)
    .map(f => f.serverFileName)
  
  return validFiles.join(',')
}

const handleSubmit = async () => {
  if (!form.value.realName) return showToast('请输入真实姓名')
  if (!form.value.idNumber) return showToast('请输入身份证号')
  if (!form.value.phonenumber) return showToast('请输入联系电话')
  if (!form.value.address) return showToast('请输入地址')

  const toast = showLoadingToast({
    message: '提交中...',
    forbidClick: true,
    duration: 0
  })

  try {
    const materialFile = buildMaterialFile()
    const payload = {
      address: form.value.address,
      consumerId: consumerId.value,
      idNumber: form.value.idNumber,
      isParticipate: form.value.isParticipateChecked ? 1 : 0,
      liability: form.value.liability ? Number(form.value.liability) : 0,
      materialFile,
      monthIncome: form.value.monthIncome ? Number(form.value.monthIncome) : 0,
      phonenumber: form.value.phonenumber,
      population: form.value.population ? parseInt(form.value.population) : 0,
      realName: form.value.realName
    }
    const res = await rescueApply(payload)
    toast.close()
    if (res && res.code === 200) {
      showToast(res.msg || '提交成功')
      setTimeout(() => {
        router.replace({ name: 'service' })
      }, 1500)
    } else {
      showToast(res?.msg || '提交失败')
    }
  } catch (e) {
    console.error(e)
    toast.close()
    showToast('提交失败，请稍后重试')
  }
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding-bottom: 80px;
}

.custom-header {
  height: 220px;
  background: var(--blue-gradient);
  position: relative;
  overflow: hidden;
}

.nav-bar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  background: transparent !important;
  z-index: 10;
}

:deep(.van-nav-bar__title) {
  color: #fff !important;
}

:deep(.van-nav-bar .van-icon) {
  color: #fff !important;
}

:deep(.van-nav-bar__text) {
  color: #fff !important;
}

.content {
  padding: 0 16px;
  margin-top: -160px;
  position: relative;
  z-index: 1;
}

.card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.card-title {
  color: var(--blue-deep);
  font-weight: bold;
  font-size: 16px;
  text-align: center;
  margin-bottom: 10px;
  line-height: 1.5;
}

.subtitle {
  font-size: 14px;
  font-weight: normal;
}

.card-content {
  font-size: 14px;
  color: #333;
  line-height: 1.6;
  text-align: justify;
}

/* Rules Section Styles */
.rules-content {
  font-size: 14px;
  color: #333;
}

.rule-section {
  margin-bottom: 15px;
}

.rule-header {
  font-weight: bold;
  color: var(--blue-deep);
  margin-bottom: 8px;
  display: flex;
  align-items: center;
}

.rule-header .badge {
  background: var(--blue-deep);
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  font-size: 12px;
}

.rule-note {
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
  padding-left: 5px;
}

.rules-content ol {
  padding-left: 20px;
  font-size: 13px;
  color: #333;
  margin: 0;
}

.rules-content li {
  margin-bottom: 10px;
  line-height: 1.5;
}

.rule-footer {
  font-size: 12px;
  color: #999;
  margin-top: 10px;
  line-height: 1.5;
  background: #f9f9f9;
  padding: 8px;
  border-radius: 4px;
}

/* Form Styles */
.form-title {
  font-size: 16px;
  font-weight: bold;
  color: var(--blue-deep);
  margin-bottom: 16px;
  text-align: center;
}

.form-grid {
  display: flex;
  flex-direction: column;
  gap: 0; /* van-field has its own padding/border */
}

.field-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  background: #fff;
  border-bottom: 1px solid #ebedf0;
}

.field-label {
  font-size: 14px;
  color: #646566;
  width: auto;
  margin-right: 12px;
}

.form-note {
  padding: 10px 16px;
  font-size: 12px;
  color: #333;
  font-weight: bold;
  line-height: 1.5;
}

/* Upload Styles */
.upload-title {
  font-size: 14px;
  font-weight: bold;
  margin: 16px 0 12px;
  color: #333;
}

.upload-grid {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.upload-item {
  width: 100%;
}

.upload-box {
  width: 100%;
  height: 120px;
  border: 1px dashed var(--blue-deep);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #fff;
}

.upload-text {
  font-size: 14px;
  color: #999;
  margin-top: 8px;
}

:deep(.van-uploader) {
  width: 100%;
  display: block;
}

:deep(.van-uploader__wrapper) {
  width: 100%;
  display: block;
}

:deep(.van-uploader__input-wrapper) {
  width: 100%;
  display: block;
}

:deep(.van-uploader__preview) {
  margin: 0;
  width: 100%;
}

:deep(.van-uploader__preview-image) {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
}

.submit-row {
  margin-top: 24px;
}
</style>
