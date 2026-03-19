<template>
  <div class="page">
    <div class="header-bg">
      <van-nav-bar
        title="备案登记"
        left-arrow
        @click-left="$router.back()"
        :border="false"
        class="nav-bar"
      />
    </div>

    <div class="content">
      <!-- User Info Card -->
      <div class="card user-info-card">
        <div class="info-rows">
          <div class="info-row">
            <span class="label">真实姓名：</span>
            <span class="value">{{ userInfo.realName }}</span>
          </div>
          <div class="info-row">
            <span class="label">手机号码：</span>
            <span class="value">{{ showPhone ? userInfo.fullPhone : userInfo.phone }}</span>
            <van-icon :name="showPhone ? 'eye-o' : 'closed-eye'" class="eye-icon" @click="showPhone = !showPhone" />
          </div>
          <div class="info-row">
            <span class="label">身份证号：</span>
            <span class="value">{{ showIdCard ? userInfo.fullIdCard : userInfo.idCard }}</span>
            <van-icon :name="showIdCard ? 'eye-o' : 'closed-eye'" class="eye-icon" @click="showIdCard = !showIdCard" />
          </div>
        </div>
        <div class="logo">
          <img src="@/assets/资产/china-dream-logo.png" alt="China Dream" />
        </div>
      </div>

      <!-- Application Materials -->
      <div class="section-title">
        <van-icon name="orders-o" color="#2b7afb" size="20" />
        <span class="text">申请资料</span>
      </div>

      <div class="form-card">
        <div class="form-item" @click="showCalendar = true">
          <div class="form-label">预计参与日期：</div>
          <div class="form-value placeholder" v-if="!formData.date">点击选择</div>
          <div class="form-value" v-else>{{ formData.date }}</div>
        </div>
        
        <div class="form-item" @click="showProjectPicker = true">
          <div class="form-label">中国梦项目名称：</div>
          <div class="form-value placeholder" v-if="!formData.project">点击选择</div>
          <div class="form-value" v-else>{{ formData.project }}</div>
        </div>
        
        <div class="form-item" @click="showAssetPicker = true">
          <div class="form-label">项目未下发资产：</div>
          <div class="form-value placeholder" v-if="!formData.asset">点击选择</div>
          <div class="form-value" v-else>{{ formData.asset }}</div>
        </div>
      </div>

      <div class="submit-btn-wrapper">
        <van-button 
          block 
          round 
          type="primary" 
          class="submit-btn"
          @click="handleSubmit"
        >
          提交审核
        </van-button>
      </div>

      <div class="notice">
        <span class="dot">●</span> 注意事项：根据《中华人民共和国统计法》等相关法律法规规定，登记人在填写资料时，应当依法如实提交申请资料，确保所提供信息的真实性、准确性和完整性。对于采取虚构事实、隐瞒真相等方式提交虚假材料的行为，国家数据局有权依法撤销相关申请认证，并按照有关规定采取信用惩戒等监管措施。因登记资料缺失实引发的项目受阻、权益受损等不利后果，均由登记申请人自行承担一切法律责任及由此造成的经济损失。
      </div>
    </div>

    <!-- Popups -->
    <van-calendar v-model:show="showCalendar" @confirm="onDateConfirm" color="#2b7afb" />
    
    <!-- 项目名称搜索选择器 -->
    <van-popup v-model:show="showProjectPicker" position="bottom" :style="{ height: '60%' }">
      <div class="picker-header">
        <div class="header-title">中国梦项目名称选择</div>
      </div>
      <div class="search-container">
        <van-field
          v-model="projectSearchText"
          placeholder="搜索选项"
          @input="filterProjects"
          clearable
          @change="filterProjects"
        />
      </div>
      <div class="picker-content">
        <div
          v-for="item in filteredProjects"
          :key="item.value"
          class="picker-item"
          :class="{ active: selectedProject === item.value }"
          @click="selectedProject = item.value"
        >
          {{ item.text }}
        </div>
        <div v-if="filteredProjects.length === 0" class="no-result">
          无搜索结果
        </div>
      </div>
      <div class="picker-footer">
        <van-button 
          block 
          type="primary" 
          round 
          @click="confirmProjectSelection"
        >
          确认选择
        </van-button>
      </div>
    </van-popup>

    <!-- 资产范围搜索选择器 -->
    <van-popup v-model:show="showAssetPicker" position="bottom" :style="{ height: '60%' }">
      <div class="picker-header">
        <div class="header-title">项目未下发资产选择</div>
      </div>
      <div class="search-container">
        <van-field
          v-model="assetSearchText"
          placeholder="搜索选项"
          @input="filterAssets"
          clearable
          @change="filterAssets"
        />
      </div>
      <div class="picker-content">
        <div
          v-for="(item, index) in filteredAssets"
          :key="item.value"
          class="picker-item"
          :class="{ active: selectedAsset === item.value }"
          @click="selectedAsset = item.value"
        >
          {{ item.text }}
        </div>
        <div v-if="filteredAssets.length === 0" class="no-result">
          无搜索结果
        </div>
      </div>
      <div class="picker-footer">
        <van-button 
          block 
          type="primary" 
          round 
          @click="confirmAssetSelection"
        >
          确认选择
        </van-button>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { addAssetFiling } from '@/api/assets'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const showPhone = ref(false)
