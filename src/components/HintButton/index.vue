<template>
  <a :title="title" style="margin: 10px">
    <el-button v-bind="$attrs" v-on="$listeners"></el-button>
  </a>
</template>

<script>
export default {
  name: "HintButton",
  props: ["title"],
  /* mounted() {
    console.log(this.$attrs, this.$listeners);
  }, */
};
</script>

<style>
</style>