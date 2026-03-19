<template>
  <view class="content">
    <view v-if="type == 'co2'">
      <view
        style="
          display: flex;
          padding-left: 40rpx;
          height: 50rpx;
          align-items: center;
        "
      >
        <view>
          <image src="../../../static/img/1.png" style="width: 40rpx;height:50rpx"></image>
        </view>
        <view style="margin-left: 10rpx; color: #fff; font-size: 40rpx">
          PM2.5
        </view>
      </view>
      <view
        style="
          width: 100%;
          height: 150rpx;
          display: flex;
          justify-content: center;
          align-items: center;
        "
      >
        <view style="font-size: 70rpx; font-weight: 700">  {{ devicesInfo.co2.value }} </view>
        <view
          style="
            font-size: 40rpx;
            font-weight: 700;
            position: relative;
            top: 8rpx;
            left: 10rpx;
          "
        >
          ppm
        </view>
      </view>
      <view style="width: 100%; height: 80rpx; padding: 0 2%; display: flex">
        <view
          style="
            width: 24%;
            height: 80rpx;
            background: #57e247;
            display: flex;
            justify-content: center;
            align-items: center;
            font-weight: 700;
          "
        >
          正常
        </view>
        <view
          style="
            width: 24%;
            height: 80rpx;
            background: #f8e354;
            display: flex;
            justify-content: center;
            align-items: center;
            font-weight: 700;
          "
        >
          浓度略高 </view
        ><view
          style="
            width: 24%;
            height: 80rpx;
            background: #fc3c25;
            display: flex;
            justify-content: center;
            align-items: center;
            font-weight: 700;
          "
        >
          浓度较高 </view
        ><view
          style="
            width: 24%;
            height: 80rpx;
            background: #813b43;
            display: flex;
            justify-content: center;
            align-items: center;
            font-weight: 700;
          "
        >
          浓度超高
        </view>
      </view>
      <view style="width: 100%; height: 80rpx; padding: 0 2%; display: flex">
        <view
          style="
            width: 24%;
            height: 80rpx;
            display: flex;
            justify-content: flex-end;
            font-size: 40rpx;
            font-weight: 700;
          "
        >
          <span style="position: relative; left: 45rpx; top: 10rpx">1000</span>
        </view>
        <view
          style="
            width: 24%;
            height: 80rpx;
            display: flex;
            justify-content: flex-end;
            font-size: 40rpx;
            font-weight: 700;
          "
        >
          <span style="position: relative; left: 45rpx; top: 10rpx">2000</span>
        </view>

        <view
          style="
            width: 24%;
            height: 80rpx;
            display: flex;
            justify-content: flex-end;
            font-size: 40rpx;
            font-weight: 700;
          "
        >
          <span style="position: relative; left: 45rpx; top: 10rpx">3000</span>
        </view>
      </view>

      <view style="width: 100%; text-indent: 2em; font-size: 38rpx">
        CO2 即二氧化碳，是空气中常见的化合物，约占大气体积的 0.04%(40 ppm)。
        二氧化碳通常由燃烧有机化合物、细胞的呼吸作用、微生物的发酵作用等所产生。室内二氧化碳主要来自于人的呼吸。
      </view>
      <view style="margin-top: 30rpx; text-indent: 2em; font-size: 38rpx">
        当室内二氧化碳高于 1000 ppm 时，有些人可能会出现恶心和头疼的症状。当高于
        5000ppm时，请避免在该环境下停留超过 8 小时。
      </view>
    </view>

    <view v-if="type == 'wd' || type == 'sd'">
      <view
        style="
          display: flex;
          padding-left: 40rpx;
          height: 50rpx;
          align-items: center;
        "
        v-if="type == 'wd'"
      >
        <view>
          <image src="../../../static/img/2.png" style="width: 40rpx;height:50rpx"></image>
        </view>
        <view style="margin-left: 10rpx; color: #fff; font-size: 40rpx">
          温度
        </view>
      </view>
      <view
        style="
          display: flex;
          padding-left: 40rpx;
          height: 50rpx;
          align-items: center;
        "
        v-if="type == 'sd'"
      >
        <view>
          <image src="../../../static/img/3.png" style="width: 40rpx;height:50rpx"></image>
        </view>
        <view style="margin-left: 10rpx; color: #fff; font-size: 40rpx">
          湿度
        </view>
      </view>
      <view
        style="
          width: 100%;
          height: 150rpx;
          display: flex;
          justify-content: center;
          align-items: center;
        "
        v-if="type == 'wd'"
      >
        <view style="font-size: 70rpx; font-weight: 700"> {{ devicesInfo.temperature.value.toFixed(1) }} </view>
        <view
          style="
            font-size: 40rpx;
            font-weight: 700;
            position: relative;
            top: 8rpx;
            left: 10rpx;
          "
        >
          ℃
        </view>
      </view>
      <view
        style="
          width: 100%;
          height: 150rpx;
          display: flex;
          justify-content: center;
          align-items: center;
        "
        v-if="type == 'sd'"
      >
        <view style="font-size: 70rpx; font-weight: 700">   {{ devicesInfo.humidity.value.toFixed(1) }} </view>
        <view
          style="
            font-size: 40rpx;
            font-weight: 700;
            position: relative;
            top: 8rpx;
            left: 10rpx;
          "
        >
          %
        </view>
      </view>

      <view style="width: 100%; text-indent: 2em; font-size: 38rpx">
        人体感受到的温度取决于多项因素，例如气温、热辐射、相对湿度、风速、人体活动和健康状况、着装等。其中温度和相对湿度是影响人体舒适度的两个重要因素。
      </view>
      <view style="margin-top: 30rpx; text-indent: 2em; font-size: 38rpx">
        冬季，温度在20℃~24℃、相对湿度在30%~60%时，人体感觉最为舒适；夏季25%~60%时，人体感觉最为舒适
      </view>
    </view>
    <view v-if="type == 'jq'">
      <view
        style="
          display: flex;
          padding-left: 40rpx;
          height: 50rpx;
          align-items: center;
        "
      >
        <view>
          <image src="../../../static/img/4.png" style="width: 40rpx;height:50rpx"></image>
        </view>
        <view style="margin-left: 10rpx; color: #fff; font-size: 40rpx">
          tVOC
        </view>
      </view>
      <view
        style="
          width: 100%;
          height: 150rpx;
          display: flex;
          justify-content: center;
          align-items: center;
        "
      >
        <view style="font-size: 70rpx; font-weight: 700"> 
        {{(devicesInfo.tvoc.value / 100).toFixed(2)}} 
        </view>
        <view
          style="
            font-size: 40rpx;
            font-weight: 700;
            position: relative;
            top: 8rpx;
            left: 10rpx;
          "
        >
          mg/m³
        </view>
      </view>
      <view style="width: 100%; height: 80rpx; padding: 0 2%; display: flex">
        <view
          style="
            width: 19%;
            height: 80rpx;
            background: #57e247;
            display: flex;
            justify-content: center;
            align-items: center;
            font-weight: 700;
          "
        >
          优
        </view>
        <view
          style="
            width: 19%;
            height: 80rpx;
            background: #57d247;
            display: flex;
            justify-content: center;
            align-items: center;
            font-weight: 700;
          "
        >
          良 </view
        ><view
          style="
            width: 19%;
            height: 80rpx;
            background: #F8E354;
            display: flex;
            justify-content: center;
            align-items: center;
            font-weight: 700;
          "
        >
          浓度略高 </view
        ><view
          style="
            width: 19%;
            height: 80rpx;
            background: #fc3c25;
            display: flex;
            justify-content: center;
            align-items: center;
            font-weight: 700;
          "
        >
		 浓度较高
        </view>
		<view
          style="
            width: 19%;
            height: 80rpx;
            background: #813b43;
            display: flex;
            justify-content: center;
            align-items: center;
            font-weight: 700;
          "
        >
          浓度超高
        </view>
      </view>
      <view style="width: 100%; height: 80rpx; padding: 0 2%; display: flex">
        <view
          style="
            width: 19%;
            height: 80rpx;
            display: flex;
            justify-content: flex-end;
            font-size: 40rpx;
            font-weight: 700;
          "
        >
          <span style="position: relative; left: 10px; top: 10rpx">0.3</span>
        </view>
        <view
          style="
            width: 19%;
            height: 80rpx;
            display: flex;
            justify-content: flex-end;
            font-size: 40rpx;
            font-weight: 700;
          "
        >
          <span style="position: relative; left: 10rpx; top: 10rpx">1</span>
        </view>

        <view
          style="
            width: 19%;
            height: 80rpx;
            display: flex;
            justify-content: flex-end;
            font-size: 40rpx;
            font-weight: 700;
          "
        >
          <span style="position: relative; left: 10rpx; top: 10rpx">3</span>
        </view>
		<view
          style="
            width: 19%;
            height: 80rpx;
            display: flex;
            justify-content: flex-end;
            font-size: 40rpx;
            font-weight: 700;
          "
        >
          <span style="position: relative; left: 10rpx; top: 10rpx">9</span>
        </view>
      </view>

      <view style="width: 100%; text-indent: 2em; font-size: 38rpx">
        VOC
        即总挥发性有机物，包含上千种化合物，可能有刺激性气味，其中部分有机物对人体有害。
        室内人员增多时，或进行烹饪、进餐、清洁、化妆等活动时， tVOC
        读数可能大幅升高，通常会在相关活动结束或通风后回落。
      </view>
      <view style="margin-top: 30rpx; text-indent: 2em; font-size: 38rpx">
        当检测仪附近有未密封的含有酒精的物质时tVOC 读数也会显著升高。
      </view>
      <view style="margin-top: 30rpx; text-indent: 2em; font-size: 38rpx">
        室内 tVOC
        还可能来自煤或天然气、烟草等的燃烧产物，以及建筑和装饰、家具、家用电器使用的材料。
      </view>
      <view style="margin-top: 30rpx; text-indent: 2em; font-size: 38rpx">
        当 tVOC 高于 3 mg/m3 时，应避免在该环境下持续停留超过 1 个月。
      </view>
      <view style="margin-top: 30rpx; text-indent: 2em; font-size: 38rpx">
        不同工作原理或不同厂商出品的检测设备的
        tvOC检测结果可能有较大差异。在不同环境下初始化的青萍空气检测仪的 tvoC
        读数可能有较大差异 如要比较多台青萍空气检测仪的 tVoC 读数一致
        性，需在相同环境下同时重置他们的 tVOC 传感器，然后观察。
      </view>
    </view>
	<view v-if="type == 'pm2.5'" >
      <view
        style="
          display: flex;
          padding-left: 40rpx;
          height: 50rpx;
          align-items: center;
        "
      >
        <view>
          <image src="../../../static/img/5.png" style="width: 40rpx;height:50rpx"></image>
        </view>
        <view style="margin-left: 10rpx; color: #fff; font-size: 40rpx">
          PM2.5
        </view>
      </view>
      <view
        style="
          width: 100%;
          height: 150rpx;
          display: flex;
          justify-content: center;
          align-items: center;
        "
      >
        <view style="font-size: 70rpx; font-weight: 700">    {{ devicesInfo.pm25.value }} </view>
        <view
          style="
            font-size: 40rpx;
            font-weight: 700;
            position: relative;
            top: 8rpx;
            left: 10rpx;
          "
        >
          μg/m³
        </view>
      </view>
      <view style="width: 100%; height: 80rpx; padding: 0 2%; display: flex;font-size:24rpx">
        <view
          style="
            width: 16%;
            height: 80rpx;
            background: #57e247;
            display: flex;
            justify-content: center;
            align-items: center;
            font-weight: 700;
          "
        >
          优
        </view>
        <view
          style="
            width: 16%;
            height: 80rpx;
            background: #F8E354;
            display: flex;
            justify-content: center;
            align-items: center;
            font-weight: 700;
          "
        >
          良 </view
        ><view
          style="
            width: 16%;
            height: 80rpx;
            background: #F98538;
            display: flex;
            justify-content: center;
            align-items: center;
            font-weight: 700;
          "
        >
          轻度污染 </view
        ><view
          style="
            width: 16%;
            height: 80rpx;
            background: #fc3c25;
            display: flex;
            justify-content: center;
            align-items: center;
            font-weight: 700;
          "
        >
		 中度污染
        </view>
		<view
          style="
            width: 16%;
            height: 80rpx;
            background: #EF4890;
            display: flex;
            justify-content: center;
            align-items: center;
            font-weight: 700;
          "
        >
          重度污染
        </view>
		<view
          style="
            width: 16%;
            height: 80rpx;
            background: #813b43;
            display: flex;
            justify-content: center;
            align-items: center;
            font-weight: 700;
          "
        >
          严重污染
        </view>
      </view>
      <view style="width: 100%; height: 80rpx; padding: 0 2%; display: flex">
        <view
          style="
            width: 16%;
            height: 80rpx;
            display: flex;
            justify-content: flex-end;
            font-size: 40rpx;
            font-weight: 700;
          "
        >
          <span style="position: relative; left: 25rpx; top: 10rpx">35</span>
        </view>
        <view
          style="
            width: 16%;
            height: 80rpx;
            display: flex;
            justify-content: flex-end;
            font-size: 40rpx;
            font-weight: 700;
          "
        >
          <span style="position: relative; left: 25rpx; top: 10rpx">75</span>
        </view>

        <view
          style="
            width: 16%;
            height: 80rpx;
            display: flex;
            justify-content: flex-end;
            font-size: 40rpx;
            font-weight: 700;
          "
        >
          <span style="position: relative; left: 38rpx; top: 10rpx">115</span>
        </view>
		<view
          style="
            width: 16%;
            height: 80rpx;
            display: flex;
            justify-content: flex-end;
            font-size: 40rpx;
            font-weight: 700;
          "
        >
          <span style="position: relative; left: 38rpx; top: 10rpx">150</span>
        </view>
		<view
          style="
            width: 16%;
            height: 80rpx;
            display: flex;
            justify-content: flex-end;
            font-size: 40rpx;
            font-weight: 700;
          "
        >
          <span style="position: relative; left: 38rpx; top: 10rpx">250</span>
        </view>
      </view>

      <view style="width: 100%; text-indent: 2em; font-size: 38rpx">
        VOC
        即总挥发性有机物，包含上千种化合物，可能有刺激性气味，其中部分有机物对人体有害。
        室内人员增多时，或进行烹饪、进餐、清洁、化妆等活动时， tVOC
        读数可能大幅升高，通常会在相关活动结束或通风后回落。
      </view>
      <view style="margin-top: 30rpx; text-indent: 2em; font-size: 38rpx">
        当检测仪附近有未密封的含有酒精的物质时tVOC 读数也会显著升高。
      </view>
      <view style="margin-top: 30rpx; text-indent: 2em; font-size: 38rpx">
        室内 tVOC
        还可能来自煤或天然气、烟草等的燃烧产物，以及建筑和装饰、家具、家用电器使用的材料。
      </view>
      <view style="margin-top: 30rpx; text-indent: 2em; font-size: 38rpx">
        当 tVOC 高于 3 mg/m3 时，应避免在该环境下持续停留超过 1 个月。
      </view>
      <view style="margin-top: 30rpx; text-indent: 2em; font-size: 38rpx">
        不同工作原理或不同厂商出品的检测设备的
        tvOC检测结果可能有较大差异。在不同环境下初始化的青萍空气检测仪的 tvoC
        读数可能有较大差异 如要比较多台青萍空气检测仪的 tVoC 读数一致
        性，需在相同环境下同时重置他们的 tVOC 传感器，然后观察。
      </view>
    </view>
  </view>
</template>

<script>
import qs from 'qs'
export default {
  data() {
    return {
      type: "",
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
    };
  },
  onShow() {
  },
  onLoad(options) {
  
     
  },
  methods:{
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
          },
          fail: (res) => {
            
          },
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
          }
        },
        fail: (res) => {
          
        },
      });
    },
  }
};
</script>

<style scoped>
* {
  font-family: "黑体" !important;
  font-weight:500;
}
.content {
   background-image:url('https://javaimg-1316092519.cos.ap-nanjing.myqcloud.com/6a646535f93bd93d071caecab834e4bc.png');
  background-size: 100% 100%;
  width: 750rpx;
  color: #fff;
  padding: 30rpx;
  min-height: 98%;
  box-sizing: border-box;

}
</style>
