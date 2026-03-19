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
      <view style="margin-left: 14upx">联系信息</view>
    </view>
    <u-line></u-line>
    <u--form labelPosition="left" :model="model1" ref="uForm" >
      <u-form-item
        label="姓名"
        prop="userInfo.name"
        borderBottom
        ref="item1"
        label-width="140"
        labelAlign="right"
		
      >
        <u--input
          v-model="userInfo.name"
          disabled
          disabledColor="#ffffff"
          border="none"
          input-align="right"
        ></u--input>
      </u-form-item>
      <u-form-item
        label="联系信息"
        prop="userInfo.sex"
        borderBottom
        label-width="140"
		@click="copyPhone"
        ref="item1"
      >
        <u--input
          v-model="userInfo.sex"
          disabled
          disabledColor="#ffffff"
          border="none"
          input-align="right"
        ></u--input>
        <u-icon slot="right" name="arrow-right"></u-icon>
      </u-form-item>
	  <u-form-item
        label="公司名称"
        prop="userInfo.comName"
        borderBottom
        ref="item1"
        label-width="140"
        labelAlign="right"
		
      >
        <u--input
          v-model="userInfo.comName"
          disabled
          disabledColor="#ffffff"
          border="none"
          input-align="right"
        ></u--input>
      </u-form-item>
	  <u-form-item
        label="公司地址"
        prop="userInfo.adress"
        borderBottom
        ref="item1"
        label-width="140"
        labelAlign="right"
		
      >
        <u--input
          v-model="userInfo.adress"
          disabled
          disabledColor="#ffffff"
          border="none"
          input-align="right"
        ></u--input>
      </u-form-item>
    </u--form>
  </view>
</template>

<script>
export default {
  data() {
    return {
      userInfo: {
        name: "俞容文",
        sex: "18159892927（微信同号）",
		adress:'温州市龙湾区永中街道金联路1号3号楼310室',
		comName:'温州梦谷云科技有限公司'
      },
    };
  },
  onLoad() {},
  methods: {
	copyPhone(){
		uni.setClipboardData({
			data:'18159892927',//要被复制的内容
			success:()=>{
				uni.showToast({
				title:"复制成功"
				})
			}
	});

	}
  },
};
</script>

<style>
.content {
  padding: 0 10px;
}
</style>
