<template>
  <b-row>
    <b-col>
      <div class="p-3 border-bottom">
        <div>
          <p class="text-gray">Category</p>
          <h3>Title</h3>
          <p>Outline</p>
        </div>
        <div class="d-flex justify-content-start align-items-center">
          <div class="mr-2">
            <b-icon icon="clock" />
            最後更新時間
          </div>
          <div>
            <b-icon icon="eye" />
            100 次觀看
          </div>
        </div>
      </div>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: 'ArticleListItem'
}
</script>

<style>

</style>
