<template>
  <div>
    <div class="card-header">
      <span>{{title}}</span>
      <span class="el-icon-info"></span>
    </div>
    <div class="card-content">{{count}}</div>
    <div class="card-charts">
      <!-- 插槽 -->
      <slot name="charts"></slot>
    </div>
    <div class="card-footer">
      <!-- 插槽 -->
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name:'Detail',
  props:['title','count']
}
</script>

<style scoped>
.card-header{
  display:flex;
  justify-content: space-between;
  color: #aaa;
  font-size: 14px;
}
.card-content{
  font-size:30px;
  padding: 10px 0;
}
.card-charts{
  height:50px;
  font-size:13px;
}
.card-footer{
  border-top: 1px solid #d9d9d9;
  padding-top: 5px;
}

</style>