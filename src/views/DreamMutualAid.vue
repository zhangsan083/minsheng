<template>
  <div class="page">
    <div class="header">
      <van-nav-bar
        title="“追梦人”互助计划"
        left-arrow
        @click-left="$router.back()"
        :border="false"
        class="nav-bar"
      />
    </div>

    <div class="content">
      <div class="section-title">专属帮扶通道</div>
      
      <div class="info-card">
        <div class="letter-content">
          <p class="salute">致民生资产全体用户：</p>
          <p class="text-indent">
            民生资产始终与您携手同行！为响应国家“共同富裕”政策号召，民生资产运营中心联合内测首批受益用户发起本计划，旨在通过社群互助机制传递温暖，通过“用户帮用户”的方式，为暂时遇到困难的用户提供阶段性资金支持，助力共同富裕目标实现，让温暖在社群中传递。
          </p>
          
          <div class="point-title">
            <span class="point-title-chip" data-index="1">计划亮点</span>
          </div>
          <p class="text-indent">
            <strong>资金透明：</strong>帮扶款全部来源于内测阶段成功兑付用户的自愿捐赠，平台全程监管并定期公示流向。
          </p>
          <p class="text-indent">
            <strong>精准帮扶：</strong>优先覆盖生活困难或急需资金的活跃用户（审批金额100元-50,000元）。
          </p>
          <p class="text-indent">
            <strong>双向成长：</strong>既解决受助者燃眉之急，也让捐助者践行社会责任。
          </p>

          <div class="point-title">
            <span class="point-title-chip" data-index="2">参与条件</span>
          </div>
          <p class="text-indent">
            <strong>基础认证：</strong>姓名、手机号、身份证号（加密存储，仅用于风控审核）
          </p>
          <p class="text-indent">
            <strong>社群共建：</strong>需加入民生资产会聊官方群，并积极参与每次会议学习（直播/回放均可）以及进行资产备案登记。
          </p>
          <p class="text-indent">
            想优先获得帮扶资金的用户需加入民生资产【会聊官方群】，并积极参与官方会议和回放，依据参与程度和平台活跃度分配帮扶名额。此外，用户还需要进行资产备案登记，以确保符合帮扶要求。民生资产的意义远不止于技术—它是无数追梦人携手共建的信任桥梁。
          </p>
          <p class="text-indent">
            每一份微小善意的叠加，都能让财富流动成为照亮他人的光。您的每一分助力，都可能点燃一个尚未获得资产者的希望，我们的每一次共享，都在为“共同富裕”铺就一块基石。财富因流动而增值，善意因传递而永恒。
          </p>
          <p class="text-indent">
            “点滴微光，终成星河”——这不仅是平台的使命，更是我们共同书写的未来。
          </p>
        </div>
      </div>

      <div class="form-card">
        <div class="form-title">信息填写</div>
        <van-form @submit="onSubmit">
          <van-field
            v-model="form.name"
            label="姓　　名："
            placeholder="请输入您的真实姓名"
            input-align="right"
            :border="false"
            :disabled="hasApplied && reviewStatus !== '2'"
            class="form-item"
          />
          <div class="divider"></div>
          <van-field
            v-model="form.phone"
            label="手机号码："
            placeholder="请输入您的手机号码"
            input-align="right"
            type="tel"
            :border="false"
            :disabled="hasApplied && reviewStatus !== '2'"
            class="form-item"
          />
          <div class="divider"></div>
          <van-field
            v-model="form.idCard"
            label="身份证号："
            placeholder="请输入您的身份证号码"
            input-align="right"
            :border="false"
            :disabled="hasApplied && reviewStatus !== '2'"
            class="form-item"
          />
          <div class="divider"></div>
          
          <!-- 帮扶金额显示，仅当审核通过时显示 -->
          <div v-if="hasApplied && reviewStatus === '1'" class="form-item">
            <div class="form-label">帮扶金额：</div>
            <div class="form-value">{{ amount || 0 }} 元</div>
          </div>
          <div v-if="hasApplied && reviewStatus === '1'" class="divider"></div>

          <div class="upload-grid">
            <div class="upload-item">
              <van-uploader
                v-model="fileList1"
                max-count="1"
                :after-read="afterRead"
                :disabled="hasApplied && reviewStatus !== '2'"
                :deletable="!hasApplied || reviewStatus === '2'"
              >
                <div class="upload-box">
                  <van-icon name="plus" class="upload-icon" />
                  <div class="upload-text">点击添加身份证正面照</div>
                </div>
              </van-uploader>
            </div>
            <div class="upload-item">
              <van-uploader
                v-model="fileList2"
                max-count="1"
                :after-read="afterRead"
                :disabled="hasApplied && reviewStatus !== '2'"
                :deletable="!hasApplied || reviewStatus === '2'"
              >
                <div class="upload-box">
                  <van-icon name="plus" class="upload-icon" />
                  <div class="upload-text">点击添加身份证背面照</div>
                </div>
              </van-uploader>
            </div>
            <div class="upload-item">
              <van-uploader
                v-model="fileList3"
                max-count="1"
                :after-read="afterRead"
                :disabled="hasApplied && reviewStatus !== '2'"
                :deletable="!hasApplied || reviewStatus === '2'"
              >
                <div class="upload-box">
                  <van-icon name="plus" class="upload-icon" />
                  <div class="upload-text">上传参加官方会议截图</div>
                </div>
              </van-uploader>
            </div>
            <div class="upload-item">
              <van-uploader
                v-model="fileList4"
                max-count="1"
                :after-read="afterRead"
                :disabled="hasApplied && reviewStatus !== '2'"
                :deletable="!hasApplied || reviewStatus === '2'"
              >
                <div class="upload-box">
                  <van-icon name="plus" class="upload-icon" />
                  <div class="upload-text">上传资产备案登记截图</div>
                </div>
              </van-uploader>
            </div>
            <div class="upload-item">
              <van-uploader
                v-model="fileList5"
                max-count="1"
                :after-read="afterRead"
                :disabled="hasApplied && reviewStatus !== '2'"
                :deletable="!hasApplied || reviewStatus === '2'"
              >
                <div class="upload-box">
                  <van-icon name="plus" class="upload-icon" />
                  <div class="upload-text">上传加入会聊官方群截图</div>
                </div>
              </van-uploader>
            </div>
          </div>

          <div class="submit-btn-wrapper">
            <van-button 
              round 
              block 
              type="primary" 
              native-type="submit" 
              class="submit-btn"
              :disabled="hasApplied && reviewStatus !== '2'"
            >
              {{ hasApplied ? (reviewStatus && reviewStatus !== '2' ? getStatusText(reviewStatus) : '重新提交审核') : '提交审核' }}
            </van-button>
          </div>
        </van-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { uploadFile, addAssistanceApply, getAssistanceApplyDetail } from '@/api/assets'

