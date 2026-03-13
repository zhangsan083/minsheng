<template>
  <div class="filing-record">
    <div class="header-bg"></div>
    <van-nav-bar
      title="存档备案"
      left-arrow
      @click-left="$router.back()"
      :border="false"
      class="custom-nav"
    />
    
    <div class="content">
      <div class="main-card">
        <div class="card-header">
          <span class="title">备案资料提交</span>
          <span class="status-tag">状态:信息已完善</span>
        </div>
        
        <div class="card-body">
          <div class="description-box">
            <div class="bullet-point">●</div>
            <div class="text">
              大额资产在央行（或通过商业银行向央行）存档报备，是现代金融监管体系中的一项核心制度，其根本目的是维护国家金融安全、打击违法犯罪、保障经济秩序稳定。这不仅仅是简单的“登记”，而是一个涉及反洗钱、反恐怖融资、反腐败、维护金融稳定等多重目标的复杂系统。
            </div>
          </div>

          <!-- 01 兑付编号 -->
          <div class="form-section">
            <div class="section-title">
              <div class="indicator"></div>
              <span>01 兑付编号</span>
            </div>
            <div class="form-content-box">
              <div class="label-text">兑付编号</div>
              <div class="input-row">
                <div class="custom-input-wrapper">
                  <input type="text" v-model="form.paymentNo" placeholder="000000000000" class="custom-input" />
                </div>
                <van-button type="primary" size="small" class="action-btn">获取</van-button>
              </div>
            </div>
          </div>

          <!-- 02 房产编号 -->
          <div class="form-section">
            <div class="section-title">
              <div class="indicator"></div>
              <span>02 房产编号</span>
            </div>
            <div class="form-content-box">
              <div class="label-text">房产编号</div>
              <div class="input-row">
                <div class="custom-input-wrapper">
                  <input type="text" v-model="form.propertyNo" placeholder="000000000000" class="custom-input" />
                </div>
                <van-button type="primary" size="small" class="action-btn">获取</van-button>
              </div>
            </div>
          </div>

          <!-- 03 数字资产编号 -->
          <div class="form-section">
            <div class="section-title flex-between">
              <div class="left">
                <div class="indicator"></div>
                <span>03 数字资产编号</span>
              </div>
              <div 
                class="right-action dashed-btn" 
                @click="showAssetInput = true" 
                :class="{ 'active': showAssetInput }"
              >
                <div class="plus-icon-bg">
                  <van-icon name="plus" color="#fff" size="10" />
                </div>
                <span class="action-text">新增编号</span>
              </div>
            </div>
            <div class="form-content-box">
              <div class="complex-input-group">
                <div class="input-row full-width mb-10">
                  <div class="custom-input-wrapper">
                    <input type="text" v-model="form.assetNo" placeholder="000000000000" class="custom-input" />
                  </div>
                </div>
                <div class="input-row" v-if="showAssetInput">
                  <div class="custom-input-wrapper select-wrapper">
                    <span class="placeholder-text" v-if="!form.assetSelected">尚未选择编号</span>
                    <span class="value-text" v-else>{{ form.assetSelected }}</span>
                    <van-icon name="arrow-down" color="#999" />
                  </div>
                  <van-button type="primary" size="small" class="action-btn" @click="handleSelectAsset">选择</van-button>
                </div>
              </div>
            </div>
          </div>

          <!-- 04 惠民保订单 -->
          <div class="form-section">
            <div class="section-title flex-between">
              <div class="left">
                <div class="indicator"></div>
                <span>04 惠民保订单</span>
              </div>
              <div 
                class="right-action dashed-btn" 
                @click="showInsuranceInput = true" 
                :class="{ 'active': showInsuranceInput }"
              >
                <div class="plus-icon-bg">
                  <van-icon name="plus" color="#fff" size="10" />
                </div>
                <span class="action-text">新增编号</span>
              </div>
            </div>
            <div class="form-content-box">
              <div class="complex-input-group">
                <div class="input-row full-width mb-10">
                  <div class="custom-input-wrapper">
                    <input type="text" v-model="form.insuranceNo" placeholder="000000000000" class="custom-input" />
                  </div>
                </div>
                <div class="input-row" v-if="showInsuranceInput">
                  <div class="custom-input-wrapper select-wrapper">
                    <span class="placeholder-text" v-if="!form.insuranceSelected">尚未选择编号</span>
                    <span class="value-text" v-else>{{ form.insuranceSelected }}</span>
                    <van-icon name="arrow-down" color="#999" />
                  </div>
                  <van-button type="primary" size="small" class="action-btn" @click="handleSelectInsurance">选择</van-button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div class="footer-buttons">
        <van-button type="primary" class="footer-btn save">保存</van-button>
        <van-button type="primary" class="footer-btn submit">确认提交</van-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const form = ref({
  paymentNo: '',
  propertyNo: '',
  assetNo: '',
  insuranceNo: '',
  assetSelected: '',
  insuranceSelected: ''
});

