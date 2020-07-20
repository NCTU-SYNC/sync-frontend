<template>
  <b-container>
    <b-row
      align-h="center"
      class="mt-5"
    >
      <b-col xl="5" lg="6" md="8" sm="10" cols="10">
        <b-card class="p-3">
          <div><h1 class="title text-center">SYNC</h1>
            <p class="text-center">同步新聞資訊</p></div>
          <div v-if="isInChooseMethod"><br>
            <b-button block pill variant="primary" class="mt-3">註冊帳號</b-button>
            <b-button block pill variant="light" class="mt-3" @click="isInChooseMethod=false">登入</b-button>
            <p class="text-center mt-3">或以其他方式登入</p>
            <b-button block pill variant="dark" class="mt-3">Google</b-button>
          </div>
          <div v-else>
            <b-form
              v-if="show"
              @submit="onSubmit"
              @reset="onReset"
            >
              <b-form-group
                id="login-input-email"
                label-for="email"
              >
                <b-form-input
                  id="email"
                  v-model="form.id"
                  required
                  placeholder="電子郵件 Email"
                />
              </b-form-group>

              <b-form-group
                id="login-input-password"
                label-for="password"
              >
                <b-form-input
                  id="password"
                  v-model="form.password"
                  type="password"
                  required
                  placeholder="請輸入密碼"
                />
              </b-form-group>

              <b-form-group id="input-group-4">
                <b-form-checkbox-group
                  id="checkboxes-4"
                  v-model="form.checked"
                />
              </b-form-group>
              <b-button
                type="submit"
                variant="primary"
                pill
                block
              >登入</b-button>
              <div class="d-flex justify-content-end">
                <b-link style="">忘記密碼</b-link>
              </div>
              <hr>
              <b-button block pill variant="dark">以 Google 繼續</b-button>
            </b-form>
          </div>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      isInChooseMethod: true,
      form: {
        id: '',
        password: ''
      },
      show: true
    }
  },
  methods: {
    onSubmit(evt) {
      evt.preventDefault()
      this.$store.dispatch('user/login', this.form).then(() => {
        this.$router.push({ path: this.redirect || '/' })
      }).catch(() => {
        this.$bvModal.msgBoxOk('帳號或密碼錯誤')
      })
    },
    onReset(evt) {
      evt.preventDefault()
      // Reset our form values
      this.form.id = ''
      this.form.password = ''
      // Trick to reset/clear native browser form validation state
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
    }
  }
}
</script>

<style scoped>
.title {
  color: #ff7865;
  text-shadow: 1px 2px 3px #666;
}
.text-center {
  text-align:center;
}
</style>
