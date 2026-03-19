<template>
  <view class="content" style="background: #1a1a1a;">
    <view class="tq">
    </view>
    <view class="data-container">
      <view class="data-row">
        <!-- 呼吸频率卡片 -->
        <view class="data-card">
          <view class="card-frame">
            <view class="card-corner-decor top-left"></view>
            <view class="card-corner-decor top-right"></view>
            <view class="card-corner-decor bottom-left"></view>
            <view class="card-corner-decor bottom-right"></view>
          </view>
          <image src="/static/images/huxi.png" class="card-bg" mode="aspectFit"/>
          <view class="card-content">
            <view class="value-container">
              <text class="number">{{hxObj.breath}}</text>
              <text class="unit">次/分</text>
            </view>
            <view class="pulse-effect"></view>
          </view>
        </view>
        <!-- 状态显示 -->
        <view class="status-section">
          <view class="status-container">
            <!-- 装饰图整体居中放大 -->
            <image src="/static/images/zaichuangdi.png" class="status-decoration" mode="aspectFit"/>
            <view class="outer-circle"></view>
            <image 
              src="../../../static/images/zaichuang.png"
              class="status-bg rotate-reverse-animation"
              mode="aspectFit"
            />
            <image 
              src="../../../static/images/zaichuang.png"
              class="status-bg-top rotate-animation"
              mode="aspectFit"
            />
            <text class="status-text glow-animation">{{hxObj.bedStatus=='1' ? '在床' : '离床'}}</text>
            <view class="status-dots left"></view>
            <view class="status-dots right"></view>
          </view>
        </view>

        <!-- 心率卡片 -->
        <view class="data-card">
          <view class="card-frame">
            <view class="card-corner-decor top-left"></view>
            <view class="card-corner-decor top-right"></view>
            <view class="card-corner-decor bottom-left"></view>
            <view class="card-corner-decor bottom-right"></view>
          </view>
          <image src="/static/images/xinlv.png" class="card-bg" mode="aspectFit"/>
          <view class="card-content">
            <view class="value-container">
              <text class="number">{{hxObj.heart}}</text>
              <text class="unit">次/分</text>
            </view>
            <view class="heart-rate-line"></view>
          </view>
        </view>
      </view>
    </view>
    <view
      style="
        width: 100%;
        height: 60rpx;
        display: flex;
        justify-content: center;
        align-items: center;
      "
    >
      <!-- <image src="../../../static/img/zc.png" style="width: 300rpx;height:340rpx" v-if="hxObj.bedStatus=='1'"></image>
      <image src="../../../static/img/lc.png" style="width: 300rpx;height:340rpx" v-else></image> -->
    </view>
    <view style="width:92%;height:780rpx;background: transparent;margin-left:4%;border-radius:20rpx;margin-top:-40rpx;"> 
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
        <view style="width:100%;height:100rpx;margin-top:20rpx;display:flex;padding:0 5%;">
          <view
                style="width: 2.2%; height: 100%;"
                v-for="(item, index) in statuSarr"
                :key="index"
                :style="{ background: filter(item) }"
              ></view>
        </view>
        <echarts ref="echarts"></echarts>
      </view>
      <view style="width:100%;height:250rpx;color:#000;font-size:30rpx;font-weight:700">
           <view style="width:100%;height:50rpx;display: flex;justify-content: center;align-items: center;position:relative;top:-350rpx;">
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
           <!-- <view style="width:100%;height:100rpx;margin-top:20rpx;display:flex;padding:0 5%;">
              <view
                    style="width: 2.2%; height: 100%;"
                    v-for="(item, index) in statuSarr"
                    :key="index"
                    :style="{ background: filter(item) }"
                  ></view>
            </view> -->
      </view>
        
    </view>
    <view style="width:92%;min-height:150rpx;margin-left:4%;border-radius:20rpx;;margin-top:40rpx;">

      <u-popup :show="showPopup" @close="close" @open="open" >
        <view class="popup-cyber-outer-bg">
          <view class="popup-cyber-card">
            <view class="popup-title">请选择设备</view>
            <view class="popup-divider"></view>
            <view v-for="(item,index) in deviceList" :key="index" class="popup-device-item" @click="change1(item)">
              <view v-if="!item.deviceName">睡眠带{{ index+1 }}</view>
              <view v-else>{{item.deviceName}}</view>
            </view>
            <view class="popup-divider"></view>
            <view class="popup-cancel-btn" @click="showPopup=false">取消</view>
            <!-- 赛博流光边框 -->
            <svg class="popup-cyber-border" viewBox="0 0 1000 600" preserveAspectRatio="none">
              <rect x="6" y="6" width="988" height="588" rx="32" fill="none"
                stroke="url(#cyber-neon)" stroke-width="8" class="cyber-neon-rect"/>
              <defs>
                <linearGradient id="cyber-neon" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#3a6aff"/>
                  <stop offset="100%" stop-color="#00ffe7"/>
                </linearGradient>
              </defs>
            </svg>
          </view>
        </view>
      </u-popup>
    </view>
    <!-- 设备切换科技卡片（终极酷炫） -->
    <view class="device-switch-card">
      <!-- SVG霓虹流光边框 -->
      <svg class="cyber-border" viewBox="0 0 1000 120" preserveAspectRatio="none">
        <rect x="6" y="6" width="988" height="108" rx="32" fill="none"
          stroke="url(#cyber-neon)" stroke-width="8" class="cyber-neon-rect"/>
        <defs>
          <linearGradient id="cyber-neon" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#3a6aff"/>
            <stop offset="100%" stop-color="#00ffe7"/>
          </linearGradient>
        </defs>
      </svg>
      <view class="device-info">
        <text class="device-id">{{ current.deviceName || current.deviceNo }}</text>
      </view>
      <view class="device-switch-btn" @click="changeSmd">
        <u-icon name="attach" class="switch-icon"></u-icon>
        <text class="switch-text">切换</text>
      </view>
      <div class="device-glow"></div>
    </view>
    <!-- 下半部分终极酷炫科技风卡片化美化 -->
    <view class="main-card-bottom">
      <!-- SVG霓虹流光边框 -->
      <svg class="cyber-border" viewBox="0 0 1000 300" preserveAspectRatio="none">
        <rect x="6" y="6" width="988" height="288" rx="32" fill="none"
          stroke="url(#cyber-neon)" stroke-width="8" class="cyber-neon-rect"/>
        <defs>
          <linearGradient id="cyber-neon" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#3a6aff"/>
            <stop offset="100%" stop-color="#00ffe7"/>
          </linearGradient>
        </defs>
      </svg>
      <!-- 删除左上和右上角SVG装饰角，防止弹窗白角穿帮 -->
      <!--<svg class="cyber-corner cyber-corner-tl" viewBox="0 0 60 60"><polyline points="0,40 0,0 40,0" class="cyber-line"/></svg>-->
      <!--<svg class="cyber-corner cyber-corner-tr" viewBox="0 0 60 60"><polyline points="20,0 60,0 60,40" class="cyber-line"/></svg>-->
      <svg class="cyber-corner cyber-corner-bl" viewBox="0 0 60 60"><polyline points="0,20 0,60 40,60" class="cyber-line"/></svg>
      <svg class="cyber-corner cyber-corner-br" viewBox="0 0 60 60"><polyline points="60,20 60,60 20,60" class="cyber-line"/></svg>
      <!-- 粒子星轨背景canvas -->
      <canvas id="cyber-particle-bg" class="cyber-particle-bg"></canvas>
      <view class="legend-block">
        <view class="legend-title">图例</view>
        <view class="legend-list">
          <view class="legend-item">
            <view class="legend-dot" style="background:#2889FE;box-shadow:0 0 16rpx #00ffe7cc, 0 0 32rpx #3a6affcc"></view>
            <text class="legend-label">在床</text>
          </view>
          <view class="legend-item">
            <view class="legend-dot" style="background:#FEDB65;box-shadow:0 0 16rpx #FEDB65, 0 0 32rpx #3a6affcc"></view>
            <text class="legend-label">离床</text>
          </view>
          <view class="legend-item">
            <view class="legend-dot" style="background:#4DECB9;box-shadow:0 0 16rpx #4DECB9, 0 0 32rpx #3a6affcc"></view>
            <text class="legend-label">体动</text>
          </view>
          <view class="legend-item">
            <view class="legend-dot" style="background:#A665FE;box-shadow:0 0 16rpx #A665FE, 0 0 32rpx #3a6affcc"></view>
            <text class="legend-label">打鼾</text>
          </view>
          <view class="legend-item">
            <view class="legend-dot" style="background:#FE8565;box-shadow:0 0 16rpx #FE8565, 0 0 32rpx #3a6affcc"></view>
            <text class="legend-label">睡眠</text>
          </view>
          <view class="legend-item">
            <view class="legend-dot" style="background:gray;box-shadow:0 0 16rpx gray, 0 0 32rpx #3a6affcc"></view>
            <text class="legend-label">离线</text>
          </view>
        </view>
      </view>
      <view class="data-block">
        <view class="data-title">睡眠数据分析</view>
        <view style="width:100%;height:100rpx;margin-top:20rpx;display:flex;padding:0 5%;">
          <view
            style="width: 2.2%; height: 100%;"
            v-for="(item, index) in statuSarr"
            :key="index"
            :style="{ background: filter(item) }"
          ></view>
        </view>
        <echarts ref="echarts"></echarts>
      </view>
    </view>
  </view>
  