const showIdCard = ref(false)

// 从用户存储中获取信息
const userInfo = computed(() => {
  const info = userStore.userInfo || {}
  return {
    realName: info.realName || '未获取',
    phone: info.phonenumber ? hidePhone(info.phonenumber) : '未获取',
    fullPhone: info.phonenumber || '未获取',
    idCard: info.idNumber ? hideIdCard(info.idNumber) : '未获取',
    fullIdCard: info.idNumber || '未获取'
  }
})

// 隐藏手机号
const hidePhone = (phone) => {
  if (!phone) return ''
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

// 隐藏身份证号
const hideIdCard = (idCard) => {
  if (!idCard) return ''
  return idCard.replace(/(\d{6})\d{8}(\d{4})/, '$1********$2')
}

onMounted(() => {
  // 确保用户信息已加载
  if (!userStore.userInfo) {
    userStore.refreshUserInfo()
  }
})

const formData = reactive({
  date: '',
  project: '',
  asset: '',
  assetIndex: 0
})

const projectColumns = [
  '数字人民币-国际版', '民生资产', '盛世中华', '数字信用', '数字人民币-红利版', '数字人民币-测试版', '数字人民币-正式版', '大基金三期', '碳达峰', '绿途', '圆梦钱包', '东数西算', '云数贸', '圆梦行动', '爱心传递', '马尔代夫', '金砖', '国家能源', '慈善联盟', '中银保', '中华新能', '中华云泊', '华信达', '一带一路', '中国制造2025', '领航新富', '中国地产', '中国芯', '华尔街', '央数钱包', '数字财富', '乡村振兴', '银联支付', '易支付', '两重宏利', '中国共富', '科教兴国', '数字中国', '特别国债', '东方红', '国芯科技', '云泊控股', '中国商飞', '西部大开发', '碳中和', '四通八达', '北网能源', '中国电建', '中联创投', '大狮', '中国物联', '海南发展', '中梦晨曦', '泓基大业', '国裕众富', '中新源', '阿里数农', '数字农业', '天行健', '海油国际', '台海通道', '共建大湾区', '空间壹号', 'e租宝', '雄安地产', '元宇宙NFT', '大一统', '中华民生', '智天交易所', '聚焦三农', '荟支付', '审计通', '汇银通', '中国三农', '千万工程', '中银香港', '扩大内需', '中芯国际', '饿了么', '中国债券', '云数贸信托基金', '云数贸智天财富', '智天金融', '五行云数币', '十四五数字经济', '世界银行全球募股', '张健股权回归', '张健基金', '中国圆梦扶贫办', 'WXB数字币', '中华基建', '中华思源', '中华圆梦', '中科扶贫', '中信建设', '中粮惠农', '民生公署', '丰民财富', '神州星链', '博时养老', '云健惠', '大衍五行文化', '东方G保', '农业经济', '蓝天计划', '腾讯数字经济', '国际数权商城', '富国基金', 'YSM国际数字货币', 'YSM黄金', 'YSM原始股', '环球币交易所', '百姓财富', '云财富', '北京数字资产', '云泊', '华夏云投', '民享矿业', '爱心基金会', '阿里新农', '慈善基金', '善心汇', '赤子虹济贫', '扶贫代账', '中国环球国际集团', '中国智云基金协会', '中国云交易所', '中国云数', '中国云梦', '中国政企', '中国龙芯', '中国养老', '中云政务', '中华资产', '中油节能', '中财富', '福利中国', '国家扶贫109会议', '国家超级工程项目', '国债经济', '国计民生', '云数贸开网大会', '云财富钱包', '云数字人民币', '云数京东', '云数中国', '五行联盟', '五行链', '特殊行业大系统', '陆地海鲜投资项目', '海外万亿资产', '五行银行', '圆梦家园', '尚鹏高科', '时间银行', '阳光工程', '智天世界银行', '云数贸系列卡', '人民新家园', '国营钱包', '云数国际', '云梦中国', '寰球智算', '华为世界', '华为科技股', '小米汽车', '中国发展', '善心众扶', '国之重器', '中华盛世', '智慧中国', '国有军工', '中国数字', '中国人民银行', '中国黄金', '海洋强国', '科技强国', '云数科技', '人脉联盟', '农业强国', '币界', '佰业数联', '怡和高科', '华润', '惠康之家', '红满天', '天宫国际', '科创国际', '国家圆梦基金', '海南省政务', '普渡经济', '新江新能源', '云信通', '中共住建部', '盛港房产', '云数结算', '云数贸系列实体卡', '亚元', '华云社', '国际梅协', '国民战略', '国网3900', '精准扶贫', '红杉创投', '鸿蒙支付', '强国复兴', '民富国强', '民族大业', '三农事业', '元宇宙', '爱满中华', '亚投行', '中华大健康', '投资中国', '乐施会', '中财光伏', '华夏民生', '乡基金', '智天金融冯宝成团队', '中国圆梦', '中央数字货币YNBC', '天稻子国家5G', '中新黑金卡', '小米支付', '博览共享', '大健康', '辉煌中国', '国众经济', '扶贫代赈', '丝绸工程', '中国乡村', '人海战术', '快递扶贫', '全民持股', '绿地香港', '鲜农都', '宁德储能', '天悦旅游', '民间互助理财', '健康中国三期', '中国算力', '国土空间', '绿果', '两重微力量', '济深基金', '云汇', '云贸数字', '腾讯支付', '中国6G', '普惠工程', '财富宝', '中合万家', '宝石外汇', '乡基会', '云数网格', '联众投', '蚂蚁集团', '派付通', 'π币', '中云香港', '中绿生物', '沙盒计划', '情系三农', '千年雄安', '国网', '走进海南', '中华援疆', '超级工程', '自由生态', '绿能碳汇', '长城云梦', '人人富', '华为钱包', '大国重器', '健享银行', '中国南光', '华脉', '百姓扶贫', '养老育小', '数字乡村', '社会帮扶', '国行钱包', '新时代水利', '星企中扶', '智慧农业', '海富证劵', '众心社区', '全民智能', '中销联合', '财政创投', '三生中国', '丝路基金', '中国双创', '未来健康', '网联支付', '央行钱包', '利民健康', '金砖国家', '中港石油', '汇鑫三农', '港府绿建', '云天共富', '八纵八横', '云商贸', '爱心连线', '智创未来', '建行钱包', '中慈联', '爱心惠民', '惠民工程', '金砖银行', '云讯一卡通', '张健红包', '张健国库', '精英汇', '城乡建设', '雄安集团', '国家清算', '世界智天银行', '文泰众投', '大国崛起', '智天支付', '五行共富', '云财富数字', '新时代', '圆梦令', '圆梦之星', '大业难民扶贫', '云东风', '阳光养老', '财政部扶贫', '雄安四项', '金汇泰', '汇股联盟', '华夏传承', '应科院', '环球智投', '全球发展', '中国华能', '高质民生工程', '航天育种', '国家新能源', '中国国新华夏之脉', '万众创新', '云数创世', '云数E家', '中国人寿', '世界之家', '国家大基金', '中航科技', '国行融投', '云归令', '智天银行', '明富资产', '人民财产', '众云国际', '世联通证', '国货中国', '共享数字', '中华资产交易所', '五行天下', '中国梦3260', '幸福共享', '张健天才基金', '国建地产', '中国科技', '华夏老年网', '神州国际', '聚汇天下', '斑马智付', '云数房票', '云港盛世', '金山能源', '中国创富', '银联钱包', '镭达钱包', '中国消费网', '世界云联', '光大环境', '东方财富', '远东国际', '雄安未来', '中国万企', '华为资产', '民债清查', '金砖钱包', '云数统计', '张健信用卡', '华夏国际', '同心基金', '国台基金', '云澳时代', '云健集团', '百姓互济', '云安商会', '普惠金融', '五行数字银行', '五行交易所', '五行文化', '万家基金', '云梦中华', '华夏人民网', '中国诚通', '云数清算', '云粮仓', '众益鑫', '盛世通', '中金亿投', '未来物联网', '770物联网', '中国社保', '共享村长', '中国普惠商城', '哥伦布', '连锁经营1040', '循环经济', '中网智媒', '经济建设', '亚数科技', 'AMBC非洲金矿', '复兴资本', '中租电厂', '全民共享', '天华集团', '先正达', 'MBI', '股金钱包', '创新中国', '安行宝', '强国建设', '广药集团', '国有资产', '中国融通', '中国稳定币', '阿里跨境', '智天资本', '中管金融', '良资', '中国数贸', '国开先行', '金卖购', '禾元农场', '庞博集团', '中国升海集团', '五行币', '北斗', '以旧换新', '圆梦中华', '云联惠', '全球物联', '美酷', '德资本', '吉祥北斗', '美丽中国', '长期国债', '盛世金砖', '云通证', 'DCEP', '红帮', '云鼎', '正宇', '云支付', '云吉祥', '国民至尊卡', '越花越有', '至尊卡', '中国物联网分享经济平台', '博蓝共享', '新巷岛新能源', '合发全球', '人人家', '华云数字', '圆梦云聊', '云时代', '中国商会商务分享经济', '公共网络项目', '世界银行', '巨龙商城', '百姓国货', '环球币', '智向未来', '云酒窖', '一老一小', 'DGC', '中国保利', '龙爱量子', '民政2025年', '中芯控股', '国债中长期', '悦花越有', '氢能源', '华为扶贫', '精英团队', '微视传媒', '盛临九州', '中国船舶', '黑茶业', '满星云', '至尊香港', '祥天控股', '中新基建', '昌盛', '云宇宙', '云众志', '健信达', '健同合力', '步步盈', '凝聚未来', '健选商域', '阿里数字', 'GCC', '物联网分享经济平台', '云合作社', 'ISCM全球供应链', '富民计划', '云济会', '雪花量化', '低空经济', '睿途低空', '九大奇迹', '方圆基金会', '泰康君盟', '至尊中草堂', '京喜商城', '富强联盟', '中国物流', '移动支付', '国债逆回购', '共富工程', 'MFC', '双碳', '中国商务商会分享经济私募基金', '五化联盟', '为众归一', '杭州P2P', '股享微天使', '高通证卷', '盛大娱乐', '富润万家', '国珍优选', '国家湿地', '中国数字商业集团', '国投基金', '赋泽谷', '云数贸联盟网', 'PPP基金', '爱心守护计划', '扶云国际', '鸿飞计划', '互通宝', '华茂', '陆地海鲜', '梦享家园', '天佳牧业公司', '南京玄祥公司', '非洲电力', '中扶在线', '中国矿业', '神农云健康', '汇德民生', '民生保障网', '时代系', '新诗卷', '盖网', '绿碳', '中国明明商', '云善堂', 'CAE非洲金矿', 'T宝支付', '国玺', '正信金安', '聚龙国际', '全球贸易交易所', '钜富外汇', '人民通惠', '沃尔克外慧理财', '立创慧得', '中奇创客联盟', '红梅集团', '新质动力', '五行币钱包', '环球数贸', '环球医疗', '数创云板块', '地平集团', '幸福万家', '融通为民', '合商', '国脉天网', '5G3次方', 'PCN', '华夏抗癌', '乾易通', '正宇科技', '张健系列卡', '一九爱心', '好玩吧', '金佳', '罗麦', '呼之即来', '微讯', '紫檀花', '锦丰资管', '财行通', '夕阳红', '华夏社区', '中民国营', '小蝴蝶国际社区', '共赴小康', '凤凰新能源', '虹科技', '中国梦护贫保险', '车联网', 'BD通证', '超信通证', '助力中医', '五行区块链', '茶友会', '鸿尊付', '天津和治药业', '兴中天', '海汇国际', '博鑫理财', '人民国库', '十四五规划', '中京联盟', '大圣机器人', '时世赢', '旭日物联', '物联网数字货币', '物质卡项目', '海南中建', '澳娱理财', '元帅勋章', '全民健身富裕', '惠民保', '中国崛起', '供销社', '汇聚英', '中信信托', '大唐天下', '中云集团', '中云AI', '华人华侨区块链', '秦皇岛', '非州矿业', '人民至上', '义洲国际', '中国新征程', '中扶富民', '花瓣支付', '128红色大财团数字资产', '距达币', '创业天下', '久和生医', 'YouBank', '数字众智', '网红云商', '云梦集团', '东夷国际', '北斗生态圈', '百家利', '壹众', '银发社区', '赞友商城', '新社惠农', '央网扶持', '华英会', '京东稳定币', '神州智电', '中国强农', '中国人际网'
].filter(item => item && item.trim()).map(item => ({ text: item, value: item }))

const assetColumns = [
  '0-100万','100万-500万','500万-1000万','1000万-5000万','5000万-1亿'
].filter(item => item && item.trim()).map(item => ({ text: item, value: item }))

const showCalendar = ref(false)
const showProjectPicker = ref(false)
const showAssetPicker = ref(false)

// 搜索相关数据
const projectSearchText = ref('')
const assetSearchText = ref('')
const loading = ref(false)
const finished = ref(true)

// 选中的数据
const selectedProject = ref('')
const selectedAsset = ref('')

// 过滤后的数据
const filteredProjects = ref([...projectColumns])
const filteredAssets = ref([...assetColumns])

const onDateConfirm = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  formData.date = `${year}-${month}-${day}`
  showCalendar.value = false
}

