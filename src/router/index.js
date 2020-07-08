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
      path: '/article/:ArticleID',
      name: 'Article',
      component: () => import('@/views/article')
    },
    {
      path: '/article/:ArticleID/post',
      name: 'Post',
      component: () => import('@/views/post')
    },
    {
      path: '/test',
      name: 'HandCodedEditPage',
      component: () => import('@/views/HandCodedEditPage')
    },
    {
      path: '/tiptap',
      name: 'EditPage',
      component: () => import('@/views/EditPage')
    },
    {
      path: '/NewsPanel',
      name: 'NewsPanel',
      component: () => import('@/views/NewsPanel')
    }
  ]
})
