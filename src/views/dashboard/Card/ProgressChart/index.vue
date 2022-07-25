<template>
  <div class="charts" ref="charts"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "ProgressChart",
  mounted() {
    let progressCharts = echarts.init(this.$refs.charts);
    progressCharts.setOption({
      xAxis: {
        show: false,
        min:0,
        max:100
      },
      yAxis: {
        show: false,
        // 在y轴设置type 呈现进度条样式
        type: "category",
      },
      series: [
        {
          type: "bar",
          data: [78],
          // 柱状图宽度
          barWidth:10,
          color:'cyan',
          // 设置背景颜色
          showBackground:true,
          backgroundStyle:{
            color:'#eee'
          },
          // 展示文本标签
          label:{
            show:true,
            formatter:'|',
            position:'right'
          }
        },
      ],
      grid: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
    });
  },
};
</script>

<style>
</style>