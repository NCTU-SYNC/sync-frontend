import Vue from 'vue'
import Router from 'vue-router'
import { getToken } from '@/utils/auth'

Vue.use(Router)

const isLogin = () => {
  return !!getToken()
}

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/new/Home')
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/new/Login'),
      hidden: true
    },
    {
      path: '/search',
      name: 'Search',
      component: () => import('@/views/new/Search')
    },
    {
      path: '/signup',
      name: 'SignUp',
      component: () => import('@/views/new/SignUp'),
      hidden: true
    },
    {
      path: '/article/:ArticleID',
      name: 'Article',
      component: () => import('@/views/new/Article')
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('@/views/new/Profile'),
      beforeEnter: (to, from, next) => {
        isLogin() ? next() : next('/login')
      }
    },
    {
      path: '/article/:ArticleID/post',
      component: () => import('@/views/new/Post'),
      beforeEnter: (to, from, next) => {
        isLogin() ? next() : next('/login')
      }
    },
    {
      path: '/revision/:BlockID/',
      component: () => import('@/views/new/Revision')
    },
    {
      path: '/post',
      name: 'Post',
      component: () => import('@/views/new/Post'),
      beforeEnter: (to, from, next) => {
        isLogin() ? next() : next('/login')
      }
    },
    {
      path: '/NewsPanel',
      name: 'NewsPanel',
      component: () => import('@/views/NewsPanel')
    },
    {
      path: '/history/:ArticleID/',
      name: 'History',
      component: () => import('@/views/History')
    },
    {
      path: '/edit_comparison',
      name: 'EditComparison',
      component: () => import('@/views/EditComparison')
    }
  ]
})
