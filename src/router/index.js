import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { pinia } from '@/stores'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/BasicLayout.vue'),
    redirect: '',
    children: [
      {
        path: 'home',
        name: 'home',
        component: () => import('@/views/Home.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'strategy',
        name: 'strategy',
        component: () => import('@/views/Strategy.vue')
      },
      {
        path: 'payment-success',
        name: 'payment-success',
        component: () => import('@/views/PaymentSuccess.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'reserve-quota',
        name: 'reserve-quota',
        component: () => import('@/views/ReserveQuota.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'reservation-details',
        name: 'reservation-details',
        component: () => import('@/views/ReservationDetails.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'deposit-withdrawal',
        name: 'deposit-withdrawal',
        component: () => import('@/views/DepositWithdrawal.vue'),
        meta: { requiresAuth: true }
      },
  {
    path: 'filing-record',
    name: 'filing-record',
    component: () => import('@/views/FilingRecord.vue'),
    meta: { requiresAuth: true }
  },
      {
        path: 'assets',
        name: 'assets',
        component: () => import('@/views/Assets.vue')
      },
      {
        path: 'asset-query',
        name: 'asset-query',
        component: () => import('@/views/AssetQuery.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'asset-confirm',
        name: 'asset-confirm',
        component: () => import('@/views/AssetConfirm.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'asset-issue',
        name: 'asset-issue',
        component: () => import('@/views/AssetIssue.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'asset-data',
        name: 'asset-data',
        component: () => import('@/views/AssetData.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'service',
        name: 'service',
        component: () => import('@/views/Service.vue')
      },
      {
        path: 'dream-mutual-aid',
        name: 'dream-mutual-aid',
        component: () => import('@/views/DreamMutualAid.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'profile',
        name: 'profile',
        component: () => import('@/views/Profile.vue')
      },
      {
        path: 'checkin',
        name: 'checkin',
        component: () => import('@/views/Checkin.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'checkin-log',
        name: 'checkin-log',
        component: () => import('@/views/CheckinLog.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'news',
        name: 'news',
        component: () => import('@/views/News.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'news-detail',
        name: 'news-detail',
        component: () => import('@/views/NewsDetail.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'download',
        name: 'download',
        component: () => import('@/views/Download.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'group-chat',
        name: 'group-chat',
        component: () => import('@/views/GroupChat.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'shop',
        name: 'shop',
        component: () => import('@/views/Shop.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'redeem-log',
        name: 'redeem-log',
        component: () => import('@/views/RedeemLog.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'meeting-center',
        name: 'meeting-center',
        component: () => import('@/views/MeetingCenter.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'rewards-log',
        name: 'rewards-log',
        component: () => import('@/views/RewardsLog.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'rewards-history',
        name: 'rewards-history',
        component: () => import('@/views/RewardsHistory.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'my-team',
        name: 'my-team',
        component: () => import('@/views/MyTeam.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'invite-friends',
        name: 'invite-friends',
        component: () => import('@/views/InviteFriends.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'certificate',
        name: 'certificate',
        component: () => import('@/views/Certificate.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'certificate-detail',
        name: 'certificate-detail',
        component: () => import('@/views/CertificateDetail.vue'),
        meta: { requiresAuth: true}
      },
      {
        path: 'bulletin',
        name: 'bulletin',
        component: () => import('@/views/Bulletin.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'real-name-auth',
        name: 'real-name-auth',
        component: () => import('@/views/RealNameAuth.vue'),
        meta: { requiresAuth: true}
      },
      {
        path: 'payment-account',
        name: 'payment-account',
        component: () => import('@/views/PaymentAccount.vue'),
        meta: { requiresAuth: true}
      },
      {
        path: 'bind-alipay',
        name: 'bind-alipay',
        component: () => import('@/views/BindAlipay.vue'),
        meta: { requiresAuth: true}
      },
      {
        path: 'bind-bank-card',
        name: 'bind-bank-card',
        component: () => import('@/views/BindBankCard.vue'),
        meta: { requiresAuth: true}
      },
      {
        path: 'change-password',
        name: 'change-password',
        component: () => import('@/views/ChangePassword.vue'),
        meta: { requiresAuth: true}
      },
      {
        path: 'asset-filing',
        name: 'asset-filing',
        component: () => import('@/views/AssetFiling.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'filing-registration',
        name: 'filing-registration',
        component: () => import('@/views/FilingRegistration.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'filing-submit',
        name: 'filing-submit',
        component: () => import('@/views/FilingSubmit.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'policy',
        name: 'policy',
        component: () => import('@/views/Policy.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'policy-detail',
        name: 'policy-detail',
        component: () => import('@/views/PolicyDetail.vue'),
        meta: { requiresAuth: true}
      },
      {
        path: 'recharge',
        name: 'recharge',
        component: () => import('@/views/Recharge.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'fund-conversion',
        name: 'fund-conversion',
        component: () => import('@/views/FundConversion.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'withdraw',
        name: 'withdraw',
        component: () => import('@/views/Withdraw.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'withdraw-record',
        name: 'withdraw-record',
        component: () => import('@/views/WithdrawRecord.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'fund-transfer',
        name: 'fund-transfer',
        component: () => import('@/views/FundTransfer.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'minsheng-plan',
        name: 'minsheng-plan',
        component: () => import('@/views/MinshengPlan.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'minsheng-treasure',
        name: 'minsheng-treasure',
        component: () => import('@/views/MinshengTreasure.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'minsheng-treasure-records',
        name: 'minsheng-treasure-records',
        component: () => import('@/views/MinshengTreasureRecords.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'hmbao-agreement',
        name: 'hmbao-agreement',
        component: () => import('@/views/HmBaoAgreement.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'plan-detail',
        name: 'plan-detail',
        component: () => import('@/views/PlanDetail.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'subsidy',
        name: 'subsidy',
        component: () => import('@/views/Subsidy.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'benefit-subsidy',
        name: 'benefit-subsidy',
        component: () => import('@/views/BenefitSubsidy.vue'),
        meta: { requiresAuth: true }
      },
      {        path: 'national-welfare',
        name: 'national-welfare',
        component: () => import('@/views/NationalWelfare.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'contribute',
        name: 'contribute',
        component: () => import('@/views/Contribute.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'my-contributions',
        name: 'my-contributions',
        component: () => import('@/views/MyContributions.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'team-plan',
        name: 'team-plan',
        component: () => import('@/views/TeamPlan.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'team-leader-application',
        name: 'team-leader-application',
        component: () => import('@/views/TeamLeaderApplication.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'team-salary',
        name: 'team-salary',
        component: () => import('@/views/TeamSalary.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'team-details',
        name: 'team-details',
        component: () => import('@/views/TeamDetails.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'total-earnings',
        name: 'total-earnings',
        component: () => import('@/views/TotalEarnings.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'team-ranking',
        name: 'team-ranking',
        component: () => import('@/views/TeamRanking.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'fund-details',
        name: 'fund-details',
        component: () => import('@/views/FundDetails.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'customer-service',
        name: 'customer-service',
        component: () => import('@/views/CustomerService.vue'),
        meta: { hideTabbar: true }
      },
      {
        path: 'internal-browser',
        name: 'internal-browser',
        component: () => import('@/views/InternalBrowser.vue'),
        meta: { hideTabbar: true }
      },
      {
        path: 'organization',
        name: 'organization',
        component: () => import('@/views/Organization.vue'),
        meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: '/product/:id',
    name: 'product-detail',
    component: () => import('@/views/ProductDetail.vue')
  },
  {
    path: '/address-manage',
    name: 'address-manage',
    component: () => import('@/views/AddressManage.vue'),
    meta: { requiresAuth: true }
  },

  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/Register.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { left: 0, top: 0 }
  }
})

router.beforeEach(to => {
  const user = useUserStore(pinia)
  const whiteList = ['login', 'register', 'customer-service']
  
  // 处理根路径的动态重定向
  if (to.path === '/' || to.path === '') {
    if (user.isAuthenticated) {
      return { name: 'home' }  // 已登录 -> 跳转到首页
    } else {
      return { name: 'login' }  // 未登录 -> 跳转到登录页
    }
  }
  
  // 其他路由的权限检查
  if (!user.isAuthenticated && !whiteList.includes(to.name)) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  return true
})

export default router
