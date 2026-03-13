<template>
  <div class="service-page">
    <div class="header">
      <van-nav-bar title="服务" :border="false" class="nav-bar" />
    </div>
    
    <div class="content">
      <div class="service-card" v-for="(item, index) in serviceList" :key="index">
        <div class="card-top" :style="getBgStyle(item)">
          <div class="card-title-overlay" v-if="item.bg">{{ item.name }}</div>
        </div>
        <div class="card-bottom">
          <div class="project-name">{{ item.name }}</div>
          <div class="enter-btn" @click="handleEnter(item)">
            点击进入 >>>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showLoadingToast, closeToast } from 'vant'
import { getSolutionIndex } from '@/api/solution'
import bgPlan from '@/assets/服务/minsheng-plan.png'
import bgSubsidy from '@/assets/服务/subsidy.png'

const router = useRouter()

const serviceList = ref([
  { name: '2026民生计划', id: 1, bg: bgPlan, route: 'minsheng-plan', disabled: true },
  { name: '共富普惠救助金', id: 2, bg: bgSubsidy, route: 'subsidy' },
  // { name: '项目名称项目名称', id: 3, bg: null },
])

const handleEnter = async (item) => {
  // if (item.disabled) {
  //   showToast('暂未开放')
  //   return
  // }
  
  if (item.route === 'subsidy') {
    // 救助金特殊逻辑
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
        if (status === -1 || status === 2) {
          router.push({ name: item.route })
        } else if (status === 0) {
          showToast('已申请，等待审核')
        } else if (status === 1) {
          showToast('已申请，审核通过')
        } else {
          // 兜底逻辑：如果状态未知，也允许进入或者提示错误？
          // 这里假设未知状态默认放行或提示
          router.push({ name: item.route })
        }
      } else {
        showToast(res?.msg || '获取状态失败')
      }
    } catch (error) {
      // 必须手动关闭，因为 catch 会捕获包括 toast.close() 之前抛出的错误
      toast.close() 
      console.error(error)
      showToast('网络请求失败')
    }
  } else if (item.route) {
    router.push({ name: item.route })
  } else {
    showToast(`功能开发中: ${item.name}`)
  }
}

const getBgStyle = (item) => {
  if (item?.bg) {
    return {
      backgroundImage: `url(${item.bg})`,
      backgroundSize: '100% 100%',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }
  }
  return {
    backgroundColor: '#ffffff',
  }
}
</script>

<style scoped>
.service-page {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding-bottom: 60px; /* Tabbar height */
}

/* Header style matching Checkin.vue */
.header {
  height: 220px; /* Adjusted height for this page */
  background: var(--blue-gradient);
  position: relative;
}

.nav-bar {
  background: transparent;
  --van-nav-bar-title-text-color: #fff;
  --van-nav-bar-title-font-size: 18px;
  --van-nav-bar-title-font-weight: bold;
}

.content {
  padding: 0 16px;
  margin-top: -160px; /* Pull content up */
  position: relative;
  z-index: 1;
}

.service-card {
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 16px;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.card-top {
  height: 120px;
  background-color: white;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-title-overlay {
  color: #fff;
  font-size: 26px;
  font-weight: 900;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  letter-spacing: 1px;
  text-align: center;
  padding: 0 20px;
  z-index: 1;
}

.card-bottom {
  height: 60px;
  background: var(--blue-gradient);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
}

.project-name {
  color: white;
  font-size: 16px;
  font-weight: bold;
}

.enter-btn {
  background-color: white;
  color: var(--blue-deep);
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: bold;
  display: flex;
  align-items: center;
}
</style>