const showAssetInput = ref(false);
const showInsuranceInput = ref(false);

const handleSelectAsset = () => {
  // Logic to handle selection or validation can be added here
  // For now, simply hide the input section as requested
  showAssetInput.value = false;
};

const handleSelectInsurance = () => {
  // Logic to handle selection or validation can be added here
  // For now, simply hide the input section as requested
  showInsuranceInput.value = false;
};
</script>

<style lang="scss" scoped>
.filing-record {
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
    }
    :deep(.van-icon) {
      color: #fff;
    }
  }

  .content {
    position: relative;
    z-index: 1;
    padding: 10px 16px;
    margin-top: 10px;

    .main-card {
      background: #fff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);

      .card-header {
        background: linear-gradient(90deg, #2b7afb 0%, #0052d9 100%);
        padding: 12px 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .title {
          color: #fff;
          font-size: 16px;
          font-weight: bold;
        }

        .status-tag {
          background: rgba(255, 255, 255, 0.2);
          color: #fff;
          font-size: 12px;
          padding: 2px 8px;
          border-radius: 4px;
        }
      }

      .card-body {
        padding: 16px;

        .description-box {
          background: #f7f8fa;
          border-radius: 8px;
          padding: 12px;
          display: flex;
          gap: 8px;
          margin-bottom: 20px;

          .bullet-point {
            color: #1989fa;
            font-size: 12px;
            margin-top: 2px;
          }

          .text {
            color: #666;
            font-size: 13px;
            line-height: 1.6;
            text-align: justify;
          }
        }

        .form-section {
          margin-bottom: 20px;

          .section-title {
            display: flex;
            align-items: center;
            margin-bottom: 16px;
            padding-bottom: 12px;
            border-bottom: 1px solid #ebedf0;
            font-size: 15px;
            font-weight: bold;
            color: #333;

            &.flex-between {
              justify-content: space-between;
              
              .left {
                display: flex;
                align-items: center;
              }
            }

            .indicator {
              width: 3px;
              height: 14px;
              background: #1989fa;
              margin-right: 8px;
            }

            .right-action {
              display: flex;
              align-items: center;
              gap: 4px;
              
              .action-text {
                color: #1989fa;
                font-size: 13px;
                font-weight: normal;
              }

              &.dashed-btn {
                /* Remove dashed border as requested */
                border: none; 
                padding: 4px 10px;
                transition: all 0.3s;
                
                .action-text {
                  font-size: 13px;
                  font-weight: 500;
                  margin-left: 2px;
                }

                .plus-icon-bg {
                  width: 16px;
                  height: 16px;
                  background-color: #1989fa;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                }

                &.active {
                  background: transparent;
                  border: 1px dashed #1989fa; /* Keep border only when active/clicked */
                  
                  .action-text {
                    color: #1989fa;
                  }
                  
                  /* Icon stays same */
                }
              }
            }
          }

          .form-content-box {
            background: #f7f8fa;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 24px;
          }

          .complex-input-group {
            .input-row {
              &.mb-10 {
                margin-bottom: 10px;
              }
            }
          }

          .label-text {
            font-size: 14px;
            color: #666;
            margin-bottom: 8px;
            font-weight: 500;
          }

          .input-row {
            display: flex;
            gap: 10px;
            align-items: center;

            &.full-width {
              .custom-input-wrapper {
                width: 100%;
              }
            }

            .custom-input-wrapper {
              flex: 1;
              background: #fff; /* Changed from #f5f5f5 */
              border-radius: 6px;
              padding: 10px 12px;
              border: 1px solid #ebedf0; /* Add slight border to input */
              
              &.select-wrapper {
                display: flex;
                justify-content: space-between;
                align-items: center;
                
                .placeholder-text {
                  color: #999;
                  font-size: 14px;
                }
                
                .value-text {
                  color: #333;
                  font-size: 14px;
                }
              }
              
              .custom-input {
                width: 100%;
                border: none;
                background: transparent;
                font-size: 14px;
                color: #333;
                
                &::placeholder {
                  color: #999;
                }
                
                &:focus {
                  outline: none;
                }
              }
            }

            .action-btn {
              width: 60px;
              border-radius: 6px;
              background: #0099ff; // Slightly lighter blue as in screenshot
              border: none;
            }
          }
        }
      }
    }

    .footer-buttons {
      margin-top: 30px;
      display: flex;
      gap: 16px;
      justify-content: center;

      .footer-btn {
        width: 140px;
        height: 44px;
        border-radius: 22px;
        font-size: 16px;
        border: none;

        &.save {
          background: linear-gradient(90deg, #448ef6 0%, #2b7afb 100%);
          box-shadow: 0 4px 10px rgba(43, 122, 251, 0.3);
        }

        &.submit {
          background: linear-gradient(90deg, #2b7afb 0%, #0052d9 100%);
          box-shadow: 0 4px 10px rgba(0, 82, 217, 0.3);
        }
      }
    }
  }
}
</style>
