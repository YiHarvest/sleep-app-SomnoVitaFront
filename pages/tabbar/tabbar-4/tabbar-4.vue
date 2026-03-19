<template>
	<view class="content">
		<!-- 遮罩层 -->
		<view v-if="showEffTipText || showAHITipText" class="mask" @click="closeAllTips"></view>

		<!-- 睡眠效率提示弹窗 -->
		<view v-if="showEffTipText" class="center-tip-popup">
			<view class="tip-content">
				<view class="tip-icon">ℹ</view>
				<text>正常睡眠效率为85%</text>
			</view>
		</view>

		<!-- AHI提示弹窗 -->
		<view v-if="showAHITipText" class="center-tip-popup">
			<view class="tip-content">
				<view class="tip-icon">ℹ</view>
				<text>正常范围0-5次/小时</text>
			</view>
		</view>

		<view style="width:100%;height:80upx;display:flex;justify-content:center;align-items:center;margin-top:20rpx;">
			<view
				style="width:92%;height:100%;background: linear-gradient(120deg, #232b3b 60%, #1a2233 100%);margin-top:20upx;display: flex;position: relative;align-items: center;font-size:28rpx;padding:0 24rpx;box-sizing: border-box;border-radius:16rpx;border:2rpx solid #3a6affcc;box-shadow:0 0 16rpx #3a6aff44;"
				@click="changeSmd">
				<u-icon name="list" color="#3a6aff"></u-icon>
				<view style="margin-left:20rpx;color:#b6e0ff;">设备选择</view>
				<view style="position: absolute;right:40rpx;color:#b6e0ff;display: flex;align-items:center;">
					<view style="margin-right:20rpx">{{ current.deviceName ||current.deviceNo}}</view>
					<u-icon name="arrow-right" color="#3a6aff"></u-icon>
				</view>
			</view>
		</view>
		<view style="display:flex;padding:0 4%;margin-top:30rpx;align-items: center;">
			<view style="width:80%;">
				<uni-datetime-picker type="date" :clear-icon="false" v-model="single" @change="change" />
			</view>
			<view style="margin-left:30rpx;">
				<u-button type="primary" text="查询"
					style="width:130rpx;height:60rpx;background: linear-gradient(90deg, #3a6aff 60%, #00ffe7 100%);border:none;border-radius:12rpx;box-shadow:0 0 16rpx #3a6aff44;"
					@click="getAllList"></u-button>
			</view>
		</view>
		<view style="margin-top:40rpx;width:92%;height:600rpx;background: linear-gradient(120deg, #232b3b 60%, #1a2233 100%);margin-left:4%;border-radius:24rpx;border:2rpx solid #3a6affcc;box-shadow:0 0 32rpx #3a6aff44;">
			<view
				style="font-size:38rpx;color:#3a6aff;margin:0 40rpx;display:flex;align-items: center;padding-top:40rpx;">
				<view style="width:10rpx;height:34rpx;background:#3a6aff;border-radius:80rpx">
				</view>
				<view style="margin-left:14rpx;font-weight:700;text-shadow:0 0 16rpx #3a6affcc;">
					睡眠状态数据
				</view>
				<view style="margin-left:14rpx;" @click="dislogopen">
					<u-icon name="question-circle" size="34" color="#3a6aff"></u-icon>
				</view>
			</view>
			<echarts1 ref="echarts1"></echarts1>
		</view>
		<view class="cyber-panel-group" style="padding:0 4%;">
			<view class="cyber-panel">
				<view class="cyber-panel-icon"><u-icon name="clock" color="#00ffe7" size="36"></u-icon></view>
				<view class="cyber-panel-title">睡眠总时长</view>
				<view class="cyber-panel-value">
					{{formatDuration(sleepData.totalDurationOfSleep).hours}}<span class="cyber-panel-unit">小时</span>
					{{formatDuration(sleepData.totalDurationOfSleep).minutes}}<span class="cyber-panel-unit">分钟</span>
				</view>
					</view>
			<view class="cyber-panel">
				<view class="cyber-panel-icon"><u-icon name="hourglass" color="#3a6aff" size="36"></u-icon></view>
				<view class="cyber-panel-title">入睡潜伏期</view>
				<view class="cyber-panel-value">
					{{formatMinutes(sleepData.asleepTime).hours}}<span class="cyber-panel-unit">小时</span>
					{{formatMinutes(sleepData.asleepTime).minutes}}<span class="cyber-panel-unit">分钟</span>
				</view>
              </view>
			<view class="cyber-panel">
				<view class="cyber-panel-icon"><u-icon name="star" color="#ff00cc" size="36"></u-icon></view>
				<view class="cyber-panel-title">睡眠效率</view>
				<view class="cyber-panel-tip-btn" @click.stop="showEffTip">
					<text>!</text>
              </view>
				<view class="cyber-panel-value">
					{{sleepData.sleepEff||0}}<span class="cyber-panel-unit">%</span>
              </view>
              </view>
			<view class="cyber-panel">
				<view class="cyber-panel-icon"><u-icon name="heart" color="#3a6aff" size="36"></u-icon></view>
				<view class="cyber-panel-title">呼吸障碍AHI</view>
				<view class="cyber-panel-tip-btn" @click.stop="showAHITip">
					<text>!</text>
              </view>
				<view class="cyber-panel-value">
					{{sleepData.breathingDisorder||0}}<span class="cyber-panel-unit">次/小时</span>
              </view>
              </view>
              </view>
		<view class="cyber-card" style="margin-top:40rpx;margin-left:4%;margin-right:4%;">
			<view class="cyber-title">
				<view style="width:10rpx;height:34rpx;background:#3a6aff;border-radius:80rpx;display:inline-block;margin-right:14rpx;"></view>
						睡眠基础数据
					</view>
			<view class="cyber-divider"></view>
			<view style="width:100%;display:flex;justify-content:space-between;align-items:center;margin-bottom:24rpx;">
				<view class="cyber-label" style="flex:1;text-align:center;">上床时间</view>
				<view class="cyber-label" style="flex:1;text-align:center;">入睡时间</view>
				<view class="cyber-label" style="flex:1;text-align:center;">起床时间</view>
				</view>
			<view style="width:100%;display:flex;justify-content:space-between;align-items:center;margin-bottom:18rpx;">
				<view class="cyber-value" style="flex:1;text-align:center;">{{sleepData.bedTime?bedTimed(sleepData.bedTime):'00:00'}}</view>
				<view class="cyber-value" style="flex:1;text-align:center;">{{formatTimeDisplay(sleepData.asleepTime)}}</view>
				<view class="cyber-value" style="flex:1;text-align:center;">{{formatTimeDisplay(sleepData.upTime)}}</view>
						</view>
			<view style="width:100%;display:flex;justify-content:space-between;align-items:center;margin-bottom:24rpx;">
				<view class="cyber-label" style="flex:1;text-align:center;">在床时间</view>
				<view class="cyber-label" style="flex:1;text-align:center;">夜起次数</view>
				<view class="cyber-label" style="flex:1;text-align:center;">打鼾次数</view>
						</view>
			<view style="width:100%;display:flex;justify-content:space-between;align-items:center;margin-bottom:18rpx;">
				<view class="cyber-value" style="flex:1;text-align:center;">{{inBedHours}}<span style='font-size:24rpx;color:#00ffe7;'>小时</span>{{inBedMinutes}}<span style='font-size:24rpx;color:#00ffe7;'>分钟</span></view>
				<view class="cyber-value" style="flex:1;text-align:center;">{{sleepData.awakenCount||0}}<span style='font-size:24rpx;color:#00ffe7;'>次</span></view>
				<view class="cyber-value" style="flex:1;text-align:center;">{{sleepData.snoreCount||0}}<span style='font-size:24rpx;color:#00ffe7;'>次</span></view>
					</view>
			<view style="width:100%;display:flex;justify-content:space-between;align-items:center;margin-bottom:24rpx;">
				<view class="cyber-label" style="flex:1;text-align:center;">整晚平均呼吸</view>
				<view class="cyber-label" style="flex:1;text-align:center;">整晚平均心率</view>
				<view class="cyber-label" style="flex:1;text-align:center;">翻身/体动次数</view>
						</view>
			<view style="width:100%;display:flex;justify-content:space-between;align-items:center;">
				<view class="cyber-value" style="flex:1;text-align:center;">{{sleepData.avgBreath||0}}<span style='font-size:24rpx;color:#00ffe7;'>次/分</span></view>
				<view class="cyber-value" style="flex:1;text-align:center;">{{sleepData.avgHeart||0}}<span style='font-size:24rpx;color:#00ffe7;'>次/分</span></view>
				<view class="cyber-value" style="flex:1;text-align:center;">{{sleepData.turnOverCount||0}}<span style='font-size:24rpx;color:#00ffe7;'>次</span></view>
			</view>
		</view>
		<view class="cyber-card sleep-efficiency-card" style="margin-top:40rpx;margin-left:4%;margin-right:4%;">
			<view class="cyber-title sleep-efficiency-title">
				<view class="sleep-efficiency-bar"></view>
				睡眠效率
					</view>
			<view class="cyber-divider"></view>
				<echarts3 ref="echarts3"></echarts3>
			</view>
		<view class="cyber-card night-snore-card" style="margin-top:40rpx;margin-left:4%;margin-right:4%;">
			<view class="cyber-title night-snore-title">
				<view class="night-snore-bar"></view>
						夜间觉醒及打鼾数据
					</view>
			<view class="cyber-divider"></view>
				<echarts4 ref="echarts4"></echarts4>
		</view>
		<!-- <view style="margin-top:40rpx;width:92%;height:1200rpx;background: #FFFFFF;margin-left:4%;border-radius:14rpx;">
      <view style="margin-top:40rpx;width:92%;height:1200rpx;background: #FFFFFF;margin-left:4%;border-radius:14rpx;">
      <view style="font-size:38rpx;color:#2B3EB5;margin:0 40rpx;display:flex;align-items: center;padding-top:40rpx;">
        <view style="width:10rpx;height:34rpx;background:#2B3EB5 ;border-radius:80rpx">
          
        </view>
          <view style="margin-left:14rpx;">
            室内环境数据
            
          </view>
             
      </view>
      <echarts5 ref="echarts5"></echarts5>
      <echarts6 ref="echarts6"></echarts6>
    </view>
    </view> -->
		<u-popup :show="showPopup" @close="close" @open="open">
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
</template>

