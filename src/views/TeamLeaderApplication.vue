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
            <div class="upload-box">
              <div class="upload-icon">+</div>
              <div class="upload-text">点击上传身份证</div>
            </div>
          </div>

          <!-- 个人签名和公章 -->
          <div class="signature-seal-section">
            <!-- 个人签名 -->
            <div class="signature-box" @click="openSignaturePopup">
              <div class="signature-label">(个人签名)</div>
              <div class="signature-area">点击签名</div>
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
        <button class="submit-btn">提交申请</button>
      </div>

      <!-- 签名弹窗 -->
      <van-popup v-model:show="signaturePopup" position="bottom" round style="height: 65%;">
        <div class="signature-popup-content">
          <div class="signature-popup-title">我的签名</div>
          <div class="signature-area1">
            <div class="signature-hint">手写签名</div>
          </div>
          <button class="complete-btn" @click="completeSignature">完成签署</button>
        </div>
      </van-popup>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { NavBar, Popup } from 'vant'

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

// 打开签名弹窗
const openSignaturePopup = () => {
  signaturePopup.value = true
}

// 完成签名
const completeSignature = () => {
  signaturePopup.value = false
  // 这里可以添加签名保存逻辑
}

// 返回上一页
const goBack = () => {
  router.back()
}
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
  color: #0066ff;
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
  justify-content: center;
  margin: 30px 0;
  padding: 0 10px;
}

.upload-box {
  width: 100%;
  height: 150px;
  border: 2px dashed #0066ff;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
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
  margin-top: 25px;
  font-weight: bold;
}

.signature-area {
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
.signature-area1 {
  flex: 1;
  width: 100%;
  background: #f9f9f9;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}
.signature-hint {
  font-size: 16px;
  color: #999;
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
  margin-bottom: 20px;
}
</style>