// 防抖函数
const debounce = (func, delay) => {
  let timeoutId
  return function() {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(this, arguments), delay)
  }
}

// 过滤项目名称
const filterProjects = debounce(() => {
  const searchText = projectSearchText.value.toLowerCase().trim()
  if (!searchText) {
    filteredProjects.value = [...projectColumns]
  } else {
    filteredProjects.value = projectColumns.filter(item => 
      item.text.toLowerCase().includes(searchText)
    )
  }
}, 300)

// 过滤资产范围
const filterAssets = debounce(() => {
  const searchText = assetSearchText.value.toLowerCase().trim()
  if (!searchText) {
    filteredAssets.value = [...assetColumns]
  } else {
    filteredAssets.value = assetColumns.filter(item => 
      item.text.toLowerCase().includes(searchText)
    )
  }
}, 300)

// 确认项目选择
const confirmProjectSelection = () => {
  if (selectedProject.value) {
    const selectedItem = projectColumns.find(item => item.value === selectedProject.value)
    if (selectedItem) {
      formData.project = selectedItem.text
    }
  }
  showProjectPicker.value = false
  projectSearchText.value = ''
  selectedProject.value = ''
  filterProjects() // 重置过滤
}

// 确认资产选择
const confirmAssetSelection = () => {
  if (selectedAsset.value) {
    const selectedIndex = assetColumns.findIndex(item => item.value === selectedAsset.value)
    const selectedItem = assetColumns[selectedIndex]
    if (selectedItem) {
      formData.asset = selectedItem.text
      formData.assetIndex = selectedIndex + 1 // 索引从1开始
    }
  }
  showAssetPicker.value = false
  assetSearchText.value = ''
  selectedAsset.value = ''
  filterAssets() // 重置过滤
}

