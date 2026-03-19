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

    <!-- 工具栏 -->
    <view class="tools-bar" :style="{bottom: inputBoxHeight + 'px'}">
      <!-- 主工具栏按钮 -->
      <view v-if="!showCBTITools && activeToolBtn !== 'PSQI'" class="tools-container main-tools-container">
        <view 
          class="tool-btn" 
          :class="{active: activeToolBtn === 'ordinary'}"
          @tap="selectToolBtn('ordinary')"
        >普通对话</view>
        <view 
          class="tool-btn" 
          :class="{active: activeToolBtn === 'PSQI'}"
          @tap="selectToolBtn('PSQI')"
        >PSQI</view>
        <view 
          class="tool-btn" 
          :class="{active: activeToolBtn === 'CBTI'}"
          @tap="selectToolBtn('CBTI')"
        >CBTI</view>
      </view>
      
      <!-- CBTI工具栏按钮 -->
      <view v-if="showCBTITools" class="tools-container">
        <view 
          class="tool-btn" 
          :class="{active: activeToolBtn === 'negative'}"
          @tap="selectToolBtn('negative')"
        >负性思维记录表</view>
        <view 
          class="tool-btn" 
          :class="{active: activeToolBtn === 'cognitive'}"
          @tap="selectToolBtn('cognitive')"
        >获取认知重构建议</view>
        <view 
          class="tool-btn" 
          :class="{active: activeToolBtn === 'exit'}"
          @tap="exitCBTITools()"
        >退出</view>
      </view>
      
      <!-- PSQI工具栏按钮 - 显示开始问卷、重置和退出 -->
      <view v-if="activeToolBtn === 'PSQI' && !showPSQIOptions && !psqiInProgress" class="tools-container main-tools-container">
        <view 
          class="tool-btn"
          :class="{active: activePSQIOption === 'start'}"
          @tap="startPSQIQuestionnaire()"
        >开始问卷</view>
        <view 
          class="tool-btn"
          :class="{active: activePSQIOption === 'reset'}"
          @tap="resetPSQIQuestionnaire()"
        >重置问卷</view>
        <view 
          class="tool-btn"
          :class="{active: activePSQIOption === 'exit'}"
          @tap="exitPSQIQuestionnaire()"
        >退出</view>
      </view>
      
      <!-- PSQI工具栏按钮 - 问卷进行中仅显示重置和退出 -->
      <view v-if="activeToolBtn === 'PSQI' && !showPSQIOptions && psqiInProgress" class="tools-container main-tools-container">
        <view 
          class="tool-btn"
          :class="{active: activePSQIOption === 'reset'}"
          @tap="resetPSQIQuestionnaire()"
        >重置问卷</view>
        <view 
          class="tool-btn"
          :class="{active: activePSQIOption === 'exit'}"
          @tap="exitPSQIQuestionnaire()"
        >退出</view>
        </view>
        
        <!-- PSQI问卷选项按钮 - 显示选项、重置和退出 -->
      <view v-if="showPSQIOptions && psqiCurrentQuestion && psqiCurrentQuestion.options" class="tools-container">
        <view 
          v-for="(option, index) in psqiCurrentQuestion.options" 
          :key="index"
          class="tool-btn"
          :class="{active: activePSQIOption === option}"
          @tap="selectPSQIOption(option)"
        >{{ option }}</view>
        <view 
          class="tool-btn"
          :class="{active: activePSQIOption === 'reset'}"
          @tap="resetPSQIQuestionnaire()"
        >重置问卷</view>
        <view 
          class="tool-btn"
          :class="{active: activePSQIOption === 'exit'}"
          @tap="exitPSQIQuestionnaire()"
        >退出</view>
      </view>
    </view>
    
    <!-- 底部输入栏 -->
    <view
      class="input-box"
      :class="popupLayerClass"
      @touchmove.stop.prevent="discard"
    >
      <!-- H5下不能录音，输入栏布局改动一下  暂时不开发此功能-->
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
              placeholder="请输入..."
              placeholder-style="color: #999;"
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
        <view class="btn"></view>
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
      transcript: '',
      // 工具栏相关数据
      activeToolBtn: '',
      showCBTITools: false,
      inputBoxHeight: 120, // 输入框底部距离，单位upx
      
      // PSQI问卷相关数据
      psqiUserId: null, // PSQI问卷用户ID
      psqiInProgress: false, // 是否正在进行PSQI问卷
      psqiCurrentQuestion: null, // 当前PSQI问题
      showPSQIOptions: false, // 是否显示PSQI选项按钮
      activePSQIOption: '', // 当前激活的PSQI选项
      psqiCompletedQuestions: [] // 已完成的PSQI问题ID列表，用于确保按顺序完成
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
    this.activeToolBtn = 'ordinary'; // 默认设置普通对话按钮为激活状态
    this.addWelcomeMessage(); // 添加欢迎消息
  },
  onShow() {
    if(uni.getStorageSync('userInfo')){
      this.userInfo = uni.getStorageSync('userInfo')
    }
    this.scrollTop = 9999999;
    // 如果没有激活的按钮，默认设置普通对话按钮为激活状态
    if (!this.activeToolBtn) {
      this.activeToolBtn = 'ordinary';
    }
    this.addWelcomeMessage(); // 添加欢迎消息
  },
  methods: {
    // 添加欢迎消息方法
    addWelcomeMessage() {
      // 创建欢迎消息
      const welcomeContent = "您好，我是您的睡眠管家，有什么可以帮助您的吗？\n\n您可以使用以下功能：\n1. 普通对话按钮：切换到普通对话模式，可以直接提问任何问题\n2. PSQI按钮：开始匹兹堡睡眠质量问卷评估\n3. CBTI按钮：访问认知行为疗法工具，包括负性思维记录表和认知重构建议";
      
      let msg = {
        type: "user",
        msg: {
          id: this.generateRandomID(),
          time: this.getCurrentTime(),
          type: "text",
          userinfo: { uid: 1, username: "管家", face: "/static/img/q.png" },
          content: welcomeContent,
        },
      };
      
      // 检查消息列表是否为空，或者最后一条消息不是欢迎消息
      if (this.msgList.length === 0 || 
          (this.msgList.length > 0 && 
           this.msgList[this.msgList.length - 1].msg.content !== welcomeContent)) {
        // 发送欢迎消息
        this.screenMsg(msg);
      }
    },
    
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
      let face
      if(this.userInfo.avatarUrl){
         face = this.userInfo.avatarUrl
      }else{
        face = '/static/img/a.png'
      }
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
              userinfo: { uid: 0, username: this.userInfo.userNike, face:face },
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
      let face
      if(this.userInfo.avatarUrl){
         face = this.userInfo.avatarUrl
      }else{
        face = '/static/img/a.png'
      }
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
              userinfo: { uid: 0, username: this.userInfo.userNike, face: face },
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
      this.textMsg = ''
      //实际应用中，此处应该提交长连接，模板仅做本地处理。
      this.msgFlag = false;
      let face
      if(this.userInfo.avatarUrl){
         face = this.userInfo.avatarUrl
      }else{
        face = '/static/img/a.png'
      }
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
          userinfo: { uid: 0, username: this.userInfo.userNike, face:face},
          content: content,
        },
      };
      // 发送消息
      this.screenMsg(msg);
      
      // 检查是否在PSQI问卷进行中
      if (this.psqiInProgress && this.psqiUserId) {
        // 将用户消息作为问卷回答处理
        this.answerPSQIQuestion(content);
        this.msgFlag = true; // 重置消息标志，允许用户继续发送消息
        return; // 不调用AI接口
      } else if (this.activeToolBtn === 'PSQI' && !this.psqiInProgress) {
        // 如果PSQI按钮被激活但问卷未进行中，开始问卷
        this.startPSQIQuestionnaire();
        this.msgFlag = true; // 重置消息标志
        return; // 不调用AI接口
      }

      // 正常AI对话流程
      this.getChatMsg(content);
    },
    padZero(num) {
            // 如果数字小于 10，在前面补 0
            return num.toString().padStart(2, '0');
    },
     // 解析Markdown表格为JSON数据
     parseMarkdownTable(markdownText) {
      // 分割表格行
      const lines = markdownText.split('\n').filter(line => line.trim() !== '')

      // 找到表头行和分隔行
      let headerIndex = -1
      let separatorIndex = -1

      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('|')) {
          if (headerIndex === -1) {
            headerIndex = i
          } else if (lines[i].replace(/[^|\-]/g, '') === lines[i] && separatorIndex === -1) {
            separatorIndex = i
          }
        }
      }

      if (headerIndex === -1 || separatorIndex === -1) {
        return []
      }

      // 解析表头
      const headers = lines[headerIndex].split('|')
        .map(h => h.trim())
        .filter(h => h !== '')

      // 解析数据行
      const tableData = []
      for (let i = separatorIndex + 1; i < lines.length; i++) {
        if (lines[i].includes('|')) {
          const rowData = lines[i].split('|')
            .map(cell => cell.trim())
            .filter(cell => cell !== '')

          if (rowData.length >= 5) {
            tableData.push({
              event: rowData[0],
              thought: rowData[1],
              emotion: rowData[2],
              distortion: rowData[3],
              alternative: rowData[4]
            })
          }
        }
      }

      return tableData
    },
    
    // 检查文本是否包含Markdown表格
    containsMarkdownTable(text) {
      if (!text) return false;
      
      const lines = text.split('\n');
      let hasTableHeader = false;
      let hasTableSeparator = false;
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('|') && line.endsWith('|')) {
          if (!hasTableHeader) {
            hasTableHeader = true;
          } else if (!hasTableSeparator && line.replace(/[^|\-]/g, '') === line) {
            hasTableSeparator = true;
            return true;
          }
        }
      }
      
      return false;
    },
    
    // 将Markdown表格转换为HTML表格
    markdownTableToHtml(tableData) {
      if (!tableData || tableData.length === 0) return '';
      
      // 添加带边框和样式的表格
      let html = '<div class="markdown-table"><table style="border-collapse: collapse; width: 100%; border: 1px solid black;">';
      
      // 定义统一的单元格样式
      const cellStyle = 'border: 1px solid black; padding: 5px; font-size: 1em;';
      const headerStyle = 'border: 1px solid black; padding: 5px; font-size: 1em; font-weight: bold; background-color: #f2f2f2;';
      
      // 创建行式表头的表格
      html += '<tbody>';
      
      // 添加事件行
      html += '<tr>';
      html += `<th style="${headerStyle}">事件</th>`;
      tableData.forEach(row => {
        html += `<td style="${cellStyle}">${row.event}</td>`;
      });
      html += '</tr>';
      
      // 添加自动思维行
      html += '<tr>';
      html += `<th style="${headerStyle}">自动思维</th>`;
      tableData.forEach(row => {
        html += `<td style="${cellStyle}">${row.thought}</td>`;
      });
      html += '</tr>';
      
      // 添加情绪反应行
      html += '<tr>';
      html += `<th style="${headerStyle}">情绪反应</th>`;
      tableData.forEach(row => {
        html += `<td style="${cellStyle}">${row.emotion}</td>`;
      });
      html += '</tr>';
      
      // 添加思维扭曲类型行
      html += '<tr>';
      html += `<th style="${headerStyle}">思维扭曲类型</th>`;
      tableData.forEach(row => {
        html += `<td style="${cellStyle}">${row.distortion}</td>`;
      });
      html += '</tr>';
      
      // 添加替代性思维行
      html += '<tr>';
      html += `<th style="${headerStyle}">替代性思维</th>`;
      tableData.forEach(row => {
        html += `<td style="${cellStyle}">${row.alternative}</td>`;
      });
      html += '</tr>';
      
      html += '</tbody>';
      html += '</table></div>';
      return html;
    },
    
    getChatMsg(msg) {
      // 这里你可以换成真实用户ID，或者根据需要动态生成
      const user_id = "test_user_001";

      let postData = {
        user_id: user_id,
        message: msg
      };
      
      // 根据按钮状态动态切换API URL
      let apiUrl = "https://isleepagent.com:444/cbti/ordinary_chat"; // 默认使用普通对话接口
      
      // 如果CBTI工具栏显示或者有活跃的CBTI工具按钮，使用CBTI对话接口
      if (this.showCBTITools || this.activeToolBtn === 'negative' || this.activeToolBtn === 'cognitive' || this.activeToolBtn === 'CBTI') {
        apiUrl = "https://isleepagent.com:444/cbti/cbti_chat";
      }
      // 如果PSQI按钮被激活，使用PSQI接口
      else if (this.activeToolBtn === 'PSQI') {
        apiUrl = "https://isleepagent.com:444/psqi/chat";
      }
      // 如果是普通对话按钮被激活，确保使用普通对话接口
      else if (this.activeToolBtn === 'ordinary' || this.activeToolBtn === '') {
        apiUrl = "https://isleepagent.com:444/cbti/ordinary_chat";
      }
       
      uni.request({
        url: apiUrl,
        data: JSON.stringify(postData),
        header: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        method: "POST",
        success: (res) => {
          this.msgFlag = true;
          console.log(res);
         // 新接口的响应字段为 response
          const reply = res.data?.response || "无响应内容";
          
          // 检查回复是否包含Markdown表格
          if (this.containsMarkdownTable(reply)) {
            // 解析表格数据
            const tableData = this.parseMarkdownTable(reply);
            
            if (tableData.length > 0) {
              // 创建包含表格的消息
              const tableHtml = this.markdownTableToHtml(tableData);
              const messageContent = '<div class="table-message"><h3 style="color:#4dabf7;margin-bottom:10px;text-align:center;">思维记录表</h3>' + tableHtml + '</div>';
              
          
          let msg = {
            type: "user",
            msg: {
              id: this.generateRandomID(),
              time: this.getCurrentTime(),
              type: "text",
              userinfo: { uid: 1, username: "管家", face: "/static/img/q.png" },
              content: messageContent,
              isTable: true
            }
          };
          this.screenMsg(msg);
          return;
            }
          }
          
          // 普通文本消息
          let msg = {
            type: "user",
            msg: {
              id: this.generateRandomID(),
              time: this.getCurrentTime(),
              type: "text",
              userinfo: { uid: 1, username: "管家", face: "/static/img/q.png" },
              content: reply,
              isTable: false
            }
          };
          this.screenMsg(msg);
        },
        fail: (res) => {
          console.log("AI对话请求失败", res);
          uni.showToast({
            title: "AI对话请求失败: " + (res?.errMsg || "请稍后再试"),
            icon: 'none',
            duration: 2000
          });
          this.msgFlag = true;
        }
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
          console.log("AI对话请求失败" + JSON.stringify(res));
          this.msgFlag = true; // 请求失败时也需要重置标志，否则用户将无法发送新消息
          uni.showToast({
            title: "AI对话请求失败，请稍后再试",
            icon: 'none',
            duration: 2000
          });
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
    
    // 工具栏相关方法
    // 选择工具按钮
    selectToolBtn(btnType) {
      this.activeToolBtn = btnType;
      
      // 如果选择了CBTI按钮，显示CBTI工具栏
      if (btnType === 'CBTI') {
        this.showCBTITools = true;
        this.activeToolBtn = 'CBTI'; // 保持CBTI选中状态，以便API URL切换逻辑能正确工作
      } 
      // 如果选择了PSQI按钮，显示PSQI工具栏
      else if (btnType === 'PSQI') {
        // 设置PSQI为活跃按钮
        this.activeToolBtn = 'PSQI';
        // 确保PSQI不会使用CBTI的API
        this.showCBTITools = false;
        // 显示PSQI工具栏（不显示选项按钮）
        this.showPSQIOptions = false;
        // 添加提示消息，告知用户已切换到PSQI模式
        let msg = {
          type: "user",
          msg: {
            id: this.generateRandomID(),
            time: this.getCurrentTime(),
            type: "text",
            userinfo: { uid: 1, username: "管家", face: "/static/img/q.png" },
            content: "已切换到PSQI模式，您可以开始匹兹堡睡眠质量问卷评估。",
          },
        };
        this.screenMsg(msg);
      } else {
        // 根据不同的按钮类型执行不同的操作
        switch (btnType) {
          case 'ordinary':
            // 切换到普通对话模式
            this.showCBTITools = false;
            this.showPSQIOptions = false;
            // 添加提示消息，告知用户已切换到普通对话模式
            let msg = {
              type: "user",
              msg: {
                id: this.generateRandomID(),
                time: this.getCurrentTime(),
                type: "text",
                userinfo: { uid: 1, username: "管家", face: "/static/img/q.png" },
                content: "已切换到普通对话模式，您可以直接提问任何问题。",
              },
            };
            this.screenMsg(msg);
            break;
          case 'negative':
            // 发送负性思维记录表相关消息
            this.sendToolMessage('record');
            break;
          case 'cognitive':
            // 发送认知重构建议相关消息
            this.sendToolMessage('restructure');
            break;
        }
      }
    },
    
    // 退出CBTI工具栏
    exitCBTITools() {
      this.showCBTITools = false;
      this.activeToolBtn = 'ordinary'; // 设置为普通对话模式
      
      // 添加提示消息，告知用户已切换回普通对话模式
      let msg = {
        type: "user",
        msg: {
          id: this.generateRandomID(),
          time: this.getCurrentTime(),
          type: "text",
          userinfo: { uid: 1, username: "管家", face: "/static/img/q.png" },
          content: "已退出CBTI工具，切换回普通对话模式。",
        },
      };
      this.screenMsg(msg);
    },
    
    // 发送工具相关消息
    sendToolMessage(toolType) {
      // 设置当前活跃的工具按钮
      this.activeToolBtn = toolType;
      
      // 构建消息内容
      const content = `${toolType}`;
      // 发送消息
      this.sendMsg(content);
    },
    
    // PSQI问卷相关方法
    // 开始PSQI问卷
    startPSQIQuestionnaire() {
      // 设置开始按钮为激活状态
      this.activePSQIOption = 'start';
      
      // 获取用户ID，如果没有则使用默认值
      const userId = this.userInfo.userId || 'default_user';
      
      // 重置PSQI状态
      this.resetPSQIState();
      
      // 设置问卷进行中状态
      this.psqiInProgress = true;
      
      // 确保PSQI按钮被激活
      this.activeToolBtn = 'PSQI';
      
      // 发送开始问卷的系统消息
      let startMsg = {
        type: "user",
        msg: {
          id: this.generateRandomID(),
          time: this.getCurrentTime(),
          type: "text",
          userinfo: { uid: 1, username: "管家", face: "/static/img/q.png" },
          content: "开始匹兹堡睡眠质量问卷(PSQI)评估，请回答以下问题：",
        },
      };
      this.screenMsg(startMsg);
      
      // 调用开始问卷接口
      uni.request({
        url: "https://isleepagent.com:444/psqi/start_questionnaire",
        method: "POST",
        data: { user_id: userId },
        header: { "Content-Type": "application/json" },
        success: (res) => {
          if (res.data.status === "success") {
            // 保存用户ID和当前问题
            this.psqiUserId = res.data.user_id;
            this.psqiCurrentQuestion = res.data.question;
            
            // 初始化已完成问题列表
            this.psqiCompletedQuestions = [];
            
            // 检查是否是第5-18个问题，如果是则显示选项按钮
            if (this.psqiCurrentQuestion && this.psqiCurrentQuestion.id >= 5 && this.psqiCurrentQuestion.id <= 18) {
              this.showPSQIOptions = true;
            } else {
              this.showPSQIOptions = false;
            }
            
            // 显示第一个问题
            this.showPSQIQuestion(res.data.question);
          } else {
            // 显示错误消息
            this.showErrorMessage("问卷启动失败，请稍后再试");
            this.resetPSQIState(); // 重置问卷状态
          }
        },
        fail: (err) => {
          console.error("问卷请求失败:", err);
          this.showErrorMessage("问卷请求失败，请稍后再试");
          this.resetPSQIState(); // 重置问卷状态
        }
      });
    },
    
    // 显示PSQI问题
    showPSQIQuestion(question) {
      if (!question) return;
      
      // 构建问题消息
      let questionText = question.question;
      
      // 如果有选项，添加到问题中
      if (question.type === "choice" && question.options && question.options.length > 0) {
        questionText += "\n选项: " + question.options.join("、");
      }
      
      let questionMsg = {
        type: "user",
        msg: {
          id: this.generateRandomID(),
          time: this.getCurrentTime(),
          type: "text",
          userinfo: { uid: 1, username: "管家", face: "/static/img/q.png" },
          content: questionText,
        },
      };
      
      this.screenMsg(questionMsg);
    },
    
    // 回答PSQI问题
    answerPSQIQuestion(answer) {
      if (!this.psqiUserId || !this.psqiInProgress) return;
      
      // 检查当前问题是否存在
      if (!this.psqiCurrentQuestion) {
        this.showErrorMessage("当前没有活跃的问题，请重新开始问卷");
        return;
      }
      
      // 获取当前问题ID
      const currentQuestionId = this.psqiCurrentQuestion.id;
      
      // 检查问题是否按顺序回答
      if (currentQuestionId > 1) {
        // 检查前一个问题是否已完成
        const previousQuestionId = currentQuestionId - 1;
        if (!this.psqiCompletedQuestions.includes(previousQuestionId)) {
          this.showErrorMessage(`请先完成问题 ${previousQuestionId}`); 
          return;
        }
      }
      
      // 调用回答问题接口
      uni.request({
        url: "https://isleepagent.com:444/psqi/answer_question",
        method: "POST",
        data: { 
          user_id: this.psqiUserId,
          answer: answer
        },
        header: { "Content-Type": "application/json" },
        success: (res) => {
          if (res.data.status === "success") {
            // 将当前问题ID添加到已完成问题列表
            if (!this.psqiCompletedQuestions.includes(currentQuestionId)) {
              this.psqiCompletedQuestions.push(currentQuestionId);
            }
            
            // 更新当前问题
            this.psqiCurrentQuestion = res.data.question;
            
            // 重置选项激活状态
            this.activePSQIOption = '';
            
            // 检查是否是第5-18个问题，如果是则显示选项按钮
            if (this.psqiCurrentQuestion && this.psqiCurrentQuestion.id >= 5 && this.psqiCurrentQuestion.id <= 18) {
              this.showPSQIOptions = true;
            } else {
              this.showPSQIOptions = false;
            }
            
            // 显示下一个问题
            this.showPSQIQuestion(res.data.question);
          } else if (res.data.status === "completed") {
            // 问卷完成，显示分析结果
            this.showPSQIAnalysis(res.data.analysis);
            // 重置问卷状态
            this.resetPSQIState();
          } else {
            // 显示错误消息
            this.showErrorMessage("回答处理失败，请稍后再试");
            // 重置问卷状态
            this.resetPSQIState();
          }
        },
        fail: (err) => {
          console.error("回答请求失败:", err);
          this.showErrorMessage("回答请求失败，请稍后再试");
          // 重置问卷状态
          this.resetPSQIState();
        }
      });
    },
    
    // 选择PSQI问卷选项
    selectPSQIOption(option) {
      // 设置当前激活的选项
      this.activePSQIOption = option;
      
      // 将选项作为回答发送
      this.answerPSQIQuestion(option);
    },
    
    // 退出PSQI问卷
    exitPSQIQuestionnaire() {
      // 设置退出按钮为激活状态
      this.activePSQIOption = 'exit';
      
      // 发送退出消息
      let exitMsg = {
        type: "user",
        msg: {
          id: this.generateRandomID(),
          time: this.getCurrentTime(),
          type: "text",
          userinfo: { uid: 1, username: "管家", face: "/static/img/q.png" },
          content: "已退出PSQI问卷，切换到普通对话模式。",
        },
      };
      this.screenMsg(exitMsg);
      
      // 短暂延迟以便用户看到按钮激活状态
      setTimeout(() => {
        // 重置PSQI状态
        this.resetPSQIState();
        
        // 切换到普通对话模式
        this.activeToolBtn = 'ordinary';
        this.showPSQIOptions = false;
        
        // 添加提示消息，告知用户已切换回普通对话模式
        let msg = {
          type: "user",
          msg: {
            id: this.generateRandomID(),
            time: this.getCurrentTime(),
            type: "text",
            userinfo: { uid: 1, username: "管家", face: "/static/img/q.png" },
            content: "已切换到普通对话模式，您可以直接提问任何问题。",
          },
        };
        this.screenMsg(msg);
      }, 300);
    },
    
    // 重置PSQI问卷
    resetPSQIQuestionnaire() {
      // 设置重置按钮为激活状态
      this.activePSQIOption = 'reset';
      
      // 获取用户ID，如果没有则使用默认值
      const userId = this.userInfo.userId || 'default_user';
      
      // 调用重置问卷接口
      uni.request({
        url: "https://isleepagent.com:444/psqi/reset_questionnaire",
        method: "POST",
        data: { user_id: userId },
        header: { "Content-Type": "application/json" },
        success: (res) => {
          if (res.data.status === "success") {
            // 重置PSQI状态
            this.resetPSQIState();
            
            // 发送重置成功消息
            let resetMsg = {
              type: "user",
              msg: {
                id: this.generateRandomID(),
                time: this.getCurrentTime(),
                type: "text",
                userinfo: { uid: 1, username: "管家", face: "/static/img/q.png" },
                content: "PSQI问卷已重置，您可以重新开始问卷。",
              },
            };
            this.screenMsg(resetMsg);
            
            // 重新开始问卷
            this.startPSQIQuestionnaire();
          } else {
            // 显示错误消息
            this.showErrorMessage("问卷重置失败，请稍后再试");
            this.activePSQIOption = ''; // 重置按钮状态
          }
        },
        fail: (err) => {
          console.error("重置问卷请求失败:", err);
          this.showErrorMessage("重置问卷请求失败，请稍后再试");
          this.activePSQIOption = ''; // 重置按钮状态
        }
      });
    },
    
    // 重置PSQI状态
    resetPSQIState() {
      this.psqiInProgress = false;
      this.psqiUserId = null;
      this.psqiCurrentQuestion = null;
      this.showPSQIOptions = false;
      this.activePSQIOption = '';
      this.psqiCompletedQuestions = [];
    },
    
    // 显示PSQI分析结果
    showPSQIAnalysis(analysis) {
      if (!analysis) return;
      
      // 构建分析结果消息
      let analysisMsg = {
        type: "user",
        msg: {
          id: this.generateRandomID(),
          time: this.getCurrentTime(),
          type: "text",
          userinfo: { uid: 1, username: "管家", face: "/static/img/q.png" },
          content: "匹兹堡睡眠质量问卷(PSQI)评估结果:\n\n" + analysis,
        },
      };
      
      this.screenMsg(analysisMsg);
      
      // 重置PSQI状态
      this.resetPSQIState();
      
      // 发送完成消息
      let completeMsg = {
        type: "user",
        msg: {
          id: this.generateRandomID(),
          time: this.getCurrentTime(),
          type: "text",
          userinfo: { uid: 1, username: "管家", face: "/static/img/q.png" },
          content: "PSQI评估已完成，如果您有任何问题，请随时咨询。",
        },
      };
      
      setTimeout(() => {
        this.screenMsg(completeMsg);
      }, 1000); // 延迟1秒显示完成消息
    },
    
    // 显示错误消息
    showErrorMessage(message) {
      let errorMsg = {
        type: "user",
        msg: {
          id: this.generateRandomID(),
          time: this.getCurrentTime(),
          type: "text",
          userinfo: { uid: 1, username: "管家", face: "/static/img/q.png" },
          content: message,
        },
      };
      
      this.screenMsg(errorMsg);
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
@import "./tabbar-2-custom.scss";
</style>
