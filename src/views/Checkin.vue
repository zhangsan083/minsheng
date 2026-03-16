<template>
  <div class="page">
    <!-- 顶部 Header -->
    <div class="header-bg">
      <van-nav-bar
        title="今日签到"
        left-arrow
        @click-left="$router.back()"
        :border="false"
        class="nav-bar"
      />
    </div>

    <div class="content">
      <!-- 日历卡片 -->
      <div class="calendar-card">
        <div class="calendar-header">
          <div class="stats">
            <div class="label">连签</div>
            <div class="value">{{ checkinData.continuous }}<span class="unit">天</span></div>
          </div>
          <div class="date-title">{{ currentYear }}年{{ currentMonth }}月</div>
          <div class="btn-log" @click="goLog">签到记录</div>
        </div>
        
        <div class="calendar-body">
          <!-- 星期头 -->
          <div class="weekdays">
            <div class="weekday" v-for="day in weekDays" :key="day">{{ day }}</div>
          </div>
          <!-- 日期网格 -->
          <div class="days">
            <div
              class="day"
              v-for="(item, index) in calendarDays"
              :key="index"
              :class="{
                'is-today': item.isToday,
                'is-checked': item.checked,
                'is-current-month': item.isCurrentMonth
              }"
            >
              <span v-if="item.day">{{ item.day }}</span>
            </div>
          </div>
        </div>

        <div class="calendar-footer">
          今日获得<span class="highlight">{{ checkinData.todayScore }}</span>积分
        </div>
      </div>

      <!-- 签到按钮 -->
      <van-button
        class="btn-checkin"
        type="primary"
        block
        round
        @click="doCheckin"
        :disabled="checkedIn"
      >
        {{ checkedIn ? '今日已签到' : '立即签到' }}
      </van-button>

      <!-- 签到规则 -->
      <div class="rules-card">
        <div class="rules-title">签到规则</div>
        <div class="rule-item" v-for="(rule, index) in checkinData.rules" :key="index">
          <van-icon name="shop-o" class="rule-icon" />
          <div class="rule-text">{{ rule }}</div>
        </div>
        <div class="rule-item" v-if="checkinData.rules.length === 0">
           <div class="rule-text">暂无规则</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { getCheckinInfo, addCheckin } from '@/api/checkin'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
const checkedIn = ref(false)
const now = new Date()
const currentYear = now.getFullYear()
const currentMonth = String(now.getMonth() + 1).padStart(2, '0')

const checkinData = ref({
  continuous: 0,
  todayScore: 0,
  rules: [
    '实名认证要求：用户必须完成实名认证才能参与签到活动。',
    '每日签到奖励：',
    '积分奖励：每日完成签到即获得5积分，积分可在商城兑换物品。',
    '消费补贴奖励：每日完成签到即获得500元民生补贴。',
    '连续签到奖励：',
    '7天连续签到：即获得一次中国梦项目资产登记资格。',
    '15天连续签到：即获得100000元民生补贴。'
  ],
  checkinDays: []
})

const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

// 获取签到数据
const loadCheckinData = async () => {
  try {
    const res = await getCheckinInfo()
    if (res.code === 200 && res.data) {
      // 处理签到日期数据
      let daysList = []
      if (typeof res.data.checkinDays === 'string') {
        // 如果是字符串 "21,23,24,25"，按逗号分割
        daysList = res.data.checkinDays.split(',').filter(d => d)
      } else if (Array.isArray(res.data.checkinDays)) {
        daysList = res.data.checkinDays
      }

      // 将日期转换为 YYYY-MM-DD 格式
      const formattedDays = daysList.map(day => {
        // 如果已经是完整日期格式，直接返回
        if (String(day).includes('-')) return day
        // 否则当作当月的天数处理
        return `${currentYear}-${currentMonth}-${String(day).padStart(2, '0')}`
      })

      checkinData.value = {
        ...checkinData.value,
        continuous: res.data.continuous || 0,
        todayScore: res.data.todayScore || 0,
        checkinDays: formattedDays
      }
      
      const todayStr = `${currentYear}-${currentMonth}-${String(now.getDate()).padStart(2, '0')}`
      if (checkinData.value.checkinDays.includes(todayStr)) {
        checkedIn.value = true
      }
    } else {
      showToast(res.msg || '获取签到信息失败')
    }
  } catch (error) {
    console.error('Failed to load checkin data:', error)
    showToast('获取签到信息失败，请稍后重试')
  }
}

onMounted(() => {
  loadCheckinData()
})

