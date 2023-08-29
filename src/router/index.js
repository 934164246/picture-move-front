import Vue from 'vue'
//1.导⼊
import Router from 'vue-router'
import PictureMove from '@/views/PictureMove.vue'

//2.模块化机制 使⽤Router
Vue.use(Router)
//3.创建路由器对象
const router = new Router({
  mode: 'history', 
  routes:[{
    path: "/picture",
    name: "PictureMove",
    component: PictureMove
  }]
})
export default router;