<template>
  <b-container fluid class="h-100 p-0">
    <b-row class="h-100" style="padding: 0 15px 0">
      <b-col
        class="left-modal d-flex justify-content-center align-items-center"
      >
        <div class="sync-logo d-flex align-items-center">
          <icon icon="white-logo" style="height: 40px" />
          <strong class="title"> SYNC </strong>
        </div>
        <div class="slogan d-flex flex-column justify-content-center">
          <div class="d-flex justify-content-start">
            <icon icon="vector2" style="height: 40px" />
          </div>
          <div class="w-100 d-flex flex-column align-items-center">
            <p>一個匯集資訊的同步協作平台，與他</p>
            <p>人合作還原事件脈絡，讓所有人都能</p>
            <p>從眾人提供的整合資訊中汲取所需。</p>
          </div>
          <div class="d-flex justify-content-end">
            <icon
              icon="vector2"
              style="height: 40px; transform: matrix(-1, 0, 0, -1, 0, 0)"
            />
          </div>
        </div>
      </b-col>

      <b-col class="right-modal">
        <b-button-close
          style="margin: 1rem; position: absolute; top: 0; right: 0"
          @click="$router.back()"
        />
        <div class="content d-flex flex-column align-items-center">
          <h3>註冊帳號</h3>
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
          <b-form class="w-100" @submit="handleSignUp">
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
                :placeholder="info.placeholder"
                required
                trim
              />
            </b-form-group>
            <div class="w-100">
              <b-form-checkbox size="md" class="confirm-button">
                我已閱讀並同意遵守 SYNC
                <b-link
                  style="color: #2353ff"
                  @click.prevent="showTermsOfService = !showTermsOfService"
                >
                  服務條款
                </b-link>
                與
                <b-link
                  style="color: #2353ff"
                  @click.prevent="showPrivacyPolicy = !showPrivacyPolicy"
                >
                  隱私權政策
                </b-link>
              </b-form-checkbox>
            </div>
            <b-button type="submit" block style="background: #2353ff">
              註冊帳號
            </b-button>
          </b-form>
          <div class="option w-100 d-flex justify-content-center">
            <b-link
              style="font-size: 14px; color: #2353ff"
              @click="$emit('showLogin')"
            >
              以現有帳號登入
            </b-link>
          </div>
        </div>
      </b-col>
    </b-row>
    <TermsOfServiceModal v-if="showTermsOfService" />
    <PrivacyPolicyModal v-if="showPrivacyPolicy" />
  </b-container>
</template>

<script>
import firebase from '@/utils/firebase'
import PrivacyPolicyModal from '@/components/Account/PrivacyPolicyModal.vue'
import TermsOfServiceModal from '@/components/Account/TermsOfServiceModal.vue'

export default {
  name: 'SignUp',
  components: {
    PrivacyPolicyModal,
    TermsOfServiceModal
  },
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
          name: '使用者名稱',
          placeholder: '使用者名稱，平台顯示名稱',
          data: ''
        },
        {
          type: 'text',
          name: '帳號/Email',
          placeholder: '帳號/Email，有效的Email登入使用',
          data: ''
        },
        {
          type: 'password',
          name: '密碼',
          placeholder: '密碼，至少六位數的英文與數字組合',
          data: ''
        }
      ],
      showPrivacyPolicy: false,
      showTermsOfService: false
    }
  },
  computed: {
    userName: function() {
      return this.loginInfos[0].data
    },
    accountOrEmail: function() {
      return this.loginInfos[1].data
    },
    password: function() {
      return this.loginInfos[2].data
    }
  },
  methods: {
    async handleSignUp() {
      try {
        await firebase.handleSignup(this.email, this.password, this.userName)
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
      console.log(`login with ${target}`)
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

@media screen and (min-width: 0px) {
  .modal-dialog {
    max-width: 960px;
    top: 90px;
  }
}
.left-modal {
  background-image: url("~@/assets/images/SignUpModalBG.png");
  background-position: center;
  background-size: cover;

  .sync-logo {
    position: absolute;
    top: 0;
    left: 0;
    margin: 2.5rem;

    strong.title {
      font-size: xx-large;
      letter-spacing: 5px;
      color: white;
      margin: 0 0 0 10px;
      user-select: none;
    }
  }

  .slogan {
    width: 400px;

    p {
      margin: 0;
      font-size: 18px;
      font-weight: 500;
      line-height: 30px;
      letter-spacing: 2px;
      color: #212124;
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

    .confirm-button {
      font-size: 12px;
      line-height: 24px;
      margin: 28px 0 0;
    }
  }
}
</style>
