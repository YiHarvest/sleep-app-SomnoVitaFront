<template>
  <view class="charts-box">
    <qiun-data-charts 
      type="column"
      :opts="opts"
      :chartData="chartData"
      :ontouch="true"
      background="rgba(24,31,42,0.98)"
      style="width:90%;margin:0 auto;background:transparent;"
    />
  </view>
</template>

<script>
export default {
  data() {
    return {
      chartData: {},
      //您可以通过修改 config-ucharts.js 文件中下标为 ['column'] 的节点来配置全局默认参数，如都是默认参数，此处可以不传 opts 。实际应用过程中 opts 只需传入与全局默认参数中不一致的【某一个属性】即可实现同类型的图表显示不同的样式，达到页面简洁的需求。
      opts: {
        color: [
          "#00ffe7",
          "#3a6aff",
          "#00ffe7",
          "#3a6aff",
          "#00ffe7",
          "#3a6aff",
          "#00ffe7"
        ],
        enableScroll: true,
        padding: [15, 20, 15, 15],
        dataLabel: true,
        dataPointShape: true,
        dataPointShapeType: 'solid',
        legend: { 
          position: "top", 
          float: "left", 
          show: false 
        },
        xAxis: {
          disableGrid: true,
          itemCount: 7,
          scrollShow: true,
          fontColor: "#b6e0ff",
          fontSize: 12,
          rotateLabel: true,
          marginTop: 4
        },
        yAxis: {
          showTitle: true,
          data: [
            {
              axisLine: true,
              titleFontColor: "#b6e0ff",
              axisLineColor: "#3a6aff44",
              title: "(%)",
              titleOffsetY: -5,
              titleOffsetX: 0,
              titleFontSize: 14,
              gridColor: "#3a6aff22",
              gridType: "dash",
              dashLength: 4,
              gridEval: 4,
              fontColor: "#b6e0ff",
              fontSize: 12
            },
          ],
        },
        extra: {
          column: {
            type: "group",
            width: 20,
            activeBgColor: "#3a6aff",
            activeBgOpacity: 0.2,
            borderRadius: 4,
            barBorderRadius: 4,
            linearType: "custom",
            linearOpacity: 1,
            gradient: true,
            gradientColor: ["#00ffe7", "#3a6aff"]
          },
        },
      },
    };
  },
  mounted() {
    // this.getServerData();
  },
  methods: {
    getServerData(item) {
      if(!item){
        //模拟从服务器获取数据时的延时
        setTimeout(() => {
          //模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
          let res = {
              categories: this.getNearly7Day(),
              series: [
                {
                  name: "%",
                  data: [0,0,0,0,0,0,0]
                }
              ]
            };
          this.chartData = JSON.parse(JSON.stringify(res));
        }, 500);
      }else{
        var dataArr =  item.map((v)=>{
          return v.sleepDate.split('-')[1]+'/'+v.sleepDate.split('-')[2]
        })
        var sleepEff = item.map((v)=>{return v.sleepEff})
        let res = {
              categories: dataArr,
              series: [
                {
                  name: "%",
                  data: sleepEff
                }
              ]
            };
          this.chartData = JSON.parse(JSON.stringify(res));
      }

    },
    getNearly7Day() {
            let days = []
            var date = new Date()
            for (let i = 0; i <= 24 * 6; i += 24) {
                //今天加上前6天
                let dateItem = new Date(date.getTime() - i * 60 * 60 * 1000) //使用当天时间戳减去以前的时间毫秒（小时*分*秒*毫秒）
                let y = dateItem.getFullYear() //获取年份
                let m = dateItem.getMonth() + 1 //获取月份js月份从0开始，需要+1
                let d = dateItem.getDate() //获取日期
                m = this.addDate0(m) //给为单数的月份补零
                d = this.addDate0(d) //给为单数的日期补零
                let valueItem =  m + '/' + d //组合
                days.push(valueItem) //添加至数组
            }
            return days.reverse()
        },
        //给日期加0
        addDate0(time) {
            if (time.toString().length == 1) {
                time = '0' + time.toString()
            }
            return time 
       }
  }
};
</script>

<style scoped>
.charts-box {
  width: 100%;
  min-height: 320rpx;
  background: transparent;
  border-radius: 0;
  box-shadow: none;
  border: none;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-x: auto;
}
.charts-box::-webkit-scrollbar {
  display: none;
}
@keyframes cyber-breath {
  0% { box-shadow: 0 0 24rpx #3a6aff33, 0 0 0 0 #00ffe7cc inset;}
  100% { box-shadow: 0 0 64rpx #3a6affcc, 0 0 24rpx 0 #00ffe7cc inset;}
}
</style>