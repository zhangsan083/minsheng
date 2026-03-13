<template>
  <div class="page">
    <div class="header-bg">
      <van-nav-bar
        title="惠民宝理财服务用户协议"
        left-arrow
        @click-left="onClickLeft"
        :border="false"
        class="nav-bar"
      />
    </div>
    
    <div class="content-wrapper">
      <div class="content-card">
        <div class="content">
          <p>欢迎使用民生资产APP“惠民宝”理财服务（以下简称“本服务”）！</p>
          <p>本协议明确了您与平台之间的权利义务关系，包括参与资格、收益规则、分配方式及双方责任等内容。您通过实名认证并同意本协议，即视为已充分知悉并自愿接受其约束。民生宝致力于为您提供安全、透明的理财服务，如有疑问，可随时联系平台客服咨询。</p>
          <p>为保障您的权益，请在参与前仔细阅读并充分理解本协议的全部条款。</p>
          
          <h3>第一条 用户参与资格</h3>
          <p>1. 实名认证要求：用户需完成民生资产APP账户的实名认证及身份认证，确保姓名、身份证号等个人信息真实、完整、有效。</p>
          <p>2. 行为能力要求：参与用户须为年满18周岁、具备完全民事行为能力的自然人，且承诺已充分理解本协议及活动规则。</p>
          
          <h3>第二条 服务内容与收益规则</h3>
          <p>1. 补贴金获取方式：</p>
          <p>• 每日签到：用户可通过APP每日签到获取固定额度补贴金。</p>
          <p>• 邀请好友：成功邀请新用户注册并完成首存，邀请人可获得额外补贴金奖励。</p>
          <p>2. 理财计划说明：</p>
          <p>平台提供的定期定额理财计划，期限分为180天、240天、365天，对应日收益率以APP实时展示为准。</p>
          <p><strong>风险提示：</strong>理财收益受市场影响，历史收益不代表未来表现，用户需自行承担投资风险。</p>
          
          <h3>第三条 收益计算与发放</h3>
          <p>1. 收益公式：</p>
          <p>• 日收益 = 存入本金 × 日利率（示例：10,000元×0.012%=1.2元/日）。</p>
          <p>• 期期总收益 = 存入本金 +（日收益 × 存期天数）（示例：10,000元+1.2元×120=12160元）。</p>
          <p>2. 发放规则：</p>
          <p>• 到期收益：到期收益于存入期限结束后一次性发放至用户账户，不可提前赎回。</p>
          
          <h3>第四条 用户权利与义务</h3>
          <p>1. 用户权利：</p>
          <p>• 按时获取补贴金及投资收益，并可通过APP实时查询待合计息、预期收益及到期日。</p>
          <p>• 按约定规则提前退出投资，并要求平台在法定期限内响应。</p>
          <p>2. 用户义务：</p>
          <p>• 禁止行为：不得利用本服务从事洗钱、诈骗等非法活动，或通过过度交易等手段获取补贴金，违规者平台有权终止服务、追回收益并移交司法机关。</p>
          <p>• 信息真实：用户需确保提供的身份及银行账户信息真实有效，因信息错误等导致的损失由用户自行承担。</p>
          
          <h3>第五条 协议调整与解释权</h3>
          <p>1. 调整情形：如因法律法规修订、政策调整或不可抗力（如自然灾害、系统故障），平台可单方修改协议内容，并通过民生资产APP公告或在线客服通知用户。</p>
          <p>2. 解释权归属：本协议最终解释权归民生资产APP所有。</p>
          
          <h3>第六条 法律适用与争议解决</h3>
          <p>1. 适用法律：本协议效力、履行及争议解决均适用中华人民共和国大陆地区法律。</p>
          <p>2. 争议处理：争议应优先通过友好协商解决；协商未果，任何一方可向被告所在地有管辖权的人民法院提起诉讼。</p>
          <p>3. 用户确认：本人声明已完整阅读、理解并接受本协议全部条款，自愿承担投资风险，且未受任何诱导或误导。</p>
          
          <h3>附则</h3>
          <p>• 本协议自用户同意之日起生效，长期有效至服务终止。</p>
          <p>• 客服渠道：民生资产APP内“在线客服”</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const onClickLeft = () => {
  router.back()
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background-color: #f7f8fa;
  display: flex;
  flex-direction: column;
}

.header-bg {
  background: linear-gradient(180deg, var(--blue-deep) 0%, var(--blue-deep) 70%, #f7f8fa 70%);
  height: 315px;
}

.nav-bar {
  background: transparent;
  --van-nav-bar-title-text-color: #fff;
  --van-nav-bar-icon-color: #fff;
}

.content-wrapper {
  flex: 1;
  padding: 0 16px 16px;
  margin-top: -235px;
  display: flex;
  flex-direction: column;
}

.content-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 24px 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  flex: 1;
  overflow-y: auto;
}

.content {
  font-size: 14px;
  line-height: 1.8;
  color: #333;
  white-space: pre-wrap; /* 保留换行符 */
}

.content h3 {
  font-size: 16px;
  font-weight: bold;
  margin: 24px 0 16px;
  color: #333;
}

.content p {
  margin-bottom: 16px;
}

.content strong {
  font-weight: bold;
}

.content ul {
  margin: 16px 0;
  padding-left: 24px;
}

.content li {
  margin-bottom: 8px;
}
</style>