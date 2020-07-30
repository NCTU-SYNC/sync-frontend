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
      component: () => import('@/views/Auth')
    },
    {
      path: '/signup',
      name: 'SignUp',
      component: () => import('@/views/SignUp')
    },
    {
      path: '/article/:ArticleID',
      name: 'Article',
      component: () => import('@/views/Article')
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('@/views/Profile')
    },
    {
      path: '/oldArticle',
      name: 'OldArticle',
      component: () => import('@/views/OldArticle')
    },
    {
      path: '/article/:ArticleID/Post',
      component: () => import('@/views/Post1')
    },
    {
      path: '/post',
      name: 'Post',
      component: () => import('@/views/Post1')
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
