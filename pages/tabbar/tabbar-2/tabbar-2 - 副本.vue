<template>
  <view>
    <view class="content" @touchstart="hideDrawer">
      <scroll-view
        class="msg-list"
        scroll-y="true"
        :scroll-with-animation="scrollAnimation"
        :scroll-top="scrollTop"
        :scroll-into-view="scrollToView"
        @scrolltoupper="loadHistory"
        upper-threshold="50"
      >
        <!-- 加载历史数据waitingUI -->
        <view class="loading" v-if="isHistoryLoading">
          <view class="spinner">
            <view class="rect1"></view>
            <view class="rect2"></view>
            <view class="rect3"></view>
            <view class="rect4"></view>
            <view class="rect5"></view>
          </view>
        </view>
        <view
          class="row"
          v-for="(row, index) in msgList"
          :key="index"
          :id="'msg' + row.msg.id"
        >
          <!-- 系统消息 -->
          <block v-if="row.type == 'system'">
            <view class="system">
              <!-- 文字消息 -->
              <view v-if="row.msg.type == 'text'" class="text">
                {{ row.msg.content.text }}
              </view>
            </view>
          </block>
          <!-- 用户消息 -->
          <block v-if="row.type == 'user'">
            <!-- 自己发出的消息 -->
            <view class="my" v-if="row.msg.userinfo.uid == myuid">
              <!-- 左-消息 -->
              <view class="left">
                <!-- 文字消息 -->
                <view class="username1" >
                  <view class="name">{{ row.msg.userinfo.username }}</view>
                  <view class="time">{{ row.msg.time }}</view>
                </view>
                <view class="bubble">
                  <rich-text :nodes="row.msg.content"></rich-text>
                </view>
              </view>
              <!-- 右-头像 -->
              <view class="right">
                <image :src="row.msg.userinfo.face"></image>
              </view>
            </view>
            <!-- 别人发出的消息 -->
            <view class="other" v-if="row.msg.userinfo.uid != myuid">
              <!-- 左-头像 -->
              <view class="left">
                <image :src="row.msg.userinfo.face"></image>
              </view>
              <!-- 右-用户名称-时间-消息 -->
              <view class="right">
                <view class="username">
                  <view class="name">{{ row.msg.userinfo.username }}</view>
                  <view class="time">{{ row.msg.time }}</view>
                </view>
                <!-- 文字消息 -->
                <view class="bubble">
                  <rich-text :nodes="row.msg.content"></rich-text>
                </view>
              </view>
            </view>
          </block>
        </view>
      </scroll-view>
    </view>

    <!-- 底部输入栏 -->
    <view
      class="input-box"
      :class="popupLayerClass"
      @touchmove.stop.prevent="discard"
    >
      <!-- H5下不能录音，输入栏布局改动一下 -->
      <!-- #ifndef H5 -->
      <view class="voice">
        <view
          class="icon"
          :class="isVoice ? 'jianpan' : 'yuyin'"
          @tap="switchVoice"
        ></view>
      </view>
      <!-- #endif -->
      <!-- #ifdef H5 -->
      <!-- #endif -->
      <view class="textbox">
        <view
          class="voice-mode"
          :class="[isVoice ? '' : 'hidden', recording ? 'recording' : '']"
          @touchstart="streamRecord" @touchend="endStreamRecord" form-type="submit"
          >{{ voiceTis }}</view
        >
        <view class="text-mode" :class="isVoice ? 'hidden' : ''">
          <view class="box">
            <textarea
              auto-height="true"
              v-model="textMsg"
              @focus="textareaFocus"
            />
          </view>
          <!-- <view class="em" @tap="chooseEmoji">
						<view class="icon biaoqing"></view>
					</view> -->
        </view>
      </view>
      <!-- #ifndef H5 -->
      <!-- 	<view class="more" @tap="showMore">
				<view class="icon add"></view>
			</view> -->
      <!-- #endif -->
      <view class="send" :class="isVoice ? 'hidden' : ''" @tap="sendText">
        <view class="btn">发送</view>
      </view>
      <!-- 语音音阶动画 长按说话时的动画 -->
      <view class="prompt" v-if="animation">
        <section class="dots-container">
          <view class="dot"></view>
          <view class="dot"></view>
          <view class="dot"></view>
          <view class="dot"></view>
          <view class="dot"></view>
        </section>
        <text>松开 结束</text>
      </view>
    </view>
  </view>
