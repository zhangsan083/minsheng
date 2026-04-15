<template>
  <div class="page">
    <div class="header-bg">
      <van-nav-bar
        title="收款账户"
        left-arrow
        @click-left="$router.back()"
        :border="false"
        class="nav-bar"
      />
    </div>

    <div class="content">
      <!-- 添加账户入口（同一行显示，总数未满5个时显示） -->
      <div class="add-row" v-if="accountList.length < 5">
        <div class="add-item" @click="goBindAlipay">
          <img :src="iconAlipayDecor" class="add-item-icon" alt="支付宝" />
          <span class="add-item-text">支付宝</span>
        </div>
        <div class="add-item" @click="goBindBankCard">
          <img :src="iconUnionPayBind" class="add-item-icon" alt="银行卡" />
          <span class="add-item-text">银行卡</span>
        </div>
        <div class="add-item" @click="goBindWechat">
          <van-icon name="chat-o" size="32" color="#07c160" />
          <span class="add-item-text">微信</span>
        </div>
      </div>
      <!-- 账户总数提示 -->
      <div class="account-count" v-if="accountList.length > 0">
        已绑定 {{ accountList.length }}/5 个账户
      </div>

      <!-- 已绑定的账户列表 -->
      <div 
        v-for="account in accountList" 
        :key="account.id"
        class="card"
        :class="getCardClass(account)"
      >
        <div class="card-header">
          <span class="card-title">
            {{ getTypeName(account) }}
            <van-tag v-if="account.isDefault === 1" type="primary" round size="medium">默认</van-tag>
          </span>
          <div class="card-header-actions">
            <div class="default-btn" v-if="account.isDefault !== 1" @click.stop="handleSetDefault(account)">设为默认</div>
            <div class="delete-btn" @click.stop="handleDelete(account)">
              <van-icon name="delete-o" size="18" color="#ee0a24" />
            </div>
          </div>
        </div>
        <div class="card-body">
          <div class="info-row">
            <span class="label">真实姓名：</span>
            <span class="value">{{ account.realName }}</span>
          </div>
          <div class="info-row">
            <span class="label">{{ getAccountLabel(account) }}</span>
            <span class="value">{{ account.accountNum }}</span>
          </div>
        </div>
        <div class="card-action">
          <div class="action-btn" @click.stop="goEdit(account)">
            <van-icon name="arrow" color="#999" />
          </div>
        </div>
        <img v-if="String(account.accountType) === '1'" :src="iconAlipayDecor" class="watermark-img" alt="alipay" />
        <img v-else-if="String(account.accountType) === '0'" :src="iconUnionPayDecor" class="watermark-img" alt="unionpay" />
        <img v-else-if="String(account.accountType) === '3'" :src="iconWeChatDecor" class="watermark-img" alt="wechat" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showLoadingToast, showDialog } from 'vant'
import { getAccountList, removeAccount, setAccountDefault } from '@/api/auth'

// Import assets
import iconAlipayDecor from '@/assets/收款账户/我的账户支付宝装饰.png'
import iconUnionPayDecor from '@/assets/收款账户/我的账户银联装饰.png'
import iconWeChatDecor from '@/assets/收款账户/我的账户微信装饰.png'
import iconUnionPayBind from '@/assets/收款账户/绑定银联.png'

const router = useRouter()
const accountList = ref([])

onMounted(async () => {
  await fetchAccountList()
})

const getTypeName = (account) => {
  const type = String(account.accountType)
  if (type === '1') return '支付宝'
  if (type === '3') return '微信'
  return account.openName || '银行卡'
}

const getAccountLabel = (account) => {
  const type = String(account.accountType)
  if (type === '1') return '支付宝账号：'
  if (type === '3') return '微信号：'
  return '银行卡号：'
}

const getCardClass = (account) => {
  const type = String(account.accountType)
  if (type === '3') return 'wechat-card'
  if (type === '1') return 'alipay-card'
  return 'bank-card'
}

const fetchAccountList = async () => {
  const toast = showLoadingToast({
    message: '加载中...',
    forbidClick: true,
    duration: 0
  })
  
  try {
    const res = await getAccountList()
    toast.close()
    if (res && res.code === 200) {
      accountList.value = res.data || []
    }
  } catch (error) {
    toast.close()
    console.error(error)
    showToast('获取账户信息失败')
  }
}

const goEdit = (account) => {
  const type = String(account.accountType)
  if (type === '1') router.push({ name: 'bind-alipay', query: { id: account.id } })
  else if (type === '3') router.push({ name: 'bind-wechat', query: { id: account.id } })
  else router.push({ name: 'bind-bank-card', query: { id: account.id } })
}

