<template>
  <div class="reservation-details">
    <div class="header-bg"></div>
    <van-nav-bar
      title="预订明细"
      left-arrow
      @click-left="$router.back()"
      :border="false"
      class="custom-nav"
    />
    
    <div class="content">
      <div class="record-list">
        <div class="record-card" v-for="(item, index) in list" :key="index">
          <div class="icon-wrapper">
            <div class="money-bag-icon">
              <div class="bag-body">
                <div class="symbol">¥</div>
              </div>
            </div>
          </div>
          <div class="info">
            <div class="title">{{ item.title }}</div>
            <div class="time">{{ item.time }}</div>
          </div>
          <div class="amount">{{ item.amount }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const list = ref([
  { title: '钱包权益额外领取兑付额度', time: '2026-00-00 00:00:00', amount: '+000万元' },
  { title: '钱包权益额外领取兑付额度', time: '2026-00-00 00:00:00', amount: '+000万元' },
  { title: '钱包权益额外领取兑付额度', time: '2026-00-00 00:00:00', amount: '+000万元' },
  { title: '钱包权益额外领取兑付额度', time: '2026-00-00 00:00:00', amount: '+000万元' },
  { title: '钱包权益额外领取兑付额度', time: '2026-00-00 00:00:00', amount: '+000万元' },
  { title: '钱包权益额外领取兑付额度', time: '2026-00-00 00:00:00', amount: '+000万元' },
  { title: '钱包权益额外领取兑付额度', time: '2026-00-00 00:00:00', amount: '+000万元' },
  { title: '钱包权益额外领取兑付额度', time: '2026-00-00 00:00:00', amount: '+000万元' },
]);
</script>

<style lang="scss" scoped>
.reservation-details {
  min-height: 100vh;
  background-color: #f5f5f5;
  position: relative;
  padding-bottom: 80px;

  .header-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 220px;
    background: url('@/assets/战略/strategy-bg.png') no-repeat center top;
    background-size: 100% 100%;
    z-index: 0;
  }

  .custom-nav {
    background: transparent;
    
    :deep(.van-nav-bar__title) {
      color: #fff;
      font-weight: bold;
      font-size: 18px;
    }
    :deep(.van-icon) {
      color: #fff;
      font-size: 20px;
    }
  }

  .content {
    position: relative;
    z-index: 1;
    padding: 10px 16px;
    margin-top: 10px;

    .record-list {
      display: flex;
      flex-direction: column;
      gap: 12px;

      .record-card {
        background: #fff;
        border-radius: 12px;
        padding: 16px;
        display: flex;
        align-items: center;
        border: 1px solid #6699ff; /* Light blue border as seen in screenshot */
        box-shadow: 0 2px 8px rgba(25, 137, 250, 0.1);
        
        .icon-wrapper {
          margin-right: 12px;
          
          .money-bag-icon {
            width: 40px;
            height: 40px;
            background: #e6f1fc;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            
            .bag-body {
              width: 24px;
              height: 24px;
              background: #1989fa;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              position: relative;
              
              /* Simple bag shape simulation */
              &::before {
                content: '';
                position: absolute;
                top: -4px;
                left: 50%;
                transform: translateX(-50%);
                width: 12px;
                height: 6px;
                border: 2px solid #1989fa;
                border-bottom: none;
                border-radius: 4px 4px 0 0;
              }

              .symbol {
                color: #fff;
                font-size: 14px;
                font-weight: bold;
              }
            }
          }
        }

        .info {
          flex: 1;
          
          .title {
            font-size: 14px;
            color: #333;
            font-weight: 500;
            margin-bottom: 6px;
          }
          
          .time {
            font-size: 12px;
            color: #999;
          }
        }

        .amount {
          font-size: 16px;
          color: #1989fa;
          font-weight: bold;
        }
      }
    }
  }
}
</style>
