<template>
  <div class="page">
    <div class="header-bg">
      <van-nav-bar
        :title="certTitle"
        left-arrow
        :border="false"
        @click-left="$router.back()"
        class="nav-bar"
      />
    </div>

    <div class="content">
      <div class="cert-card" :style="{ backgroundImage: `url(${certBgImage})` }">
        <div class="cert-inner-content" :class="{ 'cert-inner-content--priority': certType === '2', 'cert-inner-content--asset': certType === '1' }">
          <div class="cert-row cert-row--no" :class="{ 'cert-row--no-priority': certType === '2', 'cert-row--no-asset': certType === '1' }">
            <span>资产编号：</span>
            <span>{{ detail.certNum || 'XXXXXXXXXXX' }}</span>
          </div>
          
          <div class="cert-title-priority" v-if="certType === '2'">优先下款资格证书</div>
          <div class="cert-title-asset" v-if="certType === '1'">民生资产认领证书</div>

          <template v-if="certType === '1'">
            <div class="cert-content-asset">
              <div class="asset-info-row">
                <span class="asset-label">申请人：</span>
                <span class="asset-value">{{ detail.realName || '——' }}</span>
              </div>
              <div class="asset-info-row">
                <span class="asset-label">证件号码：</span>
                <span class="asset-value">{{ detail.idNumber || '——' }}</span>
              </div>
              <div class="asset-info-row">
                <span class="asset-label">资产类型：</span>
                <span class="asset-value">{{ detail.assetType || '——' }}</span>
              </div>
              <div class="asset-info-row">
                <span class="asset-label">资产金额：</span>
                <span class="asset-value">{{ formatAmount(detail.amount) }}</span>
              </div>
              <div class="asset-info-row">
                <span class="asset-label">认领日期：</span>
                <span class="asset-value">{{ dateText }}</span>
              </div>
            </div>
          </template>

          <template v-else>
            <div class="cert-content-priority">
              <div class="priority-award-row">
                <span class="priority-label">特此颁发</span>
                <span class="priority-name">{{ detail.realName || '王某某' }}</span>
              </div>
              <div class="priority-text">
                持证人凭此证书，将享有民生资产专项资金的优先下款资格，助力实现共同富裕的美好愿景
              </div>
            </div>
          </template>

          <div class="cert-footer" :class="{ 'cert-footer-priority': certType === '2', 'cert-footer-asset': certType === '1' }">
            <div class="cert-company">民生资产</div>
            <div class="cert-date">{{ issueDateOnly }}</div>
            <img :src="sealImg" class="cert-seal" alt="seal" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { showToast } from 'vant'
import { getCertDetail } from '@/api/assets'
import sealImg from '@/assets/images/seal.png'
import bgAsset from '@/assets/确权证书/民生资产认领证书.png'
import bgPriority from '@/assets/确权证书/优先下款资格证书.png'

const route = useRoute()

const detail = ref({})

const certType = computed(() => {
  if (detail.value.certType) return detail.value.certType
  if (route.query.certType) return String(route.query.certType)
  return '1'
})

const certBgImage = computed(() => {
  return certType.value === '2' ? bgPriority : bgAsset
})

const certTitle = computed(() => {
  return detail.value.certTypeLabel || (certType.value === '2' ? '优先下款资格证书' : '民生资产认领证书')
})

const issueDateOnly = computed(() => {
  const dt = detail.value.issueDt || detail.value.createDt
  if (!dt) return ''
  return String(dt).split(' ')[0]
})

const dateText = computed(() => {
  const dt = detail.value.issueDt || detail.value.createDt
  return dt || ''
})

const formatAmount = value => {
  if (!value) return ''
  const num = Number(value)
  if (Number.isNaN(num)) return String(value)
  return num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' 元整'
}

const loadDetail = async () => {
  const id = route.query.id || route.params.id
  if (!id) {
    showToast('证书信息缺失')
    return
  }
  try {
    const res = await getCertDetail(id)
    if (res.code === 200 && res.data) {
      detail.value = res.data
    } else {
      showToast(res.msg || '获取证书详情失败')
    }
  } catch (error) {
    showToast('获取证书详情失败，请稍后重试')
  }
}