const checkLimit = () => {
  if (accountList.value.length >= 5) {
    showToast('最多添加5个收款账户')
    return false
  }
  return true
}

const goBindAlipay = () => {
  if (checkLimit()) router.push({ name: 'bind-alipay' })
}

const goBindBankCard = () => {
  if (checkLimit()) router.push({ name: 'bind-bank-card' })
}

const goBindWechat = () => {
  if (checkLimit()) router.push({ name: 'bind-wechat' })
}

const handleDelete = (account) => {
  if (!account?.id) return
  const typeName = getTypeName(account)
  showDialog({
    title: '删除确认',
    message: `确定要删除该${typeName}账户吗？`,
    showCancelButton: true,
    confirmButtonColor: '#ee0a24'
  }).then(async () => {
    const toast = showLoadingToast({ message: '删除中...', forbidClick: true, duration: 0 })
    try {
      const res = await removeAccount(account.id)
      toast.close()
      if (res && res.code === 200) {
        showToast('删除成功')
        await fetchAccountList()
      } else {
        showToast(res?.msg || '删除失败')
      }
    } catch (error) {
      toast.close()
      console.error(error)
      showToast('删除失败')
    }
  }).catch(() => {})
}

const handleSetDefault = async (account) => {
  if (!account?.id) return
  if (account.isDefault === 1) return showToast('已是默认账户')
  const toast = showLoadingToast({ message: '设置中...', forbidClick: true, duration: 0 })
  try {
    const res = await setAccountDefault(account.id)
    toast.close()
    if (res && res.code === 200) {
      showToast(`已设为默认${getTypeName(account)}账户`)
      await fetchAccountList()
    } else {
      showToast(res?.msg || '设置失败')
    }
  } catch (error) {
    toast.close()
    console.error(error)
    showToast('设置失败')
  }
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f5f7fa;
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
  padding-bottom: 80px;
}

.account-count {
  text-align: center;
  font-size: var(--font-size-small);
  color: white;
  margin-bottom: 12px;
  font-weight: 500;
}

.add-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.add-item {
  flex: 1;
  background: #fff;
  border-radius: 12px;
  padding: 16px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #eee;
}

.add-item:active {
  background: #f5f7fa;
}

.add-item-icon {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.add-item-text {
  font-size: var(--font-size-small);
  color: #333;
  font-weight: 500;
}

.card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #4da9ff; /* Blue border for the first card as per image? Or maybe focus state. */
  border: 1px solid transparent; /* Default border */
}

/* Add blue border to first card to match reference image if needed, 
   but usually it's selection state. I'll stick to a subtle border or none.
   Wait, the first card in the image has a blue border. 
   I'll add a class for active state or just style all similarly.
   The image shows white cards. Let's keep it simple.
*/
.alipay-card, .bank-card {
  border: 1px solid #2979ff;
  min-height: 120px;
  display: flex;
  flex-direction: column;
}

.wechat-card {
  border: 1px solid #07c160;
  min-height: 120px;
  display: flex;
  flex-direction: column;
}

/* Add Card Styling - removed, using add-row instead */

.card-header {
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.default-btn {
  font-size: var(--font-size-xs);
  color: var(--blue-deep);
  cursor: pointer;
  padding: 4px 10px;
  border: 1px solid var(--blue-deep);
  border-radius: 4px;
  z-index: 10;
  position: relative;
}

.delete-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 50%;
  z-index: 10;
  position: relative;
}

.delete-btn:active {
  background: rgba(238, 10, 36, 0.1);
}

.card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 2;
  position: relative;
}

.info-row {
  display: flex;
  font-size: var(--font-size-small);
  color: #666;
  align-items: center;
}

.label {
  min-width: 80px;
  flex-shrink: 0;
}

.value {
  color: #333;
  font-size: var(--font-size-small);
}

.card-action {
  margin-top: 8px;
  z-index: 10;
  cursor: pointer;
}

.card-action .action-btn {
  width: 40px;
  height: 24px;
  border: 1px solid #ccc;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.watermark-img {
  position: absolute;
  bottom: 0;
  right: 0;
  height: 80px;
  z-index: 1;
  opacity: 1;
}

/* Add Card Styling */
.add-icon-wrapper {
  margin-right: 16px;
}

.unionpay-bind-img {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.add-info {
  flex: 1;
}
.add-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}
.add-desc {
  font-size: 12px;
  color: #999;
}
.add-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid #999;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  z-index: 10;
}
</style>