<script>
	import echarts1 from './echarts/echarts1.vue'
	import echarts3 from './echarts/echarts3.vue'
	import echarts4 from './echarts/echarts4.vue'
	import echarts5 from './echarts/echarts5.vue'
	import echarts6 from './echarts/echarts6.vue'
	export default {
		data() {
			return {
				userInfo: {},
				single: '',
				date: '',
				sleepData: {},
				deviceList: [],
				current: {
					deviceId: ''
				},
				showPopup: false,
				showAHITipText: false,
				showEffTipText: false,
				tipTimer: null,
				inBedHours: 0,
				inBedMinutes: 0
			};
		},
		components: {
			echarts1,
			echarts3,
			echarts4,
			echarts5,
			echarts6
		},
		onShow() {
			if (uni.getStorageSync('userInfo')) {
				this.userInfo = uni.getStorageSync('userInfo')
				this.getDevice()
			}
			// this.getData()
		},
		methods: {
			change(e) {
				this.date = e
			},
			close() {

			},
			open() {

			},
			change1(item) {
				this.showPopup = false
				this.current = item
				this.getData()
			},
			changeSmd() {
				if (this.deviceList.length == 0) {
					return uni.showToast({
						title: "暂无绑定设备",
						icon: 'none',
						duration: 3000,
						mask: true,
					});
				}
				this.showPopup = true
			},
			getDevice() {
				uni.request({
					url: "https://isleepagent.com:444/sleepapp/user/getUserDeviceList", //仅为示例，并非真实接口地址。
					data: {
						'deviceType': 1
					},
					header: {
						"content-type": "application/json",
						token: uni.getStorageSync('mytoken')
					},
					method: "GET",
					success: (res) => {
						this.deviceList = res.data.data
						console.log(res.data.data.length)
						if (res.data.data.length > 0) {
							this.current = this.deviceList[0]
						}

						this.getData()
					},
					fail: (res) => {},
				});
			},
			getData() {
				this.single = this.getDay(-1, '-') // 2022-8-30
				this.date = this.getDay(-1, '-') // 2022-8-30
				this.getAllList()
			},
			getAllList() {
				this.getList()
				// this.getSleepdata()
				this.getsnorecount()
				// this.getsleepeff()
				// this.getCo2andwd()
			},
			// async getSleepdata(){
			//   const res = await this.$myRequest({
			// 			url:`/sleepdetail/historydetails?date=${this.date}&deviceId=${this.current.deviceId}`,
			// 			method:'get'
			// 	});
			//   if(res.data.code==200){
			//     this.$refs.echarts1.getServerData(res.data.data)
			// 	}
			// },
			getDay(num, str) {
				var today = new Date();
				var nowTime = today.getTime();
				// 毫秒数
				var ms = 24 * 3600 * 1000 * num;
				today.setTime(parseInt(nowTime + ms));
				var year = today.getFullYear();
				var month = (today.getMonth() + 1).toString();
				if (month < 10) {
					month = '0' + month;
				}
				var day = today.getDate().toString();
				if (day < 10) {
					day = '0' + day;
				}
				return year + str + month + str + day;
			},
			// async getList() {
			//   try {
			// 	  // 打印请求参数
			// 	          console.log('请求参数:', {
			// 	            date: this.date,
			// 	            deviceId: this.current.deviceId
			// 	          });

			// 	const res = await this.$myRequest({
			// 		url: `/sleepbase/history?date=${this.date}&deviceId=${this.current.deviceId}`,
			// 		method: 'get'
			// 	});
			// 	if (res.data.code == 200) {
			// 		this.sleepData = res.data.data
			// 		this.$refs.echarts1.getServerData(res.data.data)
			// 	}
			// },
			async getList() {
				try {
					const res = await this.$myRequest({
						url: `/sleepbase/history?date=${this.date}&deviceId=${this.current.deviceId}`,
						method: 'get'
					});
					
					if (res.data.code == 200 && res.data.data) {
						console.log('API 完整响应:', res.data);
						this.sleepData = res.data.data;
						this.calculateInBedTime();
						this.$refs.echarts1.getServerData(res.data.data);
					}
				} catch (error) {
					console.error('获取数据失败:', error);
				}
			},
			async getsnorecount() {
				const res = await this.$myRequest({
					url: `/sleepbase/snorecount?date=${this.date}&deviceId=${this.current.deviceId}`,
					method: 'get'
				});
				if (res.data.code == 200) {
					this.$refs.echarts4.getServerData(res.data.data)
					this.$refs.echarts3.getServerData(res.data.data)
				}
			},
			// async getsleepeff(){
			//   const res = await this.$myRequest({
			// 			url:`/sleepbase/sleepeff?date=${this.date}&deviceId=${this.current.deviceId}`,
			// 			method:'get'
			// 	});
			//   if(res.data.code==200){
			//     this.$refs.echarts3.getServerData(res.data.data)
			// 	}
			// },
			async getCo2andwd() {
				const res = await this.$myRequest({
					url: `/environment/co2?date=${this.date}&deviceId2=${this.current.deviceId2}`,
					method: 'get'
				});
				if (res.data.code == 200) {
					this.$refs.echarts5.getServerData(res.data.data)
					this.$refs.echarts6.getServerData(res.data.data)
				}
			},
			// bedTimed(item) {
			// 	let time = item.split(' ')[1]
			// 	return time.substr(0, 5)
			// },
			bedTimed(time) {
				if (!time) return '00:00';
				try {
					if (time.includes(' ')) {
						const timePart = time.split(' ')[1];
						return timePart.substr(0, 5);
					}
					return time.substr(0, 5);
				} catch (error) {
					console.error('bedTimed格式化错误:', error);
					return '00:00';
				}
			},
			judge(row) {
				console.log(row)
				if (row) {
					let num = +row.substr(0, 2)
					if (num >= 8) {
						return true
					} else {
						return false
					}
				}
			},
			judgeAskeep(item) {
				if (item) {
					if (item >= 30) {
						return true
					} else {
						return false
					}


				}
			},
			asleepNum(item) {
				if (item) {
					let num = +item.substr(1)
					return num
				}
			},
			effjudge(item) {
				if (item <= 20) {
					return 1
				} else if (item <= 40) {
					return 2
				} else if (item <= 60) {
					return 3
				} else if (item <= 80) {
					return 4
				} else if (item <= 95) {
					return 4.5
				} else if (item < 100) {
					return 5
				}
			},
			dep(row) {
				if (row && row != 0) {
					let raiseOrdown = row.substr(0, 1)
					if (raiseOrdown == '+') {
						return true
					} else {
						return false
					}
				}
			},
			numset(row) {
				if (row && row != 0) {
					let num = row.substr(1)
					return num
				}
			},
			dislogopen() {
				uni.showToast({
					title: "睡眠数据在每日9:00后统一更新",
					icon: 'none',
					duration: 2400,
					mask: true,
				});
			},
			showEffTip() {
				this.showEffTipText = true;
				this.showAHITipText = false;
				// 设置2秒后自动关闭
				if (this.tipTimer) clearTimeout(this.tipTimer);
				this.tipTimer = setTimeout(() => {
					this.showEffTipText = false;
				}, 2000);
			},
			showAHITip() {
				this.showAHITipText = true;
				this.showEffTipText = false;
				// 设置2秒后自动关闭
				if (this.tipTimer) clearTimeout(this.tipTimer);
				this.tipTimer = setTimeout(() => {
					this.showAHITipText = false;
				}, 2000);
			},
			closeAllTips() {
				if (this.tipTimer) clearTimeout(this.tipTimer);
				this.showEffTipText = false;
				this.showAHITipText = false;
			},
			formatDuration(hours) {
				if (!hours) return {
					hours: 0,
					minutes: 0
				};
				if (typeof hours === 'string' && hours.includes(':')) {
					const [h, m] = hours.split(':').map(Number);
					hours = h + m / 60;
				}
				const h = Math.floor(hours);
				const m = Math.round((hours - h) * 60);
				return {
					hours: h,
					minutes: m
				};
			},
			formatMinutes(time) {
				if (!time) return {
					hours: 0,
					minutes: 0
				};
				
				try {
					let totalMinutes;
					if (typeof time === 'string') {
						if (time.includes(':')) {
							const [hours, minutes] = time.split(':').map(Number);
							totalMinutes = hours * 60 + minutes;
						} else {
							totalMinutes = parseInt(time);
						}
					} else if (typeof time === 'number') {
						totalMinutes = time;
					} else {
						return {
							hours: 0,
							minutes: 0
						};
					}

					return {
						hours: Math.floor(totalMinutes / 60),
						minutes: totalMinutes % 60
					};
				} catch (error) {
					console.error('时间格式化错误:', error, '原始值:', time);
					return {
						hours: 0,
						minutes: 0
					};
				}
			},
			formatBasicTime(time) {
				if (!time) return {
					hours: 0,
					minutes: 0
				};
				// const h = Math.floor(time);
				// const m = Math.round((time - h) * 60);
				// return {
				// 	hours: h,
				// 	minutes: m
				// };
				try {
					// 如果是字符串格式 "HH:mm:ss" 或 "HH:mm" 或 "YYYY-MM-DD HH:mm:ss"
					if (typeof time === 'string') {
						// 处理日期时间格式
						if (time.includes(' ')) {
							time = time.split(' ')[1];
						}
						// 处理时间格式
						const timeParts = time.split(':');
						return {
							hours: parseInt(timeParts[0]) || 0,
							minutes: parseInt(timeParts[1]) || 0
						};
					}

					// 如果是数字格式(可能是分钟数)
					if (typeof time === 'number') {
						// 如果是分钟数，转换为小时和分钟
						const hours = Math.floor(time / 60);
						const minutes = time % 60;
						return {
							hours,
							minutes
						};
					}

					return {
						hours: 0,
						minutes: 0
					};
				} catch (error) {
					console.error('时间格式化错误:', error, '原始值:', time);
					return {
						hours: 0,
						minutes: 0
					};
				}
			},
			formatTimeDisplay(time) {
				if (!time) return '00:00';
				try {
					if (typeof time === 'string') {
						if (time.includes(' ')) {
							time = time.split(' ')[1];
						}
						const parts = time.split(':');
						return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
					}
					if (typeof time === 'number') {
						const hours = Math.floor(time / 60);
						const minutes = time % 60;
						return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
					}
					return '00:00';
				} catch (error) {
					console.error('时间格式化错误:', error, '原始值:', time);
					return '00:00';
				}
			},
			timeToMinutes(timeStr) {
				if (!timeStr) return 0;
				const [hours, minutes] = timeStr.split(':').map(Number);
				return hours * 60 + minutes;
			},
			calculateInBedTime() {
				try {
					// 1. 获取上床时间
					const bedTimeStr = this.sleepData.bedTime || '';
					const bedTime = bedTimeStr.split(' ')[1].substring(0, 5); // "23:48"
					const bedTimeMinutes = this.timeToMinutes(bedTime); // 1428分钟

					// 2. 获取睡眠潜时（格式 "00:17"）
					const asleepTimeStr = this.sleepData.asleepTime || '00:00';
					const asleepTimeMinutes = this.timeToMinutes(asleepTimeStr); // 17分钟

					// 3. 获取睡眠总时长（格式 "07:27"）
					const totalSleep = this.sleepData.totalDurationOfSleep || '00:00';
					const totalSleepMinutes = this.timeToMinutes(totalSleep); // 447分钟

					// 4. 计算睡觉时间点（分钟）
					let sleepTimeMinutes = bedTimeMinutes + asleepTimeMinutes; // 1428 + 17 = 1445
					if (sleepTimeMinutes >= 24 * 60) {
						sleepTimeMinutes -= 24 * 60; // 5分钟 (00:05)
					}

					// 5. 计算醒来时间点（分钟）
					let wakeTimeMinutes = sleepTimeMinutes + totalSleepMinutes; // 5 + 447 = 452
					if (wakeTimeMinutes >= 24 * 60) {
						wakeTimeMinutes -= 24 * 60;
					}

					// 6. 计算在床总时间
					let totalInBedMinutes;
					if (wakeTimeMinutes < bedTimeMinutes) {
						// 跨越午夜的情况
						totalInBedMinutes = (24 * 60 - bedTimeMinutes) + wakeTimeMinutes;
					} else {
						totalInBedMinutes = wakeTimeMinutes - bedTimeMinutes;
					}

					// 7. 更新显示值
					this.inBedHours = Math.floor(totalInBedMinutes / 60);
					this.inBedMinutes = totalInBedMinutes % 60;

					// 8. 打印详细的计算过程
					console.log('详细计算过程:', {
						上床时间: bedTime,
						上床时间分钟数: bedTimeMinutes,
						睡眠潜时字符串: asleepTimeStr,
						睡眠潜时分钟: asleepTimeMinutes,
						睡眠总时长: totalSleep,
						睡眠总时长分钟: totalSleepMinutes,
						入睡时间点: `${Math.floor(sleepTimeMinutes/60)}:${String(sleepTimeMinutes%60).padStart(2, '0')}`,
						醒来时间点: `${Math.floor(wakeTimeMinutes/60)}:${String(wakeTimeMinutes%60).padStart(2, '0')}`,
						计算后在床时间: `${this.inBedHours}小时${this.inBedMinutes}分钟`
					});

				} catch (error) {
					console.error('计算在床时间错误:', error);
					this.inBedHours = 0;
					this.inBedMinutes = 0;
				}
			}
		},
		beforeDestroy() {
			// 组件销毁前清除定时器
			if (this.tipTimer) {
				clearTimeout(this.tipTimer);
			}
		},
		watch: {
			sleepData: {
				handler(newVal) {
					if (newVal) {
						this.calculateInBedTime();
					}
				},
				deep: true
			}
		}
	};