const handleSubmit = async () => {
  if (!formData.date || !formData.project || !formData.asset) {
    showToast('请填写完整信息')
    return
  }
  
  try {
    const params = {
      amountScope: formData.assetIndex,
      participateDt: formData.date,
      projectName: formData.project
    }
    
    const res = await addAssetFiling(params)
    if (res.code === 200) {
      // 刷新用户信息，确保资产备案数等数据最新
      await userStore.refreshUserInfo()
      
      showToast('提交成功')
      setTimeout(() => {
        router.back()
      }, 1500)
    } else {
      showToast(res.msg || '提交失败')
    }
  } catch (error) {
    console.error('Submit failed:', error)
    showToast('提交失败，请稍后重试')
  }
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f5f7fa;
  padding-bottom: 80px; /* Increased padding for tabbar */
}

.header-bg {
  height: 240px;
  background: url('@/assets/资产/asset-filing-header-bg.png') no-repeat top center;
  background-size: 100% auto;
  position: relative;
}

.nav-bar {
  background: transparent;
  --van-nav-bar-title-text-color: #fff;
  --van-nav-bar-icon-color: #fff;
  --van-nav-bar-title-font-size: var(--font-size-large);
  --van-nav-bar-title-font-weight: bold;
}

:deep(.van-nav-bar__title) {
  color: #fff;
}