// 生成日历数据
const calendarDays = computed(() => {
  const year = now.getFullYear()
  const month = now.getMonth()
  
  // 当月第一天
  const firstDayOfMonth = new Date(year, month, 1)
  // 当月最后一天
  const lastDayOfMonth = new Date(year, month + 1, 0)
  
  const daysInMonth = lastDayOfMonth.getDate()
  // 获取第一天是周几 (0是周日，1是周一...6是周六)
  let firstDayWeekday = firstDayOfMonth.getDay()
  // 转换为 0=周一 ... 6=周日 的格式以匹配 weekDays
  firstDayWeekday = firstDayWeekday === 0 ? 6 : firstDayWeekday - 1
  
  const days = []
  
  // 填充上个月的空白
  for (let i = 0; i < firstDayWeekday; i++) {
    days.push({ day: '', isCurrentMonth: false })
  }
  
  // 填充当月日期
  const today = now.getDate()
  const checkedDaysSet = new Set(checkinData.value.checkinDays) // 假设后端返回完整日期格式 YYYY-MM-DD
  
  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
    days.push({
      day: i,
      isCurrentMonth: true,
      isToday: i === today,
      checked: checkedDaysSet.has(dateStr)
    })
  }
  
  return days
})

const doCheckin = async () => {
  // 检查是否实名认证
  if (Number(userStore.userInfo?.isVerified) !== 1) {
    showToast('请先完成实名认证才能签到')
    router.push({ name: 'real-name-auth' })
    return
  }
  
  try {
    const res = await addCheckin()
    if (res.code === 200) {
      checkedIn.value = true
      const points = res.data
      showToast(`签到成功，获得${points}积分`)
      
      // 更新用户积分
      userStore.addScore(points)
      
      // 刷新用户信息，确保资产备案数等数据最新
      await userStore.refreshUserInfo()
      
      // 刷新数据
      loadCheckinData()
    } else {
      showToast(res.msg || '签到失败')
    }
  } catch (error) {
    console.error('Checkin failed:', error)
    showToast('签到失败，请稍后重试')
  }
}

const goLog = () => {
  router.push({ name: 'checkin-log' })
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f7f8fa;
  padding-bottom: 30px;
}

.header-bg {
  height: 220px;
  background: var(--blue-gradient);
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
  padding: 0 16px 100px;
  margin-top: -160px;
  position: relative;
  z-index: 1;
}

/* 日历卡片 */
.calendar-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  margin-bottom: 24px;
}

.calendar-header {
  background: #fff;
  color: #333;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f5f5f5;
}

.stats .label {
  font-size: var(--font-size-small);
  color: #999;
  margin-bottom: 2px;
}

.stats .value {
  font-size: 24px;
  font-weight: 700;
  line-height: 1;
  color: #2979ff;
}

.stats .unit {
  font-size: var(--font-size-xs);
  font-weight: 400;
  margin-left: 2px;
  color: #333;
}

.date-title {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: #333;
}

.btn-log {
  font-size: var(--font-size-small);
  background: #f5f7fa;
  color: #666;
  padding: 4px 12px;
  border-radius: 12px;
}

.calendar-body {
  padding: 16px;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  margin-bottom: 12px;
}

.weekday {
  font-size: var(--font-size-xs);
  color: #8c8c8c;
}

.days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px 0;
  justify-items: center;
}

.day {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-small);
  color: #333;
  border-radius: 4px;
  position: relative;
}

.day.is-today {
  background: var(--blue-gradient);
  color: #fff;
  border-radius: 6px;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(22, 119, 255, 0.3);
}

.day.is-checked:not(.is-today)::after {
  content: '';
  position: absolute;
  bottom: 2px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--blue-deep);
}

.calendar-footer {
  text-align: center;
  padding: 12px 0;
  border-top: 1px solid #f5f5f5;
  color: #666;
  font-size: var(--font-size-small);
}

.highlight {
  color: var(--blue-deep);
  font-weight: 700;
  margin: 0 4px;
  font-size: var(--font-size-base);
}

/* 签到按钮 */
.btn-checkin {
  height: var(--button-normal-height);
  border: none;
  font-size: var(--font-size-base);
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(22, 119, 255, 0.3);
  margin-bottom: 24px;
}

/* 规则卡片 */
.rules-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
}

.rules-title {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.rule-item {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.rule-item:last-child {
  margin-bottom: 0;
}

.rule-icon {
  color: var(--blue-deep);
  font-size: var(--font-size-base);
  margin-top: 2px;
}

.rule-text {
  font-size: var(--font-size-small);
  color: #666;
  line-height: 1.5;
  flex: 1;
}
</style>
