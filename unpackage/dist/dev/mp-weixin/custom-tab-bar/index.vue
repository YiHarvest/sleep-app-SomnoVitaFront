<template>
  <view>
    <view class="custom-tab-bar">
      <view
        v-for="(item, index) in tabList"
        :key="index"
        :class="['tab-item', index === 2 ? 'center-tab' : '', currentIndex1 === index ? 'active' : '']"
        @click="changeTab(index)"
      >
        <view v-if="index === 2" class="center-content">
          <view class="center-circle">
            <image :src="currentIndex1 === index ? item.selectedIconPath : item.iconPath" class="center-icon" />
          </view>
          <text class="center-text" :class="currentIndex1 === index ? 'center-text-active' : ''">{{ item.text }}</text>
        </view>
        <template v-else>
          <image
            :src="currentIndex1 === index ? item.selectedIconPath : item.iconPath"
            :class="index === 2 ? 'ai-icon-large' : 'icon'"
            mode="aspectFit"
          />
          <text class="text">{{ item.text }}</text>
        </template>
      </view>
    </view>
    <u-popup :show="show" @close="close" @open="open">
      <view style="width:100%;min-height:250rpx;position: relative;display: flex;justify-content: center;align-items: center;">
        <view style="display:flex" >
          <u-icon name="phone-fill" color="#2979ff" size="35"></u-icon>
          <button style="background: transparent; padding: 0; font-size: 16px;margin-left:20upx"  open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">手机号码快捷登录</button>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentIndex1: '',
      show: false,
      tabList: [
        {
          pagePath: 'pages/tabbar/tabbar-1/tabbar-1',
          iconPath: '../static/img/tabbar/jiance.png',
          selectedIconPath: '../static/img/tabbar/activejiance.png',
          text: '监测'
        },
        {
          pagePath: 'pages/tabbar/tabbar-4/tabbar-4',
          iconPath: '../static/img/tabbar/history.png',
          selectedIconPath: '../static/img/tabbar/activehistory.png',
          text: '报告'
        },
        {
          pagePath: 'pages/tabbar/tabbar-2/tabbar-2',
          iconPath: '../static/img/tabbar/ai.png',
          selectedIconPath: '../static/img/tabbar/activeai.png',
          text: 'AI对话'
        },
        {
          pagePath: 'pages/tabbar/tabbar-7/tabbar-7',
          iconPath: '../static/img/tabbar/history.png',
          selectedIconPath: '../static/img/tabbar/activehistory.png',
          text: '扫一扫'
        },
        {
          pagePath: 'pages/tabbar/tabbar-5/tabbar-5',
          iconPath: '../static/img/tabbar/my.png',
          selectedIconPath: '../static/img/tabbar/activemy.png',
          text: '我的'
        }
      ],
      userInfo: null, // 用户信息
      token: null, // 登录状态
      BASEURL: 'https://isleepagent.com:444/sleepapp'
    };
  },
  onShow() {
   
  },
  watch: {
    currentIndex1: {
      handler(newVal) {
        // console.log(newVal)
      }
    }
  },
  methods: {
    getPhoneNumber(e) {
      uni.request({
        url: `https://isleepagent.com:444/sleepapp/wx/user/bindPhoneNumber?code=${e.detail.code}`, // 这里是自己的接口地址
        method: 'GET',
        header: {
          "content-type": "application/json",
          token:uni.getStorageSync('mytoken')
        },
        success(response) {
          console.log('获取手机号成功', response);
          uni.setStorageSync('mytoken',response.data.data.token)
          uni.setStorage({
            key: "userInfo",
            data: response.data.data,
          });
          uni.showToast({
            title: "登录成功!",
            icon: "none",
            duration: 1000,
            mask: true,
          });
          uni.reLaunch({
            url: "/pages/tabbar/tabbar-1/tabbar-1",
          });
          this.show = false
        },
        fail: function (err) {
          // 请求失败的回调函数
          console.error('请求失败', err);
        }
      });
    },
    changeTab(index) {
      if (index === 3) { // "扫一扫"Tab的下标
        uni.scanCode({
          success(res) {
            uni.showToast({
              title: '扫描成功',
              icon: 'success'
            });
            // 这里可以处理扫码结果，比如跳转页面或弹窗
          },
          fail() {
            uni.showToast({
              title: '已取消扫码',
              icon: 'none'
            });
          }
        });
        return;
      }
      this.currentIndex1 = index;
      uni.switchTab({ url: `/${this.tabList[index].pagePath}` });
    },
    getLogin(){
      var postData = {
        message: '1',
        chatType: "2",
        sourceId:''
      };
  //调用语音识别接口
      uni.request({
        url: "https://isleepagent.com:444/sleepapp/web/chat/sendQuestion", //仅为示例，并非真实接口地址。
        data: postData,
        header: {
          "content-type": "application/json",
          token:uni.getStorageSync('mytoken')
        },
        method: "POST",
        success: (res) => {
          if(res.data.code==401){
            this.Wxuserlogin(1)
          }
        },
        fail: (res) => {
          console.log("上传音频失败" + JSON.stringify(res));
        },
      });
    },
    open() {
      // console.log('open');
    },
    close() {
      this.show = false
      // console.log('close');
    },
    Wxuserlogin(item){
      var _this= this
      wx.login({
        redirectPath: 'pages/tabbar/tabbar-1/tabbar-1',
        success (res) {
          let url = 'https://isleepagent.com:444/sleepapp/wx/user/login?code=' + res.code
          if (res.code) {
            uni.request({
              url: url, // 必选，请求的接口地址
              method: 'GET', // 可选，默认值为 GET，支持 GET、POST、PUT、DELETE 等
              success: function (res) {
                // 请求成功的回调函数
                uni.setStorageSync('userInfo',res.data.data)
                uni.setStorageSync('mytoken',res.data.data.token)
                if(!res.data.data.phone){
                  _this.show = true
                }
                if(item){
                  uni.reLaunch({
                    url: '/pages/tabbar/tabbar-1/tabbar-1' // 当前页面的路径
                  });
                }
              },
              fail: function (err) {
                // 请求失败的回调函数
                console.error('请求失败', err);
              }
            });
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })
    },
    // 处理登录
    async handleLogin() {
      try {
        // 1. 获取用户信息
        const userInfo = await this.getUserProfile();
        this.userInfo = userInfo;

        // 2. 获取登录凭证 code
        const code = await this.getLoginCode();

        // 3. 发送 code 到服务器，换取 token
        const token = await this.sendCodeToServer(code);

        // 4. 存储 token
        uni.setStorageSync('token', token);
        this.token = token;

        console.log('登录成功');
      } catch (error) {
        console.error('登录失败:', error);
      }
    },
    // 获取用户信息
    getUserProfile() {
      return new Promise((resolve, reject) => {
        uni.getUserProfile({
          desc: '获取用户信息用于登录',
          success: (res) => {
            resolve(res.userInfo);
          },
          fail: (err) => {
            reject(err);
          },
        });
      });
    },
    // 获取登录凭证 code
    getLoginCode() {
      return new Promise((resolve, reject) => {
        uni.login({
          provider: 'weixin',
          success: (res) => {
            if (res.code) {
              resolve(res.code);
            } else {
              reject(new Error('获取 code 失败'));
            }
          },
          fail: (err) => {
            reject(err);
          },
        });
      });
    },
    // 发送 code 到服务器
    async sendCodeToServer(code) {
      try {
        const response = await uni.request({
          url: 'https://your-server.com/api/login', // 替换为你的服务器地址
          method: 'POST',
          data: {
            code: code,
          },
        });

        if (response.statusCode === 200 && response.data.token) {
          return response.data.token; // 假设服务器返回 token
        } else {
          throw new Error('服务器返回错误');
        }
      } catch (error) {
        throw new Error('请求服务器失败');
      }
    },
    // 获取用户信息（已登录时）
    getUserInfo() {
      // 这里可以根据 token 从服务器获取用户信息
      console.log('获取用户信息');
    },
    // 退出登录
    handleLogout() {
      uni.removeStorageSync('token');
      this.token = null;
      this.userInfo = null;
      console.log('退出登录成功');
    },
  },
  mounted(){
    this.getLogin()
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const currentPath = `${currentPage.route}`;
    this.tabList.forEach((item, index) => {
      if (item.pagePath === currentPath) {
        this.currentIndex1 = index;
      }
    });
    const token = uni.getStorageSync('mytoken');
    if (token) {
      this.token = token;
      // console.log('已登录');
      // this.getUserInfo();
    } else {
      // console.log('未登录');
      this.Wxuserlogin()
    }
  },
};
</script>

<style scoped>
.custom-tab-bar {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  height: 110rpx;
  background: #fff;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
}
.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}
.icon {
  width: 48rpx;
  height: 48rpx;
}
.ai-icon-large {
  width: 70rpx;
  height: 70rpx;
}
.text {
  font-size: 22rpx;
  color: #888;
}
.active .text {
  color: #6173E7;
}
.center-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.center-circle {
  width: 90rpx;
  height: 90rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #e6eaff 0%, #c2d2ff 100%);
  box-shadow: 0 4px 18px 0 rgba(97,115,231,0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rpx;
}
.center-icon {
  width: 54rpx;
  height: 54rpx;
}
.center-text {
  font-size: 22rpx;
  color: #888;
  font-weight: normal;
  margin-top: 2rpx;
  letter-spacing: 1rpx;
}
.center-text-active {
  color: #6173E7;
  font-weight: normal;
}
.center-tab {
  /* 仅用于定位，不再直接设置样式，样式已拆分到.center-content和.center-circle */
}
</style>