onMounted(() => {
  loadDetail()
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  background-color: #f7f8fa;
}

.header-bg {
  height: 220px;
  background: var(--blue-gradient);
  position: relative;
}

.nav-bar {
  background: transparent;
  --van-nav-bar-title-text-color: #ffffff;
  --van-nav-bar-icon-color: #ffffff;
  border-bottom: none;
}

.content {
  padding: 0 16px;
  margin-top: -160px;
  position: relative;
  z-index: 1;
}

.cert-card {
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  overflow: hidden;
  min-height: 480px; /* Adjust based on image aspect ratio */
}

.cert-inner-content {
  padding: 100px 30px 40px; /* Adjust top padding to push content down below header */
  /* height: 100%; */
  display: flex;
  flex-direction: column;
}

.cert-title-spacer {
  height: 60px; /* Space for the title if it's on the background image */
}

.cert-row {
  display: flex;
  justify-content: space-between;
  font-size: 15px;
  color: #333;
  margin-bottom: 12px;
  font-weight: 500;
}

.cert-row--no {
  margin-bottom: 20px;
  font-size: 12px;
  color: #666;
  position: absolute;
  top: 20px;
  right: 20px;
}

.cert-row--name {
  margin-bottom: 24px;
  font-size: 18px;
  justify-content: flex-start;
}

.cert-name {
  margin-left: 12px;
  font-weight: bold;
  font-size: 20px;
}

.cert-text {
  font-size: 14px;
  color: #555;
  line-height: 1.8;
  margin-bottom: 40px;
  text-align: justify;
  text-indent: 2em;
}

.cert-footer {
  margin-top: auto;
  text-align: right;
  position: relative;
  padding-right: 10px;
  padding-bottom: 20px;
}

.cert-company {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
  position: relative;
  z-index: 2;
}

.cert-date {
  font-size: 14px;
  color: #666;
  position: relative;
  z-index: 2;
}

.cert-seal {
  position: absolute;
  right: -10px;
  bottom: -20px;
  width: 120px;
  height: 120px;
  opacity: 0.9;
  z-index: 1;
  transform: rotate(-15deg);
  pointer-events: none;
}

/* Asset Certificate Styles */
.cert-inner-content--asset {
  padding: 75px 40px 40px;
}

.cert-row--no-asset {
  top: 50px;
  left: 40px;
  right: auto;
  font-size: 13px;
  color: #666;
}

.cert-title-asset {
  font-size: 26px;
  font-weight: bold;
  color: #a67c33;
  text-align: center;
  margin-bottom: 40px;
  letter-spacing: 4px;
  text-shadow: 0 1px 1px rgba(0,0,0,0.1);
}

.cert-content-asset {
  padding: 0 10px;
}

.asset-info-row {
  display: flex;
  margin-bottom: 16px;
  font-size: 16px;
  color: #333;
  line-height: 1.6;
}

.asset-label {
  color: #666;
  white-space: nowrap;
  font-weight: 500;
}

.asset-value {
  color: #333;
  margin-left: 5px;
  word-break: break-all;
  font-weight: 500;
}

.cert-footer-asset {
  padding-right: 20px;
  padding-bottom: 30px;
}

/* Priority Certificate Styles */
.cert-inner-content--priority {
  padding: 80px 40px 60px;
  text-align: center;
}

.cert-row--no-priority {
  top: 60px;
  left: 50px;
  right: auto;
  font-size: 13px;
  color: #666;
}

.cert-title-priority {
  font-size: 26px;
  font-weight: bold;
  color: #5d4037;
  margin-bottom: 50px;
  letter-spacing: 2px;
}

.priority-award-row {
  text-align: left;
  margin-bottom: 40px;
  font-size: 18px;
  color: #333;
  padding-left: 10px;
  display: flex;
  align-items: center;
}

.priority-name {
  font-size: 22px;
  font-weight: bold;
  border-bottom: 1px solid #333;
  padding: 0 10px;
  margin-left: 10px;
  min-width: 100px;
  text-align: center;
}

.priority-text {
  text-align: justify;
  font-size: 16px;
  line-height: 2;
  color: #555;
  text-indent: 2em;
  margin-bottom: 40px;
}

.cert-footer-priority {
  padding-right: 20px;
  padding-bottom: 40px;
}
</style>

