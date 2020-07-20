import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/Home')
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/login')
    },
    {
      path: '/article/:ArticleID',
      name: 'Article',
      component: () => import('@/views/Article')
    },
    {
      path: '/oldArticle',
      name: 'OldArticle',
      component: () => import('@/views/OldArticle')
    },
    {
      path: '/article/:ArticleID/Post',
      component: () => import('@/views/Post')
    },
    {
      path: '/Post',
      name: 'Post',
      component: () => import('@/views/Post')
    },
    {
      path: '/test',
      name: 'HandCodedEditPage',
      component: () => import('@/views/HandCodedEditPage')
    },
    {
      path: '/NewsPanel',
      name: 'NewsPanel',
      component: () => import('@/views/NewsPanel')
    }
  ]
})
