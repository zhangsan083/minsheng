<template>
  <div class="page">
    <div class="header-bg">
      <van-nav-bar
        title="组织架构"
        left-arrow
        :border="false"
        @click-left="$router.back()"
        class="nav-bar"
      />
    </div>

    <div class="content">
      <div v-for="(item, index) in orgList" :key="index" class="org-wrapper">
        <div class="org-title-btn">
          <span class="dot"></span>
          <span class="org-title-text">{{ item.name }}</span>
          <span class="dot"></span>
        </div>
        <div class="org-card">
          <div class="org-img-placeholder">
            <img v-if="item.img" :src="item.img" :alt="item.name" class="org-img" />
          </div>
          <div class="org-desc">{{ item.desc }}</div>
        </div>
      </div>

      <!-- 底部：民生资产工作人员 -->
      <div class="org-wrapper">
        <div class="staff-card">
          <div class="staff-header">
            <span class="dot"></span>
            <span class="staff-header-text">民生资产工作人员</span>
            <span class="dot"></span>
          </div>
          <div class="staff-body">
            <div class="staff-grid">
              <div v-for="(img, index) in staffList" :key="index" class="staff-item">
                <img :src="img" :alt="'职位图' + (index + 1)" class="staff-card-img" />
              </div>
            </div>
          </div>
          <div class="staff-footer">
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import imgGuowuyuan from '@/assets/组织机构/国务院.jpg'
import imgRenminBank from '@/assets/组织机构/中国人民银行.jpeg'
import imgCaizhengbu from '@/assets/组织机构/财政部.jpg'
import imgTongji from '@/assets/组织机构/国家统计局.jpeg'
import imgFagaiwei from '@/assets/组织机构/发改委.jpeg'
import imgShujuju from '@/assets/组织机构/国家数据局.jpg'

import staff1 from '@/assets/组织机构/工作牌/职位图1.png'
import staff2 from '@/assets/组织机构/工作牌/职位图2.png'
import staff3 from '@/assets/组织机构/工作牌/职位图3.png'
import staff4 from '@/assets/组织机构/工作牌/职位图4.png'
import staff5 from '@/assets/组织机构/工作牌/职位图5.png'
import staff6 from '@/assets/组织机构/工作牌/职位图6.png'
import staff7 from '@/assets/组织机构/工作牌/职位图7.png'
import staff8 from '@/assets/组织机构/工作牌/职位图8.png'
import staff9 from '@/assets/组织机构/工作牌/职位图9.png'
import staff10 from '@/assets/组织机构/工作牌/职位图10.png'
import staff11 from '@/assets/组织机构/工作牌/职位图11.png'
import staff12 from '@/assets/组织机构/工作牌/职位图12.png'
import staff13 from '@/assets/组织机构/工作牌/职位图13.png'
import staff14 from '@/assets/组织机构/工作牌/职位图14.png'
import staff15 from '@/assets/组织机构/工作牌/职位图15.png'
import staff16 from '@/assets/组织机构/工作牌/职位图16.png'

const staffList = [
  staff1, staff2, staff3, staff4, staff5, staff6, staff7, staff8,
  staff9, staff10, staff11, staff12, staff13, staff14, staff15, staff16
]