</template>

<script>
import echarts from './ecahrts/index.vue'
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
.data-container {
  width: 100%;
  padding: 0 20rpx;
  box-sizing: border-box;
  margin-bottom: 40rpx;
}

.data-row {
  
  width: 680rpx; /* 或660rpx，根据实际效果微调 */
  margin: 0 auto; /* 居中 */
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.data-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.data-title {
  font-size: 28rpx;
  color: #999;
}

.data-value {
  display: flex;
  margin-top: 20rpx;
  align-items: baseline;
}

.number {
  font-size: 48rpx;
  font-weight: bold;
}

.unit {
  margin-left: 6rpx;
  font-size: 4rpx;
  color: #999;
}

.status-section {
  position: relative;
  z-index: 1;
}

.status-container {
  position: relative;
  width: 300rpx;
  height: 300rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10rpx;
}

.outer-circle {
  position: absolute;
  width: 340rpx;
  height: 340rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: rotate 10s linear infinite;
}

.outer-circle::before {
  content: '';
  position: absolute;
  width: 360rpx;
  height: 360rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.05);
  border-radius: 50%;
  left: -10rpx;
  top: -10rpx;
}

.status-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0.8;
}

.status-bg-top {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
  opacity: 0.9;
}

.status-text {
  position: relative;
  z-index: 2;
  font-size: 48rpx;
  font-weight: bold;
  color: #fff;
  text-shadow: 0 0 10rpx rgba(255,255,255,0.5);
}

