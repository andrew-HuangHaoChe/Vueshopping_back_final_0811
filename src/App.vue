<template>
  <div id="app">
    <!--<img src="./assets/logo.png">-->
    <!--<HelloWorld/>-->
    <router-view></router-view>
  </div>
</template>

<script>


export default {
  name: 'App',
  // created(){    //這裡將api網址與dev.env.js內所設定的環境變數做替換
  //   const api=`${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/products`//'https://vue-course-api.hexschool.io/api/andrewhaoche/products';
  //   //api伺服器路徑以及你所聲請的apipath
  //   console.log(process.env.APIPATH, process.env.CUSTOMPATH);
  //   this.$http.get(api).then((response) => {
  //   console.log(response.data)
  //   });
  // },
  
}
</script>

<style lang="scss">

@import "./assets/all";
</style>