const router = useRouter()

const form = ref({
  name: '',
  phone: '',
  idCard: ''
})

const fileList1 = ref([]) // 身份证正面
const fileList2 = ref([]) // 身份证背面
const fileList3 = ref([]) // 参加官方会议截图
const fileList4 = ref([]) // 资产备案登记截图
const fileList5 = ref([]) // 加入会聊官方群截图

const hasApplied = ref(false)
const reviewStatus = ref('')
const amount = ref(0) // 帮扶金额

const getStatusText = (status) => {
  const statusMap = {
    '0': '待审核',
    '1': '审核通过',
    '2': '审核驳回'
  }
  return statusMap[status] || '未知状态'
}

const loadApplyDetail = async () => {
  try {
    const res = await getAssistanceApplyDetail()
    if (res.code === 200 && res.data) {
      hasApplied.value = true
      reviewStatus.value = res.data.reviewStatus || ''
      amount.value = res.data.amount || 0 // 获取帮扶金额
      // 可以在这里填充表单数据，以便用户查看
      form.value.name = res.data.realName || ''
      form.value.phone = res.data.phonenumber || ''
      form.value.idCard = res.data.idNumber || ''
      
      // 只有当审核状态不是驳回时，才填充图片数据
      if (reviewStatus.value !== '2') {
        // 填充图片数据
        if (res.data.idFrontImg) {
          fileList1.value = [{
            url: res.data.idFrontImg,
            status: 'done',
            serverFileName: res.data.idFrontImg
          }]
        }
        if (res.data.idBackImg) {
          fileList2.value = [{
            url: res.data.idBackImg,
            status: 'done',
            serverFileName: res.data.idBackImg
          }]
        }
        if (res.data.meetingImg) {
          fileList3.value = [{
            url: res.data.meetingImg,
            status: 'done',
            serverFileName: res.data.meetingImg
          }]
        }
        if (res.data.assetImg) {
          fileList4.value = [{
            url: res.data.assetImg,
            status: 'done',
            serverFileName: res.data.assetImg
          }]
        }
        if (res.data.groupImg) {
          fileList5.value = [{
            url: res.data.groupImg,
            status: 'done',
            serverFileName: res.data.groupImg
          }]
        }
      }
    }
  } catch (error) {
    console.error('Failed to load apply detail:', error)
  }
}

