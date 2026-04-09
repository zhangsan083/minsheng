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
            <span class="staff-header-text">民 生 资 产 工 作 人 员</span>
            <span class="dot"></span>
          </div>
          <div class="staff-body">
            <div class="staff-grid">
              <div v-for="n in 6" :key="n" class="staff-item">
                <div class="staff-avatar"></div>
                <div class="staff-info">
                  <span class="staff-label">姓名：<span class="staff-underline"></span></span>
                  <span class="staff-label">职务：<span class="staff-underline"></span></span>
                </div>
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
const orgList = [
  {
    name: '中华人民共和国国务院',
    img: '',
    desc: '作为国家最高行政机关，在民生资产相关工作中，主要承担总体领导、统筹部署与政策决策职责，对涉及民生权益落实的重大事项进行统一指导与宏观调控。\n\u3000\u3000通过强化顶层设计与制度保障，统筹各部门协同推进，推动形成权责清晰、运行规范、协同高效的工作体系，确保各项民生政策落地见效，让发展成果更加公平、更加可及地惠及人民群众。'
  },
  {
    name: '中国人民银行',
    img: '',
    desc: '国家中央银行，在国务院领导下，依法履行宏观金融管理职能。在民生资产相关工作中，中国人民银行主要体现在金融体系与支付清算层面的基础支撑作用，通过完善支付体系、保障资金流转安全与规范运行，为相关流程的有序推进提供基础金融环境。'
  },
  {
    name: '财政部',
    img: '',
    desc: '主要负责资金统筹与制度保障职能。通过安排中央财政专项资金、完善转移支付机制、强化资金监管与绩效管理，确保各项扶持及民生政策有资金支撑、有制度保障、有效落实到位。'
  },
  {
    name: '国家统计局',
    img: '',
    desc: '主要负责国家统计工作和数据发布，是国家宏观决策的重要数据支撑部门。在民生资产工作中，国家统计局主要承担数据监测与评估支撑作用，通过统计调查与数据分析，反映群众收入、就业、生活水平等变化情况，为政策制定与效果评估提供客观依据，确保各项民生政策更加精准、科学。'
  },
  {
    name: '国家发展和改革委员会',
    img: '',
    desc: '主要承担统筹协调、政策指导与整体推进职责，围绕国家发展战略，组织推进民生领域资源整合与机制完善，推动形成统一规范的工作体系，促进资源优化配置与流程标准化运行，让民生资产"有路径可查、有机制可循、有结果可见"，不断提升人民群众的获得感与幸福感。'
  },
  {
    name: '国家数据局',
    img: '',
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
  min-height: 140px;
  background: #e8e8e8;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.org-img {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
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
  justify-content: center;
  gap: 12px;
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

.staff-avatar {
  width: 100%;
  aspect-ratio: 3 / 4;
  background: #e8e8e8;
  border-radius: 6px;
}

.staff-info {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.staff-label {
  font-size: 12px;
  color: #444;
  display: flex;
  align-items: flex-end;
}

.staff-underline {
  flex: 1;
  height: 1px;
  background: #999;
  margin-left: 4px;
  margin-bottom: 2px;
}

.staff-footer {
  background: var(--blue-gradient);
  padding: 14px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
