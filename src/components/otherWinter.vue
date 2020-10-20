<template>
  <div class="antum">
    <div class="loding_box" v-if="isLoding">
      <van-loading type="spinner" class="loding" />
    </div>
    <!-- 底部分类商品 -->
    <div class="winter_bottom_pro">
      <van-tabs
        v-model="active"
        lazy-render
        scrollspy
        sticky
        duration="0"
        title-inactive-color
        title-active-color="#fff"
      >
        <img :src="allnfo.springImg" alt="" class="header" />
        <div class="spec_content">
          <van-tab
            v-for="(item, index) in cateList"
            :title="item.name"
            :key="index"
            :class="index == 0 ? 'none' : ''"
          >
            <div class="winter-content">
              <!-- 标题 -->
              <div class="common-title">
                <span>{{ item.name }}</span>
              </div>
              <!-- 列表 -->
              <div
                v-if="item.key != 29 && index > 0"
                class="shoe-list-container"
              >
                <div
                  class="shoe-list"
                  v-for="(child, i) in oneList[index - 1].list"
                  :key="i"
                  @click="goProductDetail(child.productCode)"
                >
                  <div style="position: relative">
                    <div style="position: relative">
                      <img
                        v-if="child.newTag"
                        :src="child.newTag"
                        class="tagImg"
                        alt=""
                      />
                      <img :src="child.pic" alt="" class="shop" />
                      <!-- 现货会 -->
                      <div
                        class="tap"
                        v-show="
                          child.themeOpen && child.themeEndTime - nowTime > 0
                        "
                      >
                        <div class="tap_img">
                          <div class="top_dec small-font">
                            {{ child.theme }}
                          </div>
                          <div class="bottom_price">
                            ¥{{ child.spotMeetingPrice }}
                          </div>
                        </div>
                        <div class="time">
                          <div class="left_time">
                            {{
                              child.themeStartTime
                                | startTime(
                                  child.themeEndTime,
                                  that,
                                  child.themeOpen
                                )
                            }}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="content">
                      <div :class="currentSjc > item.themeEndTime ? 'content-title':'content-title-normal'">{{ child.name }}</div>
                      <div class="common-tag-parent" v-show="child.themeTag">
                        <div class="coommon-tag">{{ child.themeTag }}</div>
                      </div>
                      <div class="price">¥{{ child.price }}</div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- <div v-if="index === 0">
                <div class="nav-container">
                  <img
                    src="../assets/nav1.png"
                    alt=""
                    @click="toMessage"
                    v-if="currentSjc < 1602259200000"
                  >
                  <img src="../assets/nav2.png" alt="" @click="toFirstUrl">
                </div>
              </div> -->
              <!-- 冬季优品 -->
              <div v-if="item.key == 29 && index > 0">
                <div class="winter-recommend">
                  <div
                    class="list"
                    v-for="(item, i) in oneList[index - 1].list"
                    :key="i"
                    @click="goProductDetail(item.productCode)"
                  >
                    <!-- <div class="ms-font" v-if="false">
                      <span>{{ item.theme }}</span>
                      <div class="price">
                        <span>¥{{ item.price }}</span>
                        <span
                          class="price-center"
                        >{{ item.themeStartTime | startTime( item.themeEndTime, that, item.themeOpen)}}开始</span>
                      </div>
                    </div> -->
                    <div class="word-contianer">
                      <div>
                        <div :class="currentSjc > item.themeEndTime ? 'normal' : 'word1' ">
                          {{ item.name }}
                        </div>
                        <div :class="item.themeTag? 'common-tag-parent2' : 'tags'">
                          <div class="coommon-tag" v-if="item.themeTag">
                            {{ item.themeTag }}
                          </div>
                        </div>
                      </div>
                      <div class="flex-between">
                        <div style="display: flex; align-items: baseline">
                          <span class="word2">¥</span>
                          <span class="word3">{{
                            currentSjc > item.themeEndTime
                              ? item.price
                              : item.spotMeetingPrice
                          }}</span>
                          <span
                            class="word4"
                            v-if="item.price && item.themeEndTime > currentSjc"
                            >¥{{ item.price }}</span
                          >
                        </div>
                        <div>
                          <img
                            src="../assets/btn_img2x.png"
                            style="width: 79px; height: 22px"
                            alt=""
                          />
                          <!-- 立即抢购
                          <img src="../assets/arrow_right.png" alt="">-->
                        </div>
                      </div>
                    </div>
                    <div class="shop">
                      <img :src="item.pic" alt="" class="" />
                      <div class="bottom" v-if="false"></div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 列表 -->
            </div>
          </van-tab>
        </div>
      </van-tabs>
      <!-- 具体内容 -->
    </div>
  </div>
  <!-- </van-pull-refresh> -->
