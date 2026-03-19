<template>
	<view class="content">
	  <view
		style="
		  margin-top: 32upx;
		  display: flex;
		  align-items: center;
		  margin-bottom: 20upx;
		"
	  >
		<view
		  style="
			width: 5px;
			height: 26upx;
			background: #4399ff;
			position: relative;
			top: 2upx;
			border-radius: 10upx;
		  "
		></view>
		<view style="margin-left: 14upx">个人信息</view>
	  </view>
	  <u-line></u-line>
	  <u--form labelPosition="left" :model="model1" ref="uForm" >
		<u-form-item
		  label="用户id"
		  prop="userInfo.userId"
		  borderBottom
		  ref="item1"
		  label-width="140"
		  labelAlign="right"
		  
		>
		  <u--input
			v-model="userInfo.userId"
			disabled
			disabledColor="#ffffff"
			border="none"
			input-align="right"
		  ></u--input>
		</u-form-item>
		<u-form-item
		  label="头像"
		  prop="userInfo.sex"
		  borderBottom
		  label-width="140"
          labelAlign="right"
		  ref="item1"
		>
		<button open-type="chooseAvatar" @chooseavatar="getUserProfile" style="display: flex;
			align-items: center;
			justify-content: flex-end;
			padding: 0;
			line-height: 1;
			background: none;border:none;height:100%; outline:none;margin-left:400upx" >
				<u-avatar :src="userInfo.avatarUrl" shape="square" size="100" ></u-avatar>
		</button>


		  <u-icon slot="right" name="arrow-right"></u-icon>
		</u-form-item>
		<u-form-item
		  label="昵称"
		  prop="userInfo.userNike"
		  borderBottom
		  ref="item1"
		  label-width="140"
		  labelAlign="right"
		  
		>
		  <u--input
			v-model="userInfo.userNike"
			disabledColor="#ffffff"
			border="none"
			input-align="right"
		  ></u--input>
		</u-form-item>
		<u-form-item
		  label="住址"
		  prop="userInfo.address"
		  borderBottom
		  ref="item1"
		  label-width="140"
		  labelAlign="right"
		>
		  <u--input
			v-model="userInfo.address"
			disabledColor="#ffffff"
			border="none"
			input-align="right"
		  ></u--input>
		</u-form-item>
		
	  </u--form>
	   <view style="margin-top:100upx">
		<u-button type="primary" text="保存" @click="saveUser"></u-button>
	   </view>
	</view>
  </template>
  
  <script>
  export default {
	data() {
	  return {
		userInfo: {
		  
		},
	  };
	},
	onLoad() {
		if(uni.getStorageSync('userInfo')){
			this.userInfo = uni.getStorageSync('userInfo')
			console.log(this.userInfo)
		}
	},
	methods: {
		getUserProfile(e){
			console.log('123213')
			// 注意：这里是微信给我们返回图片的临时地址，实际开发中还需要上传图片到服务器
			this.userInfo.avatarUrl = e.detail.avatarUrl
			// 业务操作：如更新头像到服务器
			console.log('操作成功...')
		},
		saveUser(){
			const res =  this.$myRequest({
					url: "/user/improveuserdata",
					method: "POST",
					data: {
					...this.userInfo
				},
           });
		   uni.showToast({
                      title: '保存成功'
            })
			this.Wxuserlogin()
		},
		Wxuserlogin(){
			var _this= this
					wx.login({
					redirectPath: 'pages/tabbar/tabbar-2/tabbar-2',
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

	},
  };
  </script>
  
  <style>
  .content {
	padding: 0 10px;
  }
  button:focus {
            outline: none;
			border: none;
        }
  </style>
  