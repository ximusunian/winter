import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'otherWinter',
      meta: {
        title: "冬季拿货节-双十翻牌赢实物大奖"
    },
      component:resolve=>require(['@/components/otherWinter'],resolve)
  }
  ]
})
