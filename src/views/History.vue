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
    <b-row>
      <b-col class="d-flex justify-content-end align-items-center">
        每頁顯示：
        <b-dropdown text="30" class="m-2" variant="transparent">
          <b-dropdown-item-button active>30</b-dropdown-item-button>
          <b-dropdown-item-button>50</b-dropdown-item-button>
          <b-dropdown-item-button disabled>100</b-dropdown-item-button>
        </b-dropdown>
        <div class="h-100 d-flex align-items-center">
          <span class="ml-3">1-30</span>
          <span class="ml-1">|</span>
          <span class="ml-1"> 共有41個版本</span>
        </div>

        <div>
          <b-button variant="link">
            <b-icon icon="chevron-left" />
          </b-button>
          <span>|</span>
          <b-button variant="link">
            <b-icon icon="chevron-right" />
          </b-button>
        </div>

      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-table hover :items="tableItems" :fields="tableFields" :tbody-tr-class="rowClass" table-class="table-class" thead-class="font-weight-normal" stacked="md">
          <template #cell(actions)="data">
            <div v-if="typeof data.value === 'string'" class="no-headers">
              <span>{{ data.value }}</span>
            </div>
            <div v-else>
              <b-link>最新</b-link> | <b-link>前一版</b-link>
            </div>
          </template>
          <template #cell(editTextCounts)="data">
            <span v-if="data.value[0]" class="bg-success px-2 py-1 m-2">{{ data.value[0] }}</span>
            <span v-if="data.value[1]" class="bg-danger px-2 py-1 m-2">{{ data.value[1] }}</span>
          </template>
        </b-table>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      breadcrumbItems: [
        {
          text: '拜登就職演說',
          href: '#'
        },
        {
          text: '編輯紀錄',
          active: true
        }
      ],
      tableFields: [
        {
          key: 'actions',
          label: '比較',
          thClass: 'font-weight-normal'
        },
        {
          key: 'date',
          label: '版本日期',
          thClass: 'font-weight-normal',
          sortable: false
        },
        {
          key: 'author',
          label: '編輯者',
          thClass: 'font-weight-normal'
        },
        {
          key: 'editTextCounts',
          label: '編輯更動字數',
          thClass: 'font-weight-normal'
        }
      ],
      tableItems: [
        { actions: '2020/12' },
        { actions: { previous: '1', current: '2' }, author: 'armuro', date: '2020/12/31 10:20（最新版）', editTextCounts: [31, -16] },
        { actions: { previous: '1', current: '2' }, author: 'Jin An', date: '2020/12/29 20:16', editTextCounts: [30, 0] },
        { actions: { previous: '1', current: '2' }, author: 'Shang', date: '2020/12/12 06:16', editTextCounts: [0, 20] },
        { actions: { previous: '1', current: '2' }, author: 'Test', date: '2020/12/1 13:16', editTextCounts: [20, -20] }
      ]
    }
  },
  methods: {
    rowClass(item, type) {
      if (!item || type !== 'row') return
      if (typeof item.actions === 'string') return 'd-none d-md-table-row'
    }
  }
}
</script>
<style lang="scss" scoped>

</style>

<style lang="scss">
.table-class {
  border: none !important;
}

.font-weight-normal {
  font-weight: normal !important;
  border-top: none !important;
}
</style>
