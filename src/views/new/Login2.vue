<template>
  <b-modal v-model="modalShow" hide-footer>
    <div
      class="row row-cols-2"
      style="position: absolute; left: 0; top: 0; right: 0; bottom: 0"
    >
      <div class="col left-modal">
        <div class="Frame-514">
          <div class="LOGO">
            <link
              rel="stylesheet"
              type="text/css"
              href="http://fonts.googleapis.com/css?family=Ubuntu:regular,bold&subset=Latin"
            />
            <icon icon="logo" class="logo" style="height: 80px" />
            <p class="sync-title">SYNC</p>
          </div>
          <div class="Frame-511 Frame-text">
            <icon icon="vector" class="icon" style="width: 14px" />
            <p class="text1">一個匯集資訊的同步協作平台</p>
          </div>
          <div class="Frame-512 Frame-text">
            <icon icon="vector" class="icon" style="width: 14px" />
            <p class="text2">新聞的多元觀點與客觀事實</p>
          </div>
          <div class="Frame-513 Frame-text">
            <icon icon="vector" class="icon" style="width: 15px" />
            <p class="text3">共同編輯新聞系統</p>
          </div>
        </div>
      </div>
      <div class="col right-modal">
        <p>登入曲</p>
      </div>
    </div>
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
      icons: ['vector-icon.svg', 'logo-icon.svg']
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

<style>
@media screen and (min-width: 0px) {
  .modal-dialog {
    max-width: 960px;
    top: 90px;
  }
}

.modal-content {
  border-radius: 3%;
}
.left-modal {
  border-top-left-radius: 3%;
  border-bottom-left-radius: 3%;
  background: linear-gradient(180deg, #03081a 0%, #0a194d 100%);
}
.right-modal {
  border-top-right-radius: 3%;
  border-bottom-right-radius: 3%;
}
.modal-header {
  border-bottom: 0 none;
  display: none;
}
.modal-body {
  height: 720px;
}
.Frame-514 {
  position: absolute;
  width: 287.78px;
  height: 274px;
  left: 64px;
  top: calc(50% - 274px / 2);
  color: #ffffff;
}

.Frame-511 {
  width: 287.78px;
  top: 144px;
}
.Frame-512 {
  width: 271.77px;
  top: 194px;
}
.Frame-513 {
  width: 191.78px;
  top: 244px;
}
.Frame-text {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: absolute;
  height: 30px;
  left: 0px;
}
.text1 {
  position: static;
  width: 258px;
  height: 30px;
  padding: 10px;
  /* Large Body / 18px - Medium */
  font-family: 'Noto Sans CJK TC';
  font-style: normal;
  /* identical to box height, or 167% */
  display: flex;
  align-items: center;
  letter-spacing: 2px;

  /* Gray/N_White */
  color: #ffffff;

  /* Inside auto layout */

  margin: 8px;
}
.text2 {
  position: static;
  width: 238px;
  height: 30px;
  left: 0;
  /* Large Body / 18px - Medium */
  font-family: 'Noto Sans CJK TC';
  font-style: normal;
  /* identical to box height, or 167% */
  display: flex;
  align-items: center;
  padding: 8px;
  letter-spacing: 2px;
  /* Gray/N_White */
  color: #ffffff;
  /* Inside auto layout */

  margin: 10px;
}
.text3 {
  position: static;
  width: 158px;
  height: 30px;
  padding: 7px;
  /* Large Body / 18px - Medium */
  font-family: 'Noto Sans CJK TC';
  font-style: normal;

  /* identical to box height, or 167% */
  display: flex;
  align-items: center;
  letter-spacing: 2px;

  /* Gray/N_White */
  color: #ffffff;

  /* Inside auto layout */
  flex: none;
  order: 1;
  flex-grow: 0;
  margin: 10px;
}
.LOGO {
  position: absolute;
  width: 201.85px;
  height: 64px;
  left: calc(50% - 201.85px / 2 - 42.96px);
  top: calc(50% - 64px / 2 - 105px);
}
.sync-title {
  position: absolute;
  left: 27.9%;
  right: 0.84%;
  top: 24.04%;
  bottom: 20.67%;
  letter-spacing: 9px;
  font-weight: normal;
  font-family: 'Ubuntu';
  font-size: 1.2cm;
  /* Gray/N_White */
  color: #ffffff;
}
</style>
