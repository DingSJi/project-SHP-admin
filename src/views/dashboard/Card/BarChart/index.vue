<template>
  <div class="charts" ref="charts"></div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name:'BarChart',
  mounted() {
    let barCharts = echarts.init(this.$refs.charts)
    barCharts.setOption({
      xAxis:{
        show:false,
        type:'category'
      },
      yAxis:{
        show:false
      },
      series:[
        {
          type:'bar',
          data:[10,7,12,15,20,10,15,16,19,11,13,19]
        }
      ],
      tooltip:{},
      grid:{
        top:0,
        bottom:0,
        left:0,
        right:0
      }
    })
  },
}
</script>

<style>

</style>