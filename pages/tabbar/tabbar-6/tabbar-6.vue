<template>
  <view class="content">
    <div class="loginHead">Healthy sleep</div>
    <div class="signIn">
      <div class="sign">Re</div>
      <div class="in">set</div>
    </div>
    <div class="zhmm">
      <u--input
        placeholder="手机号码"
        prefixIcon="phone-fill"
        prefixIconStyle="font-size: 50rpx;color: #465FFA"
        v-model="form.phone"
      ></u--input>
      <u--input
        placeholder="新密码"
        prefixIcon="bag-fill"
        prefixIconStyle="font-size: 50rpx;color: #465FFA"
        v-model="form.password"
        :password="true"
      ></u--input>
      <u--input
        placeholder="确认新密码"
        prefixIcon="bag-fill"
        prefixIconStyle="font-size: 50rpx;color: #465FFA"
        v-model="Newpassword1"
        :password="true"
      ></u--input>
      <div
        style="
          width: 600rpx;
          height: 100rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          top: 10rpx;
        "
      >
        <u--input
          placeholder="验证码"
          prefixIcon="bag-fill"
          prefixIconStyle="font-size: 50rpx;color: #465FFA"
          v-model="form.code"
          style="width: 80rpx; height: 68rpx; margin-left: -20rpx"
        ></u--input>
        <div style="width: 180rpx; height: 50%">
          <u-button
            type="primary"
            style="margin-top: -4rpx; height: 90rpx; margin-left: 20rpx"
            @click="startCountdown"
            >{{ codeText }}</u-button
          >
        </div>
      </div>
    </div>
    <div class="bottomI" style="margin-top:30rpx">
      <u-button
        type="primary"
        text="确定"
        style="width: 100%; color: #fff; height: 100rpx;margin-top:14rpx"
        @click="resetPsd"
      ></u-button>
    </div>
    <div style="color: #465ffa;margin-top:14rpx" @click="jumpLogin">返回登录</div>
  </view>
</template>

<script>
import form from "uview-ui/libs/config/props/form";

export default {
  data() {
    return {
      form: {
        // userName: 'jiukuankeji',
        // password: 'jiukuankeji123',
        userName: "",
        password: "",
        code: "",
        phone: "",
      },
      Newpassword1: "",
      codeText: "验证码",
      countDown: 60,
      timer: null,
    };
  },
  mounted() {
    console.log(uni.$u.config.v);
  },
  methods: {
    async resetPsd() {
      if (!this.form.phone) {
        return uni.showToast({
          title: "请输入手机号码",
          icon: "none",
          duration: 1000,
          mask: true,
        });
      }
	  if (!this.form.password) {
        return uni.showToast({
          title: "新输入新密码",
          icon: "none",
          duration: 1000,
          mask: true,
        });
      }
	  if (!this.form.code) {
        return uni.showToast({
          title: "请输入验证码",
          icon: "none",
          duration: 1000,
          mask: true,
        });
      }
      if (this.form.password != this.Newpassword1) {
        return uni.showToast({
          title: "新密码不一致",
          icon: "none",
          duration: 1000,
          mask: true,
        });
      }
      const res = await this.$myRequest({
        url: "/user/changepassword",
        method: "POST",
        data: {
          phoneNumber: this.form.phone,
          password:this.form.password,
          code:this.form.code,
          type:3
        },
      });
      if (res.data.code == 200) {
        uni.showToast({
          title: "重置成功!",
          icon: "none",
          duration: 1000,
          mask: true,
          });
        uni.reLaunch({
          url: "/pages/login/login",
        });			
      }
    },
    async startCountdown() {
      if(!this.form.phone){
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
          phoneNumber: this.form.phone,
          type: 3,
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
      this.codeText = "验证码";
    },
    jumpLogin() {
      uni.reLaunch({
        url: "/pages/login/login",
      });
    },
  },
};
</script>
<style scoped>
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
  height: 140rpx;
  display: flex;
  align-items: center;
  padding-left: 80rpx;
  font-size: 2.3em;
  font-weight: 700;
}

.in {
  color: #465ffa;
}

.sign {
  color: #3c3c3c;
}

.zhmm {
  width: 100%;
  height: 460rpx;
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
  margin-left:7%;
  height: 120rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top:20rpx;
}
::v-deep .u-button__text {
  font-size: 36rpx !important;
  font-weight: 700;
}
</style>
