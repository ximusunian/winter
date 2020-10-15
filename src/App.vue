<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
  body,html {
    margin: 0px;
    height: 100%;
    /* overflow: hidden; */
  }
  #app {
    height: 100%;
  }
</style>
