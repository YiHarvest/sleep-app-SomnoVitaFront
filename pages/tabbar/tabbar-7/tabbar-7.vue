<template>
  <view class="scan-container">
    <view class="scan-btn" @click="scanQRCode">
      <image src="/static/img/tabbar/history.png" style="width: 100rpx; height: 100rpx;" />
      <text style="display:block;margin-top:20rpx;">扫一扫</text>
    </view>
  </view>
</template>

<script>
export default {
  methods: {
      scanQRCode() {
		var _this = this
        uni.scanCode({
            success(res) {
                if (res.result) {
                    // 扫描成功，处理二维码内容
                    console.log('扫描结果：', res.result);
                    var postData = {
                    
                      deviceId: res.result,
                    };
                    uni.request({
                      url: "https://isleepagent.com:444/sleepapp/user/bind", //仅为示例，并非真实接口地址。
                      data: postData,
                      header: {
                        "content-type": "application/json",
                        token:uni.getStorageSync('mytoken')
                      },
                      method: "POST",
                      success: (res) => {
                        console.log(res)
                        if (res.data.code == 500) {
                          _this.$refs.uNotify.show({
                            top: 20,
                            type: "error",
                            message: "绑定失败",
                            duration: 1000 * 3,
                            fontSize: 20,
                            safeAreaInsetTop: false,
                          });
                        }
                        if (res.data.code == 200) {
                          _this.$refs.uNotify.show({
                            top: 20,
                            type: "success",
                            message: "绑定成功",
                            duration: 1000 * 3,
                            fontSize: 20,
                            safeAreaInsetTop: false,
                          });
                          _this.getDevice()
                          // uni.setStorage({
                          //   key: "userInfo",
                          //   data: res.data.data,
                          // });
                        }
                      },
                      fail: (res) => {},
                    });
                } else {
                    // 扫描失败
                    uni.showToast({
                        title: '扫描失败',
                        icon: 'none'
                    });
                }
            },
            fail() {
                // 调用相机失败
                uni.showToast({
                    title: '已经取消扫码',
                    icon: 'none'
                });
            }
        });
    }
    }
}
</script>

<style scoped>
.scan-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f6f7fc;
}
.scan-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-radius: 20rpx;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  padding: 60rpx 80rpx;
}
</style> 