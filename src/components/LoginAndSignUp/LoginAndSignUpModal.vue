<template>
  <b-modal
    visible
    hide-header
    hide-footer
    body-class="p-0"
    content-class="modal"
  >
    <Login v-if="showLoginModal" @show-sign-up="showLoginModal = false" />
    <SignUp v-else @show-login="showLoginModal = true" />
  </b-modal>
</template>

<script>
import Login from '@/components/LoginAndSignUp/Login.vue'
import SignUp from '@/components/LoginAndSignUp/SignUp.vue'

export default {
  name: 'LoginAndSignUpModal',
  components: {
    Login, SignUp
  },
  props: {
    isLogin: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      showLoginModal: this.isLogin
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

::v-deep .modal {
  height: 720px;
  width: 960px;
  top: calc(50% - 720px / 2);
  left: calc(50% - 960px / 2);
  overflow: hidden;
  box-shadow: 0px 4px 25px rgba(0, 0, 0, 0.15);
  border-radius: 16px;
}
</style>
