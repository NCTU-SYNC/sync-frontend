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
        <b-row
          v-for="(article, index) in articleList"
          :key="index"
        >
          <ArticleCell
            :title="article.title"
            :last-modified-time="article.lastModifiedTime"
            :editors-count="article.editorsCount"
            :tags="article.tags"
          />
        </b-row>
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
      articleList: [{
        title: '川普染疫',
        lastModifiedTime: '10/14  17:35',
        editorsCount: 11,
        tags: ['美國大選', '川普', '新冠肺炎']
      }, {
        title: '拜登發表談話',
        lastModifiedTime: '10/14  17:23',
        editorsCount: 33,
        tags: ['美國大選', '川普', '拜登']
      }, {
        title: '川普指控選舉舞弊',
        lastModifiedTime: '11/7  14:20',
        editorsCount: 1,
        tags: ['美國大選', '川普', '拜登', '密西根']
      }, {
        title: 'empty',
        lastModifiedTime: '??/??  17:35',
        editorsCount: 0,
        tags: []
      }]
    }
  }
}
</script>

<style scoped lang="scss">
</style>
