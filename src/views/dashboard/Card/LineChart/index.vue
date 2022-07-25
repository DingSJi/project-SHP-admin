<template>
  <div class="charts" ref="charts"></div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name:'LineChart',
  mounted() {
    let lineChart = echarts.init(this.$refs.charts)
    lineChart.setOption({
      xAxis:{
        show:false,
        type:'category'
      },
      yAxis:{
        show:false
      },
      series:[
        {
          type:'line',
          data:[10,7,33,20,12,13,28,25,44,30],
          smooth:true,
          itemStyle:{
            opacity:0
          },
          lineStyle:{
            color:'blue'
          },
          areaStyle:{
            color:'blue',
            opacity:0.1
          },
        }
      ],
      grid:{
        top:0,
        left:0,
        right:0,
        bottom:0
      }
    })
  },
}
</script>

<style>
  .charts{
    width: 100%;
    height: 100%;
  }
</style>