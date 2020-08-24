import Vue from 'vue'
import Router from 'vue-router'
import { getToken } from '@/utils/auth'
import Home from '@/views/Home'
import Login from '@/views/Login'
import SignUp from '@/views/SignUp'
import Article from '@/views/Article'
import Profile from '@/views/Profile'
import Post from '@/views/Post'

Vue.use(Router)

const isLogin = () => {
  return !!getToken()
}

export function createRouter () {
  return new Router({
    routes: [
      {
        path: '/',
        name: 'Home',
        component: Home
      }, {
        path: '/login',
        name: 'Login',
        component: Login,
        hidden: true
      },
      {
        path: '/signup',
        name: 'SignUp',
        component: SignUp,
        hidden: true
      },
      {
        path: '/article/:ArticleID',
        name: 'Article',
        component: Article
      },
      {
        path: '/profile',
        name: 'Profile',
        component: Profile,
        beforeEnter: (to, from, next) => {
          isLogin() ? next() : next('/login')
        }
      },
      {
        path: '/article/:ArticleID/Post',
        component: Post,
        beforeEnter: (to, from, next) => {
          isLogin() ? next() : next('/login')
        }
      },
      {
        path: '/post',
        name: 'Post',
        component: Post,
        beforeEnter: (to, from, next) => {
          isLogin() ? next() : next('/login')
        }
      }
    ]
  })
}
