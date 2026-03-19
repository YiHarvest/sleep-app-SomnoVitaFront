<template>
  <view class="content">
    <div class="loginHead">Healthy sleep</div>
    <div
      style="
        display: flex;
        padding-left: 80rpx;
        margin-top: 50rpx;
        font-size: 40rpx;
        font-weight: 700;
        height: 60rpx;
      "
    >
      <div :class="{ active: CurrentIndex == 0 }" @click="currentChange('0')">
        密码登录
      </div>
      <div
        style="margin-left: 40rpx"
        :class="{ active: CurrentIndex == 1 }"
        @click="currentChange('1')"
      >
        验证码登录
      </div>
    </div>
    <div class="signIn">
      <div class="sign">Sign</div>
      <div class="in">In</div>
    </div>
    <div v-if="CurrentIndex == 0">
      <div class="zhmm">
        <u-input
          placeholder="账号名称"
          prefixIcon="account-fill"
          prefixIconStyle="font-size: 50rpx;color: #465FFA"
          v-model="form.userName"
        ></u-input>
        <u--input
          placeholder="账户密码"
          prefixIcon="bag-fill"
          prefixIconStyle="font-size: 50rpx;color: #465FFA"
          v-model="form.password"
          :password="true"
        ></u--input>
      </div>
      <div class="bottomI">
        <u-button
          type="primary"
          text="确定"
          style="width: 100%; color: #fff; height: 100rpx"
          @click="login"
        ></u-button>
      </div>
    </div>
    <div v-if="CurrentIndex == 1">
      <div class="zhmm1">
        <u--input
          placeholder="手机号码"
          prefixIcon="phone-fill"
          prefixIconStyle="font-size: 50rpx;color: #465FFA"
          v-model="form1.phone"
        ></u--input>
        <div style="width:600rpx;height:100rpx;display:flex;align-items: center;justify-content: center;">
			<u--input
				placeholder="验证码"
				prefixIcon="bag-fill"
				prefixIconStyle="font-size: 50rpx;color: #465FFA"
				v-model="form1.code"
				style="width: 80rpx;height:68rpx;margin-left:-20rpx"
			></u--input>
				<div style="width:180rpx;height:50%;">
					<u-button type="primary" style="margin-top:-5rpx;height:88rpx;margin-left:20rpx;" @click="startCountdown">{{codeText}}</u-button>
				</div>
		</div>

      </div>
      <div class="bottomI">
        <u-button
          type="primary"
          text="确定"
          style="width: 100% !important; color: #fff; height: 100rpx"
          @click="PhoneLogin"
        ></u-button>
      </div>
    </div>
    <div style="color: #465ffa; display: flex; justify-content: space-around;margin-top:40rpx;">
      <div @click="jumpRegister">没有账号？前往注册</div>
    </div>
    <div style="color: #465ffa; display: flex; justify-content: space-around;margin-top:40rpx">
      <div @click="jumpForget">忘记密码?</div>
    </div>
  </view>
</template>

<script>
import form from "uview-ui/libs/config/props/form";

export default {
  data() {
    return {
      form: {
        userName: "",
        password: "",
      },
      form1: {
        phone: "",
        code: "",
      },
      CurrentIndex: 0,
	  codeText:'验证码',
	  countDown:60,
	  timer:null
    };
  },
  mounted() {
    console.log(uni.$u.config.v);
  },
  methods: {
    async login() {
      const res = await this.$myRequest({
        url: "/user/login",
        method: "POST",
        data: {
          userName: this.form.userName,
          password: this.form.password,
        },
      });
      if (res.data.code == 200) {
        uni.setStorageSync('mytoken',res.data.data.token)
        uni.setStorage({
          key: "userInfo",
          data: res.data.data,
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
      }
    },
	async PhoneLogin(){
		const res = await this.$myRequest({
			url: "/user/loginByPhone",
			method: "POST",
			data: {
				phoneNumber: this.form1.phone,
				type: 1,
				code:this.form1.code
			},
		});
		if (res.data.code == 200) {
      uni.setStorageSync('mytoken',res.data.data.token)
      this.$globalData.token = res.data.data.token
			uni.setStorage({
			key: "userInfo",
			data: res.data.data,
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
      }
	},
	// getCode(){
    //    this.startCountdown()
	// },
	async startCountdown(){
    if(!this.form1.phone){
		return uni.showToast({
				title: "请填写手机号码!",
				icon: "none",
				duration: 1000,
				mask: true,
				});
	  }
		if (this.timer) return;
		const res = await this.$myRequest({
			url: "/user/sendcode",
			method: "POST",
			data: {
				phoneNumber: this.form1.phone,
				type: 1,
			},
		});
		if (res.data.code == 200) {
			uni.showToast({
				title: "发送成功!",
				icon: "none",
				duration: 1000,
				mask: true,
				});
		}
		this.timer = setInterval(() => {
			if (this.countDown > 0) {
				this.countDown--;
				this.codeText = `${this.countDown}秒`;
			} else {
			 this.resetCountdown();
			}
		}, 1000);
	},
	resetCountdown() {
      clearInterval(this.timer);
      this.timer = null;
      this.countdown = 60;
      this.codeText = '验证码';
    },
    currentChange(index) {
      this.CurrentIndex = index;
      this.form = {
        userName: "",
        password: "",
      };
      this.form1 = {
        phone: "",
        code: "",
      };
    },
    jumpRegister() {
      uni.reLaunch({
        url: "/pages/tabbar/tabbar-3/tabbar-3",
      });
    },
    jumpForget() {
      uni.reLaunch({
        url: "/pages/tabbar/tabbar-6/tabbar-6",
      });
    },
  },
};
</script>
<style scoped>
.active {
  border-bottom: 2px solid #465ffa;
  color: #465ffa;
}
.content {
  text-align: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.loginHead {
  width: 100%;
  height: 373rpx;
  background-image: url('https://javaimg-1316092519.cos.ap-nanjing.myqcloud.com/f9498ce14c7bf7aeadad3108ce067af9.png');
  background-size: 100% 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 2.3em;
  font-weight: 700;
}

.signIn {
  width: 100%;
  height: 150rpx;
  display: flex;
  align-items: center;
  padding-left: 80rpx;
  font-size: 2.3em;
  font-weight: 700;
}

.in {
  color: #465ffa;
  margin-left: 20rpx;
}

.sign {
  color: #3c3c3c;
}

.zhmm {
  width: 100%;
  height: 240rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  /* background: red; */
}
.zhmm1 {
  width: 100%;
  height: 220rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  /* background: red; */
}
.u-input--radius,
.u-input--square {
  background: #f2f2f2;
  width: 80%;
  height: 400rpx;
  margin-top: 30rpx;
}

.u-button--primary {
  background: #465ffa;
}
.bottomI {
  width: 84%;
  margin-left:8%;
  height: 200rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
::v-deep .u-button__text {
  font-size: 36rpx !important;
  font-weight: 700;
}
</style>
