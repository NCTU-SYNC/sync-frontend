import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/home')
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/login')
    },
    {
      path: '/article/:ArticleID',
      name: 'Article',
      component: () => import('@/views/article')
    },
    {
      path: '/article/:ArticleID/post',
      name: 'Post',
      component: () => import('@/views/post')
    }
  ]
})
