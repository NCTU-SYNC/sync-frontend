<template>
  <b-container>
    <b-row>
      <b-col>
        <b-breadcrumb :items="breadcrumbItems" class="bg-transparent" />
      </b-col>
    </b-row>
    <b-row>
      <b-col class="text-center">
        <h4>拜登就職演說</h4>
      </b-col>
    </b-row>
    <b-row class="mt-3 pb-2">
      <b-col class="d-flex justify-content-center align-items-center">
        <div>
          <b-button variant="link">
            <b-icon icon="chevron-left" />
            上一版
          </b-button>
          <span> &nbsp; | &nbsp;</span>
          <b-button variant="link">
            下一版
            <b-icon icon="chevron-right" />
          </b-button>
        </div>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="6"><comparison-block :version-index="1" /></b-col>
      <b-col cols="6"><comparison-block :version-index="0" /></b-col>
    </b-row>
  </b-container>
</template>

<script>
import ComparisonBlock from '@/components/ComparisonBlock'
export default {
  components: {
    ComparisonBlock
  },
  data() {
    return {
      breadcrumbItems: [
        {
          text: '拜登就職演說',
          href: '#'
        },
        {
          text: '編輯紀錄'
        },
        {
          text: '版本比較',
          active: true
        }
      ]
    }
  },
  methods: {

  }
}
</script>
<style lang="scss" scoped>

</style>

<style lang="scss">

</style>
