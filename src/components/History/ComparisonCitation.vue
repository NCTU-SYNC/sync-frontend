<template>
  <b-row class="mt-3">
    <b-col>
      <b-row class="divider">
        <b-col>
          <div class="w-100 border-top mb-2" />
          <h3>新聞來源</h3>
        </b-col>
        <b-col>
          <div class="w-100 border-top mb-2" />
          <h3>新聞來源</h3>
        </b-col>
      </b-row>
      <b-row class="divider">
        <b-col>
          <div v-for="(citation, index) in citations" :key="index">
            <div class="d-flex justify-content-start align-items-center mt-2">
              <div class="citation-list-tag">
                <div class="period" :data-label="index + 1" />
              </div>
              <div class="w-100 pl-2 ">
                <b-link class="text-primary" :href="citation.url" target="_blank">{{ citation.title }}</b-link>
              </div>
            </div>
          </div>
        </b-col>
        <b-col>
          <div v-for="(citation, index) in citations" :key="index">
            <div class="d-flex justify-content-start align-items-center mt-2">
              <div class="citation-list-tag">
                <div class="period" :data-label="index + 1" />
              </div>
              <div class="w-100 pl-2 ">
                <b-link class="text-primary" :href="citation.url" target="_blank">{{ citation.title }}</b-link>
              </div>
            </div>
          </div>
        </b-col>
      </b-row>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: 'ComparisonCitation',
  props: {
    citations: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style lang="scss" scoped>
.divider {
  div:first-child {
    border-right: 2px solid #E6E6E6;
  }
  div:last-child {
    border-left: 2px solid #E6E6E6;
  }
}

.citation-list-tag {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  width: 2rem;
  height: 2rem;
  border: 1px solid #939393;
}

.period {
  &:before {
    content: attr(data-label);
    color: #939393;
    width: 2rem;
  }
}
</style>
