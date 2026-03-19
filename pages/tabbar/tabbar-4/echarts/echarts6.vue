<template>
  <view class="charts-box">
    <view
      style="
        width: 100%;
        height: 60rpx;
        color: #676767;
        font-size: 30rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 10px;
      "
    >
      室内平均温度统计
    </view>
    <qiun-data-charts type="line" :opts="opts" :chartData="chartData"  :ontouch="true" />
  </view>
</template>

<script>
export default {
  data() {
    return {
      chartData: {},
      //您可以通过修改 config-ucharts.js 文件中下标为 ['line'] 的节点来配置全局默认参数，如都是默认参数，此处可以不传 opts 。实际应用过程中 opts 只需传入与全局默认参数中不一致的【某一个属性】即可实现同类型的图表显示不同的样式，达到页面简洁的需求。
      opts: {
        color: [
          "#1890FF",
          "#91CB74",
          "#FAC858",
          "#EE6666",
          "#73C0DE",
          "#3CA272",
          "#FC8452",
          "#9A60B4",
          "#ea7ccc",
        ],
        enableScroll:true,
        padding: [15, 0, 0, 0],
        dataLabel: false,
        dataPointShape: false,
        legend: { position: "top", float: "left", show: false },
        xAxis: {
          disableGrid: true,
          itemCount: 7,
          scrollShow: true,
        },
        yAxis: {
          showTitle: true,
          data: [
            {
              min: 0,
              max: 50,
              axisLine: false,
              titleFontColor: "#676767",
              axisLineColor: "#676767",
              title: "(℃)",
              titleOffsetY: -5,
              titleOffsetX: -10,
              titleFontSize: 16,
            },
          ],
        },
        extra: {
          line: {
            type: "curve",
            width: 2,
            activeType: "hollow",
            linearType: "custom",
          },
        },
      },
    };
  },
  mounted() {
    this.getServerData();
  },
  methods: {
    getServerData(item) {
      if (!item||item.length==0) {
        //模拟从服务器获取数据时的延时
        setTimeout(() => {
          //模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
          let res = {
            categories: this.getNearly7Day(),
            series: [
              {
                name: "℃",
                linearColor: [
                  [0, "#1890FF"],
                  [0.25, "#00B5FF"],
                  [0.5, "#00D1ED"],
                  [0.75, "#00E6BB"],
                  [1, "#90F489"],
                ],
                data: [0, 0, 0, 0,0, 0,0],
              },
            ],
          };
          this.chartData = JSON.parse(JSON.stringify(res));
        }, 500);
      } else {
         var  temperature = item.map((v)=>{return v.temperature})
         var  time = item.map((v)=>{ 
          var aa = v.createTime.split(' ')[1]
          var bb = aa.split(':')
          return (bb[0]+':'+bb[1])
        })
        let res = {
            categories: time,
            series: [
              {
                name: "℃",
                linearColor: [
                  [0, "#1890FF"],
                  [0.25, "#00B5FF"],
                  [0.5, "#00D1ED"],
                  [0.75, "#00E6BB"],
                  [1, "#90F489"],
                ],
                data: temperature,
              },
            ],
          };
          console.log(res)
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
  },
};
</script>

<style scoped>
/* 请根据实际需求修改父元素尺寸，组件自动识别宽高 */
.charts-box {
  width: 100%;
  height: 250px;
  margin-top: 40px;
}
</style>
