<template>
  <div id="app">
    <b-navbar toggleable="lg" type="light" variant="faded">
      <b-navbar-brand id="brand" href="/">SYNC</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse" />

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item href="#">Link</b-nav-item>
          <b-nav-item href="#" disabled>Disabled</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-form>
            <b-form-input size="sm" class="mr-sm-2" placeholder="Search" />
            <b-button
              size="sm"
              class="my-2 my-sm-0"
              type="submit"
            >Search</b-button>
          </b-nav-form>

          <b-nav-form @submit.prevent>
            <b-form-input v-model="mail" size="sm" class="mr-sm-2" placeholder="信箱" />
            <b-form-input v-model="password" size="sm" class="mr-sm-2" placeholder="密碼" />
            <b-button
              size="sm"
              class="my-2 my-sm-0"
              type="submit"
              @click="handleSignup"
            >註冊</b-button>
            <b-button
              size="sm"
              class="my-2 my-sm-0"
              type="submit"
              @click="handleLogin"
            >登入</b-button>
          </b-nav-form>

          <b-nav-item-dropdown text="Lang" right>
            <b-dropdown-item href="#">EN</b-dropdown-item>
            <b-dropdown-item href="#">ES</b-dropdown-item>
            <b-dropdown-item href="#">RU</b-dropdown-item>
            <b-dropdown-item href="#">FA</b-dropdown-item>
          </b-nav-item-dropdown>

          <b-nav-item-dropdown right>
            <!-- Using 'button-content' slot -->
            <template v-slot:button-content>
              <em>User</em>
            </template>
            <b-dropdown-item href="#">Profile</b-dropdown-item>
            <b-dropdown-item href="#">Sign Out</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      mail: '',
      password: ''
    }
  },
  methods: {
    handleSignup: function() {
      console.log(this.mail)
      console.log(this.password)
    },
    handleLogin: function() {
      console.log(this.mail)
      console.log(this.password)
    }
  }
}
</script>

<style scoped>
#brand {
  color: #ff7865;
}
</style>
