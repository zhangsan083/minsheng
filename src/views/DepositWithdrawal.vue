<template>
  <div class="deposit-withdrawal">
    <div class="header">
      <van-nav-bar title="个人诚信定金提现" left-arrow @click-left="$router.back()" :border="false" class="nav-bar" />
    </div>

    <div class="content">
      <div class="main-card">
        <!-- Alipay Section -->
        <div class="section-header">
          <div class="left">
            <span class="label">{{ methodLabel }}</span>
            <span class="switch-link" @click="toggleMethod"><van-icon name="exchange" /> 切换</span>
          </div>
          <van-button size="small" type="primary" class="detail-btn" @click="$router.push('/reservation-details')">定金明细</van-button>
        </div>

        <div class="alipay-card" v-if="method === 'alipay' && currentAccount">
          <div class="icon-wrapper">
            <img :src="iconAlipay" class="pay-icon-img" alt="alipay" />
          </div>
          <div class="alipay-info">
            <div class="name">支付宝</div>
            <div class="account">{{ currentAccount.accountNum }}</div>
          </div>
        </div>

        <div class="bank-card" v-else-if="method === 'bank' && currentAccount">
          <div class="icon-wrapper">
            <img :src="iconUnionPay" class="pay-icon-img" alt="unionpay" />
          </div>
          <div class="bank-info">
            <div class="name">{{ currentAccount.openName }}</div>
            <div class="account">{{ currentAccount.accountNum }}</div>
          </div>
        </div>

        <!-- Empty State -->
        <div class="empty-card" v-else>
          <div class="empty-content" @click="goToAdd">
            <div class="icon-unionpay">
              <img :src="method === 'alipay' ? iconAlipay : iconUnionPay" class="union-logo-img" alt="logo" />
            </div>
            <span class="empty-text">您还未添加{{ method === 'alipay' ? '支付宝' : '银行卡' }}账户，请前往添加!</span>
          </div>
        </div>

        <!-- Amount Section -->
        <div class="amount-section">
          <div class="label">提现金额</div>
          <div class="input-wrapper">
            <van-field v-model="amount" placeholder="输入提现金额" :border="false" type="number" class="amount-input" />
            <span class="all-btn" @click="handleAll">全部</span>
          </div>
          <div class="hint">您最多可提现金额为0.00元</div>
        </div>

        <!-- Submit Button -->
        <van-button block color="var(--blue-gradient)" round class="submit-btn">
          立即提现
        </van-button>
      </div>

      <!-- Footer Text -->
      <div class="footer-text">
        <p>1.诚信定金提取需要您已确认过您的预订兑付额度，如未锁定预订兑付额度权益请及时在兑付规划页面确认额度。</p>
        <p>2.诚信定金可依据确认的额度方案，用于抵扣对应额度所需的支付确认。</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { showToast, showLoadingToast } from 'vant';
import { getAccountList } from '@/api/auth';

import iconAlipay from '@/assets/战略/支付宝.png';
import iconUnionPay from '@/assets/战略/银联.png';

const router = useRouter();
const amount = ref('');
const method = ref('alipay');
const accountList = ref([]);

const alipayAccount = computed(() => accountList.value.find(item => String(item.accountType) === '1'));
const bankAccount = computed(() => accountList.value.find(item => String(item.accountType) === '0'));

const currentAccount = computed(() => {
  return method.value === 'alipay' ? alipayAccount.value : bankAccount.value;
});

const methodLabel = computed(() => method.value === 'alipay' ? '提现到支付宝' : '提现到银行卡');

onMounted(() => {
  fetchAccountList();
});

const fetchAccountList = async () => {
  const toast = showLoadingToast({
    message: '加载中...',
    forbidClick: true,
    duration: 0
  });
  
  try {
    const res = await getAccountList();
    toast.close();
    if (res && res.code === 200) {
      accountList.value = res.data || [];
    }
  } catch (error) {
    toast.close();
    console.error(error);
    showToast('获取账户信息失败');
  }
};

