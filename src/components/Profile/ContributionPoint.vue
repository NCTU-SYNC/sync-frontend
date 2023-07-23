<template>
  <div class="d-flex flex-column">
    <div class="section">
      <h5>貢獻值</h5>
      <div class="d-flex align-items-center">
        <div class="contrib-icon">
          <SyncIcon icon="contrib" />
        </div>
        <div class="point">
          {{ points }}
        </div>
      </div>
    </div>
    <div class="section">
      <h4>貢獻紀錄</h4>
      <b-table
        :items="mockTableData"
        :fields="fields"
        :stacked="sm"
        borderless
        tbody-class="table-body"
        tbody-tr-class="table-row-border"
        show-empty
        :empty-text="tableEmptyText"
      >
        <template #cell(point)="data">
          <span v-html="data.value" />
        </template>
      </b-table>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    points: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      fields: [
        {
          key: 'date',
          label: '日期',
          formatter: value => new Date(value).toLocaleString()
        },
        {
          key: 'point',
          label: '點數',
          formatter: value => `${value.value} <span style="color: rgba(0, 0, 0, 0.45);"> (${value.reason}) </span>`
        },
        {
          key: 'content',
          label: '內容'
        }
      ],
      tableEmptyText: '目前沒有貢獻紀錄',
      mockTableData: [
        {
          date: Date.parse('2020/12/31 10:20'),
          point: { value: 2, reason: '編輯文章' },
          content: '快新聞／Delta肆虐「亞洲疫情捲土重來」 外媒：疫苗接種速度緩慢'
        },
        {
          date: Date.parse('2020/12/31 10:20'),
          point: { value: 3, reason: '創建新文章' },
          content: '快新聞／Delta肆虐「亞洲疫情捲土重來」 外媒：疫苗接種速度緩慢'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['windowWidth']),
    sm() {
      return this.windowWidth < 680
    }
  }
}
</script>

<style scoped lang="scss">
.section {
  display: flex;
  flex-direction: column;
  padding: 1rem 0;

  & > * {
    margin-bottom: 1rem;
  }

  & > *:last-child {
    margin-bottom: 0;
  }
}

.contrib-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 48px;
  height: 48px;
  border-radius: 0.5rem;
  color: blue;
  background-color: #EBEFFF;
  margin-right: 1rem;
}

.point {
  color: blue;
  font-size: 26px;
  font-weight: 400;
}

:deep .table-body {
  td::before {
    width: auto !important;
  }

  div {
    width: 85% !important;
  }
}

:deep .table-row-border {
  border-top: 1px solid #ccc;
}
</style>
