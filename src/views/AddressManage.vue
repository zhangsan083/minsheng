<template>
  <div class="page">
    <div class="header">
      <van-nav-bar
        title="地址管理"
        left-arrow
        @click-left="onClickLeft"
        :border="false"
        class="nav-bar"
      />
    </div>

    <div class="content">
      <!-- Empty State -->
      <div v-if="!isEditing && addressList.length === 0" class="empty-state">
        <div class="empty-card">
          <div class="empty-icon">
            <!-- Simple placeholder icon using CSS/SVG or Vant icon -->
            <van-icon name="description" size="64" color="#ddd" />
          </div>
          <div class="empty-text">您暂未设置收货地址</div>
        </div>
        <van-button type="primary" block round color="var(--blue-gradient)" class="action-btn" @click="startAdd">
          立即设置
        </van-button>
      </div>

      <!-- List State -->
      <div v-else-if="!isEditing && addressList.length > 0" class="list-state">
        <div class="address-list">
          <div 
            v-for="(item, index) in addressList" 
            :key="item.id" 
            class="address-card" 
            :class="{ 'address-card--active': isSelecting && String(item.id) === String(selectedId) }"
            @click="onSelect(item)"
          >
            <div class="card-title">
              我的地址
              <van-tag v-if="item.isDefault" type="danger" round style="margin-left: 8px">默认</van-tag>
              <van-tag v-if="isSelecting && String(item.id) === String(selectedId)" type="primary" style="margin-left: 8px">当前选择</van-tag>
            </div>
            <div class="card-info">
              <div class="info-row">
                <span class="name">{{ item.realName }}</span>
                <span class="phone">{{ item.phonenumber }}</span>
                <div class="actions">
                  <div class="action-item" @click.stop="deleteAddress(index)">
                    <van-icon name="delete-o" /> 删除
                  </div>
                </div>
              </div>
              <div class="info-row address-row">
                <span class="address-text">{{ item.address }}</span>
                <div class="actions">
                  <div class="action-item" @click.stop="editAddress(item)">
                    <van-icon name="edit" /> 编辑
                  </div>
                </div>
              </div>
              <div class="default-row" @click.stop>
                <van-checkbox v-model="item.isDefault" :true-value="1" :false-value="0" @click="setDefault(index)">
                  {{ item.isDefault ? '已设为默认地址' : '设为默认地址' }}
                </van-checkbox>
              </div>
            </div>
          </div>
        </div>
        
        <div class="fixed-bottom">
           <van-button type="primary" block color="var(--blue-gradient)" class="add-btn" @click="startAdd">
            添加新地址
          </van-button>
        </div>
      </div>

      <!-- Form State -->
      <div v-else class="form-state">
        <div class="form-card">
          <div class="form-title">设置地址</div>
          <van-form @submit="onSubmit">
            <van-field
              v-model="formData.realName"
              name="realName"
              label="收件人"
              placeholder="请输入收件人真实姓名"
              input-align="right"
            />
            <van-field
              v-model="formData.phonenumber"
              name="phonenumber"
              label="手机号"
              placeholder="请输入手机号"
              input-align="right"
            />
            <van-field
              v-model="formData.address"
              name="address"
              label="收货地址"
              placeholder="省/市/县/详细地址"
              input-align="right"
            />
            <div class="form-submit">
              <van-button block type="primary" color="var(--blue-gradient)" native-type="submit">
                确认
              </van-button>
            </div>
          </van-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast, showDialog } from 'vant'
import 'vant/es/dialog/style'
import 'vant/es/toast/style'
import { getAddressList, saveAddress, setDefaultAddress, removeAddress } from '@/api/address'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const isEditing = ref(false)
const addressList = ref([])
// 是否处于选择模式
const isSelecting = computed(() => route.query.source === 'exchange')
// 当前选中的地址ID
const selectedId = computed(() => {
  const id = route.query.selectedId
  // 如果是 'undefined' 字符串或 undefined/null，返回空字符串，避免匹配错误
  if (!id || id === 'undefined' || id === 'null') return ''
  return String(id)
})

const formData = reactive({
  id: null,
  realName: '',
  phonenumber: '',
  address: '',
  isDefault: 0
})

const onSelect = (item) => {
  // 如果是从商品详情页跳转过来的（带有 source=exchange 参数），则执行选择逻辑
  if (isSelecting.value) {
    userStore.setSelectedAddress(item)
    // 返回时带上 popup=1 参数，确保详情页能识别并打开弹框
    // 注意：router.back() 无法带参数，所以这里改用 replace 跳转回详情页
    // 假设详情页路径是 /product/:id，我们需要从当前路由的历史记录或 query 中获取来源 ID
    // 但更简单的方式是：直接 replace 回上一页（如果上一页就是详情页）
    // 或者，我们可以依赖 store 中的 selectedAddress 来触发弹框（ProductDetail 已实现此逻辑）
    // 为了更稳健，我们尝试 replace 到 referrer 或者 back
    router.back()
  }
}

