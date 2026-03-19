<template>
  <view class="content">
    <view class="tq">
    </view>
    <view
      style="
        width: 100%;
        height: 260rpx;
        display: flex;
        justify-content: center;
        align-items: center;
      "
    >
      <image src="../../../static/img/zc.png" style="width: 300rpx;height:340rpx" v-if="hxObj.bedStatus=='1'"></image>
      <image src="../../../static/img/lc.png" style="width: 300rpx;height:340rpx" v-else></image>
    </view>
    <view
      style="
        width: 100%;
        height: 240rpx;
        display: flex;
        align-items: center;
        justify-content: center;
      "
    >
      <view style="display: flex; flex-direction: column">
        <view> 呼吸频率 </view>
        <view style="display: flex; margin-top: 10rpx; align-items: center">
          <view style="font-size: 60rpx"> {{hxObj.breath}} </view>
          <view style="margin-left: 10rpx"> 次/分 </view>
        </view>
      </view>
      <view
        style="width: 4rpx; height: 80rpx; background: #fff; margin: 0 40rpx"
      >
      </view>

      <view style="display: flex; flex-direction: column">
        <view> 心率 </view>
        <view style="display: flex; margin-top: 10rpx; align-items: center">
          <view style="font-size: 60rpx"> {{hxObj.heart}}  </view>
          <view style="margin-left: 10rpx"> 次/分 </view>
        </view>
      </view>

    </view>
    <view style="width:92%;height:870rpx;background: rgba(237,239,255,.6);margin-left:4%;border-radius:20rpx;margin-top:-40rpx;"> 
      <view v-if='deviceList.length>0' style="width:100%;height:60rpx;display: flex;align-items: center;background: #CDE9F5;padding-left:20upx;box-sizing: border-box;color:#B6B3B7;border-top-left-radius: 10upx;border-top-right-radius: 10upx;justify-content: space-between;">
        <view>{{ current.deviceName ||current.deviceNo }}</view>
        <view style="width:20%;height:100%;background: #92DEFB;border-top-right-radius: 10upx;display: flex;justify-content: center;align-items: center;color:#fff;font-size:26upx;" @click="changeSmd">
          <u-icon slot="right" name="attach"></u-icon>
          <view  style="margin-left:10upx">切换</view>
        </view>
      </view>
      <view style="width:100%;height:600rpx;">
         <view style="width:100%;height:50rpx;color:#fff;font-size:40rpx;display:flex;justify-content: center;align-items: center;padding-top:38rpx;font-weight:700">
          睡眠数据分析
         </view>
           
        <echarts ref="echarts"></echarts>
      </view>
      <view style="width:100%;height:250rpx;color:#000;font-size:30rpx;font-weight:700">
           <view style="width:100%;height:50rpx;display: flex;justify-content: center;align-items: center;">
             <view style="width:20rpx;height:20rpx;background: #2889FE;"></view>
             <view style="margin-left:10rpx;">
              在床
             </view>
             <view style="width:20rpx;height:20rpx;background: #FEDB65;margin-left:30rpx"></view>
             <view style="margin-left:10rpx;">
              离床
             </view>
             <view style="width:20rpx;height:20rpx;background: #4DECB9;margin-left:30rpx"></view>
             <view style="margin-left:10rpx;">
              体动
             </view>
             <view style="width:20rpx;height:20rpx;background: #A665FE;margin-left:30rpx"></view>
             <view style="margin-left:10rpx;">
              打鼾
             </view>
             <view style="width:20rpx;height:20rpx;background: #FE8565;margin-left:30rpx"></view>
             <view style="margin-left:10rpx;">
              睡眠
             </view>
             <view style="width:20rpx;height:20rpx;background: gray;margin-left:30rpx"></view>
             <view style="margin-left:10rpx;">
              离线
             </view> 
           </view>
            <view style="width:100%;height:100rpx;margin-top:20rpx;display:flex;padding:0 5%;">
              <view
                    style="width: 2.2%; height: 100%;"
                    v-for="(item, index) in statuSarr"
                    :key="index"
                    :style="{ background: filter(item) }"
                  ></view>
            </view>
                     
      </view>
        
    </view>
    <view style="width:92%;min-height:150rpx;margin-left:4%;border-radius:20rpx;;margin-top:40rpx">

      <u-popup :show="showPopup" @close="close" @open="open">
          <view style="width:100%;height:120upx;background: #2c2c2c;color:#ccc;display: flex;justify-content: center;align-items: center;" >请选择解绑设备</view>
          <view style="width:100%;height:1upx;background: #E7e7e7;"></view>
            <view v-for="(item,index) in deviceList" :key="index" style="width:100%;height:160upx;background: #2c2c2c;color:#fff;display: flex;justify-content: center;align-items: center;border-bottom:1px solid #E7e7e7" @click="change1(item)">
                <view v-if="!item.deviceName">睡眠带{{ index+1 }}</view>
                <view v-else>{{item.deviceName}}</view>
            </view>
            <view style="width:100%;height:1upx;background: #E7e7e7;"></view>
            <view style="width:100%;height:120upx;background: #2c2c2c;color:#fff;display: flex;justify-content: center;align-items: center;" @click="showPopup=false">取消</view>
		</u-popup>
    </view>
  </view>
  
</template>