const orgList = [
  {
    name: '中华人民共和国国务院',
    img: imgGuowuyuan,
    desc: '作为国家最高行政机关，在民生资产相关工作中，主要承担总体领导、统筹部署与政策决策职责，对涉及民生权益落实的重大事项进行统一指导与宏观调控。\n\u3000\u3000通过强化顶层设计与制度保障，统筹各部门协同推进，推动形成权责清晰、运行规范、协同高效的工作体系，确保各项民生政策落地见效，让发展成果更加公平、更加可及地惠及人民群众。'
  },
  {
    name: '国家发展和改革委员会',
    img: imgFagaiwei,
    desc: '主要承担统筹协调、政策指导与整体推进职责，围绕国家发展战略，组织推进民生领域资源整合与机制完善，推动形成统一规范的工作体系，促进资源优化配置与流程标准化运行，让民生资产"有路径可查、有机制可循、有结果可见"，不断提升人民群众的获得感与幸福感。'
  },
  {
    name: '财政部',
    img: imgCaizhengbu,
    desc: '主要负责资金统筹与制度保障职能。通过安排中央财政专项资金、完善转移支付机制、强化资金监管与绩效管理，确保各项扶持及民生政策有资金支撑、有制度保障、有效落实到位。'
  },
  {
    name: '中国人民银行',
    img: imgRenminBank,
    desc: '国家中央银行，在国务院领导下，依法履行宏观金融管理职能。在民生资产相关工作中，中国人民银行主要体现在金融体系与支付清算层面的基础支撑作用，通过完善支付体系、保障资金流转安全与规范运行，为相关流程的有序推进提供基础金融环境。'
  },
  {
    name: '国家统计局',
    img: imgTongji,
    desc: '主要负责国家统计工作和数据发布，是国家宏观决策的重要数据支撑部门。在民生资产工作中，国家统计局主要承担数据监测与评估支撑作用，通过统计调查与数据分析，反映群众收入、就业、生活水平等变化情况，为政策制定与效果评估提供客观依据，确保各项民生政策更加精准、科学。'
  },
  {
    name: '国家数据局',
    img: imgShujuju,
    desc: '负责统筹全国数据资源与制度建设，在民生资产相关工作中强化数据整合与信息化支撑，推动权益信息集中管理、流程规范运行与结果有序落实，促进发展成果更加公平惠及人民群众。'
  }
]
</script>

<style scoped>
.page {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding-bottom: 80px;
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

:deep(.van-nav-bar__title) {
  color: #ffffff;
  font-size: var(--font-size-large);
  font-weight: bold;
}

:deep(.van-icon) {
  color: #ffffff;
}

.content {
  padding: 0 16px;
  margin-top: -160px;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 每个机构的外层容器 */
.org-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 16px;
}

/* 蓝色渐变标题按钮 — 通过负 margin 骑在卡片顶部 */
.org-title-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: var(--blue-gradient);
  border-radius: 6px;
  padding: 10px 24px;
  box-shadow: 0 4px 12px rgba(9, 68, 252, 0.25);
  position: relative;
  z-index: 2;
  margin-bottom: -20px;
}

.org-title-text {
  color: #fff;
  font-size: var(--font-size-base);
  font-weight: bold;
  white-space: nowrap;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #fff;
  flex-shrink: 0;
}

/* 白色卡片 — 顶部留出空间给标题按钮 */
.org-card {
  width: 100%;
  background: #fff;
  border-radius: 12px;
  padding: 10px 16px 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 图片占位区域 */
.org-img-placeholder {
  width: 100%;
  height: 160px;
  background: #e8e8e8;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.org-img {
  width: 100%;
  height: 100%;
  display: block;
  /* object-fit: cover; */
}

/* 描述文字 */
.org-desc {
  width: 100%;
  margin-top: 14px;
  font-size: var(--font-size-small);
  color: #444;
  line-height: 1.8;
  text-indent: 2em;
}

/* 底部民生资产工作人员 */
.staff-card {
  width: 100%;
  border-radius: 0;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  background: #fff;
}

.staff-header {
  background: var(--blue-gradient);
  padding: 14px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.staff-header-text {
  color: #fff;
  font-size: var(--font-size-large);
  font-weight: bold;
  letter-spacing: 4px;
}


.staff-body {
  padding: 20px 16px;
}

.staff-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px 12px;
}

.staff-item {
  display: flex;
  flex-direction: column;
}

.staff-card-img {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 6px;
}

.staff-footer {
  background: var(--blue-gradient);
  padding: 14px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
