import Vue from 'vue'
import Router from 'vue-router'
import FirebaseAuthInstance from '@/utils/firebase.js'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'newHome',
      component: () => import('@/views/Home')
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/components/NavBar/NavBar'),
      props: { modalShow: true, modalType: 'login' }
    },
    {
      path: '/search',
      name: 'Search',
      component: () => import('@/views/new/Search'),
      props: (route) => ({ query: route.query })
    },
    {
      path: '/signup',
      name: 'SignUp',
      component: () => import('@/components/NavBar/NavBar.vue'),
      props: { modalShow: true, modalType: 'signup' }
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
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/article/:ArticleID/post',
      component: () => import('@/views/new/Post'),
      meta: {
        requiresAuth: true
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
      meta: {
        requiresAuth: true
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
    },
    {
      path: '/hashtag',
      name: 'Hashtag',
      component: () => import('@/views/new/Hashtag')
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return new Promise((res) => {
        setTimeout(() => {
          res({
            selector: to.hash,
            offset: { x: 0, y: 72 },
            behavior: 'smooth'
          })
        }, 100)
      })
    }

    return { x: 0, y: 0 }
  }
})

router.beforeEach(async(to, from, next) => {
  if (to.meta.requiresAuth && !await FirebaseAuthInstance.getCurrentUser()) {
    next('/login')
    return
  }

  next()
})

export default router
