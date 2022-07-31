<template>
  <b-modal
    visible
    hide-header
    hide-footer
    body-class="p-0"
    content-class="modal"
  >
    <b-container fluid class="h-100 p-0">
      <b-row class="h-100" style="padding: 0 15px 0">
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
                  <div class="slogan">{{ slogan }}</div>
                </li>
              </ui>
            </div>
          </div>
        </b-col>

        <b-col class="right-modal">
          <b-button-close
            style="margin: 1rem; position: absolute; top: 0; right: 0"
            @click="$router.back()"
          />
          <div class="content d-flex flex-column align-items-center">
            <h3>登入</h3>
            <b-button
              v-for="login in thirdPartyLogins"
              :key="login"
              variant="light"
              class="d-flex align-items-center"
              block
              @click="handleThirdPartyLogin(login.name)"
            >
              <img :src="login.icon">
              <div>{{ login.name }} 註冊/登入</div>
            </b-button>
            <div class="split-line w-100 d-flex align-items-center">或</div>
            <b-form class="w-100" @submit="handleLogin">
              <b-form-group
                v-for="(info, index) in loginInfos"
                :key="index"
                :label="info.name"
                :label-for="info.name"
                label-class="form-label"
                class="form w-100"
              >
                <b-form-input
                  :id="info.name"
                  v-model="info.data"
                  :type="info.type"
                  :placeholder="info.name"
                  required
                  trim
                />
              </b-form-group>
              <div class="w-100">
                <b-form-checkbox size="sm" class="keep-login-button">
                  保持登入狀態
                </b-form-checkbox>
              </div>
              <b-button type="submit" block style="background: #2353ff">
                登入
              </b-button>
            </b-form>
            <div class="option w-100 d-flex justify-content-between">
              <b-link style="font-size: 14px; color: black"> 忘記密碼？ </b-link>
              <b-link
                style="font-size: 14px; color: #2353ff"
                :to="{ name: 'SignUp' }"
              >
                註冊新帳號
              </b-link>
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
  name: 'Login',
  data() {
    return {
      slogans: [
        '一個匯集資訊的同步協作平台',
        '新聞的多元觀點與客觀事實',
        '共同編輯新聞系統'
      ],
      thirdPartyLogins: [
        // {
        //   name: 'Facebook',
        //   icon: 'https://img.icons8.com/color/24/000000/facebook-new.png'
        // },
        {
          name: 'Google',
          icon: 'https://img.icons8.com/color/24/000000/google-logo.png'
        }
      ],
      loginInfos: [
        {
          type: 'text',
          name: '帳號/Email',
          data: ''
        },
        {
          type: 'password',
          name: '密碼',
          data: ''
        }
      ]
    }
  },
  computed: {
    accountOrEmail: function() {
      return this.loginInfos[0].data
    },
    password: function() {
      return this.loginInfos[1].data
    }
  },
  methods: {
    async handleLogin() {
      try {
        await firebase.handleLogin(this.accountOrEmail, this.password)
        this.$router.back()
      } catch (error) {
        this.loginInfos.forEach((info) => {
          info.data = ''
        })
        console.error(error)
        this.$bvModal.msgBoxOk(error.message)
      }
    },
    thirdPartyLoginFunc(target) {
      switch (target) {
        // case 'Facebook':
        //   return firebase.loginWithFacebook
        case 'Google':
          return firebase.loginWithGoogle
      }
    },
    async handleThirdPartyLogin(target) {
      const loginFunc = this.thirdPartyLoginFunc(target)
      try {
        await loginFunc()
        this.$router.back()
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

::v-deep .modal {
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
        margin: 20px 0;
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

      .form {
        margin: 12px 0;

        .form-label {
          font-size: 14px;
          line-height: 24px;
        }

        .form-control {
          border: 1px solid #ced4da !important;

          &:focus {
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