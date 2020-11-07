<template>
  <b-container fluid>
    <b-row>
      <b-col cols="3">
        <b-row class="mb-5">
          <UserInfo />
        </b-row>
        <b-row class="mt-5">
          <ButtonStack />
        </b-row>
      </b-col>
      <b-col cols="9">
        <ArticleCell />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import ArticleCell from '@/components/new/Profile/ArticleCell'
import UserInfo from '@/components/new/Profile/UserInfo'
import ButtonStack from '@/components/new/Profile/ButtonStack'
export default {
  name: 'Profile',
  components: { ArticleCell, UserInfo, ButtonStack },
  data () {
    return {

    }
  }
}
</script>

<style scoped lang="scss">
</style>