</script>
<style>
	::v-deep .uni-calendar__content {
		margin-bottom: 58rpx;
	}
</style>
<style scoped>
	* {
		font-family: '黑体' !important;
	}

	.content {
		width: 100%;
		min-height: 2000rpx;
		background: linear-gradient(135deg, #1a2233 60%, #232b3b 100%);
		padding-bottom: 200rpx;
		position: relative;
	}

	.red {
		color: #fa3534 !important;
	}

	.mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 998;
		background: linear-gradient(135deg, #1a2233 60%, #232b3b 100%);
		opacity: 0.85;
	}

	.center-tip-popup {
		position: fixed;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		z-index: 999;
		width: 60%;
	}

	.tip-content {
		background: linear-gradient(120deg, #232b3b 60%, #1a2233 100%);
		padding: 30rpx 40rpx;
		border-radius: 24rpx;
		box-shadow: 0 0 32rpx #00ffe7cc, 0 0 0 4rpx #3a6affcc inset, 0 8rpx 32rpx #000a;
		text-align: center;
		font-size: 28rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 2rpx solid #00ffe7cc;
		color: #b6e0ff;
	}

	.tip-icon {
		font-size: 36rpx;
		color: #3a6aff;
		margin-right: 16rpx;
		font-weight: bold;
	}

	/* 超级科技风卡片 */
	.cyber-card {
		background: linear-gradient(120deg, #232b3b 60%, #1a2233 100%);
		border-radius: 24rpx;
		box-shadow: 0 0 32rpx #3a6aff55, 0 0 0 2rpx #00ffe7cc inset, 0 8rpx 32rpx #0008;
		border: 2rpx solid #00ffe7cc;
		margin: 32rpx auto;
		padding: 32rpx 24rpx;
		position: relative;
		overflow: hidden;
		color: #b6e0ff;
	}

	.cyber-title {
		font-size: 38rpx;
		color: #3a6aff;
		font-weight: 700;
		letter-spacing: 2rpx;
		text-shadow: 0 0 16rpx #3a6affcc, 0 0 32rpx #00ffe7cc;
		background: linear-gradient(90deg, #3a6aff 30%, #00ffe7 70%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		animation: cyber-title-glow 2.5s infinite alternate;
		margin-bottom: 24rpx;
	}
	@keyframes cyber-title-glow {
		0% { text-shadow: 0 0 8rpx #3a6affcc, 0 0 16rpx #00ffe7cc; }
		100% { text-shadow: 0 0 32rpx #3a6affcc, 0 0 64rpx #00ffe7cc; }
	}

	.cyber-divider {
		width: 90%;
		height: 2rpx;
		margin: 0 auto 24rpx auto;
		background: linear-gradient(90deg, #3a6aff 0%, #00ffe7 100%);
		opacity: 0.18;
	}

	.cyber-btn {
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
	.cyber-btn:active::after {
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

	/* 输入框、选择器、按钮等统一科技风 */
	.cyber-input {
		background: rgba(30,40,60,0.98);
		border-radius: 16rpx;
		border: 2rpx solid #3a6affcc;
		color: #b6e0ff;
		font-size: 30rpx;
		padding: 18rpx 24rpx;
		margin-bottom: 18rpx;
		box-shadow: 0 0 16rpx #3a6aff44;
	}

	.cyber-select {
		background: rgba(30,40,60,0.98);
		border-radius: 16rpx;
		border: 2rpx solid #00ffe7cc;
		color: #b6e0ff;
		font-size: 30rpx;
		padding: 18rpx 24rpx;
		margin-bottom: 18rpx;
		box-shadow: 0 0 16rpx #00ffe744;
	}

	/* 卡片内容字体 */
	.cyber-label {
		color: #b6e0ff;
		font-size: 28rpx;
		font-weight: 600;
		margin-bottom: 8rpx;
	}

	.cyber-value {
		color: #fff;
		font-size: 48rpx;
		font-weight: 700;
		text-shadow: 0 0 8rpx #3a6aff88;
	}

	/* 弹窗超级科技风 */
	:deep(.u-popup),
	:deep(.u-popup__wrapper),
	:deep(.u-popup__content),
	:deep(.u-transition),
	:deep(.u-overlay) {
		border-radius: 36rpx 36rpx 28rpx 28rpx !important;
		overflow: hidden !important;
		background: linear-gradient(135deg, #1a2233 60%, #232b3b 100%) !important;
		z-index: 99999 !important;
		box-shadow: 0 8rpx 48rpx 0 #00ffe755, 0 0 0 2rpx #3a6aff33 inset !important;
	}

	.cyber-panel-group {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 32rpx 0;
		margin-top: 48rpx;
		box-sizing: border-box;
		padding: 0 0; /* 由内联style控制 */
	}
	.cyber-panel {
		width: calc(50% - 2vw);
		min-height: 200rpx;
		margin-bottom: 32rpx;
		background: linear-gradient(135deg, rgba(26,34,51,0.85) 60%, rgba(35,43,59,0.92) 100%);
		border-radius: 32rpx;
		box-shadow: 0 8rpx 48rpx 0 #00ffe755, 0 0 0 2rpx #3a6aff55 inset, 0 0 24rpx #00ffe7cc;
		border: 2rpx solid #00ffe7cc;
		backdrop-filter: blur(16rpx);
		position: relative;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		transition: box-shadow 0.3s, transform 0.2s;
	}
	.cyber-panel:active {
		box-shadow: 0 0 64rpx #00ffe7cc, 0 0 0 4rpx #3a6affcc inset;
		transform: scale(0.98);
	}
	.cyber-panel-icon {
		position: absolute;
		left: 32rpx;
		top: 32rpx;
		z-index: 2;
		opacity: 0.85;
	}
	.cyber-panel-title {
		font-size: 30rpx;
		font-weight: 700;
		margin-top: 18rpx;
		margin-bottom: 12rpx;
		letter-spacing: 2rpx;
		background: linear-gradient(90deg, #3a6aff 70%, #00ffe7 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		text-shadow: 0 0 16rpx #3a6affcc, 0 0 32rpx #00ffe7cc;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.cyber-panel-tip {
		width: 28rpx;
		height: 28rpx;
		background: #FA3534;
		border-radius: 50%;
		color: #fff;
		font-size: 20rpx;
		font-weight: bold;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-left: 8rpx;
		box-shadow: 0 0 8rpx #fa3534cc;
	}
	.cyber-panel-value {
		font-size: 64rpx;
		font-weight: 900;
		color: #fff;
		text-shadow: 0 0 24rpx #00ffe7cc, 0 0 8rpx #3a6aff88;
		margin: 18rpx 0 0 0;
		display: flex;
		align-items: baseline;
		justify-content: center;
	}
	.cyber-panel-unit {
		font-size: 26rpx;
		color: #00ffe7;
		margin-left: 8rpx;
		font-weight: 500;
		text-shadow: 0 0 8rpx #00ffe7cc;
	}
	.cyber-panel-tip-btn {
		position: absolute;
		top: 24rpx;
		right: 28rpx;
		width: 38rpx;
		height: 38rpx;
		background: radial-gradient(circle, #fa3534 60%, #ffb3b3 100%);
		border-radius: 50%;
		color: #fff;
		font-size: 26rpx;
		font-weight: bold;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 0 12rpx #fa3534cc, 0 0 0 2rpx #fff2 inset;
		z-index: 10;
		cursor: pointer;
		transition: box-shadow 0.2s, transform 0.2s;
	}
	.cyber-panel-tip-btn:active {
		box-shadow: 0 0 24rpx #fa3534cc, 0 0 0 4rpx #fff2 inset;
		transform: scale(0.92);
	}

	:deep(.uni-datetime-picker) {
		background: linear-gradient(120deg, #232b3b 60%, #1a2233 100%) !important;
		border: 2rpx solid #3a6affcc !important;
		border-radius: 16rpx !important;
		box-shadow: 0 0 16rpx #3a6aff44 !important;
		color: #b6e0ff !important;
	}

	:deep(.uni-datetime-picker__input) {
		color: #b6e0ff !important;
	}

	:deep(.uni-datetime-picker__btn-text) {
		color: #3a6aff !important;
	}

	:deep(.uni-datetime-picker__btn-cancel) {
		color: #b6e0ff !important;
	}

	:deep(.uni-datetime-picker__btn-confirm) {
		color: #3a6aff !important;
	}

	.sleep-efficiency-title {
		display: flex;
		align-items: center;
		font-size: 38rpx;
		color: #3a6aff;
		font-weight: 700;
		letter-spacing: 2rpx;
		text-shadow: 0 0 16rpx #3a6affcc;
		margin-bottom: 24rpx;
	}
	.sleep-efficiency-bar {
		width: 10rpx;
		height: 34rpx;
		background: #3a6aff;
		border-radius: 80rpx;
		display: inline-block;
		margin-right: 14rpx;
		box-shadow: 0 0 16rpx #00ffe7cc;
	}
	.sleep-efficiency-card {
		padding-bottom: 0;
		min-height: 400rpx;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: flex-start;
	}
	.night-snore-title {
		display: flex;
		align-items: center;
		font-size: 38rpx;
		color: #3a6aff;
		font-weight: 700;
		letter-spacing: 2rpx;
		text-shadow: 0 0 16rpx #3a6affcc;
		margin-bottom: 24rpx;
	}
	.night-snore-bar {
		width: 10rpx;
		height: 34rpx;
		background: #3a6aff;
		border-radius: 80rpx;
		display: inline-block;
		margin-right: 14rpx;
		box-shadow: 0 0 16rpx #00ffe7cc;
	}
	.night-snore-card {
		padding-bottom: 0;
		min-height: 400rpx;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: flex-start;
	}

	/* 设备选择弹窗科技风样式补全 */
	.popup-cyber-outer-bg {
		width: 100vw;
		min-height: 40vh;
		background: linear-gradient(135deg, #1a2233 60%, #232b3b 100%);
		border-radius: 0 0 28rpx 28rpx;
		box-shadow: 0 8rpx 48rpx 0 #00ffe755, 0 0 0 2rpx #3a6aff33 inset;
		padding: 16rpx 0 16rpx 0;
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
	@keyframes btn-ripple {
		0% { opacity: 0.7; }
		100% { opacity: 0; }
	}
	@keyframes cyber-breath {
		0% { box-shadow: 0 0 24rpx #3a6aff33, 0 0 0 0 #00ffe7cc inset;}
		100% { box-shadow: 0 0 64rpx #3a6affcc, 0 0 24rpx 0 #00ffe7cc inset;}
	}
</style>