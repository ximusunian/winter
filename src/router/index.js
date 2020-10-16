/*
 * @Description: 
 * @version: 
 * @Author: ximusunian
 * @Date: 2020-10-16 14:01:52
 * @LastEditors: ximusunian
 * @LastEditTime: 2020-10-16 14:09:14
 */
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'otherWinter',
      meta: {
        title: "冬季新品首发专场-暖冬首选单品"
    },
      component:resolve=>require(['@/components/otherWinter'],resolve)
  }
  ]
})