.content {
  padding: 0 16px;
  margin-top: -50px;
  position: relative;
  z-index: 1;
}

.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 20px;
  margin-bottom: 24px;
}

.user-info-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #2b7afb;
}

.info-rows {
  flex: 1;
}

.info-row {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  font-size: var(--font-size-small);
  color: #333;
}

.info-row:last-child {
  margin-bottom: 0;
}

.label {
  color: #333;
  width: 80px;
}

.value {
  color: #333;
  font-weight: 500;
}

.eye-icon {
  margin-left: 8px;
  color: #2b7afb;
  font-size: 16px;
}

.logo img {
  width: 80px;
  height: auto;
}

.section-title {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  font-weight: bold;
  font-size: var(--font-size-base);
  color: #333;
}

.section-title .text {
  margin-left: 8px;
}

.form-card {
  background: white;
  border-radius: 12px;
  padding: 0 20px;
  margin-bottom: 30px;
}

.form-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid #eee;
  font-size: var(--font-size-small);
}

.form-item:last-child {
  border-bottom: none;
}

.form-label {
  color: #333;
  font-weight: 500;
}

.form-value {
  color: #333;
  font-weight: 500;
}

.form-value.placeholder {
  color: #2b7afb;
}

.submit-btn-wrapper {
  margin-bottom: 24px;
}