/* 箭头样式 */
.left-arrows, .right-arrows {
  position: absolute;
  display: flex;
  align-items: center;
  height: 100%;
  color: #4B9EFF;
  font-size: 24rpx;
  opacity: 0.6;
}

.left-arrows {
  left: -60rpx;
}

.right-arrows {
  right: -60rpx;
}

.arrow {
  margin: 0 -2rpx;
  animation: arrow-fade 2s infinite;
}

.arrow:nth-child(2) {
  animation-delay: 0.2s;
}

.arrow:nth-child(3) {
  animation-delay: 0.4s;
}

/* 装饰点 */
.decoration-dots::before,
.decoration-dots::after {
  content: '';
  position: absolute;
  width: 6rpx;
  height: 6rpx;
  background: #4B9EFF;
  border-radius: 50%;
  animation: dot-pulse 2s infinite;
}

.decoration-dots::before {
  top: 20%;
  left: 10%;
}

.decoration-dots::after {
  bottom: 20%;
  right: 10%;
}

/* 动画定义 */
@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes rotate-reverse {
  from { transform: rotate(360deg); }
  to { transform: rotate(0deg); }
}

.rotate-animation {
  animation: rotate 20s linear infinite;
}

.rotate-reverse-animation {
  animation: rotate-reverse 25s linear infinite;
}

@keyframes arrow-fade {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

@keyframes dot-pulse {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.5); opacity: 1; }
}

.glow-animation {
  animation: glow 2s ease-in-out infinite;
}

@keyframes glow {
  0%, 100% { text-shadow: 0 0 10rpx rgba(75,158,255,0.5); }
  50% { text-shadow: 0 0 20rpx rgba(75,158,255,0.8),
                     0 0 30rpx rgba(75,158,255,0.6),
                     0 0 40rpx rgba(75,158,255,0.4); }
}

/* 其他数据项样式 */
.data-container {
  width: 100%;
  padding: 0 20rpx;
  box-sizing: border-box;
  margin-bottom: 40rpx;
}