</template>
<script>
import { pathToBase64 } from "image-tools";
var plugin = requirePlugin("WechatSI")
let manager = plugin.getRecordRecognitionManager()
export default {
  data() {
    return {
      //文字消息
      textMsg: "",
      //消息列表
      isHistoryLoading: false,
      scrollAnimation: false,
      scrollTop: 0,
      scrollToView: "",
      options: {}, // 语音转文字的设置
      msgList: [],
      msgImgList: [],
      myuid: 0,
      currentText: "",
			animation: false,

      //录音相关参数
      // #ifndef H5
      //H5不能录音
      RECORDER: uni.getRecorderManager(),
      // #endif
      isVoice: false,
      voiceTis: "按住 说话",
      recordTis: "手指上滑 取消发送",
      recording: false,
      willStop: false,
      initPoint: { identifier: 0, Y: 0 },
      recordTimer: null,
      recordLength: 0,

      //播放语音相关参数
      AUDIO: uni.createInnerAudioContext(),
      playMsgid: null,
      VoiceTimer: null,
      // 抽屉参数
      popupLayerClass: "",
      // more参数
      hideMore: true,
      //表情定义
      hideEmoji: true,
      baiduToken: "",
      text: "",
      adioFileData: "",
      adioSize: "",
      resContent: "",
      msgFlag: true,
      userInfo: {},
      page: {
        pageNo: 2,
        pageSize: 2,
      },
      isRecording: false,
      recorderManager: null,
      tempFilePath: '',
      transcript: ''
    };
  },
   onLoad(option) {
    
    //语音自然播放结束
    this.AUDIO.onEnded((res) => {
      this.playMsgid = null;
    });
    // #ifndef H5
    //录音开始事件
    this.RECORDER.onStart((e) => {
      this.recordBegin(e);
    });
    //录音结束事件
    this.RECORDER.onStop((e) => {
      this.recordEnd(e);
    });
    // #endif
  },
  mounted(){
    this.initRecord()
    this.getMsgList();
  },
  onShow() {
    this.scrollTop = 9999999;
  },
  methods: {
    streamRecord: function() {
				console.log('开始')
				this.animation = true;
				manager.start({
					lang: 'zh_CN',
				})
			},
			endStreamRecord: function(res) {
				this.animation = false;
				console.log('结束',res)
				manager.stop()
			},
			initRecord: function() {
				//有新的识别内容返回，则会调用此事件
				manager.onRecognize = (res) => {
					let text = res.result
					this.textMsg = text
          this.sendMsg(text)
				}
				// 识别结束事件
				manager.onStop = (res) => {
					console.log(res, 37);
					let text = res.result
					if (text == '') {
						console.log('没有说话')
						return
					}
					this.textMsg = text
          this.sendMsg(text)

				}
			},
    // 接受消息(筛选处理)
    screenMsg(msg) {
      //从长连接处转发给这个方法，进行筛选处理
      if (msg.type == "system") {
        // 系统消息
        switch (msg.msg.type) {
          case "text":
            this.addSystemTextMsg(msg);
            break;
        }
      } else if (msg.type == "user") {
        // 用户消息
        switch (msg.msg.type) {
          case "text":
            this.addTextMsg(msg);
            break;
          case "voice":
            this.addVoiceMsg(msg);
            break;
          case "img":
            this.addImgMsg(msg);
            break;
        }

        //非自己的消息震动
        if (msg.msg.userinfo.uid != this.myuid) {
          // uni.vibrateLong();
        }
      }
      this.$nextTick(function () {
        // 滚动到底
        this.scrollToView = "msg" + msg.msg.id;
      });
    },
    generateRandomID() {
      const length = 8; // 生成的ID长度
      const chars = "0123456789"; // 可选的字符集

      let id = "";
      for (let i = 0; i < length; i++) {
        id += chars[Math.floor(Math.random() * chars.length)];
      }

      return id;
    },

    getAccessToken() {
      var _this = this;
      uni.request({
        url: `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=GDlyEuwpqpEghoQoQjR6YKl1&client_secret=UlprLQn1pyjfBLgliey6IT4motFcOEc4`,
        methods: "POST",
        success: (result) => {
          _this.baiduToken = result.data.access_token;
          _this.uploadvoicefile();
        },
        fail: (err) => {},
        complete: (res) => {},
      });
    },
      // 权限校验
      checkPermission() {
      return new Promise((resolve, reject) => {
        uni.authorize({
          scope: 'scope.record',
          success: resolve,
          fail: reject
        })
      })
    },
    initRecorder() {
      this.recorderManager = uni.getRecorderManager()
      
      this.recorderManager.onStop(res => {
        this.tempFilePath = res.tempFilePath
        this.convertSpeech()
      })
    },
     // 开始录音
     async startRecording() {
      console.log('123123123')
      try {
        await this.checkPermission()
        this.isRecording = true
        this.recorderManager.start({
          format: 'mp3',
          duration: 60000
        })
      } catch (e) {
        uni.showToast({ title: '麦克风权限未开启', icon: 'none' })
      }
    },
        // 停止录音
        stopRecording() {
      if (!this.isRecording) return
      this.isRecording = false
      this.recorderManager.stop()
    },
    //触发滑动到顶部(加载历史信息记录)
    async loadHistory(e) {
      if (this.isHistoryLoading) {
        return;
      }
      this.isHistoryLoading = true; //参数作为进入请求标识，防止重复请求
      this.scrollAnimation = false; //关闭滑动动画
      let Viewid = this.msgList[0].msg.id; //记住第一个信息ID
      //本地模拟请求历史记录效果
      const res = await this.$myRequest({
        url:`/web/chat/records?lastId=${Viewid}&limit=3`
      });
      let list = [];
      if (res.data.data.length != 0) {
        this.page.pageNo += 1;
        let newArr = res.data.data.reverse()
        newArr.forEach((item, i) => {
          list.push({
            type: "user",
            msg: {
              id:item.chatId,
              time: item.questionTime.replace('T',' '),
              type: "text",
              userinfo: { uid: 0, username: this.userInfo.userNike, face: "/static/img/a.png" },
              content: item.question,
            },
          });
          list.push({
            type: "user",
            msg: {
              id:item.chatId,
              time: item.answerTime.replace('T',' '),
              type: "text",
              userinfo: { uid: 1, username: "管家", face: "/static/img/q.png" },
              content: item.answer,
            },
          });
        });
        this.msgList.unshift(...list);
        this.$nextTick(function () {
          this.scrollToView = "msg" + Viewid; //跳转上次的第一行信息位置
          this.$nextTick(function () {
            this.scrollAnimation = true; //恢复滚动动画
          });
        });
        this.isHistoryLoading = false;
      }else{
          setTimeout(() => {
          // 消息列表

          let list = [];

          //这段代码很重要，不然每次加载历史数据都会跳到顶部
          this.$nextTick(function () {
            this.scrollToView = "msg" + Viewid; //跳转上次的第一行信息位置
            this.$nextTick(function () {
              this.scrollAnimation = true; //恢复滚动动画
            });
          });
          this.isHistoryLoading = false;
          uni.showToast({
            title:"没有更多历史记录!",
            icon: 'none',
            duration: 1000,
            mask: true,
          });
        }, 1000);
      }
    },
    // 加载初始页面消息
    async getMsgList() {
      var Viewid = ''
      // 消息列表
      const res = await this.$myRequest({
        url:`/web/chat/records?limit=3`
      });
      let list = [];
      if(!res.data.data){return}
      if (res.data.data.length != 0) {
        let newArr = res.data.data.reverse()
        newArr.forEach((item, i) => {
   
          list.push({
            type: "user",
            msg: {
              id: item.chatId,
              time: item.questionTime.replace('T',' '),
              type: "text",
              userinfo: { uid: 0, username: this.userInfo.userNike, face: "/static/img/a.png" },
              content: item.question,
            },
          });
          list.push({
            type: "user",
            msg: {
              id:item.chatId,
              time: item.answerTime.replace('T',' '),
              type: "text",
              userinfo: { uid: 1, username: "管家", face: "/static/img/q.png" },
              content: item.answer,
            },
          });
        });
      }
      this.msgList = list;
      // 滚动到底部
      this.$nextTick(function () {
        //进入页面滚动到底部
        this.scrollTop = 99999999;
        this.$nextTick(function () {
          this.scrollAnimation = true;
        });
      });
    },

    // 打开抽屉
    openDrawer() {
      this.popupLayerClass = "showLayer";
    },
    // 隐藏抽屉
    hideDrawer() {
      this.popupLayerClass = "";
      setTimeout(() => {
        this.hideMore = true;
        this.hideEmoji = true;
      }, 150);
    },

    //获取焦点，如果不是选表情ing,则关闭抽屉
    textareaFocus() {
      if (this.popupLayerClass == "showLayer" && this.hideMore == false) {
        this.hideDrawer();
      }
    },
    // 发送文字消息
    sendText() {
      this.hideDrawer(); //隐藏抽屉
      let content = this.textMsg;
      this.sendMsg(content, "text");
      this.textMsg = ""; //清空输入框
    },

    // 发送消息
    sendMsg(content) {
      if (!this.msgFlag) {
        return uni.showToast({
          title: "请先等管家回复完成",
          icon: "none",
          duration: 1000,
          mask: true,
          position: "bottom",
        });
      }
      if (!content) {
        return uni.showToast({
          title: "消息不能为空哦",
          icon: "none",
          duration: 1000,
          mask: true,
          position: "bottom",
        });
      }
      //实际应用中，此处应该提交长连接，模板仅做本地处理。
      this.msgFlag = false;

      var nowDate = new Date();
      const year = nowDate.getFullYear(); // 年
      const month = nowDate.getMonth() + 1; // 月
      var date = nowDate.getDate(); // 日
      if (date < 10) {
        date = "0" + date;
      }
      let msg = {
        type: "user",
        msg: {
          id: this.generateRandomID(),
          time: this.getCurrentTime(),
          type: "text",
          userinfo: { uid: 0, username: this.userInfo.userNike, face: "/static/img/a.png" },
          content: content,
        },
      };
      // 发送消息
      this.screenMsg(msg);

      this.getChatMsg(content);
    },
    padZero(num) {
            // 如果数字小于 10，在前面补 0
            return num.toString().padStart(2, '0');
    },
    getChatMsg(msg) {
      var nowDate = new Date();
      const year = nowDate.getFullYear(); // 年
      const month = nowDate.getMonth() + 1; // 月
      const date = nowDate.getDate(); // 日
      let chatId = new Date().getTime().toString();
      let Viewid = this.msgList[this.msgList.length-2].msg.id; //记住第一个信息ID
      // console.log(this.msgList,Viewid)
      // return
      var postData = {
        message: msg,
        chatType: "1",
        sourceId:Viewid||''
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
          this.msgFlag = true;
          console.log(res)
          let msg = {
            type: "user",
            msg: {
              id: this.generateRandomID(),
              time: this.getCurrentTime(),
              type: "text",
              userinfo: { uid: 1, username: "管家", face: "/static/img/q.png" },
              content: res.data.data,
            },
          };
          // 发送消息
          this.screenMsg(msg);
        },
        fail: (res) => {
          console.log("上传音频失败" + JSON.stringify(res));
        },
      });
    },
    getCurrentTime() {
            var nowDate = new Date();
            const year = nowDate.getFullYear(); // 年
            const month = nowDate.getMonth() + 1; // 月
            const date = nowDate.getDate(); // 日
        
            // 创建一个 Date 对象表示当前时间
            const now = new Date();
            // 获取小时
            let hours = now.getHours();
            // 获取分钟
            let minutes = now.getMinutes();
            // 获取秒
            let seconds = now.getSeconds();

            // 调用补零函数处理小时、分钟和秒
            hours = this.padZero(hours);
            minutes = this.padZero(minutes);
            seconds = this.padZero(seconds);

            // 将处理后的时分秒组合成字符串
           return `${year}-${month}-${date}   ${hours}:${minutes}:${seconds}`;
        },
    //语音播报
    initSpeak() {},
    // 添加文字消息到列表
    addTextMsg(msg) {
      this.msgList.push(msg);
    },
    // 添加语音消息到列表
    addVoiceMsg(msg) {
      this.msgList.push(msg);
    },
    // 添加系统文字消息到列表
    addSystemTextMsg(msg) {
      this.msgList.push(msg);
    },
    // 播放语音
    playVoice(msg) {
      this.playMsgid = msg.id;
      this.AUDIO.src = msg.content.url;
      this.$nextTick(function () {
        this.AUDIO.play();
      });
    },
    // 录音开始
    voiceBegin(e) {
      if (e.touches.length > 1) {
        return;
      }
      this.initPoint.Y = e.touches[0].clientY;
      this.initPoint.identifier = e.touches[0].identifier;
      // this.test()
      this.RECORDER.start({ format: "amr" }); //录音开始,
    },
    //录音开始UI效果
    recordBegin(e) {
      console.log('12312')
      this.recording = true;
      this.voiceTis = "松开 结束";
      this.recordLength = 0;
      this.recordTimer = setInterval(() => {
        this.recordLength++;
      }, 1000);
    },
    // 录音被打断
    voiceCancel() {
      this.recording = false;
      this.voiceTis = "按住 说话";
      this.recordTis = "手指上滑 取消发送";
      this.willStop = true; //不发送录音
      this.RECORDER.stop(); //录音结束
    },
    // 录音中(判断是否触发上滑取消发送)
    voiceIng(e) {
      if (!this.recording) {
        return;
      }
      let touche = e.touches[0];
      //上滑一个导航栏的高度触发上滑取消发送
      if (this.initPoint.Y - touche.clientY >= uni.upx2px(100)) {
        this.willStop = true;
        this.recordTis = "松开手指 取消发送";
      } else {
        this.willStop = false;
        this.recordTis = "手指上滑 取消发送";
      }
    },
    // 结束录音
    voiceEnd(e) {
      if (!this.recording) {
        return;
      }
      this.recording = false;
      this.voiceTis = "按住 说话";
      this.recordTis = "手指上滑 取消发送";
      this.RECORDER.stop(); //录音结束
    },
    //录音结束(回调文件)
    recordEnd(e) {
      this.Audio2dataURL(e.tempFilePath);
      clearInterval(this.recordTimer);
      this.willStop = false;
    },
    // 切换语音/文字输入
    switchVoice() {
      this.hideDrawer();
      this.isVoice = this.isVoice ? false : true;
    },
    discard() {
      return;
    },
    uploadvoicefile() {
      var postData = {
        format: "amr", //语音文件的格式，pcm/wav/amr/m4a。不区分大小写。推荐pcm文件
        rate: 8000, //	采样率，16000，固定值 此处文档参数16000，达不到这种高保真音频，故 使用8000
        dev_pid: 1537, //普通话
        channel: 1, //声道数，仅支持单声道，请填写固定值 1
        cuid: "cuid", //用户唯一标识，用来区分用户，计算UV值。建议填写能区分用户的机器 MAC 地址或 IMEI 码，长度为60字符以内。
        token: this.baiduToken,
        speech: this.adioFileData, //本地语音文件的的二进制语音数据 ，需要进行base64 编码。与len参数连一起使用。
        len: this.adioSize, //本地语音文件的的字节数，单位字节 init
        punctuation: false,
      };
      //调用语音识别接口
      uni.request({
        url: "http://vop.baidu.com/server_api ", //仅为示例，并非真实接口地址。
        data: postData,
        header: {
          "content-type": "application/json",
        },
        method: "POST",
        success: (res) => {
          let msg2 = res.data.result.toString();
          if (msg2) {
            this.sendMsg(msg2, "text");
          } else {
            uni.showToast({
              title: "暂无识别内容",
              icon: "none",
              duration: 300,
              mask: true,
              position: "bottom",
            });
          }
          // this.text = 'request success';
        },
        fail: (res) => {
          console.log("上传音频失败" + JSON.stringify(res));
        },
      });
    },
    Audio2dataURL(path) {
      var _this = this;
      console.log(path,'path')
      plus.io.resolveLocalFileSystemURL(path, function (entry) {
        // console.log(JSON.stringify(entry),'path1')
        entry.file(
          function (file) {
            // console.log(file,'path2')
            var reader = new plus.io.FileReader();
            _this.adioSize = file.size;
            reader.onloadend = function (e) {
              // console.log(e,'sdf')
              _this.adioFileData = e.target.result.split(",")[1];
              // console.log(_this.adioFileData);
            };
            reader.readAsDataURL(file);
            _this.getAccessToken();
          },
          function (e) {
            alert(e.message);
            // mui.toast("读写出现异常: " + e.message);
          }
        );
      });
    },
  },
};
</script>
<style lang="scss" scoped>
/* 动画 */
.prompt {
		width: 100%;
		height: 160rpx;
		position: fixed;
		bottom: 50vh;
	}
 
	.prompt text {
		position: absolute;
		bottom: 12px;
		color: white;
		left: calc(41%);
		animation: puls 1.5s infinite ease-in-out;
	}
 
	.dots-container {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 80px;
		width: 45%;
		position: absolute;
		bottom: 0px;
		left: calc(27.5%);
		background-color: rgba(0, 0, 0, 0.5);
		border-radius: 40rpx;
    padding-bottom:40rpx;
    box-sizing: border-box;
	}
 
	.dot {
		height: 28rpx;
		width: 28rpx;
		margin-right: 20rpx;
		border-radius: 20rpx;
		background-image: linear-gradient(#5396FF, #AEDAFF);
		animation: pulse 1.5s infinite ease-in-out;
	}
 
	.dot:last-child {
		margin-right: 0;
	}
 
	.dot:nth-child(1) {
		animation-delay: -0.3s;
	}
 
	.dot:nth-child(2) {
		animation-delay: -0.1s;
	}
 
	.dot:nth-child(3) {
		animation-delay: 0.1s;
	}
 
	@keyframes pulse {
		0% {
			transform: scale(0.8);
			background-color: #66A3FF;
			/* 更改为与.dot背景色相近的颜色 */
			box-shadow: 0 0 0 0 rgba(102, 163, 255, 0.7);
			/* 使用相同的颜色 */
		}
 
		50% {
			transform: scale(1.2);
			background-color: #ADD8FF;
			/* 稍浅的颜色，增加对比度 */
			box-shadow: 0 0 0 10px rgba(174, 218, 255, 0);
			/* 使用.dot的结束颜色，但透明度为0 */
		}
 
		100% {
			transform: scale(0.8);
			background-color: #66A3FF;
			/* 与0%时的颜色相同 */
			box-shadow: 0 0 0 0 rgba(102, 163, 255, 0.7);
			/* 与0%时的box-shadow相同 */
		}
	}
 
	@keyframes puls {
		0% {
			transform: translateY(0px)
		}
 
		50% {
			transform: translateY(-4px)
		}
 
		100% {
			transform: translateY(0px)
		}
	}

@import "@/static/css/style.scss";
</style>
