<template>
  <el-card class="box-card" style="margin: 10px 0">
    <div slot="header" class="clearfix">
      <!-- 头部左侧内容 -->
      <!--  @tab-click="handleClick" -->
      <el-tabs class="tab" v-model="activeName">
        <el-tab-pane label="销售额" name="销售额"></el-tab-pane>
        <el-tab-pane label="访问量" name="访问量"></el-tab-pane>
      </el-tabs>
      <!-- 头部右侧内容 -->
      <div class="right">
        <span>今日</span>
        <span>本周</span>
        <span>本月</span>
        <span>本年</span>
        <!-- v-model="value1" -->
        <el-date-picker
          class="date"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="mini"
        >
        </el-date-picker>
      </div>
    </div>
    <div>
      <el-row>
        <el-col :span="18">
          <div class="charts" ref="charts"></div>
        </el-col>
        <el-col :span="6">
          <div>
            <div>门店销售排名</div>
            <ul>
              <li>
                <span class="rindex top">1</span>
                <span>肯德基</span>
                <span class="value">346514</span>
              </li>
              <li>
                <span class="rindex top">2</span>
                <span>麦当劳</span>
                <span class="value">346514</span>
              </li>
              <li>
                <span class="rindex top">3</span>
                <span>蜜雪冰城</span>
                <span class="value">346514</span>
              </li>
              <li>
                <span class="rindex">4</span>
                <span>卡旺卡</span>
                <span class="value">346514</span>
              </li>
              <li>
                <span class="rindex">5</span>
                <span>老乡鸡</span>
                <span class="value">346514</span>
              </li>
              <li>
                <span class="rindex">6</span>
                <span>海底捞</span>
                <span class="value">346514</span>
              </li>
              <li>
                <span class="rindex">7</span>
                <span>烧烤</span>
                <span class="value">346514</span>
              </li>
            </ul>
          </div>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "Sale",
  data() {
    return {
      activeName: "销售额",
    };
  },
  mounted() {
    let mychart = echarts.init(this.$refs.charts);
    mychart.setOption({
      title: {
        text: "销售额趋势",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: [
            "一月",
            "二月",
            "三月",
            "四月",
            "五月",
            "六月",
            "七月",
            "八月",
            "九月",
            "十月",
            "十一月",
            "十二月",
          ],
          axisTick: {
            alignWidthLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: [
        {
          name: "销售量",
          type: "bar",
          barWidth: "60%",
          data: [10, 20, 14, 35, 24, 45, 67, 23, 14, 14, 11, 78],
          color: "yellowgreen",
        },
      ],
    });
  },
};
</script>

<style scoped>
>>> .el-card__header {
  border-bottom: none;
}
.clearfix {
  display: flex;
  justify-content: space-between;
  position: relative;
}
.tab {
  width: 100%;
}
.right {
  position: absolute;
  right: 0;
  top: 5px;
}
.date {
  width: 200px;
  margin: 0 20px;
}
.right span {
  margin: 0 10px;
  font-size: 14px;
}
.charts {
  width: 100%;
  height: 300px;
}
ul {
  list-style: none;
  width: 100%;
  height: 300px;
  padding: 0;
}
ul li {
  height: 8%;
  margin: 10px 0;
}
ul li span {
  margin: 0 10px;
}
ul li .rindex {
  display: inline-block;
  width: 17px;
  height: 17px;
  border-radius: 50%;
  color: yellowgreen;
  text-align: center;
}
ul li .top{
  background-color: black;
}
.value {
  float: right;
}
</style>