.data-row {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.data-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.data-title {
  font-size: 28rpx;
  color: #4B9EFF;
}

.data-value {
  display: flex;
  margin-top: 20rpx;
  align-items: baseline;
}

.number {
  font-size: 48rpx;
  font-weight: bold;
  color: #fff;
}

.unit {
  margin-left: 8rpx;
  font-size: 24rpx;
  color: #4B9EFF;
}

/* 数据卡片基础样式 */
.data-card {
  position: relative;
  width: 180rpx;
  height: 190rpx;
  background: transparent;
  border-radius: 20rpx;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0.8;
  z-index: 1;
}

.card-content {
  position: relative;
  z-index: 2;
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20rpx;
  box-sizing: border-box;
}

.value-container {
  display: flex;
  align-items: baseline;
  justify-content: center;
}

.left-card {
  transform: perspective(800rpx) rotateY(5deg);
}

.right-card {
  transform: perspective(800rpx) rotateY(-5deg);
}

.number {
  font-size: 60rpx;
  font-weight: bold;
  color: #fff;
  text-shadow: 0 0 10rpx rgba(255,255,255,0.5);
}

.unit {
  margin-left: 8rpx;
  font-size: 24rpx;
  color: #4B9EFF;
}

/* 卡片装饰角 */
.card-corner {
  position: absolute;
  width: 20rpx;
  height: 20rpx;
  border: 2rpx solid rgba(75,158,255,0.5);
  z-index: 3;
}

.top-left {
  top: 10rpx;
  left: 10rpx;
  border-right: none;
  border-bottom: none;
}

.top-right {
  top: 10rpx;
  right: 10rpx;
  border-left: none;
  border-bottom: none;
}

.bottom-left {
  bottom: 10rpx;
  left: 10rpx;
  border-right: none;
  border-top: none;
}

.bottom-right {
  bottom: 10rpx;
  right: 10rpx;
  border-left: none;
  border-top: none;
}

/* 动画定义 */
@keyframes pulse {
  0%, 100% {
    transform: translateX(-50%) scale(1);
    opacity: 0.3;
  }
  50% {
    transform: translateX(-50%) scale(1.2);
    opacity: 0.6;
  }
}

@keyframes heart-beat {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}

/* 添加脉冲效果样式 */
.pulse-effect {
  position: absolute;
  bottom: 20rpx;
  left: 50%;
  width: 16rpx;
  height: 16rpx;
  background: #4B9EFF;
  border-radius: 50%;
  transform: translateX(-50%);
  animation: pulse 2s ease-in-out infinite;
  box-shadow: 0 0 10rpx rgba(75,158,255,0.5);
}

/* 添加心率线动画效果 */
.heart-rate-line {
  position: absolute;
  bottom: 30rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 2rpx;
  overflow: hidden;
}

.heart-rate-line::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg,
    transparent 0%,
    #FF4B82 45%,
    #FF4B82 55%,
    transparent 100%
  );
  animation: heart-rate 1.2s ease-in-out infinite;
}