const toggleMethod = () => {
  method.value = method.value === 'alipay' ? 'bank' : 'alipay';
};

const handleAll = () => {
  amount.value = '0.00'; // Logic to set max amount
};

const goToAdd = () => {
  router.push('/payment-account');
};
</script>

<style lang="scss" scoped>
.deposit-withdrawal {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding-bottom: 80px;
}

.header {
  height: 220px;
  background: url('@/assets/战略/strategy-bg.png') no-repeat center top;
  background-size: 100% 100%;
  position: relative;
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

.main-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
  border: 1px solid #1989fa; /* Blue border as seen in screenshot */
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  .left {
    display: flex;
    align-items: center;
    gap: 8px;

    .label {
      font-size: var(--font-size-base);
      font-weight: bold;
      color: #333;
    }

    .switch-link {
      font-size: var(--font-size-xs);
      color: #1989fa;
      display: flex;
      align-items: center;
      gap: 2px;
    }
  }

  .detail-btn {
    height: var(--button-small-height);
    padding: 0 8px;
    font-size: var(--font-size-xs);
    border-radius: 4px;
    background: #1989fa;
    border-color: #1989fa;
  }
}

/* Card Common Styles */
.card-common {
  border-radius: 8px;
  padding: 16px;
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  min-height: 80px; /* Ensure same height */
  box-sizing: border-box;
}

.alipay-card {
  @extend .card-common;
  background: #e6f1fc; /* Light blue background */

  .icon-wrapper {
    margin-right: 12px;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .pay-icon-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  .alipay-info {
    display: flex;
    justify-content: space-between;
    flex: 1;
    align-items: center;
    color: #1677ff;
    font-weight: 500;
    
    .name {
      font-size: var(--font-size-base);
    }
    
    .account {
      font-size: var(--font-size-small);
      letter-spacing: 1px;
    }
  }
}

.bank-card {
  @extend .card-common;
  background: #e6f1fc; /* Light blue background same as Alipay */

  .icon-wrapper {
    margin-right: 12px;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .pay-icon-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  .bank-info {
    display: flex;
    justify-content: space-between;
    flex: 1;
    align-items: center;
    color: #1677ff; /* Blue text color same as Alipay */
    font-weight: 500;
    
    .name {
      font-size: var(--font-size-base);
    }
    
    .account {
      font-size: var(--font-size-small);
      letter-spacing: 1px;
    }
  }
}

/* Empty State */
.empty-card {
  @extend .card-common;
  background: #ffebeb;
  justify-content: center;
  cursor: pointer;

  .empty-content {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .icon-unionpay {
    /* Remove background and padding as image includes style or needs clean look */
    background: transparent;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    line-height: 1;
    
    .union-logo-img {
      width: 32px;
      height: 32px;
      object-fit: contain;
    }
  }

  .empty-text {
    color: #d32f2f; /* Red warning text */
    font-size: var(--font-size-small);
    font-weight: 500;
  }
}

.amount-section {
  margin-bottom: 30px;

  .label {
    font-size: var(--font-size-small);
    color: #333;
    margin-bottom: 12px;
    font-weight: 500;
  }

  .input-wrapper {
    background: #f5f7fa;
    border-radius: 8px;
    display: flex;
    align-items: center;
    padding-right: 16px;
    margin-bottom: 8px;

    .amount-input {
      background: transparent;
      padding: 12px 16px;
      font-size: var(--font-size-base);
    }

    .all-btn {
      color: #1989fa;
      font-size: var(--font-size-small);
      font-weight: bold;
      white-space: nowrap;
    }
  }

  .hint {
    font-size: var(--font-size-xs);
    color: #999;
  }
}

.submit-btn {
  font-size: var(--font-size-base);
  font-weight: bold;
  height: var(--button-normal-height);
}

.footer-text {
  font-size: var(--font-size-xs);
  color: #666;
  line-height: 1.6;
  padding: 0 4px;

  p {
    margin-bottom: 8px;
    text-align: justify;
  }
}
</style>
