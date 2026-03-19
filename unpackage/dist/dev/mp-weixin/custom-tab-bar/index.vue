<template>
  <view>
    <view class="custom-tab-bar1">
    <view
      v-for="(item, index) in tabList"
      :key="index"
      :class="['tab-item1', currentIndex1 === index ? 'active' : '']"
      @click="changeTab(index)"
    >
      <image :src="currentIndex1 === index ? item.selectedIconPath : item.iconPath" class="image"></image>
      <text class="text">{{ item.text }}</text>
    </view>
  </view>
  <u-popup :show="show" @close="close" @open="open">
            <view style="width:100%;min-height:250rpx;position: relative;display: flex;justify-content: center;align-items: center;">
                <view style="display:flex" >
                  <u-icon name="phone-fill" color="#2979ff" size="35"></u-icon>
                  <button style="background: transparent;
                        padding: 0;
                        font-size: 16px;margin-left:20upx"  open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">手机号码快捷登录</button>
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
        "pagePath": "pages/tabbar/tabbar-1/tabbar-1",
        "iconPath": "../static/img/tabbar/jiance.png",
        "selectedIconPath": "../static/img/tabbar/activejiance.png",
        "text": "监测"
      },
      {
        "pagePath": "pages/tabbar/tabbar-4/tabbar-4",
        "iconPath": "../static/img/tabbar/history.png",
        "selectedIconPath": "../static/img/tabbar/activehistory.png",
        "text": "报告"
      },
      {
        "pagePath": "pages/tabbar/tabbar-2/tabbar-2",
        "iconPath": "../static/img/tabbar/ai.png",
        "selectedIconPath": "../static/img/tabbar/activeai.png",
        "text": "AI对话"
      },

      // {
      //   "pagePath": "pages/tabbar/tabbar-1/tabbar-1",
      //   "iconPath": "../static/img/tabbar/jiance.png",
      //   "selectedIconPath": "../static/img/tabbar/activejiance.png",
      //   "text": "CBTI"
      // },

      {
        "pagePath": "pages/tabbar/tabbar-5/tabbar-5",
        "iconPath": "../static/img/tabbar/my.png",
        "selectedIconPath": "../static/img/tabbar/activemy.png",
        "text": "我的"
      }
      ],
      userInfo: null, // 用户信息
      token: null, // 登录状态
      BASEURL: 'https://hygieneproduct.club:444/sleepapp'
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
					url: `https://hygieneproduct.club:444/sleepapp/wx/user/bindPhoneNumber?code=${e.detail.code}`, // 这里是自己的接口地址
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
      // if (this.currentIndex1 === index) return;
      this.currentIndex1 = index;
      uni.reLaunch({
        url: `/${this.tabList[this.currentIndex1].pagePath}`,
        fail: function(err) {
            console.error('跳转失败:', err);
        }
      });

    },
    getLogin(){
      var postData = {
        message: '1',
        chatType: "2",
        sourceId:''
      };
  //调用语音识别接口
    uni.request({
        url: "https://hygieneproduct.club:444/sleepapp/web/chat/sendQuestion", //仅为示例，并非真实接口地址。
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
        let url = 'https://hygieneproduct.club:444/sleepapp/wx/user/login?code=' + res.code
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
.custom-tab-bar1 {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  background-color: #fff;
  border-top: 1px solid #eee;
  height:120rpx;
}

.tab-item1{
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5px 0;
}

.tab-item1 .image {
  width: 24px;
  height: 24px;
}

.tab-item1 .text {
  font-size: 12px;
  color: #999;
}

.tab-item1.active .text {
  color: #007aff;
}
button::after{

border:none;

}
</style>
