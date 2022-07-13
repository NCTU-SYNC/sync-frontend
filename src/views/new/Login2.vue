<template>
  <b-modal
    v-model="modalShow"
    hide-header
    hide-footer
    body-class="p-0"
    content-class="login-modal"
  >
    <b-container fluid class="h-100 p-0">
      <b-row class="h-100" style="padding: 0 15px 0;">
        <b-col class="left-modal">
          <div class="content d-flex flex-column justify-content-between">
            <div class="d-flex align-items-center">
              <icon icon="logo" style="height: 80px" />
              <strong class="title"> SYNC </strong>
            </div>
            <div style="height: 120px">
              <ui class="h-100 d-flex flex-column justify-content-between">
                <li
                  v-for="slogan in slogans"
                  :key="slogan"
                  class="d-flex align-items-center"
                >
                  <icon icon="vector" style="height: 10px" />
                  <div class="slogan"> {{ slogan }} </div>
                </li>
              </ui>
            </div>
          </div>
        </b-col>

        <b-col class="right-modal">
          <b-button-close
            style="margin: 1rem; position: absolute; top: 0; right: 0"
            @click="modalShow = false"
          />
          <div class="content d-flex flex-column align-items-center">
            <h3> 登入 </h3>
            <b-button
              v-for="login in thirdPartyLogins"
              :key="login"
              block
              variant="light"
              class="d-flex align-items-center"
            >
              <img :src="login.icon">
              <div> {{ login.name }} 註冊/登入 </div>
            </b-button>
            <div class="split-line w-100 d-flex align-items-center"> 或 </div>
            <b-form-group
              v-for="(info, index) in loginInfos"
              :key="index"
              :label="info.name"
              :label-for="`${info.name}-id`"
              label-class="form-label"
              class="form w-100"
            >
              <b-form-input
                :id="`${info.name}-id`"
                required
                trim
                :type="info.type"
                :placeholder="info.name"
              />
            </b-form-group>
            <div class="w-100">
              <b-form-checkbox size="sm" class="keep-login-button">
                保持登入狀態
              </b-form-checkbox>
            </div>
            <b-button block style="background: #2353FF;"> 登入 </b-button>
            <div class="option w-100 d-flex justify-content-between">
              <b-link style="color: black;"> 忘記密碼？ </b-link>
              <b-link style="color: #2353FF;"> 註冊新帳號 </b-link>
            </div>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </b-modal>
</template>

<script>
import firebase from '@/utils/firebase'
export default {
  name: 'Login2',
  data() {
    return {
      auth: null,
      isInChooseMethod: true,
      errorMessage: '',
      email: '',
      password: '',
      show: true,
      redirect: undefined,
      modalShow: true,
      icons: ['vector-icon.svg', 'logo-icon.svg'],
      slogans: [
        '一個匯集資訊的同步協作平台',
        '新聞的多元觀點與客觀事實',
        '共同編輯新聞系統'
      ],
      thirdPartyLogins: [{
        name: 'Facebook',
        icon: 'https://img.icons8.com/color/24/000000/facebook-new.png'
      }, {
        name: 'Google',
        icon: 'https://img.icons8.com/color/24/000000/google-logo.png'
      }],
      loginInfos: [{
        type: 'text',
        name: '帳號 / Email'
      }, {
        type: 'password',
        name: '密碼'
      }]
    }
  },
  watch: {
    $route: {
      handler(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    onSubmit(evt) {
      evt.preventDefault()
      this.handleLogin()
    },
    onReset(evt) {
      evt.preventDefault()
      this.email = ''
      this.password = ''
      // Trick to reset/clear native browser form validation state
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
    },
    async handleLogin() {
      try {
        await firebase.handleLogin(this.email, this.password)
        this.$router.push({ path: this.redirect || '/' })
      } catch (error) {
        console.error(error)
        this.$bvModal.msgBoxOk(error.message)
      }
    },
    async loginWithGoogle() {
      try {
        await firebase.loginWithGoogle()
        this.$router.push({ path: this.redirect || '/' })
      } catch (error) {
        console.error(error)
        this.$bvModal.msgBoxOk(error.message)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$theme-colors: () !important;

@media screen and (min-width: 0px) {
  .modal-dialog {
    max-width: 960px;
    top: 90px;
  }
}

::v-deep .login-modal {
  height: 720px;
  width: 960px;
  top: calc(50% - 720px / 2);
  left: calc(50% - 960px / 2);
  overflow: hidden;
  box-shadow: 0px 4px 25px rgba(0, 0, 0, 0.15);
  border-radius: 16px;

  .left-modal {
    background: linear-gradient(to bottom, #03081a, #0a194d);

    .content {
      position: absolute;
      height: 280px;
      width: 300px;
      top: calc(50% - 280px / 2);
      left: calc(50% - 300px / 2);

      strong.title {
        font-size: xxx-large;
        letter-spacing: 5px;
        color: white;
        margin: 0 0 0 20px;
        user-select: none;
      }

      .slogan {
        font-size: large;
        font-weight: normal;
        letter-spacing: 2px;
        color: white;
        user-select: none;
      }
    }
  }

  .right-modal {
    .content {
      position: absolute;
      width: 320px;
      top: 20px;
      left: calc(50% - 320px / 2);

      h3 {
        margin : 20px 0;
        font-weight: 700;
        font-size: 24px;
        line-height: 32px;
      }

      button {
        height: 40px;
        margin: 12px 0;
        img {
          position: absolute;
          left: auto;
        }
        div {
          font-size: 14px;
          line-height: 24px;
          margin: auto;
        }
      }

      .split-line {
        font-size: 14px;
        line-height: 24px;
        color: rgba(0, 0, 0, 0.45);

        &::before,
        &::after {
          content: "";
          flex: 1 1;
          border-bottom: 1px solid;
          color: rgba(0, 0, 0, 0.2);
        }
        &::before {
          margin-right: 16px;
        }
        &::after {
          margin-left: 16px;
        }
      }

      .form{
        margin: 12px 0;
        .form-label{
          font-size: 14px;
          line-height: 24px;
        }
        .form-control{
          border:1px solid #ced4da !important;
          &:focus{
            border-color: #80bdff !important;
            box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25) !important;
          }
        }

      }

      .keep-login-button {
        margin: 28px 0 0;
      }
    }
  }
}
</style>