const afterRead = async (file) => {
  file.status = 'uploading'
  file.message = '上传中...'

  try {
    const res = await uploadFile(file.file)
    if (res && res.code === 200) {
      file.status = 'done'
      file.message = '上传成功'
      file.serverFileName = res.fileName
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

const onSubmit = async () => {
  if (!form.value.name) return showToast('请输入姓名')
  if (!form.value.phone) return showToast('请输入手机号码')
  if (!form.value.idCard) return showToast('请输入身份证号')
  
  // 检查是否所有图片都已上传成功
  const checkFiles = (files, name) => {
    if (files.length === 0) {
      showToast(`请上传${name}`)
      return false
    }
    if (files[0].status !== 'done') {
      showToast(`${name}上传失败，请重新上传`)
      return false
    }
    return true
  }
  
  if (!checkFiles(fileList1.value, '身份证正面照')) return
  if (!checkFiles(fileList2.value, '身份证背面照')) return
  if (!checkFiles(fileList3.value, '参加官方会议截图')) return
  if (!checkFiles(fileList4.value, '资产备案登记截图')) return
  if (!checkFiles(fileList5.value, '加入会聊官方群截图')) return
  
  // 构建请求参数
  const params = {
    realName: form.value.name,
    phonenumber: form.value.phone,
    idNumber: form.value.idCard,
    idFrontImg: fileList1.value[0].serverFileName,
    idBackImg: fileList2.value[0].serverFileName,
    meetingImg: fileList3.value[0].serverFileName,
    assetImg: fileList4.value[0].serverFileName,
    groupImg: fileList5.value[0].serverFileName
  }
  
  try {
    const res = await addAssistanceApply(params)
    if (res.code === 200) {
      showToast('提交申请成功')
      hasApplied.value = true
      reviewStatus.value = '0'
      // 返回上一页
      setTimeout(() => {
        router.back()
      }, 1500)
    } else {
      showToast(res.msg || '提交失败')
    }
  } catch (error) {
    console.error('Submit failed:', error)
    showToast('提交失败，请稍后重试')
  }
}

onMounted(() => {
  loadApplyDetail()
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding-bottom: 60px;
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
}

.section-title {
  margin: 0 auto -18px;
  width: 160px;
  height: 34px;
  background: url('@/assets/战略/标题.png') no-repeat center;
  background-size: 100% 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 800;
  font-size: 20px;
  position: relative;
  z-index: 2;
}

.info-card {
  background: #fff;
  border-radius: 12px;
  padding: 30px 16px 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 16px;
}

.letter-content {
  font-size: var(--font-size-base);
  color: #333;
  line-height: 2.0;
  text-align: justify;
}

.salute {
  font-weight: bold;
  margin-bottom: 8px;
}

.text-indent {
  text-indent: 2em;
  margin-bottom: 8px;
}

.point-title {
  display: flex;
  align-items: center;
  margin: 16px 0 8px;
  font-weight: bold;
  gap: 8px;
}

.point-title-chip {
  display: inline-block;
  height: 30px;
  line-height: 24px;
  padding: 3px 45px 3px 35px;
  color: #fff;
  font-weight: 700;
  background: url('@/assets/民生保障补助金/未标题-1.png') no-repeat center;
  background-size: 100% 100%;
  border-radius: 999px;
  position: relative;
  font-size: 16px;
}

.point-title-chip::before {
  content: attr(data-index);
  position: absolute;
  left: 11px;
  top: 50%;
  transform: translateY(-50%);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
}

.form-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.form-title {
  font-size: var(--font-size-large);
  font-weight: bold;
  color: var(--blue-deep);
  margin-bottom: 16px;
  border-left: 4px solid var(--blue-deep);
  padding-left: 8px;
}

.form-item {
  padding: 8px 0;
}

.form-label {
  width: 100px;
  color: #333;
  font-weight: 500;
  font-size: var(--font-size-base);
  display: inline-block;
}

.form-value {
  color: #c8c9cc;
  font-weight: 500;
  font-size: var(--font-size-xs);
  float: right;
}

.divider {
  height: 1px;
  background: #eee;
  border-bottom: 1px dashed #ddd;
  margin: 0 0 8px;
}

:deep(.van-field__label) {
  width: 100px;
  color: #333;
  font-weight: 500;
  font-size: var(--font-size-base);
}

.upload-grid {
  display: grid;
  grid-template-columns: 160px 160px;
  gap: 12px;
  margin-top: 16px;
}

.upload-item:last-child {
  grid-column: span 2;
  width: 160px;
  justify-self: start;
}

.upload-box {
  width: 160px;
  height: 100px;
  border: 1px dashed #2b7afb;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f7fbff;
}

.upload-grid :deep(.van-uploader) {
  width: 160px;
}

/* 调整默认预览图片尺寸与样式为 160x100，圆角且裁剪填充 */
:deep(.van-uploader__preview) {
  width: 160px;
  height: 100px;
  margin: 0;
  border: 1px dashed #2b7afb;
  border-radius: 16px;
  overflow: hidden;
}
:deep(.van-uploader__preview-image) {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
/* 调整删除按钮位置到容器内部可见区域 */
:deep(.van-uploader__preview-delete) {
  top: 6px;
  right: 6px;
  transform: none;
}
:deep(.van-uploader__preview-delete .van-icon) {
  font-size: 14px;
}

.upload-icon {
  font-size: 22px;
  color: #2b7afb;
  background: #eaf2ff;
  border: 1px solid #cfe0ff;
  border-radius: 50%;
  padding: 6px;
  margin-bottom: 8px;
}

.upload-text {
  font-size: var(--font-size-xs);
  color: #999;
  text-align: center;
  width:150px;
}

.submit-btn-wrapper {
  margin-top: 24px;
  padding: 0 16px;
}

.submit-btn {
  background: var(--blue-gradient);
  border: none;
  font-weight: bold;
  font-size: var(--font-size-base);
  height: var(--button-normal-height);
  box-shadow: 0 4px 12px rgba(9, 68, 252, 0.3);
}
</style>