@keyframes heart-rate {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* 装饰箭头样式 */
.status-arrow {
  position: absolute;
  width: 120rpx;
  height: 120rpx;
  top: 50%;
  transform: translateY(-50%);
  z-index: 3;
  opacity: 1;
  filter: drop-shadow(0 0 12rpx #4B9EFF88);
}
.left-arrow {
  left: -20rpx;
}
.right-arrow {
  right: -20rpx;
  transform: translateY(-50%) scaleX(-1);
}

.status-decoration {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 360rpx;
  height: 80rpx;
  transform: translate(-50%, -50%);
  z-index: 0;
  opacity: 1;
  pointer-events: none;
}

/* 下半部分科技风样式及动效升级 */
.particle-bg {
  position: absolute;
  left: 0; top: 0; width: 100%; height: 100%;
  z-index: 0;
  pointer-events: none;
  opacity: 0.18;
}

.main-card-bottom {
  width: 92vw;
  margin: 40rpx auto 0 auto;
  background: rgba(24,31,42,0.92);
  border-radius: 28rpx;
  box-shadow: 0 0 32rpx 0 #3a6aff44, 0 0 0 2rpx #3a6aff33 inset;
  border: 1.5rpx solid #3a6aff55;
  padding: 32rpx 24rpx 40rpx 24rpx;
  display: flex;
  flex-direction: column;
  gap: 32rpx;
  position: relative;
  overflow: visible;
}

.data-block, .legend-block {
  background: 
    linear-gradient(120deg, #2a3550cc 60%, #1a2233cc 100%),
    rgba(30,40,60,0.98);
  border-radius: 20rpx;
  box-shadow: 
    0 0 32rpx 0 #3a6aff33, 
    0 0 0 2rpx #3a6aff22 inset, 
    0 0 0 1.5rpx #fff3 inset,
    0 8rpx 32rpx 0 #0008;
  border: 1.5rpx solid #3a6aff44;
  padding: 28rpx 20rpx;
  margin-bottom: 12rpx;
  position: relative;
  transition: box-shadow 0.3s, transform 0.3s;
  overflow: hidden;
  backdrop-filter: blur(12rpx) saturate(1.2);
}

.data-title {
  font-size: 40rpx;
  color: #3a6aff;
  font-weight: 700;
  margin-bottom: 18rpx;
  letter-spacing: 2rpx;
  text-shadow: 0 0 12rpx #3a6aff88;
}

.legend-block {
  background: 
    linear-gradient(120deg, #2a3550cc 60%, #1a2233cc 100%),
    rgba(30,40,60,0.98);
  border-radius: 20rpx;
  box-shadow: 
    0 0 32rpx 0 #3a6aff33, 
    0 0 0 2rpx #3a6aff22 inset, 
    0 0 0 1.5rpx #fff3 inset,
    0 8rpx 32rpx 0 #0008;
  border: 1.5rpx solid #3a6aff44;
  padding: 18rpx 20rpx;
  margin-bottom: 12rpx;
  position: relative;
  transition: box-shadow 0.3s, transform 0.3s;
  overflow: hidden;
  backdrop-filter: blur(12rpx) saturate(1.2);
}

.legend-title {
  font-size: 28rpx;
  color: #3a6aff;
  font-weight: 600;
  margin-bottom: 8rpx;
  letter-spacing: 1rpx;
}

.legend-list {
  display: flex;
  flex-wrap: wrap;         /* 允许换行 */
  gap: 18rpx 32rpx;
  justify-content: flex-start;
}

.legend-item {
  width: 30%;              /* 每行3个，留点间距 */
  min-width: 120rpx;       /* 可根据实际微调 */
  margin-bottom: 12rpx;
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.legend-dot {
  width: 20rpx;
  height: 20rpx;
  border-radius: 50%;
  box-shadow: 0 0 12rpx #3a6aff88;
  margin-right: 6rpx;
  border: 2rpx solid #fff2;
}
.legend-dot::after {
  content: '';
  position: absolute;
  left: 50%; top: 50%;
  width: 100%; height: 100%;
  border-radius: 50%;
  background: inherit;
  opacity: 0.4;
  transform: translate(-50%, -50%) scale(1);
}

.legend-label {
  font-size: 22rpx;
  color: #fff;
  font-weight: 500;
  letter-spacing: 1rpx;
}

/* 超级酷炫设备切换卡片 */
.device-switch-card {
  width: 92vw;
  margin: 0 auto 32rpx auto;
  background: linear-gradient(120deg, #1a2a3a 60%, #233a5a 100%);
  border-radius: 20rpx;
  box-shadow: 0 0 32rpx 0 #3a6aff88, 0 0 0 2rpx #3a6aff44 inset;
  border: 1.5rpx solid #3a6aff88;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24rpx;
  position: relative;
  overflow: visible;
}
.device-info {
  flex: 1;
  padding: 24rpx 0;
  display: flex;
  align-items: center;
}
.device-id {
  font-size: 30rpx;
  color: #b6e0ff;
  font-weight: 700;
  letter-spacing: 2rpx;
  text-shadow: 0 0 8rpx #3a6aff88;
  user-select: all;
}
.device-switch-btn {
  display: flex;
  align-items: center;
  background: linear-gradient(90deg, #3a6aff 60%, #1a2a3a 100%);
  border-radius: 16rpx;
  padding: 10rpx 28rpx 10rpx 18rpx;
  margin-left: 18rpx;
  box-shadow: 0 0 16rpx #3a6aff88, 0 0 0 2rpx #fff5 inset, 0 2rpx 8rpx #0004;
  border: 1.5rpx solid #fff5;
  cursor: pointer;
  position: relative;
  z-index: 2;
  transition: box-shadow 0.3s, background 0.3s;
  animation: switchBtnGlow 2s infinite alternate;
  backdrop-filter: blur(6rpx) saturate(1.2);
}
@keyframes switchBtnGlow {
  0% { box-shadow: 0 0 8rpx #3a6aff44; background: linear-gradient(90deg, #3a6aff 60%, #1a2a3a 100%);}
  100% { box-shadow: 0 0 24rpx #3a6affcc; background: linear-gradient(90deg, #1a2a3a 0%, #3a6aff 100%);}
}
.switch-icon {
  font-size: 32rpx !important;
  color: #fff !important;
  margin-right: 10rpx;
  animation: iconSpin 2.5s linear infinite;
}
@keyframes iconSpin {
  0% { transform: rotate(0deg);}
  100% { transform: rotate(360deg);}
}
.switch-text {
  font-size: 28rpx;
  color: #fff;
  font-weight: 600;
  letter-spacing: 1rpx;
  text-shadow: 0 0 8rpx #3a6aff88;
}
.device-glow {
  position: absolute;
  left: 0; top: 0; width: 100%; height: 100%;
  border-radius: 20rpx;
  pointer-events: none;
  z-index: 1;
  box-shadow: 0 0 40rpx 8rpx #3a6aff55, 0 0 0 2rpx #3a6aff44 inset;
  animation: deviceGlow 2.5s infinite alternate;
}
@keyframes deviceGlow {
  0% { box-shadow: 0 0 24rpx 4rpx #3a6aff33, 0 0 0 2rpx #3a6aff44 inset;}
  100% { box-shadow: 0 0 60rpx 16rpx #3a6affcc, 0 0 0 2rpx #3a6aff88 inset;}
}

/* 赛博角SVG线条 */
.cyber-corner {
  position: absolute;
  width: 60rpx;
  height: 60rpx;
  z-index: 10;
  pointer-events: none;
}
.cyber-corner-tl,
.cyber-corner-tr {
  display: none !important;
}
.cyber-corner-bl { left: 0; bottom: 0; transform: scaleY(-1);}
.cyber-corner-br { right: 0; bottom: 0; transform: scale(-1,-1);}
.cyber-line {
  fill: none;
  stroke: url(#cyber-gradient);
  stroke-width: 2.5;
  stroke-dasharray: 10 6;
  stroke-dashoffset: 0;
  filter: drop-shadow(0 0 6rpx #3a6affcc);
}

/* 彻底去除main-card-bottom的椭圆遮挡，只保留细腻动效 */
.main-card-bottom::after,
.main-card-bottom::before {
  display: none !important;
  content: none !important;
  background: none !important;
  opacity: 0 !important;
}
#particle-bg,
.main-card-bottom > canvas,
.main-card-bottom > svg.bg-ellipse {
  display: none !important;
}
.data-block::after, .legend-block::after, .device-switch-card::after {
  content: '';
  position: absolute;
  left: 0; top: 0; width: 100%; height: 100%;
  background: linear-gradient(120deg,rgba(255,255,255,0.12) 0%,rgba(255,255,255,0.02) 100%);
  pointer-events: none;
  z-index: 2;
  opacity: 0.7;
  mix-blend-mode: lighten;
}

/* 终极酷炫赛博科技风样式 */
.cyber-border {
  position: absolute;
  left: 0; top: 0; width: 100%; height: 100%;
  pointer-events: none;
  z-index: 20;
}
.cyber-neon-rect {
  stroke-dasharray: 1800;
  stroke-dashoffset: 0;
  filter: drop-shadow(0 0 24rpx #3a6affcc) drop-shadow(0 0 32rpx #00ffe7cc);
  animation: neon-flow 4s linear infinite;
}
@keyframes neon-flow {
  0% { stroke-dashoffset: 1800; }
  100% { stroke-dashoffset: 0; }
}
.cyber-corner {
  position: absolute;
  width: 60rpx;
  height: 60rpx;
  z-index: 21;
  pointer-events: none;
}
.cyber-corner-bl { left: 0; bottom: 0; transform: scaleY(-1);}
.cyber-corner-br { right: 0; bottom: 0; transform: scale(-1,-1);}
.cyber-line {
  fill: none;
  stroke: url(#cyber-neon);
  stroke-width: 2.5;
  stroke-dasharray: 10 6;
  stroke-dashoffset: 0;
  filter: drop-shadow(0 0 6rpx #3a6affcc);
  animation: corner-flow 2.5s linear infinite;
}
@keyframes corner-flow {
  0% { stroke-dashoffset: 0; }
  100% { stroke-dashoffset: 32; }
}
.cyber-particle-bg {
  position: absolute;
  left: 0; top: 0; width: 100%; height: 100%;
  z-index: 1;
  pointer-events: none;
  opacity: 0.22;
  filter: blur(1.5rpx) brightness(1.2);
}
.data-block, .legend-block, .device-switch-card {
  box-shadow: 0 0 32rpx #3a6aff55, 0 0 0 2rpx #00ffe7cc inset, 0 8rpx 32rpx #0008;
  background: linear-gradient(120deg, #232b3b 60%, #1a2233 100%);
  border-radius: 24rpx;
  position: relative;
  overflow: hidden;
  transition: box-shadow 0.3s, transform 0.3s;
  animation: cyber-breath 2.8s infinite alternate cubic-bezier(.23,1.01,.32,1);
}
@keyframes cyber-breath {
  0% { box-shadow: 0 0 24rpx #3a6aff33, 0 0 0 0 #00ffe7cc inset;}
  100% { box-shadow: 0 0 64rpx #3a6affcc, 0 0 24rpx 0 #00ffe7cc inset;}
}
.data-block:hover, .legend-block:hover, .device-switch-card:hover {
  box-shadow: 0 0 64rpx #00ffe7cc, 0 0 0 4rpx #3a6affcc inset, 0 8rpx 32rpx #000a;
  transform: translateY(-6rpx) scale(1.02);
}
.data-block::after, .legend-block::after, .device-switch-card::after {
  content: '';
  position: absolute;
  left: 0; top: 0; width: 100%; height: 100%;
  background: linear-gradient(120deg,rgba(255,255,255,0.12) 0%,rgba(255,255,255,0.02) 100%);
  pointer-events: none;
  z-index: 2;
  opacity: 0.7;
  mix-blend-mode: lighten;
}
.legend-dot {
  position: relative;
  box-shadow: 0 0 16rpx #00ffe7cc, 0 0 32rpx #3a6affcc;
  animation: glowDot 1.5s infinite alternate;
}
.legend-dot::after {
  content: '';
  position: absolute;
  left: 50%; top: 50%;
  width: 100%; height: 100%;
  border-radius: 50%;
  background: inherit;
  opacity: 0.4;
  transform: translate(-50%, -50%) scale(1);
  animation: dot-pulse 1.8s infinite;
  z-index: 1;
  filter: blur(2rpx);
}
@keyframes dot-pulse {
  0% { opacity: 0.4; transform: translate(-50%, -50%) scale(1);}
  70% { opacity: 0; transform: translate(-50%, -50%) scale(2.2);}
  100% { opacity: 0; transform: translate(-50%, -50%) scale(2.2);}
}
.device-switch-btn {
  border: 2rpx solid #00ffe7;
  box-shadow: 0 0 16rpx #00ffe7cc, 0 0 0 2rpx #3a6affcc inset;
  background: linear-gradient(90deg, #3a6aff 60%, #00ffe7 100%);
  position: relative;
  overflow: hidden;
}
.device-switch-btn:active::after {
  content: '';
  position: absolute;
  left: 50%; top: 50%;
  width: 120%; height: 120%;
  background: radial-gradient(circle, #00ffe788 0%, transparent 80%);
  transform: translate(-50%, -50%);
  opacity: 0.7;
  pointer-events: none;
  animation: btn-ripple 0.5s;
}
@keyframes btn-ripple {
  0% { opacity: 0.7; }
  100% { opacity: 0; }
}
.switch-icon {
  animation: iconPulse 1.2s infinite alternate;
}
@keyframes iconPulse {
  0% { filter: drop-shadow(0 0 2rpx #00ffe7cc);}
  100% { filter: drop-shadow(0 0 12rpx #00ffe7cc);}
}

/* 设备切换弹窗终极酷炫赛博风 */
.popup-cyber-outer-bg {
  width: 100vw;
  min-height: 40vh;
  background: linear-gradient(135deg, #1a2233 60%, #232b3b 100%);
  border-radius: 36rpx 36rpx 28rpx 28rpx;
  box-shadow: 0 8rpx 48rpx 0 #00ffe755, 0 0 0 2rpx #3a6aff33 inset;
  padding: 0 0 32rpx 0;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  opacity: 0.98;
  backdrop-filter: blur(12rpx) saturate(1.2);
}
.popup-cyber-card {
  position: relative;
  width: 92vw;
  max-width: 700rpx;
  min-height: 400rpx;
  margin: 0 auto;
  background: linear-gradient(120deg, #232b3b 60%, #1a2233 100%);
  border-radius: 32rpx;
  box-shadow: 0 0 64rpx #00ffe7cc, 0 0 0 4rpx #3a6affcc inset, 0 8rpx 32rpx #000a;
  border: 2.5rpx solid #00ffe7cc;
  padding: 0 0 32rpx 0;
  overflow: hidden;
  animation: cyber-breath 2.8s infinite alternate cubic-bezier(.23,1.01,.32,1);
  z-index: 100;
}
.popup-cyber-border {
  position: absolute;
  left: 0; top: 0; width: 100%; height: 100%;
  pointer-events: none;
  z-index: 101;
}
.popup-title {
  font-size: 36rpx;
  color: #b6e0ff;
  font-weight: 700;
  text-align: center;
  padding: 40rpx 0 24rpx 0;
  letter-spacing: 2rpx;
  text-shadow: 0 0 16rpx #3a6affcc, 0 0 32rpx #00ffe7cc;
  background: linear-gradient(90deg, #3a6aff 30%, #00ffe7 70%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: cyber-title-glow 2.5s infinite alternate;
}
@keyframes cyber-title-glow {
  0% { text-shadow: 0 0 8rpx #3a6affcc, 0 0 16rpx #00ffe7cc; }
  100% { text-shadow: 0 0 32rpx #3a6affcc, 0 0 64rpx #00ffe7cc; }
}
.popup-divider {
  width: 90%;
  height: 2rpx;
  margin: 0 auto;
  background: linear-gradient(90deg, #3a6aff 0%, #00ffe7 100%);
  opacity: 0.18;
}
.popup-device-item {
  width: 100%;
  min-height: 100rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 32rpx;
  color: #fff;
  font-weight: 600;
  margin: 0 auto;
  background: rgba(30,40,60,0.98);
  border-radius: 18rpx;
  margin-top: 18rpx;
  box-shadow: 0 0 24rpx #3a6aff33, 0 0 0 2rpx #00ffe7cc inset;
  transition: box-shadow 0.3s, background 0.3s, color 0.3s;
  animation: cyber-breath 2.8s infinite alternate cubic-bezier(.23,1.01,.32,1);
  position: relative;
  cursor: pointer;
  overflow: hidden;
}
.popup-device-item:active, .popup-device-item:focus {
  background: linear-gradient(90deg, #3a6aff 60%, #00ffe7 100%);
  color: #181f2a;
  box-shadow: 0 0 48rpx #00ffe7cc, 0 0 0 4rpx #3a6affcc inset;
}
.popup-device-item::after {
  content: '';
  position: absolute;
  left: 50%; top: 50%;
  width: 120%; height: 120%;
  background: radial-gradient(circle, #00ffe788 0%, transparent 80%);
  transform: translate(-50%, -50%) scale(0);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s, transform 0.3s;
}
.popup-device-item:active::after {
  opacity: 0.7;
  transform: translate(-50%, -50%) scale(1);
}
.popup-cancel-btn {
  width: 100%;
  min-height: 80rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 32rpx;
  color: #fff;
  font-weight: 700;
  margin: 0 auto;
  margin-top: 24rpx;
  background: linear-gradient(90deg, #3a6aff 60%, #00ffe7 100%);
  border-radius: 18rpx;
  box-shadow: 0 0 24rpx #00ffe7cc, 0 0 0 2rpx #3a6affcc inset;
  position: relative;
  cursor: pointer;
  overflow: hidden;
  transition: box-shadow 0.3s, background 0.3s, color 0.3s;
}
.popup-cancel-btn:active::after {
  content: '';
  position: absolute;
  left: 50%; top: 50%;
  width: 120%; height: 120%;
  background: radial-gradient(circle, #00ffe788 0%, transparent 80%);
  transform: translate(-50%, -50%);
  opacity: 0.7;
  pointer-events: none;
  animation: btn-ripple 0.5s;
}

/* 终极优化弹窗圆角，适配所有uView层级，彻底杜绝白角穿帮 */
:deep(.u-popup),
:deep(.u-popup__wrapper),
:deep(.u-popup__content),
:deep(.u-transition),
:deep(.u-overlay) {
  border-radius: 36rpx 36rpx 28rpx 28rpx !important;
  overflow: hidden !important;
  background: rgba(20,28,40,0.92) !important;
  z-index: 99999 !important;
  box-shadow: 0 8rpx 48rpx 0 #00ffe755, 0 0 0 2rpx #3a6aff33 inset !important;
}
</style>