</template>

<script>
import https from "../http.js";
import { Toast } from "vant";
export default {
  name: "Winter",
  data() {
    return {
      token: "",
      isLoading: false,
      that: this,
      mainList: [],
      twoList: [],
      hotList: [],
      skillList: [],
      cateList: [],
      oneList: [],
      nowTime: "",
      startTime: "",
      endTime: "",
      middleTime: "",
      winterImg: "",
      day: "",
      hour: "",
      min: "",
      second: "",
      active: 0,
      currentIndex: 0,
      isLoding: true,
      weChat: false,
      allnfo: {},
      commendData: {},
      navList: [{ name: "冬季新品", key: "a" }],
    };
  },
  created() {
    this.nowTime = Date.parse(new Date());
    this.token = this.$route.query.token;
    // this.getMain_hot();
    this.getCateList();
    this.getWinterProduct();
    this.currentSjc = new Date().getTime();
  },
  mounted() {
    let ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
      //ios的ua中无miniProgram，但都有MicroMessenger（表示是微信浏览器）
      wx.miniProgram.getEnv((res) => {
        this.weChat = true;
        // if (res.miniprogram) {
        //   wx.miniProgram.navigateTo({
        //     url: `/pages/goods_details/index?prodCode=${prodCode}&&classifyId=-1`,
        //   });
        // } else {
        //    this.weChat = true
        //   // alert("不在小程序里");
        // }
      });
    } else {
      this.weChat = false;
      // let u = navigator.userAgent;
      // let isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1; //android终端
      // let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      // if (isIOS) {
      //   window.webkit.messageHandlers.goDetail.postMessage({
      //     prodCode: prodCode, //vue给iOS传值
      //   });
      // }
      // if (isAndroid) {
      //   let strParameter = JSON.stringify({
      //     prodCode: prodCode,
      //   });
      //   window.goDetail.OnClick(strParameter);
      // }
    }
  },
  filters: {
    startTime(start, end, that, isOpen) {
      let nowTime = Date.parse(new Date());
      //判断是否开始
      if (start - nowTime > 0) {
        //未开始
        return that.format(start, "m月d号 H:i") + "开始";
      } else if (start - nowTime < 0 && end - nowTime > 0) {
        //开始没结束
        return that.format(end, "m月d号 H:i") + "结束";
      } else if (nowTime - end > 0) {
        isOpen = false;
      }
    },
    test(str, themeTag) {
      var retV = str.match(/[^\x00-\xff]/gi);
      var allLength = 0;
      if (retV == null) {
        allLength = allLength + str.length;
      } else {
        allLength = allLength + (str.length + retV.length);
      }
      if (allLength > 17 && themeTag) {
        return str.substring(0, 17) + "...";
      } else {
        return str;
      }
    },
  },
  methods: {
    toMessage() {
      Toast("快去添加冬季新品到购物车吧");
    },

    toFirstUrl() {
      let ua = navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
        //ios的ua中无miniProgram，但都有MicroMessenger（表示是微信浏览器）
        wx.miniProgram.getEnv((res) => {
          this.weChat = true;
          if (res.miniprogram) {
            wx.miniProgram.navigateTo({
              url: `/pages/antum/index?jumpUrl=${this.allnfo.firstUrl}`,
            });
          } else {
            // alert("不在小程序里");
          }
        });
      } else {
        // if (this.$route.query.token) {
        window.location.href =
          this.allnfo.firstUrl + "?token=" + this.$route.query.token;
        // } else {
        // window.location.href = this.allnfo.firstUrl;
        // }
      }
    },
    getWinterProduct() {
      https
        .fetchPost("/huitongyi/app/product/zone/winterGetProduct")
        .then((res) => {
          if (res.result == 100) {
            this.allnfo = res.data;
            this.commendData = res.data.list[0];
            console.log(this.commendData);
          }
        });
    },

    /**
     *下拉刷新
     */

    onRefresh() {
      // setTimeout(() => {
      //   Toast("刷新成功");
      //   this.isLoading = false;
      // }, 1000);
    },
    format(timestamp, formats) {
      // formats格式包括
      // 1. Y-m-d
      // 2. Y-m-d H:i:s
      // 3. Y年m月d日
      // 4. Y年m月d日 H时i分
      formats = formats || "Y-m-d";

      var zero = function (value, m) {
        if (m) {
          return value;
        }
        if (value < 10) {
          return "0" + value;
        }
        return value;
      };

      var myDate = timestamp ? new Date(timestamp) : new Date();

      var year = myDate.getFullYear();
      var month = zero(myDate.getMonth() + 1, 1);
      var day = zero(myDate.getDate());

      var hour = zero(myDate.getHours());
      var minite = zero(myDate.getMinutes());
      var second = zero(myDate.getSeconds());

      return formats.replace(/Y|m|d|H|i|s/gi, function (matches) {
        return {
          Y: year,
          m: month,
          d: day,
          H: hour,
          i: minite,
          s: second,
        }[matches];
      });
    },
    getCateList() {
      https
        .fetchPost(
          "/huitongyi/app/product/zone/winterGetProductClassifyData",
          {}
        )
        .then((res) => {
          if (res.result == 100) {
            this.oneList = res.data.model;
            console.log(this.oneList);
            this.cateList = [...this.navList, ...res.data.stringList];
            this.isLoding = false;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    /**
     *去详情
     **/
    goProductDetail: function (prodCode) {
      /*********/
      let ua = navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
        //ios的ua中无miniProgram，但都有MicroMessenger（表示是微信浏览器）
        wx.miniProgram.getEnv((res) => {
          this.weChat = true;
          if (res.miniprogram) {
            wx.miniProgram.navigateTo({
              url: `/pages/goods_details/index?prodCode=${prodCode}&&classifyId=-1`,
            });
          } else {
            // alert("不在小程序里");
          }
        });
      } else {
        let u = navigator.userAgent;
        let isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1; //android终端
        let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        if (isIOS) {
          window.webkit.messageHandlers.goDetail.postMessage({
            prodCode: prodCode, //vue给iOS传值
          });
        }
        if (isAndroid) {
          let strParameter = JSON.stringify({
            prodCode: prodCode,
          });
          window.goDetail.OnClick(strParameter);
        }
      }
      /**********/
    },
    goBlock(id, index) {
      document.getElementById(id).scrollIntoView({ block: "start" });
      this.currentIndex = index;
    },
  },
};
</script>
<style scope>
.price-center {
  display: inline-block;
  margin-left: 25px;
}
.common-tag-parent2 {
  height: 39px;
  margin: 15px 0 40px 0;
}
.tags {
  height: 39px;
}
.antum {
  background: #c5ecfd;
}
.common-tag-parent {
  width: 150px;
  height: 39px;
}
.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
ul {
  list-style: none;
  margin: 0;
}
.winter-container {
  background: #c5ebfd;
  width: 100%;
}
.header {
  display: block;
  width: 100%;
}
.winter-content {
  padding: 0 24px 40px 24px;
  box-sizing: border-box;
}
.winter-nav > div {
  display: flex;
  padding: 20px 0 20px 20px;
  box-sizing: border-box;
  color: #fff;
  box-sizing: border-box;
  margin-bottom: 29px;
}
.nav1 {
  background: url("../assets/nav_bg1.png");
  background-size: cover;
}
.nav2 {
  background: url("../assets/nav_bg2.png");
  background-size: cover;
}
.bag {
  width: 290px;
  height: 138px;
}
.winter-nav .title {
  font-size: 38px;
  font-weight: 500;
}
.winter-nav .title2 {
  font-size: 12px;
}
.winter-nav .btn-get {
  width: 138px;
  height: 39px;
  font-size: 20px;
  font-weight: 400;
  color: #ffffff;
  line-height: 39px;
  background: #0e659c;
  border-radius: 20px;
  text-align: center;
  margin-top: 20px;
}
.winter-nav .btn-get img {
  width: 12px;
  height: 10px;
  margin-left: 5px;
  display: inline-block;
  vertical-align: middle;
}
.common-title {
  width: 431px;
  height: 116px;
  background: url("https://huitongyi-mall.oss-cn-hangzhou.aliyuncs.com/app/50625fb8d37849128976844f3013ed00.png")
    no-repeat;
  background-size: 100%;
  color: #0062c4;
  font-size: 40px;
  line-height: 116px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto;
  font-family: HYDianHei;
}
.common-title:before,
.common-title:after {
  content: "";
  display: inline-block;
  background: #0063c3;
  width: 6px;
  height: 6px;
  border-radius: 50%;
}
.common-title span {
  display: inline-block;
  margin: 0 30px;
  font-weight: bold;
}
.winter-recommend {
  background: #fff;
  padding: 20px 20px 20px 20px;
  box-sizing: border-box;
  width: 100%;
  margin: 40px 0;
  border-radius: 6px;
}
.winter-recommend .list {
  background: #eef3f6;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  padding: 18px 22px;
  box-sizing: border-box;
  position: relative;
  margin-bottom: 20px;
}
.winter-recommend > div:last-child {
  margin-bottom: 0px;
}
.winter-recommend .shop {
  width: 193px;
  height: 193px;
  margin-left: 30px;
  /* -webkit-box-flex: 1;
  -ms-flex: 1;
  -webkit-flex: 1;
  flex: 1; */
}
.winter-recommend .shop > img {
  width: 100%;
  height: 100%;
}
.winter-recommend .shop .bottom {
  position: absolute;
  font-weight: 600;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 47px;
  color: #fff;
  background: url("../assets/picBg.png") no-repeat;
  background-size: cover;
  font-size: 10px;
  /* font-size: 12px; */
}
.winter-recommend .ms-font {
  width: 50%;
  font-size: 20px;
  /* transform: scale(0.8, 0.8); */
  position: absolute;
  right: -100px;
  bottom: 13px;
  z-index: 100;
  color: #fff;
}
.winter-recommend .shop .price {
  display: flex;
  justify-content: space-between;
}
.winter-recommend .shop .ms-font span {
}
.winter-recommend .word1 {
  font-size: 26px;

  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
}
.winter-recommend .normal {
  font-size: 26px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.ontent-title {
  font-size: 24px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.winter-recommend .word2 {
  color: #ff1e01;
  font-size: 24px;
}
.winter-recommend .word3 {
  color: #ff1e01;
  font-size: 44px;
}
.winter-recommend .word4 {
  font-size: 22px;
  color: #999;
  text-decoration: line-through;
  display: inline-block;
  margin-left: 8px;
}
.coommon-tag {
  width: 150px;
  height: 39px;
  line-height: 39px;
  text-align: center;
  background: url("../assets/tag_icon.png") no-repeat;
  background-size: 100%;
  color: #fff;

  font-size: 22px;
}
.winter-recommend .btn-right {
  width: 158px;
  height: 43px;
  line-height: 43px;
  display: inline-block;
  background: #ff1f01;
  border-radius: 22px;
  text-align: center;
  font-size: 26px;
  color: #fff;
  margin-left: 45px;
  display: inline-block;
}
.winter-recommend .btn-right img {
  width: 12px;
  height: 10px;
  display: inline-block;
  margin-left: 5px;
  vertical-align: middle;
}
.shoe-list-container:last-child {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin: 35px 0 0 0;
}
.shoe-list-container {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin: 35px 0;
}
.shoe-list {
  width: 343px;
  height: 495px;
  background: #fff;
  border-radius: 6px;
  overflow: hidden;
  margin: 0 0 14px 0;
}
.shoe-list .price {
  margin: 15px 0 0 0;
  font-size: 30px;
  color: #ff1f01;
}
.shoe-list .shop {
  width: 343px;
  height: 327px;
}
.shoe-list .coommon-tag {
  margin: 2px 0 3px 0;
  font-size: 24px;
  width: 166px;
  height: 43px;
  line-height: 43px;
}
.shoe-list .content {
  padding-left: 10px;
  box-sizing: border-box;
  height: 1.8rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
/* .shoe-list-container > div:nth-child(3n-1) {
  margin: 0 14px 14px 14px;
} */
.tab-container {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  font-size: 24px;
  color: #333;
  background: #fff;
  padding-left: 34px;
  padding-top: 17px;
  z-index: 999;
  width: 100%;
}
/* .tab-container > div {
  height: 40px;
  line-height: 40px;
  text-align: center;
  width: 130px;
  display: inline-block;
  margin-right: 40px;
  margin-bottom: 18px;
}
.tab-container .active {
  color: #fff;
  background: #0084e7;
} */
.nav-container {
  margin-top: 46px;
}
.nav-container img {
  display: block;
  margin-bottom: 30px;
  width: 100%;
}
.word-contianer {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: calc(100% - 200px);
  max-width: 5.2rem;
}

/* vant样式修改 */
.van-van-tab {
  height: 40px !important;
  line-height: 40px !important;
}
.van-tab .van-tab__text {
  font-size: 24px;
  margin: 10px 0;
  color: #333;
}
.title-inactive-color,
.van-tab--active span {
  background: #0084e7;
  font-size: 24px;
  color: #fff !important;
  border-radius: 4px;
  padding: 5px 8px;
}
.van-tabs__line {
  display: none;
}
.van-tabs__nav--line {
  padding: 0;
}
.van-tabs--line .van-tabs__wrap {
  /* min-height: 60px !important; */
  height: auto !important;
}
.van-tabs__nav {
  flex-wrap: wrap;
}
.van-tabs__wrap--scrollable .van-tab {
  -webkit-box-flex: 0 !important;
  -webkit-flex: 0 0 20% !important;
  flex: 0 0 20% !important;
  height: 40px;
  font-size: 24px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  /* color: rgba(102, 102, 102, 1); */
  color: #333;
  line-height: 40px;
  /* margin: 5px 0; */
  margin-bottom: 5px;
  padding: 0;
}
.van-tabs__wrap--scrollable .van-tabs__nav {
  padding: 8px 34px;
  box-sizing: border-box;
}
.none .common-title {
  display: none;
}
.shoe-list-container {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
.tagImg {
  position: absolute;
  top: 4px;
  left: 4px;
  width: 72px;
  height: 72px;
}
/* 现货会样式 */
.tap {
  position: absolute;
  bottom: 0px;
  height: 65px;
  width: 100%;
  padding-left: 126px;
  box-sizing: border-box;
  background: rgba(238, 67, 45, 1);
}
.tap .time {
  display: flex;
  align-items: center;
  height: 65px;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
}
.tap .time .left_time {
  height: 100%;
  font-size: 21px;
  height: 100%;
  text-align: center;
  line-height: 65px;
}

.tap .tap_img {
  position: absolute;
  bottom: 0px;
  left: 0px;
  width: 126px;
  height: 82px;
  background-image: url("../assets/list_icon_label.png");
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: 0 100%;
}
.tap .tap_img .top_dec {
  font-size: 19px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  margin: 13px 0 5px 5px;
}
.bottom_price {
  height: 25px;
  font-size: 28px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(255, 255, 255, 1);
  line-height: 25px;
  margin-left: 5px;
}
.tap .tap_img img {
  display: block;
  width: 100%;
  height: 100%;
}
.content-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 30px;
  line-height: 28px;
  height: 28px;
  margin: 18px 0 15px 0;
}
.content-title-normal {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  font-size: 30px;
  box-sizing: border-box;
  padding: 0 0.1rem;
}
</style>
<style>
.van-toast--html,
.van-toast--text {
  width: 70%;
  height: 1.3rem;
  font-size: 30px !important;
}
</style>
