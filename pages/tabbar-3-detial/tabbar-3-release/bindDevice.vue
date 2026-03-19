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
		<view style="margin-left: 14upx">睡眠带设备信息</view>
	  </view>
	  <u-line></u-line>
		
		<u--form labelPosition="left" :model="model1" ref="uForm" v-for="(item,index) in deviceList" :key="index" >
		<u-form-item
		  :label="item.deviceName||`睡眠带${index+1}`"
		  prop="userInfo.userId"
		  borderBottom
		  ref="item1"
		  label-width="300"
		  labelAlign="right"
		  @click="openDia11(item)"
		>
		  <u--input
			v-model="item.deviceId"
			disabled
			disabledColor="#ffffff"
			border="none"
			input-align="right"
	
		  ></u--input>
		  
		  <u-icon slot="right" name="arrow-right"></u-icon>
		</u-form-item>



		
	  </u--form>
	  <u-modal
      :show="showhj"
      title="请输入睡眠带名称"
      :showCancelButton="true"
      @cancel="cancelhj"
      @confirm="confirmhj"
    >
      <u--input
        placeholder="请输入睡眠带名称"
        v-model="copy.deviceName"
        border="surround"
        clearable
      ></u--input>
    </u-modal>
	</view>
  </template>
  
  <script>
  export default {
	data() {
	  return {
		userInfo: {
		},
		deviceList:[],
		showhj:false,
		copy:{}
	  };
	},
	onLoad() {
		if(uni.getStorageSync('userInfo')){
			this.userInfo = uni.getStorageSync('userInfo')
			this.getDevice()
		}
	},
	methods: {
		cancelhj(){
             this.showhj = false
		},
		confirmhj(){
			uni.request({
			url: "https://isleepagent.com:444/sleepapp/user/updateDeviceName", //仅为示例，并非真实接口地址。
			data: {"deviceBindId": this.copy.id, "deviceName": this.copy.deviceName
},
			header: {
			"content-type": "application/json",
			token:uni.getStorageSync('mytoken')
			},
			method: "POST",
			success: (res) => {
				this.showhj = false
			  this.getDevice()
			},
			fail: (res) => {},
		});
		},
		getUserProfile(e){
			console.log('123213')
			// 注意：这里是微信给我们返回图片的临时地址，实际开发中还需要上传图片到服务器
			this.userInfo.avatarUrl = e.detail.avatarUrl
			// 业务操作：如更新头像到服务器
			console.log('操作成功...')
		},
		openDia11(item){
			this.copy = JSON.parse(JSON.stringify(item))
			this.showhj = true
		},
		getDevice(){
				uni.request({
			url: "https://isleepagent.com:444/sleepapp/user/getUserDeviceList", //仅为示例，并非真实接口地址。
			data: {'deviceType':1},
			header: {
			"content-type": "application/json",
			token:uni.getStorageSync('mytoken')
			},
			method: "GET",
			success: (res) => {
			  this.deviceList = res.data.data
			
			},
			fail: (res) => {},
		});
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
  