.submit-btn {
  background: #2b7afb;
  border: none;
  height: 48px;
  font-size: var(--font-size-base);
  font-weight: bold;
  box-shadow: 0 4px 10px rgba(43, 122, 251, 0.3);
}

.notice {
  font-size: var(--font-size-xs);
  color: #333;
  line-height: 1.6;
  text-align: justify;
  padding: 0 4px;
}

.dot {
  color: #2b7afb;
  margin-right: 4px;
}

/* 自定义选择器样式 */
.picker-header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  background-color: #fff;
}

.header-title {
  font-size: var(--font-size-base);
  font-weight: bold;
  color: #333;
  text-align: center;
}

.no-result {
  padding: 40px 0;
  text-align: center;
  color: #999;
  font-size: var(--font-size-small);
}

.search-container {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  background-color: #fff;
}

.search-container .van-field {
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  overflow: hidden;
}

.search-container .van-field__control {
  font-size: var(--font-size-small);
}

.picker-content {
  height: calc(100% - 200px);
  overflow-y: auto;
  background-color: #fff;
}

.picker-item {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  font-size: var(--font-size-small);
  color: #333;
  cursor: pointer;
  position: relative;
}

.picker-item:active {
  background-color: #f5f7fa;
}

.picker-item.active {
  color: #2b7afb;
  background-color: #f5f7fa;
}

.picker-footer {
  padding: 16px;
  border-top: 1px solid #f0f0f0;
  background-color: #fff;
}

.picker-footer .van-button {
  height: 44px;
  font-size: var(--font-size-base);
  font-weight: bold;
  background-color: #2b7afb;
  border: none;
}

.picker-footer .van-button:hover {
  background-color: #1a66e5;
}

.picker-footer .van-button:active {
  background-color: #0f52c1;
}
</style>