const loadData = async () => {
  try {
    const res = await getAddressList()
    if (res.code === 200) {
      addressList.value = res.data || []
    } else {
      showToast(res.msg || '获取地址列表失败')
    }
  } catch (error) {
    console.error('Failed to load address list:', error)
    showToast('获取地址列表失败')
  }
}

onMounted(() => {
  loadData()
})

const onClickLeft = () => {
  if (isEditing.value) {
    isEditing.value = false
  } else {
    router.back()
  }
}

const startAdd = () => {
  formData.id = null
  formData.realName = ''
  formData.phonenumber = ''
  formData.address = ''
  formData.isDefault = 0
  isEditing.value = true
}

const editAddress = (item) => {
  formData.id = item.id
  formData.realName = item.realName
  formData.phonenumber = item.phonenumber
  formData.address = item.address
  formData.isDefault = item.isDefault
  isEditing.value = true
}

const deleteAddress = (index) => {
  showDialog({
    title: '提示',
    message: '确认删除该地址吗？',
    showCancelButton: true,
  }).then(async () => {
    try {
      const item = addressList.value[index]
      const res = await removeAddress(item.id)
      if (res.code === 200) {
        showToast('删除成功')
        loadData()
      } else {
        showToast(res.msg || '删除失败')
      }
    } catch (error) {
      console.error('Failed to delete address:', error)
      showToast('删除失败')
    }
  }).catch(() => {
    // cancel
  })
}

const setDefault = async (index) => {
  const item = addressList.value[index]
  
  // If already default, do nothing (or we could allow un-setting, but usually default is a radio behavior)
  // However, the checkbox toggles value before click.
  // Actually, let's just send the request.
  
  try {
    const res = await setDefaultAddress({ id: item.id })
    if (res.code === 200) {
      showToast('设置成功')
      loadData() // Refresh list to reflect changes
    } else {
      showToast(res.msg || '设置失败')
      // Revert change if needed, but loadData will fix it
      loadData()
    }
  } catch (error) {
    console.error('Failed to set default address:', error)
    showToast('设置失败')
    loadData()
  }
}

const onSubmit = async () => {
  if (!formData.realName || !formData.phonenumber || !formData.address) {
    showToast('请填写完整信息')
    return
  }

  const params = {
    ...formData,
    // Add consumerId if available in store
    consumerId: userStore.userInfo?.id
  }

  // If adding, remove id if it's null (or keep it null if backend accepts it)
  // Based on user input, id might be expected as user id? But let's stick to standard first.
  if (!params.id) {
    delete params.id
  }

  try {
    const res = await saveAddress(params)
    if (res.code === 200) {
      showToast('保存成功')
      isEditing.value = false
      loadData()
    } else {
      showToast(res.msg || '保存失败')
    }
  } catch (error) {
    console.error('Failed to save address:', error)
    showToast('保存失败')
  }
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f7f8fa;
  padding-bottom: 20px;
}

.header {
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
  padding: 0 16px;
  margin-top: -160px;
  position: relative;
  z-index: 1;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.empty-card {
  background: #fff;
  border-radius: 12px;
  padding: 40px 20px;
  text-align: center;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.empty-icon {
  margin-bottom: 16px;
}

.empty-text {
  color: #999;
  font-size: var(--font-size-small);
}

.action-btn {
  margin-top: 20px;
}

/* List State */
.list-state {
  padding-bottom: 80px;
}

.address-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
}

.address-card--active {
  border: 1px solid var(--blue-deep);
  background-color: #e6f7ff;
}

.card-title {
  font-size: var(--font-size-base);
  font-weight: bold;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: var(--font-size-small);
}

.address-row {
  align-items: flex-start;
  margin-bottom: 16px;
}

.name {
  color: #333;
  margin-right: 12px;
  font-weight: 500;
}

.phone {
  color: #333;
  flex: 1;
  font-weight: 500;
}

.address-text {
  color: #666;
  flex: 1;
  margin-right: 12px;
  line-height: 1.4;
  font-size: var(--font-size-small);
}

.actions {
  display: flex;
  gap: 16px;
}

.action-item {
  color: #666;
  font-size: var(--font-size-xs);
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 500;
}

.default-row {
  border-top: 1px solid #f5f5f5;
  padding-top: 12px;
}

.fixed-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: #fff;
  z-index: 10;
}

/* Form State */
.form-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
}

.form-title {
  font-size: var(--font-size-base);
  font-weight: bold;
  margin-bottom: 16px;
  padding-left: 16px;
}

.form-submit {
  margin-top: 30px;
  padding: 0 16px 16px;
}
</style>
