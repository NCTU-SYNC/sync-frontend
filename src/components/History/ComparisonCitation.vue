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
        <b-col cols="6">
          <div v-for="(citation, index) in citations[0]" :key="index">
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
        <b-col cols="6">
          <div v-for="(citation, index) in citations[1]" :key="index">
            <div class="d-flex justify-content-start align-items-center mt-2">
              <div class="citation-list-tag">
                <div class="period" :data-label="index + 1" />
              </div>
              <div class="w-100 pl-2">
                <b-link
                  class="citation-link text-primary"
                  :href="citation.url"
                  target="_blank"
                >
                  <span
                    v-for="(diff, diffIndex) in citationDiff[index].textDiff"
                    :key="diffIndex"
                    :style="getCitationStyle(diff)"
                  >
                    {{ diff[1] }}
                  </span>
                  <p
                    v-if="isUrlChanged(citationDiff[index].urlDiff)"
                  >
                    <span :style="getCitationStyle(null, -1)">舊連結：{{ citations[0][index] ? citations[0][index].url: '' }}</span>
                  </p>
                  <p
                    v-if="isUrlChanged(citationDiff[index].urlDiff)"
                  >
                    <span :style="getCitationStyle(null, 1)">新連結：{{ citation.url }}</span>
                  </p>
                </b-link>
              </div>
            </div>
          </div>
        </b-col>
      </b-row>
    </b-col>
  </b-row>
</template>

<script>
import DiffMatchPatch from 'diff-match-patch'

export default {
  name: 'ComparisonCitation',
  props: {
    citations: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      citationDiff: []
    }
  },
  created() {
    const [baseCitations, compareCitations] = this.citations
    const maxLength = compareCitations.length >= baseCitations.length ? compareCitations.length : baseCitations.length

    for (let i = 0; i < maxLength; i++) {
      const base = baseCitations[i]
      const compare = compareCitations[i]
      this.compareCitation(base, compare)
    }
  },
  methods: {
    compareCitation(base, compare) {
      const dmp = new DiffMatchPatch()
      if (!base) {
        base = {
          title: '',
          url: ''
        }
      }
      if (!compare) {
        compare = {
          title: '',
          url: ''
        }
      }
      const textDiff = dmp.diff_main(base.title, compare.title)
      const urlDiff = dmp.diff_main(base.url, compare.url)
      dmp.diff_cleanupSemantic(textDiff)
      dmp.diff_cleanupSemantic(urlDiff)
      this.citationDiff.push({ textDiff, urlDiff })
    },
    getCitationStyle(diff, setResult) {
      let result = diff ? diff[0] : null
      if (setResult !== undefined) {
        result = setResult
      }
      switch (result) {
        case -1:
          return {
            backgroundColor: 'rgba(255, 79, 79, 0.3)',
            textDecoration: 'line-through'
          }
        case 1:
          return {
            backgroundColor: 'rgba(26, 225, 91, 0.3)',
            textDecoration: 'none'
          }
        case 0:
        default:
          return {
            backgroundColor: 'none',
            textDecoration: 'none'
          }
      }
    },
    isUrlChanged(urlDiff) {
      console.log(urlDiff)
      return urlDiff.some(u => u[0] !== 0 && u !== undefined)
    }
  }
}
</script>

<style lang="scss" scoped>
.divider {
  > div:first-child {
    border-right: 2px solid #E6E6E6;
  }
  > div:last-child {
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

.citation-link {
  p {
    margin: 0;
  }
}
</style>
