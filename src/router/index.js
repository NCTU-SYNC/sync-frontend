import Vue from 'vue'
import Router from 'vue-router'
import FirebaseAuthInstance from '@/utils/firebase.js'

Vue.use(Router)

const isLogin = () => {
  return FirebaseAuthInstance.isLogin
}

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
      component: () => import('@/views/new/Login'),
      hidden: true
    },
    {
      path: '/login2',
      name: 'Login2',
      component: () => import('@/views/new/Login2'),
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
      component: () => import('@/views/Article')
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('@/views/Profile'),
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
      path: '/history/:ArticleID',
      name: 'History',
      component: () => import('@/views/History')
    },
    {
      path: '/compare/:ArticleID',
      name: 'EditComparison',
      component: () => import('@/views/EditComparison')
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})