<script>
import echarts from './ecahrts/index.vue'
import qs from 'qs'
export default {
  data() {
    return {
      title: "Hello",
      tabBar: false,
      userInfo: {},
      statuSarr:[],
      socketTask:null,
      hxObj:{
        breath:0,
        heart:0,
        bedStatus:0
      },
      token:'',
      devicesInfo: {
        co2: {
          value: 0,
        },
        tvoc: {
          value: 0,
        },
        temperature: {
          value: 0,
        },
        humidity: {
          value: 0,
        },
        pm25: {
          value: 0,
        },
      },
      deviceList:[],
      current:{},
      showPopup:false
    };
  },
  created(){
    
  },
  onShow(){
    if(uni.getStorageSync('userInfo')){
      this.userInfo = uni.getStorageSync('userInfo')
      this.getDevice()
    }
  },
  mounted() {
   
  },
  onHide(){

  },
  components:{
    echarts
  },
  methods: {
    close(){
      
    },
    open(){

    },
  async getToken(){
    uni.request({
        url: "https://oauth.cleargrass.com/oauth2/token", //仅为示例，并非真实接口地址。
        header: {
          "content-type": "application/x-www-form-urlencoded",
           Authorization:"Basic S0ZKWTlxSFNnOjVhODJiNzJkOTMyODExZWU4MTlmYzIyYTYzZDFjZmNh",
        },
        data: qs.stringify({ grant_type: "client_credentials", scope: "device_full_access" }),
        method: "POST",
        success: (res) => {
          this.token = res.data.access_token
          this.getsj();
          this.timer2 = setInterval(() => {
            this.getsj();
          }, 10000);
        },
        fail: (res) => {
          
        },
      });
    
  },
  change1(item){
    uni.closeSocket({
        success() {
          console.log('WebSocket 关闭请求已发送');
        },
        fail(err) {
          console.error('WebSocket 关闭请求发送失败:', err);
        }
      });
    this.showPopup = false
    this.current = item
    this.connectSocket()
  },
  changeSmd(){
    if(this.deviceList.length==0){
           return uni.showToast({
              title:"暂无绑定设备",
              icon: 'none',
              duration: 3000,
              mask: true,
          });
      }
      this.showPopup = true
  },
  getDevice(){
    uni.request({
        url: "https://hygieneproduct.club:444/sleepapp/user/getUserDeviceList", //仅为示例，并非真实接口地址。
        data: {'deviceType':1},
        header: {
          "content-type": "application/json",
          token:uni.getStorageSync('mytoken')
        },
        method: "GET",
        success: (res) => {
          this.deviceList = res.data.data
          this.current =  this.deviceList[0]
          this.connectSocket()
        },
        fail: (res) => {},
      });
  },
  async getSleepBase(){
	 const res = await this.$myRequest({
	   url:`/sleepbase/start?deviceId=${this.userInfo.deviceId}`
	 });
  },
  async getsj() {
    uni.request({
        url: "https://apis.cleargrass.com/v1/apis/devices", //仅为示例，并非真实接口地址。
        header: {
          "content-type": "application/x-www-form-urlencoded",
           Authorization:`Bearer ${this.token}`,
        },
        method: "get",
        success: (res) => {
           let obj = res.data.devices.filter(item=>{
            return item.info.mac == this.userInfo.deviceId2
           })
          if(obj&&obj.length>0){
            this.devicesInfo = obj[0].data
            // console.log(this.devicesInfo)
          }
        },
        fail: (res) => {
          
        },
      });
    },
   connectSocket() {
				let that = this;
				console.log('调用连接websocket')
                console.log(this.current)
				this.socketTask = uni.connectSocket({
						url: `wss://hygieneproduct.club:444/ws/draw/${this.current.deviceId}`,
						// url: `ws://124.222.15.162:8888/ws/draw/4d475939343938373336`,
						success(res) {
							console.log("websocket连接成功");
							// that.isSuccess = true
						},
						fail(err) {
							console.log("报错", err);
						}
					},
 
 
				);
				this.socketTask.onOpen(function(res) {
					console.log('WebSocket连接已打开！');
					
				})
				this.socketTask.onMessage(function(res) {
				  let msg = JSON.parse(res.data)

          let lastOne = msg[msg.length-1]
          that.hxObj = JSON.parse(JSON.stringify(lastOne))
          that.$refs.echarts.getServerData(msg)
          if(that.statuSarr.length<40){
             that.statuSarr.push(lastOne)
          }else{
             that.statuSarr.splice(0, 1);
             that.statuSarr.push(lastOne);
          }
				});
 
 
				this.socketTask.onError(function(res) {
					console.log('WebSocket连接打开失败，请检查！');
					console.log(res);
				})
				// // 监听连接关闭 -
				this.socketTask.onClose((e) => {
					console.log('WebSocket连接关闭！');
					clearInterval(that.timer)
					that.timer = ''
					if (!that.isClose) {
						that.reconnect()
					}
				})
				console.log(this.socketTask)
			},
    jump() {
      uni.switchTab({
        url: "/pages/tabbar/tabbar-2/tabbar-2",
      });
    },
    goToPage(url) {
			if (!url) return;
			uni.navigateTo({
				url
			});
		},
    filter(item) {
      // 1离床 2体动 4睡眠 7打鼾 5在床
      if (item.status == 1) {
        return "#FEDB65";
      } else if (item.status == 2) {
        return "#4DECB9";
      } else if (item.status == 4) {
        return "#FE8565";
      } else if (item.status == 7) {
        return "#A665FE";
      } else if (item.status == 0) {
        return "gray";
      } else {
        return "#2889FE";
      }
    },
  },
};
</script>
<style scoped>
*{
	font-family: '黑体' !important;
}
.content {
  /* height: 100%; */
  background-image: url('https://javaimg-1316092519.cos.ap-nanjing.myqcloud.com/6a646535f93bd93d071caecab834e4bc.png');
  background-size: 100% 100%;
  width: 750rpx;
  color: #fff;
  padding-top: 20rpx;
  min-height: 1000rpx;
}
.tq {
  padding-left: 20rpx;
  height: 120rpx;
}
</style>
